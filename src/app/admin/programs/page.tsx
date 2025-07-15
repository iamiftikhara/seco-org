"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaPlus, FaEdit, FaTrash, FaImage, FaTimes } from "react-icons/fa";
import { FiEdit2, FiSave, FiX, FiImage, FiType, FiPlus, FiTrash2 } from "react-icons/fi";
import { theme } from "@/config/theme";
import { ProgramDetail } from "@/types/programs";
import ImageSelector from '@/app/admin/components/ImageSelector';
import IconSelector from '@/app/admin/components/IconSelector';
import DashboardLoader from '../components/DashboardLoader';
import Loader from '../components/Loader';
import { showAlert, showConfirmDialog } from "@/utils/alert";

interface ProgramPageData {
  title: {
    en: { text: string };
    ur: { text: string };
  };
  description: {
    en: { text: string };
    ur: { text: string };
  };
  image: string;
}

// Types for better type safety
interface UIState {
  modalLanguage: 'en' | 'ur';
  miniModalLanguage: 'en' | 'ur';
}

interface ModalState {
  impactModalOpen: boolean;
  iconStatsModalOpen: boolean;
  partnersModalOpen: boolean;
  editingImpact: any | null;
  editingIconStats: any | null;
  editingPartners: any | null;
  editingImpactIndex: number | null;
  editingIconStatsIndex: number | null;
  editingPartnersIndex: number | null;
}

interface PromptState {
  showSwitchLangPrompt: boolean;
  showSwitchImpactLangPrompt: boolean;
  showSwitchIconStatsLangPrompt: boolean;
  showSwitchPartnersLangPrompt: boolean;
  impactRequiredInOpposite: boolean;
  iconStatsRequiredInOpposite: boolean;
  partnersRequiredInOpposite: boolean;
}

