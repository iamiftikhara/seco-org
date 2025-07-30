"use client";

import {useState, useEffect, useCallback} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {FaPlus, FaEdit, FaTrash, FaImage, FaTimes, FaHome} from "react-icons/fa";
import {FiEdit2, FiSave, FiX, FiImage, FiType, FiTrash2, FiEye} from "react-icons/fi";
import {theme} from "@/config/theme";
import {EventDetail} from "@/types/events";
import ImageSelector from "@/app/admin/components/ImageSelector";
import IconSelector from "@/app/admin/components/IconSelector";
import RichTextEditor from "@/app/admin/components/RichTextEditor";
import DashboardLoader from "../components/DashboardLoader";
import Loader from "../components/Loader";
import {showAlert, showConfirmDialog} from "@/utils/alert";
import { handle403Response } from "../errors/error403";
import AdminError from "@/app/admin/errors/error";

// Additional type definitions for admin functionality

interface EventPageData {
  title: {
    en: {text: string};
    ur: {text: string};
  };
  description: {
    en: {text: string};
    ur: {text: string};
  };
  image: string;
}

// Types for better type safety
interface UIState {
  modalLanguage: "en" | "ur";
  miniModalLanguage: "en" | "ur";
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

interface ValidationState {
  missingFields: string[];
  missingOppositeLang: string[];
  homepageLimitError: {
    en: string;
    ur: string;
  };
}

interface PromptState {
  showSwitchLangPrompt: boolean;
  showSwitchImpactLangPrompt: boolean;
  showSwitchIconStatsLangPrompt: boolean;
  showSwitchPartnersLangPrompt: boolean;
}

export default function EventsAdmin() {
  const router = useRouter();
  const [events, setEvents] = useState<EventDetail[]>([]);
  const [eventPage, setEventPage] = useState<EventPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "ur">("en");
  const [showPageModal, setShowPageModal] = useState(false);
  const [editingPageData, setEditingPageData] = useState<EventPageData | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventDetail | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<EventDetail | null>(null);
  const [isEditingEventPage, setIsEditingEventPage] = useState(false);
  const [originalEventPage, setOriginalEventPage] = useState<EventPageData | null>(null);

  // UI state
  const [uiState, setUIState] = useState<UIState>({
    modalLanguage: "en",
    miniModalLanguage: "en",
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

  // Validation state
  const [validationState, setValidationState] = useState<ValidationState>({
    missingFields: [],
    missingOppositeLang: [],
    homepageLimitError: {
      en: "",
      ur: "",
    },
  });

  // Prompt state
  const [promptState, setPromptState] = useState<PromptState>({
    showSwitchLangPrompt: false,
    showSwitchImpactLangPrompt: false,
    showSwitchIconStatsLangPrompt: false,
    showSwitchPartnersLangPrompt: false,
  });

  // Universal variables for font family and direction
  const currentFontFamily = currentLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary;
  const currentDirection = currentLanguage === 'ur' ? 'rtl' : 'ltr';
  const isRTL = currentLanguage === 'ur';

  // Helper functions for state updates
  const updateUIState = (updates: Partial<UIState>) => {
    setUIState(prev => ({...prev, ...updates}));
  };

  const updateModalState = (updates: Partial<ModalState>) => {
    setModalState(prev => ({...prev, ...updates}));
  };

  const updateValidationState = (updates: Partial<ValidationState>) => {
    setValidationState(prev => ({...prev, ...updates}));
  };

  const updatePromptState = (updates: Partial<PromptState>) => {
    setPromptState(prev => ({...prev, ...updates}));
  };

  const handleErrorResponse = useCallback(async (response: Response, identifier: string = 'default') => {
    setLoading(false);
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
  }, [router]);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/admin/events", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        await handleErrorResponse(response, "get");
        return;
      }

      const result = await response.json();

      if (result.success) {
        // Handle the data structure correctly
        const data = result.data;
        setEvents(data.eventsList || []);
        setEventPage(
          data.eventsPage || {
            title: {
              en: {text: "All Events"},
              ur: {text: "تمام پروگرامز"},
            },
            description: {
              en: {text: "Explore all our events and activities making an impact in our communities"},
              ur: {text: "ہماری کمیونٹیز میں اثر انداز ہونے والے تمام پروگرامز اور سرگرمیاں دیکھیں"},
            },
            image: "/images/gallery11.jpeg",
          }
        );
        setLoading(false);
      } else {
        handleErrorResponse(response, "get");
      }
    } catch (error) {
      handleErrorResponse(error as Response, "get");
    }
  }, [handleErrorResponse]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Loading state
  if (loading) {
    return <DashboardLoader />;
  }

  // Error state
  if (error) {
    return <AdminError error={error} onRetry={fetchEvents} />;
  }

