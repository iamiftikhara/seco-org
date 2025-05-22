'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { theme } from '@/config/theme';
import { FiUpload, FiImage, FiX } from 'react-icons/fi';

interface ImageSelectorProps {
  selectedPath?: string;
  onSelect: (path: string) => void;
  className?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function ImageSelector({ 
  selectedPath, 
  onSelect, 
  className = '', 
  disabled = false,
  size = 'small'
}: ImageSelectorProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      const response = await fetch('/api/images');
      const data = await response.json();
      if (data.success) {
        setImages(data.images);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch images');
      }
    } catch (error) {
      setError('Failed to fetch images');
      console.error('Failed to fetch images:', error);
    }
  }, []);

  useEffect(() => {
    if (showGallery) {
      fetchImages();
    }
  }, [showGallery, fetchImages]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setImages(prev => [...prev, data.path]);
        onSelect(data.path);
        setShowGallery(false);
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (error) {
      setError('Failed to upload image');
      console.error('Failed to upload image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const sizeStyles = {
    small: {
      container: 'h-12',
      preview: 'w-6 h-6 ml-3',  // Added ml-3 for left margin
      text: 'text-sm'
    },
    medium: {
      container: 'h-32',
      preview: 'w-24 h-24',
      text: 'text-base'
    },
    large: {
      container: 'h-48',
      preview: 'w-full h-full',
      text: 'text-lg'
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selected Image Preview */}
      <div 
        className={`w-full rounded-lg border flex items-center ${size === 'small' ? 'justify-between' : 'flex-col justify-center'} overflow-hidden ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        } ${sizeStyles[size].container}`}
        style={{ 
          borderColor: theme.colors.border.default,
          backgroundColor: disabled ? theme.colors.background.secondary : theme.colors.background.primary
        }}
        onClick={() => !disabled && setShowGallery(true)}
      >
        {selectedPath ? (
          <>
            <div className={`relative ${sizeStyles[size].preview} rounded overflow-hidden`}>
              <Image
                src={selectedPath}
                alt="Selected image"
                fill
                className="object-cover"
              />
            </div>
            {size === 'small' && (
              <div className="flex items-center justify-between flex-1 px-3">
                <span className={`${sizeStyles[size].text} truncate`} style={{ color: theme.colors.text.primary }}>
                  {selectedPath.split('/').pop()}
                </span>
                {!disabled && (
                  <FiImage className="w-4 h-4 text-gray-500 ml-2" />
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <FiImage className={size === 'small' ? 'w-4 h-4' : 'w-8 h-8'} />
            <span className={sizeStyles[size].text}>Select Image</span>
          </div>
        )}
      </div>

      {/* Gallery Modal remains the same */}
      {showGallery && !disabled && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowGallery(false)}
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: theme.colors.background.primary }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                Select Image
              </h3>
              <button
                onClick={() => setShowGallery(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600">
                {error}
              </div>
            )}

            {/* Upload Section */}
            <div className="mb-6">
              <label className="block w-full p-4 rounded-lg border-2 border-dashed cursor-pointer hover:bg-gray-50 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <div className="flex flex-col items-center gap-2 text-gray-500">
                  <FiUpload className="w-8 h-8" />
                  <span>{isUploading ? 'Uploading...' : 'Upload New Image'}</span>
                </div>
              </label>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((path, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onSelect(path);
                    setShowGallery(false);
                  }}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                    selectedPath === path ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-gray-300'
                  }`}
                >
                  <Image
                    src={path}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}