'use client';

import { useState, useEffect } from 'react';
import { TextContent } from '@/data/navbar';
import { theme } from '@/config/theme';
import { FiEdit2, FiSave, FiX, FiImage, FiType } from 'react-icons/fi';
import { showAlert, showConfirmDialog } from '@/utils/alert';

interface NavbarFormData {
  logo: {
    image: string;
    alt: string;
    width: number;
    height: number;
    url: string;
  };
  logoTitle: {
    title: TextContent;
    subTitle: TextContent;
  };
}

export default function NavbarAdmin() {
  const [formData, setFormData] = useState<NavbarFormData | null>(null);
  const [originalData, setOriginalData] = useState<NavbarFormData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [status, setStatus] = useState({
    loading: false,
    error: null as string | null,
    success: false
  });

  useEffect(() => {
    fetchNavbarData();
  }, []);

  useEffect(() => {
    if (formData && originalData) {
      setIsDirty(JSON.stringify(formData) !== JSON.stringify(originalData));
    }
  }, [formData, originalData]);

  const fetchNavbarData = async () => {
    try {
      const response = await fetch('/api/navbar');
      const data = await response.json();
      if (data.success) {
        setFormData(data.data);
        setOriginalData(data.data);
      } else {
        setStatus(prev => ({ ...prev, error: data.error }));
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, error: 'Failed to fetch navbar data' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await showConfirmDialog({
        title: 'Save Changes?',
        text: 'Are you sure you want to save these changes?',
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        setStatus({ loading: true, error: null, success: false });

        const response = await fetch('/api/navbar', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (data.success) {
          setStatus({ loading: false, error: null, success: true });
          setIsEditing(false);
          showAlert({
            text: 'Changes saved successfully!',
            icon: 'success'
          });
        } else {
          throw new Error(data.error || 'Failed to update navbar data');
        }
      }
    } catch (error) {
      setStatus({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        success: false 
      });
      showAlert({
        text: error instanceof Error ? error.message : 'An unknown error occurred',
        icon: 'error'
      });
    }
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: theme.colors.text.primary }}>Header Settings</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: theme.colors.text.light
            }}
          >
            <FiEdit2 className="w-4 h-4" />
            Edit
          </button>
        ) : (
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData(originalData);
              setIsDirty(false);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
            style={{ 
              backgroundColor: theme.colors.status.error,
              color: theme.colors.text.light
            }}
          >
            <FiX className="w-4 h-4" />
            Cancel
          </button>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-8" style={{ backgroundColor: theme.colors.background.primary }}>
        <form className="space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <FiImage className="w-5 h-5" style={{ color: theme.colors.primary }} />
              <h2 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>Logo Settings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                  Image Path
                </label>
                <input
                  type="text"
                  value={formData.logo.image}
                  onChange={e => setFormData({
                    ...formData,
                    logo: { ...formData.logo, image: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  style={{ 
                    borderColor: theme.colors.border.default,  // or .light or .dark depending on your needs
                    color: theme.colors.text.primary,
                    backgroundColor: isEditing ? theme.colors.background.primary : theme.colors.background.secondary
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                  Alt Text
                </label>
                <input
                  type="text"
                  value={formData.logo.alt}
                  onChange={e => setFormData({
                    ...formData,
                    logo: { ...formData.logo, alt: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  style={{ 
                    borderColor: theme.colors.border.default,
                    color: theme.colors.text.primary,
                    backgroundColor: isEditing ? theme.colors.background.primary : theme.colors.background.secondary
                  }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <FiType className="w-5 h-5" style={{ color: theme.colors.primary }} />
              <h2 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>Title Settings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                  Title
                </label>
                <input
                  type="text"
                  value={formData.logoTitle.title.text}
                  onChange={e => setFormData({
                    ...formData,
                    logoTitle: {
                      ...formData.logoTitle,
                      title: { ...formData.logoTitle.title, text: e.target.value }
                    }
                  })}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  style={{ 
                    borderColor: theme.colors.border.default,
                    color: theme.colors.text.primary,
                    backgroundColor: isEditing ? 'white' : theme.colors.background.secondary
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.logoTitle.subTitle.text}
                  onChange={e => setFormData({
                    ...formData,
                    logoTitle: {
                      ...formData.logoTitle,
                      subTitle: { ...formData.logoTitle.subTitle, text: e.target.value }
                    }
                  })}
                  disabled={!isEditing}
                  className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  style={{ 
                    borderColor: theme.colors.border.default,
                    color: theme.colors.text.primary,
                    backgroundColor: isEditing ? 'white' : theme.colors.background.secondary
                  }}
                />
              </div>
            </div>
          </div>

          {(status.error || status.success) && (
            <div 
              className="text-sm p-3 rounded-lg mt-4"
              style={{ 
                backgroundColor: status.error ? `${theme.colors.status.error}15` : `${theme.colors.status.success}15`,
                color: status.error ? theme.colors.status.error : theme.colors.status.success
              }}
            >
              {status.error || 'Successfully updated navbar data!'}
            </div>
          )}

          {isEditing && (
            <div className="pt-6 border-t" style={{ borderColor: theme.colors.border.default }}>
              <button
                onClick={handleSubmit}
                disabled={!isDirty || status.loading}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200 disabled:opacity-50"
                style={{ 
                  backgroundColor: theme.colors.status.success,
                  color: theme.colors.text.light
                }}
              >
                <FiSave className="w-4 h-4" />
                {status.loading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}