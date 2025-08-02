"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from 'next/dynamic';
import { theme } from "@/config/theme";

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import('jodit-react'), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center p-8 border rounded-lg"
      style={{
        borderColor: theme.colors.border.default,
        backgroundColor: theme.colors.background.secondary
      }}
    >
      <div className="text-sm" style={{ color: theme.colors.text.secondary }}>
        Loading editor...
      </div>
    </div>
  )
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
  fontFamily?: string;
  textAlign?: "left" | "right" | "center";
  direction?: "ltr" | "rtl";
  disabled?: boolean;
  showPreview?: boolean;
  allowHtml?: boolean;
  toolbar?: {
    formatting?: boolean;
    lists?: boolean;
    links?: boolean;
    images?: boolean;
    alignment?: boolean;
    html?: boolean;
  };
  className?: string;
  label?: string;
  required?: boolean;
  error?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter content...",
  height = "300px",
  fontFamily = theme.fonts.en.primary,
  textAlign = "left",
  direction = "ltr",
  disabled = false,
  showPreview = true,
  allowHtml = true,
  toolbar = {
    formatting: true,
    lists: true,
    links: true,
    images: true,
    alignment: true,
    html: true,
  },
  className = "",
  label,
  required = false,
  error,
}: RichTextEditorProps) {

  const [internalValue, setInternalValue] = useState(value);
  const isUpdatingRef = useRef(false);
  const lastChangeTimeRef = useRef(0);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update internal value when prop changes (but not during active typing)
  useEffect(() => {
    const now = Date.now();
    const timeSinceLastChange = now - lastChangeTimeRef.current;

    // Only update if we're not currently typing (500ms since last change)
    // and the value actually changed
    if (!isUpdatingRef.current && value !== internalValue && timeSinceLastChange > 500) {
      setInternalValue(value);
    }
  }, [value, internalValue]);

  // Jodit configuration with cursor preservation
  const config = useMemo(() => ({
    readonly: disabled,
    placeholder: placeholder,
    height: parseInt(height.replace('px', '')),
    direction: direction,
    language: direction === 'rtl' ? 'ar' : 'en',
    toolbarAdaptive: false,
    toolbarSticky: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    processPasteHTML: false,
    processPasteFromWord: false,
    cleanHTML: {
      timeout: 0 // Disable automatic cleaning that can cause cursor issues
    },
    enter: 'p' as const, // Use P tags for new lines instead of DIV
    defaultMode: 1, // WYSIWYG mode
    saveModeInStorage: false,
    addNewLine: false, // Disable the "add new line" feature
    addNewLineOnDBLClick: false, // Disable double-click to add line
    useSearch: false, // Disable search to prevent interference
    spellcheck: false, // Disable spellcheck to prevent cursor issues
    autocomplete: false, // Disable autocomplete
    beautifyHTML: false, // Disable HTML beautification that can cause cursor jumps
    observer: {
      timeout: 100 // Reduce observer timeout to minimize cursor issues
    },
    buttons: [
      'bold', 'italic', 'underline', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', '|',
      'brush', 'paragraph', '|',
      'link', '|',
      'align', '|',
      'undo', 'redo', '|',
      'hr', 'eraser', '|',
      'symbol', 'fullsize',
      ...(allowHtml ? ['source'] : [])
    ],
    buttonsMD: [
      'bold', 'italic', '|',
      'ul', 'ol', '|',
      'font', 'fontsize', '|',
      'paragraph', '|',
      'link', '|',
      'align', '|',
      'undo', 'redo', '|',
      'dots'
    ],
    buttonsSM: [
      'bold', 'italic', '|',
      'ul', 'ol', '|',
      'fontsize', '|',
      'paragraph', '|',
      'link', '|',
      'dots'
    ],
    buttonsXS: [
      'bold', 'italic', '|',
      'ul', 'ol', '|',
      'paragraph', '|',
      'dots'
    ],
    style: {
      font: fontFamily,
      fontSize: '14px',
      color: theme.colors.text.primary,
      backgroundColor: theme.colors.background.primary,
    },
    theme: 'default'
  }), [disabled, placeholder, height, direction, allowHtml, fontFamily]);

  const handleChange = (content: string) => {
    // Prevent unnecessary updates that cause cursor issues
    if (content === internalValue) return;

    // Mark that we're updating and record the time
    isUpdatingRef.current = true;
    lastChangeTimeRef.current = Date.now();

    // Update internal value immediately for responsive UI
    setInternalValue(content);

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce the onChange call to parent to reduce re-renders
    debounceTimeoutRef.current = setTimeout(() => {
      onChange(content);
      isUpdatingRef.current = false;
    }, 300); // 300ms debounce
  };

  const handleBlur = (content: string) => {
    // Clear any pending debounced updates
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }

    // Immediately save on blur
    isUpdatingRef.current = false;
    if (content !== value) {
      onChange(content);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`rich-text-editor ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-2" style={{
          color: theme.colors.text.primary,
          fontFamily: fontFamily,
          textAlign: textAlign
        }}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className="jodit-wrapper"
        style={{
          borderColor: error ? theme.colors.status.error : theme.colors.border.default,
          direction: direction
        }}
      >
        <JoditEditor
          value={internalValue}
          config={config}
          onBlur={handleBlur}
          onChange={handleChange}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      <style jsx global>{`
        /* Custom Jodit styling */
        .jodit-wrapper .jodit-container {
          border: 1px solid ${error ? theme.colors.status.error : theme.colors.border.default} !important;
          border-radius: 8px !important;
          font-family: ${fontFamily} !important;
          direction: ${direction} !important;
          overflow: hidden !important;
        }

        .jodit-wrapper .jodit-toolbar {
          border-bottom: 1px solid ${theme.colors.border.default} !important;
          background-color: ${theme.colors.background.secondary} !important;
          padding: 12px !important;
        }

        .jodit-wrapper .jodit-workplace {
          background-color: ${theme.colors.background.primary} !important;
        }

        .jodit-wrapper .jodit-wysiwyg {
          color: ${theme.colors.text.primary} !important;
          background-color: ${theme.colors.background.primary} !important;
          padding: 24px !important;
          line-height: 1.7 !important;
          text-align: ${textAlign} !important;
          direction: ${direction} !important;
          min-height: 200px !important;
          font-family: ${fontFamily} !important;
          font-size: 14px !important;
        }

        .jodit-wrapper .jodit-wysiwyg[data-placeholder]:empty::before {
          color: #9ca3af !important;
          font-style: italic !important;
          opacity: 0.7 !important;
        }

        /* Toolbar button styling */
        .jodit-wrapper .jodit-toolbar-button {
          color: ${theme.colors.text.secondary} !important;
          border-radius: 4px !important;
          padding: 6px !important;
          margin: 2px !important;
          transition: all 0.2s ease !important;
          border: 1px solid transparent !important;
        }

        .jodit-wrapper .jodit-toolbar-button:hover {
          background-color: ${theme.colors.background.primary} !important;
          color: ${theme.colors.text.primary} !important;
          transform: translateY(-1px) !important;
          border-color: ${theme.colors.border.default} !important;
        }

        .jodit-wrapper .jodit-toolbar-button.jodit-toolbar-button_active {
          background-color: ${theme.colors.primary} !important;
          color: white !important;
          border-color: ${theme.colors.primary} !important;
        }

        .jodit-wrapper .jodit-toolbar-button__trigger {
          color: inherit !important;
        }

        /* Content styling */
        .jodit-wrapper .jodit-wysiwyg h1 {
          font-size: 2rem !important;
          font-weight: 700 !important;
          margin: 1.5rem 0 0.75rem 0 !important;
          color: ${theme.colors.text.primary} !important;
          line-height: 1.2 !important;
          border-bottom: 2px solid ${theme.colors.border.default} !important;
          padding-bottom: 0.5rem !important;
        }

        .jodit-wrapper .jodit-wysiwyg h2 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          margin: 1.25rem 0 0.5rem 0 !important;
          color: ${theme.colors.text.primary} !important;
          line-height: 1.3 !important;
        }

        .jodit-wrapper .jodit-wysiwyg h3 {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          margin: 1rem 0 0.5rem 0 !important;
          color: ${theme.colors.text.primary} !important;
          line-height: 1.4 !important;
        }

        .jodit-wrapper .jodit-wysiwyg p {
          margin: 0.75rem 0 !important;
          line-height: 1.7 !important;
          color: ${theme.colors.text.secondary} !important;
        }

        .jodit-wrapper .jodit-wysiwyg ul,
        .jodit-wrapper .jodit-wysiwyg ol {
          margin: 0.75rem 0 !important;
          padding-left: 1.5rem !important;
        }

        .jodit-wrapper .jodit-wysiwyg li {
          margin: 0.5rem 0 !important;
          color: ${theme.colors.text.secondary} !important;
          line-height: 1.6 !important;
        }

        .jodit-wrapper .jodit-wysiwyg blockquote {
          border-left: 4px solid ${theme.colors.primary} !important;
          padding: 1rem 1.5rem !important;
          margin: 1.5rem 0 !important;
          font-style: italic !important;
          color: ${theme.colors.text.secondary} !important;
          background-color: ${theme.colors.background.secondary} !important;
          border-radius: 0 8px 8px 0 !important;
        }

        .jodit-wrapper .jodit-wysiwyg strong {
          font-weight: 600 !important;
          color: ${theme.colors.text.primary} !important;
        }

        .jodit-wrapper .jodit-wysiwyg a {
          color: ${theme.colors.primary} !important;
          text-decoration: underline !important;
        }

        .jodit-wrapper .jodit-wysiwyg a:hover {
          opacity: 0.8 !important;
        }

        /* Focus state */
        .jodit-wrapper .jodit-wysiwyg:focus {
          outline: none !important;
        }

        /* Disabled state */
        .jodit-wrapper .jodit-disabled .jodit-toolbar {
          opacity: 0.6 !important;
        }

        .jodit-wrapper .jodit-disabled .jodit-wysiwyg {
          background-color: ${theme.colors.background.secondary} !important;
          opacity: 0.8 !important;
        }

        /* Selection styling */
        .jodit-wrapper .jodit-wysiwyg ::selection {
          background-color: ${theme.colors.primary}30 !important;
        }

        /* Hide line break indicators and other UI elements */
        .jodit-wrapper .jodit-add-new-line,
        .jodit-wrapper .jodit-add-new-line__button,
        .jodit-wrapper .jodit-add-new-line__line {
          display: none !important;
        }

        .jodit-wrapper .jodit-wysiwyg .jodit-add-new-line {
          display: none !important;
        }

        .jodit-wrapper .jodit-wysiwyg::after {
          display: none !important;
        }

        /* Hide placeholder line indicators */
        .jodit-wrapper .jodit-placeholder {
          position: relative !important;
        }

        .jodit-wrapper .jodit-placeholder::after {
          display: none !important;
        }

        /* Hide any break line indicators */
        .jodit-wrapper [data-jodit-selection-container] .jodit-add-new-line {
          display: none !important;
        }

        /* Responsive toolbar */
        @media (max-width: 768px) {
          .jodit-wrapper .jodit-toolbar {
            padding: 8px !important;
          }

          .jodit-wrapper .jodit-toolbar-button {
            padding: 4px !important;
            margin: 1px !important;
          }

          .jodit-wrapper .jodit-wysiwyg {
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
