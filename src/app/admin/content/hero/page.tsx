'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { FiEdit2, FiSave, FiX, FiImage, FiType, FiPlus, FiTrash2, FiSettings } from 'react-icons/fi';
import { showAlert, showConfirmDialog } from '@/utils/alert';
import ImageSelector from '@/app/admin/components/ImageSelector';
import Loader from '../../components/Loader';
import DashboardLoader from '../../components/DashboardLoader';
import { theme } from '@/config/theme';
import { handle403Response } from '@/app/admin/errors/error403';
import { useRouter } from 'next/navigation';
import type { HeroData } from '@/types/hero';
import AdminError from '@/app/admin/errors/error';

interface SlideFormData {
  id?: number;
  image: string;
  mobileImage: string;
  title: { en: string; ur: string };
  subtitle: { en: string; ur: string };
}

interface AnnouncementFormData {
  id?: number;
  text: string;
  icon: string;
  language: 'en' | 'ur';
}

interface ConfigFormData {
  slider: {
    autoplayDelay: number;
    transitionSpeed: number;
    pauseOnHover: boolean;
  };
  marquee: {
    repetitions: number;
    speed: number;
  };
}

export default function HeroSection() {
  const [formData, setFormData] = useState<HeroData | null>(null);
  const [originalData, setOriginalData] = useState<HeroData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<SlideFormData | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<AnnouncementFormData | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<ConfigFormData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const handleErrorResponse = async (response: Response, identifier: string = 'default') => {
    setIsLoading(false);
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
    if (identifier === 'get') {
      if (response.status === 500 || response.status === 400 || response.status === 404) {
        console.log('error, 400, 500. 404');
        const errorMessage = response.statusText || 'An error occurred';
        setError(new Error(errorMessage));
        return;
      }
    }

    showAlert({
      title: 'Error',
      text: response.statusText || 'An error occurred',
      icon: 'error',
    });
  };

  const fetchHeroData = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/hero');
      const data = await response.json();
      if (data.success) {
        setFormData(data.data);
        setOriginalData(data.data);
        setIsLoading(false);
      } else {
        handleErrorResponse(response, 'get');
      }
    } catch (error) {
      handleErrorResponse(error as Response, 'get');
    }
  }, [router]);

  useEffect(() => {
    fetchHeroData();
  }, [fetchHeroData]);


  const handleAddSlide = () => {
    if (!formData) return;
    
    const newId = formData.slides.length > 0 
      ? Math.max(...formData.slides.map(s => s.id || 0)) + 1 
      : 1;

    const newSlide: SlideFormData = {
      id: newId,
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
      const slide = formData.slides[index];
      const typedSlide: SlideFormData = {
        id: slide.id,
        image: slide.image,
        mobileImage: slide.mobileImage,
        title: slide.title,
        subtitle: slide.subtitle
      };
      setSelectedSlide(typedSlide);
      setIsModalOpen(true);
      setHasChanges(false);
    }
  };

  const handleDeleteSlide = async (index: number) => {
    if (!formData) return;

    // Check if this is the last slide
    if (formData.slides.length <= 1) {
      showAlert({
        title: 'Cannot Delete',
        text: 'At least one slide must remain in the hero section.',
        icon: 'warning',
      });
      return;
    }

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
        const slide = formData.slides[index];
        
        if (!slide.id) {
          showAlert({
            title: 'Error',
            text: 'Invalid slide ID',
            icon: 'error',
          });
          return;
        }

        const response = await fetch(`/api/admin/hero?id=${slide.id}&type=slide`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          showAlert({
            title: 'Success',
            text: 'Slide deleted successfully!',
            icon: 'success',
          });
          fetchHeroData();
        } else {
          handleErrorResponse(response);
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
        (slide) => slide.id === selectedSlide.id
      );

      let response;
      if (existingIndex >= 0) {
        // Update existing slide
        response = await fetch('/api/admin/hero', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: selectedSlide.id,
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
        fetchHeroData();
      } else {
        handleErrorResponse(response);
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

  const handleSlideChange = (field: keyof SlideFormData, value: string | { en: string; ur: string }) => {
    if (!selectedSlide) return;
    
    const updatedSlide = {
      ...selectedSlide,
      [field]: value
    };
    setSelectedSlide(updatedSlide);
    setHasChanges(true);
  };

  const handleAddAnnouncement = () => {
    if (!formData) return;
    
    const newId = formData.announcements.length > 0 
      ? Math.max(...formData.announcements.map(a => a.id || 0)) + 1 
      : 1;

    const newAnnouncement: AnnouncementFormData = {
      id: newId,
      text: '',
      icon: 'newspaper',
      language: 'en'
    };
    setSelectedAnnouncement(newAnnouncement);
    setIsAnnouncementModalOpen(true);
    setHasChanges(false);
  };

  const handleEditAnnouncement = async (index: number) => {
    if (!formData) return;

    const result = await showConfirmDialog({
      title: 'Edit Announcement?',
      text: 'Are you sure you want to edit this announcement?',
      confirmButtonText: 'Edit',
      cancelButtonText: 'Cancel',
      icon: 'warning',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      const announcement = formData.announcements[index];
      const typedAnnouncement: AnnouncementFormData = {
        id: announcement.id,
        text: announcement.text,
        icon: announcement.icon,
        language: announcement.language === 'ur' ? 'ur' : 'en'
      };
      setSelectedAnnouncement(typedAnnouncement);
      setIsAnnouncementModalOpen(true);
      setHasChanges(false);
    }
  };

  const handleDeleteAnnouncement = async (index: number) => {
    if (!formData) return;

    // Check if this is the last announcement
    if (formData.announcements.length <= 1) {
      showAlert({
        title: 'Cannot Delete',
        text: 'At least one announcement must remain in the hero section.',
        icon: 'warning',
      });
      return;
    }

    const result = await showConfirmDialog({
      title: 'Delete Announcement?',
      text: 'Are you sure you want to delete this announcement? This action cannot be undone.',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      icon: 'warning',
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        setIsSaving(true);
        const announcement = formData.announcements[index];
        
        if (!announcement.id) {
          showAlert({
            title: 'Error',
            text: 'Invalid announcement ID',
            icon: 'error',
          });
          return;
        }

        const response = await fetch(`/api/admin/hero?id=${announcement.id}&type=announcement`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (data.success) {
          showAlert({
            title: 'Success',
            text: 'Announcement deleted successfully!',
            icon: 'success',
          });
          fetchHeroData();
        } else {
          handleErrorResponse(response);
        }
      } catch (error) {
        showAlert({
          title: 'Error',
          text: 'Failed to delete announcement',
          icon: 'error',
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSaveAnnouncement = async () => {
    if (!formData || !selectedAnnouncement) return;

    try {
      setIsSaving(true);
      const newAnnouncements = [...formData.announcements];
      const existingIndex = newAnnouncements.findIndex(
        (announcement) => announcement.id === selectedAnnouncement.id
      );

      let response;
      if (existingIndex >= 0) {
        // Update existing announcement
        response = await fetch('/api/admin/hero', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: selectedAnnouncement.id,
            announcement: selectedAnnouncement
          }),
        });
      } else {
        // Add new announcement
        response = await fetch('/api/admin/hero', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            announcement: selectedAnnouncement
          }),
        });
      }

      const data = await response.json();

      if (data.success) {
        showAlert({
          title: 'Success',
          text: 'Announcement saved successfully!',
          icon: 'success',
        });
        setIsAnnouncementModalOpen(false);
        setSelectedAnnouncement(null);
        setHasChanges(false);
        fetchHeroData(); // Wait for data to refresh
      } else {
        showAlert({
          title: 'Error',
          text: data.error || 'Failed to save announcement',
          icon: 'error',
        });
      }
    } catch (error) {
      showAlert({
        title: 'Error',
        text: 'Failed to save announcement',
        icon: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditConfig = () => {
    if (!formData) return;
    setSelectedConfig(formData.config);
    setIsConfigModalOpen(true);
    setHasChanges(false);
  };

  const handleSaveConfig = async () => {
    if (!formData || !selectedConfig) return;

    try {
      setIsSaving(true);
      const response = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: selectedConfig
        }),
      });

      const data = await response.json();

      if (data.success) {
        showAlert({
          title: 'Success',
          text: 'Configuration saved successfully!',
          icon: 'success',
        });
        setIsConfigModalOpen(false);
        setSelectedConfig(null);
        setHasChanges(false);
        fetchHeroData();
      } else {
        handleErrorResponse(response);
      }
    } catch (error) {
      showAlert({
        title: 'Error',
        text: 'Failed to save configuration',
        icon: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnnouncementChange = (field: keyof AnnouncementFormData, value: string) => {
    if (!selectedAnnouncement) return;
    
    const updatedAnnouncement = {
      ...selectedAnnouncement,
      [field]: value
    };
    setSelectedAnnouncement(updatedAnnouncement);
    setHasChanges(true);
  };

  const handleConfigChange = (section: 'slider' | 'marquee', field: string, value: number | boolean) => {
    if (!selectedConfig) return;
    
    const updatedConfig = {
      ...selectedConfig,
      [section]: {
        ...selectedConfig[section],
        [field]: value
      }
    };
    setSelectedConfig(updatedConfig);
    setHasChanges(true);
  };

  if (error) {
    return (
      <AdminError 
        error={error} 
        reset={() => {
          setError(null);
          setIsLoading(true);
          fetchHeroData();
        }} 
      />
    );
  }

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
                      className="max-w-[180px] truncate" 
                      title={slide.title.en}
                      style={{ fontFamily: theme.fonts.en.primary }}
                    >
                      {slide.title.en}
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                    <div 
                      className="max-w-[180px] truncate" 
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
                      className="max-w-[180px] truncate" 
                      title={slide.subtitle.en}
                      style={{ fontFamily: theme.fonts.en.primary }}
                    >
                      {slide.subtitle.en}
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                    <div 
                      className="max-w-[180px] truncate" 
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
                        title={formData.slides.length <= 1 ? 'Cannot delete the last slide' : 'Click to delete.'}
                        disabled={formData.slides.length <= 1}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          formData.slides.length <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'
                        }`}
                        style={{ 
                          color: formData.slides.length <= 1 ? theme.colors.text.secondary : theme.colors.status.error 
                        }}
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
    
      {/* Announcements Section */}
      <div className="mb-8 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold" style={{ color: theme.colors.text.primary }}>
            Announcements
          </h2>
          <button
            onClick={handleAddAnnouncement}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.text.light,
            }}
          >
            <FiPlus className="w-4 h-4" />
            Add Announcement
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
                    Text
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ 
                    color: theme.colors.text.secondary,
                    fontFamily: theme.fonts.en.primary 
                  }}>
                    Language
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ 
                    color: theme.colors.text.secondary,
                    fontFamily: theme.fonts.en.primary 
                  }}>
                    Icon
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
                {formData.announcements.map((announcement, index) => (
                  <tr key={index} className="hover:bg-gray-50" style={{ backgroundColor: theme.colors.background.secondary }}>
                    <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                      <div 
                        className="max-w-[500px] truncate" 
                        title={announcement.text}
                        style={{ 
                          fontFamily: announcement.language === 'en' ? theme.fonts.en.primary : theme.fonts.ur.primary,
                          direction: announcement.language === 'ur' ? 'rtl' : 'ltr',
                          textAlign: announcement.language === 'ur' ? 'right' : 'left'
                        }}
                      >
                        {announcement.text}
                      </div>
                    </td>
                    <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                      {announcement.language.toUpperCase()}
                    </td>
                    <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                      {announcement.icon}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditAnnouncement(index)}
                          title='Click to edit.'
                          className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer"
                          style={{ color: theme.colors.primary }}
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAnnouncement(index)}
                          title={formData.announcements.length <= 1 ? 'Cannot delete the last announcement' : 'Click to delete.'}
                          disabled={formData.announcements.length <= 1}
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            formData.announcements.length <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'
                          }`}
                          style={{ 
                            color: formData.announcements.length <= 1 ? theme.colors.text.secondary : theme.colors.status.error 
                          }}
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
      </div>

      {/* Config Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold" style={{ color: theme.colors.text.primary }}>
            Configuration
          </h2>
          <button
            onClick={handleEditConfig}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
            style={{
              backgroundColor: theme.colors.primary,
              color: theme.colors.text.light,
            }}
          >
            <FiSettings className="w-4 h-4" />
            Edit Configuration
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6" style={{ backgroundColor: theme.colors.background.primary }}>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
                Slider Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                    Autoplay Delay (ms)
                  </label>
                  <div className="text-sm" style={{ color: theme.colors.text.primary }}>
                    {formData.config.slider.autoplayDelay}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                    Transition Speed (ms)
                  </label>
                  <div className="text-sm" style={{ color: theme.colors.text.primary }}>
                    {formData.config.slider.transitionSpeed}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                    Pause on Hover
                  </label>
                  <div className="text-sm" style={{ color: theme.colors.text.primary }}>
                    {formData.config.slider.pauseOnHover ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
                Marquee Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                    Repetitions
                  </label>
                  <div className="text-sm" style={{ color: theme.colors.text.primary }}>
                    {formData.config.marquee.repetitions}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                    Speed
                  </label>
                  <div className="text-sm" style={{ color: theme.colors.text.primary }}>
                    {formData.config.marquee.speed}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Announcement Modal */}
      {isAnnouncementModalOpen && selectedAnnouncement && (
        <div className="fixed inset-0 bg-[#61616167] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl" style={{ backgroundColor: theme.colors.background.primary }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>
                {selectedAnnouncement.text ? 'Edit Announcement' : 'Add New Announcement'}
              </h2>
              <button
                onClick={() => {
                  setIsAnnouncementModalOpen(false);
                  setSelectedAnnouncement(null);
                  setHasChanges(false);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <FiX className="w-5 h-5" style={{ color: theme.colors.text.secondary }} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                  Text
                </label>
                <input
                  type="text"
                  value={selectedAnnouncement.text}
                  onChange={(e) => handleAnnouncementChange('text', e.target.value)}
                  className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                  style={{
                    borderColor: theme.colors.border.default,
                    color: theme.colors.text.primary,
                    backgroundColor: theme.colors.background.primary,
                    fontFamily: selectedAnnouncement.language === 'en' ? theme.fonts.en.primary : theme.fonts.ur.primary,
                    direction: selectedAnnouncement.language === 'ur' ? 'rtl' : 'ltr',
                    textAlign: selectedAnnouncement.language === 'ur' ? 'right' : 'left',
                  }}
                />
          </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                    Language
                  </label>
                  <select
                    value={selectedAnnouncement.language}
                    onChange={(e) => handleAnnouncementChange('language', e.target.value as 'en' | 'ur')}
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                    style={{
                      borderColor: theme.colors.border.default,
                      color: theme.colors.text.primary,
                      backgroundColor: theme.colors.background.primary,
                    }}
                  >
                    <option value="en">English</option>
                    <option value="ur">Urdu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                    Icon
                  </label>
                  <select
                    value={selectedAnnouncement.icon}
                    onChange={(e) => handleAnnouncementChange('icon', e.target.value)}
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                    style={{
                      borderColor: theme.colors.border.default,
                      color: theme.colors.text.primary,
                      backgroundColor: theme.colors.background.primary,
                    }}
                  >
                    <option value="newspaper">Newspaper</option>
                    <option value="bullhorn">Bullhorn</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsAnnouncementModalOpen(false);
                  setSelectedAnnouncement(null);
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
                onClick={handleSaveAnnouncement}
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

      {/* Config Modal */}
      {isConfigModalOpen && selectedConfig && (
        <div className="fixed inset-0 bg-[#61616167] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl" style={{ backgroundColor: theme.colors.background.primary }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>
                Edit Configuration
              </h2>
              <button
                onClick={() => {
                  setIsConfigModalOpen(false);
                  setSelectedConfig(null);
                  setHasChanges(false);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <FiX className="w-5 h-5" style={{ color: theme.colors.text.secondary }} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
                  Slider Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                      Autoplay Delay (ms)
                    </label>
                    <input
                      type="number"
                      value={selectedConfig.slider.autoplayDelay}
                      onChange={(e) => handleConfigChange('slider', 'autoplayDelay', parseInt(e.target.value))}
                      className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                      style={{
                        borderColor: theme.colors.border.default,
                        color: theme.colors.text.primary,
                        backgroundColor: theme.colors.background.primary,
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                      Transition Speed (ms)
                    </label>
                    <input
                      type="number"
                      value={selectedConfig.slider.transitionSpeed}
                      onChange={(e) => handleConfigChange('slider', 'transitionSpeed', parseInt(e.target.value))}
                      className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                      style={{
                        borderColor: theme.colors.border.default,
                        color: theme.colors.text.primary,
                        backgroundColor: theme.colors.background.primary,
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                      Pause on Hover
                    </label>
                    <select
                      value={selectedConfig.slider.pauseOnHover ? 'true' : 'false'}
                      onChange={(e) => handleConfigChange('slider', 'pauseOnHover', e.target.value === 'true')}
                      className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                      style={{
                        borderColor: theme.colors.border.default,
                        color: theme.colors.text.primary,
                        backgroundColor: theme.colors.background.primary,
                      }}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
                  Marquee Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                      Repetitions
                    </label>
                    <input
                      type="number"
                      value={selectedConfig.marquee.repetitions}
                      onChange={(e) => handleConfigChange('marquee', 'repetitions', parseInt(e.target.value))}
                      className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                      style={{
                        borderColor: theme.colors.border.default,
                        color: theme.colors.text.primary,
                        backgroundColor: theme.colors.background.primary,
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                      Speed
                    </label>
                    <input
                      type="number"
                      value={selectedConfig.marquee.speed}
                      onChange={(e) => handleConfigChange('marquee', 'speed', parseInt(e.target.value))}
                      className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                      style={{
                        borderColor: theme.colors.border.default,
                        color: theme.colors.text.primary,
                        backgroundColor: theme.colors.background.primary,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsConfigModalOpen(false);
                  setSelectedConfig(null);
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
                onClick={handleSaveConfig}
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