"use client";

import React, {useState, useEffect, useCallback} from "react";
import Image from "next/image";
import {FiEdit2, FiSave, FiX, FiImage, FiType, FiTrash2, FiPlus} from "react-icons/fi";
import {FaEdit, FaTrash} from "react-icons/fa";
import {showAlert, showConfirmDialog} from "@/utils/alert";
import ImageSelector from "../components/ImageSelector";
import IconSelector from "../components/IconSelector";
import {ImpactData, ImpactStat} from "@/types/impact";
import {theme} from "@/config/theme";
import {FaMapMarked, FaProjectDiagram, FaCheckCircle, FaUsers, FaHeart, FaHandsHelping, FaGraduationCap, FaHome, FaMedkit, FaWater, FaLeaf, FaChild} from "react-icons/fa";
import { IconType } from 'react-icons';
import { useRouter } from "next/navigation";
import { handle403Response } from "../errors/error403";
import AdminError from "@/app/admin/errors/error";
import DashboardLoader from "../components/DashboardLoader";

interface UIState {
  language: "en" | "ur";
  miniModalLanguage: "en" | "ur";
  hasChanges: boolean;
}

interface TempStatValues {
  label: string;
  value: string;
  suffix: string;
  iconName: string;
  order: number;
  showOnHomepage: boolean;
  id: string;
}

interface ModalState {
  statModalOpen: boolean;
  editingStat: ImpactStat | null;
  editingStatIndex: number | null;
}

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const iconMap: {[key: string]: IconType} = {
    FaMapMarked,
    FaProjectDiagram,
    FaCheckCircle,
    FaUsers,
    FaHeart,
    FaHandsHelping,
    FaGraduationCap,
    FaHome,
    FaMedkit,
    FaWater,
    FaLeaf,
    FaChild,
  };

  return iconMap[iconName] || FaUsers; // Default to FaUsers if icon not found
};

