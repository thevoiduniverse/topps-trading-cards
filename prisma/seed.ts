import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: 'file:dev.db',
});
const prisma = new PrismaClient({ adapter });

const SAMPLE_CARDS = [
  // Icons
  { playerName: 'Pelé', position: 'CF', team: 'Brazil Legend', nation: 'Brazil', overall: 98, pace: 95, shooting: 96, passing: 93, dribbling: 96, defending: 60, physical: 76, rarity: 'ICON', collection: 'Icons', price: 500 },
  { playerName: 'Diego Maradona', position: 'CAM', team: 'Argentina Legend', nation: 'Argentina', overall: 97, pace: 89, shooting: 90, passing: 91, dribbling: 97, defending: 40, physical: 75, rarity: 'ICON', collection: 'Icons', price: 450 },
  { playerName: 'Johan Cruyff', position: 'CF', team: 'Netherlands Legend', nation: 'Netherlands', overall: 96, pace: 88, shooting: 89, passing: 92, dribbling: 96, defending: 55, physical: 72, rarity: 'ICON', collection: 'Icons', price: 400 },

  // Heroes
  { playerName: 'Yaya Touré', position: 'CM', team: 'Manchester City', nation: 'Ivory Coast', overall: 90, pace: 78, shooting: 85, passing: 86, dribbling: 84, defending: 78, physical: 88, rarity: 'HERO', collection: 'Heroes', price: 150 },
  { playerName: 'Tim Cahill', position: 'CAM', team: 'Everton', nation: 'Australia', overall: 87, pace: 75, shooting: 84, passing: 72, dribbling: 78, defending: 65, physical: 86, rarity: 'HERO', collection: 'Heroes', price: 100 },

  // Informs
  { playerName: 'Erling Haaland', position: 'ST', team: 'Manchester City', nation: 'Norway', overall: 93, pace: 89, shooting: 94, passing: 68, dribbling: 82, defending: 45, physical: 90, rarity: 'INFORM', collection: 'TOTW 15', price: 200 },
  { playerName: 'Jude Bellingham', position: 'CM', team: 'Real Madrid', nation: 'England', overall: 91, pace: 82, shooting: 84, passing: 85, dribbling: 88, defending: 78, physical: 82, rarity: 'INFORM', collection: 'TOTW 12', price: 180 },
  { playerName: 'Vinícius Jr', position: 'LW', team: 'Real Madrid', nation: 'Brazil', overall: 92, pace: 97, shooting: 85, passing: 82, dribbling: 94, defending: 32, physical: 70, rarity: 'INFORM', collection: 'TOTW 10', price: 190 },

  // Rare Gold
  { playerName: 'Kylian Mbappé', position: 'ST', team: 'Real Madrid', nation: 'France', overall: 91, pace: 97, shooting: 89, passing: 80, dribbling: 92, defending: 36, physical: 78, rarity: 'RARE_GOLD', collection: 'Base 2024', price: 100 },
  { playerName: 'Kevin De Bruyne', position: 'CM', team: 'Manchester City', nation: 'Belgium', overall: 91, pace: 72, shooting: 86, passing: 94, dribbling: 88, defending: 64, physical: 78, rarity: 'RARE_GOLD', collection: 'Base 2024', price: 95 },
  { playerName: 'Mohamed Salah', position: 'RW', team: 'Liverpool', nation: 'Egypt', overall: 89, pace: 93, shooting: 87, passing: 81, dribbling: 90, defending: 45, physical: 75, rarity: 'RARE_GOLD', collection: 'Base 2024', price: 80 },
  { playerName: 'Virgil van Dijk', position: 'CB', team: 'Liverpool', nation: 'Netherlands', overall: 89, pace: 77, shooting: 60, passing: 71, dribbling: 72, defending: 91, physical: 86, rarity: 'RARE_GOLD', collection: 'Base 2024', price: 75 },
  { playerName: 'Rodri', position: 'CDM', team: 'Manchester City', nation: 'Spain', overall: 89, pace: 65, shooting: 75, passing: 87, dribbling: 82, defending: 87, physical: 85, rarity: 'RARE_GOLD', collection: 'Base 2024', price: 70 },

  // Gold
  { playerName: 'Marcus Rashford', position: 'LW', team: 'Manchester United', nation: 'England', overall: 84, pace: 92, shooting: 82, passing: 74, dribbling: 85, defending: 41, physical: 77, rarity: 'GOLD', collection: 'Base 2024', price: 25 },
  { playerName: 'Declan Rice', position: 'CDM', team: 'Arsenal', nation: 'England', overall: 84, pace: 70, shooting: 68, passing: 78, dribbling: 75, defending: 85, physical: 84, rarity: 'GOLD', collection: 'Base 2024', price: 22 },
  { playerName: 'Bukayo Saka', position: 'RW', team: 'Arsenal', nation: 'England', overall: 84, pace: 86, shooting: 78, passing: 80, dribbling: 86, defending: 55, physical: 68, rarity: 'GOLD', collection: 'Base 2024', price: 24 },
  { playerName: 'Phil Foden', position: 'CAM', team: 'Manchester City', nation: 'England', overall: 85, pace: 84, shooting: 81, passing: 84, dribbling: 89, defending: 52, physical: 65, rarity: 'GOLD', collection: 'Base 2024', price: 28 },
  { playerName: 'Jadon Sancho', position: 'LW', team: 'Manchester United', nation: 'England', overall: 80, pace: 84, shooting: 74, passing: 77, dribbling: 87, defending: 35, physical: 63, rarity: 'GOLD', collection: 'Base 2024', price: 15 },
  { playerName: 'Bruno Fernandes', position: 'CAM', team: 'Manchester United', nation: 'Portugal', overall: 86, pace: 74, shooting: 85, passing: 88, dribbling: 84, defending: 64, physical: 72, rarity: 'GOLD', collection: 'Base 2024', price: 30 },

  // Silver
  { playerName: 'Kobbie Mainoo', position: 'CM', team: 'Manchester United', nation: 'England', overall: 72, pace: 70, shooting: 65, passing: 72, dribbling: 74, defending: 68, physical: 70, rarity: 'SILVER', collection: 'Base 2024', price: 5 },
  { playerName: 'Alejandro Garnacho', position: 'LW', team: 'Manchester United', nation: 'Argentina', overall: 74, pace: 88, shooting: 70, passing: 68, dribbling: 78, defending: 32, physical: 62, rarity: 'SILVER', collection: 'Base 2024', price: 6 },
  { playerName: 'Evan Ferguson', position: 'ST', team: 'Brighton', nation: 'Ireland', overall: 73, pace: 72, shooting: 75, passing: 58, dribbling: 70, defending: 28, physical: 74, rarity: 'SILVER', collection: 'Base 2024', price: 5 },
  { playerName: 'Rico Lewis', position: 'RB', team: 'Manchester City', nation: 'England', overall: 71, pace: 78, shooting: 55, passing: 72, dribbling: 74, defending: 68, physical: 62, rarity: 'SILVER', collection: 'Base 2024', price: 4 },
  { playerName: 'Harvey Elliott', position: 'CM', team: 'Liverpool', nation: 'England', overall: 74, pace: 72, shooting: 68, passing: 76, dribbling: 80, defending: 52, physical: 58, rarity: 'SILVER', collection: 'Base 2024', price: 5 },

  // Bronze
  { playerName: 'Lamine Yamal', position: 'RW', team: 'Barcelona', nation: 'Spain', overall: 64, pace: 82, shooting: 58, passing: 65, dribbling: 75, defending: 25, physical: 45, rarity: 'BRONZE', collection: 'Base 2024', price: 2 },
  { playerName: 'Warren Zaïre-Emery', position: 'CM', team: 'PSG', nation: 'France', overall: 62, pace: 68, shooting: 58, passing: 65, dribbling: 68, defending: 62, physical: 60, rarity: 'BRONZE', collection: 'Base 2024', price: 1 },
  { playerName: 'Endrick', position: 'ST', team: 'Real Madrid', nation: 'Brazil', overall: 63, pace: 78, shooting: 68, passing: 52, dribbling: 70, defending: 22, physical: 65, rarity: 'BRONZE', collection: 'Base 2024', price: 2 },
  { playerName: 'Gavi', position: 'CM', team: 'Barcelona', nation: 'Spain', overall: 64, pace: 72, shooting: 60, passing: 72, dribbling: 78, defending: 58, physical: 62, rarity: 'BRONZE', collection: 'Base 2024', price: 2 },
  { playerName: 'Pedri', position: 'CM', team: 'Barcelona', nation: 'Spain', overall: 64, pace: 70, shooting: 62, passing: 78, dribbling: 82, defending: 60, physical: 55, rarity: 'BRONZE', collection: 'Base 2024', price: 2 },
];

