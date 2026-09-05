import React, { useState } from 'react';
import { Camera, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { SiteSettings } from '../types.js';
import { uploadFeaturedImage, saveSettings } from '../lib/supabase.js';

interface FounderPhotoUploadProps {
  currentSettings: SiteSettings;
  onSettingsUpdated?: (newSettings: SiteSettings) => void;
}

export default function FounderPhotoUpload({
  currentSettings,
  onSettingsUpdated
}: FounderPhotoUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      setSuccess(false);
      setLoading(true);

      const publicUrl = await uploadFeaturedImage(file);
      const updatedSettings: SiteSettings = {
        ...currentSettings,
        founderImageUrl: publicUrl
      };

      const ok = await saveSettings(updatedSettings);
      if (!ok) {
        throw new Error('Failed to save updated settings.');
      }

      setSuccess(true);
      if (onSettingsUpdated) {
        onSettingsUpdated(updatedSettings);
      }
    } catch (err: any) {
      setError(err?.message || 'Image upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const previewSrc = currentSettings.founderImageUrl || '/stefan-sharf.jpg';

  return (
    <div className="p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 shadow-xs space-y-4">
      <div className="flex items-center gap-2">
        <span className="p-1.5 bg-gold-500/10 text-gold-500 rounded-lg">
          <Camera className="h-4 w-4" />
        </span>
        <h3 className="font-display font-bold text-base text-gray-900 dark:text-white">
          Founder Photo
        </h3>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Update the founder photo displayed on the About page.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-5 pt-2">
        {/* Small Image Preview */}
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src={previewSrc}
              alt="Founder Photo Preview"
              className="w-20 h-20 rounded-xl object-cover border-2 border-gold-500/30 shadow-xs"
            />
            <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 py-0.5 rounded-sm bg-black/70 text-white">
              Preview
            </span>
          </div>
        </div>

        {/* Upload Button and Status */}
        <div className="flex-1 space-y-2 w-full">
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all disabled:opacity-50">
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Upload File</span>
              )}
              <input
                type="file"
                accept="image/*"
                disabled={loading}
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            {currentSettings.founderImageUrl && (
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono truncate max-w-[200px]" title={currentSettings.founderImageUrl}>
                Custom photo active
              </span>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-400">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
              <span>Founder photo updated successfully!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
