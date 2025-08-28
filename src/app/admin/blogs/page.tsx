"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { theme } from "@/config/theme";
import DashboardLoader from "../components/DashboardLoader";
import Loader from "../components/Loader";
import AdminError from "../errors/error";
import ImageSelector from "../components/ImageSelector";
import RichTextEditor from "../components/RichTextEditor";
import { FiEdit2, FiSave, FiX, FiChevronUp, FiChevronDown, FiEdit, FiTrash2, FiCalendar } from "react-icons/fi";
import { FaPlus, FaEdit, FaTrash, FaEye, FaTimes, FaQuoteRight, FaHome } from "react-icons/fa";
import { showAlert, showConfirmDialog } from "@/utils/alert";

type LocalizedString = { en: string; ur: string };

interface AdminBlogPage {
  blogPage: {
    heroImage: string;
    title: LocalizedString;
    description: LocalizedString;
    pageTitle: LocalizedString;
    pageDescription: LocalizedString;
  } | null;
  posts: any[];
}

export default function BlogsAdmin() {
  const router = useRouter();
  const [state, setState] = useState<AdminBlogPage>({ blogPage: null, posts: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ur'>('en');
  const [showPageEditor, setShowPageEditor] = useState(false);
  const [pageDraft, setPageDraft] = useState<AdminBlogPage['blogPage'] | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [postForm, setPostForm] = useState<any | null>(null);
  const [modalLanguage, setModalLanguage] = useState<'en' | 'ur'>('en');
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [missingOppositeLang, setMissingOppositeLang] = useState<string[]>([]);
  const [expandedBlockIndex, setExpandedBlockIndex] = useState<number | null>(null);
  const [draftBlock, setDraftBlock] = useState<any | null>(null);
  const [showSwitchLangPrompt, setShowSwitchLangPrompt] = useState(false);
  const [showBlockEditor, setShowBlockEditor] = useState(false);
  const [blockEditorIndex, setBlockEditorIndex] = useState<number | -1 | null>(null);
  const [blockEditorLanguage, setBlockEditorLanguage] = useState<'en' | 'ur'>('en');
  const [blockEditorData, setBlockEditorData] = useState<any | null>(null);
  const [blockEditorErrors, setBlockEditorErrors] = useState<string[]>([]);

  const currentFontFamily = currentLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary;
  const isRTL = currentLanguage === 'ur';
  const modalFontFamily = modalLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary;
  const modalDirection: 'rtl' | 'ltr' = modalLanguage === 'ur' ? 'rtl' : 'ltr';
  const isModalRTL = modalLanguage === 'ur';

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/blogs', { credentials: 'include' });
      if (!res.ok) {
        if (res.status === 403) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to load blogs');
      }
      const json = await res.json();
      setState({ blogPage: json.data.blogPage, posts: json.data.posts || [] });
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  if (loading) return <DashboardLoader />;
  if (error) return <AdminError error={error} reset={fetchBlogs} />;

  const handleSavePage = async () => {
    if (!pageDraft) return;
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/admin/blogs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ type: 'page', blogPage: pageDraft })
      });
      if (!res.ok) throw new Error('Failed to save blog page');
      await fetchBlogs();
      setShowPageEditor(false);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const createEmptyPost = (): any => ({
    id: "",
    slug: "",
    author: "",
    date: "",
    image: "",
    category: "",
    showOnHome: false,
    title: { en: "", ur: "" },
    excerpt: { en: "", ur: "" },
    socialShare: {
      title: { en: "", ur: "" },
      description: { en: "", ur: "" },
      hashtags: [],
      twitterHandle: "SECOPakistan",
      ogType: "article"
    },
    content: []
  });

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const openAddPost = () => {
    setEditingPost(null);
    setPostForm(createEmptyPost());
    setModalLanguage('en');
    setShowPostModal(true);
    setMissingFields([]);
    setMissingOppositeLang([]);
  };

  const openEditPost = (post: any) => {
    // Normalize socialShare to UI shape (title.en/ur, description.en/ur) from possible {text}
    const normalized = { ...post } as any;
    if (normalized.socialShare) {
      const ss = normalized.socialShare;
      const titleText = ss?.title?.en ?? ss?.title?.text ?? '';
      const descText = ss?.description?.en ?? ss?.description?.text ?? '';
      normalized.socialShare = {
        ...ss,
        title: { en: titleText, ur: ss?.title?.ur ?? titleText },
        description: { en: descText, ur: ss?.description?.ur ?? descText }
      };
    }
    setEditingPost(post);
    setPostForm(normalized);
    setModalLanguage('en');
    setShowPostModal(true);
    setMissingFields([]);
    setMissingOppositeLang([]);
  };

  const validatePost = (p: any, currentLang: 'en' | 'ur'): string[] => {
    const missing: string[] = [];
    // Common fields
    if (!p.image) missing.push('image');
    if (!p.date) missing.push('date');
    if (!p.category) missing.push('category');

    // Language-specific fields
    if (!p.title?.[currentLang]) missing.push(`title.${currentLang}`);
    if (!p.excerpt?.[currentLang]) missing.push(`excerpt.${currentLang}`);
    if (!p.socialShare?.title?.[currentLang]) missing.push(`socialShare.title.${currentLang}`);
    if (!p.socialShare?.description?.[currentLang]) missing.push(`socialShare.description.${currentLang}`);

    // Opposite language fields
    const oppositeLang = currentLang === 'en' ? 'ur' : 'en';
    if (!p.title?.[oppositeLang]) missing.push(`title.${oppositeLang}`);
    if (!p.excerpt?.[oppositeLang]) missing.push(`excerpt.${oppositeLang}`);
    if (!p.socialShare?.title?.[oppositeLang]) missing.push(`socialShare.title.${oppositeLang}`);
    if (!p.socialShare?.description?.[oppositeLang]) missing.push(`socialShare.description.${oppositeLang}`);

    return missing;
  };

  const handleValidation = () => {
    if (!postForm) return false;

    const missing = validatePost(postForm, modalLanguage);

    // Separate current language missing fields from opposite language missing fields
    const oppositeLang = modalLanguage === 'en' ? 'ur' : 'en';
    
    const currentLangMissing = missing.filter(f => 
      f.endsWith(`.${modalLanguage}`) || 
      (!f.includes('.') || f === 'image' || f === 'date' || f === 'category')
    );
    const oppositeLangMissing = missing.filter(f => f.endsWith(`.${oppositeLang}`));

    setMissingFields(currentLangMissing);
    setMissingOppositeLang(oppositeLangMissing);

    // Check for missing fields in the opposite language first
    if (oppositeLangMissing.length > 0) {
      setShowSwitchLangPrompt(true);
      return false;
    }

    // Check if current language required fields are filled
    if (currentLangMissing.length > 0) {
      showAlert({
        title: 'Missing Fields',
        text: `Please fill in all required fields in ${modalLanguage.toUpperCase()}`,
        icon: 'warning'
      });
      return false;
    }

    return true;
  };

  const deletePost = async (postId: string) => {
    const result = await showConfirmDialog({
      title: "Delete Post",
      text: "Are you sure you want to delete this post? This action cannot be undone.",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      showCancelButton: true,
    });

    if (!result.isConfirmed) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/admin/blogs?id=${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to delete post");
      }

      if (result.success) {
        showAlert({
          title: "Success",
          text: "Post deleted successfully!",
          icon: "success",
        });
        await fetchBlogs();
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete post";
      showAlert({
        title: "Error",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePost = async () => {
    if (!postForm) return;
    if (draftBlock) {
      showAlert({ title: 'Incomplete Content Block', text: 'Please add the new content block or cancel it before saving.', icon: 'warning' });
      return;
    }
    // Transform UI shape to API/storage shape
    const draft = { ...postForm } as any;
    if (!draft.slug && draft.title?.en) draft.slug = generateSlug(draft.title.en);

    if (draft.socialShare) {
      const ssTitle = draft.socialShare.title?.en || draft.socialShare.title?.ur || '';
      const ssDesc = draft.socialShare.description?.en || draft.socialShare.description?.ur || '';
      draft.socialShare = {
        ...draft.socialShare,
        title: { text: ssTitle },
        description: { text: ssDesc }
      };
    }

    // Validate the form
    if (!handleValidation()) {
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await fetch('/api/admin/blogs', {
        method: editingPost ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editingPost ? { ...draft, id: editingPost.id } : draft)
      });
      if (!res.ok) {
        if (res.status === 403) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to save post');
      }
      showAlert({ title: 'Success', text: 'Post saved successfully!', icon: 'success' });
      setShowPostModal(false);
      setEditingPost(null);
      setPostForm(null);
      setMissingFields([]);
      setMissingOppositeLang([]);
      setShowSwitchLangPrompt(false);
      await fetchBlogs();
    } catch (e) {
      showAlert({ title: 'Error', text: e instanceof Error ? e.message : 'Failed to save post', icon: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Loader isVisible={isSubmitting} text="Saving" />

      {state.blogPage && (
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8" style={{ backgroundColor: theme.colors.background.primary }}>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold" style={{ color: theme.colors.text.primary }}>Blog Page Settings</h1>
              {!showPageEditor ? (
                <button onClick={() => { setPageDraft({ ...state.blogPage! }); setShowPageEditor(true); }} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: theme.colors.primary, color: theme.colors.text.light }}>
                  <FiEdit2 className="w-4 h-4" /> Edit
                </button>
              ) : (
                <button onClick={() => { setShowPageEditor(false); setPageDraft(null); }} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: theme.colors.status.error, color: theme.colors.text.light }}>
                  <FiX className="w-4 h-4" /> Cancel
                </button>
              )}
            </div>

            {!showPageEditor ? (
              <div className="space-y-6">
                <div>
                  <div className="mb-2 text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Hero Image</div>
                  <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                    {state.blogPage.heroImage ? (
                      <Image src={state.blogPage.heroImage} alt="Blog hero" width={800} height={320} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                    )}
                  </div>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>Home Page Title (EN)</div>
                    <div className="p-3 bg-gray-50 rounded-lg" style={{ color: theme.colors.text.primary }}>{state.blogPage.title.en}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>Home Page Title (UR)</div>
                    <div className="p-3 bg-gray-50 rounded-lg" style={{ color: theme.colors.text.primary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }}>{state.blogPage.title.ur}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>Listing Page Title (EN)</div>
                    <div className="p-3 bg-gray-50 rounded-lg" style={{ color: theme.colors.text.primary }}>{state.blogPage.pageTitle?.en || ''}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>Listing Page Title (UR)</div>
                    <div className="p-3 bg-gray-50 rounded-lg" style={{ color: theme.colors.text.primary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }}>{state.blogPage.pageTitle?.ur || ''}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>Page Description (EN)</div>
                    <div className="p-3 bg-gray-50 rounded-lg" style={{ color: theme.colors.text.primary }}>{state.blogPage.pageDescription?.en || ''}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>Page Description (UR)</div>
                    <div className="p-3 bg-gray-50 rounded-lg" style={{ color: theme.colors.text.primary, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }}>{state.blogPage.pageDescription?.ur || ''}</div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleSavePage(); }} className="space-y-6">
                <div>
                  <div className="mb-2 text-sm font-medium" style={{ color: theme.colors.text.secondary }}>Hero Image</div>
                  <ImageSelector selectedPath={pageDraft?.heroImage || ''} onSelect={(url) => setPageDraft(prev => ({ ...(prev as any), heroImage: url }))} size="small" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>Home Page Title (EN)</div>
                    <input className="w-full p-3 rounded-lg border" style={{ borderColor: theme.colors.border.default }} value={pageDraft?.title.en || ''} onChange={(e) => setPageDraft(prev => ({ ...(prev as any), title: { ...(prev as any)?.title, en: e.target.value } }))} />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>Home Page Title (UR)</div>
                    <input className="w-full p-3 rounded-lg border" style={{ borderColor: theme.colors.border.default, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }} value={pageDraft?.title.ur || ''} onChange={(e) => setPageDraft(prev => ({ ...(prev as any), title: { ...(prev as any)?.title, ur: e.target.value } }))} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>Listing Page Title (EN)</div>
                    <input className="w-full p-3 rounded-lg border" style={{ borderColor: theme.colors.border.default }} value={pageDraft?.pageTitle?.en || ''} onChange={(e) => setPageDraft(prev => ({ ...(prev as any), pageTitle: { ...(prev as any)?.pageTitle, en: e.target.value } }))} />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>Listing Page Title (UR)</div>
                    <input className="w-full p-3 rounded-lg border" style={{ borderColor: theme.colors.border.default, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }} value={pageDraft?.pageTitle?.ur || ''} onChange={(e) => setPageDraft(prev => ({ ...(prev as any), pageTitle: { ...(prev as any)?.pageTitle, ur: e.target.value } }))} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>Page Description (EN)</div>
                    <textarea rows={3} className="w-full p-3 rounded-lg border" style={{ borderColor: theme.colors.border.default }} value={pageDraft?.pageDescription?.en || ''} onChange={(e) => setPageDraft(prev => ({ ...(prev as any), pageDescription: { ...(prev as any)?.pageDescription, en: e.target.value } }))} />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1" style={{ color: theme.colors.text.secondary }}>Page Description (UR)</div>
                    <textarea rows={3} className="w-full p-3 rounded-lg border" style={{ borderColor: theme.colors.border.default, fontFamily: theme.fonts.ur.primary, direction: 'rtl', textAlign: 'right' }} value={pageDraft?.pageDescription?.ur || ''} onChange={(e) => setPageDraft(prev => ({ ...(prev as any), pageDescription: { ...(prev as any)?.pageDescription, ur: e.target.value } }))} />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="flex items-center gap-2 px-6 py-2 rounded-lg" style={{ backgroundColor: theme.colors.secondary, color: theme.colors.primary }}>
                    <FiSave className="w-4 h-4" /> Save
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: theme.colors.text.primary }}>Blog Posts</h2>
          <button onClick={openAddPost} className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: theme.colors.primary, color: theme.colors.text.light }}>
            <FaPlus /> Add Post
          </button>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-2 p-1 rounded-lg" style={{ backgroundColor: theme.colors.background.secondary }}>
            <button onClick={() => setCurrentLanguage('en')} className={`px-4 py-2 rounded-md ${currentLanguage === 'en' ? 'text-white' : ''}`} style={{ backgroundColor: currentLanguage === 'en' ? theme.colors.primary : 'transparent', color: currentLanguage === 'en' ? 'white' : theme.colors.text.primary, fontFamily: theme.fonts.en.primary }}>English</button>
            <button onClick={() => setCurrentLanguage('ur')} className={`px-4 py-2 rounded-md ${currentLanguage === 'ur' ? 'text-white' : ''}`} style={{ backgroundColor: currentLanguage === 'ur' ? theme.colors.primary : 'transparent', color: currentLanguage === 'ur' ? 'white' : theme.colors.text.primary, fontFamily: theme.fonts.ur.primary }}>اردو</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {state.posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <Image src={post.image} alt={post.title[currentLanguage]} fill className="object-cover" />
                {post.showOnHome && (
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1">
                    <FaHome className="text-xs" /> Home
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-2" style={{ color: theme.colors.text.primary, fontFamily: currentFontFamily, textAlign: isRTL ? 'right' : 'left' }}>{post.title[currentLanguage]}</h3>
                <p className="text-sm line-clamp-2" style={{ color: theme.colors.text.secondary, fontFamily: currentFontFamily, textAlign: isRTL ? 'right' : 'left' }}>{post.excerpt[currentLanguage]}</p>
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-3">
                  <div className="text-xs text-gray-500">{post.date}</div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditPost(post)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FaEdit /></button>
                    <button onClick={() => deletePost(post.id)} disabled={isSubmitting} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><FaTrash /></button>
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><FaEye /></a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {state.posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Posts Found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first blog post.</p>
            <Link href="#" className="px-6 py-2" style={{ backgroundColor: theme.colors.primary, color: 'white', borderRadius: 8 }}>Create First Post</Link>
          </div>
        )}
      </div>

    {/* Add/Edit Post Modal */}
    {showPostModal && postForm && (
      <div className="fixed inset-0 bg-[#61616167] flex items-center justify-center z-50 p-4">
        {showSwitchLangPrompt && (
          <div className="fixed left-1/2 top-8 z-50 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-4" style={{minWidth: 320, maxWidth: 400}}>
            <div className="flex-1 text-sm text-center">{modalLanguage === 'en' ? 'Some required fields are missing in Urdu. Please switch to Urdu and fill them.' : 'Some required fields are missing in English. Please switch to English and fill them.'}</div>
            <button
              type="button"
              onClick={() => { setModalLanguage(modalLanguage === 'en' ? 'ur' : 'en'); setShowSwitchLangPrompt(false); }}
              className="px-3 py-1 rounded bg-blue-600 text-white text-xs shadow"
            >
              Switch to {modalLanguage === 'en' ? 'Urdu' : 'English'}
            </button>
            <button type="button" onClick={() => setShowSwitchLangPrompt(false)} className="ml-2 p-1 rounded hover:bg-yellow-200" aria-label="Close">
              <FiX className="w-4 h-4" />
            </button>
          </div>
        )}
        {/* Nested Block Editor Modal */}
        {showBlockEditor && blockEditorData && (
          <div className="fixed inset-0 bg-[#00000033] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[85vh] overflow-y-auto">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold" style={{color: theme.colors.text.primary}}>{blockEditorIndex === -1 ? (blockEditorData.type === 'quote' ? (modalLanguage === 'en' ? 'Add Quote' : 'نیا اقتباس') : (modalLanguage === 'en' ? 'Add Content Block' : 'نیا کنٹینٹ بلاک')) : (modalLanguage === 'en' ? 'Edit Block' : 'بلاک میں ترمیم')}</h3>
                <button onClick={() => { setShowBlockEditor(false); setBlockEditorIndex(null); setBlockEditorData(null); setBlockEditorErrors([]); }} className="p-2 rounded hover:bg-gray-100"><FiX /></button>
              </div>
              <div className="p-4">
                <div className="flex justify-center mb-4">
                  <div className="flex gap-2 p-1 rounded-lg" style={{backgroundColor: theme.colors.background.secondary}}>
                    <button onClick={() => setBlockEditorLanguage('en')} className={`px-4 py-2 rounded-md ${blockEditorLanguage === 'en' ? 'text-white' : ''}`} style={{ backgroundColor: blockEditorLanguage === 'en' ? theme.colors.primary : 'transparent', color: blockEditorLanguage === 'en' ? 'white' : theme.colors.text.primary, fontFamily: theme.fonts.en.primary }}>English</button>
                    <button onClick={() => setBlockEditorLanguage('ur')} className={`px-4 py-2 rounded-md ${blockEditorLanguage === 'ur' ? 'text-white' : ''}`} style={{ backgroundColor: blockEditorLanguage === 'ur' ? theme.colors.primary : 'transparent', color: blockEditorLanguage === 'ur' ? 'white' : theme.colors.text.primary, fontFamily: theme.fonts.ur.primary }}>اردو</button>
                  </div>
                </div>
                {blockEditorData.type === 'content-block' ? (
                  <div className="space-y-4" style={{direction: blockEditorLanguage === 'ur' ? 'rtl' : 'ltr'}}>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.primary, fontFamily: blockEditorLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary, textAlign: blockEditorLanguage === 'ur' ? 'right' : 'left'}}>{blockEditorLanguage === 'en' ? 'Block Text' : 'بلاک متن'} *</label>
                      <textarea rows={5} value={blockEditorData.text?.[blockEditorLanguage] || ''} onChange={(e) => setBlockEditorData((prev: any) => ({...prev, text: {...(prev.text||{}), [blockEditorLanguage]: e.target.value}}))} className="w-full p-3 rounded border" style={{borderColor: theme.colors.border.default, backgroundColor: theme.colors.background.primary, color: theme.colors.text.primary, fontFamily: blockEditorLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary, textAlign: blockEditorLanguage === 'ur' ? 'right' : 'left'}} />
                      {blockEditorErrors.includes(`text.${blockEditorLanguage}`) && <p className="text-red-500 text-sm mt-1">Required</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.primary}}>{blockEditorLanguage === 'en' ? 'Block Image' : 'بلاک تصویر'}</label>
                        <ImageSelector selectedPath={blockEditorData.image?.src || ''} onSelect={(url) => setBlockEditorData((prev: any) => ({...prev, image: {...(prev.image || {alt:{en:'',ur:''}, position:'above'}), src: url}}))} size="small" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.primary, fontFamily: blockEditorLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary, textAlign: blockEditorLanguage === 'ur' ? 'right' : 'left'}}>{blockEditorLanguage === 'en' ? 'Image Alt Text' : 'تصویر کے لیے متبادل متن'}</label>
                        <input type="text" value={blockEditorData.image?.alt?.[blockEditorLanguage] || ''} onChange={(e) => setBlockEditorData((prev: any) => ({...prev, image: {...(prev.image || {alt:{en:'',ur:''}, position:'above'}), alt: {...(prev.image?.alt || {}), [blockEditorLanguage]: e.target.value}}}))} className="w-full p-3 rounded border" style={{borderColor: theme.colors.border.default, backgroundColor: theme.colors.background.primary, color: theme.colors.text.primary, fontFamily: blockEditorLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary, textAlign: blockEditorLanguage === 'ur' ? 'right' : 'left'}} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.primary }}>{blockEditorLanguage === 'en' ? 'Image Position' : 'تصویر کی پوزیشن'}</label>
                      <div className="flex gap-4 flex-wrap">
                        {[
                          { value: 'left', labelEn: 'Left', labelUr: 'بائیں' },
                          { value: 'right', labelEn: 'Right', labelUr: 'دائیں' },
                          { value: 'above', labelEn: 'Above', labelUr: 'اوپر' },
                          { value: 'full', labelEn: 'Full Width', labelUr: 'پوری چوڑائی' },
                        ].map((opt) => (
                          <label key={opt.value} className="inline-flex items-center gap-2 text-sm" style={{ color: theme.colors.text.primary }}>
                            <input type="radio" name="imgpos" value={opt.value} checked={(blockEditorData.image?.position || 'above') === opt.value} onChange={(e) => setBlockEditorData((prev: any) => ({...prev, image: {...(prev.image || {alt:{en:'',ur:''}}), position: e.target.value}}))} />
                            <span style={{ fontFamily: blockEditorLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary }}>{blockEditorLanguage === 'en' ? opt.labelEn : opt.labelUr}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4" style={{direction: blockEditorLanguage === 'ur' ? 'rtl' : 'ltr'}}>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.primary, fontFamily: blockEditorLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary, textAlign: blockEditorLanguage === 'ur' ? 'right' : 'left'}}>{blockEditorLanguage === 'en' ? 'Quote Text' : 'اقتباس کا متن'} *</label>
                      <textarea rows={3} value={blockEditorData.content?.[blockEditorLanguage] || ''} onChange={(e) => setBlockEditorData((prev: any) => ({...prev, content: {...(prev.content||{}), [blockEditorLanguage]: e.target.value}}))} className="w-full p-3 rounded border" style={{borderColor: theme.colors.border.default, backgroundColor: theme.colors.background.primary, color: theme.colors.text.primary, fontFamily: blockEditorLanguage === 'ur' ? theme.fonts.ur.primary : theme.fonts.en.primary, textAlign: blockEditorLanguage === 'ur' ? 'right' : 'left'}} />
                      {blockEditorErrors.includes(`content.${blockEditorLanguage}`) && <p className="text-red-500 text-sm mt-1">Required</p>}
                    </div>
                  </div>
                )}
                <div className={`flex justify-end gap-3 pt-4 border-t mt-6`} style={{ direction: 'ltr' }}>
                  <button type="button" onClick={() => { setShowBlockEditor(false); setBlockEditorIndex(null); setBlockEditorData(null); setBlockEditorErrors([]); }} className="px-4 py-2 border rounded" style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary }}>Cancel</button>
                  <button type="button" onClick={() => {
                    const errors: string[] = [];
                    if (blockEditorData.type === 'content-block') {
                      if (!blockEditorData.text?.en) errors.push('text.en');
                      if (!blockEditorData.text?.ur) errors.push('text.ur');
                    } else {
                      if (!blockEditorData.content?.en) errors.push('content.en');
                      if (!blockEditorData.content?.ur) errors.push('content.ur');
                    }
                    if (errors.length > 0) { setBlockEditorErrors(errors); return; }

                    const blocks = Array.isArray(postForm.content) ? [...postForm.content] : [];
                    if (blockEditorIndex === -1) {
                      blocks.push(blockEditorData);
                    } else {
                      const idx = typeof blockEditorIndex === 'number' ? blockEditorIndex : 0;
                      blocks[idx] = blockEditorData;
                    }
                    setPostForm({ ...postForm, content: blocks });
                    setShowBlockEditor(false);
                    setBlockEditorIndex(null);
                    setBlockEditorData(null);
                    setBlockEditorErrors([]);
                  }} className="px-4 py-2 rounded" style={{ backgroundColor: theme.colors.primary, color: theme.colors.text.light }}>Save Block</button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{color: theme.colors.text.primary}}>{editingPost ? 'Edit Post' : 'Add New Post'}</h2>
              <button onClick={() => { setShowPostModal(false); setEditingPost(null); setPostForm(null); setShowSwitchLangPrompt(false); }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><FaTimes style={{color: theme.colors.text.secondary}} /></button>
            </div>

            {/* Language Toggle */}
            <div className="flex justify-center mb-6">
              <div className="flex gap-2 p-1 rounded-lg" style={{backgroundColor: theme.colors.background.secondary}}>
                <button onClick={() => setModalLanguage('en')} className={`px-4 py-2 rounded-md transition-colors duration-200 ${modalLanguage === 'en' ? 'text-white' : ''}`} style={{ backgroundColor: modalLanguage === 'en' ? theme.colors.primary : 'transparent', color: modalLanguage === 'en' ? 'white' : theme.colors.text.primary, fontFamily: theme.fonts.en.primary }}>English</button>
                <button onClick={() => setModalLanguage('ur')} className={`px-4 py-2 rounded-md transition-colors duration-200 ${modalLanguage === 'ur' ? 'text-white' : ''}`} style={{ backgroundColor: modalLanguage === 'ur' ? theme.colors.primary : 'transparent', color: modalLanguage === 'ur' ? 'white' : theme.colors.text.primary, fontFamily: theme.fonts.ur.primary }}>اردو</button>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSavePost(); }} className="space-y-6" style={{ direction: modalDirection }}>
              {/* Image and Basic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{color: theme.colors.text.primary, fontFamily: modalFontFamily, textAlign: isModalRTL ? 'right' : 'left'}}>{modalLanguage === 'en' ? 'Featured Image' : 'نمایاں تصویر'} <span style={{ color: theme.colors.status.error }}>*</span></label>
                  <ImageSelector selectedPath={postForm.image} onSelect={(image) => setPostForm({ ...postForm, image })} />
                  {missingFields.includes('image') && <p className="text-red-500 text-sm mt-1">Required</p>}
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.primary, fontFamily: modalFontFamily, textAlign: isModalRTL ? 'right' : 'left'}}>{modalLanguage === 'en' ? 'Date' : 'تاریخ'} <span style={{ color: theme.colors.status.error }}>*</span></label>
                    <div className="relative">
                      <input type="date" value={postForm.date} onChange={(e) => setPostForm({ ...postForm, date: e.target.value })} className={`w-full p-3 rounded-lg border focus:ring-2 focus:outline-none ${isModalRTL ? 'pr-10' : 'pl-10'}`} style={{ borderColor: theme.colors.border.default, backgroundColor: theme.colors.background.primary, color: theme.colors.text.primary, boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)' }} />
                      <FiCalendar className={`absolute top-1/2 -translate-y-1/2 ${isModalRTL ? 'right-3' : 'left-3'}`} style={{ color: theme.colors.text.secondary }} />
                    </div>
                    {missingFields.includes('date') && <p className="text-red-500 text-sm mt-1">Required</p>}
                  </div>
                </div>
              </div>

              {/* Title and Short Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.primary, fontFamily: modalFontFamily, textAlign: isModalRTL ? 'right' : 'left'}}>{modalLanguage === 'en' ? 'Title' : 'عنوان'} ({modalLanguage.toUpperCase()}) <span style={{ color: theme.colors.status.error }}>*</span></label>
                  <input type="text" value={postForm.title?.[modalLanguage] || ''} onChange={(e) => {
                    const val = e.target.value;
                    const next = { ...postForm, title: { ...postForm.title, [modalLanguage]: val } };
                    if (modalLanguage === 'en') next.slug = generateSlug(val);
                    setPostForm(next);
                  }} className="w-full p-3 rounded-lg border" style={{ borderColor: theme.colors.border.default, backgroundColor: theme.colors.background.primary, color: theme.colors.text.primary, fontFamily: modalFontFamily, direction: modalDirection, textAlign: isModalRTL ? 'right' : 'left' }} />
                  {missingFields.includes(`title.${modalLanguage}`) && <p className="text-red-500 text-sm mt-1">Required</p>}
                  {missingOppositeLang.includes(`title.${modalLanguage === 'en' ? 'ur' : 'en'}`) && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        {modalLanguage === 'en' ? 'Urdu translation missing' : 'English translation missing'}
                        <button
                          type="button"
                          onClick={() => {
                            const sourceLang = modalLanguage;
                            const targetLang = modalLanguage === 'en' ? 'ur' : 'en';
                            setPostForm({
                              ...postForm,
                              title: { ...postForm.title, [targetLang]: postForm.title?.[sourceLang] || '' }
                            });
                          }}
                          className="ml-2 text-blue-600 hover:text-blue-800 underline"
                        >
                          Copy from {modalLanguage === 'en' ? 'English' : 'Urdu'}
                        </button>
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.primary}}>Slug</label>
                  <input type="text" value={postForm.slug} disabled className="w-full p-3 rounded-lg border cursor-not-allowed" style={{ borderColor: theme.colors.border.default, backgroundColor: theme.colors.background.secondary, color: theme.colors.text.secondary }} placeholder={modalLanguage === 'en' ? 'Auto-generated from English title' : 'انگریزی عنوان سے خودکار طور پر بنایا گیا'} />
                </div>
              </div>

              {/* Description Full Width */}
                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.primary, fontFamily: modalFontFamily, textAlign: isModalRTL ? 'right' : 'left'}}>{modalLanguage === 'en' ? 'Short Description' : 'مختصر تفصیل'} ({modalLanguage.toUpperCase()}) <span style={{ color: theme.colors.status.error }}>*</span></label>
                  <textarea rows={3} value={postForm.excerpt?.[modalLanguage] || ''} onChange={(e) => setPostForm({ ...postForm, excerpt: { ...postForm.excerpt, [modalLanguage]: e.target.value } })} className="w-full p-3 rounded-lg border" style={{ borderColor: theme.colors.border.default, backgroundColor: theme.colors.background.primary, color: theme.colors.text.primary, fontFamily: modalFontFamily, direction: modalDirection, textAlign: isModalRTL ? 'right' : 'left' }} />
                  {missingFields.includes(`excerpt.${modalLanguage}`) && <p className="text-red-500 text-sm mt-1">Required</p>}
                  {missingOppositeLang.includes(`excerpt.${modalLanguage === 'en' ? 'ur' : 'en'}`) && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 text-sm">
                        {modalLanguage === 'en' ? 'Urdu translation missing' : 'English translation missing'}
                        <button
                          type="button"
                          onClick={() => {
                            const sourceLang = modalLanguage;
                            const targetLang = modalLanguage === 'en' ? 'ur' : 'en';
                            setPostForm({
                              ...postForm,
                              excerpt: { ...postForm.excerpt, [targetLang]: postForm.excerpt?.[sourceLang] || '' }
                            });
                          }}
                          className="ml-2 text-blue-600 hover:text-blue-800 underline"
                        >
                          Copy from {modalLanguage === 'en' ? 'English' : 'Urdu'}
                        </button>
                      </p>
                    </div>
                  )}
              </div>

              {/* Category, Author, Homepage in one row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.primary, fontFamily: modalFontFamily, textAlign: isModalRTL ? 'right' : 'left'}}>{modalLanguage === 'en' ? 'Category' : 'زمرہ'} <span style={{ color: theme.colors.status.error }}>*</span></label>
                  <select value={postForm.category} onChange={(e) => setPostForm({ ...postForm, category: e.target.value })} className="w-full p-3 rounded-lg border" style={{ borderColor: theme.colors.border.default, backgroundColor: theme.colors.background.primary, color: theme.colors.text.primary, fontFamily: modalFontFamily, direction: modalDirection, textAlign: isModalRTL ? 'right' : 'left' }}>
                    {(() => {
                      const defaults = ['Education','Sustainability','Technology','Health','Community'];
                      const existing = Array.from(new Set([postForm.category, ...state.posts.map((p) => p.category).filter(Boolean)]));
                      const options = Array.from(new Set([...defaults, ...existing])).filter(Boolean);
                      return [<option key="" value="">{modalLanguage === 'en' ? 'Select category' : 'زمرہ منتخب کریں'}</option>, ...options.map((c) => <option key={c} value={c}>{c}</option>)];
                    })()}
                  </select>
                  {missingFields.includes('category') && <p className="text-red-500 text-sm mt-1">Required</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.primary}}>{modalLanguage === 'en' ? 'Author' : 'مصنف'} <span style={{ color: theme.colors.status.error }}>*</span></label>
                  <select value={postForm.author} onChange={(e) => setPostForm({ ...postForm, author: e.target.value })} className="w-full p-3 rounded-lg border" style={{ borderColor: theme.colors.border.default, backgroundColor: theme.colors.background.primary, color: theme.colors.text.primary }}>
                    {(() => {
                      const authors = Array.from(new Set([postForm.author, ...state.posts.map((p) => p.author).filter(Boolean)])).filter(Boolean);
                      const options = authors.length ? authors : ['Jamaluddin'];
                      return [<option key="" value="">{modalLanguage === 'en' ? 'Select author' : 'مصنف منتخب کریں'}</option>, ...options.map((a) => <option key={a} value={a}>{a}</option>)];
                    })()}
                  </select>
                  {missingFields.includes('author') && <p className="text-red-500 text-sm mt-1">Required</p>}
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="showOnHome2" checked={postForm.showOnHome} onChange={(e) => setPostForm({ ...postForm, showOnHome: e.target.checked })} className={`${isModalRTL ? 'ml-2' : 'mr-2'}`} />
                  <label htmlFor="showOnHome2" className="text-sm" style={{ color: theme.colors.text.primary, fontFamily: modalFontFamily }}>{modalLanguage === 'en' ? 'Show on Homepage' : 'ہوم پیج پر دکھائیں'}</label>
                </div>
              </div>

              {/* Content Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold" style={{ color: theme.colors.text.primary, fontFamily: modalFontFamily, textAlign: isModalRTL ? 'right' : 'left' }}>{modalLanguage === 'en' ? 'Content Sections' : 'کنٹینٹ سیکشنز'}</h3>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => {
                      setBlockEditorIndex(-1);
                      setBlockEditorLanguage('en');
                      setBlockEditorData({ type: 'content-block', text: { en: '', ur: '' }, image: { src: '', alt: { en: '', ur: '' }, position: 'above' } });
                      setShowBlockEditor(true);
                    }} className="inline-flex items-center gap-2 px-3 py-2 rounded" style={{ backgroundColor: theme.colors.primary, color: theme.colors.text.light }}>
                      <FaPlus className="w-4 h-4" /> {modalLanguage === 'en' ? 'Add Content Block' : 'نیا کنٹینٹ بلاک'}
                    </button>
                    <button type="button" onClick={() => {
                      setBlockEditorIndex(-1);
                      setBlockEditorLanguage('en');
                      setBlockEditorData({ type: 'quote', content: { en: '', ur: '' } });
                      setShowBlockEditor(true);
                    }} className="inline-flex items-center gap-2 px-3 py-2 rounded border hover:bg-gray-50" style={{ borderColor: theme.colors.border.default, color: theme.colors.text.primary }}>
                      <FaQuoteRight className="w-4 h-4" /> {modalLanguage === 'en' ? 'Add Quote' : 'نیا اقتباس'}
                    </button>
                  </div>
                </div>
                {draftBlock && (
                  <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                    {modalLanguage === 'en' ? 'A new content block is in progress. Please add it or cancel before saving.' : 'نیا کنٹینٹ بلاک جاری ہے۔ محفوظ کرنے سے پہلے اسے شامل کریں یا منسوخ کریں۔'}
                  </div>
                )}
                {/* Compact table view for blocks */}
                <div className="overflow-auto">
                  <table className="min-w-full border" style={{ borderColor: theme.colors.border.default }}>
                    <thead>
                      <tr style={{ backgroundColor: theme.colors.background.secondary }}>
                        <th className="p-2 text-left text-sm font-medium" style={{ color: theme.colors.text.primary }}>{modalLanguage === 'en' ? 'Type' : 'قسم'}</th>
                        <th className="p-2 text-left text-sm font-medium" style={{ color: theme.colors.text.primary }}>{modalLanguage === 'en' ? 'Text Preview' : 'متن جھلک'}</th>
                        <th className="p-2 text-left text-sm font-medium" style={{ color: theme.colors.text.primary }}>{modalLanguage === 'en' ? 'Image' : 'تصویر'}</th>
                        <th className="p-2 text-left text-sm font-medium" style={{ color: theme.colors.text.primary }}>{modalLanguage === 'en' ? 'Image Position' : 'تصویر کی پوزیشن'}</th>
                        <th className="p-2 text-left text-sm font-medium" style={{ color: theme.colors.text.primary }}>{modalLanguage === 'en' ? 'Actions' : 'عمل'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(Array.isArray(postForm.content) ? postForm.content : []).map((block: any, index: number) => {
                        const text = (block.type === 'content-block' ? block.text?.[modalLanguage] : block.content?.[modalLanguage]) || '';
                        const preview = (text || '').replace(/<[^>]+>/g, '').slice(0, 80) + (text && text.length > 80 ? '…' : '');
                        const imgSrc = block.image?.src || '';
                        const imgPos = block.image?.position || '-';
                        return (
                          <tr key={index} className="border-t" style={{ borderColor: theme.colors.border.default }}>
                            <td className="p-2 align-top" style={{ color: theme.colors.text.primary }}>{block.type === 'content-block' ? (modalLanguage === 'en' ? 'Content Block' : 'کنٹینٹ بلاک') : (modalLanguage === 'en' ? 'Quote' : 'اقتباس')}</td>
                            <td className="p-2 align-top" style={{ color: theme.colors.text.secondary, fontFamily: modalFontFamily, direction: modalDirection, textAlign: isModalRTL ? 'right' : 'left' }}>{preview || (modalLanguage === 'en' ? 'Empty' : 'خالی')}</td>
                            <td className="p-2 align-top">
                              {imgSrc ? <img src={imgSrc} alt="" className="w-12 h-12 object-cover rounded" /> : <span className="text-xs" style={{ color: theme.colors.text.secondary }}>-</span>}
                            </td>
                            <td className="p-2 align-top" style={{ color: theme.colors.text.secondary }}>{block.type === 'content-block' ? imgPos : '-'}</td>
                            <td className="p-2 align-top">
                              <div className={`flex items-center gap-1 ${isModalRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                                <button type="button" title={modalLanguage === 'en' ? 'Edit' : 'ترمیم'} onClick={() => {
                                  setBlockEditorIndex(index);
                                  setBlockEditorLanguage('en');
                                  setBlockEditorData(postForm.content[index]);
                                  setShowBlockEditor(true);
                                }} className="p-2 rounded border hover:bg-gray-50" style={{ borderColor: theme.colors.border.default }}>
                                  <FiEdit className="w-4 h-4" style={{ color: theme.colors.text.primary }} />
                                </button>
                                <button type="button" title={modalLanguage === 'en' ? 'Move Up' : 'اوپر'} onClick={() => {
                                  if (index === 0) return;
                                  const blocks = [...postForm.content];
                                  const temp = blocks[index - 1];
                                  blocks[index - 1] = blocks[index];
                                  blocks[index] = temp;
                                  setPostForm({ ...postForm, content: blocks });
                                }} className="p-2 rounded border hover:bg-gray-50" style={{ borderColor: theme.colors.border.default }}>
                                  <FiChevronUp className="w-4 h-4" style={{ color: theme.colors.text.primary }} />
                                </button>
                                <button type="button" title={modalLanguage === 'en' ? 'Move Down' : 'نیچے'} onClick={() => {
                                  if (index === (postForm.content?.length || 0) - 1) return;
                                  const blocks = [...postForm.content];
                                  const temp = blocks[index + 1];
                                  blocks[index + 1] = blocks[index];
                                  blocks[index] = temp;
                                  setPostForm({ ...postForm, content: blocks });
                                }} className="p-2 rounded border hover:bg-gray-50" style={{ borderColor: theme.colors.border.default }}>
                                  <FiChevronDown className="w-4 h-4" style={{ color: theme.colors.text.primary }} />
                                </button>
                                <button type="button" title={modalLanguage === 'en' ? 'Delete' : 'حذف کریں'} onClick={() => {
                                  const blocks = [...(postForm.content || [])];
                                  blocks.splice(index, 1);
                                  setPostForm({ ...postForm, content: blocks });
                                  if (expandedBlockIndex === index) setExpandedBlockIndex(null);
                                }} className="p-2 rounded border hover:bg-red-50" style={{ borderColor: theme.colors.border.default }}>
                                  <FiTrash2 className="w-4 h-4" style={{ color: theme.colors.status.error }} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Inline editor removed in favor of block editor popup */}
              </div>

              {/* Social Share */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold" style={{color: theme.colors.text.primary}}>Social Share</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.primary}}>Social Share Title *</label>
                    <input type="text" value={postForm.socialShare?.title?.en || ''} onChange={(e) => setPostForm({ ...postForm, socialShare: { ...postForm.socialShare, title: { en: e.target.value, ur: e.target.value } } })} className="w-full p-3 rounded-lg border" style={{ borderColor: theme.colors.border.default, backgroundColor: theme.colors.background.primary, color: theme.colors.text.primary }} />
                    {(missingFields.some(f => f.startsWith('socialShare.title'))) && <p className="text-red-500 text-sm mt-1">Required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.primary}}>Social Share Description *</label>
                    <textarea rows={3} value={postForm.socialShare?.description?.en || ''} onChange={(e) => setPostForm({ ...postForm, socialShare: { ...postForm.socialShare, description: { en: e.target.value, ur: e.target.value } } })} className="w-full p-3 rounded-lg border" style={{ borderColor: theme.colors.border.default, backgroundColor: theme.colors.background.primary, color: theme.colors.text.primary }} />
                    {(missingFields.some(f => f.startsWith('socialShare.description'))) && <p className="text-red-500 text-sm mt-1">Required</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.primary, fontFamily: modalFontFamily, textAlign: isModalRTL ? 'right' : 'left'}}>{modalLanguage === 'en' ? 'Hashtags (comma separated)' : 'ہیش ٹیگز (کاما سے الگ)'} </label>
                    <input type="text" value={(postForm.socialShare?.hashtags || []).join(', ')} onChange={(e) => setPostForm({ ...postForm, socialShare: { ...postForm.socialShare, hashtags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) } })} className="w-full p-3 rounded-lg border" style={{ borderColor: theme.colors.border.default, backgroundColor: theme.colors.background.primary, color: theme.colors.text.primary, fontFamily: modalFontFamily, direction: modalDirection, textAlign: isModalRTL ? 'right' : 'left' }} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.primary, fontFamily: modalFontFamily, textAlign: isModalRTL ? 'right' : 'left'}}>{modalLanguage === 'en' ? 'Twitter Handle' : 'ٹوئٹر ہینڈل'}</label>
                    <input type="text" value={postForm.socialShare?.twitterHandle || ''} onChange={(e) => setPostForm({ ...postForm, socialShare: { ...postForm.socialShare, twitterHandle: e.target.value } })} className="w-full p-3 rounded-lg border" style={{ borderColor: theme.colors.border.default, backgroundColor: theme.colors.background.primary, color: theme.colors.text.primary, fontFamily: modalFontFamily, direction: modalDirection, textAlign: isModalRTL ? 'right' : 'left' }} />
                  </div>
                </div>
              </div>

              <div className={`flex justify-end gap-3 pt-4 border-t border-gray-200`} style={{ direction: 'ltr' }}>
                <button type="button" onClick={() => { setShowPostModal(false); setEditingPost(null); setPostForm(null); setMissingFields([]); setMissingOppositeLang([]); setShowSwitchLangPrompt(false); }} className="px-6 py-2 border rounded-lg" style={{ color: theme.colors.text.primary }}>Cancel</button>
                <button type="submit" disabled={isSubmitting || !!draftBlock} className="px-6 py-2 rounded-lg" style={{ backgroundColor: theme.colors.primary, color: 'white', opacity: (isSubmitting || !!draftBlock) ? 0.6 : 1 }}>{isSubmitting ? 'Saving...' : 'Save Post'}</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
    </div>

  );
}


