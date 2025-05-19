'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { theme } from '@/config/theme';
import { FiUpload, FiTrash2, FiX, FiImage, FiCheck, FiEdit2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import DashboardLoader from '../components/DashboardLoader';

interface GalleryProps {
  className?: string;
}

export default function Gallery({ className = '' }: GalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newImageName, setNewImageName] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/images');
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      setImages(data.images);
    } catch (error) {
      setError('Failed to load images');
      console.error('Error fetching images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      // Refresh the gallery after successful upload
      await fetchImages();
    } catch (error) {
      setError('Failed to upload images');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageClick = (imagePath: string, index: number) => {
    console.log('imagePath', imagePath, 'index', index)
    if (!isSelectionMode) {
      setViewImage(imagePath);
      setCurrentImageIndex(index);
      setNewImageName(imagePath.split('/').pop()?.split('.')[0] || '');
      return;
    }

    const newSelected = new Set(selectedImages);
    if (newSelected.has(imagePath)) {
      newSelected.delete(imagePath);
    } else {
      newSelected.add(imagePath);
    }
    setSelectedImages(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedImages.size === images.length) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set(images));
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedImages(new Set());
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const deletePromises = Array.from(selectedImages).map(imagePath =>
        fetch('/api/images', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: imagePath })
        })
      );

      const results = await Promise.all(deletePromises);
      const allSuccessful = results.every(response => response.ok);

      if (allSuccessful) {
        setImages(prev => prev.filter(path => !selectedImages.has(path)));
        setSelectedImages(new Set());
        setViewImage(null);
      } else {
        setError('Failed to delete some images');
      }
    } catch (error) {
      setError('Failed to delete images');
      console.error('Failed to delete images:', error);
    }
  };

  const handleNavigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next'
      ? (currentImageIndex + 1) % images.length
      : (currentImageIndex - 1 + images.length) % images.length;
    
    setCurrentImageIndex(newIndex);
    setViewImage(images[newIndex]);
    setNewImageName(images[newIndex].split('/').pop()?.split('.')[0] || '');
  };

  const handleRename = async () => {
    if (!viewImage || !newImageName) return;

    try {
      const response = await fetch('/api/images/rename', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPath: viewImage,
          newName: newImageName
        })
      });

      if (!response.ok) {
        throw new Error('Failed to rename image');
      }

      const data = await response.json();
      // Update the image path in the images array
      setImages(prev => prev.map(path => 
        path === viewImage ? data.newPath : path
      ));
      setViewImage(data.newPath);
      setIsRenaming(false);
    } catch (error) {
      setError('Failed to rename image');
      console.error('Rename error:', error);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold" style={{ color: theme.colors.text.primary }}>
            Media Gallery
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSelectionMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isSelectionMode 
                  ? 'bg-gray-500 hover:bg-gray-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {isSelectionMode ? 'Cancel Selection' : 'Select Images'}
            </button>
            {isSelectionMode && (
              <>
                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  {selectedImages.size === images.length ? 'Deselect All' : 'Select All'}
                </button>
                {selectedImages.size > 0 && (
                  <button
                    onClick={handleDeleteSelected}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete Selected ({selectedImages.size})
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        <label className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:opacity-90"
          style={{ 
            backgroundColor: theme.colors.primary,
            color: theme.colors.text.light
          }}
        >
          <FiUpload className="w-4 h-4" />
          <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-600">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
          <DashboardLoader />
      ) : (
        <>
          {/* Image Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((path, index) => (
              <div
                key={index}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedImages.has(path) ? 'ring-2 ring-blue-500' : isSelectionMode ? 'hover:ring-2 hover:ring-blue-300' : ''
                }`}
                onClick={() => handleImageClick(path, index)}
              >
                <Image
                  src={path}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {selectedImages.has(path) && (
                  <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {images.length === 0 && !isUploading && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg" style={{ borderColor: theme.colors.border.default }}>
              <FiImage className="w-12 h-12 mx-auto mb-4" style={{ color: theme.colors.text.secondary }} />
              <p className="text-lg" style={{ color: theme.colors.text.secondary }}>No images uploaded yet</p>
              <p className="text-sm mt-2" style={{ color: theme.colors.text.secondary }}>
                Upload your first image to get started
              </p>
            </div>
          )}
        </>
      )}

      {/* Large Image View */}
      {viewImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setViewImage(null)}
        >
          <div 
            className="relative max-w-5xl w-full h-[85vh] flex items-center justify-center px-16"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNavigateImage('prev');
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>

            <div className="relative w-full h-full flex flex-col items-center justify-center">
              <div 
                className="relative flex-1 w-full rounded-lg overflow-hidden bg-black/40"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={viewImage}
                  alt="Large view"
                  fill
                  sizes="(max-width: 4xl) 100vw"
                  priority
                  className="object-contain"
                  onLoadingComplete={(e) => {
                    e.style.opacity = '1';
                  }}
                  style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
                />
              </div>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div 
                  className="bg-black/70 px-6 py-3 rounded-lg text-white text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {viewImage.split('/').pop()}
                </div>
              </div>

              <div 
                className="absolute top-4 right-4 flex gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsRenaming(true);
                  }}
                  className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  <FiEdit2 className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDeleteSelected();
                  }}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  <FiTrash2 className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setViewImage(null);
                  }}
                  className="p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNavigateImage('next');
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          </div>

          {isRenaming && (
            <div 
              className="absolute bottom-4 left-4 right-4 bg-black/70 p-4 rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div 
                className="flex items-center gap-2 max-w-2xl mx-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="text"
                  value={newImageName}
                  onChange={(e) => setNewImageName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:border-blue-500"
                  placeholder="Enter new name"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRename();
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Rename
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsRenaming(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}