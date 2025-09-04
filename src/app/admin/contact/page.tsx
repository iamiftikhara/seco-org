"use client";

import {useEffect, useState} from "react";
import DashboardLoader from "../components/DashboardLoader";
import Loader from "../components/Loader";
import AdminError from "../errors/error";
import { theme } from "@/config/theme";
import { FiEdit2, FiSave, FiX, FiPlus, FiTrash2, FiImage, FiType } from "react-icons/fi";
import ImageSelector from "../components/ImageSelector";
import IconSelector from "../components/IconSelector";

// Local types matching contact data
type Language = "en" | "ur";
type TranslatedText = Record<Language, string> | { en: { text: string }, ur: { text: string } };
interface ContactInfoItem {
  label: Record<Language, string>;
  value: string | Record<Language, string>;
  url: string;
  icon: string;
}
interface ContactFormField {
  label: Record<Language, string>;
  placeholder: Record<Language, string>;
}
interface ContactForm {
  title: Record<Language, string>;
  name: ContactFormField;
  email: ContactFormField;
  message: ContactFormField;
  submitButton: Record<Language, string>;
  successMessage: Record<Language, string>;
  errorMessage: Record<Language, string>;
  loadingMessage: Record<Language, string>;
}
interface SocialPlatform {
  label: Record<Language, string>;
  url: string;
  icon: string;
}
interface ContactData {
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  image?: string;
  contactInfo: Record<string, ContactInfoItem>;
  form: ContactForm;
  socialMedia: {
    title: Record<Language, string>;
    platforms: SocialPlatform[];
  };
}

