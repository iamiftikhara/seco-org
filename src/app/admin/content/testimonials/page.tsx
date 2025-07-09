"use client";

import React, {useEffect, useState, useCallback} from "react";
import {FiEdit2, FiSave, FiX, FiImage, FiType, FiPlus, FiTrash2, FiSettings} from "react-icons/fi";
import {showAlert, showConfirmDialog} from "@/utils/alert";
import ImageSelector from "@/app/admin/components/ImageSelector";
import Loader from "../../components/Loader";
import DashboardLoader from "../../components/DashboardLoader";
import {theme} from "@/config/theme";
import {handle403Response} from "@/app/admin/errors/error403";
import {useRouter} from "next/navigation";
import type {TestimonialsData} from "@/types/testimonials";
import AdminError from "@/app/admin/errors/error";

interface TestimonialFormData {
  id?: number;
  image: string;
  author: {en: string; ur: string};
  role: {en: string; ur: string};
  quote: {en: string; ur: string};
}

interface ConfigFormData {
  autoplayDelay: number;
  spaceBetween: number;
  breakpoints: {
    [key: number]: {
      slidesPerView: number;
    };
  };
}

export default function TestimonialsSection() {
  const [formData, setFormData] = useState<TestimonialsData | null>(null);
  const [originalData, setOriginalData] = useState<TestimonialsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialFormData | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<ConfigFormData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const handleErrorResponse = async (response: Response, identifier: string = "default") => {
    setIsLoading(false);
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
  };

  const fetchTestimonialsData = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/testimonials");
      const data = await response.json();
      if (data.success) {
        setFormData(data.data);
        setOriginalData(data.data);
        setIsLoading(false);
      } else {
        handleErrorResponse(response, "get");
      }
    } catch (error) {
      handleErrorResponse(error as Response, "get");
    }
  }, [router, handleErrorResponse]);

  useEffect(() => {
    fetchTestimonialsData();
  }, [fetchTestimonialsData]);

  const handleAddTestimonial = () => {
    if (!formData) return;

    const newId = formData.items.length > 0 ? Math.max(...formData.items.map((t) => t.id || 0)) + 1 : 1;

    const newTestimonial: TestimonialFormData = {
      id: newId,
      image: "",
      author: {en: "", ur: ""},
      role: {en: "", ur: ""},
      quote: {en: "", ur: ""},
    };
    setSelectedTestimonial(newTestimonial);
    setIsModalOpen(true);
    setHasChanges(false);
  };

  const handleEditTestimonial = async (index: number) => {
    if (!formData) return;

    const result = await showConfirmDialog({
      title: "Edit Testimonial?",
      text: "Are you sure you want to edit this testimonial?",
      confirmButtonText: "Edit",
      cancelButtonText: "Cancel",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      const testimonial = formData.items[index];
      const typedTestimonial: TestimonialFormData = {
        id: testimonial.id,
        image: testimonial.image,
        author: testimonial.author,
        role: testimonial.role,
        quote: testimonial.quote,
      };
      setSelectedTestimonial(typedTestimonial);
      setIsModalOpen(true);
      setHasChanges(false);
    }
  };

  const handleDeleteTestimonial = async (index: number) => {
    if (!formData) return;

    // Check if this is the last testimonial
    if (formData.items.length <= 1) {
      showAlert({
        title: "Cannot Delete",
        text: "At least one testimonial must remain.",
        icon: "warning",
      });
      return;
    }

    const result = await showConfirmDialog({
      title: "Delete Testimonial?",
      text: "Are you sure you want to delete this testimonial? This action cannot be undone.",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      try {
        setIsSaving(true);
        const testimonial = formData.items[index];

        if (!testimonial.id) {
          showAlert({
            title: "Error",
            text: "Invalid testimonial ID",
            icon: "error",
          });
          return;
        }

        const response = await fetch(`/api/admin/testimonials?id=${testimonial.id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          showAlert({
            title: "Success",
            text: "Testimonial deleted successfully!",
            icon: "success",
          });
          fetchTestimonialsData();
        } else {
          handleErrorResponse(response);
        }
      } catch (error) {
        showAlert({
          title: "Error",
          text: "Failed to delete testimonial",
          icon: "error",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSaveTestimonial = async () => {
    if (!formData || !selectedTestimonial) return;

    try {
      setIsSaving(true);
      const newTestimonials = [...formData.items];
      const existingIndex = newTestimonials.findIndex((testimonial) => testimonial.id === selectedTestimonial.id);

      let response;
      if (existingIndex >= 0) {
        // Update existing testimonial
        response = await fetch("/api/admin/testimonials", {
          method: "PUT",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            id: selectedTestimonial.id,
            testimonial: {
              id: selectedTestimonial.id,
              image: selectedTestimonial.image,
              author: selectedTestimonial.author,
              role: selectedTestimonial.role,
              quote: selectedTestimonial.quote,
            },
          }),
        });
      } else {
        // Add new testimonial
        response = await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            testimonial: selectedTestimonial,
          }),
        });
      }

      const data = await response.json();

      if (data.success) {
        showAlert({
          title: "Success",
          text: "Testimonial saved successfully!",
          icon: "success",
        });
        setIsModalOpen(false);
        setSelectedTestimonial(null);
        setHasChanges(false);
        fetchTestimonialsData();
      } else {
        handleErrorResponse(response);
      }
    } catch (error) {
      showAlert({
        title: "Error",
        text: "Failed to save testimonial",
        icon: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestimonialChange = (field: keyof TestimonialFormData, value: string | {en: string; ur: string}) => {
    if (!selectedTestimonial) return;

    const updatedTestimonial = {
      ...selectedTestimonial,
      [field]: value,
    };
    setSelectedTestimonial(updatedTestimonial);
    setHasChanges(true);
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
      const response = await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          config: selectedConfig,
        }),
      });

      const data = await response.json();

      if (data.success) {
        showAlert({
          title: "Success",
          text: "Configuration saved successfully!",
          icon: "success",
        });
        setIsConfigModalOpen(false);
        setSelectedConfig(null);
        setHasChanges(false);
        fetchTestimonialsData();
      } else {
        handleErrorResponse(response);
      }
    } catch (error) {
      showAlert({
        title: "Error",
        text: "Failed to save configuration",
        icon: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfigChange = (field: string, value: number | {[key: number]: {slidesPerView: number; spaceBetween: number}}) => {
    if (!selectedConfig) return;

    const updatedConfig = {
      ...selectedConfig,
      [field]: value,
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
          fetchTestimonialsData();
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
        <h1 className="text-3xl font-bold" style={{color: theme.colors.text.primary}}>
          Manage Testimonials
        </h1>
        <button
          onClick={handleAddTestimonial}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
          style={{
            backgroundColor: theme.colors.primary,
            color: theme.colors.text.light,
          }}
        >
          <FiPlus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{backgroundColor: theme.colors.background.primary}}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y" style={{borderColor: theme.colors.border.default}}>
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
                  Author (EN)
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: theme.colors.text.secondary,
                    fontFamily: theme.fonts.en.primary,
                  }}
                >
                  Author (UR)
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: theme.colors.text.secondary,
                    fontFamily: theme.fonts.en.primary,
                  }}
                >
                  Role (EN)
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{
                    color: theme.colors.text.secondary,
                    fontFamily: theme.fonts.en.primary,
                  }}
                >
                  Role (UR)
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
            <tbody className="divide-y" style={{borderColor: theme.colors.border.default}}>
              {formData.items.map((testimonial, index) => (
                <tr key={index} className="hover:bg-gray-50" style={{backgroundColor: theme.colors.background.secondary}}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <img src={testimonial.image} alt={`Testimonial ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{color: theme.colors.text.primary}}>
                    <div className="max-w-[180px] truncate" title={testimonial.author.en} style={{fontFamily: theme.fonts.en.primary}}>
                      {testimonial.author.en}
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{color: theme.colors.text.primary}}>
                    <div
                      className="max-w-[180px] truncate"
                      title={testimonial.author.ur}
                      style={{
                        fontFamily: theme.fonts.ur.primary,
                        direction: "rtl",
                        textAlign: "right",
                      }}
                    >
                      {testimonial.author.ur}
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{color: theme.colors.text.primary}}>
                    <div className="max-w-[180px] truncate" title={testimonial.role.en} style={{fontFamily: theme.fonts.en.primary}}>
                      {testimonial.role.en}
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{color: theme.colors.text.primary}}>
                    <div
                      className="max-w-[180px] truncate"
                      title={testimonial.role.ur}
                      style={{
                        fontFamily: theme.fonts.ur.primary,
                        direction: "rtl",
                        textAlign: "right",
                      }}
                    >
                      {testimonial.role.ur}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEditTestimonial(index)} title="Click to edit." className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer" style={{color: theme.colors.primary}}>
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(index)}
                        title={formData.items.length <= 1 ? "Cannot delete the last testimonial" : "Click to delete."}
                        disabled={formData.items.length <= 1}
                        className={`p-2 rounded-lg transition-colors duration-200 ${formData.items.length <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 cursor-pointer"}`}
                        style={{
                          color: formData.items.length <= 1 ? theme.colors.text.secondary : theme.colors.status.error,
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
      {isModalOpen && selectedTestimonial && (
        <div className="fixed inset-0 bg-[#61616167] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl" style={{backgroundColor: theme.colors.background.primary}}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{color: theme.colors.text.primary}}>
                {selectedTestimonial.image ? "Edit Testimonial" : "Add New Testimonial"}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedTestimonial(null);
                  setHasChanges(false);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <FiX className="w-5 h-5" style={{color: theme.colors.text.secondary}} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                  Image
                </label>
                <ImageSelector selectedPath={selectedTestimonial.image} onSelect={(path) => handleTestimonialChange("image", path)} className="w-full" size="small" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                    Author (English)
                  </label>
                  <input
                    type="text"
                    value={selectedTestimonial.author.en}
                    onChange={(e) => handleTestimonialChange("author", {...selectedTestimonial.author, en: e.target.value})}
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
                  <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                    Author (Urdu)
                  </label>
                  <input
                    type="text"
                    value={selectedTestimonial.author.ur}
                    onChange={(e) => handleTestimonialChange("author", {...selectedTestimonial.author, ur: e.target.value})}
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                    style={{
                      borderColor: theme.colors.border.default,
                      color: theme.colors.text.primary,
                      backgroundColor: theme.colors.background.primary,
                      fontFamily: theme.fonts.ur.primary,
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                    Role (English)
                  </label>
                  <input
                    type="text"
                    value={selectedTestimonial.role.en}
                    onChange={(e) => handleTestimonialChange("role", {...selectedTestimonial.role, en: e.target.value})}
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
                  <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                    Role (Urdu)
                  </label>
                  <input
                    type="text"
                    value={selectedTestimonial.role.ur}
                    onChange={(e) => handleTestimonialChange("role", {...selectedTestimonial.role, ur: e.target.value})}
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                    style={{
                      borderColor: theme.colors.border.default,
                      color: theme.colors.text.primary,
                      backgroundColor: theme.colors.background.primary,
                      fontFamily: theme.fonts.ur.primary,
                      direction: "rtl",
                      textAlign: "right",
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                    Quote (English)
                  </label>
                  <textarea
                    value={selectedTestimonial.quote.en}
                    onChange={(e) => handleTestimonialChange("quote", {...selectedTestimonial.quote, en: e.target.value})}
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                    style={{
                      borderColor: theme.colors.border.default,
                      color: theme.colors.text.primary,
                      backgroundColor: theme.colors.background.primary,
                      fontFamily: theme.fonts.en.primary,
                    }}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                    Quote (Urdu)
                  </label>
                  <textarea
                    value={selectedTestimonial.quote.ur}
                    onChange={(e) => handleTestimonialChange("quote", {...selectedTestimonial.quote, ur: e.target.value})}
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                    style={{
                      borderColor: theme.colors.border.default,
                      color: theme.colors.text.primary,
                      backgroundColor: theme.colors.background.primary,
                      fontFamily: theme.fonts.ur.primary,
                      direction: "rtl",
                      textAlign: "right",
                    }}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedTestimonial(null);
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
                onClick={handleSaveTestimonial}
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

      {/* Config Section */}
      <div className="mb-12 mt-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold" style={{color: theme.colors.text.primary}}>
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

        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6" style={{backgroundColor: theme.colors.background.primary}}>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{color: theme.colors.text.primary}}>
                Slider Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                    Autoplay Delay (ms)
                  </label>
                  <div className="text-sm" style={{color: theme.colors.text.primary}}>
                    {formData.config.autoplayDelay}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                    Space Between
                  </label>
                  <div className="text-sm" style={{color: theme.colors.text.primary}}>
                    {formData.config.spaceBetween}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{color: theme.colors.text.primary}}>
                Breakpoints
              </h3>
              <div className="space-y-4">
                {Object.entries(formData.config.breakpoints).map(([breakpoint, settings]) => (
                  <div key={breakpoint}>
                    <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                      {breakpoint}px
                    </label>
                    <div className="text-sm" style={{color: theme.colors.text.primary}}>
                      Slides per view: {settings.slidesPerView}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Config Modal */}
      {isConfigModalOpen && selectedConfig && (
        <div className="fixed inset-0 bg-[#61616167] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl" style={{backgroundColor: theme.colors.background.primary}}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{color: theme.colors.text.primary}}>
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
                <FiX className="w-5 h-5" style={{color: theme.colors.text.secondary}} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4" style={{color: theme.colors.text.primary}}>
                  Slider Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                      Autoplay Delay (ms)
                    </label>
                    <input
                      type="number"
                      value={selectedConfig.autoplayDelay}
                      onChange={(e) => handleConfigChange("autoplayDelay", parseInt(e.target.value))}
                      className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                      style={{
                        borderColor: theme.colors.border.default,
                        color: theme.colors.text.primary,
                        backgroundColor: theme.colors.background.primary,
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                      Space Between
                    </label>
                    <input
                      type="number"
                      value={selectedConfig.spaceBetween}
                      onChange={(e) => handleConfigChange("spaceBetween", parseInt(e.target.value))}
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

              <div>
                <h3 className="text-lg font-semibold mb-4" style={{color: theme.colors.text.primary}}>
                  Breakpoints
                </h3>
                <div className="space-y-4">
                  {Object.entries(selectedConfig.breakpoints).map(([breakpoint, settings]) => (
                    <div key={breakpoint} className="p-4 border rounded-lg" style={{borderColor: theme.colors.border.default}}>
                      <h4 className="font-medium mb-2" style={{color: theme.colors.text.primary}}>
                        {breakpoint}px
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>
                            Slides per view
                          </label>
                          <input
                            type="number"
                            value={settings.slidesPerView}
                            onChange={(e) => {
                              const newBreakpoints = {
                                ...selectedConfig.breakpoints,
                                [breakpoint]: {
                                  slidesPerView: parseInt(e.target.value),
                                },
                              };
                              handleConfigChange("breakpoints", newBreakpoints);
                            }}
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
                  ))}
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
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
