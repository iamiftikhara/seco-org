"use client";

import React, {useEffect, useState, useCallback} from "react";
import {FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiImage, FiType, FiEye, FiFileText} from "react-icons/fi";
import {FaEdit, FaTrash, FaHome} from "react-icons/fa";
import {showAlert, showConfirmDialog} from "@/utils/alert";
import Loader from "../components/Loader";
import DashboardLoader from "../components/DashboardLoader";
import {theme} from "@/config/theme";
import {useRouter} from "next/navigation";
import AdminError from "../errors/error";
import type {ServiceDetail, KeyFeature, ImpactMetric, ServicePageContent} from "@/types/services";
import ImageSelector from "@/app/admin/components/ImageSelector";
import IconSelector from "@/app/admin/components/IconSelector";
import Image from "next/image";

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
  language: "en" | "ur";
  modalLanguage: "en" | "ur";
  miniModalLanguage: "en" | "ur";
}

interface ValidationState {
  missingFields: string[];
  homepageLimitError: { en: string; ur: string };
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
    language: "en",
    modalLanguage: "en",
    miniModalLanguage: "en",
  });

  // Validation state
  const [validationState, setValidationState] = useState<ValidationState>({
    missingFields: [],
    homepageLimitError: { en: '', ur: '' },
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
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "ur">("en");
  const router = useRouter();

  // Labels for UI text in both languages
  const labels = {
    title: {en: "Title", ur: "عنوان"},
    shortDescription: {en: "Short Description", ur: "مختصر وضاحت"},
    fullDescription: {en: "Full Description", ur: "مکمل وضاحت"},
    overviewTitle: {en: "Overview Title", ur: "جائزے کا عنوان"},
    heroImage: {en: "Hero Image", ur: "ہیرو تصویر"},
    iconName: {en: "Icon Name", ur: "آئیکن نام"},
    slug: {en: "Slug", ur: "سلگ"},
    showOnHomepage: {en: "Show on Homepage", ur: "ہوم پیج پر دکھائیں"},
    titlesAndDescriptions: {en: "Titles & Descriptions", ur: "عنوانات اور وضاحتیں"},
    keyFeatures: {en: "Key Features", ur: "اہم خصوصیات"},
    description: {en: "Description", ur: "وضاحت"},
    impact: {en: "Impact", ur: "اثرات"},
    label: {en: "Label", ur: "لیبل"},
    value: {en: "Value", ur: "قدر"},
    suffix: {en: "Suffix", ur: "لاحقہ"},
    prefix: {en: "Prefix", ur: "سابقہ"},
    serviceImageAndIcon: {en: "Service Image & Icon", ur: "سروس تصویر اور آئیکن"},
    add: {en: "Add", ur: "شامل کریں"},
    edit: {en: "Edit", ur: "ترمیم کریں"},
    cancel: {en: "Cancel", ur: "منسوخ کریں"},
    save: {en: "Save", ur: "محفوظ کریں"},
    homepageLimitWarning: {
      en: "You can only show up to 4 services on the homepage. Please remove one before adding another.",
      ur: "آپ ہوم پیج پر صرف 4 سروسز دکھا سکتے ہیں۔ کوئی اور شامل کرنے سے پہلے ایک کو ہٹا دیں۔"
    },
    titlePlaceholder: {en: "Enter service title", ur: "سروس کا عنوان درج کریں"},
    shortDescriptionPlaceholder: {en: "Enter short description", ur: "مختصر وضاحت درج کریں"},
    fullDescriptionPlaceholder: {en: "Enter full description", ur: "مکمل وضاحت درج کریں"},
  };

  // Helper functions for state updates
  const updateFormState = (updates: Partial<ServiceFormState>) => {
    setFormState((prev) => ({...prev, ...updates}));
  };

  const updateUIState = (updates: Partial<UIState>) => {
    setUIState((prev) => ({...prev, ...updates}));
  };

  const updateValidationState = (updates: Partial<ValidationState>) => {
    setValidationState((prev) => ({...prev, ...updates}));
  };

  const updateModalState = (updates: Partial<ModalState>) => {
    setModalState((prev) => ({...prev, ...updates}));
  };

  const updatePromptState = (updates: Partial<PromptState>) => {
    setPromptState((prev) => ({...prev, ...updates}));
  };

  // Helper functions for cards view
  const getFontFamily = () => {
    return currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary;
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Slug generation function
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  // API functions
  const fetchServices = useCallback(async () => {
    updateFormState({isLoading: true});
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
      const homepageCount = formState.services.filter((s) => s.showOnHomepage && (!formState.selectedService?.id || s.id !== formState.selectedService.id)).length;

      if (!formState.selectedService.showOnHomepage && homepageCount >= 4) {
        updateValidationState({
          homepageLimitError: {
            en: 'You can only show up to 4 services on the homepage. Please remove one before adding another.',
            ur: 'آپ ہوم پیج پر صرف 4 سروسز دکھا سکتے ہیں۔ کوئی اور شامل کرنے سے پہلے ایک کو ہٹا دیں۔'
          }
        });
      } else {
        updateValidationState({homepageLimitError: { en: '', ur: '' }});
      }
    }
  }, [uiState.isModalOpen, formState.selectedService, formState.services]);

  useEffect(() => {
    if (promptState.showSwitchLangPrompt) {
      const timer = setTimeout(() => updatePromptState({showSwitchLangPrompt: false}), 5000);
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
      title: {text: ""},
      description: {text: ""},
      hashtags: [],
      twitterHandle: "",
      ogType: "article",
    },
    en: {
      title: {text: ""},
      shortDescription: {text: ""},
      fullDescription: {text: ""},
      impactTitle: {text: "Key Impact"},
      keyFeaturesTitle: {text: "Key Features"},
      overviewTitle: {text: "Overview"},
      keyFeatures: [],
      impact: [],
    },
    ur: {
      title: {text: ""},
      shortDescription: {text: ""},
      fullDescription: {text: ""},
      impactTitle: {text: "کلیدی اثرات"},
      keyFeaturesTitle: {text: "اہم خصوصیات"},
      overviewTitle: {text: "جائزہ"},
      keyFeatures: [],
      impact: [],
    },
    id: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
  });

  const handleAddService = () => {
    const newService = createEmptyService();
    updateFormState({selectedService: newService});
    updateUIState({isModalOpen: true, hasChanges: false});
  };

  const normalizeServiceForEdit = (service: ServiceDetail): ServiceDetail => ({
    ...service,
    en: {
      ...service.en,
      title: {text: service.en?.title?.text || ""},
      shortDescription: {text: service.en?.shortDescription?.text || ""},
      fullDescription: {text: service.en?.fullDescription?.text || ""},
      impactTitle: {text: service.en?.impactTitle?.text || "Key Impact"},
      keyFeaturesTitle: {text: service.en?.keyFeaturesTitle?.text || "Key Features"},
      overviewTitle: {text: service.en?.overviewTitle?.text || "Overview"},
      keyFeatures: (service.en?.keyFeatures || []).map((kf) => ({
        ...kf,
        description: kf.description ? kf.description : {text: ""},
      })),
      impact: service.en?.impact || [],
    },
    ur: {
      ...service.ur,
      title: {text: service.ur?.title?.text || ""},
      shortDescription: {text: service.ur?.shortDescription?.text || ""},
      fullDescription: {text: service.ur?.fullDescription?.text || ""},
      impactTitle: {text: service.ur?.impactTitle?.text || "کلیدی اثرات"},
      keyFeaturesTitle: {text: service.ur?.keyFeaturesTitle?.text || "اہم خصوصیات"},
      overviewTitle: {text: service.ur?.overviewTitle?.text || "جائزہ"},
      keyFeatures: (service.ur?.keyFeatures || []).map((kf) => ({
        ...kf,
        description: kf.description ? kf.description : {text: ""},
      })),
      impact: service.ur?.impact || [],
    },
    socialShare: {
      title: {text: service.socialShare?.title?.text || ""},
      description: {text: service.socialShare?.description?.text || ""},
      hashtags: service.socialShare?.hashtags || [],
      twitterHandle: service.socialShare?.twitterHandle || "",
      ogType: service.socialShare?.ogType || "article",
    },
  });

  const handleEditService = (index: number) => {
    const service = formState.services[index];
    const normalizedService = normalizeServiceForEdit(service);
    updateFormState({selectedService: normalizedService});
    updateUIState({isModalOpen: true, hasChanges: false});
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
        updateFormState({isSaving: true});
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
        updateFormState({isSaving: false});
      }
    }
  };

  const handleServiceChange = (field: keyof ServiceDetail, value: ServiceDetail[keyof ServiceDetail]) => {
    if (!formState.selectedService) return;
    updateFormState({
      selectedService: {...formState.selectedService, [field]: value},
    });
    updateUIState({hasChanges: true});
  };

  // Font/layout helpers
  const getDirection = () => (uiState.language === "ur" ? "rtl" : "ltr");
  const getTextAlign = () => (uiState.language === "ur" ? "text-right" : "text-left");

  // ServicePage edit handlers
  const handleServicePageChange = (field: keyof ServicePageContent, value: ServicePageContent[keyof ServicePageContent]) => {
    if (!formState.servicePage) return;
    updateFormState({
      servicePage: {...formState.servicePage, [field]: value},
    });
    updateUIState({servicePageDirty: true});
  };

  const handleServicePageLangChange = (section: "title" | "description", lang: "en" | "ur", value: string) => {
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
      },
    });
    updateUIState({servicePageDirty: true});
  };

  const handleServicePageSave = async () => {
    if (!formState.servicePage) return;
    updateFormState({isSaving: true});
    try {
      const response = await fetch("/api/admin/services", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({servicePage: formState.servicePage}),
      });
      const data = await response.json();
      if (data.success) {
        showAlert({title: "Success", text: "Service page updated successfully!", icon: "success"});
        updateUIState({isEditingServicePage: false, servicePageDirty: false});
        fetchServices();
      } else {
        showAlert({title: "Error", text: data.error || "Failed to update service page", icon: "error"});
      }
    } catch (err) {
      showAlert({title: "Error", text: "Failed to update service page", icon: "error"});
    } finally {
      updateFormState({isSaving: false});
    }
  };

  // Count homepage services for enforcing max 4
  const homepageCount = formState.services.filter((s) => s.showOnHomepage && (!formState.selectedService || s.id !== formState.selectedService.id)).length;

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
      },
    });
    updateUIState({hasChanges: true});
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
      },
    });
    updateUIState({hasChanges: true});
  };

  // Key Features: always assign id as string
  const handleSaveKeyFeature = () => {
    if (!modalState.editingKeyFeature?.title?.text) return;
    if (!formState.selectedService) return;

    let features = formState.selectedService[uiState.miniModalLanguage]?.keyFeatures || [];

    if (modalState.editingKeyFeature.id && features.some((f) => f.id === modalState.editingKeyFeature?.id)) {
      features = features.map((f) => (f.id === modalState.editingKeyFeature?.id ? {...modalState.editingKeyFeature, id: modalState.editingKeyFeature.id!} : f));
    } else {
      features = [...features, {...modalState.editingKeyFeature, id: modalState.editingKeyFeature.id || Date.now().toString()}];
    }

    updateFormState({
      selectedService: {
        ...formState.selectedService,
        [uiState.miniModalLanguage]: {
          ...formState.selectedService[uiState.miniModalLanguage],
          keyFeatures: features,
        },
      },
    });

    // Check if this key feature exists in the opposite language
    const oppositeLang = uiState.miniModalLanguage === "en" ? "ur" : "en";
    const oppositeFeatures = formState.selectedService[oppositeLang]?.keyFeatures || [];
    const featureExistsInOpposite = oppositeFeatures.some((f) => f.id === modalState.editingKeyFeature?.id);

    // If feature doesn't exist in opposite language, keep modal open and switch language
    if (!featureExistsInOpposite) {
      // Switch to opposite language and show required validation
      updateUIState({miniModalLanguage: oppositeLang});
      updatePromptState({
        keyFeatureRequiredInOpposite: true,
      });
      // Set up editing for the opposite language with same ID
      updateModalState({
        editingKeyFeature: {
          id: modalState.editingKeyFeature?.id || Date.now().toString(),
          title: {text: ""},
          description: {text: ""},
        },
      });
      // Keep modal open - don't close it
    } else {
      // Both languages have the feature, close modal and clear required state
      updateModalState({
        keyFeatureModalOpen: false,
        editingKeyFeature: null,
      });
      updatePromptState({
        keyFeatureRequiredInOpposite: false,
      });
    }

    updateUIState({hasChanges: true});
  };

  // Impact: use editingImpactIndex for edit
  const handleSaveImpact = () => {
    if (!modalState.editingImpact?.label?.text) return;
    if (!formState.selectedService) return;

    let impact = formState.selectedService[uiState.miniModalLanguage]?.impact || [];

    if (modalState.editingImpactIndex !== null && modalState.editingImpact) {
      impact = impact.map((f, i) => (i === modalState.editingImpactIndex ? modalState.editingImpact! : f));
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
      },
    });

    // Check if this impact entry exists in the opposite language
    const oppositeLang = uiState.miniModalLanguage === "en" ? "ur" : "en";
    const oppositeImpact = formState.selectedService[oppositeLang]?.impact || [];
    const impactExistsInOpposite = oppositeImpact.some((i) => i.id === modalState.editingImpact?.id);

    // If impact doesn't exist in opposite language, keep modal open and switch language
    if (!impactExistsInOpposite) {
      // Switch to opposite language and show required validation
      updateUIState({miniModalLanguage: oppositeLang});
      updatePromptState({
        impactRequiredInOpposite: true,
      });
      // Set up editing for the opposite language with same ID
      updateModalState({
        editingImpact: {
          id: modalState.editingImpact?.id || Date.now().toString(),
          label: {text: ""},
          value: "",
          iconName: "",
          prefix: "",
          suffix: "",
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
        impactRequiredInOpposite: false,
      });
    }

    updateUIState({hasChanges: true});
  };

  const handleMiniModalLanguageSwitch = (lang: "en" | "ur") => {
    updateUIState({miniModalLanguage: lang});

    if (modalState.editingKeyFeature && formState.selectedService && modalState.editingKeyFeature.id) {
      const features = formState.selectedService[lang].keyFeatures || [];
      const kf = features.find((f) => f.id === modalState.editingKeyFeature?.id);
      updateModalState({
        editingKeyFeature: kf || {
          id: modalState.editingKeyFeature.id,
          title: {text: ""},
          description: {text: ""},
        },
      });
    }

    if (modalState.editingImpact && formState.selectedService && modalState.editingImpact.id) {
      const impactArr = formState.selectedService[lang].impact || [];
      const imp = impactArr.find((i) => i.id === modalState.editingImpact?.id);
      updateModalState({
        editingImpact: imp || {
          id: modalState.editingImpact.id,
          label: {text: ""},
          value: "",
          iconName: "",
          prefix: "",
          suffix: "",
        },
      });
    }
  };

  const openKeyFeatureModal = () => {
    // Don't force language - let it use current miniModalLanguage or default to modalLanguage
    if (!uiState.miniModalLanguage) {
      updateUIState({miniModalLanguage: uiState.modalLanguage});
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
      updateUIState({miniModalLanguage: uiState.modalLanguage});
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

  const validateService = (service: ServiceDetail, currentLang: "en" | "ur") => {
    const requiredFields = [
      // Service Image & Icon (required)
      {key: "heroImage", value: service.heroImage},
      {key: "iconName", value: service.iconName},
      // Social Share Settings (required)
      {key: "socialShare.title", value: service.socialShare.title.text},
      {key: "socialShare.description", value: service.socialShare.description.text},
      {key: "socialShare.hashtags", value: Array.isArray(service.socialShare.hashtags) && service.socialShare.hashtags.length > 0 ? "ok" : ""},
      {key: "socialShare.twitterHandle", value: service.socialShare.twitterHandle},
      {key: "socialShare.ogType", value: service.socialShare.ogType},
      // Current language fields (required first)
      {key: `${currentLang}.title`, value: service[currentLang].title.text},
      {key: `${currentLang}.shortDescription`, value: service[currentLang].shortDescription.text},
      {key: `${currentLang}.overviewTitle`, value: service[currentLang].overviewTitle.text},
      {key: `${currentLang}.fullDescription`, value: service[currentLang].fullDescription.text}
    ];

    // Add opposite language fields
    const oppositeLang = currentLang === "en" ? "ur" : "en";
    requiredFields.push(
      {key: `${oppositeLang}.title`, value: service[oppositeLang].title.text},
      {key: `${oppositeLang}.shortDescription`, value: service[oppositeLang].shortDescription.text},
      {key: `${oppositeLang}.overviewTitle`, value: service[oppositeLang].overviewTitle.text},
      {key: `${oppositeLang}.fullDescription`, value: service[oppositeLang].fullDescription.text}
    );

    return requiredFields.filter((f) => !f.value).map((f) => f.key);
  };

  const checkLanguageConsistency = (service: ServiceDetail, currentLang: "en" | "ur") => {
    const oppositeLang = currentLang === "en" ? "ur" : "en";

    // Check for missing key features in the opposite language
    const features = service[currentLang]?.keyFeatures || [];
    const featuresOpposite = service[oppositeLang]?.keyFeatures || [];
    const missingFeatureIds = features.filter((f) => !featuresOpposite.some((of) => of.id === f.id));

    // Check for missing impact in the opposite language
    const impactArr = service[currentLang]?.impact || [];
    const impactOpposite = service[oppositeLang]?.impact || [];
    const missingImpactIds = impactArr.filter((f) => !impactOpposite.some((of) => of.id === f.id));

    // Check for missing titles in the opposite language (if current language has content)
    const currentHasKeyFeatures = features.length > 0;
    const currentHasImpact = impactArr.length > 0;
    const currentKeyFeaturesTitle = service[currentLang]?.keyFeaturesTitle?.text || "";
    const currentImpactTitle = service[currentLang]?.impactTitle?.text || "";
    const currentOverviewTitle = service[currentLang]?.overviewTitle?.text || "";

    const oppositeKeyFeaturesTitle = service[oppositeLang]?.keyFeaturesTitle?.text || "";
    const oppositeImpactTitle = service[oppositeLang]?.impactTitle?.text || "";
    const oppositeOverviewTitle = service[oppositeLang]?.overviewTitle?.text || "";

    const missingTitles = [];
    if (currentKeyFeaturesTitle && !oppositeKeyFeaturesTitle) missingTitles.push('keyFeaturesTitle');
    if (currentImpactTitle && !oppositeImpactTitle) missingTitles.push('impactTitle');
    if (currentOverviewTitle && !oppositeOverviewTitle) missingTitles.push('overviewTitle');

    return {
      missingFeatures: missingFeatureIds.length > 0,
      missingImpact: missingImpactIds.length > 0,
      missingTitles: missingTitles.length > 0,
    };
  };

  const handleSaveService = async () => {
    if (!formState.selectedService) return;

    // Check homepage limit error
    if (validationState.homepageLimitError.en && formState.selectedService.showOnHomepage) return;

    const missing = validateService(formState.selectedService, uiState.modalLanguage);
    updateValidationState({missingFields: missing});

    // Check for missing fields in the opposite language first (only show one popup)
    const oppositeLang = uiState.modalLanguage === 'en' ? 'ur' : 'en';
    const oppositeLangMissing = missing.filter(f => f.startsWith(`${oppositeLang}.`));

    if (oppositeLangMissing.length > 0) {
      updateValidationState({missingOppositeLang: oppositeLangMissing});
      updatePromptState({showSwitchLangPrompt: true});
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
      updatePromptState({showSwitchFeatureLangPrompt: true});
      return;
    }

    if (languageCheck.missingImpact) {
      updatePromptState({showSwitchImpactLangPrompt: true});
      return;
    }

    try {
      updateFormState({isSaving: true});
      let response;
      // eslint-disable-next-line prefer-const
      let payload = {...formState.selectedService};

      const isNewService = !formState.selectedService.id || formState.selectedService.id === "";

      console.log("Saving service:", {isNewService, payload});

      if (isNewService) {
        // Generate a new id for new service
        payload.id = Date.now().toString();
        // Generate slug if not provided
        if (!payload.slug) {
          payload.slug = payload.en.title.text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
        }
        console.log("POST payload:", payload);
        // Add
        response = await fetch("/api/admin/services", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(payload),
        });
      } else {
        console.log("PUT payload:", payload);
        // Update
        response = await fetch("/api/admin/services", {
          method: "PUT",
          headers: {"Content-Type": "application/json"},
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
        updateFormState({selectedService: null});
        updateUIState({isModalOpen: false, hasChanges: false});
        updateValidationState({missingFields: [], missingOppositeLang: [], homepageLimitError: { en: '', ur: '' }});
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
      updateFormState({isSaving: false});
    }
  };

  if (formState.error) {
    return (
      <AdminError
        error={formState.error}
        reset={() => {
          updateFormState({error: null, isLoading: true});
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
          <div className="bg-white rounded-xl shadow-sm p-8" style={{backgroundColor: theme.colors.background.primary}}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (uiState.isEditingServicePage) handleServicePageSave();
              }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold" style={{color: theme.colors.text.primary}}>
                  Service Page Settings
                </h1>
                {!uiState.isEditingServicePage ? (
                  <button type="button" onClick={() => updateUIState({isEditingServicePage: true})} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90" style={{backgroundColor: theme.colors.primary, color: theme.colors.text.light}}>
                    <FiEdit2 className="w-4 h-4" />
                    Edit
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      updateUIState({isEditingServicePage: false, servicePageDirty: false});
                      fetchServices();
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
              {!uiState.isEditingServicePage ? (
                <>
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FiImage className="w-5 h-5" style={{color: theme.colors.primary}} />
                      <h2 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                        Logo/Image
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                          Logo Image
                        </label>
                        {formState.servicePage.image ? <img src={formState.servicePage.image} alt="Service Page" className="w-full max-w-xs rounded" /> : <div className="w-full p-3 rounded-lg border bg-gray-50 text-gray-400 italic">No image</div>}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FiType className="w-5 h-5" style={{color: theme.colors.primary}} />
                      <h2 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                        Title & Description
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                          Title (English)
                        </label>
                        <div className="w-full p-3 rounded-lg border bg-gray-50" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, fontFamily: theme.fonts.en.primary}}>
                          {formState.servicePage.title?.en?.text || <span className="text-gray-400 italic">No title</span>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                          Title (Urdu)
                        </label>
                        <div className="w-full p-3 rounded-lg border bg-gray-50" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, fontFamily: theme.fonts.ur.primary, direction: "rtl", textAlign: "right"}}>
                          {formState.servicePage.title?.ur?.text || <span className="text-gray-400 italic">No title</span>}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                          Description (English)
                        </label>
                        <div className="w-full p-3 rounded-lg border bg-gray-50" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, fontFamily: theme.fonts.en.primary}}>
                          {formState.servicePage.description?.en?.text || <span className="text-gray-400 italic">No description</span>}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                          Description (Urdu)
                        </label>
                        <div className="w-full p-3 rounded-lg border bg-gray-50" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, fontFamily: theme.fonts.ur.primary, direction: "rtl", textAlign: "right"}}>
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
                      <FiImage className="w-5 h-5" style={{color: theme.colors.primary}} />
                      <h2 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                        Logo/Image
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                          Hero Image
                        </label>
                        <ImageSelector selectedPath={formState.servicePage.image} onSelect={(path) => handleServicePageChange("image", path)} className="w-full" size="small" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FiType className="w-5 h-5" style={{color: theme.colors.primary}} />
                      <h2 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                        Title & Description
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                          Title (English)
                        </label>
                        <input
                          type="text"
                          value={formState.servicePage.title?.en?.text || ""}
                          onChange={(e) => handleServicePageLangChange("title", "en", e.target.value)}
                          className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes("en.title") ? "border-red-500" : ""}`}
                          style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: uiState.isEditingServicePage ? "white" : theme.colors.background.secondary, fontFamily: theme.fonts.en.primary}}
                          required
                        />
                        {validationState.missingFields.includes("en.title") && <p className="text-xs text-red-600 mt-1">This field is required.</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                          Title (Urdu)
                        </label>
                        <input
                          type="text"
                          value={formState.servicePage.title?.ur?.text || ""}
                          onChange={(e) => handleServicePageLangChange("title", "ur", e.target.value)}
                          className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes("ur.title") ? "border-red-500" : ""}`}
                          style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: uiState.isEditingServicePage ? "white" : theme.colors.background.secondary, fontFamily: theme.fonts.ur.primary, direction: "rtl", textAlign: "right"}}
                          required
                        />
                        {validationState.missingFields.includes("ur.title") && <p className="text-xs text-red-600 mt-1">This field is required.</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                          Description (English)
                        </label>
                        <input
                          type="text"
                          value={formState.servicePage.description?.en?.text || ""}
                          onChange={(e) => handleServicePageLangChange("description", "en", e.target.value)}
                          className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes("en.description") ? "border-red-500" : ""}`}
                          style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: uiState.isEditingServicePage ? "white" : theme.colors.background.secondary, fontFamily: theme.fonts.en.primary}}
                          required
                        />
                        {validationState.missingFields.includes("en.description") && <p className="text-xs text-red-600 mt-1">This field is required.</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                          Description (Urdu)
                        </label>
                        <input
                          type="text"
                          value={formState.servicePage.description?.ur?.text || ""}
                          onChange={(e) => handleServicePageLangChange("description", "ur", e.target.value)}
                          className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes("ur.description") ? "border-red-500" : ""}`}
                          style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: uiState.isEditingServicePage ? "white" : theme.colors.background.secondary, fontFamily: theme.fonts.ur.primary, direction: "rtl", textAlign: "right"}}
                          required
                        />
                        {validationState.missingFields.includes("ur.description") && <p className="text-xs text-red-600 mt-1">This field is required.</p>}
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 border-t" style={{borderColor: theme.colors.border.default}}>
                    <button type="submit" disabled={!uiState.servicePageDirty || formState.isSaving} className="w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200 disabled:opacity-50 cursor-pointer" style={{backgroundColor: theme.colors.status.success, color: theme.colors.text.light}}>
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

      {/* Main Services Management Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{color: theme.colors.text.primary}}>
          Manage Services
        </h1>
        <button onClick={handleAddService} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90" style={{backgroundColor: theme.colors.primary, color: theme.colors.text.light}}>
          <FiPlus className="w-4 h-4" />
          Add Service
        </button>
      </div>
      {/* Language Toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button onClick={() => setCurrentLanguage("en")} className={`px-4 py-2 rounded-md transition-colors ${currentLanguage === "en" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"}`} style={{fontFamily: theme.fonts.en.primary}}>
            English
          </button>
          <button onClick={() => setCurrentLanguage("ur")} className={`px-4 py-2 rounded-md transition-colors ${currentLanguage === "ur" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-800"}`} style={{fontFamily: theme.fonts.ur.primary}}>
            اردو
          </button>
        </div>
      </div>

      {/* Services Cards Grid */}
      <div className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"}`}>
        {formState.services.map((service, index) => (
          <div key={service.id || index} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200" style={{backgroundColor: theme.colors.background.primary}}>
            {/* Service Image */}
            <div className="relative h-48 overflow-hidden">
              <Image src={service.heroImage} alt={service[currentLanguage]?.title?.text || "Service image"} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />

              {/* Status Indicators */}
              <div className="absolute top-2 right-2 flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${service.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{service.isActive ? "Active" : "Inactive"}</span>
                {service.showOnHomepage && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800" title="Shown on Homepage">
                    <FaHome className="inline w-3 h-3" />
                  </span>
                )}
              </div>
            </div>

            {/* Service Content */}
            <div className={`p-4 ${currentLanguage === "ur" ? "text-right" : "text-left"}`} dir={currentLanguage === "ur" ? "rtl" : "ltr"}>
              <h3 className={`font-semibold text-gray-900 mb-2 line-clamp-2 ${currentLanguage === "ur" ? "text-right" : "text-left"}`} style={{fontFamily: getFontFamily()}}>
                {service[currentLanguage]?.title?.text || "--"}
              </h3>

              <p className={`text-sm text-gray-600 mb-4 line-clamp-3 ${currentLanguage === "ur" ? "text-right" : "text-left"}`} style={{fontFamily: getFontFamily()}}>
                {service[currentLanguage]?.shortDescription?.text || "--"}
              </p>

              {/* Impact Stats */}
              {service[currentLanguage]?.impact && service[currentLanguage].impact.length > 0 && (
                <div className={`flex gap-4 mb-4 ${currentLanguage === "ur" ? "justify-start" : "justify-start"}`}>
                  {service[currentLanguage].impact.slice(0, 2).map((stat, index) => (
                    <div key={index} className={`text-center ${currentLanguage === "ur" ? "text-right" : "text-center"}`}>
                      <div className="text-lg font-bold text-blue-600">
                        {stat.value}
                        {stat.suffix || ""}
                      </div>
                      <div className={`text-xs text-gray-500 ${currentLanguage === "ur" ? "text-right" : "text-center"}`} style={{fontFamily: getFontFamily()}}>
                        {stat.label.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className={`flex items-center pt-4 border-t border-gray-100 ${currentLanguage === "ur" ? "justify-start" : "justify-between"}`}>
                <div className={`flex gap-2 ${currentLanguage === "ur" ? "flex-row-reverse" : "flex-row"}`}>
                  <button onClick={() => handleEditService(index)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Service">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteService(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Service">
                    <FaTrash />
                  </button>
                  <a href={`/services/${service.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="View Service">
                    <FiEye />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Edit/Add Modal */}
      {uiState.isModalOpen && formState.selectedService && (
        <div className="fixed inset-0 bg-[#61616167] flex items-center justify-center z-50">
          {/* Floating language switch mini-popup */}
          {promptState.showSwitchLangPrompt && (
            <div className="fixed left-1/2 top-8 z-50 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in" style={{minWidth: 320, maxWidth: 400}}>
              <div className="flex-1 text-sm text-center">{uiState.modalLanguage === "en" ? "Some required fields are missing in Urdu. Please switch to Urdu and fill them." : "Some required fields are missing in English. Please switch to English and fill them."}</div>
              <button
                type="button"
                onClick={() => {
                  updateUIState({modalLanguage: uiState.modalLanguage === "en" ? "ur" : "en"});
                  updatePromptState({showSwitchLangPrompt: false});
                }}
                className="px-3 py-1 rounded bg-blue-600 text-white text-xs shadow"
              >
                Switch to {uiState.modalLanguage === "en" ? "Urdu" : "English"}
              </button>
              <button type="button" onClick={() => updatePromptState({showSwitchLangPrompt: false})} className="ml-2 p-1 rounded hover:bg-yellow-200" aria-label="Close">
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto" style={{backgroundColor: theme.colors.background.primary}}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{formState.selectedService.id ? "Edit Service" : "Add New Service"}</h2>
                <button
                  onClick={() => {
                    updateUIState({isModalOpen: false, hasChanges: false});
                    updateFormState({selectedService: null});
                    updateValidationState({missingFields: [], missingOppositeLang: [], homepageLimitError: { en: '', ur: '' }});
                    updatePromptState({
                      showSwitchLangPrompt: false,
                      showSwitchFeatureLangPrompt: false,
                      showSwitchImpactLangPrompt: false,
                    });
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <FiX className="w-5 h-5" style={{color: theme.colors.text.secondary}} />
                </button>
              </div>
              {/* Language Switcher (main modal) */}
              <div className="flex justify-center gap-4 mb-6">
                <button onClick={() => updateUIState({modalLanguage: "en"})} className={`px-4 py-2 rounded transition-colors duration-300 ${uiState.modalLanguage === "en" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`} style={{fontFamily: theme.fonts.en.primary}}>
                  English
                </button>
                <button onClick={() => updateUIState({modalLanguage: "ur"})} className={`px-4 py-2 rounded transition-colors duration-300 ${uiState.modalLanguage === "ur" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`} style={{fontFamily: theme.fonts.ur.primary}}>
                  اردو
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveService();
                }}
                className="space-y-8"
              >
                {/* Basic Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Featured Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Featured Image <span className="text-red-500">*</span>
                      </label>
                      <ImageSelector selectedPath={formState.selectedService?.heroImage || ""} onSelect={(path) => handleServiceChange("heroImage", path)} className="w-full" size="small" />
                      {validationState.missingFields.includes('heroImage') && (
                        <p className="text-xs text-red-600 mt-1">Featured Image is required.</p>
                      )}
                    </div>

                    {/* Icon */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon <span className="text-red-500">*</span>
                      </label>
                      <IconSelector
                        selectedIcon={formState.selectedService?.iconName || ""}
                        onSelect={(iconName) => handleServiceChange("iconName", iconName)}
                        size="small"
                        className={`w-full ${validationState.missingFields.includes('iconName') ? 'border-red-500' : ''}`}
                      />
                      {validationState.missingFields.includes('iconName') && (
                        <p className="text-xs text-red-600 mt-1">Icon is required.</p>
                      )}
                    </div>

                    {/* Auto-generated Slug (Read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Slug (Auto-generated)
                      </label>
                      <input
                        type="text"
                        value={formState.selectedService?.slug || ''}
                        readOnly
                        className="w-full p-3 rounded-lg border transition-all duration-200 bg-gray-100 cursor-not-allowed"
                        style={{
                          borderColor: theme.colors.border.default,
                          color: theme.colors.text.secondary,
                          backgroundColor: theme.colors.background.secondary
                        }}
                        placeholder="Auto-generated from English title"
                      />
                    </div>

                    {/* Homepage & Active Checkboxes */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="showOnHomepage" checked={formState.selectedService?.showOnHomepage || false} onChange={(e) => formState.selectedService && handleServiceChange("showOnHomepage", e.target.checked)} disabled={!formState.selectedService?.showOnHomepage && formState.services.filter((s) => s.showOnHomepage).length >= 4} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                        <label htmlFor="showOnHomepage" className="text-sm font-medium text-gray-700">
                          Show on Homepage
                        </label>
                      </div>

                      <div className="flex items-center gap-3">
                        <input type="checkbox" id="isActive" checked={formState.selectedService?.isActive || false} onChange={(e) => formState.selectedService && handleServiceChange("isActive", e.target.checked)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                          Active Service
                        </label>
                      </div>

                      {/* Homepage Limit Warning */}
                      {validationState.homepageLimitError[uiState.modalLanguage] && (
                        <div
                          className="w-full text-yellow-800 text-xs mt-2 bg-yellow-100 border border-yellow-300 rounded px-3 py-2"
                          style={{
                            fontWeight: 500,
                            fontFamily: theme.fonts[uiState.modalLanguage].primary,
                            direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr',
                            textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left'
                          }}
                        >
                          {validationState.homepageLimitError[uiState.modalLanguage]}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

               

                {/* Content Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Content ({uiState.modalLanguage === 'en' ? 'English' : 'Urdu'})
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    {/* Title */}
                    <div className="space-y-2" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                        {labels.title[uiState.modalLanguage]} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formState.selectedService?.[uiState.modalLanguage]?.title?.text || ''}
                        onChange={e => {
                          if (formState.selectedService) {
                            const newTitle = e.target.value;
                            const updatedService = {
                              ...formState.selectedService,
                              [uiState.modalLanguage]: {
                                ...formState.selectedService[uiState.modalLanguage],
                                title: { ...formState.selectedService[uiState.modalLanguage].title, text: newTitle }
                              }
                            };

                            // Auto-generate slug from English title
                            if (uiState.modalLanguage === 'en' && newTitle) {
                              updatedService.slug = generateSlug(newTitle);
                            }

                            // Update the entire service object
                            updateFormState({ selectedService: updatedService });
                            updateUIState({ hasChanges: true });
                          }
                        }}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes(`${uiState.modalLanguage}.title`) ? 'border-red-500' : ''}`}
                        style={{
                          borderColor: theme.colors.border.default,
                          color: theme.colors.text.primary,
                          backgroundColor: theme.colors.background.primary,
                          fontFamily: theme.fonts[uiState.modalLanguage].primary,
                          direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr',
                          textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left'
                        }}
                        placeholder={labels.titlePlaceholder[uiState.modalLanguage]}
                        required
                      />
                      {validationState.missingFields.includes(`${uiState.modalLanguage}.title`) && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>

                    {/* Short Description */}
                    <div className="space-y-2" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                        {labels.shortDescription[uiState.modalLanguage]} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formState.selectedService?.[uiState.modalLanguage]?.shortDescription?.text || ''}
                        onChange={e => formState.selectedService && handleServiceChange(uiState.modalLanguage, {
                          ...formState.selectedService[uiState.modalLanguage],
                          shortDescription: { ...formState.selectedService[uiState.modalLanguage].shortDescription, text: e.target.value }
                        })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes(`${uiState.modalLanguage}.shortDescription`) ? 'border-red-500' : ''}`}
                        style={{
                          borderColor: theme.colors.border.default,
                          color: theme.colors.text.primary,
                          backgroundColor: theme.colors.background.primary,
                          fontFamily: theme.fonts[uiState.modalLanguage].primary,
                          direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr',
                          textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left'
                        }}
                        placeholder={labels.shortDescriptionPlaceholder[uiState.modalLanguage]}
                        rows={3}
                        required
                      />
                      {validationState.missingFields.includes(`${uiState.modalLanguage}.shortDescription`) && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>

                    {/* Overview Title */}
                    <div className="space-y-2" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                        {labels.overviewTitle[uiState.modalLanguage]} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formState.selectedService?.[uiState.modalLanguage]?.overviewTitle?.text || ''}
                        onChange={e => formState.selectedService && handleServiceChange(uiState.modalLanguage, {
                          ...formState.selectedService[uiState.modalLanguage],
                          overviewTitle: { text: e.target.value }
                        })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes(`${uiState.modalLanguage}.overviewTitle`) ? 'border-red-500' : ''}`}
                        style={{
                          borderColor: theme.colors.border.default,
                          color: theme.colors.text.primary,
                          backgroundColor: theme.colors.background.primary,
                          fontFamily: theme.fonts[uiState.modalLanguage].primary,
                          direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr',
                          textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left'
                        }}
                        placeholder={uiState.modalLanguage === 'en' ? 'Enter overview title' : 'جائزے کا عنوان درج کریں'}
                        required
                      />
                      {validationState.missingFields.includes(`${uiState.modalLanguage}.overviewTitle`) && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>

                    {/* Full Description */}
                    <div className="space-y-2" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                        {labels.fullDescription[uiState.modalLanguage]} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formState.selectedService?.[uiState.modalLanguage]?.fullDescription?.text || ''}
                        onChange={e => formState.selectedService && handleServiceChange(uiState.modalLanguage, {
                          ...formState.selectedService[uiState.modalLanguage],
                          fullDescription: { ...formState.selectedService[uiState.modalLanguage].fullDescription, text: e.target.value }
                        })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes(`${uiState.modalLanguage}.fullDescription`) ? 'border-red-500' : ''}`}
                        style={{
                          borderColor: theme.colors.border.default,
                          color: theme.colors.text.primary,
                          backgroundColor: theme.colors.background.primary,
                          fontFamily: theme.fonts[uiState.modalLanguage].primary,
                          direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr',
                          textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left'
                        }}
                        placeholder={labels.fullDescriptionPlaceholder[uiState.modalLanguage]}
                        rows={5}
                        required
                      />
                      {validationState.missingFields.includes(`${uiState.modalLanguage}.fullDescription`) && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Key Features Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-2 mb-4" style={{direction: uiState.modalLanguage === "ur" ? "rtl" : "ltr", textAlign: uiState.modalLanguage === "ur" ? "right" : "left", fontFamily: theme.fonts[uiState.modalLanguage].primary}}>
                    <FiPlus className="w-5 h-5" style={{color: theme.colors.primary}} />
                    <span className="text-lg font-semibold" style={{color: theme.colors.text.primary}}>
                      {labels.keyFeatures[uiState.modalLanguage]}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        updateModalState({
                          editingKeyFeature: {id: Date.now().toString(), title: {text: ""}, description: {text: ""}},
                          editingImpact: null,
                          editingImpactIndex: null,
                        });
                        // Set mini modal language to current main modal language
                        updateUIState({miniModalLanguage: uiState.modalLanguage});
                        updateModalState({keyFeatureModalOpen: true});
                      }}
                      className="ml-auto px-3 py-1 rounded bg-blue-600 text-white"
                    >
                      Add
                    </button>
                  </div>

                  {/* Key Features Title */}
                  <div className="mb-4" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                      Key Features Title ({uiState.modalLanguage === 'en' ? 'English' : 'Urdu'})
                    </label>
                    <input
                      type="text"
                      value={formState.selectedService?.[uiState.modalLanguage]?.keyFeaturesTitle?.text || ''}
                      onChange={e => formState.selectedService && handleServiceChange(uiState.modalLanguage, {
                        ...formState.selectedService[uiState.modalLanguage],
                        keyFeaturesTitle: { text: e.target.value }
                      })}
                      className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                      style={{
                        borderColor: theme.colors.border.default,
                        color: theme.colors.text.primary,
                        backgroundColor: theme.colors.background.primary,
                        fontFamily: theme.fonts[uiState.modalLanguage].primary,
                        direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr',
                        textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left'
                      }}
                      placeholder={uiState.modalLanguage === 'en' ? 'Enter key features title' : 'کلیدی خصوصیات کا عنوان درج کریں'}
                    />
                  </div>
                  <table className="min-w-full divide-y" style={{borderColor: theme.colors.border.default, direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr'}}>
                    <thead>
                      <tr>
                        <th className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'}`} style={{color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary}}>
                          Title
                        </th>
                        <th className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'}`} style={{color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary}}>
                          Description
                        </th>
                        <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary}}>
                          <div className={`flex ${uiState.modalLanguage === 'ur' ? 'justify-start' : 'justify-end'}`}>
                            Actions
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{borderColor: theme.colors.border.default}}>
                      {(formState.selectedService?.[uiState.modalLanguage]?.keyFeatures || []).map((kf, idx) => (
                        <tr key={kf.id || idx} className="hover:bg-gray-50" style={{backgroundColor: theme.colors.background.secondary}}>
                          {/* Title Column */}
                          <td className={`px-6 py-4 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'}`} style={{color: theme.colors.text.primary}}>
                            <div className="max-w-[180px] truncate" title={kf.title.text}>
                              {kf.title.text || '--'}
                            </div>
                          </td>

                          {/* Description Column */}
                          <td className={`px-6 py-4 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'}`} style={{color: theme.colors.text.primary}}>
                            <div className="max-w-[180px] truncate" title={kf.description?.text || ""}>
                              {kf.description?.text || '--'}
                            </div>
                          </td>

                          {/* Actions Column */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`flex items-center gap-2 ${uiState.modalLanguage === 'ur' ? 'justify-start' : 'justify-end'}`}>
                              <button
                                type="button"
                                onClick={() => {
                                  // Set the editing key feature with the current item's data
                                  updateModalState({
                                    editingKeyFeature: {...kf, description: kf.description ? kf.description : {text: ""}},
                                    editingImpact: null,
                                    editingImpactIndex: null,
                                  });
                                  // Set mini modal language to current main modal language
                                  updateUIState({miniModalLanguage: uiState.modalLanguage});
                                  updateModalState({keyFeatureModalOpen: true});
                                }}
                                className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer"
                                style={{color: theme.colors.primary}}
                              >
                                <FiEdit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const features = (formState.selectedService?.[uiState.modalLanguage]?.keyFeatures || []).filter((f) => f.id !== kf.id).map((f) => ({...f, description: f.description ? f.description : {text: ""}}));
                                  updateKeyFeatures(features);
                                }}
                                className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer"
                                style={{color: theme.colors.status.error}}
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

                {/* Impact Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-2 mb-4" style={{direction: uiState.modalLanguage === "ur" ? "rtl" : "ltr", textAlign: uiState.modalLanguage === "ur" ? "right" : "left", fontFamily: theme.fonts[uiState.modalLanguage].primary}}>
                    <FiType className="w-5 h-5" style={{color: theme.colors.primary}} />
                    <span className="text-lg font-semibold" style={{color: theme.colors.text.primary}}>
                      {labels.impact[uiState.modalLanguage]}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        updateModalState({
                          editingImpact: {id: Date.now().toString(), label: {text: ""}, value: "", iconName: "", prefix: "", suffix: ""},
                          editingImpactIndex: null,
                          editingKeyFeature: null,
                        });
                        // Set mini modal language to current main modal language
                        updateUIState({miniModalLanguage: uiState.modalLanguage});
                        updateModalState({impactModalOpen: true});
                      }}
                      className="ml-auto px-3 py-1 rounded bg-blue-600 text-white"
                    >
                      Add
                    </button>
                  </div>

                  {/* Impact Title */}
                  <div className="mb-4" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                    <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                      Impact Title ({uiState.modalLanguage === 'en' ? 'English' : 'Urdu'})
                    </label>
                    <input
                      type="text"
                      value={formState.selectedService?.[uiState.modalLanguage]?.impactTitle?.text || ''}
                      onChange={e => formState.selectedService && handleServiceChange(uiState.modalLanguage, {
                        ...formState.selectedService[uiState.modalLanguage],
                        impactTitle: { text: e.target.value }
                      })}
                      className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                      style={{
                        borderColor: theme.colors.border.default,
                        color: theme.colors.text.primary,
                        backgroundColor: theme.colors.background.primary,
                        fontFamily: theme.fonts[uiState.modalLanguage].primary,
                        direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr',
                        textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left'
                      }}
                      placeholder={uiState.modalLanguage === 'en' ? 'Enter impact title' : 'اثرات کا عنوان درج کریں'}
                    />
                  </div>
                  <table className="min-w-full divide-y" style={{borderColor: theme.colors.border.default, direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr'}}>
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider" style={{color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary}}>
                          Icon
                        </th>
                        <th className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'}`} style={{color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary}}>
                          Label
                        </th>
                        <th className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'}`} style={{color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary}}>
                          Value
                        </th>
                        <th className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'}`} style={{color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary}}>
                          Suffix/Prefix
                        </th>
                        <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider" style={{color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary}}>
                          <div className={`flex ${uiState.modalLanguage === 'ur' ? 'justify-start' : 'justify-end'}`}>
                            Actions
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{borderColor: theme.colors.border.default}}>
                      {(formState.selectedService?.[uiState.modalLanguage]?.impact || []).map((imp, idx) => {
                        // Get the icon component
                        const IconComponent = imp.iconName ? require('react-icons/fa')[imp.iconName] : null;

                        return (
                          <tr key={imp.id || idx} className="hover:bg-gray-50" style={{backgroundColor: theme.colors.background.secondary}}>
                            {/* Icon Column */}
                            <td className="px-6 py-4 text-center" style={{color: theme.colors.text.primary}}>
                              <div className="flex items-center justify-center">
                                {IconComponent && (
                                  <IconComponent
                                    className="w-5 h-5"
                                    style={{color: theme.colors.primary}}
                                  />
                                )}
                                {!IconComponent && imp.iconName && (
                                  <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
                                    <span className="text-xs text-gray-500">?</span>
                                  </div>
                                )}
                                {!imp.iconName && (
                                  <span className="text-gray-400">--</span>
                                )}
                              </div>
                            </td>

                            {/* Label Column */}
                            <td className={`px-6 py-4 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'}`} style={{color: theme.colors.text.primary}}>
                              <div className="max-w-[150px] truncate" title={imp.label.text}>
                                {imp.label.text || '--'}
                              </div>
                            </td>

                            {/* Value Column */}
                            <td className={`px-6 py-4 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'}`} style={{color: theme.colors.text.primary}}>
                              <div className="max-w-[100px] truncate" title={imp.value}>
                                {imp.value || '--'}
                              </div>
                            </td>

                            {/* Suffix/Prefix Column */}
                            <td className={`px-6 py-4 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'}`} style={{color: theme.colors.text.primary}}>
                              <div className="max-w-[100px] truncate">
                                {imp.prefix || imp.suffix ? (
                                  <span title={`${imp.prefix || ''}${imp.suffix || ''}`}>
                                    {imp.prefix && <span className="text-blue-600">{imp.prefix}</span>}
                                    {imp.prefix && imp.suffix && <span className="mx-1">|</span>}
                                    {imp.suffix && <span className="text-green-600">{imp.suffix}</span>}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">--</span>
                                )}
                              </div>
                            </td>

                            {/* Actions Column */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`flex items-center gap-2 ${uiState.modalLanguage === 'ur' ? 'justify-start' : 'justify-end'}`}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Set the editing impact with the current item's data
                                    updateModalState({
                                      editingImpact: {...imp},
                                      editingImpactIndex: idx,
                                      editingKeyFeature: null,
                                    });
                                    // Set mini modal language to current main modal language
                                    updateUIState({miniModalLanguage: uiState.modalLanguage});
                                    updateModalState({impactModalOpen: true});
                                  }}
                                  className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer"
                                  style={{color: theme.colors.primary}}
                                >
                                  <FiEdit2 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const impact = (formState.selectedService?.[uiState.modalLanguage]?.impact || []).filter((f) => f.id !== imp.id);
                                    updateImpact(impact);
                                  }}
                                  className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer"
                                  style={{color: theme.colors.status.error}}
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                 {/* Social Share Settings - English Only */}
                 <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <FiType className="w-5 h-5" style={{color: theme.colors.primary}} />
                    <span className="text-lg font-semibold" style={{color: theme.colors.text.primary}}>
                      Social Share Settings
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                        Social Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formState.selectedService?.socialShare?.title?.text || ''}
                        onChange={e => formState.selectedService && handleServiceChange('socialShare', {
                          ...formState.selectedService.socialShare,
                          title: { text: e.target.value }
                        })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes('socialShare.title') ? 'border-red-500' : ''}`}
                        style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary }}
                        placeholder="Enter social media title"
                        required
                      />
                      {validationState.missingFields.includes('socialShare.title') && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                        Social Description <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formState.selectedService?.socialShare?.description?.text || ''}
                        onChange={e => formState.selectedService && handleServiceChange('socialShare', {
                          ...formState.selectedService.socialShare,
                          description: { text: e.target.value }
                        })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes('socialShare.description') ? 'border-red-500' : ''}`}
                        style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary }}
                        placeholder="Enter social media description"
                        required
                      />
                      {validationState.missingFields.includes('socialShare.description') && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                        Hashtags (comma separated) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(formState.selectedService?.socialShare?.hashtags) ? formState.selectedService.socialShare.hashtags.join(', ') : ''}
                        onChange={e => formState.selectedService && handleServiceChange('socialShare', {
                          ...formState.selectedService.socialShare,
                          hashtags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                        })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes('socialShare.hashtags') ? 'border-red-500' : ''}`}
                        style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary }}
                        placeholder="Enter hashtags separated by commas"
                        required
                      />
                      {validationState.missingFields.includes('socialShare.hashtags') && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                        Twitter Handle <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formState.selectedService?.socialShare?.twitterHandle || ''}
                        onChange={e => formState.selectedService && handleServiceChange('socialShare', {
                          ...formState.selectedService.socialShare,
                          twitterHandle: e.target.value
                        })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes('socialShare.twitterHandle') ? 'border-red-500' : ''}`}
                        style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary }}
                        placeholder="Enter Twitter handle"
                        required
                      />
                      {validationState.missingFields.includes('socialShare.twitterHandle') && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                        OG Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formState.selectedService?.socialShare?.ogType || 'article'}
                        onChange={e => formState.selectedService && handleServiceChange('socialShare', {
                          ...formState.selectedService.socialShare,
                          ogType: e.target.value
                        })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes('socialShare.ogType') ? 'border-red-500' : ''}`}
                        style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary }}
                        required
                      >
                        <option value="article">Article</option>
                        <option value="website">Website</option>
                        <option value="profile">Profile</option>
                      </select>
                      {validationState.missingFields.includes('socialShare.ogType') && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>
                  </div>
                </div>



                <div className="pt-6 border-t mt-6 flex justify-end gap-4" style={{borderColor: theme.colors.border.default}}>
                  <button
                    type="button"
                    onClick={() => {
                      updateUIState({isModalOpen: false, hasChanges: false});
                      updateFormState({selectedService: null});
                      updateValidationState({missingFields: [], missingOppositeLang: [], homepageLimitError: { en: '', ur: '' }});
                      updatePromptState({
                        showSwitchLangPrompt: false,
                        showSwitchFeatureLangPrompt: false,
                        showSwitchImpactLangPrompt: false,
                      });
                    }}
                    className="px-4 py-2 rounded-lg transition-colors duration-200"
                    style={{backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary}}
                  >
                    Cancel
                  </button>
                  <button type="submit" disabled={formState.isSaving} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50" style={{backgroundColor: theme.colors.primary, color: theme.colors.text.light}}>
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
            <h3 className="text-lg font-bold mb-4" style={{color: theme.colors.text.primary, fontFamily: uiState.miniModalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary}}>
              {modalState.editingKeyFeature ? labels.edit[uiState.miniModalLanguage] : labels.add[uiState.miniModalLanguage]} {labels.keyFeatures[uiState.miniModalLanguage]}
            </h3>
            {/* Language Switcher */}
            <div className="flex justify-center gap-4 mb-4">
              <button type="button" onClick={() => handleMiniModalLanguageSwitch("en")} className={`px-4 py-2 rounded transition-colors duration-300 ${uiState.miniModalLanguage === "en" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`} style={{fontFamily: theme.fonts.en.primary}}>
                English
              </button>
              <button type="button" onClick={() => handleMiniModalLanguageSwitch("ur")} className={`px-4 py-2 rounded transition-colors duration-300 ${uiState.miniModalLanguage === "ur" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`} style={{fontFamily: theme.fonts.ur.primary}}>
                اردو
              </button>
            </div>
            <div className="mb-4" style={{direction: uiState.miniModalLanguage === "ur" ? "rtl" : "ltr", textAlign: uiState.miniModalLanguage === "ur" ? "right" : "left", fontFamily: theme.fonts[uiState.miniModalLanguage].primary}}>
              <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.secondary}}>
                {labels.title[uiState.miniModalLanguage]}
                {promptState.keyFeatureRequiredInOpposite && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={modalState.editingKeyFeature?.title?.text || ""}
                onChange={(e) =>
                  updateModalState({
                    editingKeyFeature: modalState.editingKeyFeature ? {...modalState.editingKeyFeature, title: {text: e.target.value}} : {id: Date.now().toString(), title: {text: e.target.value}, description: {text: ""}},
                  })
                }
                className={`w-full p-2 border rounded ${promptState.keyFeatureRequiredInOpposite && !modalState.editingKeyFeature?.title?.text ? "border-red-500" : ""}`}
                style={{color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: promptState.keyFeatureRequiredInOpposite && !modalState.editingKeyFeature?.title?.text ? "#ef4444" : theme.colors.border.default, fontFamily: theme.fonts[uiState.miniModalLanguage].primary}}
              />
              {promptState.keyFeatureRequiredInOpposite && !modalState.editingKeyFeature?.title?.text && <p className="text-xs text-red-600 mt-1">This field is required.</p>}
            </div>
            <div className="mb-4" style={{direction: uiState.miniModalLanguage === "ur" ? "rtl" : "ltr", textAlign: uiState.miniModalLanguage === "ur" ? "right" : "left", fontFamily: theme.fonts[uiState.miniModalLanguage].primary}}>
              <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.secondary}}>
                {labels.description[uiState.miniModalLanguage]}
                {promptState.keyFeatureRequiredInOpposite && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={modalState.editingKeyFeature?.description?.text || ""}
                onChange={(e) =>
                  updateModalState({
                    editingKeyFeature: modalState.editingKeyFeature ? {...modalState.editingKeyFeature, description: {text: e.target.value}} : {id: Date.now().toString(), title: {text: ""}, description: {text: e.target.value}},
                  })
                }
                className={`w-full p-2 border rounded ${promptState.keyFeatureRequiredInOpposite && !modalState.editingKeyFeature?.description?.text ? "border-red-500" : ""}`}
                style={{color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: promptState.keyFeatureRequiredInOpposite && !modalState.editingKeyFeature?.description?.text ? "#ef4444" : theme.colors.border.default, fontFamily: theme.fonts[uiState.miniModalLanguage].primary}}
              />
              {promptState.keyFeatureRequiredInOpposite && !modalState.editingKeyFeature?.description?.text && <p className="text-xs text-red-600 mt-1">This field is required.</p>}
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeKeyFeatureModal} className="px-4 py-2 rounded bg-gray-200" style={{color: theme.colors.text.primary}}>
                {labels.cancel[uiState.miniModalLanguage]}
              </button>
              {promptState.keyFeatureRequiredInOpposite && (
                <button
                  type="button"
                  onClick={() => {
                    // Find the original language that has the data
                    const currentLang = uiState.miniModalLanguage;
                    const originalLang = currentLang === 'en' ? 'ur' : 'en';

                    // Find the original key feature data from the language that has it
                    const originalKeyFeature = formState.selectedService?.[originalLang]?.keyFeatures?.find((item: any) => item.id === modalState.editingKeyFeature?.id);

                    if (originalKeyFeature && formState.selectedService) {
                      // Copy the original data to current language
                      const copiedKeyFeature = {
                        ...originalKeyFeature, // Copy all fields
                        title: { text: originalKeyFeature.title.text }, // Copy the same title text
                        description: { text: originalKeyFeature.description.text } // Copy the same description text
                      };

                      // Update current language key features
                      const updatedService = { ...formState.selectedService };
                      if (!updatedService[currentLang]) {
                        updatedService[currentLang] = {
                          title: { text: "" },
                          shortDescription: { text: "" },
                          fullDescription: { text: "" },
                          impactTitle: { text: currentLang === 'en' ? "Service Impact" : "سروس کا اثر" },
                          keyFeaturesTitle: { text: currentLang === 'en' ? "Key Features" : "اہم خصوصیات" },
                          overviewTitle: { text: currentLang === 'en' ? "Overview" : "جائزہ" },
                          keyFeatures: []
                        };
                      }
                      if (!updatedService[currentLang].keyFeatures) updatedService[currentLang].keyFeatures = [];

                      // Check if item already exists in current language
                      const existingIndex = updatedService[currentLang].keyFeatures.findIndex((item: any) => item.id === copiedKeyFeature.id);
                      if (existingIndex !== -1) {
                        updatedService[currentLang].keyFeatures[existingIndex] = copiedKeyFeature;
                      } else {
                        updatedService[currentLang].keyFeatures.push(copiedKeyFeature);
                      }

                      updateFormState({ selectedService: updatedService });
                    }

                    updatePromptState({ keyFeatureRequiredInOpposite: false });
                    updateModalState({
                      keyFeatureModalOpen: false,
                      editingKeyFeature: null,
                    });
                  }}
                  className="px-4 py-2 rounded bg-yellow-500 text-white"
                >
                  Skip Translation (Copy Same)
                </button>
              )}
              <button type="button" onClick={handleSaveKeyFeature} className="px-4 py-2 rounded bg-blue-600 text-white">
                {labels.save[uiState.miniModalLanguage]}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Impact Modal */}
      {modalState.impactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4" style={{color: theme.colors.text.primary, fontFamily: uiState.miniModalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary}}>
              {modalState.editingImpactIndex !== null ? labels.edit[uiState.miniModalLanguage] : labels.add[uiState.miniModalLanguage]} {labels.impact[uiState.miniModalLanguage]}
            </h3>
            {/* Language Switcher */}
            <div className="flex justify-center gap-4 mb-4">
              <button type="button" onClick={() => handleMiniModalLanguageSwitch("en")} className={`px-4 py-2 rounded transition-colors duration-300 ${uiState.miniModalLanguage === "en" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`} style={{fontFamily: theme.fonts.en.primary}}>
                English
              </button>
              <button type="button" onClick={() => handleMiniModalLanguageSwitch("ur")} className={`px-4 py-2 rounded transition-colors duration-300 ${uiState.miniModalLanguage === "ur" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"}`} style={{fontFamily: theme.fonts.ur.primary}}>
                اردو
              </button>
            </div>
            <div className="mb-4" style={{direction: uiState.miniModalLanguage === "ur" ? "rtl" : "ltr", textAlign: uiState.miniModalLanguage === "ur" ? "right" : "left", fontFamily: theme.fonts[uiState.miniModalLanguage].primary}}>
              <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.secondary}}>
                {labels.label[uiState.miniModalLanguage]}
                {promptState.impactRequiredInOpposite && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={modalState.editingImpact?.label?.text || ""}
                onChange={(e) =>
                  updateModalState({
                    editingImpact: modalState.editingImpact ? {...modalState.editingImpact, label: {text: e.target.value}} : {id: Date.now().toString(), label: {text: e.target.value}, value: "", iconName: "", prefix: "", suffix: ""},
                  })
                }
                className={`w-full p-2 border rounded ${promptState.impactRequiredInOpposite && !modalState.editingImpact?.label?.text ? "border-red-500" : ""}`}
                style={{color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: promptState.impactRequiredInOpposite && !modalState.editingImpact?.label?.text ? "#ef4444" : theme.colors.border.default, fontFamily: theme.fonts[uiState.miniModalLanguage].primary}}
              />
              {promptState.impactRequiredInOpposite && !modalState.editingImpact?.label?.text && <p className="text-xs text-red-600 mt-1">This field is required.</p>}
            </div>
            <div className="mb-4" style={{direction: uiState.miniModalLanguage === "ur" ? "rtl" : "ltr", textAlign: uiState.miniModalLanguage === "ur" ? "right" : "left", fontFamily: theme.fonts[uiState.miniModalLanguage].primary}}>
              <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.secondary}}>
                {labels.value[uiState.miniModalLanguage]}
              </label>
              <input
                type="text"
                value={modalState.editingImpact?.value || ""}
                onChange={(e) =>
                  updateModalState({
                    editingImpact: modalState.editingImpact ? {...modalState.editingImpact, value: e.target.value} : {id: Date.now().toString(), label: {text: ""}, value: e.target.value, iconName: "", prefix: "", suffix: ""},
                  })
                }
                className="w-full p-2 border rounded"
                style={{color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.default, fontFamily: theme.fonts[uiState.miniModalLanguage].primary}}
              />
            </div>
            <div className="mb-4" style={{direction: uiState.miniModalLanguage === "ur" ? "rtl" : "ltr", textAlign: uiState.miniModalLanguage === "ur" ? "right" : "left", fontFamily: theme.fonts[uiState.miniModalLanguage].primary}}>
              <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.secondary}}>
                {labels.iconName[uiState.miniModalLanguage]}
              </label>
              <IconSelector
                selectedIcon={modalState.editingImpact?.iconName || ""}
                onSelect={(iconName) =>
                  updateModalState({
                    editingImpact: modalState.editingImpact ? {...modalState.editingImpact, iconName} : {id: Date.now().toString(), label: {text: ""}, value: "", iconName, prefix: "", suffix: ""},
                  })
                }
                size="small"
                className="w-full"
              />
            </div>
            <div className="mb-4" style={{direction: uiState.miniModalLanguage === "ur" ? "rtl" : "ltr", textAlign: uiState.miniModalLanguage === "ur" ? "right" : "left", fontFamily: theme.fonts[uiState.miniModalLanguage].primary}}>
              <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.secondary}}>
                {labels.prefix[uiState.miniModalLanguage]}
              </label>
              <input
                type="text"
                value={modalState.editingImpact?.prefix || ""}
                onChange={(e) =>
                  updateModalState({
                    editingImpact: modalState.editingImpact ? {...modalState.editingImpact, prefix: e.target.value} : {id: Date.now().toString(), label: {text: ""}, value: "", iconName: "", prefix: e.target.value, suffix: ""},
                  })
                }
                className="w-full p-2 border rounded"
                style={{color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.default, fontFamily: theme.fonts[uiState.miniModalLanguage].primary}}
              />
            </div>
            <div className="mb-4" style={{direction: uiState.miniModalLanguage === "ur" ? "rtl" : "ltr", textAlign: uiState.miniModalLanguage === "ur" ? "right" : "left", fontFamily: theme.fonts[uiState.miniModalLanguage].primary}}>
              <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.secondary}}>
                {labels.suffix[uiState.miniModalLanguage]}
              </label>
              <input
                type="text"
                value={modalState.editingImpact?.suffix || ""}
                onChange={(e) =>
                  updateModalState({
                    editingImpact: modalState.editingImpact ? {...modalState.editingImpact, suffix: e.target.value} : {id: Date.now().toString(), label: {text: ""}, value: "", iconName: "", prefix: "", suffix: e.target.value},
                  })
                }
                className="w-full p-2 border rounded"
                style={{color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.default, fontFamily: theme.fonts[uiState.miniModalLanguage].primary}}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={closeImpactModal} className="px-4 py-2 rounded bg-gray-200" style={{color: theme.colors.text.primary}}>
                {labels.cancel[uiState.miniModalLanguage]}
              </button>
              {promptState.impactRequiredInOpposite && (
                <button
                  type="button"
                  onClick={() => {
                    // Find the original language that has the data
                    const currentLang = uiState.miniModalLanguage;
                    const originalLang = currentLang === 'en' ? 'ur' : 'en';

                    // Find the original impact data from the language that has it
                    const originalImpact = formState.selectedService?.[originalLang]?.impact?.find((item: any) => item.id === modalState.editingImpact?.id);

                    if (originalImpact && formState.selectedService) {
                      // Copy the original data to current language
                      const copiedImpact = {
                        ...originalImpact, // Copy all fields (value, iconName, suffix, prefix, etc.)
                        label: { text: originalImpact.label.text } // Copy the same label text
                      };

                      // Update current language impact
                      const updatedService = { ...formState.selectedService };
                      if (!updatedService[currentLang]) {
                        updatedService[currentLang] = {
                          title: { text: "" },
                          shortDescription: { text: "" },
                          fullDescription: { text: "" },
                          impactTitle: { text: currentLang === 'en' ? "Service Impact" : "سروس کا اثر" },
                          keyFeaturesTitle: { text: currentLang === 'en' ? "Key Features" : "اہم خصوصیات" },
                          overviewTitle: { text: currentLang === 'en' ? "Overview" : "جائزہ" },
                          impact: []
                        };
                      }
                      if (!updatedService[currentLang].impact) updatedService[currentLang].impact = [];

                      // Check if item already exists in current language
                      const existingIndex = updatedService[currentLang].impact.findIndex((item: any) => item.id === copiedImpact.id);
                      if (existingIndex !== -1) {
                        updatedService[currentLang].impact[existingIndex] = copiedImpact;
                      } else {
                        updatedService[currentLang].impact.push(copiedImpact);
                      }

                      updateFormState({ selectedService: updatedService });
                    }

                    updatePromptState({ impactRequiredInOpposite: false });
                    updateModalState({
                      impactModalOpen: false,
                      editingImpact: null,
                      editingImpactIndex: null,
                    });
                  }}
                  className="px-4 py-2 rounded bg-yellow-500 text-white"
                >
                  Skip Translation (Copy Same)
                </button>
              )}
              <button type="button" onClick={handleSaveImpact} className="px-4 py-2 rounded bg-blue-600 text-white">
                {labels.save[uiState.miniModalLanguage]}
              </button>
            </div>
          </div>
        </div>
      )}
      {promptState.showSwitchFeatureLangPrompt && (
        <div className="fixed left-1/2 top-20 z-50 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in" style={{minWidth: 320, maxWidth: 400}}>
          <div className="flex-1 text-sm text-center">{uiState.modalLanguage === "en" ? "Some Key Features are missing in Urdu. Please switch to Urdu and fill them." : "Some Key Features are missing in English. Please switch to English and fill them."}</div>
          <button
            type="button"
            onClick={() => {
              updateUIState({miniModalLanguage: uiState.modalLanguage === "en" ? "ur" : "en"});
              updatePromptState({showSwitchFeatureLangPrompt: false});
            }}
            className="px-3 py-1 rounded bg-blue-600 text-white text-xs shadow"
          >
            Switch to {uiState.modalLanguage === "en" ? "Urdu" : "English"}
          </button>
          <button type="button" onClick={() => updatePromptState({showSwitchFeatureLangPrompt: false})} className="ml-2 p-1 rounded hover:bg-yellow-200" aria-label="Close">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}
      {promptState.showSwitchImpactLangPrompt && (
        <div className="fixed left-1/2 top-32 z-50 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in" style={{minWidth: 320, maxWidth: 400}}>
          <div className="flex-1 text-sm text-center">{uiState.modalLanguage === "en" ? "Some Impact entries are missing in Urdu. Please switch to Urdu and fill them." : "Some Impact entries are missing in English. Please switch to English and fill them."}</div>
          <button
            type="button"
            onClick={() => {
              updateUIState({miniModalLanguage: uiState.modalLanguage === "en" ? "ur" : "en"});
              updatePromptState({showSwitchImpactLangPrompt: false});
            }}
            className="px-3 py-1 rounded bg-blue-600 text-white text-xs shadow"
          >
            Switch to {uiState.modalLanguage === "en" ? "Urdu" : "English"}
          </button>
          <button type="button" onClick={() => updatePromptState({showSwitchImpactLangPrompt: false})} className="ml-2 p-1 rounded hover:bg-yellow-200" aria-label="Close">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
