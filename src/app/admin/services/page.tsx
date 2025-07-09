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
import IconSelector from '@/app/admin/components/IconSelector';

// Types for better type safety
interface ServiceFormState {
  services: ServiceDetail[];
  servicePage: ServicePageContent | null;
  selectedService: ServiceDetail | null;
  isLoading: boolean;
  isSaving: boolean;
  error: Error | null;
}

interface UIState {
  isModalOpen: boolean;
  isEditingServicePage: boolean;
  servicePageDirty: boolean;
  hasChanges: boolean;
  language: 'en' | 'ur';
  modalLanguage: 'en' | 'ur';
  miniModalLanguage: 'en' | 'ur';
}

interface ValidationState {
  missingFields: string[];
  homepageLimitError: string;
  missingOppositeLang: string[];
}

interface ModalState {
  keyFeatureModalOpen: boolean;
  impactModalOpen: boolean;
  editingKeyFeature: KeyFeature | null;
  editingImpact: ImpactMetric | null;
  editingImpactIndex: number | null;
}

interface PromptState {
  showSwitchLangPrompt: boolean;
  showSwitchFeatureLangPrompt: boolean;
  showSwitchImpactLangPrompt: boolean;
  keyFeatureRequiredInOpposite: boolean;
  impactRequiredInOpposite: boolean;
}

