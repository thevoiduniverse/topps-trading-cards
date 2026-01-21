'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TradingCard from '@/components/TradingCard';
import {
  PARALLEL_LABELS,
  COLOR_LABELS,
  CONDITION_LABELS,
  COMMON_SETS,
  COMMON_PRINT_RUNS,
  Card
} from '@/lib/types';
import { useStore } from '@/store/useStore';

const PARALLEL_TYPES = Object.keys(PARALLEL_LABELS);
const COLOR_VARIANTS = Object.keys(COLOR_LABELS);
const CONDITIONS = Object.keys(CONDITION_LABELS);

interface FormData {
  playerName: string;
  team: string;
  sport: string;
  year: number;
  setName: string;
  cardNumber: string;
  parallelType: string;
  colorVariant: string;
  isNumbered: boolean;
  printRun: number | null;
  serialNumber: number | null;
  isRookie: boolean;
  isAutograph: boolean;
  isRelic: boolean;
  isShortPrint: boolean;
  isVariation: boolean;
  condition: string;
  conditionNotes: string;
  price: number;
}

const DEFAULT_FORM: FormData = {
  playerName: '',
  team: '',
  sport: 'Football',
  year: new Date().getFullYear(),
  setName: '',
  cardNumber: '',
  parallelType: 'BASE',
  colorVariant: '',
  isNumbered: false,
  printRun: null,
  serialNumber: null,
  isRookie: false,
  isAutograph: false,
  isRelic: false,
  isShortPrint: false,
  isVariation: false,
  condition: 'NEAR_MINT',
  conditionNotes: '',
  price: 10,
};

