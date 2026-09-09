import React, { useState } from 'react';
import { Camera, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { SiteSettings } from '../types.js';
import { uploadFeaturedImage, saveSettings, getSettings } from '../lib/supabase.js';

interface FounderPhotoUploadProps {
  settings: SiteSettings | null;
  onSettingsSaved?: () => void;
  className?: string;
}

// Client-side image optimizer to keep avatars fast, crisp, and within localStorage quotas
const optimizePortrait = async (file: File): Promise<File> => {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDimension = 1000;
      let { width, height } = img;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(file);

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob && blob.size < file.size) {
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
          } else {
            resolve(file);
          }
        },
        'image/jpeg',
        0.88
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
};

export default function FounderPhotoUpload({ settings, onSettingsSaved, className = '' }: FounderPhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const currentPreview = localPreview || settings?.founderImageUrl || '/stefan-sharf.jpg';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      setSuccess(false);
      setUploading(true);

      // Pre-optimize portrait if large
      const readyFile = await optimizePortrait(file);

      // 1. Call existing uploadFeaturedImage() function from src/lib/supabase.ts
      const publicUrl = await uploadFeaturedImage(readyFile);

      if (!publicUrl) {
        throw new Error('Could not process photo upload. Please choose another file.');
      }

      // Update immediate local preview
      setLocalPreview(publicUrl);

      // 2. Save returned URL into settings.founderImageUrl via existing saveSettings()
      const baseSettings = settings || await getSettings();
      const updatedSettings: SiteSettings = {
        ...baseSettings,
        founderImageUrl: publicUrl
      };

      const saved = await saveSettings(updatedSettings);
      if (saved) {
        setSuccess(true);
        if (onSettingsSaved) {
          onSettingsSaved();
        }
        setTimeout(() => setSuccess(false), 4000);
      } else {
        throw new Error('Failed to persist founder image URL into site settings.');
      }
    } catch (err: any) {
      console.error('Founder photo upload error:', err);
      setError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className={`p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Founder Photo
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            About page leadership portrait
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Small Preview */}
        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 shadow-xs">
          <img
            src={currentPreview}
            alt="Founder portrait preview"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Upload Control */}
        <div className="flex-1 space-y-2">
          <label className="inline-flex items-center px-3 py-2 bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all disabled:opacity-50">
            {uploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                Uploading...
              </>
            ) : (
              <>
                <Camera className="h-3.5 w-3.5 mr-1.5" />
                Upload File
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={handleFileChange}
            />
          </label>
          <p className="text-[11px] text-gray-400 dark:text-gray-500">
            JPEG, PNG or WebP square portrait recommended.
          </p>
        </div>
      </div>

      {success && (
        <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs animate-fade-in">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span>Founder photo updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs animate-shake">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
