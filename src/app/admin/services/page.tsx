"use client";

import React, { useEffect, useState, useCallback } from "react";
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiImage, FiType, FiEye } from "react-icons/fi";
import { showAlert, showConfirmDialog } from "@/utils/alert";
import Loader from "../components/Loader";
import DashboardLoader from "../components/DashboardLoader";
import { theme } from "@/config/theme";
import { useRouter } from "next/navigation";
import AdminError from "../errors/error";
import type { ServiceDetail, KeyFeature, ImpactMetric, ServicePageContent } from '@/types/services';
import ImageSelector from '@/app/admin/components/ImageSelector';

export default function ServicesAdmin() {
  const [services, setServices] = useState<ServiceDetail[]>([]);
  const [servicePage, setServicePage] = useState<ServicePageContent | null>(null);
  const [isEditingServicePage, setIsEditingServicePage] = useState(false);
  const [servicePageDirty, setServicePageDirty] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [modalLanguage, setModalLanguage] = useState<'en' | 'ur'>('en');
  const [keyFeatureModalOpen, setKeyFeatureModalOpen] = useState(false);
  const [editingKeyFeature, setEditingKeyFeature] = useState<KeyFeature | null>(null);
  const [impactModalOpen, setImpactModalOpen] = useState(false);
  const [editingImpact, setEditingImpact] = useState<ImpactMetric | null>(null);
  const [editingImpactIndex, setEditingImpactIndex] = useState<number | null>(null);
  const [showUrduTable, setShowUrduTable] = useState(false);
  const router = useRouter();

  const labels = {
    title: { en: "Title", ur: "عنوان" },
    shortDescription: { en: "Short Description", ur: "مختصر وضاحت" },
    fullDescription: { en: "Full Description", ur: "مکمل وضاحت" },
    heroImage: { en: "Hero Image", ur: "ہیرو تصویر" },
    iconName: { en: "Icon Name", ur: "آئیکن نام" },
    slug: { en: "Slug", ur: "سلگ" },
    showOnHomepage: { en: "Show on Homepage", ur: "ہوم پیج پر دکھائیں" },
    titlesAndDescriptions: { en: "Titles & Descriptions", ur: "عنوانات اور وضاحتیں" },
    keyFeatures: { en: "Key Features", ur: "اہم خصوصیات" },
    description: { en: "Description", ur: "وضاحت" },
    impact: { en: "Impact", ur: "اثرات" },
    label: { en: "Label", ur: "لیبل" },
    value: { en: "Value", ur: "قدر" },
    suffix: { en: "Suffix", ur: "لاحقہ" },
    prefix: { en: "Prefix", ur: "سابقہ" },
    serviceImageAndIcon: { en: "Service Image & Icon", ur: "سروس تصویر اور آئیکن" },
    add: { en: "Add", ur: "شامل کریں" },
    edit: { en: "Edit", ur: "ترمیم کریں" },
    cancel: { en: "Cancel", ur: "منسوخ کریں" },
    save: { en: "Save", ur: "محفوظ کریں" }
  };

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/services");
      const data = await response.json();
      if (data.success) {
        setServices(data.data.servicesList || []);
        setServicePage(data.data.servicePage || null);
        setIsLoading(false);
      } else {
        setError(new Error(data.error || "Failed to fetch services"));
        setIsLoading(false);
      }
    } catch (err) {
      setError(new Error("Failed to fetch services"));
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleAddService = () => {
    setSelectedService({
      heroImage: "",
      iconName: "",
      slug: "",
      showOnHomepage: false,
      en: {
        title: { text: "" },
        shortDescription: { text: "" },
        fullDescription: { text: "" },
        impactTitle: { text: "" },
        keyFeaturesTitle: { text: "" },
        overviewTitle: { text: "" },
        keyFeatures: [],
        impact: [],
        socialShare: {
          title: { text: "" },
          description: { text: "" },
          hashtags: [],
          twitterHandle: "",
          ogType: ""
        }
      },
      ur: {
        title: { text: "" },
        shortDescription: { text: "" },
        fullDescription: { text: "" },
        impactTitle: { text: "" },
        keyFeaturesTitle: { text: "" },
        overviewTitle: { text: "" },
        keyFeatures: [],
        impact: [],
        socialShare: {
          title: { text: "" },
          description: { text: "" },
          hashtags: [],
          twitterHandle: "",
          ogType: ""
        }
      },
      id: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    });
    setIsModalOpen(true);
    setHasChanges(false);
  };

  const handleEditService = (index: number) => {
    const service = services[index];
    setSelectedService({
      ...service,
      en: {
        ...service.en,
        title: { text: service.en?.title?.text || "" },
        shortDescription: { text: service.en?.shortDescription?.text || "" },
        fullDescription: { text: service.en?.fullDescription?.text || "" },
        impactTitle: { text: service.en?.impactTitle?.text || "" },
        keyFeaturesTitle: { text: service.en?.keyFeaturesTitle?.text || "" },
        overviewTitle: { text: service.en?.overviewTitle?.text || "" },
        keyFeatures: service.en?.keyFeatures || [],
        impact: service.en?.impact || [],
        socialShare: service.en?.socialShare || { title: { text: "" }, description: { text: "" }, hashtags: [], twitterHandle: "", ogType: "" }
      },
      ur: {
        ...service.ur,
        title: { text: service.ur?.title?.text || "" },
        shortDescription: { text: service.ur?.shortDescription?.text || "" },
        fullDescription: { text: service.ur?.fullDescription?.text || "" },
        impactTitle: { text: service.ur?.impactTitle?.text || "" },
        keyFeaturesTitle: { text: service.ur?.keyFeaturesTitle?.text || "" },
        overviewTitle: { text: service.ur?.overviewTitle?.text || "" },
        keyFeatures: service.ur?.keyFeatures || [],
        impact: service.ur?.impact || [],
        socialShare: service.ur?.socialShare || { title: { text: "" }, description: { text: "" }, hashtags: [], twitterHandle: "", ogType: "" }
      }
    });
    setIsModalOpen(true);
    setHasChanges(false);
  };

  const handleDeleteService = async (index: number) => {
    const result = await showConfirmDialog({
      title: "Delete Service?",
      text: "Are you sure you want to delete this service? This action cannot be undone.",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      icon: "warning",
      showCancelButton: true,
    });
    if (result.isConfirmed) {
      try {
        setIsSaving(true);
        const service = services[index];
        const response = await fetch(`/api/admin/services?id=${service.id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (data.success) {
          showAlert({
            title: "Success",
            text: "Service deleted successfully!",
            icon: "success",
          });
          fetchServices();
        } else {
          showAlert({
            title: "Error",
            text: data.error || "Failed to delete service",
            icon: "error",
          });
        }
      } catch (err) {
        showAlert({
          title: "Error",
          text: "Failed to delete service",
          icon: "error",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSaveService = async () => {
    if (!selectedService) return;
    try {
      setIsSaving(true);
      let response;
      if (selectedService.id) {
        // Update
        response = await fetch("/api/admin/services", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedService),
        });
      } else {
        // Add
        response = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(selectedService),
        });
      }
      const data = await response.json();
      if (data.success) {
        showAlert({
          title: "Success",
          text: "Service saved successfully!",
          icon: "success",
        });
        setIsModalOpen(false);
        setSelectedService(null);
        setHasChanges(false);
        fetchServices();
      } else {
        showAlert({
          title: "Error",
          text: data.error || "Failed to save service",
          icon: "error",
        });
      }
    } catch (err) {
      showAlert({
        title: "Error",
        text: "Failed to save service",
        icon: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleServiceChange = (field: keyof ServiceDetail, value: ServiceDetail[keyof ServiceDetail]) => {
    if (!selectedService) return;
    setSelectedService({ ...selectedService, [field]: value });
    setHasChanges(true);
  };

  // Font/layout helpers
  const getFontFamily = () => language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary;
  const getDirection = () => language === 'ur' ? 'rtl' : 'ltr';
  const getTextAlign = () => language === 'ur' ? 'text-right' : 'text-left';

  // ServicePage edit handlers
  const handleServicePageChange = (field: keyof ServicePageContent, value: ServicePageContent[keyof ServicePageContent]) => {
    if (!servicePage) return;
    setServicePage({ ...servicePage, [field]: value });
    setServicePageDirty(true);
  };
  const handleServicePageLangChange = (section: 'title' | 'description', lang: 'en' | 'ur', value: string) => {
    if (!servicePage) return;
    setServicePage({
      ...servicePage,
      [section]: {
        ...servicePage[section],
        [lang]: {
          ...servicePage[section][lang],
          text: value,
        },
      },
    });
    setServicePageDirty(true);
  };
  const handleServicePageSave = async () => {
    if (!servicePage) return;
    setIsSaving(true);
    try {
      const response = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servicePage }),
      });
      const data = await response.json();
      if (data.success) {
        showAlert({ title: "Success", text: "Service page updated successfully!", icon: "success" });
        setIsEditingServicePage(false);
        setServicePageDirty(false);
        fetchServices();
      } else {
        showAlert({ title: "Error", text: data.error || "Failed to update service page", icon: "error" });
      }
    } catch (err) {
      showAlert({ title: "Error", text: "Failed to update service page", icon: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // Count homepage services for enforcing max 4
  const homepageCount = services.filter(s => s.showOnHomepage && (!selectedService || s.id !== selectedService.id)).length;

  // Helper to update key features for the selected language
  const updateKeyFeatures = (features: KeyFeature[]) => {
    if (!selectedService) return;
    setSelectedService({
      ...selectedService,
      [language]: {
        ...selectedService[language],
        keyFeatures: features,
      },
    });
    setHasChanges(true);
  };
  // Helper to update impact for the selected language
  const updateImpact = (impact: ImpactMetric[]) => {
    if (!selectedService) return;
    setSelectedService({
      ...selectedService,
      [language]: {
        ...selectedService[language],
        impact: impact,
      },
    });
    setHasChanges(true);
  };

  // Key Features: always assign id as string
  const handleSaveKeyFeature = () => {
    if (!editingKeyFeature?.title.text) return;
    let features = selectedService?.[language].keyFeatures || [];
    if (editingKeyFeature.id && features.some(f => f.id === editingKeyFeature.id)) {
      features = features.map(f => f.id === editingKeyFeature.id ? { ...editingKeyFeature, id: editingKeyFeature.id! } : f);
    } else {
      features = [...features, { ...editingKeyFeature, id: Date.now().toString() }];
    }
    updateKeyFeatures(features);
    setKeyFeatureModalOpen(false);
    setEditingKeyFeature(null);
  };
  // Impact: use editingImpactIndex for edit
  const handleSaveImpact = () => {
    if (!editingImpact?.label.text) return;
    let impact = selectedService?.[language].impact || [];
    if (editingImpactIndex !== null) {
      impact = impact.map((f, i) => i === editingImpactIndex ? editingImpact : f);
    } else {
      impact = [...impact, editingImpact];
    }
    updateImpact(impact);
    setImpactModalOpen(false);
    setEditingImpact(null);
    setEditingImpactIndex(null);
  };

  const handleMiniModalLanguageSwitch = (lang: 'en' | 'ur') => {
    setModalLanguage(lang);
    if (editingKeyFeature && selectedService) {
      const features = selectedService[lang].keyFeatures;
      const kf = features.find(f => f.id === editingKeyFeature.id);
      setEditingKeyFeature(
        kf || { id: editingKeyFeature.id, title: { text: '' }, description: { text: '' } }
      );
    }
    if (editingImpact && selectedService) {
      const impactArr = selectedService[lang].impact;
      const imp = impactArr.find(i => i.id === editingImpact.id);
      setEditingImpact(
        imp || { id: editingImpact.id, label: { text: '' }, value: '', iconName: '' }
      );
    }
  };

  if (error) {
    return (
      <AdminError
        error={error}
        reset={() => {
          setError(null);
          setIsLoading(true);
          fetchServices();
        }}
      />
    );
  }

  if (isLoading) {
    return <DashboardLoader />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Loader isVisible={isSaving} text="Saving" />
      {/* Service Page Details - now matches header form 100% */}
      {servicePage && (
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8" style={{ backgroundColor: theme.colors.background.primary }}>
            <form onSubmit={e => { e.preventDefault(); if (isEditingServicePage) handleServicePageSave(); }} className="space-y-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold" style={{ color: theme.colors.text.primary }}>
                  Service Page Settings
                </h1>
                {!isEditingServicePage ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingServicePage(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: theme.colors.primary, color: theme.colors.text.light }}
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setIsEditingServicePage(false); setServicePageDirty(false); fetchServices(); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: theme.colors.status.error, color: theme.colors.text.light }}
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>
              {/* Main content: edit or view mode */}
              {!isEditingServicePage ? (
                <>
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FiImage className="w-5 h-5" style={{ color: theme.colors.primary }} />
                      <h2 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                        Logo/Image
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                          Logo Image
                        </label>
                        {servicePage.image ? (
                          <img src={servicePage.image} alt="Service Page" className="w-full max-w-xs rounded" />
                        ) : (
                          <div className="w-full p-3 rounded-lg border bg-gray-50 text-gray-400 italic">No image</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FiType className="w-5 h-5" style={{ color: theme.colors.primary }} />
                      <h2 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                        Title & Description
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                          Title (English)
                        </label>
                        <div className="w-full p-3 rounded-lg border bg-gray-50" style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, fontFamily: theme.fonts.en.primary }}>
                          {servicePage.title?.en?.text || <span className="text-gray-400 italic">No title</span>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                          Title (Urdu)
                        </label>
                        <div className="w-full p-3 rounded-lg border bg-gray-50" style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }}>
                          {servicePage.title?.ur?.text || <span className="text-gray-400 italic">No title</span>}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                          Description (English)
                        </label>
                        <div className="w-full p-3 rounded-lg border bg-gray-50" style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, fontFamily: theme.fonts.en.primary }}>
                          {servicePage.description?.en?.text || <span className="text-gray-400 italic">No description</span>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                          Description (Urdu)
                        </label>
                        <div className="w-full p-3 rounded-lg border bg-gray-50" style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }}>
                          {servicePage.description?.ur?.text || <span className="text-gray-400 italic">No description</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FiImage className="w-5 h-5" style={{ color: theme.colors.primary }} />
                      <h2 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                        Logo/Image
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Hero Image</label>
                        <ImageSelector
                          selectedPath={servicePage.image}
                          onSelect={path => handleServicePageChange('image', path)}
                          className="w-full"
                          disabled={!isEditingServicePage}
                          size="small"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FiType className="w-5 h-5" style={{ color: theme.colors.primary }} />
                      <h2 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                        Title & Description
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                          Title (English)
                        </label>
                        <input
                          type="text"
                          value={servicePage.title?.en?.text || ''}
                          onChange={e => handleServicePageLangChange('title', 'en', e.target.value)}
                          disabled={!isEditingServicePage}
                          className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                          style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: isEditingServicePage ? 'white' : theme.colors.background.secondary, fontFamily: theme.fonts.en.primary }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                          Title (Urdu)
                        </label>
                        <input
                          type="text"
                          value={servicePage.title?.ur?.text || ''}
                          onChange={e => handleServicePageLangChange('title', 'ur', e.target.value)}
                          disabled={!isEditingServicePage}
                          className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                          style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: isEditingServicePage ? 'white' : theme.colors.background.secondary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                          Description (English)
                        </label>
                        <input
                          type="text"
                          value={servicePage.description?.en?.text || ''}
                          onChange={e => handleServicePageLangChange('description', 'en', e.target.value)}
                          disabled={!isEditingServicePage}
                          className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                          style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: isEditingServicePage ? 'white' : theme.colors.background.secondary, fontFamily: theme.fonts.en.primary }}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                          Description (Urdu)
                        </label>
                        <input
                          type="text"
                          value={servicePage.description?.ur?.text || ''}
                          onChange={e => handleServicePageLangChange('description', 'ur', e.target.value)}
                          disabled={!isEditingServicePage}
                          className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed"
                          style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: isEditingServicePage ? 'white' : theme.colors.background.secondary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t" style={{ borderColor: theme.colors.border.default }}>
                    <button
                      type="submit"
                      disabled={!servicePageDirty || isSaving}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200 disabled:opacity-50 cursor-pointer"
                      style={{ backgroundColor: theme.colors.status.success, color: theme.colors.text.light }}
                    >
                      <FiSave className="w-4 h-4" />
                      {isSaving ? "Saving Changes..." : "Save Changes"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: theme.colors.text.primary }}>
          Manage Services
        </h1>
        <button
          onClick={handleAddService}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: theme.colors.primary, color: theme.colors.text.light }}
        >
          <FiPlus className="w-4 h-4" />
          Add Service
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: theme.colors.background.primary }}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y" style={{ borderColor: theme.colors.border.default }}>
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts.en.primary }}>Preview</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts.en.primary }}>Title (EN)</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts.en.primary }}>Title (UR)</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts.en.primary }}>Show on Homepage</th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts.en.primary }}>View</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts.en.primary }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: theme.colors.border.default }}>
              {services.map((service, index) => (
                <tr key={service.id || index} className="hover:bg-gray-50" style={{ backgroundColor: theme.colors.background.secondary }}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <img src={service.heroImage} alt={service.en?.title?.text || ''} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                    <div className="max-w-[180px] truncate" title={service.en?.title?.text || ''} style={{ fontFamily: theme.fonts.en.primary }}>{service.en?.title?.text || <span className="text-gray-400 italic">No title</span>}</div>
                  </td>
                  <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                    <div className="max-w-[180px] truncate" title={service.ur?.title?.text || ''} style={{ fontFamily: theme.fonts.ur.primary, direction: "rtl", textAlign: "right" }}>{service.ur?.title?.text || <span className="text-gray-400 italic">No title</span>}</div>
                  </td>
                  <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>{service.showOnHomepage ? "Yes" : "No"}</td>
                  <td className="px-6 py-4 text-center">
                    <a
                      href={`/services/${service.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View Service"
                      className="inline-flex items-center justify-center p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100"
                      style={{ color: theme.colors.primary }}
                    >
                      <FiEye className="w-5 h-5" />
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEditService(index)} title="Click to edit." className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer" style={{ color: theme.colors.primary }}>
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteService(index)} title="Click to delete." className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer" style={{ color: theme.colors.status.error }}>
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
      {/* Edit/Add Modal */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 bg-[#61616167] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl flex flex-col" style={{ backgroundColor: theme.colors.background.primary }}>
            <div style={{ maxHeight: '80vh', overflowY: 'auto' }} className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>{selectedService.id ? "Edit Service" : "Add New Service"}</h2>
                <button onClick={() => { setIsModalOpen(false); setSelectedService(null); setHasChanges(false); }} className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <FiX className="w-5 h-5" style={{ color: theme.colors.text.secondary }} />
                </button>
              </div>
              {/* Language Switcher */}
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={() => handleMiniModalLanguageSwitch('en')}
                  className={`px-4 py-2 rounded transition-colors duration-300 ${modalLanguage === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                  style={{ fontFamily: theme.fonts.en.primary }}
                >
                  English
                </button>
                <button
                  onClick={() => handleMiniModalLanguageSwitch('ur')}
                  className={`px-4 py-2 rounded transition-colors duration-300 ${modalLanguage === 'ur' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                  style={{ fontFamily: theme.fonts.ur.primary }}
                >
                  اردو
                </button>
              </div>
              <form onSubmit={e => { e.preventDefault(); handleSaveService(); }} className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FiImage className="w-5 h-5" style={{ color: theme.colors.primary }} />
                    <span className="text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                      Service Image & Icon
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Hero Image</label>
                      <ImageSelector
                        selectedPath={selectedService.heroImage}
                        onSelect={path => handleServiceChange('heroImage', path)}
                        className="w-full"
                        disabled={isSaving}
                        size="small"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Icon Name</label>
                      <input type="text" value={selectedService.iconName} onChange={e => handleServiceChange("iconName", e.target.value)} className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50" style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2 flex items-center">
                      <label className="block text-sm font-medium mr-4" style={{ color: theme.colors.text.secondary }}>Show on Homepage</label>
                      <button
                        type="button"
                        onClick={() => handleServiceChange('showOnHomepage', !selectedService.showOnHomepage)}
                        className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none ${selectedService.showOnHomepage ? 'bg-blue-600' : 'bg-gray-300'}`}
                        disabled={!selectedService.showOnHomepage && homepageCount >= 4}
                        style={{ border: `1px solid ${theme.colors.border.default}` }}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${selectedService.showOnHomepage ? 'translate-x-6' : 'translate-x-1'}`}></span>
                      </button>
                      {selectedService.showOnHomepage && (
                        <div className="text-xs text-red-500 mt-1 mb-2">Only 4 services can be shown on the homepage.</div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Slug</label>
                      <input type="text" value={selectedService.slug} onChange={e => handleServiceChange("slug", e.target.value)} className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50" style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary }} />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FiType className="w-5 h-5" style={{ color: theme.colors.primary }} />
                    <span className="text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                      {labels.titlesAndDescriptions[modalLanguage]}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2" style={{ direction: modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[modalLanguage].primary }}>
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>{labels.title[modalLanguage]}</label>
                      <input type="text" value={selectedService[modalLanguage].title.text} onChange={e => handleServiceChange(modalLanguage, { ...selectedService[modalLanguage], title: { ...selectedService[modalLanguage].title, text: e.target.value } })} className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50" style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts[modalLanguage].primary }} />
                    </div>
                    <div className="space-y-2" style={{ direction: modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[modalLanguage].primary }}>
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>{labels.shortDescription[modalLanguage]}</label>
                      <input type="text" value={selectedService[modalLanguage].shortDescription.text} onChange={e => handleServiceChange(modalLanguage, { ...selectedService[modalLanguage], shortDescription: { ...selectedService[modalLanguage].shortDescription, text: e.target.value } })} className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50" style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts[modalLanguage].primary }} />
                    </div>
                  </div>
                  <div className="space-y-2" style={{ direction: modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[modalLanguage].primary }}>
                    <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>{labels.fullDescription[modalLanguage]}</label>
                    <textarea value={selectedService[modalLanguage].fullDescription.text} onChange={e => handleServiceChange(modalLanguage, { ...selectedService[modalLanguage], fullDescription: { text: e.target.value } })} className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50" style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts[modalLanguage].primary }} rows={3} />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FiType className="w-5 h-5" style={{ color: theme.colors.primary }} />
                    <span className="text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                      Key Features
                    </span>
                    <button type="button" onClick={() => { setEditingKeyFeature(null); setKeyFeatureModalOpen(true); }} className="ml-auto px-3 py-1 rounded bg-blue-600 text-white">Add</button>
                  </div>
                  <table className="min-w-full divide-y" style={{ borderColor: theme.colors.border.default }}>
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[modalLanguage].primary }}>Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[modalLanguage].primary }}>Description</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[modalLanguage].primary }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: theme.colors.border.default }}>
                      {selectedService[modalLanguage].keyFeatures.map((kf, idx) => (
                        <tr key={kf.id || idx} className="hover:bg-gray-50" style={{ backgroundColor: theme.colors.background.secondary }}>
                          <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                            <div className="max-w-[180px] truncate" title={kf.title.text}>{kf.title.text}</div>
                          </td>
                          <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                            <div className="max-w-[180px] truncate" title={kf.description.text}>{kf.description.text}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button type="button" onClick={() => { setEditingKeyFeature(kf); setKeyFeatureModalOpen(true); }} className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer" style={{ color: theme.colors.primary }}>
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button type="button" onClick={() => {
                                const features = selectedService[modalLanguage].keyFeatures.filter((f) => f.id !== kf.id);
                                updateKeyFeatures(features);
                              }} className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer" style={{ color: theme.colors.status.error }}>
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FiType className="w-5 h-5" style={{ color: theme.colors.primary }} />
                    <span className="text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                      Impact
                    </span>
                    <button type="button" onClick={() => { setEditingImpact(null); setEditingImpactIndex(null); setImpactModalOpen(true); }} className="ml-auto px-3 py-1 rounded bg-blue-600 text-white">Add</button>
                  </div>
                  <table className="min-w-full divide-y" style={{ borderColor: theme.colors.border.default }}>
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[modalLanguage].primary }}>Label</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[modalLanguage].primary }}>Value</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[modalLanguage].primary }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: theme.colors.border.default }}>
                      {selectedService[modalLanguage].impact.map((imp, idx) => (
                        <tr key={imp.id || idx} className="hover:bg-gray-50" style={{ backgroundColor: theme.colors.background.secondary }}>
                          <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                            <div className="max-w-[180px] truncate" title={imp.label.text}>{imp.label.text}</div>
                          </td>
                          <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                            <div className="max-w-[180px] truncate" title={imp.value}>{imp.value}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button type="button" onClick={() => { setEditingImpact(imp); setEditingImpactIndex(idx); setImpactModalOpen(true); }} className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer" style={{ color: theme.colors.primary }}>
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button type="button" onClick={() => {
                                const impact = selectedService[modalLanguage].impact.filter((f) => f.id !== imp.id);
                                updateImpact(impact);
                              }} className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer" style={{ color: theme.colors.status.error }}>
                                <FiTrash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pt-6 border-t mt-6 flex justify-end gap-4" style={{ borderColor: theme.colors.border.default }}>
                  <button type="button" onClick={() => { setIsModalOpen(false); setSelectedService(null); setHasChanges(false); }} className="px-4 py-2 rounded-lg transition-colors duration-200" style={{ backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={isSaving || !hasChanges} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50" style={{ backgroundColor: theme.colors.primary, color: theme.colors.text.light }}>
                    <FiSave className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Key Feature Modal */}
      {keyFeatureModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.text.primary, fontFamily: getFontFamily() }}>{editingKeyFeature ? labels.edit[modalLanguage] : labels.add[modalLanguage]} {labels.keyFeatures[modalLanguage]}</h3>
            {/* Language Switcher */}
            <div className="flex justify-center gap-4 mb-4">
              <button
                type="button"
                onClick={() => handleMiniModalLanguageSwitch('en')}
                className={`px-4 py-2 rounded transition-colors duration-300 ${modalLanguage === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                style={{ fontFamily: theme.fonts.en.primary }}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleMiniModalLanguageSwitch('ur')}
                className={`px-4 py-2 rounded transition-colors duration-300 ${modalLanguage === 'ur' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                style={{ fontFamily: theme.fonts.ur.primary }}
              >
                اردو
              </button>
            </div>
            <div className="mb-4" style={{ direction: modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[modalLanguage].primary }}>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>{labels.title[modalLanguage]}</label>
              <input type="text" value={editingKeyFeature?.title.text || ''} onChange={e => setEditingKeyFeature(editingKeyFeature ? { ...editingKeyFeature, title: { text: e.target.value } } : { id: Date.now().toString(), title: { text: e.target.value }, description: { text: '' } })} className="w-full p-2 border rounded" style={{ color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.default, fontFamily: theme.fonts[modalLanguage].primary }} />
            </div>
            <div className="mb-4" style={{ direction: modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[modalLanguage].primary }}>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>{labels.description[modalLanguage]}</label>
              <input type="text" value={editingKeyFeature?.description.text || ''} onChange={e => setEditingKeyFeature(editingKeyFeature ? { ...editingKeyFeature, description: { text: e.target.value } } : { id: Date.now().toString(), title: { text: '' }, description: { text: e.target.value } })} className="w-full p-2 border rounded" style={{ color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.default, fontFamily: theme.fonts[modalLanguage].primary }} />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setKeyFeatureModalOpen(false)} className="px-4 py-2 rounded bg-gray-200" style={{ color: theme.colors.text.primary }}>{labels.cancel[modalLanguage]}</button>
              <button type="button" onClick={handleSaveKeyFeature} className="px-4 py-2 rounded bg-blue-600 text-white">{labels.save[modalLanguage]}</button>
            </div>
          </div>
        </div>
      )}
      {/* Impact Modal */}
      {impactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.text.primary, fontFamily: getFontFamily() }}>{editingImpactIndex !== null ? labels.edit[modalLanguage] : labels.add[modalLanguage]} {labels.impact[modalLanguage]}</h3>
            {/* Language Switcher */}
            <div className="flex justify-center gap-4 mb-4">
              <button
                type="button"
                onClick={() => handleMiniModalLanguageSwitch('en')}
                className={`px-4 py-2 rounded transition-colors duration-300 ${modalLanguage === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                style={{ fontFamily: theme.fonts.en.primary }}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleMiniModalLanguageSwitch('ur')}
                className={`px-4 py-2 rounded transition-colors duration-300 ${modalLanguage === 'ur' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                style={{ fontFamily: theme.fonts.ur.primary }}
              >
                اردو
              </button>
            </div>
            <div className="mb-4" style={{ direction: modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[modalLanguage].primary }}>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>{labels.label[modalLanguage]}</label>
              <input type="text" value={editingImpact?.label.text || ''} onChange={e => setEditingImpact(editingImpact ? { ...editingImpact, label: { text: e.target.value } } : { id: Date.now().toString(), label: { text: e.target.value }, value: '', iconName: '' })} className="w-full p-2 border rounded" style={{ color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.default, fontFamily: theme.fonts[modalLanguage].primary }} />
            </div>
            <div className="mb-4" style={{ direction: modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[modalLanguage].primary }}>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>{labels.value[modalLanguage]}</label>
              <input type="text" value={editingImpact?.value || ''} onChange={e => setEditingImpact(editingImpact ? { ...editingImpact, value: e.target.value } : { id: Date.now().toString(), label: { text: '' }, value: e.target.value, iconName: '' })} className="w-full p-2 border rounded" style={{ color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.default, fontFamily: theme.fonts[modalLanguage].primary }} />
            </div>
            <div className="mb-4" style={{ direction: modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[modalLanguage].primary }}>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>{labels.suffix[modalLanguage]}</label>
              <input type="text" value={editingImpact?.suffix || ''} onChange={e => setEditingImpact(editingImpact ? { ...editingImpact, suffix: e.target.value } : { id: Date.now().toString(), label: { text: '' }, value: '', iconName: '', suffix: e.target.value })} className="w-full p-2 border rounded" style={{ color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.default, fontFamily: theme.fonts[modalLanguage].primary }} />
            </div>
            <div className="mb-4" style={{ direction: modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[modalLanguage].primary }}>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>{labels.iconName[modalLanguage]}</label>
              <input type="text" value={editingImpact?.iconName || ''} onChange={e => setEditingImpact(editingImpact ? { ...editingImpact, iconName: e.target.value } : { id: Date.now().toString(), label: { text: '' }, value: '', iconName: e.target.value })} className="w-full p-2 border rounded" style={{ color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.default, fontFamily: theme.fonts[modalLanguage].primary }} />
            </div>
            <div className="mb-4" style={{ direction: modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[modalLanguage].primary }}>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>{labels.prefix[modalLanguage]}</label>
              <input type="text" value={editingImpact?.prefix || ''} onChange={e => setEditingImpact(editingImpact ? { ...editingImpact, prefix: e.target.value } : { id: Date.now().toString(), label: { text: '' }, value: '', iconName: '', prefix: e.target.value })} className="w-full p-2 border rounded" style={{ color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.default, fontFamily: theme.fonts[modalLanguage].primary }} />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setImpactModalOpen(false); setEditingImpact(null); setEditingImpactIndex(null); }} className="px-4 py-2 rounded bg-gray-200" style={{ color: theme.colors.text.primary }}>{labels.cancel[modalLanguage]}</button>
              <button type="button" onClick={handleSaveImpact} className="px-4 py-2 rounded bg-blue-600 text-white">{labels.save[modalLanguage]}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 