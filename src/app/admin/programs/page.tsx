"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash, FaHome, FaToggleOn, FaToggleOff, FaImage, FaTimes } from "react-icons/fa";
import { FiEdit2, FiSave, FiX, FiImage, FiType, FiPlus, FiTrash2 } from "react-icons/fi";
import { theme } from "@/config/theme";
import { ProgramDetail } from "@/types/programs";
import ImageSelector from '@/app/admin/components/ImageSelector';
import IconSelector from '@/app/admin/components/IconSelector';
import DashboardLoader from '../components/DashboardLoader';

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

  // Additional state for services-like functionality
  const [validationState, setValidationState] = useState({
    missingFields: [] as string[],
    homepageLimitError: '',
    missingOppositeLang: [] as string[],
  });

  const [promptState, setPromptState] = useState({
    showSwitchLangPrompt: false,
    showSwitchImpactLangPrompt: false,
    showSwitchIconStatsLangPrompt: false,
    showSwitchPartnersLangPrompt: false,
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

  // Helper functions
  const getFontFamily = () => (currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary);

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

  const updatePromptState = (updates: Partial<typeof promptState>) => {
    setPromptState(prev => ({ ...prev, ...updates }));
  };

  // Validation functions
  const validateProgram = (program: any) => {
    const requiredFields = [
      // Program Image (required)
      { key: 'featuredImage', value: program.featuredImage },
      // Titles & Descriptions (required for both languages)
      { key: 'en.title', value: program.en?.title?.text },
      { key: 'en.shortDescription', value: program.en?.shortDescription?.text },
      { key: 'en.fullDescription', value: program.en?.fullDescription?.text },
      { key: 'en.category', value: program.en?.category?.text },
      { key: 'ur.title', value: program.ur?.title?.text },
      { key: 'ur.shortDescription', value: program.ur?.shortDescription?.text },
      { key: 'ur.fullDescription', value: program.ur?.fullDescription?.text },
      { key: 'ur.category', value: program.ur?.category?.text },
      // Social Share Settings (required)
      { key: 'socialShare.title', value: program.socialShare?.title?.text },
      { key: 'socialShare.description', value: program.socialShare?.description?.text },
      { key: 'socialShare.hashtags', value: Array.isArray(program.socialShare?.hashtags) && program.socialShare.hashtags.length > 0 ? 'ok' : '' },
      { key: 'socialShare.twitterHandle', value: program.socialShare?.twitterHandle },
      { key: 'socialShare.ogType', value: program.socialShare?.ogType },
    ];
    return requiredFields.filter(f => !f.value).map(f => f.key);
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

  const toggleProgramStatus = async (programId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/programs/${programId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to update program status');
      }

      const result = await response.json();
      if (result.success) {
        setPrograms(programs.map(program => 
          program.id === programId 
            ? { ...program, isActive: !currentStatus }
            : program
        ));
      }
    } catch (err: any) {
      handleErrorResponse(err);
    }
  };

  const toggleHomepageStatus = async (programId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/programs/${programId}/toggle-homepage`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ showOnHomepage: !currentStatus }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to update homepage status');
      }

      const result = await response.json();
      if (result.success) {
        setPrograms(programs.map(program => 
          program.id === programId 
            ? { ...program, showOnHomepage: !currentStatus }
            : program
        ));
      }
    } catch (err: any) {
      handleErrorResponse(err);
    }
  };

  const deleteProgram = async (programId: string) => {
    if (!confirm('Are you sure you want to delete this program?')) return;

    try {
      const response = await fetch(`/api/admin/programs/${programId}`, {
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
        setPrograms(programs.filter(program => program.id !== programId));
      }
    } catch (err: any) {
      handleErrorResponse(err);
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
    setShowProgramModal(true);
  };

  const editProgram = (program: ProgramDetail) => {
    setEditingProgram(program);
    setFormData({ ...program });
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

  const saveProgramData = async () => {
    if (!formData) return;

    const missing = validateProgram(formData);
    updateValidationState({ missingFields: missing });

    // Check for missing fields in the opposite language first (only show one popup)
    const oppositeLang = currentLanguage === 'en' ? 'ur' : 'en';
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
    const languageCheck = checkLanguageConsistency(formData, currentLanguage);

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
        await fetchPrograms(); // Refresh the list
        setShowProgramModal(false);
        setEditingProgram(null);
        setFormData(null);
        updateValidationState({ missingFields: [], missingOppositeLang: [] });
        updatePromptState({
          showSwitchLangPrompt: false,
          showSwitchImpactLangPrompt: false,
          showSwitchIconStatsLangPrompt: false,
          showSwitchPartnersLangPrompt: false
        });
      }
    } catch (err: any) {
      handleErrorResponse(err);
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
        await fetchPrograms(); // Refresh the data
        setShowPageModal(false);
        setEditingPageData(null);
      }
    } catch (err: any) {
      handleErrorResponse(err);
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
                  {program.showOnHomepage && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <FaHome className="inline w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>

              {/* Program Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span
                    className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    style={{ fontFamily: getFontFamily() }}
                  >
                    {program[currentLanguage].category.text}
                  </span>
                </div>

                <h3
                  className="font-semibold text-gray-900 mb-2 line-clamp-2"
                  style={{ fontFamily: getFontFamily() }}
                >
                  {program[currentLanguage].title.text}
                </h3>

                <p
                  className="text-sm text-gray-600 mb-4 line-clamp-3"
                  style={{ fontFamily: getFontFamily() }}
                >
                  {program[currentLanguage].shortDescription.text}
                </p>

                {/* Impact Stats */}
                {program[currentLanguage]?.impact && program[currentLanguage].impact.length > 0 && (
                  <div className="flex gap-4 mb-4">
                    {program[currentLanguage].impact.slice(0, 2).map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="text-lg font-bold text-blue-600">
                          {stat.value}{stat.suffix || ""}
                        </div>
                        <div
                          className="text-xs text-gray-500"
                          style={{ fontFamily: getFontFamily() }}
                        >
                          {stat.label.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex gap-2">
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

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleProgramStatus(program.id, program.isActive)}
                      className={`p-2 rounded-lg transition-colors ${
                        program.isActive
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={program.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {program.isActive ? <FaEye /> : <FaEyeSlash />}
                    </button>
                    <button
                      onClick={() => toggleHomepageStatus(program.id, program.showOnHomepage)}
                      className={`p-2 rounded-lg transition-colors ${
                        program.showOnHomepage
                          ? 'text-blue-600 hover:bg-blue-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={program.showOnHomepage ? 'Remove from Homepage' : 'Add to Homepage'}
                    >
                      {program.showOnHomepage ? <FaToggleOn /> : <FaToggleOff />}
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
                {currentLanguage === 'en'
                  ? 'Some required fields are missing in Urdu. Please switch to Urdu and fill them.'
                  : 'Some required fields are missing in English. Please switch to English and fill them.'}
              </div>
              <button
                type="button"
                onClick={() => {
                  setCurrentLanguage(currentLanguage === 'en' ? 'ur' : 'en');
                  updatePromptState({ showSwitchLangPrompt: false });
                }}
                className="px-3 py-1 rounded bg-blue-600 text-white text-xs shadow"
              >
                Switch to {currentLanguage === 'en' ? 'Urdu' : 'English'}
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
                    updateValidationState({ missingFields: [], missingOppositeLang: [] });
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
                        />
                        <span className="ml-2 text-sm text-gray-700">Show on Homepage</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Content Information */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Content ({currentLanguage === 'en' ? 'English' : 'Urdu'})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="space-y-2" style={{ direction: currentLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: currentLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[currentLanguage].primary }}>
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                        Program Title
                      </label>
                      <input
                        type="text"
                        value={formData[currentLanguage]?.title?.text || ''}
                        onChange={(e) => handleLanguageChange(currentLanguage, 'title', { text: e.target.value })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes(`${currentLanguage}.title`) ? 'border-red-500' : ''}`}
                        style={{
                          borderColor: theme.colors.border.default,
                          color: theme.colors.text.primary,
                          backgroundColor: theme.colors.background.primary,
                          fontFamily: getFontFamily(),
                          direction: currentLanguage === 'ur' ? 'rtl' : 'ltr',
                          textAlign: currentLanguage === 'ur' ? 'right' : 'left'
                        }}
                        placeholder={`Enter program title in ${currentLanguage === 'en' ? 'English' : 'Urdu'}`}
                        required
                      />
                      {validationState.missingFields.includes(`${currentLanguage}.title`) && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>

                    {/* Category */}
                    <div className="space-y-2" style={{ direction: currentLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: currentLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[currentLanguage].primary }}>
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>
                        Category
                      </label>
                      <select
                        value={formData[currentLanguage]?.category?.text || ''}
                        onChange={(e) => handleLanguageChange(currentLanguage, 'category', { text: e.target.value })}
                        className={`w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 ${validationState.missingFields.includes(`${currentLanguage}.category`) ? 'border-red-500' : ''}`}
                        style={{
                          borderColor: theme.colors.border.default,
                          color: theme.colors.text.primary,
                          backgroundColor: theme.colors.background.primary,
                          fontFamily: getFontFamily(),
                          direction: currentLanguage === 'ur' ? 'rtl' : 'ltr',
                          textAlign: currentLanguage === 'ur' ? 'right' : 'left'
                        }}
                        required
                      >
                        <option value="">
                          {currentLanguage === 'en' ? 'Select a category' : 'ایک کیٹگری منتخب کریں'}
                        </option>
                        {programCategories[currentLanguage].map((category, index) => (
                          <option key={index} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {validationState.missingFields.includes(`${currentLanguage}.category`) && (
                        <p className="text-xs text-red-600 mt-1">This field is required.</p>
                      )}
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        value={formData[currentLanguage]?.duration?.text || ''}
                        onChange={(e) => handleLanguageChange(currentLanguage, 'duration', { text: e.target.value })}
                        className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                        style={{
                          borderColor: theme.colors.border.default,
                          color: theme.colors.text.primary,
                          backgroundColor: theme.colors.background.primary,
                          fontFamily: getFontFamily(),
                          direction: currentLanguage === 'ur' ? 'rtl' : 'ltr',
                          textAlign: currentLanguage === 'ur' ? 'right' : 'left'
                        }}
                        placeholder={`Enter duration in ${currentLanguage === 'en' ? 'English' : 'Urdu'}`}
                      />
                    </div>

                    {/* Coverage */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Coverage Area
                      </label>
                      <input
                        type="text"
                        value={formData[currentLanguage]?.coverage?.text || ''}
                        onChange={(e) => handleLanguageChange(currentLanguage, 'coverage', { text: e.target.value })}
                        className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                        style={{
                          borderColor: theme.colors.border.default,
                          color: theme.colors.text.primary,
                          backgroundColor: theme.colors.background.primary,
                          fontFamily: getFontFamily(),
                          direction: currentLanguage === 'ur' ? 'rtl' : 'ltr',
                          textAlign: currentLanguage === 'ur' ? 'right' : 'left'
                        }}
                        placeholder={`Enter coverage area in ${currentLanguage === 'en' ? 'English' : 'Urdu'}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-6 mt-6">
                    {/* Short Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Short Description
                      </label>
                      <textarea
                        value={formData[currentLanguage]?.shortDescription?.text || ''}
                        onChange={(e) => handleLanguageChange(currentLanguage, 'shortDescription', { text: e.target.value })}
                        rows={3}
                        className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                        style={{
                          borderColor: theme.colors.border.default,
                          color: theme.colors.text.primary,
                          backgroundColor: theme.colors.background.primary,
                          fontFamily: getFontFamily(),
                          direction: currentLanguage === 'ur' ? 'rtl' : 'ltr',
                          textAlign: currentLanguage === 'ur' ? 'right' : 'left'
                        }}
                        placeholder={`Enter short description in ${currentLanguage === 'en' ? 'English' : 'Urdu'}`}
                      />
                    </div>

                    {/* Full Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Description
                      </label>
                      <textarea
                        value={formData[currentLanguage]?.fullDescription?.text || ''}
                        onChange={(e) => handleLanguageChange(currentLanguage, 'fullDescription', { text: e.target.value })}
                        rows={6}
                        className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                        style={{
                          borderColor: theme.colors.border.default,
                          color: theme.colors.text.primary,
                          backgroundColor: theme.colors.background.primary,
                          fontFamily: getFontFamily(),
                          direction: currentLanguage === 'ur' ? 'rtl' : 'ltr',
                          textAlign: currentLanguage === 'ur' ? 'right' : 'left'
                        }}
                        placeholder={`Enter full description in ${currentLanguage === 'en' ? 'English' : 'Urdu'}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Social Share Settings */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4" style={{ direction: currentLanguage === 'ur' ? 'rtl' : 'ltr', textAlign: currentLanguage === 'ur' ? 'right' : 'left', fontFamily: theme.fonts[currentLanguage].primary }}>
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
                        value={formData.socialShare?.title?.text || ''}
                        onChange={(e) => handleFormChange('socialShare', {
                          ...formData.socialShare,
                          title: { text: e.target.value }
                        })}
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
                        value={formData.socialShare?.description?.text || ''}
                        onChange={(e) => handleFormChange('socialShare', {
                          ...formData.socialShare,
                          description: { text: e.target.value }
                        })}
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
                      <label className="block text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Hashtags (comma separated)</label>
                      <input
                        type="text"
                        value={Array.isArray(formData.socialShare?.hashtags) ? formData.socialShare.hashtags.join(', ') : ''}
                        onChange={(e) => handleFormChange('socialShare', {
                          ...formData.socialShare,
                          hashtags: e.target.value.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
                        })}
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
                        value={formData.socialShare?.twitterHandle || ''}
                        onChange={(e) => handleFormChange('socialShare', {
                          ...formData.socialShare,
                          twitterHandle: e.target.value
                        })}
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

                {/* Impact Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Impact Metrics ({currentLanguage === 'en' ? 'English' : 'Urdu'})
                  </h3>
                  <div className="space-y-4">
                    {formData[currentLanguage]?.impact?.map((impact: any, index: number) => (
                      <div key={index} className="flex gap-4 items-end">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Impact Description
                          </label>
                          <input
                            type="text"
                            value={impact.label?.text || ''}
                            onChange={(e) => {
                              const updatedImpact = [...(formData[currentLanguage]?.impact || [])];
                              updatedImpact[index] = { ...impact, label: { text: e.target.value } };
                              handleLanguageChange(currentLanguage, 'impact', updatedImpact);
                            }}
                            className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                            style={{
                              borderColor: theme.colors.border.default,
                              color: theme.colors.text.primary,
                              backgroundColor: theme.colors.background.primary,
                              fontFamily: getFontFamily(),
                              direction: currentLanguage === 'ur' ? 'rtl' : 'ltr',
                              textAlign: currentLanguage === 'ur' ? 'right' : 'left'
                            }}
                            placeholder="Impact description"
                          />
                        </div>
                        <div className="w-32">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Value
                          </label>
                          <input
                            type="text"
                            value={impact.value || ''}
                            onChange={(e) => {
                              const updatedImpact = [...(formData[currentLanguage]?.impact || [])];
                              updatedImpact[index] = { ...impact, value: e.target.value };
                              handleLanguageChange(currentLanguage, 'impact', updatedImpact);
                            }}
                            className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                            style={{
                              borderColor: theme.colors.border.default,
                              color: theme.colors.text.primary,
                              backgroundColor: theme.colors.background.primary
                            }}
                            placeholder="100"
                          />
                        </div>
                        <div className="w-20">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Suffix
                          </label>
                          <input
                            type="text"
                            value={impact.suffix || ''}
                            onChange={(e) => {
                              const updatedImpact = [...(formData[currentLanguage]?.impact || [])];
                              updatedImpact[index] = { ...impact, suffix: e.target.value };
                              handleLanguageChange(currentLanguage, 'impact', updatedImpact);
                            }}
                            className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                            style={{
                              borderColor: theme.colors.border.default,
                              color: theme.colors.text.primary,
                              backgroundColor: theme.colors.background.primary
                            }}
                            placeholder="+"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedImpact = formData[currentLanguage]?.impact?.filter((_: any, i: number) => i !== index) || [];
                            handleLanguageChange(currentLanguage, 'impact', updatedImpact);
                          }}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newImpact = { label: { text: '' }, value: '', suffix: '' };
                        const updatedImpact = [...(formData[currentLanguage]?.impact || []), newImpact];
                        handleLanguageChange(currentLanguage, 'impact', updatedImpact);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Impact Metric
                    </button>
                  </div>
                </div>

                {/* Icon Stats Section */}
                <div className="bg-gray-50 p-6 rounded-lg hidden">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Icon Statistics ({currentLanguage === 'en' ? 'English' : 'Urdu'})
                  </h3>
                  <div className="space-y-4">
                    {formData[currentLanguage]?.iconStats?.map((stat: any, index: number) => (
                      <div key={index} className="flex gap-4 items-end">
                        <div className="w-32">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Icon
                          </label>
                          <IconSelector
                            selectedIcon={stat.icon || ''}
                            onSelect={(icon: string) => {
                              const updatedStats = [...(formData[currentLanguage]?.iconStats || [])];
                              updatedStats[index] = { ...stat, icon };
                              handleLanguageChange(currentLanguage, 'iconStats', updatedStats);
                            }}
                            size="small"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Statistic Label
                          </label>
                          <input
                            type="text"
                            value={stat.label?.text || ''}
                            onChange={(e) => {
                              const updatedStats = [...(formData[currentLanguage]?.iconStats || [])];
                              updatedStats[index] = { ...stat, label: { text: e.target.value } };
                              handleLanguageChange(currentLanguage, 'iconStats', updatedStats);
                            }}
                            className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                            style={{
                              borderColor: theme.colors.border.default,
                              color: theme.colors.text.primary,
                              backgroundColor: theme.colors.background.primary,
                              fontFamily: getFontFamily(),
                              direction: currentLanguage === 'ur' ? 'rtl' : 'ltr',
                              textAlign: currentLanguage === 'ur' ? 'right' : 'left'
                            }}
                            placeholder="Statistic label"
                          />
                        </div>
                        <div className="w-32">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Value
                          </label>
                          <input
                            type="text"
                            value={stat.value || ''}
                            onChange={(e) => {
                              const updatedStats = [...(formData[currentLanguage]?.iconStats || [])];
                              updatedStats[index] = { ...stat, value: e.target.value };
                              handleLanguageChange(currentLanguage, 'iconStats', updatedStats);
                            }}
                            className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                            style={{
                              borderColor: theme.colors.border.default,
                              color: theme.colors.text.primary,
                              backgroundColor: theme.colors.background.primary
                            }}
                            placeholder="100"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedStats = formData[currentLanguage]?.iconStats?.filter((_: any, i: number) => i !== index) || [];
                            handleLanguageChange(currentLanguage, 'iconStats', updatedStats);
                          }}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newStat = { icon: '', label: { text: '' }, value: '' };
                        const updatedStats = [...(formData[currentLanguage]?.iconStats || []), newStat];
                        handleLanguageChange(currentLanguage, 'iconStats', updatedStats);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Icon Statistic
                    </button>
                  </div>
                </div>

                {/* Partners Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Partners ({currentLanguage === 'en' ? 'English' : 'Urdu'})
                  </h3>
                  <div className="space-y-4">
                    {formData[currentLanguage]?.partners?.map((partner: any, index: number) => (
                      <div key={index} className="flex gap-4 items-end">
                        <div className="w-75">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Partner Logo
                          </label>
                          <ImageSelector
                            selectedPath={partner.logo || ''}
                            onSelect={(imageUrl: string) => {
                              const updatedPartners = [...(formData[currentLanguage]?.partners || [])];
                              updatedPartners[index] = { ...partner, logo: imageUrl };
                              handleLanguageChange(currentLanguage, 'partners', updatedPartners);
                            }}
                            size="small"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Partner Name
                          </label>
                          <input
                            type="text"
                            value={partner.name?.text || ''}
                            onChange={(e) => {
                              const updatedPartners = [...(formData[currentLanguage]?.partners || [])];
                              updatedPartners[index] = { ...partner, name: { text: e.target.value } };
                              handleLanguageChange(currentLanguage, 'partners', updatedPartners);
                            }}
                            className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                            style={{
                              borderColor: theme.colors.border.default,
                              color: theme.colors.text.primary,
                              backgroundColor: theme.colors.background.primary,
                              fontFamily: getFontFamily(),
                              direction: currentLanguage === 'ur' ? 'rtl' : 'ltr',
                              textAlign: currentLanguage === 'ur' ? 'right' : 'left'
                            }}
                            placeholder="Partner name"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Website URL
                          </label>
                          <input
                            type="url"
                            value={partner.website || ''}
                            onChange={(e) => {
                              const updatedPartners = [...(formData[currentLanguage]?.partners || [])];
                              updatedPartners[index] = { ...partner, website: e.target.value };
                              handleLanguageChange(currentLanguage, 'partners', updatedPartners);
                            }}
                            className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                            style={{
                              borderColor: theme.colors.border.default,
                              color: theme.colors.text.primary,
                              backgroundColor: theme.colors.background.primary
                            }}
                            placeholder="https://partner-website.com"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedPartners = formData[currentLanguage]?.partners?.filter((_: any, i: number) => i !== index) || [];
                            handleLanguageChange(currentLanguage, 'partners', updatedPartners);
                          }}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newPartner = { logo: '', name: { text: '' }, website: '' };
                        const updatedPartners = [...(formData[currentLanguage]?.partners || []), newPartner];
                        handleLanguageChange(currentLanguage, 'partners', updatedPartners);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add Partner
                    </button>
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
            {currentLanguage === 'en'
              ? 'Some Impact entries are missing in Urdu. Please switch to Urdu and fill them.'
              : 'Some Impact entries are missing in English. Please switch to English and fill them.'}
          </div>
          <button type="button" onClick={() => {
            setCurrentLanguage(currentLanguage === 'en' ? 'ur' : 'en');
            updatePromptState({ showSwitchImpactLangPrompt: false });
          }} className="px-3 py-1 rounded bg-blue-600 text-white text-xs shadow">Switch to {currentLanguage === 'en' ? 'Urdu' : 'English'}</button>
          <button type="button" onClick={() => updatePromptState({ showSwitchImpactLangPrompt: false })} className="ml-2 p-1 rounded hover:bg-yellow-200" aria-label="Close"><FiX className="w-4 h-4" /></button>
        </div>
      )}
      {promptState.showSwitchIconStatsLangPrompt && (
        <div className="fixed left-1/2 top-32 z-50 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in" style={{ minWidth: 320, maxWidth: 400 }}>
          <div className="flex-1 text-sm text-center">
            {currentLanguage === 'en'
              ? 'Some Icon Statistics are missing in Urdu. Please switch to Urdu and fill them.'
              : 'Some Icon Statistics are missing in English. Please switch to English and fill them.'}
          </div>
          <button type="button" onClick={() => {
            setCurrentLanguage(currentLanguage === 'en' ? 'ur' : 'en');
            updatePromptState({ showSwitchIconStatsLangPrompt: false });
          }} className="px-3 py-1 rounded bg-blue-600 text-white text-xs shadow">Switch to {currentLanguage === 'en' ? 'Urdu' : 'English'}</button>
          <button type="button" onClick={() => updatePromptState({ showSwitchIconStatsLangPrompt: false })} className="ml-2 p-1 rounded hover:bg-yellow-200" aria-label="Close"><FiX className="w-4 h-4" /></button>
        </div>
      )}
      {promptState.showSwitchPartnersLangPrompt && (
        <div className="fixed left-1/2 top-44 z-50 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in" style={{ minWidth: 320, maxWidth: 400 }}>
          <div className="flex-1 text-sm text-center">
            {currentLanguage === 'en'
              ? 'Some Partners are missing in Urdu. Please switch to Urdu and fill them.'
              : 'Some Partners are missing in English. Please switch to English and fill them.'}
          </div>
          <button type="button" onClick={() => {
            setCurrentLanguage(currentLanguage === 'en' ? 'ur' : 'en');
            updatePromptState({ showSwitchPartnersLangPrompt: false });
          }} className="px-3 py-1 rounded bg-blue-600 text-white text-xs shadow">Switch to {currentLanguage === 'en' ? 'Urdu' : 'English'}</button>
          <button type="button" onClick={() => updatePromptState({ showSwitchPartnersLangPrompt: false })} className="ml-2 p-1 rounded hover:bg-yellow-200" aria-label="Close"><FiX className="w-4 h-4" /></button>
        </div>
      )}

    </div>
  );
}