  const createEmptyEvent = (): EventDetail => ({
    id: "",
    slug: "",
    featuredImage: "",
    date: "",
    status: "upcoming",
    showOnHome: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    socialShare: {
      title: {text: ""},
      description: {text: ""},
      hashtags: [],
      twitterHandle: "SECOPakistan",
      ogType: "event",
    },
    en: {
      title: {text: ""},
      shortDescription: {text: ""},
      fullDescription: {text: ""},
      content: {text: ""},
      location: {text: ""},
      time: {text: ""},
      outcome: {text: ""},
    },
    ur: {
      title: {text: ""},
      shortDescription: {text: ""},
      fullDescription: {text: ""},
      content: {text: ""},
      location: {text: ""},
      time: {text: ""},
      outcome: {text: ""},
    },
  });

  const addNewEvent = () => {
    setEditingEvent(null);
    setFormData(createEmptyEvent());
    updateUIState({modalLanguage: "en", miniModalLanguage: "en"});
    setShowEventModal(true);
  };

  const editEvent = (event: EventDetail) => {
    setEditingEvent(event);
    setFormData({...event});
    updateUIState({modalLanguage: "en", miniModalLanguage: "en"});
    setShowEventModal(true);
  };

  const deleteEvent = async (eventId: string) => {
    const confirmed = await showConfirmDialog({
      title: "Delete Event",
      text: "Are you sure you want to delete this event? This action cannot be undone.",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/events?id=${eventId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      const result = await response.json();
      if (result.success) {
        showAlert({
          title: "Success",
          text: "Event deleted successfully!",
          icon: "success",
        });
        await fetchEvents();
      }
    } catch (err: any) {
      showAlert({
        title: "Error",
        text: "Failed to delete event",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEventPageSave = async () => {
    try {
      setIsSubmitting(true);

      const response = await fetch("/api/admin/events", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          type: "page",
          eventsPage: eventPage,
        }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          router.push("/admin/login");
          return;
        }
        throw new Error("Failed to save page data");
      }

      const result = await response.json();
      if (result.success) {
        setIsEditingEventPage(false);
        setOriginalEventPage(null);
        await fetchEvents(); // Refresh the data
      }
    } catch (err: any) {
      handleErrorResponse(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEventPageCancel = () => {
    if (originalEventPage) {
      setEventPage(originalEventPage);
    }
    setIsEditingEventPage(false);
    setOriginalEventPage(null);
  };

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Auto-generate slug when English title changes
  const handleTitleChange = (value: string, lang: "en" | "ur") => {
    if (!formData) return;

    const updatedFormData = {
      ...formData,
      [lang]: {
        ...formData[lang],
        title: { text: value }
      }
    };

    // Auto-generate slug from English title
    if (lang === "en" && value.trim()) {
      updatedFormData.slug = generateSlug(value);
    }

    setFormData(updatedFormData);
  };

  const copyToOtherLanguage = (sourceData: any, targetLang: "en" | "ur") => {
    if (!formData) return;

    const sourceLang = targetLang === "en" ? "ur" : "en";
    const updatedFormData = {
      ...formData,
      [targetLang]: {
        ...formData[targetLang],
        title: { text: sourceData.title?.text || formData[sourceLang].title.text },
        shortDescription: { text: sourceData.shortDescription?.text || formData[sourceLang].shortDescription.text },
        fullDescription: { text: sourceData.fullDescription?.text || formData[sourceLang].fullDescription.text },
        content: { text: sourceData.content?.text || formData[sourceLang].content.text },
        location: { text: sourceData.location?.text || formData[sourceLang].location.text },
        time: { text: sourceData.time?.text || formData[sourceLang].time?.text || "" },
        outcome: { text: sourceData.outcome?.text || formData[sourceLang].outcome?.text || "" },
      }
    };

    setFormData(updatedFormData);
  };

  // Validation function matching programs pattern exactly
  const validateEvent = (event: EventDetail, currentLang: "en" | "ur") => {
    const requiredFields = [
      // Event Image (required)
      {key: "featuredImage", value: event.featuredImage},
      // Event Date (required)
      {key: "date", value: event.date},
      // Both language fields (all required)
      {key: "en.title", value: event.en?.title?.text},
      {key: "en.shortDescription", value: event.en?.shortDescription?.text},
      {key: "en.location", value: event.en?.location?.text},
      {key: "ur.title", value: event.ur?.title?.text},
      {key: "ur.shortDescription", value: event.ur?.shortDescription?.text},
      {key: "ur.location", value: event.ur?.location?.text},
      // Social Share Settings (required)
      {key: "socialShare.title", value: event.socialShare?.title?.text},
      {key: "socialShare.description", value: event.socialShare?.description?.text},
      {key: "socialShare.hashtags", value: Array.isArray(event.socialShare?.hashtags) && event.socialShare.hashtags.length > 0 ? "ok" : ""},
      {key: "socialShare.twitterHandle", value: event.socialShare?.twitterHandle},
      {key: "socialShare.ogType", value: event.socialShare?.ogType},
    ];

    return requiredFields.filter((f) => !f.value).map((f) => f.key);
  };

  const validateEventForm = (): boolean => {
    if (!formData) return false;

    // Check homepage limit first
    if (formData.showOnHome) {
      const currentHomepageEvents = events.filter(event =>
        event.showOnHome && event.id !== editingEvent?.id
      );

      if (currentHomepageEvents.length >= 6) {
        const homepageLimitError = {
          en: "Maximum 6 events can be shown on homepage. Please uncheck 'Show on Homepage' or disable another event first.",
          ur: "زیادہ سے زیادہ 6 ایونٹس ہوم پیج پر دکھائے جا سکتے ہیں۔ براہ کرم 'ہوم پیج پر دکھائیں' کو غیر فعال کریں یا پہلے کوئی اور ایونٹ غیر فعال کریں۔"
        };
        updateValidationState({ homepageLimitError });
        showAlert({
          title: "Homepage Limit Exceeded",
          text: homepageLimitError.en,
          icon: "warning",
        });
        return false;
      }
    }

    const missing = validateEvent(formData, uiState.modalLanguage);

    // Separate current language missing fields from opposite language missing fields
    const currentLang = uiState.modalLanguage;
    const oppositeLang = currentLang === "en" ? "ur" : "en";

    const currentLangMissing = missing.filter((f) =>
      f.startsWith(`${currentLang}.`) ||
      (!f.includes('.') || f.startsWith('featuredImage') || f.startsWith('date') || f.startsWith('socialShare'))
    );
    const oppositeLangMissing = missing.filter((f) => f.startsWith(`${oppositeLang}.`));

    updateValidationState({
      missingFields: currentLangMissing,
      missingOppositeLang: oppositeLangMissing
    });

    // Check for missing fields in the opposite language first (only show one popup)
    if (oppositeLangMissing.length > 0) {
      updatePromptState({showSwitchLangPrompt: true});
      return false;
    }

    // Check if current language required fields are filled
    if (currentLangMissing.length > 0) {
      return false;
    }

    return true;
  };

  const handleEventSave = async () => {
    if (!validateEventForm()) return;

    try {
      setIsSubmitting(true);

      const eventData = {
        ...formData,
        id: editingEvent?.id,
        createdAt: editingEvent?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/admin/events", {
        method: editingEvent ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        if (response.status === 403) {
          router.push("/admin/login");
          return;
        }
        throw new Error("Failed to save event");
      }

      const result = await response.json();
      if (result.success) {
        showAlert({
          title: "Success",
          text: "Event saved successfully!",
          icon: "success",
        });

        await fetchEvents(); // Refresh the list
        setShowEventModal(false);
        setEditingEvent(null);
        setFormData(null);
        updateValidationState({missingFields: [], missingOppositeLang: [], homepageLimitError: {en: "", ur: ""}});
        updatePromptState({
          showSwitchLangPrompt: false,
          showSwitchImpactLangPrompt: false,
          showSwitchIconStatsLangPrompt: false,
          showSwitchPartnersLangPrompt: false,
        });
      } else {
        showAlert({
          title: "Error",
          text: result.error || "Failed to save event",
          icon: "error",
        });
      }
    } catch (err: any) {
      showAlert({
        title: "Error",
        text: "Failed to save event",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEventCancel = () => {
    setShowEventModal(false);
    setEditingEvent(null);
    setFormData(null);
    updateValidationState({missingFields: [], missingOppositeLang: [], homepageLimitError: {en: "", ur: ""}});
    updatePromptState({
      showSwitchLangPrompt: false,
      showSwitchImpactLangPrompt: false,
      showSwitchIconStatsLangPrompt: false,
      showSwitchPartnersLangPrompt: false,
    });
  };

  const handleEventPageChange = (field: string, value: string) => {
    setEventPage((prev: EventPageData | null) => ({
      ...prev,
      [field]: value,
    } as EventPageData));
  };

  const handleEventPageLangChange = (field: string, lang: "en" | "ur", value: string) => {
    setEventPage((prev: EventPageData | null) => {
      if (!prev) return prev;
      const currentField = prev[field as keyof EventPageData] as any;
      return {
        ...prev,
        [field]: {
          ...currentField,
          [lang]: {text: value},
        },
      } as EventPageData;
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Loader isVisible={isSubmitting} text="Saving" />
      {/* Event Page Details - matches programs page 100% */}
      {eventPage && (
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8" style={{backgroundColor: theme.colors.background.primary}}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isEditingEventPage) handleEventPageSave();
              }}
              className="space-y-8"
            >
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold" style={{color: theme.colors.text.primary}}>
                  Event Page Settings
                </h1>
                {!isEditingEventPage ? (
                  <button
                    type="button"
                    onClick={() => {
                      setOriginalEventPage({...eventPage});
                      setIsEditingEventPage(true);
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
                      setIsEditingEventPage(false);
                      // Reset to original data without API call
                      if (originalEventPage) {
                        setEventPage(originalEventPage);
                      }
                      setOriginalEventPage(null);
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
              {!isEditingEventPage ? (
                <>
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FiImage className="w-5 h-5" style={{color: theme.colors.primary}} />
                      <h2 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                        Hero Image
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                          Hero Image
                        </label>
                        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">{eventPage.image ? <img src={eventPage.image} alt="Event page hero" className="w-full h-full object-cover" /> : <FiImage className="w-8 h-8 text-gray-400" />}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FiType className="w-5 h-5" style={{color: theme.colors.primary}} />
                      <h2 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                        Page Content
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                            Title (English)
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p style={{color: theme.colors.text.primary}}>{eventPage.title?.en?.text || "No title set"}</p>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                            Description (English)
                          </label>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p style={{color: theme.colors.text.primary}}>{eventPage.description?.en?.text || "No description set"}</p>
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
                              {eventPage.title?.ur?.text || "کوئی عنوان سیٹ نہیں"}
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
                              {eventPage.description?.ur?.text || "کوئی تفصیل سیٹ نہیں"}
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
                      <h2 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                        Hero Image
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                          Hero Image
                        </label>
                        <ImageSelector selectedPath={eventPage.image || ""} onSelect={(imageUrl: string) => handleEventPageChange("image", imageUrl)} size="small" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FiType className="w-5 h-5" style={{color: theme.colors.primary}} />
                      <h2 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                        Page Content
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                            Title (English)
                          </label>
                          <input
                            type="text"
                            value={eventPage.title?.en?.text || ""}
                            onChange={(e) => handleEventPageLangChange("title", "en", e.target.value)}
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
                            value={eventPage.description?.en?.text || ""}
                            onChange={(e) => handleEventPageLangChange("description", "en", e.target.value)}
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
                            value={eventPage.title?.ur?.text || ""}
                            onChange={(e) => handleEventPageLangChange("title", "ur", e.target.value)}
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
                            value={eventPage.description?.ur?.text || ""}
                            onChange={(e) => handleEventPageLangChange("description", "ur", e.target.value)}
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
                    <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-200 hover:opacity-90 disabled:opacity-50" style={{backgroundColor: theme.colors.secondary, color: theme.colors.text.primary}}>
                      <FiSave className="w-4 h-4" />
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Events List Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{color: theme.colors.text.primary}}>
            Events List
          </h2>
          <button onClick={addNewEvent} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90" style={{backgroundColor: theme.colors.primary, color: theme.colors.text.light}}>
            <FaPlus />
            Add Event
          </button>
        </div>

        {/* Language Toggle for Events List */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-2 p-1 rounded-lg" style={{backgroundColor: theme.colors.background.secondary}}>
            <button
              onClick={() => setCurrentLanguage('en')}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${currentLanguage === 'en' ? 'text-white' : ''}`}
              style={{
                backgroundColor: currentLanguage === 'en' ? theme.colors.primary : 'transparent',
                color: currentLanguage === 'en' ? 'white' : theme.colors.text.primary,
                fontFamily: theme.fonts.en.primary
              }}
            >
              English
            </button>
            <button
              onClick={() => setCurrentLanguage('ur')}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${currentLanguage === 'ur' ? 'text-white' : ''}`}
              style={{
                backgroundColor: currentLanguage === 'ur' ? theme.colors.primary : 'transparent',
                color: currentLanguage === 'ur' ? 'white' : theme.colors.text.primary,
                fontFamily: theme.fonts.ur.primary
              }}
            >
              اردو
            </button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Event Image */}
              <div className="relative h-48">
                <Image src={event.featuredImage} alt={event[currentLanguage].title.text} fill className="object-cover" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{event.isActive ? "Active" : "Inactive"}</span>
                  {event.showOnHome && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1">
                      <FaHome className="text-xs" />
                      Home
                    </span>
                  )}
                </div>
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === 'upcoming'
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {event.status === 'upcoming' ? 'Upcoming' : 'Past'}
                  </span>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-4">
                <div className="mb-3" style={{direction: currentDirection}}>
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2" style={{
                    color: theme.colors.text.primary,
                    fontFamily: currentFontFamily,
                    textAlign: isRTL ? 'right' : 'left'
                  }}>
                    {event[currentLanguage].title.text}
                  </h3>
                  <p className="text-sm line-clamp-2" style={{
                    color: theme.colors.text.secondary,
                    fontFamily: currentFontFamily,
                    textAlign: isRTL ? 'right' : 'left'
                  }}>
                    {event[currentLanguage].shortDescription.text}
                  </p>
                </div>

                <div className="text-xs mb-3" style={{color: theme.colors.text.secondary}}>
                  <div className="flex items-center gap-1 mb-1">
                    <span>📅</span>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  {event[currentLanguage].location.text && (
                    <div className="flex items-center gap-1">
                      <span>📍</span>
                      <span className="truncate" style={{fontFamily: currentFontFamily}}>
                        {event[currentLanguage].location.text}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : "flex-row"}`}>
                    <button
                      onClick={() => editEvent(event)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Event"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Event"
                    >
                      <FaTrash />
                    </button>
                    <a
                      href={`/events/${event.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="View Event"
                    >
                      <FiEye />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {events.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first event.</p>
            <button onClick={addNewEvent} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Create First Event
            </button>
          </div>
        )}
      </div>

      {/* Event Form Modal */}
      {showEventModal && formData && (
        <div className="fixed inset-0 bg-[#61616167] flex items-center justify-center z-50 p-4">
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
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{color: theme.colors.text.primary}}>
                  {editingEvent ? "Edit Event" : "Add New Event"}
                </h2>
                <button onClick={handleEventCancel} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <FaTimes style={{color: theme.colors.text.secondary}} />
                </button>
              </div>

              {/* Language Toggle */}
              <div className="flex justify-center mb-6">
                <div className="flex gap-2 p-1 rounded-lg" style={{backgroundColor: theme.colors.background.secondary}}>
                  <button
                    onClick={() => updateUIState({modalLanguage: "en"})}
                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${uiState.modalLanguage === "en" ? "text-white" : ""}`}
                    style={{
                      backgroundColor: uiState.modalLanguage === "en" ? theme.colors.primary : "transparent",
                      color: uiState.modalLanguage === "en" ? "white" : theme.colors.text.primary,
                      fontFamily: theme.fonts.en.primary,
                    }}
                  >
                    English
                  </button>
                  <button
                    onClick={() => updateUIState({modalLanguage: "ur"})}
                    className={`px-4 py-2 rounded-md transition-colors duration-200 ${uiState.modalLanguage === "ur" ? "text-white" : ""}`}
                    style={{
                      backgroundColor: uiState.modalLanguage === "ur" ? theme.colors.primary : "transparent",
                      color: uiState.modalLanguage === "ur" ? "white" : theme.colors.text.primary,
                      fontFamily: theme.fonts.ur.primary,
                    }}
                  >
                    اردو
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={(e) => {
                e.preventDefault();
                handleEventSave();
              }} className="space-y-8">
                {/* Basic Info Section */}
                <div className="space-y-6" style={{direction: uiState.modalLanguage === "ur" ? "rtl" : "ltr"}}>
                  <div className="flex items-center gap-2 mb-4">
                    <FiType className="w-5 h-5" style={{color: theme.colors.primary}} />
                    <h3 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                      Basic Information
                    </h3>
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{
                      color: theme.colors.text.primary,
                      fontFamily: uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                      textAlign: uiState.modalLanguage === "ur" ? "right" : "left"
                    }}>
                      {uiState.modalLanguage === "en" ? "Featured Image" : "نمایاں تصویر"} *
                    </label>
                    <ImageSelector
                      selectedPath={formData.featuredImage}
                      onSelect={(image) => setFormData({...formData, featuredImage: image})}
                    />
                    {validationState.missingFields.includes("featuredImage") && (
                      <p className="text-red-500 text-sm mt-1">Featured image is required</p>
                    )}
                  </div>

                  {/* Status Checkboxes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showOnHome"
                        checked={formData.showOnHome}
                        onChange={(e) => setFormData({...formData, showOnHome: e.target.checked})}
                        className={`${uiState.modalLanguage === "ur" ? "ml-2" : "mr-2"}`}
                      />
                      <label htmlFor="showOnHome" className="text-sm font-medium" style={{
                        color: theme.colors.text.primary,
                        fontFamily: uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                        textAlign: uiState.modalLanguage === "ur" ? "right" : "left"
                      }}>
                        {uiState.modalLanguage === "en" ? "Show on Homepage" : "ہوم پیج پر دکھائیں"}
                      </label>
                      {validationState.homepageLimitError.en && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-800 text-sm" style={{
                            fontFamily: uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                            textAlign: uiState.modalLanguage === "ur" ? "right" : "left"
                          }}>
                            {validationState.homepageLimitError[uiState.modalLanguage]}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className={`${uiState.modalLanguage === "ur" ? "ml-2" : "mr-2"}`}
                      />
                      <label htmlFor="isActive" className="text-sm font-medium" style={{
                        color: theme.colors.text.primary,
                        fontFamily: uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                        textAlign: uiState.modalLanguage === "ur" ? "right" : "left"
                      }}>
                        {uiState.modalLanguage === "en" ? "Active" : "فعال"}
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{
                        color: theme.colors.text.primary,
                        fontFamily: uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                        textAlign: uiState.modalLanguage === "ur" ? "right" : "left"
                      }}>
                        {uiState.modalLanguage === "en" ? "Title" : "عنوان"} *
                      </label>
                      <input
                        type="text"
                        value={formData[uiState.modalLanguage].title.text}
                        onChange={(e) => handleTitleChange(e.target.value, uiState.modalLanguage)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                        style={{
                          fontFamily: uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                          textAlign: uiState.modalLanguage === "ur" ? "right" : "left",
                          direction: uiState.modalLanguage === "ur" ? "rtl" : "ltr",
                          borderColor: theme.colors.border.default,
                          backgroundColor: theme.colors.background.primary,
                          color: theme.colors.text.primary
                        }}
                        placeholder={uiState.modalLanguage === "en" ? "Enter event title..." : "ایونٹ کا عنوان درج کریں..."}
                        required
                      />
                      {validationState.missingFields.includes(`${uiState.modalLanguage}.title`) && (
                        <p className="text-red-500 text-sm mt-1">This field is required</p>
                      )}
                      {validationState.missingOppositeLang.includes(`${uiState.modalLanguage === "en" ? "ur" : "en"}.title`) && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-yellow-800 text-sm">
                            {uiState.modalLanguage === "en" ? "Urdu translation missing" : "English translation missing"}
                            <button
                              type="button"
                              onClick={() => {
                                const sourceLang = uiState.modalLanguage;
                                const targetLang = uiState.modalLanguage === "en" ? "ur" : "en";
                                setFormData({
                                  ...formData,
                                  [targetLang]: {
                                    ...formData[targetLang],
                                    title: { text: formData[sourceLang].title.text }
                                  }
                                });
                              }}
                              className="ml-2 text-blue-600 hover:text-blue-800 underline"
                            >
                              Copy from {uiState.modalLanguage === "en" ? "English" : "Urdu"}
                            </button>
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{
                        color: theme.colors.text.primary,
                        fontFamily: uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                        textAlign: uiState.modalLanguage === "ur" ? "right" : "left"
                      }}>
                        {uiState.modalLanguage === "en" ? "Slug" : "سلگ"}
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        disabled
                        className="w-full px-4 py-2 border rounded-lg cursor-not-allowed"
                        placeholder={uiState.modalLanguage === "en" ? "Auto-generated from English title" : "انگریزی عنوان سے خودکار طور پر بنایا گیا"}
                        style={{
                          fontFamily: theme.fonts.en.primary,
                          textAlign: "left",
                          direction: "ltr",
                          borderColor: theme.colors.border.default,
                          backgroundColor: theme.colors.background.secondary,
                          color: theme.colors.text.secondary
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{
                      color: theme.colors.text.primary,
                      fontFamily: uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                      textAlign: uiState.modalLanguage === "ur" ? "right" : "left"
                    }}>
                      {uiState.modalLanguage === "en" ? "Short Description" : "مختصر تفصیل"} *
                    </label>
                    <textarea
                      value={formData[uiState.modalLanguage].shortDescription.text}
                      onChange={(e) => setFormData({
                        ...formData,
                        [uiState.modalLanguage]: {
                          ...formData[uiState.modalLanguage],
                          shortDescription: {text: e.target.value}
                        }
                      })}
                      rows={3}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                      style={{
                        fontFamily: uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                        textAlign: uiState.modalLanguage === "ur" ? "right" : "left",
                        direction: uiState.modalLanguage === "ur" ? "rtl" : "ltr",
                        borderColor: theme.colors.border.default,
                        backgroundColor: theme.colors.background.primary,
                        color: theme.colors.text.primary
                      }}
                      placeholder={uiState.modalLanguage === "en" ? "Enter short description..." : "مختصر تفصیل درج کریں..."}
                      required
                    />
                    {validationState.missingFields.includes(`${uiState.modalLanguage}.shortDescription`) && (
                      <p className="text-red-500 text-sm mt-1">This field is required</p>
                    )}
                    {validationState.missingOppositeLang.includes(`${uiState.modalLanguage === "en" ? "ur" : "en"}.shortDescription`) && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          {uiState.modalLanguage === "en" ? "Urdu translation missing" : "English translation missing"}
                          <button
                            type="button"
                            onClick={() => {
                              const sourceLang = uiState.modalLanguage;
                              const targetLang = uiState.modalLanguage === "en" ? "ur" : "en";
                              setFormData({
                                ...formData,
                                [targetLang]: {
                                  ...formData[targetLang],
                                  shortDescription: { text: formData[sourceLang].shortDescription.text }
                                }
                              });
                            }}
                            className="ml-2 text-blue-600 hover:text-blue-800 underline"
                          >
                            Copy from {uiState.modalLanguage === "en" ? "English" : "Urdu"}
                          </button>
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{
                        color: theme.colors.text.primary,
                        fontFamily: uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                        textAlign: uiState.modalLanguage === "ur" ? "right" : "left"
                      }}>
                        {uiState.modalLanguage === "en" ? "Event Date" : "ایونٹ کی تاریخ"} *
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                        style={{
                          borderColor: theme.colors.border.default,
                          backgroundColor: theme.colors.background.primary,
                          color: theme.colors.text.primary
                        }}
                        required
                      />
                      {validationState.missingFields.includes("date") && (
                        <p className="text-red-500 text-sm mt-1">Event date is required</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{
                        color: theme.colors.text.primary,
                        fontFamily: uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                        textAlign: uiState.modalLanguage === "ur" ? "right" : "left"
                      }}>
                        {uiState.modalLanguage === "en" ? "Event Status" : "ایونٹ کی حالت"}
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as "upcoming" | "past"})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                        style={{
                          fontFamily: uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                          textAlign: uiState.modalLanguage === "ur" ? "right" : "left",
                          borderColor: theme.colors.border.default,
                          backgroundColor: theme.colors.background.primary,
                          color: theme.colors.text.primary
                        }}
                      >
                        <option value="upcoming">{uiState.modalLanguage === "en" ? "Upcoming" : "آنے والا"}</option>
                        <option value="past">{uiState.modalLanguage === "en" ? "Past" : "گزشتہ"}</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{
                        color: theme.colors.text.primary,
                        fontFamily: uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                        textAlign: uiState.modalLanguage === "ur" ? "right" : "left"
                      }}>
                        {uiState.modalLanguage === "en" ? "Location" : "مقام"} *
                      </label>
                      <input
                        type="text"
                        value={formData[uiState.modalLanguage].location.text}
                        onChange={(e) => setFormData({
                          ...formData,
                          [uiState.modalLanguage]: {
                            ...formData[uiState.modalLanguage],
                            location: {text: e.target.value}
                          }
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                        style={{
                          fontFamily: uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                          textAlign: uiState.modalLanguage === "ur" ? "right" : "left",
                          direction: uiState.modalLanguage === "ur" ? "rtl" : "ltr",
                          borderColor: theme.colors.border.default,
                          backgroundColor: theme.colors.background.primary,
                          color: theme.colors.text.primary
                        }}
                        placeholder={uiState.modalLanguage === "en" ? "Enter event location..." : "ایونٹ کا مقام درج کریں..."}
                        required
                      />
                      {validationState.missingFields.includes(`${uiState.modalLanguage}.location`) && (
                        <p className="text-red-500 text-sm mt-1">This field is required</p>
                      )}
                      {validationState.missingOppositeLang.includes(`${uiState.modalLanguage === "en" ? "ur" : "en"}.location`) && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-yellow-800 text-sm">
                            {uiState.modalLanguage === "en" ? "Urdu translation missing" : "English translation missing"}
                            <button
                              type="button"
                              onClick={() => {
                                const sourceLang = uiState.modalLanguage;
                                const targetLang = uiState.modalLanguage === "en" ? "ur" : "en";
                                setFormData({
                                  ...formData,
                                  [targetLang]: {
                                    ...formData[targetLang],
                                    location: { text: formData[sourceLang].location.text }
                                  }
                                });
                              }}
                              className="ml-2 text-blue-600 hover:text-blue-800 underline"
                            >
                              Copy from {uiState.modalLanguage === "en" ? "English" : "Urdu"}
                            </button>
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{
                        color: theme.colors.text.primary,
                        fontFamily: uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                        textAlign: uiState.modalLanguage === "ur" ? "right" : "left"
                      }}>
                        {uiState.modalLanguage === "en" ? "Time" : "وقت"}
                      </label>
                      <input
                        type="text"
                        value={formData[uiState.modalLanguage].time?.text || ""}
                        onChange={(e) => setFormData({
                          ...formData,
                          [uiState.modalLanguage]: {
                            ...formData[uiState.modalLanguage],
                            time: {text: e.target.value}
                          }
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                        style={{
                          fontFamily: uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                          textAlign: uiState.modalLanguage === "ur" ? "right" : "left",
                          direction: uiState.modalLanguage === "ur" ? "rtl" : "ltr",
                          borderColor: theme.colors.border.default,
                          backgroundColor: theme.colors.background.primary,
                          color: theme.colors.text.primary
                        }}
                        placeholder={uiState.modalLanguage === "en" ? "Enter event time..." : "ایونٹ کا وقت درج کریں..."}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{
                      color: theme.colors.text.primary,
                      fontFamily: uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                      textAlign: uiState.modalLanguage === "ur" ? "right" : "left"
                    }}>
                      {uiState.modalLanguage === "en" ? "Full Description" : "مکمل تفصیل"}
                    </label>
                    <textarea
                      value={formData[uiState.modalLanguage].fullDescription.text}
                      onChange={(e) => setFormData({
                        ...formData,
                        [uiState.modalLanguage]: {
                          ...formData[uiState.modalLanguage],
                          fullDescription: {text: e.target.value}
                        }
                      })}
                      rows={4}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                      style={{
                        fontFamily: uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                        textAlign: uiState.modalLanguage === "ur" ? "right" : "left",
                        direction: uiState.modalLanguage === "ur" ? "rtl" : "ltr",
                        borderColor: theme.colors.border.default,
                        backgroundColor: theme.colors.background.primary,
                        color: theme.colors.text.primary
                      }}
                      placeholder={uiState.modalLanguage === "en" ? "Enter full description..." : "مکمل تفصیل درج کریں..."}
                    />
                  </div>

                  <div>
                    <RichTextEditor
                      value={formData[uiState.modalLanguage].content.text}
                      onChange={(value) => setFormData({
                        ...formData,
                        [uiState.modalLanguage]: {
                          ...formData[uiState.modalLanguage],
                          content: {text: value}
                        }
                      })}
                      label={uiState.modalLanguage === "en" ? "Content" : "مواد"}
                      placeholder={uiState.modalLanguage === "en" ? "Enter event content..." : "ایونٹ کا مواد درج کریں..."}
                      height="400px"
                      fontFamily={uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary}
                      textAlign={uiState.modalLanguage === "ur" ? "right" : "left"}
                      direction={uiState.modalLanguage === "ur" ? "rtl" : "ltr"}
                      showPreview={true}
                      allowHtml={true}
                      toolbar={{
                        formatting: true,
                        lists: true,
                        links: true,
                        images: true,
                        alignment: true,
                        html: true,
                      }}
                    />
                  </div>

                  {formData.status === "past" && (
                    <div>
                      <RichTextEditor
                        value={formData[uiState.modalLanguage].outcome?.text || ""}
                        onChange={(value) => setFormData({
                          ...formData,
                          [uiState.modalLanguage]: {
                            ...formData[uiState.modalLanguage],
                            outcome: {text: value}
                          }
                        })}
                        label={uiState.modalLanguage === "en" ? "Event Outcome" : "ایونٹ کا نتیجہ"}
                        placeholder={uiState.modalLanguage === "en" ? "Enter event outcome..." : "ایونٹ کا نتیجہ درج کریں..."}
                        height="250px"
                        fontFamily={uiState.modalLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary}
                        textAlign={uiState.modalLanguage === "ur" ? "right" : "left"}
                        direction={uiState.modalLanguage === "ur" ? "rtl" : "ltr"}
                        showPreview={true}
                        allowHtml={true}
                        toolbar={{
                          formatting: true,
                          lists: true,
                          links: false,
                          images: false,
                          alignment: true,
                          html: false,
                        }}
                      />
                    </div>
                  )}


                </div>

                {/* Social Share Settings */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FiType className="w-5 h-5" style={{color: theme.colors.primary}} />
                    <h3 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                      Social Share Settings
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.primary}}>
                        Social Share Title *
                      </label>
                      <input
                        type="text"
                        value={formData.socialShare.title.text}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialShare: {
                            ...formData.socialShare,
                            title: {text: e.target.value}
                          }
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                        style={{
                          borderColor: theme.colors.border.default,
                          backgroundColor: theme.colors.background.primary,
                          color: theme.colors.text.primary
                        }}
                        placeholder="Enter social share title..."
                        required
                      />
                      {validationState.missingFields.includes("socialShare.title") && (
                        <p className="text-red-500 text-sm mt-1">This field is required</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.primary}}>
                        Social Share Description *
                      </label>
                      <textarea
                        value={formData.socialShare.description.text}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialShare: {
                            ...formData.socialShare,
                            description: {text: e.target.value}
                          }
                        })}
                        rows={3}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                        style={{
                          borderColor: theme.colors.border.default,
                          backgroundColor: theme.colors.background.primary,
                          color: theme.colors.text.primary
                        }}
                        placeholder="Enter social share description..."
                        required
                      />
                      {validationState.missingFields.includes("socialShare.description") && (
                        <p className="text-red-500 text-sm mt-1">This field is required</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.primary}}>
                        Hashtags (comma separated) *
                      </label>
                      <input
                        type="text"
                        value={formData.socialShare.hashtags.join(", ")}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialShare: {
                            ...formData.socialShare,
                            hashtags: e.target.value.split(",").map(tag => tag.trim()).filter(tag => tag)
                          }
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                        style={{
                          borderColor: theme.colors.border.default,
                          backgroundColor: theme.colors.background.primary,
                          color: theme.colors.text.primary
                        }}
                        placeholder="Enter hashtags separated by commas..."
                        required
                      />
                      {validationState.missingFields.includes("socialShare.hashtags") && (
                        <p className="text-red-500 text-sm mt-1">This field is required</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.primary}}>
                        Twitter Handle *
                      </label>
                      <input
                        type="text"
                        value={formData.socialShare.twitterHandle}
                        onChange={(e) => setFormData({
                          ...formData,
                          socialShare: {
                            ...formData.socialShare,
                            twitterHandle: e.target.value
                          }
                        })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-opacity-50"
                        style={{
                          borderColor: theme.colors.border.default,
                          backgroundColor: theme.colors.background.primary,
                          color: theme.colors.text.primary
                        }}
                        placeholder="@SECOPakistan"
                        required
                      />
                      {validationState.missingFields.includes("socialShare.twitterHandle") && (
                        <p className="text-red-500 text-sm mt-1">This field is required</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleEventCancel}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    style={{color: theme.colors.text.primary}}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                    style={{backgroundColor: theme.colors.primary, color: theme.colors.text.light}}
                  >
                    {isSubmitting ? "Saving..." : editingEvent ? "Update Event" : "Create Event"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
