import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

const CART_EXPIRY_HOURS = 1;

// Helper to get or create session ID from cookies
function getSessionId(request: NextRequest): string | null {
  return request.cookies.get('cart_session')?.value || null;
}

// GET /api/cart - Get current cart
export async function GET(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);

    if (!sessionId) {
      return NextResponse.json({ items: [], total: 0 });
    }

    const cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: { card: true },
          orderBy: { addedAt: 'desc' },
        },
      },
    });

    if (!cart || new Date(cart.expiresAt) < new Date()) {
      // Cart expired, clean up
      if (cart) {
        await releaseCartItems(cart.id);
      }
      return NextResponse.json({ items: [], total: 0 });
    }

    const total = cart.items.reduce((sum, item) => sum + item.card.price, 0);

    return NextResponse.json({
      id: cart.id,
      items: cart.items.map((item) => ({
        id: item.id,
        card: item.card,
        addedAt: item.addedAt,
      })),
      total,
      expiresAt: cart.expiresAt,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardId } = body;

    if (!cardId) {
      return NextResponse.json({ error: 'Card ID is required' }, { status: 400 });
    }

    // Check if card is available
    const card = await prisma.card.findUnique({ where: { id: cardId } });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    if (card.status !== 'AVAILABLE') {
      return NextResponse.json({ error: 'Card is not available' }, { status: 400 });
    }

    let sessionId = getSessionId(request);

    // Create cart if needed
    let cart;
    if (sessionId) {
      cart = await prisma.cart.findUnique({ where: { sessionId } });
    }

    if (!cart) {
      sessionId = uuidv4();
      cart = await prisma.cart.create({
        data: {
          sessionId,
          expiresAt: new Date(Date.now() + CART_EXPIRY_HOURS * 60 * 60 * 1000),
        },
      });
    }

    // Reserve the card and add to cart in a transaction
    await prisma.$transaction([
      prisma.card.update({
        where: { id: cardId },
        data: { status: 'RESERVED' },
      }),
      prisma.cartItem.create({
        data: {
          cartId: cart.id,
          cardId,
        },
      }),
      prisma.cart.update({
        where: { id: cart.id },
        data: { expiresAt: new Date(Date.now() + CART_EXPIRY_HOURS * 60 * 60 * 1000) },
      }),
    ]);

    // Fetch updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: { card: true },
          orderBy: { addedAt: 'desc' },
        },
      },
    });

    const total = updatedCart!.items.reduce((sum, item) => sum + item.card.price, 0);

    const response = NextResponse.json({
      id: updatedCart!.id,
      items: updatedCart!.items.map((item) => ({
        id: item.id,
        card: item.card,
        addedAt: item.addedAt,
      })),
      total,
      expiresAt: updatedCart!.expiresAt,
    });

    // Set session cookie if new
    if (!getSessionId(request)) {
      response.cookies.set('cart_session', sessionId!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      });
    }

    return response;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}

// DELETE /api/cart - Remove item from cart
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    const sessionId = getSessionId(request);

    if (!sessionId) {
      return NextResponse.json({ error: 'No cart found' }, { status: 404 });
    }

    const cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!cart) {
      return NextResponse.json({ error: 'No cart found' }, { status: 404 });
    }

    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    }

    // Release the card and remove from cart
    await prisma.$transaction([
      prisma.card.update({
        where: { id: item.cardId },
        data: { status: 'AVAILABLE' },
      }),
      prisma.cartItem.delete({
        where: { id: itemId },
      }),
    ]);

    // Fetch updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: { card: true },
          orderBy: { addedAt: 'desc' },
        },
      },
    });

    const total = updatedCart!.items.reduce((sum, item) => sum + item.card.price, 0);

    return NextResponse.json({
      id: updatedCart!.id,
      items: updatedCart!.items.map((item) => ({
        id: item.id,
        card: item.card,
        addedAt: item.addedAt,
      })),
      total,
      expiresAt: updatedCart!.expiresAt,
    });
  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}

// Helper to release all reserved items in a cart
async function releaseCartItems(cartId: string) {
  const items = await prisma.cartItem.findMany({
    where: { cartId },
    select: { cardId: true },
  });

  if (items.length > 0) {
    await prisma.$transaction([
      prisma.card.updateMany({
        where: { id: { in: items.map((i) => i.cardId) } },
        data: { status: 'AVAILABLE' },
      }),
      prisma.cart.delete({ where: { id: cartId } }),
    ]);
  }
}