export default function AddCardPage() {
  const router = useRouter();
  const { showNotification } = useStore();
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM);
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const handleImageChange = (type: 'front' | 'back', file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'front') {
          setFrontImage(file);
          setFrontPreview(reader.result as string);
        } else {
          setBackImage(file);
          setBackPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File, type: 'front' | 'back'): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Failed to upload ${type} image`);
    }

    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let frontImageUrl = null;
      let backImageUrl = null;

      // Upload images
      if (frontImage) {
        frontImageUrl = await uploadImage(frontImage, 'front');
      }
      if (backImage) {
        backImageUrl = await uploadImage(backImage, 'back');
      }

      // Create card
      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          frontImageUrl,
          backImageUrl,
          printRun: formData.isNumbered ? formData.printRun : null,
          serialNumber: formData.isNumbered ? formData.serialNumber : null,
          colorVariant: formData.colorVariant || null,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create card');
      }

      showNotification('Card created successfully!', 'success');
      router.push('/admin/cards');
    } catch (error) {
      console.error('Error creating card:', error);
      showNotification('Failed to create card. Please try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateForm = (field: keyof FormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Create preview card object
  const previewCard: Card = {
    id: 'preview',
    playerName: formData.playerName || 'Player Name',
    team: formData.team || 'Team',
    sport: formData.sport,
    year: formData.year,
    setName: formData.setName || 'Set Name',
    cardNumber: formData.cardNumber || null,
    frontImageUrl: frontPreview,
    backImageUrl: backPreview,
    parallelType: formData.parallelType,
    colorVariant: formData.colorVariant || null,
    isNumbered: formData.isNumbered,
    printRun: formData.printRun,
    serialNumber: formData.serialNumber,
    isRookie: formData.isRookie,
    isAutograph: formData.isAutograph,
    isRelic: formData.isRelic,
    isShortPrint: formData.isShortPrint,
    isVariation: formData.isVariation,
    condition: formData.condition,
    conditionNotes: formData.conditionNotes || null,
    price: formData.price,
    status: 'AVAILABLE',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="section-eyebrow">Admin</div>
          <h1 className="section-title">
            Add New <span className="section-title-lime">Card</span>
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Upload card images and fill in the details
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Section */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Card Images</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Front Image */}
                  <div>
                    <label className="label">Front Image</label>
                    <input
                      ref={frontInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange('front', e.target.files?.[0] || null)}
                    />
                    <div
                      className={`upload-zone ${frontPreview ? 'has-image' : ''}`}
                      onClick={() => frontInputRef.current?.click()}
                    >
                      {frontPreview ? (
                        <div className="relative w-full aspect-[3/4]">
                          <Image
                            src={frontPreview}
                            alt="Front preview"
                            fill
                            className="object-contain rounded-lg"
                          />
                        </div>
                      ) : (
                        <>
                          <svg className="upload-zone-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="upload-zone-text">Click to upload front image</p>
                          <p className="upload-zone-hint">PNG, JPG up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Back Image */}
                  <div>
                    <label className="label">Back Image (Optional)</label>
                    <input
                      ref={backInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange('back', e.target.files?.[0] || null)}
                    />
                    <div
                      className={`upload-zone ${backPreview ? 'has-image' : ''}`}
                      onClick={() => backInputRef.current?.click()}
                    >
                      {backPreview ? (
                        <div className="relative w-full aspect-[3/4]">
                          <Image
                            src={backPreview}
                            alt="Back preview"
                            fill
                            className="object-contain rounded-lg"
                          />
                        </div>
                      ) : (
                        <>
                          <svg className="upload-zone-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="upload-zone-text">Click to upload back image</p>
                          <p className="upload-zone-hint">PNG, JPG up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="label">Player Name *</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.playerName}
                      onChange={(e) => updateForm('playerName', e.target.value)}
                      placeholder="e.g., Patrick Mahomes"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Team *</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.team}
                      onChange={(e) => updateForm('team', e.target.value)}
                      placeholder="e.g., Kansas City Chiefs"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Sport</label>
                    <select
                      className="select"
                      value={formData.sport}
                      onChange={(e) => updateForm('sport', e.target.value)}
                    >
                      <option value="Football">Football</option>
                      <option value="Baseball">Baseball</option>
                      <option value="Basketball">Basketball</option>
                      <option value="Hockey">Hockey</option>
                      <option value="Soccer">Soccer</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Year *</label>
                    <select
                      className="select"
                      value={formData.year}
                      onChange={(e) => updateForm('year', parseInt(e.target.value))}
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Set Name *</label>
                    <select
                      className="select"
                      value={formData.setName}
                      onChange={(e) => updateForm('setName', e.target.value)}
                    >
                      <option value="">Select a set...</option>
                      {COMMON_SETS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Card Number</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.cardNumber}
                      onChange={(e) => updateForm('cardNumber', e.target.value)}
                      placeholder="e.g., 200"
                    />
                  </div>
                </div>
              </div>

              {/* Parallel & Color */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Parallel & Variant</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Parallel Type</label>
                    <select
                      className="select"
                      value={formData.parallelType}
                      onChange={(e) => updateForm('parallelType', e.target.value)}
                    >
                      {PARALLEL_TYPES.map((p) => (
                        <option key={p} value={p}>{PARALLEL_LABELS[p]}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Color Variant</label>
                    <select
                      className="select"
                      value={formData.colorVariant}
                      onChange={(e) => updateForm('colorVariant', e.target.value)}
                    >
                      <option value="">No Color Variant</option>
                      {COLOR_VARIANTS.map((c) => (
                        <option key={c} value={c}>{COLOR_LABELS[c]}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Numbered */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Numbering</h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={formData.isNumbered}
                      onChange={(e) => updateForm('isNumbered', e.target.checked)}
                    />
                    <span className="text-[var(--text-secondary)]">This card is numbered</span>
                  </label>

                  {formData.isNumbered && (
                    <div className="grid md:grid-cols-2 gap-4 pl-8">
                      <div>
                        <label className="label">Print Run *</label>
                        <select
                          className="select"
                          value={formData.printRun || ''}
                          onChange={(e) => updateForm('printRun', parseInt(e.target.value) || null)}
                        >
                          <option value="">Select print run...</option>
                          {COMMON_PRINT_RUNS.map((pr) => (
                            <option key={pr} value={pr}>/{pr}</option>
                          ))}
                          <option value="custom">Custom...</option>
                        </select>
                      </div>

                      <div>
                        <label className="label">Serial Number</label>
                        <input
                          type="number"
                          className="input"
                          min="1"
                          max={formData.printRun || 999}
                          value={formData.serialNumber || ''}
                          onChange={(e) => updateForm('serialNumber', parseInt(e.target.value) || null)}
                          placeholder={`e.g., 45 of ${formData.printRun || '99'}`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Designations */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Special Designations</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'isRookie', label: 'Rookie Card (RC)' },
                    { key: 'isAutograph', label: 'Autograph' },
                    { key: 'isRelic', label: 'Relic/Patch' },
                    { key: 'isShortPrint', label: 'Short Print (SP)' },
                    { key: 'isVariation', label: 'Variation' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={formData[item.key as keyof FormData] as boolean}
                        onChange={(e) => updateForm(item.key as keyof FormData, e.target.checked)}
                      />
                      <span className="text-[var(--text-secondary)] text-sm">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition & Price */}
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Condition & Price</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Condition</label>
                    <select
                      className="select"
                      value={formData.condition}
                      onChange={(e) => updateForm('condition', e.target.value)}
                    >
                      {CONDITIONS.map((c) => (
                        <option key={c} value={c}>{CONDITION_LABELS[c]}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="label">Price ($) *</label>
                    <input
                      type="number"
                      className="input"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => updateForm('price', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="label">Condition Notes</label>
                    <textarea
                      className="input min-h-[100px]"
                      value={formData.conditionNotes}
                      onChange={(e) => updateForm('conditionNotes', e.target.value)}
                      placeholder="Describe any notable condition issues..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn btn-ghost flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.playerName || !formData.team || !formData.setName}
                  className="btn btn-primary flex-1 disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Card'}
                </button>
              </div>
            </form>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-4">Preview</h2>
              <div className="flex justify-center">
                <TradingCard card={previewCard} size="lg" showPrice />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