export default function ServicesAdmin() {
  // Form state
  const [formState, setFormState] = useState<ServiceFormState>({
    services: [],
    servicePage: null,
    selectedService: null,
    isLoading: true,
    isSaving: false,
    error: null,
  });

  // UI state
  const [uiState, setUIState] = useState<UIState>({
    isModalOpen: false,
    isEditingServicePage: false,
    servicePageDirty: false,
    hasChanges: false,
    language: 'en',
    modalLanguage: 'en',
    miniModalLanguage: 'en',
  });

  // Validation state
  const [validationState, setValidationState] = useState<ValidationState>({
    missingFields: [],
    homepageLimitError: '',
    missingOppositeLang: [],
  });

  // Modal state
  const [modalState, setModalState] = useState<ModalState>({
    keyFeatureModalOpen: false,
    impactModalOpen: false,
    editingKeyFeature: null,
    editingImpact: null,
    editingImpactIndex: null,
  });

  // Prompt state
  const [promptState, setPromptState] = useState<PromptState>({
    showSwitchLangPrompt: false,
    showSwitchFeatureLangPrompt: false,
    showSwitchImpactLangPrompt: false,
    keyFeatureRequiredInOpposite: false,
    impactRequiredInOpposite: false,
  });

  // Legacy state variables for backward compatibility (will be removed gradually)
  const [showUrduTable, setShowUrduTable] = useState(false);
  const router = useRouter();

  // Labels for UI text in both languages
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
    save: { en: "Save", ur: "محفوظ کریں" },
    homepageLimitError: { en: "Homepage Limit Error", ur: "ہوم پیج حد خطر" }
  };

  // Helper functions for state updates
  const updateFormState = (updates: Partial<ServiceFormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  const updateUIState = (updates: Partial<UIState>) => {
    setUIState(prev => ({ ...prev, ...updates }));
  };

  const updateValidationState = (updates: Partial<ValidationState>) => {
    setValidationState(prev => ({ ...prev, ...updates }));
  };

  const updateModalState = (updates: Partial<ModalState>) => {
    setModalState(prev => ({ ...prev, ...updates }));
  };

  const updatePromptState = (updates: Partial<PromptState>) => {
    setPromptState(prev => ({ ...prev, ...updates }));
  };

  // API functions
  const fetchServices = useCallback(async () => {
    updateFormState({ isLoading: true });
    try {
      const response = await fetch("/api/admin/services");
      const data = await response.json();
      if (data.success) {
        updateFormState({
          services: data.data.servicesList || [],
          servicePage: data.data.servicePage || null,
          isLoading: false,
        });
      } else {
        updateFormState({
          error: new Error(data.error || "Failed to fetch services"),
          isLoading: false,
        });
      }
    } catch (err) {
      updateFormState({
        error: new Error("Failed to fetch services"),
        isLoading: false,
      });
    }
  }, []);

  // Effects
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    if (uiState.isModalOpen && formState.selectedService) {
      const homepageCount = formState.services.filter(s =>
        s.showOnHomepage && (!formState.selectedService?.id || s.id !== formState.selectedService.id)
      ).length;

      if (!formState.selectedService.showOnHomepage && homepageCount >= 4) {
        updateValidationState({
          homepageLimitError: 'You can only show up to 4 services on the homepage. Please remove one before adding another.'
        });
      } else {
        updateValidationState({ homepageLimitError: '' });
      }
    }
  }, [uiState.isModalOpen, formState.selectedService, formState.services]);

  useEffect(() => {
    if (promptState.showSwitchLangPrompt) {
      const timer = setTimeout(() => updatePromptState({ showSwitchLangPrompt: false }), 5000);
      return () => clearTimeout(timer);
    }
  }, [promptState.showSwitchLangPrompt]);

  // Service management functions
  const createEmptyService = (): ServiceDetail => ({
    heroImage: "",
    iconName: "",
    slug: "",
    showOnHomepage: false,
    socialShare: {
      title: { text: "" },
      description: { text: "" },
      hashtags: [],
      twitterHandle: "",
      ogType: "article"
    },
    en: {
      title: { text: "" },
      shortDescription: { text: "" },
      fullDescription: { text: "" },
      impactTitle: { text: "" },
      keyFeaturesTitle: { text: "" },
      overviewTitle: { text: "" },
      keyFeatures: [],
      impact: [],
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
    },
    id: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  });

  const handleAddService = () => {
    const newService = createEmptyService();
    updateFormState({ selectedService: newService });
    updateUIState({ isModalOpen: true, hasChanges: false });
  };

  const normalizeServiceForEdit = (service: ServiceDetail): ServiceDetail => ({
    ...service,
    en: {
      ...service.en,
      title: { text: service.en?.title?.text || "" },
      shortDescription: { text: service.en?.shortDescription?.text || "" },
      fullDescription: { text: service.en?.fullDescription?.text || "" },
      impactTitle: { text: service.en?.impactTitle?.text || "" },
      keyFeaturesTitle: { text: service.en?.keyFeaturesTitle?.text || "" },
      overviewTitle: { text: service.en?.overviewTitle?.text || "" },
      keyFeatures: (service.en?.keyFeatures || []).map(kf => ({
        ...kf,
        description: kf.description ? kf.description : { text: "" }
      })),
      impact: service.en?.impact || [],
    },
    ur: {
      ...service.ur,
      title: { text: service.ur?.title?.text || "" },
      shortDescription: { text: service.ur?.shortDescription?.text || "" },
      fullDescription: { text: service.ur?.fullDescription?.text || "" },
      impactTitle: { text: service.ur?.impactTitle?.text || "" },
      keyFeaturesTitle: { text: service.ur?.keyFeaturesTitle?.text || "" },
      overviewTitle: { text: service.ur?.overviewTitle?.text || "" },
      keyFeatures: (service.ur?.keyFeatures || []).map(kf => ({
        ...kf,
        description: kf.description ? kf.description : { text: "" }
      })),
      impact: service.ur?.impact || [],
    },
    socialShare: {
      title: { text: service.socialShare?.title?.text || "" },
      description: { text: service.socialShare?.description?.text || "" },
      hashtags: service.socialShare?.hashtags || [],
      twitterHandle: service.socialShare?.twitterHandle || "",
      ogType: service.socialShare?.ogType || "article"
    }
  });

  const handleEditService = (index: number) => {
    const service = formState.services[index];
    const normalizedService = normalizeServiceForEdit(service);
    updateFormState({ selectedService: normalizedService });
    updateUIState({ isModalOpen: true, hasChanges: false });
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
        updateFormState({ isSaving: true });
        const service = formState.services[index];
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
        updateFormState({ isSaving: false });
      }
    }
  };

  const handleServiceChange = (field: keyof ServiceDetail, value: ServiceDetail[keyof ServiceDetail]) => {
    if (!formState.selectedService) return;
    updateFormState({
      selectedService: { ...formState.selectedService, [field]: value }
    });
    updateUIState({ hasChanges: true });
  };

  // Font/layout helpers
  const getFontFamily = () => uiState.language === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary;
  const getDirection = () => uiState.language === 'ur' ? 'rtl' : 'ltr';
  const getTextAlign = () => uiState.language === 'ur' ? 'text-right' : 'text-left';

  // ServicePage edit handlers
  const handleServicePageChange = (field: keyof ServicePageContent, value: ServicePageContent[keyof ServicePageContent]) => {
    if (!formState.servicePage) return;
    updateFormState({
      servicePage: { ...formState.servicePage, [field]: value }
    });
    updateUIState({ servicePageDirty: true });
  };

  const handleServicePageLangChange = (section: 'title' | 'description', lang: 'en' | 'ur', value: string) => {
    if (!formState.servicePage) return;
    updateFormState({
      servicePage: {
        ...formState.servicePage,
        [section]: {
          ...formState.servicePage[section],
          [lang]: {
            ...formState.servicePage[section][lang],
            text: value,
          },
        },
      }
    });
    updateUIState({ servicePageDirty: true });
  };

  const handleServicePageSave = async () => {
    if (!formState.servicePage) return;
    updateFormState({ isSaving: true });
    try {
      const response = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servicePage: formState.servicePage }),
      });
      const data = await response.json();
      if (data.success) {
        showAlert({ title: "Success", text: "Service page updated successfully!", icon: "success" });
        updateUIState({ isEditingServicePage: false, servicePageDirty: false });
        fetchServices();
      } else {
        showAlert({ title: "Error", text: data.error || "Failed to update service page", icon: "error" });
      }
    } catch (err) {
      showAlert({ title: "Error", text: "Failed to update service page", icon: "error" });
    } finally {
      updateFormState({ isSaving: false });
    }
  };

  // Count homepage services for enforcing max 4
  const homepageCount = formState.services.filter(s =>
    s.showOnHomepage && (!formState.selectedService || s.id !== formState.selectedService.id)
  ).length;

  // Helper to update key features for the selected language
  const updateKeyFeatures = (features: KeyFeature[]) => {
    if (!formState.selectedService) return;
    updateFormState({
      selectedService: {
        ...formState.selectedService,
        [uiState.modalLanguage]: {
          ...formState.selectedService[uiState.modalLanguage],
          keyFeatures: features,
        },
      }
    });
    updateUIState({ hasChanges: true });
  };

  // Helper to update impact for the selected language
  const updateImpact = (impact: ImpactMetric[]) => {
    if (!formState.selectedService) return;
    updateFormState({
      selectedService: {
        ...formState.selectedService,
        [uiState.modalLanguage]: {
          ...formState.selectedService[uiState.modalLanguage],
          impact: impact,
        },
      }
    });
    updateUIState({ hasChanges: true });
  };

  // Key Features: always assign id as string
  const handleSaveKeyFeature = () => {
    if (!modalState.editingKeyFeature?.title?.text) return;
    if (!formState.selectedService) return;

    let features = formState.selectedService[uiState.miniModalLanguage]?.keyFeatures || [];

    if (modalState.editingKeyFeature.id && features.some(f => f.id === modalState.editingKeyFeature?.id)) {
      features = features.map(f =>
        f.id === modalState.editingKeyFeature?.id
          ? { ...modalState.editingKeyFeature, id: modalState.editingKeyFeature.id! }
          : f
      );
    } else {
      features = [...features, { ...modalState.editingKeyFeature, id: modalState.editingKeyFeature.id || Date.now().toString() }];
    }

    updateFormState({
      selectedService: {
        ...formState.selectedService,
        [uiState.miniModalLanguage]: {
          ...formState.selectedService[uiState.miniModalLanguage],
          keyFeatures: features,
        },
      }
    });

    // Check if this key feature exists in the opposite language
    const oppositeLang = uiState.miniModalLanguage === 'en' ? 'ur' : 'en';
    const oppositeFeatures = formState.selectedService[oppositeLang]?.keyFeatures || [];
    const featureExistsInOpposite = oppositeFeatures.some(f => f.id === modalState.editingKeyFeature?.id);

    // If feature doesn't exist in opposite language, keep modal open and switch language
    if (!featureExistsInOpposite) {
      // Switch to opposite language and show required validation
      updateUIState({ miniModalLanguage: oppositeLang });
      updatePromptState({
        keyFeatureRequiredInOpposite: true
      });
      // Set up editing for the opposite language with same ID
      updateModalState({
        editingKeyFeature: {
          id: modalState.editingKeyFeature?.id || Date.now().toString(),
          title: { text: '' },
          description: { text: '' }
        }
      });
      // Keep modal open - don't close it
    } else {
      // Both languages have the feature, close modal and clear required state
      updateModalState({
        keyFeatureModalOpen: false,
        editingKeyFeature: null,
      });
      updatePromptState({
        keyFeatureRequiredInOpposite: false
      });
    }

    updateUIState({ hasChanges: true });
  };

  // Impact: use editingImpactIndex for edit
  const handleSaveImpact = () => {
    if (!modalState.editingImpact?.label?.text) return;
    if (!formState.selectedService) return;

    let impact = formState.selectedService[uiState.miniModalLanguage]?.impact || [];

    if (modalState.editingImpactIndex !== null && modalState.editingImpact) {
      impact = impact.map((f, i) => i === modalState.editingImpactIndex ? modalState.editingImpact! : f);
    } else if (modalState.editingImpact) {
      impact = [...impact, modalState.editingImpact];
    }

    updateFormState({
      selectedService: {
        ...formState.selectedService,
        [uiState.miniModalLanguage]: {
          ...formState.selectedService[uiState.miniModalLanguage],
          impact: impact,
        },
      }
    });

    // Check if this impact entry exists in the opposite language
    const oppositeLang = uiState.miniModalLanguage === 'en' ? 'ur' : 'en';
    const oppositeImpact = formState.selectedService[oppositeLang]?.impact || [];
    const impactExistsInOpposite = oppositeImpact.some(i => i.id === modalState.editingImpact?.id);

    // If impact doesn't exist in opposite language, keep modal open and switch language
    if (!impactExistsInOpposite) {
      // Switch to opposite language and show required validation
      updateUIState({ miniModalLanguage: oppositeLang });
      updatePromptState({
        impactRequiredInOpposite: true
      });
      // Set up editing for the opposite language with same ID
      updateModalState({
        editingImpact: {
          id: modalState.editingImpact?.id || Date.now().toString(),
          label: { text: '' },
          value: '',
          iconName: '',
          prefix: '',
          suffix: ''
        },
        editingImpactIndex: null, // Reset index for new entry
      });
      // Keep modal open - don't close it
    } else {
      // Both languages have the impact, close modal and clear required state
      updateModalState({
        impactModalOpen: false,
        editingImpact: null,
        editingImpactIndex: null,
      });
      updatePromptState({
        impactRequiredInOpposite: false
      });
    }

    updateUIState({ hasChanges: true });
  };

  const handleMiniModalLanguageSwitch = (lang: 'en' | 'ur') => {
    updateUIState({ miniModalLanguage: lang });

    if (modalState.editingKeyFeature && formState.selectedService && modalState.editingKeyFeature.id) {
      const features = formState.selectedService[lang].keyFeatures || [];
      const kf = features.find(f => f.id === modalState.editingKeyFeature?.id);
      updateModalState({
        editingKeyFeature: kf || {
          id: modalState.editingKeyFeature.id,
          title: { text: '' },
          description: { text: '' }
        }
      });
    }

    if (modalState.editingImpact && formState.selectedService && modalState.editingImpact.id) {
      const impactArr = formState.selectedService[lang].impact || [];
      const imp = impactArr.find(i => i.id === modalState.editingImpact?.id);
      updateModalState({
        editingImpact: imp || {
          id: modalState.editingImpact.id,
          label: { text: '' },
          value: '',
          iconName: '',
          prefix: '',
          suffix: ''
        }
      });
    }
  };

  const openKeyFeatureModal = () => {
    // Don't force language - let it use current miniModalLanguage or default to modalLanguage
    if (!uiState.miniModalLanguage) {
      updateUIState({ miniModalLanguage: uiState.modalLanguage });
    }
    updateModalState({
      impactModalOpen: false,
      keyFeatureModalOpen: true,
      editingKeyFeature: null,
      editingImpact: null,
      editingImpactIndex: null,
    });
  };

  const closeKeyFeatureModal = () => {
    updateModalState({
      keyFeatureModalOpen: false,
      editingKeyFeature: null,
    });
  };

  const openImpactModal = () => {
    // Don't force language - let it use current miniModalLanguage or default to modalLanguage
    if (!uiState.miniModalLanguage) {
      updateUIState({ miniModalLanguage: uiState.modalLanguage });
    }
    updateModalState({
      keyFeatureModalOpen: false,
      impactModalOpen: true,
      editingImpact: null,
      editingImpactIndex: null,
      editingKeyFeature: null,
    });
  };

  const closeImpactModal = () => {
    updateModalState({
      impactModalOpen: false,
      editingImpact: null,
      editingImpactIndex: null,
    });
  };

  const validateService = (service: ServiceDetail) => {
    const requiredFields = [
      // Service Image & Icon (required)
      { key: 'heroImage', value: service.heroImage },
      // Titles & Descriptions (required for both languages)
      { key: 'en.title', value: service.en.title.text },
      { key: 'en.shortDescription', value: service.en.shortDescription.text },
      { key: 'en.fullDescription', value: service.en.fullDescription.text },
      { key: 'ur.title', value: service.ur.title.text },
      { key: 'ur.shortDescription', value: service.ur.shortDescription.text },
      { key: 'ur.fullDescription', value: service.ur.fullDescription.text },
      // Social Share Settings (required)
      { key: 'socialShare.title', value: service.socialShare.title.text },
      { key: 'socialShare.description', value: service.socialShare.description.text },
      { key: 'socialShare.hashtags', value: Array.isArray(service.socialShare.hashtags) && service.socialShare.hashtags.length > 0 ? 'ok' : '' },
      { key: 'socialShare.twitterHandle', value: service.socialShare.twitterHandle },
      { key: 'socialShare.ogType', value: service.socialShare.ogType },
    ];
    return requiredFields.filter(f => !f.value).map(f => f.key);
  };

  const checkLanguageConsistency = (service: ServiceDetail, currentLang: 'en' | 'ur') => {
    const oppositeLang = currentLang === 'en' ? 'ur' : 'en';

    // Check for missing key features in the opposite language
    const features = service[currentLang]?.keyFeatures || [];
    const featuresOpposite = service[oppositeLang]?.keyFeatures || [];
    const missingFeatureIds = features.filter(f => !featuresOpposite.some(of => of.id === f.id));

    // Check for missing impact in the opposite language
    const impactArr = service[currentLang]?.impact || [];
    const impactOpposite = service[oppositeLang]?.impact || [];
    const missingImpactIds = impactArr.filter(f => !impactOpposite.some(of => of.id === f.id));

    return {
      missingFeatures: missingFeatureIds.length > 0,
      missingImpact: missingImpactIds.length > 0,
    };
  };

  const handleSaveService = async () => {
    if (validationState.homepageLimitError && formState.selectedService && formState.selectedService.showOnHomepage === false) return;
    if (!formState.selectedService) return;

    const missing = validateService(formState.selectedService);
    updateValidationState({ missingFields: missing });

    // Check for missing fields in the opposite language first (only show one popup)
    const oppositeLang = uiState.modalLanguage === 'en' ? 'ur' : 'en';
    const oppositeLangMissing = missing.filter(f => f.startsWith(`${oppositeLang}.`));

    if (oppositeLangMissing.length > 0) {
      updateValidationState({ missingOppositeLang: oppositeLangMissing });
      updatePromptState({ showSwitchLangPrompt: true });
      console.log("Missing opposite language fields:", oppositeLangMissing);
      return;
    }

    // Check if all required fields are filled
    if (missing.length > 0) {
      console.log("Missing required fields:", missing);
      return;
    }

    // Check for key features and impact consistency (only if they exist)
    const languageCheck = checkLanguageConsistency(formState.selectedService, uiState.modalLanguage);

    if (languageCheck.missingFeatures) {
      updatePromptState({ showSwitchFeatureLangPrompt: true });
      return;
    }

    if (languageCheck.missingImpact) {
      updatePromptState({ showSwitchImpactLangPrompt: true });
      return;
    }

    try {
      updateFormState({ isSaving: true });
      let response;
      // eslint-disable-next-line prefer-const
      let payload = { ...formState.selectedService };

      const isNewService = !formState.selectedService.id || formState.selectedService.id === "";

      console.log("Saving service:", { isNewService, payload });

      if (isNewService) {
        // Generate a new id for new service
        payload.id = Date.now().toString();
        // Generate slug if not provided
        if (!payload.slug) {
          payload.slug = payload.en.title.text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        console.log("POST payload:", payload);
        // Add
        response = await fetch("/api/admin/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        console.log("PUT payload:", payload);
        // Update
        response = await fetch("/api/admin/services", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (data.success) {
        showAlert({
          title: "Success",
          text: "Service saved successfully!",
          icon: "success",
        });

        // Reset all states
        updateFormState({ selectedService: null });
        updateUIState({ isModalOpen: false, hasChanges: false });
        updatePromptState({
          showSwitchLangPrompt: false,
          showSwitchFeatureLangPrompt: false,
          showSwitchImpactLangPrompt: false,
        });

        fetchServices();
      } else {
        console.error("Save failed:", data);
        showAlert({
          title: "Error",
          text: data.error || "Failed to save service",
          icon: "error",
        });
      }
    } catch (err) {
      console.error("Save error:", err);
      showAlert({
        title: "Error",
        text: "Failed to save service",
        icon: "error",
      });
    } finally {
      updateFormState({ isSaving: false });
    }
  };

  if (formState.error) {
    return (
      <AdminError
        error={formState.error}
        reset={() => {
          updateFormState({ error: null, isLoading: true });
          fetchServices();
        }}
      />
    );
  }

  if (formState.isLoading) {
    return <DashboardLoader />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Loader isVisible={formState.isSaving} text="Saving" />
      {/* Service Page Details - now matches header form 100% */}
      {formState.servicePage && (
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8" style={{ backgroundColor: theme.colors.background.primary }}>
            <form onSubmit={e => { e.preventDefault(); if (uiState.isEditingServicePage) handleServicePageSave(); }} className="space-y-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold" style={{ color: theme.colors.text.primary }}>
                  Service Page Settings
                </h1>
                {!uiState.isEditingServicePage ? (
                  <button
                    type="button"
                    onClick={() => updateUIState({ isEditingServicePage: true })}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: theme.colors.primary, color: theme.colors.text.light }}
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      updateUIState({ isEditingServicePage: false, servicePageDirty: false });
                      fetchServices();
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: theme.colors.status.error, color: theme.colors.text.light }}
                  >
                    <FiX className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>
              {/* Main content: edit or view mode */}
              {!uiState.isEditingServicePage ? (
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
                        {formState.servicePage.image ? (
                          <img src={formState.servicePage.image} alt="Service Page" className="w-full max-w-xs rounded" />
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
                          {formState.servicePage.title?.en?.text || <span className="text-gray-400 italic">No title</span>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                          Title (Urdu)
                        </label>
                        <div className="w-full p-3 rounded-lg border bg-gray-50" style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }}>
                          {formState.servicePage.title?.ur?.text || <span className="text-gray-400 italic">No title</span>}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                          Description (English)
                        </label>
                        <div className="w-full p-3 rounded-lg border bg-gray-50" style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, fontFamily: theme.fonts.en.primary }}>
                          {formState.servicePage.description?.en?.text || <span className="text-gray-400 italic">No description</span>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                          Description (Urdu)
                        </label>
                        <div className="w-full p-3 rounded-lg border bg-gray-50" style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }}>
                          {formState.servicePage.description?.ur?.text || <span className="text-gray-400 italic">No description</span>}
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
                          selectedPath={formState.servicePage.image}
                          onSelect={path => handleServicePageChange('image', path)}
                          className="w-full"
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
                          value={formState.servicePage.title?.en?.text || ''}
                          onChange={e => handleServicePageLangChange('title', 'en', e.target.value)}
                          className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes('en.title') ? 'border-red-500' : ''}`}
                          style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: uiState.isEditingServicePage ? 'white' : theme.colors.background.secondary, fontFamily: theme.fonts.en.primary }}
                          required
                        />
                        {validationState.missingFields.includes('en.title') && (
                          <p className="text-xs text-red-600 mt-1">This field is required.</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                          Title (Urdu)
                        </label>
                        <input
                          type="text"
                          value={formState.servicePage.title?.ur?.text || ''}
                          onChange={e => handleServicePageLangChange('title', 'ur', e.target.value)}
                          className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes('ur.title') ? 'border-red-500' : ''}`}
                          style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: uiState.isEditingServicePage ? 'white' : theme.colors.background.secondary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }}
                          required
                        />
                        {validationState.missingFields.includes('ur.title') && (
                          <p className="text-xs text-red-600 mt-1">This field is required.</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                          Description (English)
                        </label>
                        <input
                          type="text"
                          value={formState.servicePage.description?.en?.text || ''}
                          onChange={e => handleServicePageLangChange('description', 'en', e.target.value)}
                          className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes('en.description') ? 'border-red-500' : ''}`}
                          style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: uiState.isEditingServicePage ? 'white' : theme.colors.background.secondary, fontFamily: theme.fonts.en.primary }}
                          required
                        />
                        {validationState.missingFields.includes('en.description') && (
                          <p className="text-xs text-red-600 mt-1">This field is required.</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                          Description (Urdu)
                        </label>
                        <input
                          type="text"
                          value={formState.servicePage.description?.ur?.text || ''}
                          onChange={e => handleServicePageLangChange('description', 'ur', e.target.value)}
                          className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes('ur.description') ? 'border-red-500' : ''}`}
                          style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: uiState.isEditingServicePage ? 'white' : theme.colors.background.secondary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }}
                          required
                        />
                        {validationState.missingFields.includes('ur.description') && (
                          <p className="text-xs text-red-600 mt-1">This field is required.</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t" style={{ borderColor: theme.colors.border.default }}>
                    <button
                      type="submit"
                      disabled={!uiState.servicePageDirty || formState.isSaving}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200 disabled:opacity-50 cursor-pointer"
                      style={{ backgroundColor: theme.colors.status.success, color: theme.colors.text.light }}
                    >
                      <FiSave className="w-4 h-4" />
                      {formState.isSaving ? "Saving Changes..." : "Save Changes"}
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
              {formState.services.map((service, index) => (
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
      {uiState.isModalOpen && formState.selectedService && (
        <div className="fixed inset-0 bg-[#61616167] flex items-center justify-center z-50">
          {/* Floating language switch mini-popup */}
          {promptState.showSwitchLangPrompt && (
            <div
              className="fixed left-1/2 top-8 z-50 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in"
              style={{ minWidth: 320, maxWidth: 400 }}
            >
              <div className="flex-1 text-sm text-center">
                {uiState.modalLanguage === 'en'
                  ? 'Some required fields are missing in Urdu. Please switch to Urdu and fill them.'
                  : 'Some required fields are missing in English. Please switch to English and fill them.'}
              </div>
              <button
                type="button"
                onClick={() => {
                  updateUIState({ modalLanguage: uiState.modalLanguage === 'en' ? 'ur' : 'en' });
                  updatePromptState({ showSwitchLangPrompt: false });
                }}
                className="px-3 py-1 rounded bg-blue-600 text-white text-xs shadow"
              >
                Switch to {uiState.modalLanguage === 'en' ? 'Urdu' : 'English'}
              </button>
              <button
                type="button"
                onClick={() => updatePromptState({ showSwitchLangPrompt: false })}
                className="ml-2 p-1 rounded hover:bg-yellow-200"
                aria-label="Close"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl flex flex-col" style={{ backgroundColor: theme.colors.background.primary }}>
            <div style={{ maxHeight: '80vh', overflowY: 'auto' }} className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>{formState.selectedService.id ? "Edit Service" : "Add New Service"}</h2>
                <button onClick={() => {
                  updateUIState({ isModalOpen: false, hasChanges: false });
                  updateFormState({ selectedService: null });
                  updateValidationState({ missingFields: [], homepageLimitError: '' });
                  updatePromptState({ showSwitchLangPrompt: false });
                }} className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <FiX className="w-5 h-5" style={{ color: theme.colors.text.secondary }} />
                </button>
              </div>
              {/* Language Switcher (main modal) */}
              <div className="flex justify-center gap-4 mb-6">
                <button
                  onClick={() => updateUIState({ modalLanguage: 'en' })}
                  className={`px-4 py-2 rounded transition-colors duration-300 ${uiState.modalLanguage === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                  style={{ fontFamily: theme.fonts.en.primary }}
                >
                  English
                </button>
                <button
                  onClick={() => updateUIState({ modalLanguage: 'ur' })}
                  className={`px-4 py-2 rounded transition-colors duration-300 ${uiState.modalLanguage === 'ur' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                  style={{ fontFamily: theme.fonts.ur.primary }}
                >
                  اردو
                </button>
              </div>
              <form onSubmit={e => { e.preventDefault(); handleSaveService(); }} className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                    <FiImage className="w-5 h-5" style={{ color: theme.colors.primary }} />
                    <span className="text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                      {labels.serviceImageAndIcon[uiState.modalLanguage]}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Hero Image</label>
                      <ImageSelector
                        selectedPath={formState.selectedService?.heroImage || ''}
                        onSelect={path => handleServiceChange('heroImage', path)}
                        className="w-full"
                        size="small"
                      />
                      {!formState.selectedService?.heroImage && <div className="text-xs text-red-500 mt-1">Required</div>}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Icon Name</label>
                      <IconSelector
                        selectedIcon={formState.selectedService?.iconName || ''}
                        onSelect={(iconName) => handleServiceChange("iconName", iconName)}
                        size="small"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 flex flex-wrap items-center">
                    <div className="flex w-100 justify-between">
                      <label className="block text-sm font-medium mr-4" style={{ color: theme.colors.text.secondary }}>{labels.showOnHomepage[uiState.modalLanguage]}</label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => formState.selectedService && handleServiceChange('showOnHomepage', !formState.selectedService.showOnHomepage)}
                          className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none ${formState.selectedService?.showOnHomepage ? 'bg-blue-600' : 'bg-gray-300'}`}
                          style={{ border: `1px solid ${theme.colors.border.default}` }}
                          disabled={!formState.selectedService?.showOnHomepage && homepageCount >= 4}
                        >
                          <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${formState.selectedService?.showOnHomepage ? 'translate-x-6' : 'translate-x-1'}`}></span>
                        </button>
                      </div>
                    </div>
                    {validationState.homepageLimitError && (
                      <div className="w-full text-yellow-800 text-xs mt-1 bg-yellow-100 border border-yellow-300 rounded px-2 py-1" style={{ fontWeight: 500 }}>
                        {validationState.homepageLimitError}
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Slug</label>
                    <input type="text" value={formState.selectedService?.slug || ''} onChange={e => handleServiceChange("slug", e.target.value)} className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50" style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary }} required />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                    <FiType className="w-5 h-5" style={{ color: theme.colors.primary }} />
                    <span className="text-lg font-semibold" style={{ color: theme.colors.text.primary }} >
                      {labels.titlesAndDescriptions[uiState.modalLanguage]}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>{labels.title[uiState.modalLanguage]}</label>
                      <input
                        type="text"
                        value={formState.selectedService?.[uiState.modalLanguage]?.title?.text || ''}
                        onChange={e => formState.selectedService && handleServiceChange(uiState.modalLanguage, { ...formState.selectedService[uiState.modalLanguage], title: { ...formState.selectedService[uiState.modalLanguage].title, text: e.target.value } })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes(`${uiState.modalLanguage}.title`) ? 'border-red-500' : ''}`}
                        style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}
                        required
                      />
                      {validationState.missingFields.includes(`${uiState.modalLanguage}.title`) && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>
                    <div className="space-y-2" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>{labels.shortDescription[uiState.modalLanguage]}</label>
                      <input
                        type="text"
                        value={formState.selectedService?.[uiState.modalLanguage]?.shortDescription?.text || ''}
                        onChange={e => formState.selectedService && handleServiceChange(uiState.modalLanguage, { ...formState.selectedService[uiState.modalLanguage], shortDescription: { ...formState.selectedService[uiState.modalLanguage].shortDescription, text: e.target.value } })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes(`${uiState.modalLanguage}.shortDescription`) ? 'border-red-500' : ''}`}
                        style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}
                        required
                      />
                      {validationState.missingFields.includes(`${uiState.modalLanguage}.shortDescription`) && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                    <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>{labels.fullDescription[uiState.modalLanguage]}</label>
                    <textarea
                      value={formState.selectedService?.[uiState.modalLanguage]?.fullDescription?.text || ''}
                      onChange={e => formState.selectedService && handleServiceChange(uiState.modalLanguage, { ...formState.selectedService[uiState.modalLanguage], fullDescription: { text: e.target.value } })}
                      className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes(`${uiState.modalLanguage}.fullDescription`) ? 'border-red-500' : ''}`}
                      style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}
                      rows={3}
                      required
                    />
                    {validationState.missingFields.includes(`${uiState.modalLanguage}.fullDescription`) && (
                      <p className="text-xs text-red-600 mt-1">This field is required.</p>
                    )}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                    <FiType className="w-5 h-5" style={{ color: theme.colors.primary }} />
                    <span className="text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                      Social Share Settings
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Title</label>
                      <input
                        type="text"
                        value={formState.selectedService?.socialShare?.title?.text || ''}
                        onChange={e => formState.selectedService && handleServiceChange('socialShare', { ...formState.selectedService.socialShare, title: { text: e.target.value } })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes('socialShare.title') ? 'border-red-500' : ''}`}
                        style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary }}
                        required
                      />
                      {validationState.missingFields.includes('socialShare.title') && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Description</label>
                      <input
                        type="text"
                        value={formState.selectedService?.socialShare?.description?.text || ''}
                        onChange={e => formState.selectedService && handleServiceChange('socialShare', { ...formState.selectedService.socialShare, description: { text: e.target.value } })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes('socialShare.description') ? 'border-red-500' : ''}`}
                        style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary }}
                        required
                      />
                      {validationState.missingFields.includes('socialShare.description') && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Hashtags</label>
                      <input
                        type="text"
                        value={formState.selectedService?.socialShare?.hashtags?.join(', ') || ''}
                        onChange={e => formState.selectedService && handleServiceChange('socialShare', { ...formState.selectedService.socialShare, hashtags: e.target.value.split(',').map(h => h.trim()) })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes('socialShare.hashtags') ? 'border-red-500' : ''}`}
                        style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary }}
                        required
                      />
                      {validationState.missingFields.includes('socialShare.hashtags') && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Twitter Handle</label>
                      <input
                        type="text"
                        value={formState.selectedService?.socialShare?.twitterHandle || ''}
                        onChange={e => formState.selectedService && handleServiceChange('socialShare', { ...formState.selectedService.socialShare, twitterHandle: e.target.value })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes('socialShare.twitterHandle') ? 'border-red-500' : ''}`}
                        style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary }}
                        required
                      />
                      {validationState.missingFields.includes('socialShare.twitterHandle') && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>OG Type</label>
                      <select
                        value={formState.selectedService?.socialShare?.ogType || 'article'}
                        onChange={e => formState.selectedService && handleServiceChange('socialShare', { ...formState.selectedService.socialShare, ogType: e.target.value })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes('socialShare.ogType') ? 'border-red-500' : ''}`}
                        style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary }}
                        required
                      >
                        <option value="article">article</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                    <FiType className="w-5 h-5" style={{ color: theme.colors.primary }} />
                    <span className="text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                      {labels.keyFeatures[uiState.modalLanguage]}
                    </span>
                    <button type="button" onClick={() => {
                      updateModalState({
                        editingKeyFeature: { id: Date.now().toString(), title: { text: '' }, description: { text: '' } },
                        editingImpact: null,
                        editingImpactIndex: null,
                      });
                      // Set mini modal language to current main modal language
                      updateUIState({ miniModalLanguage: uiState.modalLanguage });
                      updateModalState({ keyFeatureModalOpen: true });
                    }} className="ml-auto px-3 py-1 rounded bg-blue-600 text-white">Add</button>
                  </div>
                  <table className="min-w-full divide-y" style={{ borderColor: theme.colors.border.default }}>
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>Description</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: theme.colors.border.default }}>
                      {(formState.selectedService?.[uiState.modalLanguage]?.keyFeatures || []).map((kf, idx) => (
                        <tr key={kf.id || idx} className="hover:bg-gray-50" style={{ backgroundColor: theme.colors.background.secondary }}>
                          <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                            <div className="max-w-[180px] truncate" title={kf.title.text}>{kf.title.text}</div>
                          </td>
                          <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                            <div className="max-w-[180px] truncate" title={kf.description?.text || ""}>{kf.description?.text || ""}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button type="button" onClick={() => {
                                // Set the editing key feature with the current item's data
                                updateModalState({
                                  editingKeyFeature: { ...kf, description: kf.description ? kf.description : { text: "" } },
                                  editingImpact: null,
                                  editingImpactIndex: null,
                                });
                                // Set mini modal language to current main modal language
                                updateUIState({ miniModalLanguage: uiState.modalLanguage });
                                updateModalState({ keyFeatureModalOpen: true });
                              }} className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer" style={{ color: theme.colors.primary }}>
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button type="button" onClick={() => {
                                const features = (formState.selectedService?.[uiState.modalLanguage]?.keyFeatures || []).filter((f) => f.id !== kf.id).map(f => ({ ...f, description: f.description ? f.description : { text: "" } }));
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
                  <div className="flex items-center gap-2 mb-4" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                    <FiType className="w-5 h-5" style={{ color: theme.colors.primary }} />
                    <span className="text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                      {labels.impact[uiState.modalLanguage]}
                    </span>
                    <button type="button" onClick={() => {
                      updateModalState({
                        editingImpact: { id: Date.now().toString(), label: { text: '' }, value: '', iconName: '', prefix: '', suffix: '' },
                        editingImpactIndex: null,
                        editingKeyFeature: null,
                      });
                      // Set mini modal language to current main modal language
                      updateUIState({ miniModalLanguage: uiState.modalLanguage });
                      updateModalState({ impactModalOpen: true });
                    }} className="ml-auto px-3 py-1 rounded bg-blue-600 text-white">Add</button>
                  </div>
                  <table className="min-w-full divide-y" style={{ borderColor: theme.colors.border.default }}>
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>Label</th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>Value</th>
                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: theme.colors.border.default }}>
                      {(formState.selectedService?.[uiState.modalLanguage]?.impact || []).map((imp, idx) => (
                        <tr key={imp.id || idx} className="hover:bg-gray-50" style={{ backgroundColor: theme.colors.background.secondary }}>
                          <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                            <div className="max-w-[180px] truncate" title={imp.label.text}>{imp.label.text}</div>
                          </td>
                          <td className="px-6 py-4" style={{ color: theme.colors.text.primary }}>
                            <div className="max-w-[180px] truncate" title={imp.value}>{imp.value}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button type="button" onClick={() => {
                                // Set the editing impact with the current item's data
                                updateModalState({
                                  editingImpact: { ...imp },
                                  editingImpactIndex: idx,
                                  editingKeyFeature: null,
                                });
                                // Set mini modal language to current main modal language
                                updateUIState({ miniModalLanguage: uiState.modalLanguage });
                                updateModalState({ impactModalOpen: true });
                              }} className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer" style={{ color: theme.colors.primary }}>
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button type="button" onClick={() => {
                                const impact = (formState.selectedService?.[uiState.modalLanguage]?.impact || []).filter((f) => f.id !== imp.id);
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
                  <button type="button" onClick={() => {
                    updateUIState({ isModalOpen: false, hasChanges: false });
                    updateFormState({ selectedService: null });
                    updateValidationState({ missingFields: [], homepageLimitError: '' });
                    updatePromptState({ showSwitchLangPrompt: false });
                  }} className="px-4 py-2 rounded-lg transition-colors duration-200" style={{ backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={formState.isSaving} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50" style={{ backgroundColor: theme.colors.primary, color: theme.colors.text.light }}>
                    <FiSave className="w-4 h-4" />
                    {formState.isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Key Feature Modal */}
      {modalState.keyFeatureModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.text.primary, fontFamily: getFontFamily() }}>{modalState.editingKeyFeature ? labels.edit[uiState.miniModalLanguage] : labels.add[uiState.miniModalLanguage]} {labels.keyFeatures[uiState.miniModalLanguage]}</h3>
            {/* Language Switcher */}
            <div className="flex justify-center gap-4 mb-4">
              <button
                type="button"
                onClick={() => handleMiniModalLanguageSwitch('en')}
                className={`px-4 py-2 rounded transition-colors duration-300 ${uiState.miniModalLanguage === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                style={{ fontFamily: theme.fonts.en.primary }}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleMiniModalLanguageSwitch('ur')}
                className={`px-4 py-2 rounded transition-colors duration-300 ${uiState.miniModalLanguage === 'ur' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                style={{ fontFamily: theme.fonts.ur.primary }}
              >
                اردو
              </button>
            </div>
            <div className="mb-4" style={{ direction: uiState.miniModalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.miniModalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>
                {labels.title[uiState.miniModalLanguage]}
                {promptState.keyFeatureRequiredInOpposite && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={modalState.editingKeyFeature?.title?.text || ''}
                onChange={e => updateModalState({
                  editingKeyFeature: modalState.editingKeyFeature ? { ...modalState.editingKeyFeature, title: { text: e.target.value } } : { id: Date.now().toString(), title: { text: e.target.value }, description: { text: '' } }
                })}
                className={`w-full p-2 border rounded ${promptState.keyFeatureRequiredInOpposite && !modalState.editingKeyFeature?.title?.text ? 'border-red-500' : ''}`}
                style={{ color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: promptState.keyFeatureRequiredInOpposite && !modalState.editingKeyFeature?.title?.text ? '#ef4444' : theme.colors.border.default, fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}
              />
              {promptState.keyFeatureRequiredInOpposite && !modalState.editingKeyFeature?.title?.text && (
                <p className="text-xs text-red-600 mt-1">This field is required.</p>
              )}
            </div>
            <div className="mb-4" style={{ direction: uiState.miniModalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.miniModalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>
                {labels.description[uiState.miniModalLanguage]}
                {promptState.keyFeatureRequiredInOpposite && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={modalState.editingKeyFeature?.description?.text || ''}
                onChange={e => updateModalState({
                  editingKeyFeature: modalState.editingKeyFeature ? { ...modalState.editingKeyFeature, description: { text: e.target.value } } : { id: Date.now().toString(), title: { text: '' }, description: { text: e.target.value } }
                })}
                className={`w-full p-2 border rounded ${promptState.keyFeatureRequiredInOpposite && !modalState.editingKeyFeature?.description?.text ? 'border-red-500' : ''}`}
                style={{ color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: promptState.keyFeatureRequiredInOpposite && !modalState.editingKeyFeature?.description?.text ? '#ef4444' : theme.colors.border.default, fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}
              />
              {promptState.keyFeatureRequiredInOpposite && !modalState.editingKeyFeature?.description?.text && (
                <p className="text-xs text-red-600 mt-1">This field is required.</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeKeyFeatureModal} className="px-4 py-2 rounded bg-gray-200" style={{ color: theme.colors.text.primary }}>{labels.cancel[uiState.miniModalLanguage]}</button>
              {promptState.keyFeatureRequiredInOpposite && (
                <button type="button" onClick={() => {
                  updatePromptState({ keyFeatureRequiredInOpposite: false });
                  updateModalState({
                    keyFeatureModalOpen: false,
                    editingKeyFeature: null,
                  });
                }} className="px-4 py-2 rounded bg-yellow-500 text-white">
                  Skip Translation
                </button>
              )}
              <button type="button" onClick={handleSaveKeyFeature} className="px-4 py-2 rounded bg-blue-600 text-white">{labels.save[uiState.miniModalLanguage]}</button>
            </div>
          </div>
        </div>
      )}
      {/* Impact Modal */}
      {modalState.impactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.text.primary, fontFamily: getFontFamily() }}>{modalState.editingImpactIndex !== null ? labels.edit[uiState.miniModalLanguage] : labels.add[uiState.miniModalLanguage]} {labels.impact[uiState.miniModalLanguage]}</h3>
            {/* Language Switcher */}
            <div className="flex justify-center gap-4 mb-4">
              <button
                type="button"
                onClick={() => handleMiniModalLanguageSwitch('en')}
                className={`px-4 py-2 rounded transition-colors duration-300 ${uiState.miniModalLanguage === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                style={{ fontFamily: theme.fonts.en.primary }}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => handleMiniModalLanguageSwitch('ur')}
                className={`px-4 py-2 rounded transition-colors duration-300 ${uiState.miniModalLanguage === 'ur' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                style={{ fontFamily: theme.fonts.ur.primary }}
              >
                اردو
              </button>
            </div>
            <div className="mb-4" style={{ direction: uiState.miniModalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.miniModalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>
                {labels.label[uiState.miniModalLanguage]}
                {promptState.impactRequiredInOpposite && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={modalState.editingImpact?.label?.text || ''}
                onChange={e => updateModalState({
                  editingImpact: modalState.editingImpact ? { ...modalState.editingImpact, label: { text: e.target.value } } : { id: Date.now().toString(), label: { text: e.target.value }, value: '', iconName: '', prefix: '', suffix: '' }
                })}
                className={`w-full p-2 border rounded ${promptState.impactRequiredInOpposite && !modalState.editingImpact?.label?.text ? 'border-red-500' : ''}`}
                style={{ color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: promptState.impactRequiredInOpposite && !modalState.editingImpact?.label?.text ? '#ef4444' : theme.colors.border.default, fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}
              />
              {promptState.impactRequiredInOpposite && !modalState.editingImpact?.label?.text && (
                <p className="text-xs text-red-600 mt-1">This field is required.</p>
              )}
            </div>
            <div className="mb-4" style={{ direction: uiState.miniModalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.miniModalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>{labels.value[uiState.miniModalLanguage]}</label>
              <input type="text" value={modalState.editingImpact?.value || ''} onChange={e => updateModalState({
                editingImpact: modalState.editingImpact ? { ...modalState.editingImpact, value: e.target.value } : { id: Date.now().toString(), label: { text: '' }, value: e.target.value, iconName: '', prefix: '', suffix: '' }
              })} className="w-full p-2 border rounded" style={{ color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.default, fontFamily: theme.fonts[uiState.miniModalLanguage].primary }} />
            </div>
            <div className="mb-4" style={{ direction: uiState.miniModalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.miniModalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>{labels.iconName[uiState.miniModalLanguage]}</label>
              <IconSelector
                selectedIcon={modalState.editingImpact?.iconName || ''}
                onSelect={(iconName) => updateModalState({
                  editingImpact: modalState.editingImpact ? { ...modalState.editingImpact, iconName } : { id: Date.now().toString(), label: { text: '' }, value: '', iconName, prefix: '', suffix: '' }
                })}
                size="small"
                className="w-full"
              />
            </div>
            <div className="mb-4" style={{ direction: uiState.miniModalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.miniModalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>{labels.prefix[uiState.miniModalLanguage]}</label>
              <input type="text" value={modalState.editingImpact?.prefix || ''} onChange={e => updateModalState({
                editingImpact: modalState.editingImpact ? { ...modalState.editingImpact, prefix: e.target.value } : { id: Date.now().toString(), label: { text: '' }, value: '', iconName: '', prefix: e.target.value, suffix: '' }
              })} className="w-full p-2 border rounded" style={{ color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.default, fontFamily: theme.fonts[uiState.miniModalLanguage].primary }} />
            </div>
            <div className="mb-4" style={{ direction: uiState.miniModalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.miniModalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>{labels.suffix[uiState.miniModalLanguage]}</label>
              <input type="text" value={modalState.editingImpact?.suffix || ''} onChange={e => updateModalState({
                editingImpact: modalState.editingImpact ? { ...modalState.editingImpact, suffix: e.target.value } : { id: Date.now().toString(), label: { text: '' }, value: '', iconName: '', prefix: '', suffix: e.target.value }
              })} className="w-full p-2 border rounded" style={{ color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.default, fontFamily: theme.fonts[uiState.miniModalLanguage].primary }} />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeImpactModal} className="px-4 py-2 rounded bg-gray-200" style={{ color: theme.colors.text.primary }}>{labels.cancel[uiState.miniModalLanguage]}</button>
              {promptState.impactRequiredInOpposite && (
                <button type="button" onClick={() => {
                  updatePromptState({ impactRequiredInOpposite: false });
                  updateModalState({
                    impactModalOpen: false,
                    editingImpact: null,
                    editingImpactIndex: null,
                  });
                }} className="px-4 py-2 rounded bg-yellow-500 text-white">
                  Skip Translation
                </button>
              )}
              <button type="button" onClick={handleSaveImpact} className="px-4 py-2 rounded bg-blue-600 text-white">{labels.save[uiState.miniModalLanguage]}</button>
            </div>
          </div>
        </div>
      )}
      {promptState.showSwitchFeatureLangPrompt && (
        <div className="fixed left-1/2 top-20 z-50 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in" style={{ minWidth: 320, maxWidth: 400 }}>
          <div className="flex-1 text-sm text-center">
            {uiState.modalLanguage === 'en'
              ? 'Some Key Features are missing in Urdu. Please switch to Urdu and fill them.'
              : 'Some Key Features are missing in English. Please switch to English and fill them.'}
          </div>
          <button type="button" onClick={() => {
            updateUIState({ miniModalLanguage: uiState.modalLanguage === 'en' ? 'ur' : 'en' });
            updatePromptState({ showSwitchFeatureLangPrompt: false });
          }} className="px-3 py-1 rounded bg-blue-600 text-white text-xs shadow">Switch to {uiState.modalLanguage === 'en' ? 'Urdu' : 'English'}</button>
          <button type="button" onClick={() => updatePromptState({ showSwitchFeatureLangPrompt: false })} className="ml-2 p-1 rounded hover:bg-yellow-200" aria-label="Close"><FiX className="w-4 h-4" /></button>
        </div>
      )}
      {promptState.showSwitchImpactLangPrompt && (
        <div className="fixed left-1/2 top-32 z-50 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in" style={{ minWidth: 320, maxWidth: 400 }}>
          <div className="flex-1 text-sm text-center">
            {uiState.modalLanguage === 'en'
              ? 'Some Impact entries are missing in Urdu. Please switch to Urdu and fill them.'
              : 'Some Impact entries are missing in English. Please switch to English and fill them.'}
          </div>
          <button type="button" onClick={() => {
            updateUIState({ miniModalLanguage: uiState.modalLanguage === 'en' ? 'ur' : 'en' });
            updatePromptState({ showSwitchImpactLangPrompt: false });
          }} className="px-3 py-1 rounded bg-blue-600 text-white text-xs shadow">Switch to {uiState.modalLanguage === 'en' ? 'Urdu' : 'English'}</button>
          <button type="button" onClick={() => updatePromptState({ showSwitchImpactLangPrompt: false })} className="ml-2 p-1 rounded hover:bg-yellow-200" aria-label="Close"><FiX className="w-4 h-4" /></button>
        </div>
      )}

    </div>
  );
}