const SAMPLE_PACKS = [
  {
    name: 'Bronze Pack',
    description: 'Entry level pack with bronze and silver cards',
    price: 2.5,
    totalCards: 5,
    rarityDistribution: [
      { rarity: 'BRONZE', count: 4, guaranteedMin: 3 },
      { rarity: 'SILVER', count: 1, guaranteedMin: 0 },
    ],
  },
  {
    name: 'Silver Pack',
    description: 'Silver cards with a chance at gold',
    price: 5,
    totalCards: 5,
    rarityDistribution: [
      { rarity: 'SILVER', count: 4, guaranteedMin: 3 },
      { rarity: 'GOLD', count: 1, guaranteedMin: 0 },
    ],
  },
  {
    name: 'Gold Pack',
    description: 'Premium pack with gold cards',
    price: 10,
    totalCards: 6,
    rarityDistribution: [
      { rarity: 'GOLD', count: 4, guaranteedMin: 3 },
      { rarity: 'RARE_GOLD', count: 2, guaranteedMin: 1 },
    ],
  },
  {
    name: 'Premium Gold Pack',
    description: 'Best odds for rare players and special cards',
    price: 25,
    totalCards: 6,
    rarityDistribution: [
      { rarity: 'RARE_GOLD', count: 3, guaranteedMin: 2 },
      { rarity: 'INFORM', count: 2, guaranteedMin: 1 },
      { rarity: 'HERO', count: 1, guaranteedMin: 0 },
    ],
  },
  {
    name: 'Icon Pack',
    description: 'Guaranteed icon or hero card!',
    price: 100,
    totalCards: 5,
    rarityDistribution: [
      { rarity: 'RARE_GOLD', count: 2, guaranteedMin: 2 },
      { rarity: 'INFORM', count: 1, guaranteedMin: 1 },
      { rarity: 'HERO', count: 1, guaranteedMin: 0 },
      { rarity: 'ICON', count: 1, guaranteedMin: 1 },
    ],
  },
];

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.packCard.deleteMany();
  await prisma.packPurchase.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.packTemplate.deleteMany();
  await prisma.card.deleteMany();

  // Create cards (multiple copies of each)
  const cardsToCreate = [];
  for (const card of SAMPLE_CARDS) {
    // Create multiple copies based on rarity
    const copies = card.rarity === 'ICON' ? 2 :
                   card.rarity === 'HERO' ? 3 :
                   card.rarity === 'INFORM' ? 4 :
                   card.rarity === 'RARE_GOLD' ? 6 :
                   card.rarity === 'GOLD' ? 10 :
                   card.rarity === 'SILVER' ? 15 : 20;

    for (let i = 0; i < copies; i++) {
      cardsToCreate.push({
        ...card,
        status: 'AVAILABLE',
      });
    }
  }

  await prisma.card.createMany({
    data: cardsToCreate,
  });

  console.log(`Created ${cardsToCreate.length} cards`);

  // Create pack templates
  for (const pack of SAMPLE_PACKS) {
    await prisma.packTemplate.create({
      data: {
        name: pack.name,
        description: pack.description,
        price: pack.price,
        totalCards: pack.totalCards,
        rarityDistribution: JSON.stringify(pack.rarityDistribution),
        isActive: true,
      },
    });
  }

  console.log(`Created ${SAMPLE_PACKS.length} pack templates`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
