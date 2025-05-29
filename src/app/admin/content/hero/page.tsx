'use client';

import React, { useEffect, useState } from 'react';
import { FiEdit2, FiSave, FiX, FiImage, FiType, FiPlus, FiTrash2 } from 'react-icons/fi';
import { showAlert, showConfirmDialog } from '@/utils/alert';
import ImageSelector from '@/app/admin/components/ImageSelector';
import Loader from '../../components/Loader';
import DashboardLoader from '../../components/DashboardLoader';
import { theme } from '@/config/theme';
import { handle403Response } from '@/app/admin/errors/error403';
import { useRouter } from 'next/navigation';
import type { HeroData } from '@/types/hero';

interface SlideFormData {
  image: string;
  mobileImage: string;
  title: { en: string; ur: string };
  subtitle: { en: string; ur: string };
}

export default function HeroSection() {
  const [formData, setFormData] = useState<HeroData | null>(null);
  const [originalData, setOriginalData] = useState<HeroData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<SlideFormData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await fetch('/api/admin/hero');
      const data = await response.json();
      if (data.success) {
        setFormData(data.data);
        setOriginalData(data.data);
        setIsLoading(false);
      } else {
        if (response.status === 401) {
          router.push('/admin/login');
          return;
        } else if (response.status === 403) {
          const shouldRedirect = await handle403Response();
          if (shouldRedirect) {
            window.location.href = '/admin/login';
          }
          return;
        }
        showAlert({
          title: 'Error',
          text: data.error || 'Failed to fetch hero data',
          icon: 'error',
        });
      }
    } catch (error) {
      showAlert({
        title: 'Error',
        text: 'Failed to fetch hero data',
        icon: 'error',
      });
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    try {
      setIsSaving(true);
      const result = await showConfirmDialog({
        title: 'Save Changes?',
        text: 'Are you sure you want to save these changes?',
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        icon: 'warning',
        showCancelButton: true,
      });

      if (result.isConfirmed) {
        const response = await fetch('/api/admin/hero', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (data.success) {
          setOriginalData(formData);
          showAlert({
            title: 'Success',
            text: 'Changes saved successfully!',
            icon: 'success',
          });
        } else {
          if (response.status === 401) {
            router.push('/admin/login');
            return;
          } else if (response.status === 403) {
            const shouldRedirect = await handle403Response();
            if (shouldRedirect) {
              window.location.href = '/admin/login';
            }
            return;
          }
          showAlert({
            title: 'Error',
            text: data.error || 'Failed to save changes',
            icon: 'error',
          });
        }
      }
    } catch (error) {
      showAlert({
        title: 'Error',
        text: 'Failed to save changes',
        icon: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSlide = () => {
    const newSlide: SlideFormData = {
      image: '',
      mobileImage: '',
      title: { en: '', ur: '' },
      subtitle: { en: '', ur: '' },
    };
    setSelectedSlide(newSlide);
    setIsModalOpen(true);
    setHasChanges(false);
  };

  const handleEditSlide = async (index: number) => {
    if (!formData) return;

    const result = await showConfirmDialog({
      title: 'Edit Slide?',
      text: 'Are you sure you want to edit this slide?',
      confirmButtonText: 'Edit',
      cancelButtonText: 'Cancel',
      icon: 'warning',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      setSelectedSlide(formData.slides[index]);
      setIsModalOpen(true);
      setHasChanges(false);
    }
  };

  const handleDeleteSlide = async (index: number) => {
    if (!formData) return;

    const result = await showConfirmDialog({
      title: 'Delete Slide?',
      text: 'Are you sure you want to delete this slide? This action cannot be undone.',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      icon: 'warning',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        setIsSaving(true);
        const response = await fetch(`/api/admin/hero?index=${index}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          showAlert({
            title: 'Success',
            text: 'Slide deleted successfully!',
            icon: 'success',
          });
          fetchHeroData(); // Refresh data after successful delete
        } else {
          if (response.status === 401) {
            router.push('/admin/login');
            return;
          } else if (response.status === 403) {
            const shouldRedirect = await handle403Response();
            if (shouldRedirect) {
              window.location.href = '/admin/login';
            }
            return;
          }
          showAlert({
            title: 'Error',
            text: data.error || 'Failed to delete slide',
            icon: 'error',
          });
        }
      } catch (error) {
        showAlert({
          title: 'Error',
          text: 'Failed to delete slide',
          icon: 'error',
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSaveSlide = async () => {
    if (!formData || !selectedSlide) return;

    try {
      setIsSaving(true);
      const newSlides = [...formData.slides];
      const existingIndex = newSlides.findIndex(
        (slide) => slide.image === selectedSlide.image
      );

      let response;
      if (existingIndex >= 0) {
        // Update existing slide
        response = await fetch('/api/admin/hero', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            index: existingIndex,
            slide: selectedSlide
          }),
        });
      } else {
        // Add new slide
        response = await fetch('/api/admin/hero', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slide: selectedSlide
          }),
        });
      }

      const data = await response.json();

      if (data.success) {
        showAlert({
          title: 'Success',
          text: 'Slide saved successfully!',
          icon: 'success',
        });
        setIsModalOpen(false);
        setSelectedSlide(null);
        setHasChanges(false);
        fetchHeroData(); // Refresh data after successful save
      } else {
        if (response.status === 401) {
          router.push('/admin/login');
          return;
        } else if (response.status === 403) {
          const shouldRedirect = await handle403Response();
          if (shouldRedirect) {
            window.location.href = '/admin/login';
          }
          return;
        }
        showAlert({
          title: 'Error',
          text: data.error || 'Failed to save slide',
          icon: 'error',
        });
      }
    } catch (error) {
      showAlert({
        title: 'Error',
        text: 'Failed to save slide',
        icon: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSlideChange = (field: keyof SlideFormData, value: any) => {
    if (!selectedSlide) return;
    
    const updatedSlide = {
      ...selectedSlide,
      [field]: value
    };
    setSelectedSlide(updatedSlide);
    setHasChanges(true);
  };

  if (isLoading) {
    return <DashboardLoader />;
  }

  if (!formData) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Loader isVisible={isSaving} text="Saving" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: theme.colors.text.primary }}>
          Manage Hero Section
        </h1>
          <button
          onClick={handleAddSlide}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.text.light,
            }}
          >
          <FiPlus className="w-4 h-4" />
          Add Slide
          </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: theme.colors.background.primary }}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y" style={{ borderColor: theme.colors.border.default }}>
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ 
                  color: theme.colors.text.secondary,
                  fontFamily: theme.fonts.en.primary 
                }}>
                  Preview
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ 
                  color: theme.colors.text.secondary,
                  fontFamily: theme.fonts.en.primary 
                }}>
                  Title (EN)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ 
                  color: theme.colors.text.secondary,
                  fontFamily: theme.fonts.en.primary 
                }}>
                  Title (UR)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ 
                  color: theme.colors.text.secondary,
                  fontFamily: theme.fonts.en.primary 
                }}>
                  Subtitle (EN)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ 
                  color: theme.colors.text.secondary,
                  fontFamily: theme.fonts.en.primary 
                }}>
                  Subtitle (UR)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ 
                  color: theme.colors.text.secondary,
                  fontFamily: theme.fonts.en.primary 
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: theme.colors.border.default }}>
              {formData.slides.map((slide, index) => (
                <tr key={index} className="hover:bg-gray-50" style={{ backgroundColor: theme.colors.background.secondary }}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={slide.image}
                          alt={`Slide ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                    <div 
                      className="max-w-[200px] truncate" 
                      title={slide.title.en}
                      style={{ fontFamily: theme.fonts.en.primary }}
                    >
                      {slide.title.en}
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                    <div 
                      className="max-w-[200px] truncate" 
                      title={slide.title.ur}
                      style={{ 
                        fontFamily: theme.fonts.ur.primary,
                        direction: 'rtl',
                        textAlign: 'right'
                      }}
                    >
                      {slide.title.ur}
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                    <div 
                      className="max-w-[200px] truncate" 
                      title={slide.subtitle.en}
                      style={{ fontFamily: theme.fonts.en.primary }}
                    >
                      {slide.subtitle.en}
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                    <div 
                      className="max-w-[200px] truncate" 
                      title={slide.subtitle.ur}
            style={{
                        fontFamily: theme.fonts.ur.primary,
                        direction: 'rtl',
                        textAlign: 'right'
                      }}
                    >
                      {slide.subtitle.ur}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditSlide(index)}
                        title='Click to edit.'
                        className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer"
                        style={{ color: theme.colors.primary }}
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSlide(index)}
                        title='Click to delete.'
                        className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer"
                        style={{ color: theme.colors.status.error }}
                      >
                        <FiTrash2 className="w-4 h-4" />
          </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedSlide && (
        <div className="fixed inset-0 bg-[#61616167] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl" style={{ backgroundColor: theme.colors.background.primary }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>
                {selectedSlide.image ? 'Edit Slide' : 'Add New Slide'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedSlide(null);
                  setHasChanges(false);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <FiX className="w-5 h-5" style={{ color: theme.colors.text.secondary }} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                    Desktop Image
                  </label>
                        <ImageSelector
                    selectedPath={selectedSlide.image}
                    onSelect={(path) => handleSlideChange('image', path)}
                    className="w-full"
                    size='small'
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                    Mobile Image
                  </label>
                        <ImageSelector
                    selectedPath={selectedSlide.mobileImage}
                    onSelect={(path) => handleSlideChange('mobileImage', path)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                    Title (English)
                  </label>
                        <input
                          type="text"
                    value={selectedSlide.title.en}
                    onChange={(e) =>
                      handleSlideChange('title', { ...selectedSlide.title, en: e.target.value })
                    }
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                          style={{
                            borderColor: theme.colors.border.default,
                            color: theme.colors.text.primary,
                      backgroundColor: theme.colors.background.primary,
                      fontFamily: theme.fonts.en.primary,
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                    Title (Urdu)
                  </label>
                        <input
                          type="text"
                    value={selectedSlide.title.ur}
                    onChange={(e) =>
                      handleSlideChange('title', { ...selectedSlide.title, ur: e.target.value })
                    }
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                          style={{
                            borderColor: theme.colors.border.default,
                            color: theme.colors.text.primary,
                      backgroundColor: theme.colors.background.primary,
                      fontFamily: theme.fonts.ur.primary,
                      direction: 'rtl',
                      textAlign: 'right',
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                    Subtitle (English)
                  </label>
                        <input
                          type="text"
                    value={selectedSlide.subtitle.en}
                    onChange={(e) =>
                      handleSlideChange('subtitle', { ...selectedSlide.subtitle, en: e.target.value })
                    }
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                          style={{
                            borderColor: theme.colors.border.default,
                            color: theme.colors.text.primary,
                      backgroundColor: theme.colors.background.primary,
                      fontFamily: theme.fonts.en.primary,
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                    Subtitle (Urdu)
                  </label>
                        <input
                          type="text"
                    value={selectedSlide.subtitle.ur}
                    onChange={(e) =>
                      handleSlideChange('subtitle', { ...selectedSlide.subtitle, ur: e.target.value })
                    }
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                          style={{
                            borderColor: theme.colors.border.default,
                            color: theme.colors.text.primary,
                      backgroundColor: theme.colors.background.primary,
                      fontFamily: theme.fonts.ur.primary,
                      direction: 'rtl',
                      textAlign: 'right',
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
                          <button
                            onClick={() => {
                  setIsModalOpen(false);
                  setSelectedSlide(null);
                  setHasChanges(false);
                }}
                className="px-4 py-2 rounded-lg transition-colors duration-200"
                style={{
                  backgroundColor: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                }}
              >
                Cancel
                          </button>
              <button
                onClick={handleSaveSlide}
                disabled={isSaving || !hasChanges}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.text.light,
                }}
              >
                <FiSave className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
            </div>
          )}
    
    </div>
  );
}