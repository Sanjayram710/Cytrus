'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export default function ImageUploadInput({
  value,
  onChange,
  label = 'Editorial Image',
  placeholder = 'https://images.unsplash.com/... or upload a file',
}: ImageUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setUploading(true);
    setError('');

    try {
      // 1. First try standard multipart FormData upload
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
        setUploading(false);
        return;
      }

      // 2. Fallback to Base64 JSON payload if FormData stream had issues
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const b64Res = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64, fileName: file.name }),
          });
          const b64Data = await b64Res.json();
          if (b64Res.ok && b64Data.url) {
            onChange(b64Data.url);
          } else {
            setError(b64Data.error || 'Failed to upload image');
          }
        } catch (err) {
          setError('Upload failed. Please try again.');
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-bold uppercase tracking-wider text-luxury-black">
          {label}
        </label>
        <div className="flex space-x-2 text-[10px] uppercase font-bold tracking-wider">
          <button
            type="button"
            onClick={() => setTab('upload')}
            className={`px-2 py-0.5 border ${
              tab === 'upload'
                ? 'bg-luxury-black text-luxury-cream border-luxury-black'
                : 'bg-white text-gray-600 border-luxury-border'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setTab('url')}
            className={`px-2 py-0.5 border ${
              tab === 'url'
                ? 'bg-luxury-black text-luxury-cream border-luxury-black'
                : 'bg-white text-gray-600 border-luxury-border'
            }`}
          >
            Image URL
          </button>
        </div>
      </div>

      {/* Live Preview Thumbnail if an image is selected */}
      {value ? (
        <div className="relative bg-luxury-cream border border-luxury-border p-2 flex items-center space-x-3 rounded-sm">
          <img src={value} alt="Preview" className="w-16 h-16 object-cover border border-luxury-border rounded-sm bg-white" />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-luxury-gold uppercase block">Image Uploaded</span>
            <p className="text-xs font-mono text-gray-700 truncate">{value}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 text-gray-400 hover:text-red-600"
            title="Remove Image"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <>
          {tab === 'upload' ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-luxury-border hover:border-luxury-gold p-6 text-center bg-white cursor-pointer transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {uploading ? (
                <div className="flex flex-col items-center justify-center py-2 space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-luxury-gold" />
                  <span className="text-xs uppercase font-bold text-luxury-black tracking-wider">Uploading Image File...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-1">
                  <UploadCloud className="w-8 h-8 text-luxury-gold mb-1" />
                  <span className="text-xs font-bold uppercase tracking-wider text-luxury-black">
                    Click to Select Local Image File or Drag & Drop Here
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase font-mono">PNG, JPG, WEBP, GIF, SVG</span>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <input
                type="url"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border border-luxury-border p-2.5 text-xs font-mono focus:outline-none focus:border-luxury-gold bg-white"
              />
            </div>
          )}
        </>
      )}

      {error && <p className="text-[10px] text-red-600 font-bold uppercase">{error}</p>}
    </div>
  );
}
