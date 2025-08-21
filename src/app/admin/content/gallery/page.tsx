"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiEdit2, FiPlus, FiSave, FiTrash2, FiX, FiImage, FiType, FiSettings } from "react-icons/fi";
import { theme } from "@/config/theme";
import DashboardLoader from "@/app/admin/components/DashboardLoader";
import Loader from "@/app/admin/components/Loader";
import AdminError from "@/app/admin/errors/error";
import { showAlert, showConfirmDialog } from "@/utils/alert";
import ImageSelector from "@/app/admin/components/ImageSelector";
import type { GalleryConfig, GalleryHero, GalleryImage, GallerySection } from "@/types/gallery";

export default function GalleryAdmin() {
  const [data, setData] = useState<GalleryConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [heroDraft, setHeroDraft] = useState<GalleryHero | null>(null);
  const [isHeroEditing, setIsHeroEditing] = useState(false);
  const [heroForm, setHeroForm] = useState<GalleryHero | null>(null);

  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [sectionDraft, setSectionDraft] = useState<{ en: string; ur: string }>({ en: "", ur: "" });

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageDraft, setImageDraft] = useState<GalleryImage | null>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [imageSubmitAttempted, setImageSubmitAttempted] = useState(false);
  // Derive image form errors instead of setting state during render to avoid re-render loops
  const computeImageErrors = (img: GalleryImage | null) => {
    const errs: { src?: string; alt?: string; category?: string; tags?: string } = {};
    if (!img || !img.src) errs.src = 'Image is required';
    if (!img || !img.alt?.trim()) errs.alt = 'Alt text is required';
    if (!img || !img.category?.trim()) errs.category = 'Category is required';
    if (!img || !img.tags || img.tags.filter(t => t.trim()).length === 0) errs.tags = 'At least one tag is required';
    return errs;
  };
  const imageErrors = useMemo(() => computeImageErrors(imageDraft), [imageDraft]);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/gallery");
      if (!res.ok) {
        if ([401, 403, 404, 500].includes(res.status)) {
          setError(new Error(res.statusText));
          setIsLoading(false);
          return;
        }
      }
      const json = await res.json();
      if (json.success) {
        setData(json.data as GalleryConfig);
        setIsLoading(false);
      } else {
        setError(new Error(json.error || "Failed to load gallery"));
        setIsLoading(false);
      }
    } catch (e) {
      setError(e as Error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (data?.hero) {
      setHeroForm({ ...data.hero });
    }
  }, [data]);

  const openEditHero = () => {
    if (!data) return;
    setHeroDraft({ ...data.hero });
    setIsHeroModalOpen(true);
  };

  const saveHero = async () => {
    if (!heroDraft) return;
    try {
      setIsSaving(true);
      const res = await fetch("/api/admin/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateHero", hero: heroDraft }),
      });
      const json = await res.json();
      if (json.success) {
        showAlert({ title: "Success", text: "Hero saved", icon: "success" });
        setIsHeroModalOpen(false);
        setHeroDraft(null);
        fetchData();
      } else {
        showAlert({ title: "Error", text: json.error || "Failed to save hero", icon: "error" });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const startHeroEdit = () => {
    if (!data) return;
    setHeroForm({ ...data.hero });
    setIsHeroEditing(true);
  };

  const cancelHeroEdit = () => {
    setHeroForm(data ? { ...data.hero } : null);
    setIsHeroEditing(false);
  };

  const saveHeroInline = async () => {
    if (!heroForm) return;
    try {
      setIsSaving(true);
      const res = await fetch('/api/admin/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateHero', hero: heroForm })
      });
      const json = await res.json();
      if (json.success) {
        showAlert({ title: 'Success', text: 'Hero saved', icon: 'success' });
        setIsHeroEditing(false);
        fetchData();
      } else {
        showAlert({ title: 'Error', text: json.error || 'Failed to save hero', icon: 'error' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const openAddSection = () => {
    setSectionDraft({ en: "", ur: "" });
    setIsSectionModalOpen(true);
  };

  const saveSection = async () => {
    try {
      setIsSaving(true);
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addSection", section: { title: sectionDraft } }),
      });
      const json = await res.json();
      if (json.success) {
        showAlert({ title: "Success", text: "Section added", icon: "success" });
        setIsSectionModalOpen(false);
        fetchData();
      } else {
        showAlert({ title: "Error", text: json.error || "Failed to add section", icon: "error" });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const deleteSection = async (sectionIndex: number) => {
    const result = await showConfirmDialog({
      title: "Delete Section?",
      text: "Are you sure you want to delete this section?",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      icon: "warning",
      showCancelButton: true,
    });
    if (!result.isConfirmed) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/gallery?action=deleteSection&sectionIndex=${sectionIndex}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        showAlert({ title: "Success", text: "Section deleted", icon: "success" });
        fetchData();
      } else {
        showAlert({ title: "Error", text: json.error || "Failed to delete", icon: "error" });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const openAddImage = (sectionIndex: number) => {
    setActiveSectionIndex(sectionIndex);
    const draft: GalleryImage = { src: "", alt: "", tags: [], category: "", showOnHome: false };
    setImageDraft(draft);
    setImageSubmitAttempted(false);
    setIsImageModalOpen(true);
  };

  const openEditImage = (sectionIndex: number, imageIndex: number) => {
    if (!data) return;
    const img = data.sections[sectionIndex].images[imageIndex];
    setActiveSectionIndex(sectionIndex);
    setActiveImageIndex(imageIndex);
    setImageDraft({ ...img });
    setImageSubmitAttempted(false);
    setIsImageModalOpen(true);
  };

  const saveImage = async () => {
    if (activeSectionIndex === null || !imageDraft) return;
    setImageSubmitAttempted(true);
    if (Object.keys(imageErrors).length > 0) {
      showAlert({ title: 'Missing required fields', text: 'Please fill image, alt text, category and tags.', icon: 'error' });
      return;
    }
    try {
      setIsSaving(true);
      // If editing existing image
      if (activeImageIndex !== null) {
        const res = await fetch("/api/admin/gallery", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "updateImage", sectionIndex: activeSectionIndex, imageIndex: activeImageIndex, image: imageDraft }),
        });
        const json = await res.json();
        if (json.success) {
          showAlert({ title: "Success", text: "Image updated", icon: "success" });
          setIsImageModalOpen(false);
          setImageDraft(null);
          setActiveSectionIndex(null);
          setActiveImageIndex(null);
          fetchData();
        } else {
          showAlert({ title: "Error", text: json.error || "Failed to update image", icon: "error" });
        }
      } else {
        // Adding new image
        const res = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "addImage", sectionIndex: activeSectionIndex, image: imageDraft }),
        });
        const json = await res.json();
        if (json.success) {
          showAlert({ title: "Success", text: "Image added", icon: "success" });
          setIsImageModalOpen(false);
          setImageDraft(null);
          setActiveSectionIndex(null);
          fetchData();
        } else {
          showAlert({ title: "Error", text: json.error || "Failed to add image", icon: "error" });
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const deleteImage = async (sectionIndex: number, imageIndex: number) => {
    const result = await showConfirmDialog({
      title: "Delete Image?",
      text: "Are you sure you want to delete this image?",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      icon: "warning",
      showCancelButton: true,
    });
    if (!result.isConfirmed) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/gallery?action=deleteImage&sectionIndex=${sectionIndex}&imageIndex=${imageIndex}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        showAlert({ title: "Success", text: "Image deleted", icon: "success" });
        fetchData();
      } else {
        showAlert({ title: "Error", text: json.error || "Failed to delete", icon: "error" });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <DashboardLoader />;
  if (error) return <AdminError error={error} reset={() => { setError(null); setIsLoading(true); fetchData(); }} />;
  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Loader isVisible={isSaving} text="Saving" />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold" style={{ color: theme.colors.text.primary }}>Manage Gallery</h1>
        <div className="flex gap-2">
          <button
            onClick={openAddSection}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: theme.colors.primary, color: theme.colors.text.light }}
          >
            <FiPlus className="w-4 h-4" />
            Add Section
          </button>
          <button
            onClick={startHeroEdit}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: theme.colors.primary, color: theme.colors.text.light }}
          >
            <FiSettings className="w-4 h-4" />
            Edit Hero
          </button>
        </div>
      </div>

      {/* Hero Inline Panel */}
      {heroForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8" style={{ backgroundColor: theme.colors.background.primary }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold" style={{ color: theme.colors.text.primary }}>Hero</h2>
            {!isHeroEditing ? (
              <button
                onClick={startHeroEdit}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: theme.colors.primary, color: theme.colors.text.light }}
              >
                <FiEdit2 className="w-4 h-4" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={cancelHeroEdit}
                  className="px-4 py-2 rounded-lg transition-colors duration-200"
                  style={{ backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveHeroInline}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200"
                  style={{ backgroundColor: theme.colors.primary, color: theme.colors.text.light }}
                >
                  <FiSave className="w-4 h-4" /> Save Changes
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>Hero Image</label>
              {isHeroEditing ? (
                <ImageSelector
                  selectedPath={heroForm.image}
                  onSelect={(path) => setHeroForm({ ...heroForm, image: path })}
                  className="w-full"
                  size="small"
                />
              ) : (
                <div className="relative w-full pt-[56%] rounded-lg overflow-hidden bg-gray-100">
                  {heroForm.image && (
                    <img src={heroForm.image} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                </div>
              )}
            </div>
            <div className="md:col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>Title (EN)</label>
                  <input
                    type="text"
                    value={heroForm.title.en}
                    onChange={(e) => setHeroForm({ ...heroForm, title: { ...heroForm.title, en: e.target.value } })}
                    disabled={!isHeroEditing}
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 disabled:opacity-70"
                    style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts.en.primary }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>Title (UR)</label>
                  <input
                    type="text"
                    value={heroForm.title.ur}
                    onChange={(e) => setHeroForm({ ...heroForm, title: { ...heroForm.title, ur: e.target.value } })}
                    disabled={!isHeroEditing}
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 disabled:opacity-70"
                    style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>Description (EN)</label>
                  <textarea
                    value={heroForm.description.en}
                    onChange={(e) => setHeroForm({ ...heroForm, description: { ...heroForm.description, en: e.target.value } })}
                    disabled={!isHeroEditing}
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 disabled:opacity-70"
                    style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts.en.primary }}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>Description (UR)</label>
                  <textarea
                    value={heroForm.description.ur}
                    onChange={(e) => setHeroForm({ ...heroForm, description: { ...heroForm.description, ur: e.target.value } })}
                    disabled={!isHeroEditing}
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50 disabled:opacity-70"
                    style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sections Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: theme.colors.background.primary }}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y" style={{ borderColor: theme.colors.border.default }}>
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts.en.primary }}>Section Title (EN)</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts.en.primary }}>Section Title (UR)</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts.en.primary }}>Images</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: theme.colors.text.secondary, fontFamily: theme.fonts.en.primary }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: theme.colors.border.default }}>
              {data.sections.map((section, sIndex) => (
                <tr key={sIndex} className="hover:bg-gray-50" style={{ backgroundColor: theme.colors.background.secondary }}>
                  <td className="px-6 py-4" style={{ color: theme.colors.text.primary, fontFamily: theme.fonts.en.primary }}>{section.title.en}</td>
                  <td className="px-6 py-4" style={{ color: theme.colors.text.primary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }}>{section.title.ur}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {section.images.map((img, iIndex) => (
                        <div key={iIndex} className="relative w-16 h-16 rounded-lg overflow-hidden group">
                          <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditImage(sIndex, iIndex)}
                              className="p-1 rounded bg-white/90"
                              title="Edit"
                              style={{ color: theme.colors.text.primary }}
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteImage(sIndex, iIndex)}
                              className="p-1 rounded bg-white/90"
                              title="Delete"
                              style={{ color: theme.colors.status.error }}
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => openAddImage(sIndex)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg border text-sm"
                        style={{ borderColor: theme.colors.border.default, color: theme.colors.primary }}
                      >
                        <FiPlus className="w-4 h-4" /> Add Image
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={async () => {
                          const result = await showConfirmDialog({
                            title: 'Edit Section?',
                            text: 'Are you sure you want to edit this section? ',
                            confirmButtonText: 'Edit',
                            cancelButtonText: 'Cancel',
                            icon: 'warning',
                            showCancelButton: true,
                          });
                          if (!result.isConfirmed) return;
                          setActiveSectionIndex(sIndex);
                          setSectionDraft({ ...section.title });
                          setIsSectionModalOpen(true);
                        }}
                        className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 cursor-pointer"
                        style={{ color: theme.colors.primary }}
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSection(sIndex)}
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

      {/* Hero Modal */}
      {isHeroModalOpen && heroDraft && (
        <div className="fixed inset-0 bg-[#61616167] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl" style={{ backgroundColor: theme.colors.background.primary }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>Edit Hero</h2>
              <button onClick={() => { setIsHeroModalOpen(false); setHeroDraft(null); }} className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <FiX className="w-5 h-5" style={{ color: theme.colors.text.secondary }} />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>Hero Image</label>
                <ImageSelector selectedPath={heroDraft.image} onSelect={(path) => setHeroDraft({ ...heroDraft, image: path })} className="w-full" size="small" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text.sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>Title (EN)</label>
                  <input
                    type="text"
                    value={heroDraft.title.en}
                    onChange={(e) => setHeroDraft({ ...heroDraft, title: { ...heroDraft.title, en: e.target.value } })}
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                    style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts.en.primary }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>Title (UR)</label>
                  <input
                    type="text"
                    value={heroDraft.title.ur}
                    onChange={(e) => setHeroDraft({ ...heroDraft, title: { ...heroDraft.title, ur: e.target.value } })}
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                    style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>Description (EN)</label>
                  <textarea
                    value={heroDraft.description.en}
                    onChange={(e) => setHeroDraft({ ...heroDraft, description: { ...heroDraft.description, en: e.target.value } })}
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                    style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts.en.primary }}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>Description (UR)</label>
                  <textarea
                    value={heroDraft.description.ur}
                    onChange={(e) => setHeroDraft({ ...heroDraft, description: { ...heroDraft.description, ur: e.target.value } })}
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                    style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }}
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={() => { setIsHeroModalOpen(false); setHeroDraft(null); }} className="px-4 py-2 rounded-lg transition-colors duration-200" style={{ backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary }}>Cancel</button>
              <button onClick={saveHero} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200" style={{ backgroundColor: theme.colors.primary, color: theme.colors.text.light }}>
                <FiSave className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Modal */}
      {isSectionModalOpen && (
        <div className="fixed inset-0 bg-[#61616167] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl" style={{ backgroundColor: theme.colors.background.primary }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>Edit Section</h2>
              <button onClick={() => { setIsSectionModalOpen(false); setActiveSectionIndex(null); }} className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <FiX className="w-5 h-5" style={{ color: theme.colors.text.secondary }} />
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>Title (EN)</label>
                  <input
                    type="text"
                    value={sectionDraft.en}
                    onChange={(e) => setSectionDraft({ ...sectionDraft, en: e.target.value })}
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                    style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts.en.primary }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>Title (UR)</label>
                  <input
                    type="text"
                    value={sectionDraft.ur}
                    onChange={(e) => setSectionDraft({ ...sectionDraft, ur: e.target.value })}
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                    style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={() => { setIsSectionModalOpen(false); setActiveSectionIndex(null); }} className="px-4 py-2 rounded-lg transition-colors duration-200" style={{ backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary }}>Cancel</button>
              <button
                onClick={async () => {
                  setIsSaving(true);
                  try {
                    let res: Response;
                    if (activeSectionIndex === null) {
                      res = await fetch('/api/admin/gallery', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'addSection', section: { title: sectionDraft } })
                      });
                    } else {
                      res = await fetch('/api/admin/gallery', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'updateSection', sectionIndex: activeSectionIndex, section: { title: sectionDraft } })
                      });
                    }
                    const json = await res.json();
                    if (json.success) {
                      showAlert({ title: 'Success', text: 'Section saved', icon: 'success' });
                      setIsSectionModalOpen(false);
                      setActiveSectionIndex(null);
                      fetchData();
                    } else {
                      showAlert({ title: 'Error', text: json.error || 'Failed to save section', icon: 'error' });
                    }
                  } finally {
                    setIsSaving(false);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200"
                style={{ backgroundColor: theme.colors.primary, color: theme.colors.text.light }}
              >
                <FiSave className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {isImageModalOpen && imageDraft && (
        <div className="fixed inset-0 bg-[#61616167] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl" style={{ backgroundColor: theme.colors.background.primary }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold" style={{ color: theme.colors.text.primary }}>{activeImageIndex !== null ? 'Edit Image' : 'Add Image'}</h2>
              <button onClick={() => { setIsImageModalOpen(false); setImageDraft(null); setActiveSectionIndex(null); setActiveImageIndex(null); }} className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <FiX className="w-5 h-5" style={{ color: theme.colors.text.secondary }} />
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                  Image <span style={{ color: theme.colors.status.error }}>*</span>
                </label>
                <ImageSelector selectedPath={imageDraft.src} onSelect={(path) => { const next = { ...imageDraft, src: path }; setImageDraft(next); }} className="w-full" size="small" />
                {imageSubmitAttempted && imageErrors.src && <p className="text-xs mt-1" style={{ color: theme.colors.status.error }}>{imageErrors.src}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                    Alt Text <span style={{ color: theme.colors.status.error }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={imageDraft.alt}
                    onChange={(e) => { const next = { ...imageDraft, alt: e.target.value }; setImageDraft(next); }}
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                    style={{ borderColor: imageSubmitAttempted && imageErrors.alt ? theme.colors.status.error : theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts.en.primary }}
                  />
                  {imageSubmitAttempted && imageErrors.alt && <p className="text-xs mt-1" style={{ color: theme.colors.status.error }}>{imageErrors.alt}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                    Category <span style={{ color: theme.colors.status.error }}>*</span>
                  </label>
                  <select
                    value={imageDraft.category}
                    onChange={(e) => { const next = { ...imageDraft, category: e.target.value }; setImageDraft(next); }}
                    className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                    style={{ borderColor: imageSubmitAttempted && imageErrors.category ? theme.colors.status.error : theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts.en.primary }}
                  >
                    <option value="">Select category</option>
                    <option value="events">Events</option>
                    <option value="education">Education</option>
                    <option value="support">Support</option>
                    <option value="programs">Programs</option>
                    <option value="services">Services</option>
                    <option value="community">Community</option>
                    <option value="health">Health</option>
                    <option value="other">Other</option>
                  </select>
                  {imageSubmitAttempted && imageErrors.category && <p className="text-xs mt-1" style={{ color: theme.colors.status.error }}>{imageErrors.category}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.secondary }}>
                  Tags (comma separated) <span style={{ color: theme.colors.status.error }}>*</span>
                </label>
                <input
                  type="text"
                  value={imageDraft.tags.join(', ')}
                  onChange={(e) => { const next = { ...imageDraft, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }; setImageDraft(next); }}
                  className="w-full p-2 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50"
                  style={{ borderColor: imageSubmitAttempted && imageErrors.tags ? theme.colors.status.error : theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts.en.primary }}
                />
                {imageSubmitAttempted && imageErrors.tags && <p className="text-xs mt-1" style={{ color: theme.colors.status.error }}>{imageErrors.tags}</p>}
              </div>
              <div className="flex items-center gap-2">
                <input id="showOnHome" type="checkbox" checked={!!imageDraft.showOnHome} onChange={(e) => setImageDraft({ ...imageDraft, showOnHome: e.target.checked })} />
                <label htmlFor="showOnHome" className="text-sm" style={{ color: theme.colors.text.primary }}>Show on Home</label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button onClick={() => { setIsImageModalOpen(false); setImageDraft(null); setActiveSectionIndex(null); setActiveImageIndex(null); }} className="px-4 py-2 rounded-lg transition-colors duration-200" style={{ backgroundColor: theme.colors.background.secondary, color: theme.colors.text.primary }}>Cancel</button>
              <button onClick={saveImage} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200" style={{ backgroundColor: theme.colors.primary, color: theme.colors.text.light }}>
                <FiSave className="w-4 h-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