export default function ProgramsAdmin() {
  const router = useRouter();
  const [programs, setPrograms] = useState<ProgramDetail[]>([]);
  const [programPage, setProgramPage] = useState<ProgramPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "ur">("en");
  const [showPageModal, setShowPageModal] = useState(false);
  const [editingPageData, setEditingPageData] = useState<ProgramPageData | null>(null);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramDetail | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [isEditingProgramPage, setIsEditingProgramPage] = useState(false);
  const [originalProgramPage, setOriginalProgramPage] = useState<ProgramPageData | null>(null);

  // UI state
  const [uiState, setUIState] = useState<UIState>({
    modalLanguage: 'en',
    miniModalLanguage: 'en',
  });

  // Modal state
  const [modalState, setModalState] = useState<ModalState>({
    impactModalOpen: false,
    iconStatsModalOpen: false,
    partnersModalOpen: false,
    editingImpact: null,
    editingIconStats: null,
    editingPartners: null,
    editingImpactIndex: null,
    editingIconStatsIndex: null,
    editingPartnersIndex: null,
  });

  // Prompt state
  const [promptState, setPromptState] = useState<PromptState>({
    showSwitchLangPrompt: false,
    showSwitchImpactLangPrompt: false,
    showSwitchIconStatsLangPrompt: false,
    showSwitchPartnersLangPrompt: false,
    impactRequiredInOpposite: false,
    iconStatsRequiredInOpposite: false,
    partnersRequiredInOpposite: false,
  });

  // Additional state for services-like functionality
  const [validationState, setValidationState] = useState({
    missingFields: [] as string[],
    homepageLimitError: { en: '', ur: '' },
    missingOppositeLang: [] as string[],
  });

  // Program categories in both languages
  const programCategories = {
    en: [
      "Agriculture",
      "Social Development",
      "Infrastructure",
      "Education",
      "Healthcare",
      "Environment",
      "Economic Development",
      "Community Development"
    ],
    ur: [
      "زراعت",
      "سماجی ترقی",
      "بنیادی ڈھانچہ",
      "تعلیم",
      "صحت",
      "ماحولیات",
      "اقتصادی ترقی",
      "کمیونٹی ڈیولپمنٹ"
    ]
  };

  // Labels for UI text in both languages
  const labels = {
    title: { en: "Title", ur: "عنوان" },
    shortDescription: { en: "Short Description", ur: "مختصر وضاحت" },
    fullDescription: { en: "Full Description", ur: "مکمل وضاحت" },
    category: { en: "Category", ur: "قسم" },
    duration: { en: "Duration", ur: "مدت" },
    coverage: { en: "Coverage", ur: "کوریج" },
    impact: { en: "Impact", ur: "اثرات" },
    iconStats: { en: "Icon Statistics", ur: "آئیکن اعداد و شمار" },
    partners: { en: "Partners", ur: "شراکت دار" },
    impactTitle: { en: "Impact Title", ur: "اثرات کا عنوان" },
    iconStatsTitle: { en: "Icon Stats Title", ur: "آئیکن اعداد و شمار کا عنوان" },
    partnersTitle: { en: "Partners Title", ur: "شراکت داروں کا عنوان" },
    label: { en: "Label", ur: "لیبل" },
    value: { en: "Value", ur: "قدر" },
    suffix: { en: "Suffix", ur: "لاحقہ" },
    prefix: { en: "Prefix", ur: "سابقہ" },
    iconName: { en: "Icon Name", ur: "آئیکن نام" },
    name: { en: "Name", ur: "نام" },
    logo: { en: "Logo", ur: "لوگو" },
    website: { en: "Website", ur: "ویب سائٹ" },
    add: { en: "Add", ur: "شامل کریں" },
    edit: { en: "Edit", ur: "ترمیم کریں" },
    cancel: { en: "Cancel", ur: "منسوخ کریں" },
    save: { en: "Save", ur: "محفوظ کریں" },
    socialShare: { en: "Social Share Settings", ur: "سوشل شیئر سیٹنگز" },
    socialTitle: { en: "Social Title", ur: "سوشل ٹائٹل" },
    socialDescription: { en: "Social Description", ur: "سوشل تفصیل" },
    hashtags: { en: "Hashtags", ur: "ہیش ٹیگز" },
    twitterHandle: { en: "Twitter Handle", ur: "ٹویٹر ہینڈل" },
    ogType: { en: "OG Type", ur: "OG قسم" },
    // Placeholders
    titlePlaceholder: {
      en: "Enter program title in English",
      ur: "اردو میں پروگرام کا عنوان درج کریں"
    },
    shortDescPlaceholder: {
      en: "Enter short description in English",
      ur: "اردو میں مختصر وضاحت درج کریں"
    },
    fullDescPlaceholder: {
      en: "Enter full description in English",
      ur: "اردو میں مکمل وضاحت درج کریں"
    },
    categoryPlaceholder: {
      en: "Select category",
      ur: "قسم منتخب کریں"
    },
    durationPlaceholder: {
      en: "Enter program duration",
      ur: "پروگرام کی مدت درج کریں"
    },
    coveragePlaceholder: {
      en: "Enter coverage area",
      ur: "کوریج کا علاقہ درج کریں"
    },
    socialTitlePlaceholder: {
      en: "Enter social media title",
      ur: "سوشل میڈیا ٹائٹل درج کریں"
    },
    socialDescPlaceholder: {
      en: "Enter social media description",
      ur: "سوشل میڈیا تفصیل درج کریں"
    },
    hashtagsPlaceholder: {
      en: "Enter hashtags separated by commas",
      ur: "کاما سے الگ کرتے ہوئے ہیش ٹیگز درج کریں"
    },
    twitterPlaceholder: {
      en: "Enter Twitter handle",
      ur: "ٹویٹر ہینڈل درج کریں"
    }
  };

  // Helper functions
  const getFontFamily = () => (currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary);

  // Helper function to get React icon component from icon name (shared for tables)
  const getIconComponent = (iconName: string) => {
    if (!iconName) return null;

    // Icon name mappings for common icons that might have different names
    const iconMappings: { [key: string]: string } = {
      'FaHandHoldingWater': 'FaHandHoldingDroplet',
      'FaWater': 'FaTint',
      'FaHandHoldingUsd': 'FaHandHoldingDollar',
    };

    // Use mapping if available
    const mappedIconName = iconMappings[iconName] || iconName;

    // If iconName already starts with "Fa", use it directly
    if (mappedIconName.startsWith('Fa')) {
      // Try FA5 first
      const IconComponent = (require('react-icons/fa') as any)[mappedIconName];
      if (IconComponent) return IconComponent;

      return null;
    }

    return null;
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  const handleErrorResponse = (error: any) => {
    if (error.status === 403) {
      router.push('/admin/login');
      return;
    }
    setError(error.message || 'An error occurred');
  };

  // Helper functions for state updates
  const updateValidationState = (updates: Partial<typeof validationState>) => {
    setValidationState(prev => ({ ...prev, ...updates }));
  };

  const updatePromptState = (updates: Partial<PromptState>) => {
    setPromptState(prev => ({ ...prev, ...updates }));
  };

  const updateUIState = (updates: Partial<UIState>) => {
    setUIState(prev => ({ ...prev, ...updates }));
  };

  const updateModalState = (updates: Partial<ModalState>) => {
    setModalState(prev => ({ ...prev, ...updates }));
  };

  // Mini modal language switch handler
  const handleMiniModalLanguageSwitch = (lang: 'en' | 'ur') => {
    updateUIState({ miniModalLanguage: lang });
  };

  // Validation functions
  const validateProgram = (program: any, currentLang: 'en' | 'ur') => {
    const requiredFields = [
      // Program Image (required)
      { key: 'featuredImage', value: program.featuredImage },
      // Current language fields (required first)
      { key: `${currentLang}.title`, value: program[currentLang]?.title?.text },
      { key: `${currentLang}.shortDescription`, value: program[currentLang]?.shortDescription?.text },
      { key: `${currentLang}.fullDescription`, value: program[currentLang]?.fullDescription?.text },
      { key: `${currentLang}.category`, value: program[currentLang]?.category?.text },
      // Social Share Settings (required)
      { key: 'socialShare.title', value: program.socialShare?.title?.text },
      { key: 'socialShare.description', value: program.socialShare?.description?.text },
      { key: 'socialShare.hashtags', value: Array.isArray(program.socialShare?.hashtags) && program.socialShare.hashtags.length > 0 ? 'ok' : '' },
      { key: 'socialShare.twitterHandle', value: program.socialShare?.twitterHandle },
      { key: 'socialShare.ogType', value: program.socialShare?.ogType },
    ];

    // Add opposite language fields
    const oppositeLang = currentLang === 'en' ? 'ur' : 'en';
    const oppositeFields = [
      { key: `${oppositeLang}.title`, value: program[oppositeLang]?.title?.text },
      { key: `${oppositeLang}.shortDescription`, value: program[oppositeLang]?.shortDescription?.text },
      { key: `${oppositeLang}.fullDescription`, value: program[oppositeLang]?.fullDescription?.text },
      { key: `${oppositeLang}.category`, value: program[oppositeLang]?.category?.text },
    ];

    return [...requiredFields, ...oppositeFields].filter(f => !f.value).map(f => f.key);
  };

  const checkLanguageConsistency = (program: any, currentLang: 'en' | 'ur') => {
    const oppositeLang = currentLang === 'en' ? 'ur' : 'en';

    // Check for missing impact in the opposite language
    const impactArr = program[currentLang]?.impact || [];
    const impactOpposite = program[oppositeLang]?.impact || [];
    const missingImpactIds = impactArr.filter((f: any) => !impactOpposite.some((of: any) => of.id === f.id));

    // Check for missing icon stats in the opposite language
    const iconStatsArr = program[currentLang]?.iconStats || [];
    const iconStatsOpposite = program[oppositeLang]?.iconStats || [];
    const missingIconStatsIds = iconStatsArr.filter((f: any) => !iconStatsOpposite.some((of: any) => of.id === f.id));

    // Check for missing partners in the opposite language
    const partnersArr = program[currentLang]?.partners || [];
    const partnersOpposite = program[oppositeLang]?.partners || [];
    const missingPartnersIds = partnersArr.filter((f: any) => !partnersOpposite.some((of: any) => of.id === f.id));

    return {
      missingImpact: missingImpactIds.length > 0,
      missingIconStats: missingIconStatsIds.length > 0,
      missingPartners: missingPartnersIds.length > 0,
    };
  };

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/programs', {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 403) {
          router.push('/admin/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch programs');
      }

      // Handle the data structure correctly
      const data = result.data;
      setPrograms(data.programsList || []);
      setProgramPage(data.programPage || {
        title: {
          en: { text: "Our Programs" },
          ur: { text: "ہمارے پروگرامز" }
        },
        description: {
          en: { text: "Discover our comprehensive programs designed to make a positive impact." },
          ur: { text: "ہمارے جامع پروگرامز دریافت کریں جو مثبت اثرات کے لیے ڈیزائن کیے گئے ہیں۔" }
        },
        image: "/images/programs-hero.jpg"
      });
    } catch (err: any) {
      handleErrorResponse(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  // Check homepage limit when modal opens
  useEffect(() => {
    if (showProgramModal && formData) {
      const homepageCount = programs.filter(p =>
        p.showOnHomepage && (!editingProgram?.id || p.id !== editingProgram.id)
      ).length;

      if (!formData.showOnHomepage && homepageCount >= 4) {
        updateValidationState({
          homepageLimitError: {
            en: 'You can only show up to 4 programs on the homepage. Please remove one before adding another.',
            ur: 'آپ صرف 4 پروگرامز کو ہوم پیج پر دکھا سکتے ہیں۔ کوئی اور شامل کرنے سے پہلے ایک کو ہٹا دیں۔'
          }
        });
      } else {
        updateValidationState({ homepageLimitError: { en: '', ur: '' } });
      }
    }
  }, [showProgramModal, formData, programs, editingProgram]);





  const deleteProgram = async (programId: string) => {
    const result = await showConfirmDialog({
      title: "Delete Program?",
      text: "Are you sure you want to delete this program? This action cannot be undone.",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        setIsSubmitting(true);
        const response = await fetch(`/api/admin/programs?id=${programId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 403) {
            router.push('/admin/login');
            return;
          }
          throw new Error('Failed to delete program');
        }

        const result = await response.json();
        if (result.success) {
          showAlert({
            title: "Success",
            text: "Program deleted successfully!",
            icon: "success",
          });
          setPrograms(programs.filter(program => program.id !== programId));
        } else {
          showAlert({
            title: "Error",
            text: result.error || "Failed to delete program",
            icon: "error",
          });
        }
      } catch (err: any) {
        showAlert({
          title: "Error",
          text: "Failed to delete program",
          icon: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const createEmptyProgram = () => ({
    slug: "",
    featuredImage: "",
    isActive: true,
    showOnHomepage: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    socialShare: {
      title: { text: "" },
      description: { text: "" },
      hashtags: [],
      twitterHandle: "",
      ogType: "article"
    },
    en: {
      title: { text: "" },
      category: { text: "" },
      shortDescription: { text: "" },
      fullDescription: { text: "" },
      duration: { text: "" },
      coverage: { text: "" },
      impactTitle: { text: "Program Impact" },
      iconStatsTitle: { text: "Key Statistics" },
      partnersTitle: { text: "Our Partners" },
      impact: [],
      iconStats: [],
      partners: []
    },
    ur: {
      title: { text: "" },
      category: { text: "" },
      shortDescription: { text: "" },
      fullDescription: { text: "" },
      duration: { text: "" },
      coverage: { text: "" },
      impactTitle: { text: "پروگرام کا اثر" },
      iconStatsTitle: { text: "اہم اعداد و شمار" },
      partnersTitle: { text: "ہمارے شراکت دار" },
      impact: [],
      iconStats: [],
      partners: []
    }
  });

  const addNewProgram = () => {
    setEditingProgram(null);
    setFormData(createEmptyProgram());
    updateUIState({ modalLanguage: 'en', miniModalLanguage: 'en' });
    setShowProgramModal(true);
  };

  const editProgram = (program: ProgramDetail) => {
    setEditingProgram(program);
    setFormData({ ...program });
    updateUIState({ modalLanguage: 'en', miniModalLanguage: 'en' });
    setShowProgramModal(true);
  };

  const editProgramPage = () => {
    setEditingPageData(programPage);
    setShowPageModal(true);
  };

  const handleProgramPageChange = (field: string, value: any) => {
    setProgramPage((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProgramPageLangChange = (field: string, lang: 'en' | 'ur', value: string) => {
    setProgramPage((prev: any) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: { text: value }
      }
    }));
  };

  const handleProgramPageSave = async () => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/admin/programs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: 'page',
          programPage: programPage
        }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to save page data');
      }

      const result = await response.json();
      if (result.success) {
        setIsEditingProgramPage(false);
        setOriginalProgramPage(null);
        await fetchPrograms(); // Refresh the data
      }
    } catch (err: any) {
      handleErrorResponse(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLanguageChange = (lang: 'en' | 'ur', field: string, value: any) => {
    setFormData((prev: any) => {
      const updated = {
        ...prev,
        [lang]: {
          ...prev[lang],
          [field]: value
        }
      };

      // Auto-generate slug when English title changes
      if (lang === 'en' && field === 'title' && value.text) {
        updated.slug = generateSlug(value.text);
      }

      // Auto-sync category between languages
      if (field === 'category' && value.text) {
        const categoryIndex = programCategories[lang].indexOf(value.text);
        if (categoryIndex !== -1) {
          const oppositeLang = lang === 'en' ? 'ur' : 'en';
          const oppositeCategory = programCategories[oppositeLang][categoryIndex];
          if (oppositeCategory) {
            updated[oppositeLang] = {
              ...updated[oppositeLang],
              category: { text: oppositeCategory }
            };
          }
        }
      }

      return updated;
    });
  };

  // Mini-modal functions for Impact
  const updateImpact = (impact: any[]) => {
    setFormData((prev: any) => ({
      ...prev,
      [uiState.miniModalLanguage]: {
        ...prev[uiState.miniModalLanguage],
        impact: impact
      }
    }));
  };

  const handleSaveImpact = () => {
    if (!modalState.editingImpact?.label?.text || !modalState.editingImpact?.value || !modalState.editingImpact?.iconName) return;

    const currentImpact = formData[uiState.miniModalLanguage]?.impact || [];
    let updatedImpact;

    if (modalState.editingImpactIndex !== null) {
      // Edit existing
      updatedImpact = currentImpact.map((item: any, index: number) =>
        index === modalState.editingImpactIndex ? modalState.editingImpact : item
      );
    } else {
      // Add new
      updatedImpact = [...currentImpact, modalState.editingImpact];
    }

    updateImpact(updatedImpact);

    // Check if this impact exists in the opposite language
    const oppositeLang = uiState.miniModalLanguage === 'en' ? 'ur' : 'en';
    const oppositeImpact = formData[oppositeLang]?.impact || [];
    const impactExistsInOpposite = oppositeImpact.some((item: any) => item.id === modalState.editingImpact?.id);

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
        }
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
  };

  // Mini-modal functions for Icon Stats
  const updateIconStats = (iconStats: any[]) => {
    setFormData((prev: any) => ({
      ...prev,
      [uiState.miniModalLanguage]: {
        ...prev[uiState.miniModalLanguage],
        iconStats: iconStats
      }
    }));
  };

  const handleSaveIconStats = () => {
    if (!modalState.editingIconStats?.label?.text || !modalState.editingIconStats?.value) return;

    const currentIconStats = formData[uiState.miniModalLanguage]?.iconStats || [];
    let updatedIconStats;

    if (modalState.editingIconStatsIndex !== null) {
      // Edit existing
      updatedIconStats = currentIconStats.map((item: any, index: number) =>
        index === modalState.editingIconStatsIndex ? modalState.editingIconStats : item
      );
    } else {
      // Add new
      updatedIconStats = [...currentIconStats, modalState.editingIconStats];
    }

    updateIconStats(updatedIconStats);

    // Check if this icon stat exists in the opposite language
    const oppositeLang = uiState.miniModalLanguage === 'en' ? 'ur' : 'en';
    const oppositeIconStats = formData[oppositeLang]?.iconStats || [];
    const iconStatsExistsInOpposite = oppositeIconStats.some((item: any) => item.id === modalState.editingIconStats?.id);

    // If icon stats doesn't exist in opposite language, keep modal open and switch language
    if (!iconStatsExistsInOpposite) {
      // Switch to opposite language and show required validation
      updateUIState({ miniModalLanguage: oppositeLang });
      updatePromptState({
        iconStatsRequiredInOpposite: true
      });
      // Set up editing for the opposite language with same ID
      updateModalState({
        editingIconStats: {
          id: modalState.editingIconStats?.id || Date.now().toString(),
          label: { text: '' },
          value: '',
          iconName: '',
          prefix: '',
          suffix: ''
        }
      });
      // Keep modal open - don't close it
    } else {
      // Both languages have the icon stats, close modal and clear required state
      updateModalState({
        iconStatsModalOpen: false,
        editingIconStats: null,
        editingIconStatsIndex: null,
      });
      updatePromptState({
        iconStatsRequiredInOpposite: false
      });
    }
  };

  // Mini-modal functions for Partners
  const updatePartners = (partners: any[]) => {
    setFormData((prev: any) => ({
      ...prev,
      [uiState.miniModalLanguage]: {
        ...prev[uiState.miniModalLanguage],
        partners: partners
      }
    }));
  };

  const handleSavePartners = () => {
    if (!modalState.editingPartners?.name?.text) return;

    const currentPartners = formData[uiState.miniModalLanguage]?.partners || [];
    let updatedPartners;

    if (modalState.editingPartnersIndex !== null) {
      // Edit existing
      updatedPartners = currentPartners.map((item: any, index: number) =>
        index === modalState.editingPartnersIndex ? modalState.editingPartners : item
      );
    } else {
      // Add new
      updatedPartners = [...currentPartners, modalState.editingPartners];
    }

    updatePartners(updatedPartners);

    // Check if this partner exists in the opposite language
    const oppositeLang = uiState.miniModalLanguage === 'en' ? 'ur' : 'en';
    const oppositePartners = formData[oppositeLang]?.partners || [];
    const partnersExistsInOpposite = oppositePartners.some((item: any) => item.id === modalState.editingPartners?.id);

    // If partner doesn't exist in opposite language, keep modal open and switch language
    if (!partnersExistsInOpposite) {
      // Switch to opposite language and show required validation
      updateUIState({ miniModalLanguage: oppositeLang });
      updatePromptState({
        partnersRequiredInOpposite: true
      });
      // Set up editing for the opposite language with same ID
      updateModalState({
        editingPartners: {
          id: modalState.editingPartners?.id || Date.now().toString(),
          name: { text: '' },
          logo: ''
        }
      });
      // Keep modal open - don't close it
    } else {
      // Both languages have the partner, close modal and clear required state
      updateModalState({
        partnersModalOpen: false,
        editingPartners: null,
        editingPartnersIndex: null,
      });
      updatePromptState({
        partnersRequiredInOpposite: false
      });
    }
  };

  // Count homepage programs for enforcing max 4
  const homepageCount = programs.filter(p =>
    p.showOnHomepage && (!editingProgram || p.id !== editingProgram.id)
  ).length;

  const saveProgramData = async () => {
    if (!formData) return;

    // Check homepage limit error
    if (validationState.homepageLimitError.en && formData.showOnHomepage) return;

    const missing = validateProgram(formData, uiState.modalLanguage);
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

    // Check for impact, icon stats, and partners consistency (only if they exist)
    const languageCheck = checkLanguageConsistency(formData, uiState.modalLanguage);

    if (languageCheck.missingImpact) {
      updatePromptState({ showSwitchImpactLangPrompt: true });
      return;
    }

    if (languageCheck.missingIconStats) {
      updatePromptState({ showSwitchIconStatsLangPrompt: true });
      return;
    }

    if (languageCheck.missingPartners) {
      updatePromptState({ showSwitchPartnersLangPrompt: true });
      return;
    }

    try {
      setIsSubmitting(true);

      const programData = {
        ...formData,
        id: editingProgram?.id,
        createdAt: editingProgram?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch('/api/admin/programs', {
        method: editingProgram ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(programData),
      });

      if (!response.ok) {
        if (response.status === 403) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to save program');
      }

      const result = await response.json();
      if (result.success) {
        showAlert({
          title: "Success",
          text: "Program saved successfully!",
          icon: "success",
        });

        await fetchPrograms(); // Refresh the list
        setShowProgramModal(false);
        setEditingProgram(null);
        setFormData(null);
        updateValidationState({ missingFields: [], missingOppositeLang: [], homepageLimitError: { en: '', ur: '' } });
        updatePromptState({
          showSwitchLangPrompt: false,
          showSwitchImpactLangPrompt: false,
          showSwitchIconStatsLangPrompt: false,
          showSwitchPartnersLangPrompt: false
        });
      } else {
        showAlert({
          title: "Error",
          text: result.error || "Failed to save program",
          icon: "error",
        });
      }
    } catch (err: any) {
      showAlert({
        title: "Error",
        text: "Failed to save program",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const savePageData = async () => {
    try {
      setIsSubmitting(true);

      const response = await fetch('/api/admin/programs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type: 'page',
          programPage: editingPageData
        }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to save page data');
      }

      const result = await response.json();
      if (result.success) {
        showAlert({
          title: "Success",
          text: "Program page updated successfully!",
          icon: "success",
        });

        await fetchPrograms(); // Refresh the data
        setShowPageModal(false);
        setEditingPageData(null);
      } else {
        showAlert({
          title: "Error",
          text: result.error || "Failed to update program page",
          icon: "error",
        });
      }
    } catch (err: any) {
      showAlert({
        title: "Error",
        text: "Failed to update program page",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <DashboardLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Programs</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchPrograms}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Loader isVisible={isSubmitting} text="Saving" />
      {/* Program Page Details - matches services page 100% */}
      {programPage && (
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8" style={{ backgroundColor: theme.colors.background.primary }}>
            <form onSubmit={e => { e.preventDefault(); if (isEditingProgramPage) handleProgramPageSave(); }} className="space-y-8">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold" style={{ color: theme.colors.text.primary }}>
                  Program Page Settings
                </h1>
                {!isEditingProgramPage ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOriginalProgramPage({ ...programPage });
                      setIsEditingProgramPage(true);
                    }}
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
                      setIsEditingProgramPage(false);
                      // Reset to original data without API call
                      if (originalProgramPage) {
                        setProgramPage(originalProgramPage);
                      }
                      setOriginalProgramPage(null);
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
              {!isEditingProgramPage ? (
                <>
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FiImage className="w-5 h-5" style={{ color: theme.colors.primary }} />
                      <h2 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                        Hero Image
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                          Hero Image
                        </label>
                        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          {programPage.image ? (
                            <img
                              src={programPage.image}
                              alt="Program page hero"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FiImage className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FiType className="w-5 h-5" style={{ color: theme.colors.primary }} />
                      <h2 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                        Page Content
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                            Title (English)
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p style={{ color: theme.colors.text.primary }}>
                              {programPage.title?.en?.text || 'No title set'}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                            Description (English)
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p style={{ color: theme.colors.text.primary }}>
                              {programPage.description?.en?.text || 'No description set'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                            Title (Urdu)
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p style={{
                              color: theme.colors.text.primary,
                              fontFamily: theme.fonts.ur.primary,
                              direction: 'rtl',
                              textAlign: 'right'
                            }}>
                              {programPage.title?.ur?.text || 'کوئی عنوان سیٹ نہیں'}
                            </p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                            Description (Urdu)
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p style={{
                              color: theme.colors.text.primary,
                              fontFamily: theme.fonts.ur.primary,
                              direction: 'rtl',
                              textAlign: 'right'
                            }}>
                              {programPage.description?.ur?.text || 'کوئی تفصیل سیٹ نہیں'}
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
                      <FiImage className="w-5 h-5" style={{ color: theme.colors.primary }} />
                      <h2 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                        Hero Image
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                          Hero Image
                        </label>
                        <ImageSelector
                          selectedPath={programPage.image || ''}
                          onSelect={(imageUrl: string) => handleProgramPageChange('image', imageUrl)}
                          size="small"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FiType className="w-5 h-5" style={{ color: theme.colors.primary }} />
                      <h2 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>
                        Page Content
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                            Title (English)
                          </label>
                          <input
                            type="text"
                            value={programPage.title?.en?.text || ''}
                            onChange={(e) => handleProgramPageLangChange('title', 'en', e.target.value)}
                            className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                            style={{
                              borderColor: theme.colors.border.default,
                              color: theme.colors.text.primary,
                              backgroundColor: theme.colors.background.primary
                            }}
                            placeholder="Enter page title in English"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                            Description (English)
                          </label>
                          <textarea
                            value={programPage.description?.en?.text || ''}
                            onChange={(e) => handleProgramPageLangChange('description', 'en', e.target.value)}
                            rows={4}
                            className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                            style={{
                              borderColor: theme.colors.border.default,
                              color: theme.colors.text.primary,
                              backgroundColor: theme.colors.background.primary
                            }}
                            placeholder="Enter page description in English"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                            Title (Urdu)
                          </label>
                          <input
                            type="text"
                            value={programPage.title?.ur?.text || ''}
                            onChange={(e) => handleProgramPageLangChange('title', 'ur', e.target.value)}
                            className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                            style={{
                              borderColor: theme.colors.border.default,
                              color: theme.colors.text.primary,
                              backgroundColor: theme.colors.background.primary,
                              fontFamily: theme.fonts.ur.primary,
                              direction: 'rtl',
                              textAlign: 'right'
                            }}
                            placeholder="اردو میں صفحہ کا عنوان درج کریں"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                            Description (Urdu)
                          </label>
                          <textarea
                            value={programPage.description?.ur?.text || ''}
                            onChange={(e) => handleProgramPageLangChange('description', 'ur', e.target.value)}
                            rows={4}
                            className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                            style={{
                              borderColor: theme.colors.border.default,
                              color: theme.colors.text.primary,
                              backgroundColor: theme.colors.background.primary,
                              fontFamily: theme.fonts.ur.primary,
                              direction: 'rtl',
                              textAlign: 'right'
                            }}
                            placeholder="اردو میں صفحہ کی تفصیل درج کریں"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: theme.colors.secondary, color: theme.colors.text.primary }}
                    >
                      <FiSave className="w-4 h-4" />
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Programs List Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: theme.colors.text.primary }}>
            Programs List
          </h2>
          <button
            onClick={addNewProgram}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: theme.colors.primary, color: theme.colors.text.light }}
          >
            <FaPlus />
            Add Program
          </button>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentLanguage("en")}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentLanguage === "en"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setCurrentLanguage("ur")}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentLanguage === "ur"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              style={{ fontFamily: theme.fonts.ur.primary }}
            >
              اردو
            </button>
          </div>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {programs.map((program) => (
            <div key={program.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Program Image */}
              <div className="relative h-48">
                <Image
                  src={program.featuredImage}
                  alt={program[currentLanguage].title.text}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    program.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {program.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Program Content */}
              <div className={`p-4 ${currentLanguage === 'ur' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ur' ? 'rtl' : 'ltr'}>
                <div className={`flex items-start mb-2 ${currentLanguage === 'ur' ? 'justify-start' : 'justify-between'}`}>
                  <span
                    className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    style={{ fontFamily: getFontFamily() }}
                  >
                    {program[currentLanguage].category.text}
                  </span>
                </div>

                <h3
                  className={`font-semibold text-gray-900 mb-2 line-clamp-2 ${currentLanguage === 'ur' ? 'text-right' : 'text-left'}`}
                  style={{ fontFamily: getFontFamily() }}
                >
                  {program[currentLanguage].title.text}
                </h3>

                <p
                  className={`text-sm text-gray-600 mb-4 line-clamp-3 ${currentLanguage === 'ur' ? 'text-right' : 'text-left'}`}
                  style={{ fontFamily: getFontFamily() }}
                >
                  {program[currentLanguage].shortDescription.text}
                </p>

                {/* Impact Stats */}
                {program[currentLanguage]?.impact && program[currentLanguage].impact.length > 0 && (
                  <div className={`flex gap-4 mb-4 ${currentLanguage === 'ur' ? 'justify-start' : 'justify-start'}`}>
                    {program[currentLanguage].impact.slice(0, 2).map((stat, index) => (
                      <div key={index} className={`text-center ${currentLanguage === 'ur' ? 'text-right' : 'text-center'}`}>
                        <div className="text-lg font-bold text-blue-600">
                          {stat.value}{stat.suffix || ""}
                        </div>
                        <div
                          className={`text-xs text-gray-500 ${currentLanguage === 'ur' ? 'text-right' : 'text-center'}`}
                          style={{ fontFamily: getFontFamily() }}
                        >
                          {stat.label.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className={`flex items-center pt-4 border-t border-gray-100 ${currentLanguage === 'ur' ? 'justify-start' : 'justify-between'}`}>
                  <div className={`flex gap-2 ${currentLanguage === 'ur' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <button
                      onClick={() => editProgram(program)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Program"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteProgram(program.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Program"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {programs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Programs Found</h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first program.
            </p>
            <button
              onClick={addNewProgram}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Program
            </button>
          </div>
        )}
      </div>

      {/* Page Edit Modal */}
      {showPageModal && editingPageData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Programs Page</h2>
                <button
                  onClick={() => {
                    setShowPageModal(false);
                    setEditingPageData(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>

              {/* Language Toggle */}
              <div className="flex justify-center mb-6">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setCurrentLanguage("en")}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      currentLanguage === "en"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setCurrentLanguage("ur")}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      currentLanguage === "ur"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    style={{ fontFamily: theme.fonts.ur.primary }}
                  >
                    اردو
                  </button>
                </div>
              </div>

              {/* Page Form */}
              <div className="space-y-6">
                {/* Page Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Title ({currentLanguage === 'en' ? 'English' : 'Urdu'})
                  </label>
                  <input
                    type="text"
                    value={editingPageData.title?.[currentLanguage]?.text || ''}
                    onChange={(e) => setEditingPageData({
                      ...editingPageData,
                      title: {
                        ...editingPageData.title,
                        [currentLanguage]: { text: e.target.value }
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{
                      fontFamily: getFontFamily(),
                      direction: currentLanguage === 'ur' ? 'rtl' : 'ltr',
                      textAlign: currentLanguage === 'ur' ? 'right' : 'left'
                    }}
                    placeholder={`Enter page title in ${currentLanguage === 'en' ? 'English' : 'Urdu'}`}
                  />
                </div>

                {/* Page Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Description ({currentLanguage === 'en' ? 'English' : 'Urdu'})
                  </label>
                  <textarea
                    value={editingPageData.description?.[currentLanguage]?.text || ''}
                    onChange={(e) => setEditingPageData({
                      ...editingPageData,
                      description: {
                        ...editingPageData.description,
                        [currentLanguage]: { text: e.target.value }
                      }
                    })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{
                      fontFamily: getFontFamily(),
                      direction: currentLanguage === 'ur' ? 'rtl' : 'ltr',
                      textAlign: currentLanguage === 'ur' ? 'right' : 'left'
                    }}
                    placeholder={`Enter page description in ${currentLanguage === 'en' ? 'English' : 'Urdu'}`}
                  />
                </div>

                {/* Page Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Hero Image
                  </label>
                  <ImageSelector
                    selectedPath={editingPageData.image || ''}
                    onSelect={(imageUrl: string) => setEditingPageData({
                      ...editingPageData,
                      image: imageUrl
                    })}
                    size="small"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowPageModal(false);
                    setEditingPageData(null);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={savePageData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Program Add/Edit Modal */}
      {showProgramModal && formData && (
        <div className="fixed inset-0 bg-[#61616167] flex items-center justify-center z-50 p-4">
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

          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProgram ? 'Edit Program' : 'Add New Program'}
                </h2>
                <button
                  onClick={() => {
                    setShowProgramModal(false);
                    setEditingProgram(null);
                    setFormData(null);
                    updateValidationState({ missingFields: [], missingOppositeLang: [], homepageLimitError: { en: '', ur: '' } });
                    updatePromptState({
                      showSwitchLangPrompt: false,
                      showSwitchImpactLangPrompt: false,
                      showSwitchIconStatsLangPrompt: false,
                      showSwitchPartnersLangPrompt: false
                    });
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <FiX className="w-5 h-5" style={{ color: theme.colors.text.secondary }} />
                </button>
              </div>

              {/* Language Toggle */}
              <div className="flex justify-center mb-6">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => updateUIState({ modalLanguage: "en" })}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      uiState.modalLanguage === "en"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => updateUIState({ modalLanguage: "ur" })}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      uiState.modalLanguage === "ur"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    style={{ fontFamily: theme.fonts.ur.primary }}
                  >
                    اردو
                  </button>
                </div>
              </div>

              {/* Program Form */}
              <div className="space-y-8">
                {/* Basic Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Featured Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                      Featured Image
                      </label>
                      <ImageSelector
                        selectedPath={formData.featuredImage || ''}
                        onSelect={(imageUrl: string) => handleFormChange('featuredImage', imageUrl)}
                        size="small"
                      />
                      {validationState.missingFields.includes('featuredImage') && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>

                    {/* Auto-generated Slug (Read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Slug (Auto-generated)
                      </label>
                      <input
                        type="text"
                        value={formData.slug || ''}
                        readOnly
                        className="w-full p-3 rounded-lg border transition-all duration-200 bg-gray-100 cursor-not-allowed"
                        style={{
                          borderColor: theme.colors.border.default,
                          color: theme.colors.text.secondary,
                          backgroundColor: '#f3f4f6'
                        }}
                        placeholder="Auto-generated from English title"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This will be automatically generated from the English title
                      </p>
                    </div>

                    {/* Status Toggles */}
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isActive || false}
                          onChange={(e) => handleFormChange('isActive', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Active</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.showOnHomepage || false}
                          onChange={(e) => handleFormChange('showOnHomepage', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          disabled={!formData.showOnHomepage && homepageCount >= 4}
                        />
                        <span className="ml-2 text-sm text-gray-700">Show on Homepage</span>
                      </label>
                    </div>
                    {validationState.homepageLimitError[uiState.modalLanguage] && (
                      <div className="w-full text-yellow-800 text-xs mt-2 bg-yellow-100 border border-yellow-300 rounded px-3 py-2" style={{ fontWeight: 500, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                        {validationState.homepageLimitError[uiState.modalLanguage]}
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Share Settings - English Only */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <FiType className="w-5 h-5" style={{ color: theme.colors.primary }} />
                    <span className="text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                      Social Share Settings
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                        Social Title
                      </label>
                      <input
                        type="text"
                        value={formData.socialShare?.title?.text || ''}
                        onChange={(e) => handleFormChange('socialShare', {
                          ...formData.socialShare,
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
                        Social Description
                      </label>
                      <input
                        type="text"
                        value={formData.socialShare?.description?.text || ''}
                        onChange={(e) => handleFormChange('socialShare', {
                          ...formData.socialShare,
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
                        Hashtags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(formData.socialShare?.hashtags) ? formData.socialShare.hashtags.join(', ') : ''}
                        onChange={(e) => handleFormChange('socialShare', {
                          ...formData.socialShare,
                          hashtags: e.target.value.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
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
                        Twitter Handle
                      </label>
                      <input
                        type="text"
                        value={formData.socialShare?.twitterHandle || ''}
                        onChange={(e) => handleFormChange('socialShare', {
                          ...formData.socialShare,
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
                        OG Type
                      </label>
                      <select
                        value={formData.socialShare?.ogType || 'article'}
                        onChange={(e) => handleFormChange('socialShare', {
                          ...formData.socialShare,
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

                {/* Content Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Content ({uiState.modalLanguage === 'en' ? 'English' : 'Urdu'})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="space-y-2" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                        {labels.title[uiState.modalLanguage]}
                      </label>
                      <input
                        type="text"
                        value={formData[uiState.modalLanguage]?.title?.text || ''}
                        onChange={(e) => handleLanguageChange(uiState.modalLanguage, 'title', { text: e.target.value })}
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

                    {/* Category */}
                    <div className="space-y-2" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                        {labels.category[uiState.modalLanguage]}
                      </label>
                      <select
                        value={formData[uiState.modalLanguage]?.category?.text || ''}
                        onChange={(e) => handleLanguageChange(uiState.modalLanguage, 'category', { text: e.target.value })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes(`${uiState.modalLanguage}.category`) ? 'border-red-500' : ''}`}
                        style={{
                          borderColor: theme.colors.border.default,
                          color: theme.colors.text.primary,
                          backgroundColor: theme.colors.background.primary,
                          fontFamily: theme.fonts[uiState.modalLanguage].primary,
                          direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr',
                          textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left'
                        }}
                        required
                      >
                        <option value="">
                          {labels.categoryPlaceholder[uiState.modalLanguage]}
                        </option>
                        {programCategories[uiState.modalLanguage].map((category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {validationState.missingFields.includes(`${uiState.modalLanguage}.category`) && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>

                    {/* Duration */}
                    <div className="space-y-2" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                        {labels.duration[uiState.modalLanguage]}
                      </label>
                      <input
                        type="text"
                        value={formData[uiState.modalLanguage]?.duration?.text || ''}
                        onChange={(e) => handleLanguageChange(uiState.modalLanguage, 'duration', { text: e.target.value })}
                        className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                        style={{
                          borderColor: theme.colors.border.default,
                          color: theme.colors.text.primary,
                          backgroundColor: theme.colors.background.primary,
                          fontFamily: theme.fonts[uiState.modalLanguage].primary,
                          direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr',
                          textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left'
                        }}
                        placeholder={labels.durationPlaceholder[uiState.modalLanguage]}
                      />
                    </div>

                    {/* Coverage */}
                    <div className="space-y-2" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                        {labels.coverage[uiState.modalLanguage]}
                      </label>
                      <input
                        type="text"
                        value={formData[uiState.modalLanguage]?.coverage?.text || ''}
                        onChange={(e) => handleLanguageChange(uiState.modalLanguage, 'coverage', { text: e.target.value })}
                        className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                        style={{
                          borderColor: theme.colors.border.default,
                          color: theme.colors.text.primary,
                          backgroundColor: theme.colors.background.primary,
                          fontFamily: theme.fonts[uiState.modalLanguage].primary,
                          direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr',
                          textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left'
                        }}
                        placeholder={labels.coveragePlaceholder[uiState.modalLanguage]}
                      />
                    </div>
                  </div>

                  <div className="space-y-6 mt-6">
                    {/* Short Description */}
                    <div className="space-y-2" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                        {labels.shortDescription[uiState.modalLanguage]}
                      </label>
                      <textarea
                        value={formData[uiState.modalLanguage]?.shortDescription?.text || ''}
                        onChange={(e) => handleLanguageChange(uiState.modalLanguage, 'shortDescription', { text: e.target.value })}
                        rows={3}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes(`${uiState.modalLanguage}.shortDescription`) ? 'border-red-500' : ''}`}
                        style={{
                          borderColor: theme.colors.border.default,
                          color: theme.colors.text.primary,
                          backgroundColor: theme.colors.background.primary,
                          fontFamily: theme.fonts[uiState.modalLanguage].primary,
                          direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr',
                          textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left'
                        }}
                        placeholder={labels.shortDescPlaceholder[uiState.modalLanguage]}
                        required
                      />
                      {validationState.missingFields.includes(`${uiState.modalLanguage}.shortDescription`) && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>

                    {/* Full Description */}
                    <div className="space-y-2" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                        {labels.fullDescription[uiState.modalLanguage]}
                      </label>
                      <textarea
                        value={formData[uiState.modalLanguage]?.fullDescription?.text || ''}
                        onChange={(e) => handleLanguageChange(uiState.modalLanguage, 'fullDescription', { text: e.target.value })}
                        rows={6}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes(`${uiState.modalLanguage}.fullDescription`) ? 'border-red-500' : ''}`}
                        style={{
                          borderColor: theme.colors.border.default,
                          color: theme.colors.text.primary,
                          backgroundColor: theme.colors.background.primary,
                          fontFamily: theme.fonts[uiState.modalLanguage].primary,
                          direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr',
                          textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left'
                        }}
                        placeholder={labels.fullDescPlaceholder[uiState.modalLanguage]}
                        required
                      />
                      {validationState.missingFields.includes(`${uiState.modalLanguage}.fullDescription`) && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mini-Modal Sections */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Additional Content ({uiState.modalLanguage === 'en' ? 'English' : 'Urdu'})
                  </h3>

                  {/* Impact Section */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-4" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                      <FiType className="w-5 h-5" style={{ color: theme.colors.primary }} />
                      <span className="text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                        {labels.impact[uiState.modalLanguage]}
                      </span>
                      <button type="button" onClick={() => {
                        updateModalState({
                          editingImpact: { id: Date.now().toString(), label: { text: '' }, value: '', iconName: '', prefix: '', suffix: '' },
                          editingImpactIndex: null,
                        });
                        // Set mini modal language to current main modal language
                        updateUIState({ miniModalLanguage: uiState.modalLanguage });
                        updateModalState({ impactModalOpen: true });
                      }} className="ml-auto px-3 py-1 rounded bg-blue-600 text-white">{labels.add[uiState.modalLanguage]}</button>
                    </div>
                    <table className="min-w-full divide-y" style={{ borderColor: theme.colors.border.default, direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr' }}>
                      <thead>
                        <tr>
                          <th className={`px-6 py-3 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium uppercase tracking-wider`} style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>{labels.label[uiState.modalLanguage]}</th>
                          <th className={`px-6 py-3 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium uppercase tracking-wider`} style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>{labels.value[uiState.modalLanguage]}</th>
                          <th className={`px-6 py-3 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium uppercase tracking-wider`} style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>Suffix</th>
                          <th className={`px-6 py-3 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium uppercase tracking-wider`} style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>Icon</th>
                          <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: theme.colors.border.default }}>
                        {(formData[uiState.modalLanguage]?.impact || []).map((imp: any, idx: number) => (
                          <tr key={imp.id || idx} className="hover:bg-gray-50" style={{ backgroundColor: theme.colors.background.secondary }}>
                            <td className={`px-6 py-4 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'}`} style={{ color: theme.colors.text.primary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                              <div className="max-w-[180px] truncate" title={imp.label?.text || '--'}>{imp.label?.text || '--'}</div>
                            </td>
                            <td className={`px-6 py-4 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'}`} style={{ color: theme.colors.text.primary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                              <div className="max-w-[180px] truncate" title={imp.value || '--'}>{imp.value || '--'}</div>
                            </td>
                            <td className={`px-6 py-4 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'}`} style={{ color: theme.colors.text.primary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                              <div className="max-w-[180px] truncate" title={imp.suffix || '--'}>{imp.suffix || '--'}</div>
                            </td>
                            <td className={`px-6 py-4 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'}`} style={{ color: theme.colors.text.primary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                              <div className="flex items-center gap-2">
                                {(() => {
                                  const IconComponent = getIconComponent(imp.iconName);

                                  return IconComponent ? (
                                    <IconComponent className="text-lg" style={{ color: theme.colors.primary }} />
                                  ) : (
                                    <span className="text-lg">📈</span>
                                  );
                                })()}
                                <span className="max-w-[120px] truncate" title={imp.iconName || '--'}>{imp.iconName || '--'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button type="button" onClick={() => {
                                  // Set the editing impact with the current item's data
                                  updateModalState({
                                    editingImpact: { ...imp },
                                    editingImpactIndex: idx,
                                  });
                                  // Set mini modal language to current main modal language
                                  updateUIState({ miniModalLanguage: uiState.modalLanguage });
                                  updateModalState({ impactModalOpen: true });
                                }} className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer" style={{ color: theme.colors.primary }}>
                                  <FiEdit2 className="w-4 h-4" />
                                </button>
                                <button type="button" onClick={() => {
                                  const impact = (formData[uiState.modalLanguage]?.impact || []).filter((f: any) => f.id !== imp.id);
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

                  {/* Icon Stats Section */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-4" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                      <FiType className="w-5 h-5" style={{ color: theme.colors.primary }} />
                      <span className="text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                        {labels.iconStats[uiState.modalLanguage]}
                      </span>
                      <button type="button" onClick={() => {
                        updateModalState({
                          editingIconStats: { id: Date.now().toString(), label: { text: '' }, value: '', iconName: '', prefix: '', suffix: '' },
                          editingIconStatsIndex: null,
                        });
                        // Set mini modal language to current main modal language
                        updateUIState({ miniModalLanguage: uiState.modalLanguage });
                        updateModalState({ iconStatsModalOpen: true });
                      }} className="ml-auto px-3 py-1 rounded bg-blue-600 text-white">{labels.add[uiState.modalLanguage]}</button>
                    </div>
                    <table className="min-w-full divide-y" style={{ borderColor: theme.colors.border.default, direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr' }}>
                      <thead>
                        <tr>
                          <th className={`px-6 py-3 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium uppercase tracking-wider`} style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>{labels.label[uiState.modalLanguage]}</th>
                          <th className={`px-6 py-3 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium uppercase tracking-wider`} style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>{labels.value[uiState.modalLanguage]}</th>
                          <th className={`px-6 py-3 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium uppercase tracking-wider`} style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>Icon</th>
                          <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: theme.colors.border.default }}>
                        {(formData[uiState.modalLanguage]?.iconStats || []).map((stat: any, idx: number) => (
                          <tr key={stat.id || idx} className="hover:bg-gray-50" style={{ backgroundColor: theme.colors.background.secondary }}>
                            <td className={`px-6 py-4 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'}`} style={{ color: theme.colors.text.primary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                              <div className="max-w-[180px] truncate" title={stat.label?.text || '--'}>{stat.label?.text || '--'}</div>
                            </td>
                            <td className={`px-6 py-4 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'}`} style={{ color: theme.colors.text.primary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                              <div className="max-w-[180px] truncate" title={stat.value || '--'}>{stat.value || '--'}</div>
                            </td>
                            <td className={`px-6 py-4 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'}`} style={{ color: theme.colors.text.primary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                              <div className="flex items-center gap-2">
                                {(() => {
                                  const IconComponent = getIconComponent(stat.iconName);

                                  return IconComponent ? (
                                    <IconComponent className="text-lg" style={{ color: theme.colors.primary }} />
                                  ) : (
                                    <span className="text-lg">📊</span>
                                  );
                                })()}
                                <span className="max-w-[120px] truncate" title={stat.iconName || '--'}>{stat.iconName || '--'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button type="button" onClick={() => {
                                  // Set the editing icon stats with the current item's data
                                  updateModalState({
                                    editingIconStats: { ...stat },
                                    editingIconStatsIndex: idx,
                                  });
                                  // Set mini modal language to current main modal language
                                  updateUIState({ miniModalLanguage: uiState.modalLanguage });
                                  updateModalState({ iconStatsModalOpen: true });
                                }} className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer" style={{ color: theme.colors.primary }}>
                                  <FiEdit2 className="w-4 h-4" />
                                </button>
                                <button type="button" onClick={() => {
                                  const iconStats = (formData[uiState.modalLanguage]?.iconStats || []).filter((f: any) => f.id !== stat.id);
                                  updateIconStats(iconStats);
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

                  {/* Partners Section */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-4" style={{ direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.modalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                      <FiType className="w-5 h-5" style={{ color: theme.colors.primary }} />
                      <span className="text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                        {labels.partners[uiState.modalLanguage]}
                      </span>
                      <button type="button" onClick={() => {
                        updateModalState({
                          editingPartners: { id: Date.now().toString(), name: { text: '' }, logo: '' },
                          editingPartnersIndex: null,
                        });
                        // Set mini modal language to current main modal language
                        updateUIState({ miniModalLanguage: uiState.modalLanguage });
                        updateModalState({ partnersModalOpen: true });
                      }} className="ml-auto px-3 py-1 rounded bg-blue-600 text-white">{labels.add[uiState.modalLanguage]}</button>
                    </div>
                    <table className="min-w-full divide-y" style={{ borderColor: theme.colors.border.default, direction: uiState.modalLanguage === 'ur' ? 'rtl' : 'ltr' }}>
                      <thead>
                        <tr>
                          <th className={`px-6 py-3 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'} text-xs font-medium uppercase tracking-wider`} style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>{labels.name[uiState.modalLanguage]}</th>
                          <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: theme.colors.border.default }}>
                        {(formData[uiState.modalLanguage]?.partners || []).map((partner: any, idx: number) => (
                          <tr key={partner.id || idx} className="hover:bg-gray-50" style={{ backgroundColor: theme.colors.background.secondary }}>
                            <td className={`px-6 py-4 ${uiState.modalLanguage === 'ur' ? 'text-right' : 'text-left'}`} style={{ color: theme.colors.text.primary, fontFamily: theme.fonts[uiState.modalLanguage].primary }}>
                              <div className="max-w-[180px] truncate" title={partner.name?.text || '--'}>{partner.name?.text || '--'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button type="button" onClick={() => {
                                  // Set the editing partner with the current item's data
                                  updateModalState({
                                    editingPartners: { ...partner },
                                    editingPartnersIndex: idx,
                                  });
                                  // Set mini modal language to current main modal language
                                  updateUIState({ miniModalLanguage: uiState.modalLanguage });
                                  updateModalState({ partnersModalOpen: true });
                                }} className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer" style={{ color: theme.colors.primary }}>
                                  <FiEdit2 className="w-4 h-4" />
                                </button>
                                <button type="button" onClick={() => {
                                  const partners = (formData[uiState.modalLanguage]?.partners || []).filter((f: any) => f.id !== partner.id);
                                  updatePartners(partners);
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
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowProgramModal(false);
                    setEditingProgram(null);
                    setFormData(null);
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={saveProgramData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (editingProgram ? 'Update Program' : 'Create Program')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional validation prompts */}
      {promptState.showSwitchImpactLangPrompt && (
        <div className="fixed left-1/2 top-20 z-50 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in" style={{ minWidth: 320, maxWidth: 400 }}>
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
      {promptState.showSwitchIconStatsLangPrompt && (
        <div className="fixed left-1/2 top-32 z-50 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in" style={{ minWidth: 320, maxWidth: 400 }}>
          <div className="flex-1 text-sm text-center">
            {uiState.modalLanguage === 'en'
              ? 'Some Icon Statistics are missing in Urdu. Please switch to Urdu and fill them.'
              : 'Some Icon Statistics are missing in English. Please switch to English and fill them.'}
          </div>
          <button type="button" onClick={() => {
            updateUIState({ miniModalLanguage: uiState.modalLanguage === 'en' ? 'ur' : 'en' });
            updatePromptState({ showSwitchIconStatsLangPrompt: false });
          }} className="px-3 py-1 rounded bg-blue-600 text-white text-xs shadow">Switch to {uiState.modalLanguage === 'en' ? 'Urdu' : 'English'}</button>
          <button type="button" onClick={() => updatePromptState({ showSwitchIconStatsLangPrompt: false })} className="ml-2 p-1 rounded hover:bg-yellow-200" aria-label="Close"><FiX className="w-4 h-4" /></button>
        </div>
      )}
      {promptState.showSwitchPartnersLangPrompt && (
        <div className="fixed left-1/2 top-44 z-50 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in" style={{ minWidth: 320, maxWidth: 400 }}>
          <div className="flex-1 text-sm text-center">
            {uiState.modalLanguage === 'en'
              ? 'Some Partners are missing in Urdu. Please switch to Urdu and fill them.'
              : 'Some Partners are missing in English. Please switch to English and fill them.'}
          </div>
          <button type="button" onClick={() => {
            updateUIState({ miniModalLanguage: uiState.modalLanguage === 'en' ? 'ur' : 'en' });
            updatePromptState({ showSwitchPartnersLangPrompt: false });
          }} className="px-3 py-1 rounded bg-blue-600 text-white text-xs shadow">Switch to {uiState.modalLanguage === 'en' ? 'Urdu' : 'English'}</button>
          <button type="button" onClick={() => updatePromptState({ showSwitchPartnersLangPrompt: false })} className="ml-2 p-1 rounded hover:bg-yellow-200" aria-label="Close"><FiX className="w-4 h-4" /></button>
        </div>
      )}

      {/* Impact Modal */}
      {modalState.impactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.text.primary, fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}>
              {modalState.editingImpactIndex !== null ? labels.edit[uiState.miniModalLanguage] : labels.add[uiState.miniModalLanguage]} {labels.impact[uiState.miniModalLanguage]}
            </h3>
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
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>
                {labels.value[uiState.miniModalLanguage]}
                {promptState.impactRequiredInOpposite && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={modalState.editingImpact?.value || ''}
                onChange={e => updateModalState({
                  editingImpact: modalState.editingImpact ? { ...modalState.editingImpact, value: e.target.value } : { id: Date.now().toString(), label: { text: '' }, value: e.target.value, iconName: '', prefix: '', suffix: '' }
                })}
                className={`w-full p-2 border rounded ${promptState.impactRequiredInOpposite && !modalState.editingImpact?.value ? 'border-red-500' : ''}`}
                style={{ color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: promptState.impactRequiredInOpposite && !modalState.editingImpact?.value ? '#ef4444' : theme.colors.border.default, fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}
              />
              {promptState.impactRequiredInOpposite && !modalState.editingImpact?.value && (
                <p className="text-xs text-red-600 mt-1">This field is required.</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>
                Suffix (e.g., +, %, etc.)
              </label>
              <input
                type="text"
                value={modalState.editingImpact?.suffix || ''}
                onChange={e => updateModalState({
                  editingImpact: modalState.editingImpact ? { ...modalState.editingImpact, suffix: e.target.value } : { id: Date.now().toString(), label: { text: '' }, value: '', iconName: '', prefix: '', suffix: e.target.value }
                })}
                className="w-full p-2 border rounded"
                style={{ color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: theme.colors.border.default }}
                placeholder="+, %, etc."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>
                Icon <span className="text-red-500">*</span>
              </label>
              <IconSelector
                selectedIcon={modalState.editingImpact?.iconName || ''}
                onSelect={(iconName: string) => updateModalState({
                  editingImpact: modalState.editingImpact ? { ...modalState.editingImpact, iconName } : { id: Date.now().toString(), label: { text: '' }, value: '', iconName, prefix: '', suffix: '' }
                })}
                size="small"
              />
              {!modalState.editingImpact?.iconName && (
                <p className="text-xs text-red-600 mt-1">Icon is required.</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => updateModalState({ impactModalOpen: false, editingImpact: null, editingImpactIndex: null })} className="px-4 py-2 rounded bg-gray-200" style={{ color: theme.colors.text.primary }}>{labels.cancel[uiState.miniModalLanguage]}</button>
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

      {/* Icon Stats Modal */}
      {modalState.iconStatsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.text.primary, fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}>
              {modalState.editingIconStatsIndex !== null ? labels.edit[uiState.miniModalLanguage] : labels.add[uiState.miniModalLanguage]} {labels.iconStats[uiState.miniModalLanguage]}
            </h3>
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
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>
                {labels.iconName[uiState.miniModalLanguage]}
              </label>
              <IconSelector
                selectedIcon={modalState.editingIconStats?.iconName || ''}
                onSelect={(icon: string) => updateModalState({
                  editingIconStats: modalState.editingIconStats ? { ...modalState.editingIconStats, iconName: icon } : { id: Date.now().toString(), label: { text: '' }, value: '', iconName: icon, prefix: '', suffix: '' }
                })}
                size="small"
              />
            </div>
            <div className="mb-4" style={{ direction: uiState.miniModalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.miniModalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>
                {labels.label[uiState.miniModalLanguage]}
                {promptState.iconStatsRequiredInOpposite && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={modalState.editingIconStats?.label?.text || ''}
                onChange={e => updateModalState({
                  editingIconStats: modalState.editingIconStats ? { ...modalState.editingIconStats, label: { text: e.target.value } } : { id: Date.now().toString(), label: { text: e.target.value }, value: '', iconName: '', prefix: '', suffix: '' }
                })}
                className={`w-full p-2 border rounded ${promptState.iconStatsRequiredInOpposite && !modalState.editingIconStats?.label?.text ? 'border-red-500' : ''}`}
                style={{ color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: promptState.iconStatsRequiredInOpposite && !modalState.editingIconStats?.label?.text ? '#ef4444' : theme.colors.border.default, fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}
              />
              {promptState.iconStatsRequiredInOpposite && !modalState.editingIconStats?.label?.text && (
                <p className="text-xs text-red-600 mt-1">This field is required.</p>
              )}
            </div>
            <div className="mb-4" style={{ direction: uiState.miniModalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.miniModalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>
                {labels.value[uiState.miniModalLanguage]}
                {promptState.iconStatsRequiredInOpposite && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={modalState.editingIconStats?.value || ''}
                onChange={e => updateModalState({
                  editingIconStats: modalState.editingIconStats ? { ...modalState.editingIconStats, value: e.target.value } : { id: Date.now().toString(), label: { text: '' }, value: e.target.value, iconName: '', prefix: '', suffix: '' }
                })}
                className={`w-full p-2 border rounded ${promptState.iconStatsRequiredInOpposite && !modalState.editingIconStats?.value ? 'border-red-500' : ''}`}
                style={{ color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: promptState.iconStatsRequiredInOpposite && !modalState.editingIconStats?.value ? '#ef4444' : theme.colors.border.default, fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}
              />
              {promptState.iconStatsRequiredInOpposite && !modalState.editingIconStats?.value && (
                <p className="text-xs text-red-600 mt-1">This field is required.</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => updateModalState({ iconStatsModalOpen: false, editingIconStats: null, editingIconStatsIndex: null })} className="px-4 py-2 rounded bg-gray-200" style={{ color: theme.colors.text.primary }}>{labels.cancel[uiState.miniModalLanguage]}</button>
              {promptState.iconStatsRequiredInOpposite && (
                <button type="button" onClick={() => {
                  updatePromptState({ iconStatsRequiredInOpposite: false });
                  updateModalState({
                    iconStatsModalOpen: false,
                    editingIconStats: null,
                    editingIconStatsIndex: null,
                  });
                }} className="px-4 py-2 rounded bg-yellow-500 text-white">
                  Skip Translation
                </button>
              )}
              <button type="button" onClick={handleSaveIconStats} className="px-4 py-2 rounded bg-blue-600 text-white">{labels.save[uiState.miniModalLanguage]}</button>
            </div>
          </div>
        </div>
      )}

      {/* Partners Modal */}
      {modalState.partnersModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.text.primary, fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}>
              {modalState.editingPartnersIndex !== null ? labels.edit[uiState.miniModalLanguage] : labels.add[uiState.miniModalLanguage]} {labels.partners[uiState.miniModalLanguage]}
            </h3>
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
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>
                {labels.logo[uiState.miniModalLanguage]}
              </label>
              <ImageSelector
                selectedPath={modalState.editingPartners?.logo || ''}
                onSelect={(imageUrl: string) => updateModalState({
                  editingPartners: modalState.editingPartners ? { ...modalState.editingPartners, logo: imageUrl } : { id: Date.now().toString(), name: { text: '' }, logo: imageUrl }
                })}
                size="small"
              />
            </div>
            <div className="mb-4" style={{ direction: uiState.miniModalLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: uiState.miniModalLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>
                {labels.name[uiState.miniModalLanguage]}
                {promptState.partnersRequiredInOpposite && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={modalState.editingPartners?.name?.text || ''}
                onChange={e => updateModalState({
                  editingPartners: modalState.editingPartners ? { ...modalState.editingPartners, name: { text: e.target.value } } : { id: Date.now().toString(), name: { text: e.target.value }, logo: '' }
                })}
                className={`w-full p-2 border rounded ${promptState.partnersRequiredInOpposite && !modalState.editingPartners?.name?.text ? 'border-red-500' : ''}`}
                style={{ color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, borderColor: promptState.partnersRequiredInOpposite && !modalState.editingPartners?.name?.text ? '#ef4444' : theme.colors.border.default, fontFamily: theme.fonts[uiState.miniModalLanguage].primary }}
              />
              {promptState.partnersRequiredInOpposite && !modalState.editingPartners?.name?.text && (
                <p className="text-xs text-red-600 mt-1">This field is required.</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => updateModalState({ partnersModalOpen: false, editingPartners: null, editingPartnersIndex: null })} className="px-4 py-2 rounded bg-gray-200" style={{ color: theme.colors.text.primary }}>{labels.cancel[uiState.miniModalLanguage]}</button>
              {promptState.partnersRequiredInOpposite && (
                <button type="button" onClick={() => {
                  updatePromptState({ partnersRequiredInOpposite: false });
                  updateModalState({
                    partnersModalOpen: false,
                    editingPartners: null,
                    editingPartnersIndex: null,
                  });
                }} className="px-4 py-2 rounded bg-yellow-500 text-white">
                  Skip Translation
                </button>
              )}
              <button type="button" onClick={handleSavePartners} className="px-4 py-2 rounded bg-blue-600 text-white">{labels.save[uiState.miniModalLanguage]}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