export default function ContactAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [contactData, setContactData] = useState<ContactData | null>(null);

  // Section edit flags
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [isEditingContactInfo, setIsEditingContactInfo] = useState(false);
  const [isEditingSocial, setIsEditingSocial] = useState(false);
  const [isEditingForm, setIsEditingForm] = useState(false);

  const [originalPage, setOriginalPage] = useState<ContactData | null>(null);
  const [originalContactInfo, setOriginalContactInfo] = useState<Record<string, ContactInfoItem> | null>(null);
  const [originalSocial, setOriginalSocial] = useState<ContactData["socialMedia"] | null>(null);
  const [originalForm, setOriginalForm] = useState<ContactForm | null>(null);

  // Temp state for adding new contact info key
  const [newInfoKey, setNewInfoKey] = useState("");
  const emptyContactInfo: ContactInfoItem = { label: { en: "", ur: "" }, value: { en: "", ur: "" }, url: "", icon: "" };

  // Temp state for adding new social platform
  const emptyPlatform: SocialPlatform = { label: { en: "", ur: "" }, url: "", icon: "" };

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const res = await fetch('/api/admin/contact', { credentials: 'include' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json.success || !json.data) throw new Error(json.error || 'Failed to load contact');
        setContactData(json.data as ContactData);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('Failed to load contact'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getText = (value: TranslatedText, lang: Language): string => {
    if ((value as { en?: { text: string }, ur?: { text: string } })?.en?.text !== undefined) {
      const v = value as { en: { text: string }, ur: { text: string } };
      return lang === 'en' ? v.en.text : v.ur.text;
    }
    const v2 = value as Record<Language, string>;
    return v2[lang] || '';
  };

  const setText = (prev: any, path: string[], lang: Language, newValue: string) => {
    const draft = JSON.parse(JSON.stringify(prev)) as ContactData;
    let cursor: ContactData | ContactForm | Record<string, unknown> = draft;
    for (let i = 0; i < path.length - 1; i++) {
      cursor = (cursor as any)[path[i]];
    }
    const last = path[path.length - 1];
    const current = (cursor as any)[last];
    if (current?.en?.text !== undefined) {
      (cursor as any)[last][lang].text = newValue;
    } else {
      (cursor as any)[last][lang] = newValue;
    }
    return draft;
  };

  const saveAll = async () => {
    if (!contactData) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/contact', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ contactData })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePage = async () => { await saveAll(); setIsEditingPage(false); setOriginalPage(null); };
  const handleCancelPage = () => { if (originalPage) setContactData(originalPage); setOriginalPage(null); setIsEditingPage(false); };

  const handleSaveContactInfo = async () => { await saveAll(); setIsEditingContactInfo(false); setOriginalContactInfo(null); };
  const handleCancelContactInfo = () => { if (!contactData) return; if (originalContactInfo) setContactData({ ...contactData, contactInfo: originalContactInfo }); setOriginalContactInfo(null); setIsEditingContactInfo(false); };

  const handleSaveSocial = async () => { await saveAll(); setIsEditingSocial(false); setOriginalSocial(null); };
  const handleCancelSocial = () => { if (!contactData) return; if (originalSocial) setContactData({ ...contactData, socialMedia: originalSocial }); setOriginalSocial(null); setIsEditingSocial(false); };

  const handleSaveForm = async () => { await saveAll(); setIsEditingForm(false); setOriginalForm(null); };
  const handleCancelForm = () => { if (!contactData) return; if (originalForm) setContactData({ ...contactData, form: originalForm }); setOriginalForm(null); setIsEditingForm(false); };

  if (loading) return <DashboardLoader />;
  if (error) return <AdminError error={error} reset={() => window.location.reload()} />;
  if (!contactData) return null;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Loader isVisible={saving} text="Saving" />

      {/* Page Settings (Hero Image + Title/Subtitle) */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8" style={{backgroundColor: theme.colors.background.primary}}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (isEditingPage) handleSavePage();
          }}
          className="space-y-8"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold" style={{color: theme.colors.text.primary}}>Page Settings</h2>
            {!isEditingPage ? (
              <button type="button" onClick={() => { setOriginalPage(JSON.parse(JSON.stringify(contactData))); setIsEditingPage(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90" style={{backgroundColor: theme.colors.primary, color: theme.colors.text.light}}>
                <FiEdit2 className="w-4 h-4" /> Edit
              </button>
            ) : (
              <button type="button" onClick={handleCancelPage} className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:opacity-90" style={{backgroundColor: theme.colors.status.error, color: theme.colors.text.light}}>
                <FiX className="w-4 h-4" /> Cancel
              </button>
            )}
          </div>

          {!isEditingPage ? (
            <>
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <FiImage className="w-5 h-5" style={{color: theme.colors.primary}} />
                  <h3 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                    Logo/Image
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                      Hero Image
                    </label>
                    <div className="w-full h-48 rounded-lg border bg-gray-50 overflow-hidden" style={{borderColor: theme.colors.border.default}}>
                      {contactData.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={contactData.image} alt="Contact page hero" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No image selected</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <FiType className="w-5 h-5" style={{color: theme.colors.primary}} />
                  <h3 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                    Title & Description
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                      Title (English)
                    </label>
                    <div className="w-full p-3 rounded-lg border bg-gray-50" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, fontFamily: theme.fonts.en.primary}}>
                      {getText(contactData.title as Record<Language, string>, 'en') || <span className="text-gray-400 italic">No title</span>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                      Title (Urdu)
                    </label>
                    <div className="w-full p-3 rounded-lg border bg-gray-50" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right'}}>
                      {getText(contactData.title as Record<Language, string>, 'ur') || <span className="text-gray-400 italic">No title</span>}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                      Description (English)
                    </label>
                    <div className="w-full p-3 rounded-lg border bg-gray-50" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, fontFamily: theme.fonts.en.primary}}>
                      {getText(contactData.subtitle as Record<Language, string>, 'en') || <span className="text-gray-400 italic">No description</span>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                      Description (Urdu)
                    </label>
                    <div className="w-full p-3 rounded-lg border bg-gray-50" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right'}}>
                      {getText(contactData.subtitle as Record<Language, string>, 'ur') || <span className="text-gray-400 italic">No description</span>}
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
                  <h3 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                    Logo/Image
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                      Hero Image
                    </label>
                    <ImageSelector selectedPath={contactData.image || ""} onSelect={(imageUrl: string) => setContactData(prev => prev ? ({...prev, image: imageUrl}) : prev)} size="small" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <FiType className="w-5 h-5" style={{color: theme.colors.primary}} />
                  <h3 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>
                    Title & Description
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                      Title (English)
                    </label>
                    <input type="text" value={getText(contactData.title as Record<Language, string>, 'en')} onChange={(e) => setContactData((prev) => prev ? setText(prev, ['title'], 'en', e.target.value) : prev)} className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: 'white', fontFamily: theme.fonts.en.primary}} required />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                      Title (Urdu)
                    </label>
                    <input type="text" value={getText(contactData.title as Record<Language, string>, 'ur')} onChange={(e) => setContactData((prev) => prev ? setText(prev, ['title'], 'ur', e.target.value) : prev)} className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: 'white', fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right'}} required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                      Description (English)
                    </label>
                    <input type="text" value={getText(contactData.subtitle as Record<Language, string>, 'en')} onChange={(e) => setContactData((prev) => prev ? setText(prev, ['subtitle'], 'en', e.target.value) : prev)} className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: 'white', fontFamily: theme.fonts.en.primary}} required />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{color: theme.colors.text.secondary}}>
                      Description (Urdu)
                    </label>
                    <input type="text" value={getText(contactData.subtitle as Record<Language, string>, 'ur')} onChange={(e) => setContactData((prev) => prev ? setText(prev, ['subtitle'], 'ur', e.target.value) : prev)} className="w-full p-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-opacity-50" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: 'white', fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right'}} required />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t" style={{borderColor: theme.colors.border.default}}>
                <button type="submit" className="w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200 disabled:opacity-50 cursor-pointer" style={{backgroundColor: theme.colors.status.success, color: theme.colors.text.light}}>
                  <FiSave className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </>
          )}
        </form>
      </div>

      {/* Contact Info - Table */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8" style={{backgroundColor: theme.colors.background.primary}}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>Contact Info</h2>
          {!isEditingContactInfo ? (
            <button type="button" onClick={() => { setOriginalContactInfo(contactData.contactInfo); setIsEditingContactInfo(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90" style={{backgroundColor: theme.colors.primary, color: theme.colors.text.light}}>
              <FiEdit2 className="w-4 h-4" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button type="button" onClick={handleCancelContactInfo} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90" style={{backgroundColor: theme.colors.status.error, color: theme.colors.text.light}}>
                <FiX className="w-4 h-4" /> Cancel
              </button>
              <button type="button" onClick={handleSaveContactInfo} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90" style={{backgroundColor: theme.colors.secondary, color: theme.colors.text.primary}}>
                <FiSave className="w-4 h-4" /> Save
              </button>
            </div>
          )}
        </div>

        {isEditingContactInfo && (
          <div className="flex items-end gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.secondary}}>New Item Key (e.g., phone)</label>
              <input type="text" value={newInfoKey} onChange={(e) => setNewInfoKey(e.target.value)} className="w-full p-2 rounded-lg border" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary}} />
            </div>
            <button type="button" disabled={!newInfoKey} onClick={() => {
              if (!contactData) return;
              if (!newInfoKey.trim()) return;
              if (contactData.contactInfo[newInfoKey]) return;
              setContactData({ ...contactData, contactInfo: { ...contactData.contactInfo, [newInfoKey]: JSON.parse(JSON.stringify(emptyContactInfo)) } });
              setNewInfoKey("");
            }} className="flex items-center gap-2 px-4 py-2 rounded-lg disabled:opacity-50" style={{backgroundColor: theme.colors.primary, color: theme.colors.text.light}}>
              <FiPlus className="w-4 h-4" /> Add
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y" style={{ borderColor: theme.colors.border.default }}>
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color: theme.colors.text.secondary}}>Key</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color: theme.colors.text.secondary}}>Label (EN)</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color: theme.colors.text.secondary}}>Label (UR)</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color: theme.colors.text.secondary}}>Value (EN/Str)</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color: theme.colors.text.secondary}}>Value (UR)</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color: theme.colors.text.secondary}}>URL</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color: theme.colors.text.secondary}}>Icon</th>
                {isEditingContactInfo && <th className="px-4 py-2 text-right text-xs font-medium uppercase" style={{color: theme.colors.text.secondary}}>Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: theme.colors.border.default }}>
              {Object.entries(contactData.contactInfo).map(([key, item]) => (
                <tr key={key}>
                  <td className="px-4 py-2" style={{color: theme.colors.text.primary}}>{key}</td>
                  <td className="px-4 py-2"><input disabled={!isEditingContactInfo} type="text" value={item.label.en} onChange={(e) => setContactData(prev => { if (!prev) return prev; const draft = structuredClone(prev); draft.contactInfo[key].label.en = e.target.value; return draft; })} className="w-full p-2 rounded-lg border" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary}} /></td>
                  <td className="px-4 py-2"><input disabled={!isEditingContactInfo} type="text" value={item.label.ur} onChange={(e) => setContactData(prev => { if (!prev) return prev; const draft = structuredClone(prev); draft.contactInfo[key].label.ur = e.target.value; return draft; })} className="w-full p-2 rounded-lg border" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right'}} /></td>
                  <td className="px-4 py-2"><input disabled={!isEditingContactInfo} type="text" value={typeof item.value === 'string' ? item.value : (item.value.en || '')} onChange={(e) => setContactData(prev => { if (!prev) return prev; const draft = structuredClone(prev); if (typeof draft.contactInfo[key].value === 'string') { draft.contactInfo[key].value = e.target.value } else { (draft.contactInfo[key].value as any).en = e.target.value } return draft; })} className="w-full p-2 rounded-lg border" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary}} /></td>
                  <td className="px-4 py-2"><input disabled={!isEditingContactInfo} type="text" value={typeof item.value === 'string' ? '' : (item.value as any).ur || ''} onChange={(e) => setContactData(prev => { if (!prev) return prev; const draft = structuredClone(prev); if (typeof draft.contactInfo[key].value !== 'string') { (draft.contactInfo[key].value as any).ur = e.target.value } return draft; })} className="w-full p-2 rounded-lg border" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right'}} /></td>
                  <td className="px-4 py-2"><input disabled={!isEditingContactInfo} type="text" value={item.url} onChange={(e) => setContactData(prev => { if (!prev) return prev; const draft = structuredClone(prev); draft.contactInfo[key].url = e.target.value; return draft; })} className="w-full p-2 rounded-lg border" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary}} /></td>
                  <td className="px-4 py-2">
                    <IconSelector selectedIcon={item.icon} onSelect={(icon) => setContactData(prev => { if (!prev) return prev; const draft = structuredClone(prev); draft.contactInfo[key].icon = icon; return draft; })} size="small" disabled={!isEditingContactInfo} />
                  </td>
                  {isEditingContactInfo && (
                    <td className="px-4 py-2 text-right">
                      <button type="button" onClick={() => setContactData(prev => { if (!prev) return prev; const draft = structuredClone(prev); delete draft.contactInfo[key]; return draft; })} className="p-2 rounded-lg hover:bg-gray-100" style={{color: theme.colors.status.error}}>
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Social Media - Table */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8" style={{backgroundColor: theme.colors.background.primary}}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>Social Media</h2>
          {!isEditingSocial ? (
            <button type="button" onClick={() => { setOriginalSocial(contactData.socialMedia); setIsEditingSocial(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90" style={{backgroundColor: theme.colors.primary, color: theme.colors.text.light}}>
              <FiEdit2 className="w-4 h-4" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button type="button" onClick={handleCancelSocial} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90" style={{backgroundColor: theme.colors.status.error, color: theme.colors.text.light}}>
                <FiX className="w-4 h-4" /> Cancel
              </button>
              <button type="button" onClick={handleSaveSocial} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90" style={{backgroundColor: theme.colors.secondary, color: theme.colors.text.primary}}>
                <FiSave className="w-4 h-4" /> Save
              </button>
            </div>
          )}
        </div>

        {isEditingSocial && (
          <button type="button" onClick={() => setContactData(prev => { if (!prev) return prev; const draft = structuredClone(prev); draft.socialMedia.platforms.push(JSON.parse(JSON.stringify(emptyPlatform))); return draft; })} className="flex items-center gap-2 px-4 py-2 rounded-lg mb-4" style={{backgroundColor: theme.colors.primary, color: theme.colors.text.light}}>
            <FiPlus className="w-4 h-4" /> Add Platform
          </button>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y" style={{ borderColor: theme.colors.border.default }}>
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color: theme.colors.text.secondary}}>Label (EN)</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color: theme.colors.text.secondary}}>Label (UR)</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color: theme.colors.text.secondary}}>URL</th>
                <th className="px-4 py-2 text-left text-xs font-medium uppercase" style={{color: theme.colors.text.secondary}}>Icon</th>
                {isEditingSocial && <th className="px-4 py-2 text-right text-xs font-medium uppercase" style={{color: theme.colors.text.secondary}}>Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: theme.colors.border.default }}>
              {contactData.socialMedia.platforms.map((platform, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2"><input disabled={!isEditingSocial} type="text" value={platform.label.en} onChange={(e) => setContactData(prev => { if (!prev) return prev; const draft = structuredClone(prev); draft.socialMedia.platforms[idx].label.en = e.target.value; return draft; })} className="w-full p-2 rounded-lg border" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary}} /></td>
                  <td className="px-4 py-2"><input disabled={!isEditingSocial} type="text" value={platform.label.ur} onChange={(e) => setContactData(prev => { if (!prev) return prev; const draft = structuredClone(prev); draft.socialMedia.platforms[idx].label.ur = e.target.value; return draft; })} className="w-full p-2 rounded-lg border" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right'}} /></td>
                  <td className="px-4 py-2"><input disabled={!isEditingSocial} type="text" value={platform.url} onChange={(e) => setContactData(prev => { if (!prev) return prev; const draft = structuredClone(prev); draft.socialMedia.platforms[idx].url = e.target.value; return draft; })} className="w-full p-2 rounded-lg border" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary}} /></td>
                  <td className="px-4 py-2">
                    <IconSelector selectedIcon={platform.icon} onSelect={(icon) => setContactData(prev => { if (!prev) return prev; const draft = structuredClone(prev); draft.socialMedia.platforms[idx].icon = icon; return draft; })} size="small" disabled={!isEditingSocial} />
                  </td>
                  {isEditingSocial && (
                    <td className="px-4 py-2 text-right">
                      <button type="button" onClick={() => setContactData(prev => { if (!prev) return prev; const draft = structuredClone(prev); draft.socialMedia.platforms.splice(idx, 1); return draft; })} className="p-2 rounded-lg hover:bg-gray-100" style={{color: theme.colors.status.error}}>
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Settings */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8" style={{backgroundColor: theme.colors.background.primary}}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold" style={{color: theme.colors.text.primary}}>Form Settings</h2>
          {!isEditingForm ? (
            <button type="button" onClick={() => { if (contactData) setOriginalForm(JSON.parse(JSON.stringify(contactData.form))); setIsEditingForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90" style={{backgroundColor: theme.colors.primary, color: theme.colors.text.light}}>
              <FiEdit2 className="w-4 h-4" /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button type="button" onClick={handleCancelForm} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90" style={{backgroundColor: theme.colors.status.error, color: theme.colors.text.light}}>
                <FiX className="w-4 h-4" /> Cancel
              </button>
              <button type="button" onClick={handleSaveForm} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:opacity-90" style={{backgroundColor: theme.colors.secondary, color: theme.colors.text.primary}}>
                <FiSave className="w-4 h-4" /> Save
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {(['en','ur'] as Language[]).map(lang => (
            <div key={`form-title-${lang}`}>
              <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>Form Title ({lang.toUpperCase()})</label>
              <input disabled={!isEditingForm} type="text" value={contactData.form.title[lang]} onChange={(e) => setContactData(prev => { if (!prev) return prev; const draft = structuredClone(prev); draft.form.title[lang] = e.target.value; return draft; })} className="w-full p-3 rounded-lg border" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: lang === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary, direction: lang === 'ur' ? 'rtl' : 'ltr', textAlign: lang === 'ur' ? 'right' : 'left'}} />
            </div>
          ))}
        </div>

        {/* Fields: Name, Email, Message */}
        {(['name','email','message'] as Array<keyof ContactForm>).map((fieldKey) => (
          <div key={`field-${fieldKey}`} className="mb-6">
            <h3 className="text-lg font-semibold mb-3" style={{color: theme.colors.text.primary}}>{fieldKey.toString().toUpperCase()}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(['en','ur'] as Language[]).map(lang => (
                <div key={`${fieldKey}-label-${lang}`}>
                  <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>Label ({lang.toUpperCase()})</label>
                  <input disabled={!isEditingForm} type="text" value={(contactData.form[fieldKey] as ContactFormField).label[lang]} onChange={(e) => setContactData(prev => { if (!prev) return prev; const draft = structuredClone(prev); (draft.form[fieldKey] as ContactFormField).label[lang] = e.target.value; return draft; })} className="w-full p-3 rounded-lg border" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: lang === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary, direction: lang === 'ur' ? 'rtl' : 'ltr', textAlign: lang === 'ur' ? 'right' : 'left'}} />
                </div>
              ))}
              {(['en','ur'] as Language[]).map(lang => (
                <div key={`${fieldKey}-ph-${lang}`}>
                  <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>Placeholder ({lang.toUpperCase()})</label>
                  <input disabled={!isEditingForm} type="text" value={(contactData.form[fieldKey] as ContactFormField).placeholder[lang]} onChange={(e) => setContactData(prev => { if (!prev) return prev; const draft = structuredClone(prev); (draft.form[fieldKey] as ContactFormField).placeholder[lang] = e.target.value; return draft; })} className="w-full p-3 rounded-lg border" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: lang === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary, direction: lang === 'ur' ? 'rtl' : 'ltr', textAlign: lang === 'ur' ? 'right' : 'left'}} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Messages & Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(['submitButton','successMessage','errorMessage','loadingMessage'] as Array<keyof ContactForm>).map((keyName) => (
            <div key={`msg-${keyName}`}>
              <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.secondary}}>{keyName.toString()}</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(['en','ur'] as Language[]).map(lang => (
                  <input key={`${keyName}-${lang}`} disabled={!isEditingForm} type="text" value={(contactData.form[keyName] as Record<Language, string>)[lang]} onChange={(e) => setContactData(prev => { if (!prev) return prev; const draft = structuredClone(prev); (draft.form[keyName] as Record<Language, string>)[lang] = e.target.value; return draft; })} className="w-full p-3 rounded-lg border" style={{borderColor: theme.colors.border.default, color: theme.colors.text.primary, backgroundColor: theme.colors.background.primary, fontFamily: lang === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary, direction: lang === 'ur' ? 'rtl' : 'ltr', textAlign: lang === 'ur' ? 'right' : 'left'}} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