export default function AdminImpact() {
  const router = useRouter();
  const [impactData, setImpactData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [uiState, setUIState] = useState<UIState>({
    language: "en",
    miniModalLanguage: "en",
    hasChanges: false,
  });

  const [modalState, setModalState] = useState<ModalState>({
    statModalOpen: false,
    editingStat: null,
    editingStatIndex: null,
  });

  const [isEditingImpactPage, setIsEditingImpactPage] = useState(false);
  const [originalImpactData, setOriginalImpactData] = useState<ImpactData | null>(null);

  const updateUIState = (updates: Partial<UIState>) => {
    setUIState((prev) => ({...prev, ...updates}));
  };

  const updateModalState = (updates: Partial<ModalState>) => {
    setModalState((prev) => ({...prev, ...updates}));
  };

  const handleErrorResponse = useCallback(async (response: Response, identifier: string = "default") => {
    setLoading(false);
    if (response.status === 401) {
      router.push("/admin/login");
      return;
    } else if (response.status === 403) {
      const shouldRedirect = await handle403Response();
      if (shouldRedirect) {
        window.location.href = "/admin/login";
      }
      return;
    }
    if (identifier === "get") {
      if (response.status === 500 || response.status === 400 || response.status === 404) {
        console.log("error, 400, 500. 404");
        const errorMessage = response.statusText || "An error occurred";
        setError(new Error(errorMessage));
        return;
      }
    }

    showAlert({
      title: "Error",
      text: response.statusText || "An error occurred",
      icon: "error",
    });
  }, [router]);

  // Labels for UI text in both languages
  const labels = {
    title: {en: "Impact Management", ur: "اثرات کا انتظام"},
    mainTitle: {en: "Main Title", ur: "اصل عنوان"},
    backgroundImage: {en: "Background Image", ur: "پس منظر کی تصویر"},
    showOnHomepage: {en: "Show on Homepage", ur: "ہوم پیج پر دکھائیں"},
    stats: {en: "Impact Statistics", ur: "اثرات کے اعداد و شمار"},
    addStat: {en: "Add Statistic", ur: "اعداد و شمار شامل کریں"},
    edit: {en: "Edit", ur: "ترمیم"},
    delete: {en: "Delete", ur: "حذف"},
    save: {en: "Save", ur: "محفوظ کریں"},
    cancel: {en: "Cancel", ur: "منسوخ"},
    value: {en: "Value", ur: "قیمت"},
    label: {en: "Label", ur: "لیبل"},
    suffix: {en: "Suffix", ur: "لاحقہ"},
    icon: {en: "Icon", ur: "آئیکن"},
    order: {en: "Order", ur: "ترتیب"},
    actions: {en: "Actions", ur: "اعمال"},
    english: {en: "English", ur: "انگریزی"},
    urdu: {en: "Urdu", ur: "اردو"},
    homepageLimit: {
      en: "Only 4 statistics can be shown on homepage",
      ur: "صرف 4 اعداد و شمار ہوم پیج پر دکھائے جا سکتے ہیں",
    },
  };

  // Get current language font configuration
  const currentFontFamily = uiState.language === "en" ? theme.fonts.en.primary : theme.fonts.ur.primary;

  useEffect(() => {
    fetchImpactData();
  }, []);

  const fetchImpactData = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/impact");

      if (!response.ok) {
        handleErrorResponse(response, "get");
        return;
      }

      const data = await response.json();
      if (data.success) {
        if (data.data) {
          setImpactData(data.data);
        } else {
          // No data exists, create a default structure for admin
          const defaultData: ImpactData = {
            id: "1",
            title: {
              en: {text: ""},
              ur: {text: ""},
            },
            backgroundImage: "",
            showOnHomepage: true,
            stats: [],
            updatedAt: new Date(),
            createdAt: new Date(),
          };
          setImpactData(defaultData);
        }
        setLoading(false);
      } else {
        handleErrorResponse(response, "get");
      }
    } catch (error) {
      handleErrorResponse(error as Response, "get");
    }
  }, [handleErrorResponse]);

  const handleSave = async () => {
    if (!impactData) return;

    try {
      setSaving(true);
      const response = await fetch("/api/admin/impact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "page",
          title: impactData.title,
          backgroundImage: impactData.backgroundImage,
          showOnHomepage: impactData.showOnHomepage,
          stats: impactData.stats,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          showAlert({
            title: "Success",
            text: "Impact data saved successfully!",
            icon: "success",
          });
          updateUIState({hasChanges: false});
          fetchImpactData();
        } else {
          showAlert({
            title: "Error",
            text: result.error || "Error saving impact data",
            icon: "error",
          });
        }
      } else {
        showAlert({
          title: "Error",
          text: "Error saving impact data",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error saving impact data:", error);
      showAlert({
        title: "Error",
        text: "Error saving impact data",
        icon: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = (field: keyof ImpactData, value: {text: string}, language?: "en" | "ur") => {
    if (!impactData) return;

    const targetLanguage = language || uiState.language;

    setImpactData((prev) => {
      if (!prev) return prev;

      const currentField = (prev[field] as unknown as Record<string, unknown>) || {};
      return {
        ...prev,
        [field]: {
          ...currentField,
          [targetLanguage]: value,
        },
      };
    });

    updateUIState({hasChanges: true});
  };

  const handleFieldChange = (field: keyof ImpactData, value: unknown) => {
    if (!impactData) return;

    setImpactData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value,
      };
    });

    updateUIState({hasChanges: true});
  };

  // Check homepage limit and show warning
  const checkHomepageLimit = (newShowOnHomepage: boolean, currentStatId: string) => {
    if (!newShowOnHomepage || !impactData) return true; // Allow unchecking

    const currentHomepageStats = impactData.stats.filter((stat) => stat.showOnHomepage && stat.id !== currentStatId);

    if (currentHomepageStats.length >= 4) {
      showAlert({
        title: "Homepage Limit",
        text: labels.homepageLimit[uiState.miniModalLanguage],
        icon: "warning",
      });
      return false;
    }

    return true;
  };

  const handleMiniModalLanguageSwitch = (lang: "en" | "ur") => {
    // Save current values before switching language
    if (modalState.statModalOpen && modalState.editingStat) {
      const currentLang = uiState.miniModalLanguage;
      const currentValues = {
        label: modalState.editingStat.label?.en?.text || modalState.editingStat.label?.ur?.text || "",
        value: modalState.editingStat.value || "",
        suffix: modalState.editingStat.suffix || "",
        iconName: modalState.editingStat.iconName || "",
        order: modalState.editingStat.order || 1,
        showOnHomepage: modalState.editingStat.showOnHomepage || false,
        id: modalState.editingStat.id,
      };

      // Store current values in a temporary storage
      const tempStorage = (modalState.editingStat as unknown as Record<string, Record<string, TempStatValues>>).tempStorage || {};
      tempStorage[currentLang] = currentValues;

      // Get values for the new language from temp storage or empty
      const newLangValues = tempStorage[lang] || {
        label: "",
        value: currentValues.value, // Keep non-language specific fields
        suffix: currentValues.suffix,
        iconName: currentValues.iconName,
        order: currentValues.order,
        showOnHomepage: currentValues.showOnHomepage,
        id: currentValues.id,
      };

      updateModalState({
        editingStat: {
          ...modalState.editingStat,
          label: {
            en: {text: lang === "en" ? newLangValues.label : modalState.editingStat.label?.en?.text || ""},
            ur: {text: lang === "ur" ? newLangValues.label : modalState.editingStat.label?.ur?.text || ""},
          },
          value: newLangValues.value,
          suffix: newLangValues.suffix,
          iconName: newLangValues.iconName,
          order: newLangValues.order,
          showOnHomepage: newLangValues.showOnHomepage,
          tempStorage: tempStorage,
        } as ImpactStat,
      });
    }

    updateUIState({miniModalLanguage: lang});
  };

  if (loading) {
    return <DashboardLoader />;
  }

  if (error) {
    return <AdminError error={error} reset={fetchImpactData} />;
  }

  if (!impactData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Impact Data Found</h2>
          <p className="text-gray-600">Unable to load impact data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: theme.colors.background.secondary}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold" style={{color: theme.colors.text.primary}}>
              Impact Page Settings
            </h1>
            {!isEditingImpactPage ? (
              <button
                type="button"
                onClick={() => {
                  setOriginalImpactData({...impactData!});
                  setIsEditingImpactPage(true);
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
                  setIsEditingImpactPage(false);
                  // Reset to original data without API call
                  if (originalImpactData) {
                    setImpactData(originalImpactData);
                  }
                  setOriginalImpactData(null);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
                style={{backgroundColor: theme.colors.status.error, color: theme.colors.text.light}}
              >
                <FiX className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Background Image Card */}
          <div className="rounded-xl shadow-sm p-6" style={{backgroundColor: theme.colors.background.primary}}>
            <div className="flex items-center gap-2 mb-4">
              <FiImage className="w-5 h-5" style={{color: theme.colors.primary}} />
              <h2 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                Background Image
              </h2>
            </div>

            {!isEditingImpactPage ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                    Background Image
                  </label>
                  <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {impactData.backgroundImage ? (
                      <Image
                        src={impactData.backgroundImage}
                        alt="Impact page background"
                        width={300}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiImage className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                    Background Image <span className="text-red-500">*</span>
                  </label>
                  <ImageSelector selectedPath={impactData.backgroundImage} onSelect={(imageUrl) => handleFieldChange("backgroundImage", imageUrl)} size="small" />
                </div>
              </div>
            )}

            {/* Content Card */}
            <div className="flex items-center gap-2 mb-4">
              <FiType className="w-5 h-5" style={{color: theme.colors.primary}} />
              <h2 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                Content
              </h2>
            </div>

            {!isEditingImpactPage ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                    Title (English)
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg" style={{color: theme.colors.text.primary}}>
                    {impactData.title.en?.text || "Not set"}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                    Title (Urdu)
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg" style={{color: theme.colors.text.primary, direction: "rtl", textAlign: "right"}}>
                    {impactData.title.ur?.text || "Not set"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                    Title (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={impactData.title.en?.text || ""}
                    onChange={(e) => handleLanguageChange("title", {text: e.target.value}, "en")}
                    className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                    style={{
                      borderColor: theme.colors.border.default,
                      color: theme.colors.text.primary,
                      backgroundColor: theme.colors.background.primary,
                      fontFamily: theme.fonts.en.primary,
                    }}
                    placeholder="Enter title in English"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                    Title (Urdu) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={impactData.title.ur?.text || ""}
                    onChange={(e) => handleLanguageChange("title", {text: e.target.value}, "ur")}
                    className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                    style={{
                      borderColor: theme.colors.border.default,
                      color: theme.colors.text.primary,
                      backgroundColor: theme.colors.background.primary,
                      fontFamily: theme.fonts.ur.primary,
                      direction: "rtl",
                      textAlign: "right",
                    }}
                    placeholder="اردو میں عنوان درج کریں"
                    required
                  />
                </div>
              </div>
            )}

            {/* Settings Card */}
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                Settings
              </h2>
            </div>

            {!isEditingImpactPage ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                    Show on Homepage
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg" style={{color: theme.colors.text.primary}}>
                    {impactData.showOnHomepage ? "Yes" : "No"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-4">
                  <label className="flex items-center">
                    <input type="checkbox" checked={impactData.showOnHomepage || false} onChange={(e) => handleFieldChange("showOnHomepage", e.target.checked)} className="rounded border-gray-300 focus:ring-blue-500" style={{accentColor: theme.colors.primary}} />
                    <span className="ml-2 text-sm" style={{color: theme.colors.text.primary}}>
                      Show on Homepage
                    </span>
                  </label>
                </div>


                  <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
                    style={{
                      backgroundColor: saving ? theme.colors.border.default : theme.colors.primary,
                      color: theme.colors.text.light,
                      cursor: saving ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <FiSave className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  </div>
              </div>
            )}
          </div>

          {/* Statistics Management */}
          <div
            className="rounded-lg shadow-sm p-6"
            style={{
              backgroundColor: theme.colors.background.primary,
              boxShadow: theme.colors.shadow.sm,
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2
                  className="text-lg font-semibold"
                  style={{
                    color: theme.colors.text.primary,
                    fontFamily: currentFontFamily,
                  }}
                >
                  {labels.stats[uiState.language]}
                </h2>
                {/* Homepage Stats Counter */}
                <div className="mt-1">
                  <span
                    className="text-sm"
                    style={{
                      color: theme.colors.text.secondary,
                      fontFamily: currentFontFamily,
                    }}
                  >
                    {uiState.language === "en" ? `${impactData.stats.filter((stat) => stat.showOnHomepage).length}/4 shown on homepage` : `${impactData.stats.filter((stat) => stat.showOnHomepage).length}/4 ہوم پیج پر دکھائے گئے`}
                  </span>
                  {impactData.stats.filter((stat) => stat.showOnHomepage).length >= 4 && (
                    <span
                      className="ml-2 text-xs px-2 py-1 rounded"
                      style={{
                        backgroundColor: theme.colors.status.warning,
                        color: theme.colors.text.light,
                        fontFamily: currentFontFamily,
                      }}
                    >
                      {uiState.language === "en" ? "Limit Reached" : "حد مکمل"}
                    </span>
                  )}
                </div>
              </div>

              {/* Language Toggle Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateUIState({language: "en"})}
                  className={`px-3 py-1 text-sm rounded transition-all duration-200 ${
                    uiState.language === "en"
                      ? "font-semibold"
                      : "font-normal hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor: uiState.language === "en" ? theme.colors.primary : theme.colors.background.secondary,
                    color: uiState.language === "en" ? theme.colors.text.light : theme.colors.text.primary,
                    border: `1px solid ${uiState.language === "en" ? theme.colors.primary : theme.colors.border.default}`,
                    fontFamily: theme.fonts.en.primary
                  }}
                >
                  English
                </button>
                <button
                  onClick={() => updateUIState({language: "ur"})}
                  className={`px-3 py-1 text-sm rounded transition-all duration-200 ${
                    uiState.language === "ur"
                      ? "font-semibold"
                      : "font-normal hover:opacity-80"
                  }`}
                  style={{
                    backgroundColor: uiState.language === "ur" ? theme.colors.primary : theme.colors.background.secondary,
                    color: uiState.language === "ur" ? theme.colors.text.light : theme.colors.text.primary,
                    border: `1px solid ${uiState.language === "ur" ? theme.colors.primary : theme.colors.border.default}`,
                    fontFamily: theme.fonts.ur.primary
                  }}
                >
                  اردو
                </button>
              </div>
              <button
                onClick={() => {
                  updateModalState({
                    editingStat: {
                      id: Date.now().toString(),
                      value: "",
                      label: {en: {text: ""}, ur: {text: ""}},
                      suffix: "",
                      iconName: "",
                      showOnHomepage: false,
                      order: impactData.stats.length + 1,
                    },
                    editingStatIndex: null,
                    statModalOpen: true,
                  });
                  updateUIState({miniModalLanguage: uiState.language});
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.text.light,
                  fontFamily: currentFontFamily,
                }}
              >
                <FiPlus className="w-4 h-4" />
                {labels.addStat[uiState.language]}
              </button>
            </div>

            {/* Statistics Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead style={{backgroundColor: theme.colors.background.secondary}}>
                  <tr style={{borderBottom: `1px solid ${theme.colors.border.light}`}}>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        color: theme.colors.text.muted,
                        fontFamily: currentFontFamily,
                      }}
                    >
                      {labels.icon[uiState.language]}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        color: theme.colors.text.muted,
                        fontFamily: currentFontFamily,
                      }}
                    >
                      {labels.value[uiState.language]}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        color: theme.colors.text.muted,
                        fontFamily: currentFontFamily,
                      }}
                    >
                      {labels.label[uiState.language]}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        color: theme.colors.text.muted,
                        fontFamily: currentFontFamily,
                      }}
                    >
                      {labels.suffix[uiState.language]}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        color: theme.colors.text.muted,
                        fontFamily: currentFontFamily,
                      }}
                    >
                      {labels.order[uiState.language]}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        color: theme.colors.text.muted,
                        fontFamily: currentFontFamily,
                      }}
                    >
                      {labels.showOnHomepage[uiState.language]}
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{
                        color: theme.colors.text.muted,
                        fontFamily: currentFontFamily,
                      }}
                    >
                      {labels.actions[uiState.language]}
                    </th>
                  </tr>
                </thead>
                <tbody
                  style={{
                    backgroundColor: theme.colors.background.primary,
                    borderTop: `1px solid ${theme.colors.border.light}`,
                  }}
                >
                  {impactData.stats
                    .sort((a, b) => a.order - b.order)
                    .map((stat, index) => {
                      const IconComponent = getIconComponent(stat.iconName);
                      return (
                        <tr
                          key={stat.id}
                          className="hover:bg-opacity-50"
                          style={{
                            borderBottom: `1px solid ${theme.colors.border.light}`,
                            backgroundColor: "transparent",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.background.secondary)}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <IconComponent className="w-6 h-6" style={{color: theme.colors.primary}} />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className="text-sm font-medium"
                              style={{
                                color: theme.colors.text.primary,
                                fontFamily: currentFontFamily,
                              }}
                            >
                              {stat.value}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className="text-sm"
                              style={{
                                color: theme.colors.text.primary,
                                fontFamily: currentFontFamily,
                              }}
                            >
                              {stat.label[uiState.language]?.text || "--"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className="text-sm"
                              style={{
                                color: theme.colors.text.primary,
                                fontFamily: currentFontFamily,
                              }}
                            >
                              {stat.suffix || "--"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className="text-sm"
                              style={{
                                color: theme.colors.text.primary,
                                fontFamily: currentFontFamily,
                              }}
                            >
                              {stat.order}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                              style={{
                                backgroundColor: stat.showOnHomepage ? theme.colors.status.success : theme.colors.status.error,
                                color: theme.colors.text.light,
                                fontFamily: currentFontFamily,
                              }}
                            >
                              {stat.showOnHomepage ? "Shown" : "Hidden"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  // Initialize temp storage with both language values
                                  const tempStorage: Record<string, TempStatValues> = {};
                                  tempStorage.en = {
                                    label: stat.label.en?.text || "",
                                    value: stat.value,
                                    suffix: stat.suffix,
                                    iconName: stat.iconName,
                                    order: stat.order,
                                    showOnHomepage: stat.showOnHomepage,
                                    id: stat.id,
                                  };
                                  tempStorage.ur = {
                                    label: stat.label.ur?.text || "",
                                    value: stat.value,
                                    suffix: stat.suffix,
                                    iconName: stat.iconName,
                                    order: stat.order,
                                    showOnHomepage: stat.showOnHomepage,
                                    id: stat.id,
                                  };

                                  updateModalState({
                                    editingStat: {...stat, tempStorage} as ImpactStat,
                                    editingStatIndex: index,
                                    statModalOpen: true,
                                  });
                                  updateUIState({miniModalLanguage: uiState.language});
                                }}
                                className="p-2 rounded-lg transition-colors"
                                style={{
                                  color: theme.colors.primary,
                                  backgroundColor: "transparent",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.background.secondary)}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={async () => {
                                  const confirmed = await showConfirmDialog({
                                    title: "Delete Statistic",
                                    text: "Are you sure you want to delete this statistic?",
                                    showCancelButton: true,
                                  });
                                  if (confirmed) {
                                    try {
                                      const response = await fetch(`/api/admin/impact?id=${stat.id}`, {
                                        method: "DELETE",
                                      });

                                      if (response.ok) {
                                        const result = await response.json();
                                        if (result.success) {
                                          showAlert({
                                            title: "Success",
                                            text: "Statistic deleted successfully!",
                                            icon: "success",
                                          });
                                          fetchImpactData();
                                        } else {
                                          showAlert({
                                            title: "Error",
                                            text: result.error || "Error deleting statistic",
                                            icon: "error",
                                          });
                                        }
                                      } else {
                                        showAlert({
                                          title: "Error",
                                          text: "Error deleting statistic",
                                          icon: "error",
                                        });
                                      }
                                    } catch (error) {
                                      console.error("Error deleting statistic:", error);
                                      showAlert({
                                        title: "Error",
                                        text: "Error deleting statistic",
                                        icon: "error",
                                      });
                                    }
                                  }
                                }}
                                className="p-2 rounded-lg transition-colors"
                                style={{
                                  color: theme.colors.status.error,
                                  backgroundColor: "transparent",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.background.secondary)}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statistic Modal */}
          {modalState.statModalOpen && modalState.editingStat && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div
                className="rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
                style={{
                  backgroundColor: theme.colors.background.primary,
                  boxShadow: theme.colors.shadow.lg,
                }}
              >
                <h3
                  className="text-lg font-bold mb-4"
                  style={{
                    color: theme.colors.text.primary,
                    fontFamily: uiState.miniModalLanguage === "en" ? theme.fonts.en.primary : theme.fonts.ur.primary,
                  }}
                >
                  {modalState.editingStatIndex !== null ? labels.edit[uiState.miniModalLanguage] : labels.addStat[uiState.miniModalLanguage]}
                </h3>

                {/* Language Switcher */}
                <div className="flex justify-center gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => handleMiniModalLanguageSwitch("en")}
                    className="px-4 py-2 rounded transition-colors duration-300"
                    style={{
                      backgroundColor: uiState.miniModalLanguage === "en" ? theme.colors.primary : theme.colors.background.secondary,
                      color: uiState.miniModalLanguage === "en" ? theme.colors.text.light : theme.colors.text.primary,
                      fontFamily: theme.fonts.en.primary,
                    }}
                  >
                    {labels.english[uiState.miniModalLanguage]}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMiniModalLanguageSwitch("ur")}
                    className="px-4 py-2 rounded transition-colors duration-300"
                    style={{
                      backgroundColor: uiState.miniModalLanguage === "ur" ? theme.colors.primary : theme.colors.background.secondary,
                      color: uiState.miniModalLanguage === "ur" ? theme.colors.text.light : theme.colors.text.primary,
                      fontFamily: theme.fonts.ur.primary,
                    }}
                  >
                    {labels.urdu[uiState.miniModalLanguage]}
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {/* Icon */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{
                        color: theme.colors.text.secondary,
                        fontFamily: uiState.miniModalLanguage === "en" ? theme.fonts.en.primary : theme.fonts.ur.primary,
                        direction: uiState.miniModalLanguage === "ur" ? "rtl" : "ltr",
                        textAlign: uiState.miniModalLanguage === "ur" ? "right" : "left",
                      }}
                    >
                      {labels.icon[uiState.miniModalLanguage]}
                    </label>
                    <IconSelector
                      selectedIcon={modalState.editingStat.iconName || ""}
                      onSelect={(iconName: string) =>
                        updateModalState({
                          editingStat: {...modalState.editingStat!, iconName},
                        })
                      }
                      size="small"
                    />
                  </div>

                  {/* Label */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{
                        color: theme.colors.text.secondary,
                        fontFamily: uiState.miniModalLanguage === "en" ? theme.fonts.en.primary : theme.fonts.ur.primary,
                        direction: uiState.miniModalLanguage === "ur" ? "rtl" : "ltr",
                        textAlign: uiState.miniModalLanguage === "ur" ? "right" : "left",
                      }}
                    >
                      {labels.label[uiState.miniModalLanguage]}
                    </label>
                    <input
                      type="text"
                      value={modalState.editingStat.label[uiState.miniModalLanguage]?.text || ""}
                      onChange={(e) =>
                        updateModalState({
                          editingStat: {
                            ...modalState.editingStat!,
                            label: {
                              ...modalState.editingStat!.label,
                              [uiState.miniModalLanguage]: {text: e.target.value},
                            },
                          },
                        })
                      }
                      className="w-full p-2 rounded focus:ring-2 focus:border-transparent"
                      style={{
                        fontFamily: uiState.miniModalLanguage === "en" ? theme.fonts.en.primary : theme.fonts.ur.primary,
                        direction: uiState.miniModalLanguage === "ur" ? "rtl" : "ltr",
                        textAlign: uiState.miniModalLanguage === "ur" ? "right" : "left",
                        border: `1px solid ${theme.colors.border.default}`,
                        backgroundColor: theme.colors.background.primary,
                        color: theme.colors.text.primary,
                      }}
                    />
                  </div>

                  {/* Value */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{
                        color: theme.colors.text.secondary,
                        fontFamily: uiState.miniModalLanguage === "en" ? theme.fonts.en.primary : theme.fonts.ur.primary,
                        direction: uiState.miniModalLanguage === "ur" ? "rtl" : "ltr",
                        textAlign: uiState.miniModalLanguage === "ur" ? "right" : "left",
                      }}
                    >
                      {labels.value[uiState.miniModalLanguage]}
                    </label>
                    <input
                      type="text"
                      value={modalState.editingStat.value || ""}
                      onChange={(e) =>
                        updateModalState({
                          editingStat: {...modalState.editingStat!, value: e.target.value},
                        })
                      }
                      className="w-full p-2 rounded focus:ring-2 focus:border-transparent"
                      style={{
                        fontFamily: uiState.miniModalLanguage === "en" ? theme.fonts.en.primary : theme.fonts.ur.primary,
                        direction: uiState.miniModalLanguage === "ur" ? "rtl" : "ltr",
                        textAlign: uiState.miniModalLanguage === "ur" ? "right" : "left",
                        border: `1px solid ${theme.colors.border.default}`,
                        backgroundColor: theme.colors.background.primary,
                        color: theme.colors.text.primary,
                      }}
                    />
                  </div>

                  {/* Suffix */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{
                        color: theme.colors.text.secondary,
                        fontFamily: uiState.miniModalLanguage === "en" ? theme.fonts.en.primary : theme.fonts.ur.primary,
                        direction: uiState.miniModalLanguage === "ur" ? "rtl" : "ltr",
                        textAlign: uiState.miniModalLanguage === "ur" ? "right" : "left",
                      }}
                    >
                      {labels.suffix[uiState.miniModalLanguage]}
                    </label>
                    <input
                      type="text"
                      value={modalState.editingStat.suffix || ""}
                      onChange={(e) =>
                        updateModalState({
                          editingStat: {...modalState.editingStat!, suffix: e.target.value},
                        })
                      }
                      className="w-full p-2 rounded focus:ring-2 focus:border-transparent"
                      style={{
                        fontFamily: uiState.miniModalLanguage === "en" ? theme.fonts.en.primary : theme.fonts.ur.primary,
                        direction: uiState.miniModalLanguage === "ur" ? "rtl" : "ltr",
                        textAlign: uiState.miniModalLanguage === "ur" ? "right" : "left",
                        border: `1px solid ${theme.colors.border.default}`,
                        backgroundColor: theme.colors.background.primary,
                        color: theme.colors.text.primary,
                      }}
                    />
                  </div>

                  {/* Order */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1"
                      style={{
                        color: theme.colors.text.secondary,
                        fontFamily: uiState.miniModalLanguage === "en" ? theme.fonts.en.primary : theme.fonts.ur.primary,
                        direction: uiState.miniModalLanguage === "ur" ? "rtl" : "ltr",
                        textAlign: uiState.miniModalLanguage === "ur" ? "right" : "left",
                      }}
                    >
                      {labels.order[uiState.miniModalLanguage]}
                    </label>
                    <input
                      type="number"
                      value={modalState.editingStat.order || 1}
                      onChange={(e) =>
                        updateModalState({
                          editingStat: {...modalState.editingStat!, order: parseInt(e.target.value) || 1},
                        })
                      }
                      className="w-full p-2 rounded focus:ring-2 focus:border-transparent"
                      style={{
                        fontFamily: uiState.miniModalLanguage === "en" ? theme.fonts.en.primary : theme.fonts.ur.primary,
                        direction: uiState.miniModalLanguage === "ur" ? "rtl" : "ltr",
                        textAlign: uiState.miniModalLanguage === "ur" ? "right" : "left",
                        border: `1px solid ${theme.colors.border.default}`,
                        backgroundColor: theme.colors.background.primary,
                        color: theme.colors.text.primary,
                      }}
                      min="1"
                    />
                  </div>

                  {/* Show on Homepage Toggle */}
                  <div
                    style={{
                      direction: uiState.miniModalLanguage === "ur" ? "rtl" : "ltr",
                      textAlign: uiState.miniModalLanguage === "ur" ? "right" : "left",
                    }}
                  >
                    <div
                      className="flex items-center"
                      style={{
                        direction: uiState.miniModalLanguage === "ur" ? "rtl" : "ltr",
                        justifyContent: uiState.miniModalLanguage === "ur" ? "flex-end" : "flex-start",
                      }}
                    >
                      <input
                        type="checkbox"
                        id="statShowOnHomepage"
                        checked={modalState.editingStat?.showOnHomepage || false}
                        onChange={(e) => {
                          if (!modalState.editingStat) return;
                          const canChange = checkHomepageLimit(e.target.checked, modalState.editingStat.id);
                          if (canChange) {
                            updateModalState({
                              editingStat: {...modalState.editingStat, showOnHomepage: e.target.checked},
                            });
                          }
                        }}
                        className="h-4 w-4 rounded"
                        style={{
                          accentColor: theme.colors.primary,
                          borderColor: theme.colors.border.default,
                          order: uiState.miniModalLanguage === "ur" ? 2 : 1,
                        }}
                      />
                      <label
                        htmlFor="statShowOnHomepage"
                        className={`block text-sm ${uiState.miniModalLanguage === "ur" ? "mr-2" : "ml-2"}`}
                        style={{
                          color: theme.colors.text.primary,
                          fontFamily: uiState.miniModalLanguage === "en" ? theme.fonts.en.primary : theme.fonts.ur.primary,
                          direction: uiState.miniModalLanguage === "ur" ? "rtl" : "ltr",
                          textAlign: uiState.miniModalLanguage === "ur" ? "right" : "left",
                          order: uiState.miniModalLanguage === "ur" ? 1 : 2,
                        }}
                      >
                        {labels.showOnHomepage[uiState.miniModalLanguage]}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => updateModalState({statModalOpen: false, editingStat: null, editingStatIndex: null})}
                    className="px-4 py-2 rounded transition-colors"
                    style={{
                      backgroundColor: theme.colors.background.secondary,
                      color: theme.colors.text.primary,
                      fontFamily: uiState.miniModalLanguage === "en" ? theme.fonts.en.primary : theme.fonts.ur.primary,
                      border: `1px solid ${theme.colors.border.default}`,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.border.default)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.colors.background.secondary)}
                  >
                    {labels.cancel[uiState.miniModalLanguage]}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!modalState.editingStat) return;

                      try {
                        // Check if both languages have content, if not auto-copy from completed language
                        const editingStat = { ...modalState.editingStat };

                        // Check if one language is empty and the other has content
                        const enLabel = editingStat.label?.en?.text?.trim();
                        const urLabel = editingStat.label?.ur?.text?.trim();

                        if (enLabel && !urLabel) {
                          // Auto-copy English to Urdu
                          editingStat.label.ur = { text: enLabel };
                        } else if (urLabel && !enLabel) {
                          // Auto-copy Urdu to English
                          editingStat.label.en = { text: urLabel };
                        }

                        if (modalState.editingStatIndex !== null) {
                          // Edit existing statistic
                          const response = await fetch("/api/admin/impact", {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(editingStat),
                          });

                          if (response.ok) {
                            const result = await response.json();
                            if (result.success) {
                              showAlert({
                                title: "Success",
                                text: "Statistic updated successfully!",
                                icon: "success",
                              });
                              fetchImpactData();
                              updateModalState({statModalOpen: false, editingStat: null, editingStatIndex: null});
                            } else {
                              showAlert({
                                title: "Error",
                                text: result.error || "Error updating statistic",
                                icon: "error",
                              });
                            }
                          }
                        } else {
                          // Add new statistic
                          const response = await fetch("/api/admin/impact", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(editingStat),
                          });

                          if (response.ok) {
                            const result = await response.json();
                            if (result.success) {
                              showAlert({
                                title: "Success",
                                text: "Statistic added successfully!",
                                icon: "success",
                              });
                              fetchImpactData();
                              updateModalState({statModalOpen: false, editingStat: null, editingStatIndex: null});
                            } else {
                              showAlert({
                                title: "Error",
                                text: result.error || "Error adding statistic",
                                icon: "error",
                              });
                            }
                          }
                        }
                      } catch (error) {
                        console.error("Error saving statistic:", error);
                        showAlert({
                          title: "Error",
                          text: "Error saving statistic",
                          icon: "error",
                        });
                      }
                    }}
                    className="px-4 py-2 rounded transition-colors"
                    style={{
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.text.light,
                      fontFamily: uiState.miniModalLanguage === "en" ? theme.fonts.en.primary : theme.fonts.ur.primary,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme.colors.primaryHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme.colors.primary)}
                  >
                    {labels.save[uiState.miniModalLanguage]}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
