'use client';

import { useState, useEffect } from 'react';
import { Partner, PartnerFormData } from '@/types/partners';
import ImageSelector from '../components/ImageSelector';
import DashboardLoader from '../components/DashboardLoader';
import Loader from '../components/Loader';
import AdminError from '../errors/error';
import { theme } from '@/config/theme';
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiImage, FiType } from 'react-icons/fi';
import { showConfirmDialog } from '@/utils/alert';

export default function PartnersAdmin() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; image?: string }>({});
  const [formData, setFormData] = useState<PartnerFormData>({
    name: '',
    image: '',
    altText: '',
    isActive: true,
    showOnHomepage: false
  });
  
  // Partner page settings state
  const [partnerPage, setPartnerPage] = useState<any>(null);
  const [isEditingPartnerPage, setIsEditingPartnerPage] = useState(false);
  const [originalPartnerPage, setOriginalPartnerPage] = useState<any>(null);

  // Helpers to read/write localized fields whether stored as string or {text}
  const getLangText = (obj: any, field: 'title' | 'description', lang: 'en' | 'ur'): string => {
    const container = obj?.[field];
    if (!container) return '';
    const langValue = container?.[lang];
    if (typeof langValue === 'string') return langValue;
    return langValue?.text || '';
  };

  const setLangTextNormalized = (
    prev: any,
    field: 'title' | 'description',
    lang: 'en' | 'ur',
    value: string
  ) => {
    const currentEn = getLangText(prev, field, 'en');
    const currentUr = getLangText(prev, field, 'ur');
    return {
      ...prev,
      [field]: {
        en: { text: lang === 'en' ? value : currentEn },
        ur: { text: lang === 'ur' ? value : currentUr },
      },
    };
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setError(null);
      const response = await fetch('/api/admin/partners');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          if (data.data.partnersList) {
            setPartners(data.data.partnersList);
          }
          if (data.data.partnerPage) {
            setPartnerPage(data.data.partnerPage);
          }
        } else {
          setError(new Error(data.error || 'Failed to fetch partners'));
        }
      } else {
        setError(new Error(`HTTP ${response.status}: ${response.statusText}`));
      }
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to fetch partners'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddPartner = () => {
    setFormData({
      name: '',
      image: '',
      altText: '',
      isActive: true,
      showOnHomepage: false
    });
    setEditingPartner(null);
    setIsModalOpen(true);
    setHasChanges(false);
    setErrors({});
  };

  const handleEditPartner = (partner: Partner) => {
    setFormData({
      name: partner.name,
      image: partner.image,
      altText: partner.altText,
      isActive: partner.isActive !== undefined ? partner.isActive : true,
      showOnHomepage: partner.showOnHomepage !== undefined ? partner.showOnHomepage : false
    });
    setEditingPartner(partner);
    setIsModalOpen(true);
    setHasChanges(false);
    setErrors({});
  };

  const handleDeletePartner = async (id: string) => {
    const result = await showConfirmDialog({
      title: "Delete Partner?",
      text: "Are you sure you want to delete this partner? This action cannot be undone.",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        setIsSaving(true);
        const response = await fetch(`/api/admin/partners?id=${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            fetchPartners();
          } else {
            console.error('Error deleting partner:', result.error);
          }
        }
      } catch (error) {
        console.error('Error deleting partner:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSavePartner = async () => {
    // Clear previous errors
    setErrors({});
    
    // Validation
    const newErrors: { name?: string; image?: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Partner name is required';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Image is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSaving(true);
      const method = editingPartner ? 'PUT' : 'POST';
             const body = editingPartner ? { ...formData, id: editingPartner.id } : formData;
      
      const response = await fetch('/api/admin/partners', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setIsModalOpen(false);
          setEditingPartner(null);
          setFormData({
            name: '',
            image: '',
            altText: '',
            isActive: true,
            showOnHomepage: false
          });
          setHasChanges(false);
          fetchPartners();
        } else {
          console.error('Error saving partner:', result.error);
        }
      }
    } catch (error) {
      console.error('Error saving partner:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormChange = (field: keyof PartnerFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // Clear error for this field if it's being filled
    if (field === 'name' || field === 'image') {
      if (value && typeof value === 'string' && value.trim()) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    }
  };

  // Partner page settings handlers
  const handlePartnerPageChange = (field: string, value: string) => {
    setPartnerPage((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePartnerPageLangChange = (field: string, lang: "en" | "ur", value: string) => {
    setPartnerPage((prev: any) => {
      if (!prev) return prev;
      return setLangTextNormalized(prev, field as 'title' | 'description', lang, value);
    });
  };

  const handlePartnerPageSave = async () => {
    try {
      setIsSaving(true);

      const response = await fetch("/api/admin/partners", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "page",
          partnerPage: partnerPage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save page data");
      }

      const result = await response.json();
      if (result.success) {
        setIsEditingPartnerPage(false);
        setOriginalPartnerPage(null);
        await fetchPartners(); // Refresh the data
      }
    } catch (error) {
      console.error('Error saving partner page:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <DashboardLoader />;
  }

  if (error) {
    return <AdminError error={error} reset={fetchPartners} />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Loader isVisible={isSaving} text="Saving" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: theme.colors.text.primary }}>
          Manage Partners
        </h1>
        <button
          onClick={handleAddPartner}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.text.light,
          }}
        >
          <FiPlus className="w-4 h-4" />
          Add Partner
        </button>
      </div>

      {/* Partner Page Settings */}
      {partnerPage && (
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8" style={{backgroundColor: theme.colors.background.primary}}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isEditingPartnerPage) handlePartnerPageSave();
              }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold" style={{color: theme.colors.text.primary}}>
                  Partner Page Settings
                </h2>
                {!isEditingPartnerPage ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOriginalPartnerPage({...partnerPage});
                      setIsEditingPartnerPage(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
                    style={{backgroundColor: theme.colors.primary, color: theme.colors.text.light}}
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingPartnerPage(false);
                      // Reset to original data without API call
                      if (originalPartnerPage) {
                        setPartnerPage(originalPartnerPage);
                      }
                      setOriginalPartnerPage(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
                    style={{backgroundColor: theme.colors.status.error, color: theme.colors.text.light}}
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>

              {/* Main content: edit or view mode */}
              {!isEditingPartnerPage ? (
                <>
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FiImage className="w-5 h-5" style={{color: theme.colors.primary}} />
                      <h3 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                        Hero Image
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                          Hero Image
                        </label>
                        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {partnerPage.image ? <img src={partnerPage.image} alt="Partner page hero" className="w-full h-full object-cover" /> : <FiImage className="w-8 h-8 text-gray-400" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FiType className="w-5 h-5" style={{color: theme.colors.primary}} />
                      <h3 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                        Page Content
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                            Title (English)
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p style={{color: theme.colors.text.primary}}>{getLangText(partnerPage, 'title', 'en') || "No title set"}</p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                            Description (English)
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p style={{color: theme.colors.text.primary}}>{getLangText(partnerPage, 'description', 'en') || "No description set"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                            Title (Urdu)
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p
                              style={{
                                color: theme.colors.text.primary,
                                fontFamily: theme.fonts.ur.primary,
                                direction: "rtl",
                                textAlign: "right",
                              }}
                            >
                              {getLangText(partnerPage, 'title', 'ur') || "کوئی عنوان سیٹ نہیں"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                            Description (Urdu)
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p
                              style={{
                                color: theme.colors.text.primary,
                                fontFamily: theme.fonts.ur.primary,
                                direction: "rtl",
                                textAlign: "right",
                              }}
                            >
                              {getLangText(partnerPage, 'description', 'ur') || "کوئی تفصیل سیٹ نہیں"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Edit Mode */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FiImage className="w-5 h-5" style={{color: theme.colors.primary}} />
                      <h3 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                        Hero Image
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                          Hero Image
                        </label>
                        <ImageSelector selectedPath={partnerPage.image || ""} onSelect={(imageUrl: string) => handlePartnerPageChange("image", imageUrl)} size="small" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FiType className="w-5 h-5" style={{color: theme.colors.primary}} />
                      <h3 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                        Page Content
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                            Title (English)
                          </label>
                          <input
                            type="text"
                            value={getLangText(partnerPage, 'title', 'en') || ""}
                            onChange={(e) => handlePartnerPageLangChange("title", "en", e.target.value)}
                            className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                            style={{
                              borderColor: theme.colors.border.default,
                              color: theme.colors.text.primary,
                              backgroundColor: theme.colors.background.primary,
                            }}
                            placeholder="Enter page title in English"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                            Description (English)
                          </label>
                          <textarea
                            value={getLangText(partnerPage, 'description', 'en') || ""}
                            onChange={(e) => handlePartnerPageLangChange("description", "en", e.target.value)}
                            rows={4}
                            className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                            style={{
                              borderColor: theme.colors.border.default,
                              color: theme.colors.text.primary,
                              backgroundColor: theme.colors.background.primary,
                            }}
                            placeholder="Enter page description in English"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                            Title (Urdu)
                          </label>
                          <input
                            type="text"
                            value={getLangText(partnerPage, 'title', 'ur') || ""}
                            onChange={(e) => handlePartnerPageLangChange("title", "ur", e.target.value)}
                            className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                            style={{
                              borderColor: theme.colors.border.default,
                              color: theme.colors.text.primary,
                              backgroundColor: theme.colors.background.primary,
                              fontFamily: theme.fonts.ur.primary,
                              direction: "rtl",
                              textAlign: "right",
                            }}
                            placeholder="اردو میں صفحہ کا عنوان درج کریں"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                            Description (Urdu)
                          </label>
                          <textarea
                            value={getLangText(partnerPage, 'description', 'ur') || ""}
                            onChange={(e) => handlePartnerPageLangChange("description", "ur", e.target.value)}
                            rows={4}
                            className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                            style={{
                              borderColor: theme.colors.border.default,
                              color: theme.colors.text.primary,
                              backgroundColor: theme.colors.background.primary,
                              fontFamily: theme.fonts.ur.primary,
                              direction: "rtl",
                              textAlign: "right",
                            }}
                            placeholder="اردو میں صفحہ کی تفصیل درج کریں"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-200 hover:opacity-90 disabled:opacity-50" style={{backgroundColor: theme.colors.secondary, color: theme.colors.text.primary}}>
                      <FiSave className="w-4 h-4" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Partners List Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{color: theme.colors.text.primary}}>
            Partners List
          </h2>
        </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: theme.colors.background.primary }}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y" style={{ borderColor: theme.colors.border.default }}>
            <thead>
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: theme.colors.text.secondary,
                    fontFamily: theme.fonts.en.primary,
                  }}
                >
                  Preview
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: theme.colors.text.secondary,
                    fontFamily: theme.fonts.en.primary,
                  }}
                >
                  Name
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: theme.colors.text.secondary,
                    fontFamily: theme.fonts.en.primary,
                  }}
                >
                  Alt Text
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: theme.colors.text.secondary,
                    fontFamily: theme.fonts.en.primary,
                  }}
                >
                  Status
                </th>
                <th
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: theme.colors.text.secondary,
                    fontFamily: theme.fonts.en.primary,
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: theme.colors.border.default }}>
              {partners.map((partner) => (
                                 <tr key={partner.id} className="hover:bg-gray-50" style={{ backgroundColor: theme.colors.background.secondary }}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <img src={partner.image} alt={partner.altText} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                    <div className="max-w-[180px] truncate" title={partner.name} style={{ fontFamily: theme.fonts.en.primary }}>
                      {partner.name}
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                    <div className="max-w-[180px] truncate" title={partner.altText} style={{ fontFamily: theme.fonts.en.primary }}>
                      {partner.altText}
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${partner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {partner.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {partner.showOnHomepage && (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          Homepage
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEditPartner(partner)} 
                        title="Click to edit." 
                        className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer" 
                        style={{ color: theme.colors.primary }}
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                                             <button
                         onClick={() => handleDeletePartner(partner.id)}
                         title="Click to delete."
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
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#61616167] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl" style={{ backgroundColor: theme.colors.background.primary }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>
                {editingPartner ? 'Edit Partner' : 'Add New Partner'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingPartner(null);
                  setFormData({
                    name: '',
                    image: '',
                    altText: '',
                    isActive: true,
                    showOnHomepage: false
                  });
                  setHasChanges(false);
                  setErrors({});
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <FiX className="w-5 h-5" style={{ color: theme.colors.text.secondary }} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                  Partner Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                  style={{
                    borderColor: theme.colors.border.default,
                    color: theme.colors.text.primary,
                    backgroundColor: theme.colors.background.primary,
                    fontFamily: theme.fonts.en.primary,
                  }}
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                  Image <span className="text-red-500">*</span>
                </label>
                <ImageSelector 
                  selectedPath={formData.image} 
                  onSelect={(path) => handleFormChange('image', path)} 
                  className="w-full" 
                  size="small" 
                />
                {errors.image && (
                  <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                  Alt Text (English)
                </label>
                <textarea
                  value={formData.altText}
                  onChange={(e) => handleFormChange('altText', e.target.value)}
                  className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                  style={{
                    borderColor: theme.colors.border.default,
                    color: theme.colors.text.primary,
                    backgroundColor: theme.colors.background.primary,
                    fontFamily: theme.fonts.en.primary,
                  }}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => handleFormChange('isActive', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                      Active
                    </span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.showOnHomepage}
                      onChange={(e) => handleFormChange('showOnHomepage', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                      Show on Homepage
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingPartner(null);
                  setFormData({
                    name: '',
                    image: '',
                    altText: '',
                    isActive: true,
                    showOnHomepage: false
                  });
                  setHasChanges(false);
                  setErrors({});
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
                onClick={handleSavePartner}
                disabled={isSaving || !hasChanges}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.text.light,
                }}
              >
                <FiSave className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
