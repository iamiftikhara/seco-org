"use client";

import { useState, useRef, useEffect } from "react";
import { theme } from "@/config/theme";

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
  const editorRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"edit" | "preview" | "html">("edit");
  const [content, setContent] = useState(value);

  useEffect(() => {
    setContent(value);
  }, [value]);

  // Set up mutation observer for real-time formatting
  useEffect(() => {
    if (!editorRef.current) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          // Force style recalculation for new elements
          const editor = editorRef.current;
          if (editor) {
            // Apply styles to any new elements
            const elements = editor.querySelectorAll('h1, h2, h3, p, ul, ol, li, blockquote, strong, em, u');
            elements.forEach((el) => {
              // Force style recalculation by toggling a class
              el.classList.add('rich-text-styled');
            });
          }
        }
      });
    });

    observer.observe(editorRef.current, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => {
      observer.disconnect();
    };
  }, [mode]);

  const executeCommand = (command: string, value?: string) => {
    if (disabled || !editorRef.current) return;

    editorRef.current.focus();

    try {
      document.execCommand(command, false, value);
      updateContent();
    } catch (error) {
      console.warn('Command execution failed:', command, error);
    }
  };

  const updateContent = () => {
    if (!editorRef.current) return;

    const newContent = editorRef.current.innerHTML;
    setContent(newContent);
    onChange(newContent);
  };

  const handleInput = () => {
    updateContent();
  };

  const handleKeyUp = () => {
    // This helps ensure styles are applied after typing
    if (editorRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        updateContent();
      }, 10);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    updateContent();
  };

  const insertHTML = (html: string) => {
    if (disabled || !editorRef.current) return;

    editorRef.current.focus();
    document.execCommand('insertHTML', false, html);
    updateContent();
  };

  const handleModeChange = (newMode: "edit" | "preview" | "html") => {
    setMode(newMode);

    if (newMode === "edit" && editorRef.current) {
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = content;
          editorRef.current.focus();
        }
      }, 10);
    }
  };

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
        className="border rounded-lg overflow-hidden shadow-sm"
        style={{
          borderColor: error ? theme.colors.status.error : theme.colors.border.default,
          backgroundColor: theme.colors.background.primary,
          transition: 'all 0.2s ease'
        }}
      >
        {/* Toolbar */}
        <div
          className="flex items-center gap-2 p-3 border-b flex-wrap"
          style={{
            borderColor: theme.colors.border.default,
            backgroundColor: theme.colors.background.secondary
          }}
        >
          {/* Mode Toggle */}
          <div className="flex items-center gap-1 mr-3 border-r pr-3" style={{ borderColor: theme.colors.border.default }}>
            <button
              type="button"
              onClick={() => handleModeChange("edit")}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                mode === "edit"
                  ? 'text-white shadow-sm'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: mode === "edit" ? theme.colors.primary : theme.colors.background.primary,
                color: mode === "edit" ? 'white' : theme.colors.text.secondary,
                border: `1px solid ${mode === "edit" ? theme.colors.primary : theme.colors.border.default}`
              }}
              disabled={disabled}
            >
              Edit
            </button>
            {showPreview && (
              <button
                type="button"
                onClick={() => handleModeChange("preview")}
                className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                  mode === "preview"
                    ? 'text-white shadow-sm'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: mode === "preview" ? theme.colors.primary : theme.colors.background.primary,
                  color: mode === "preview" ? 'white' : theme.colors.text.secondary,
                  border: `1px solid ${mode === "preview" ? theme.colors.primary : theme.colors.border.default}`
                }}
                disabled={disabled}
              >
                Preview
              </button>
            )}
            {allowHtml && (
              <button
                type="button"
                onClick={() => handleModeChange("html")}
                className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                  mode === "html"
                    ? 'text-white shadow-sm'
                    : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: mode === "html" ? theme.colors.primary : theme.colors.background.primary,
                  color: mode === "html" ? 'white' : theme.colors.text.secondary,
                  border: `1px solid ${mode === "html" ? theme.colors.primary : theme.colors.border.default}`
                }}
                disabled={disabled}
              >
                HTML
              </button>
            )}
          </div>

          {/* Formatting Tools */}
          {mode === "edit" && (
            <>
              <div className="flex items-center gap-1 mr-3 border-r pr-3" style={{ borderColor: theme.colors.border.default }}>
                <button
                  type="button"
                  onClick={() => executeCommand('bold')}
                  className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm transition-colors hover:shadow-sm"
                  style={{
                    backgroundColor: theme.colors.background.primary,
                    color: theme.colors.text.primary,
                    border: `1px solid ${theme.colors.border.default}`
                  }}
                  title="Bold (Ctrl+B)"
                  disabled={disabled}
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand('italic')}
                  className="w-8 h-8 rounded-md flex items-center justify-center italic text-sm transition-colors hover:shadow-sm"
                  style={{
                    backgroundColor: theme.colors.background.primary,
                    color: theme.colors.text.primary,
                    border: `1px solid ${theme.colors.border.default}`
                  }}
                  title="Italic (Ctrl+I)"
                  disabled={disabled}
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand('underline')}
                  className="w-8 h-8 rounded-md flex items-center justify-center underline text-sm transition-colors hover:shadow-sm"
                  style={{
                    backgroundColor: theme.colors.background.primary,
                    color: theme.colors.text.primary,
                    border: `1px solid ${theme.colors.border.default}`
                  }}
                  title="Underline (Ctrl+U)"
                  disabled={disabled}
                >
                  U
                </button>
              </div>

              <div className="flex items-center gap-2 mr-3 border-r pr-3" style={{ borderColor: theme.colors.border.default }}>
                <select
                  onChange={(e) => executeCommand('formatBlock', e.target.value)}
                  className="px-3 py-1.5 text-sm rounded-md transition-colors"
                  style={{
                    backgroundColor: theme.colors.background.primary,
                    color: theme.colors.text.primary,
                    border: `1px solid ${theme.colors.border.default}`,
                    fontFamily: fontFamily
                  }}
                  disabled={disabled}
                >
                  <option value="">Format</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                  <option value="p">Paragraph</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => executeCommand('insertUnorderedList')}
                  className="px-3 py-1.5 text-sm rounded-md transition-colors hover:shadow-sm"
                  style={{
                    backgroundColor: theme.colors.background.primary,
                    color: theme.colors.text.primary,
                    border: `1px solid ${theme.colors.border.default}`
                  }}
                  title="Bullet List"
                  disabled={disabled}
                >
                  • List
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand('insertOrderedList')}
                  className="px-3 py-1.5 text-sm rounded-md transition-colors hover:shadow-sm"
                  style={{
                    backgroundColor: theme.colors.background.primary,
                    color: theme.colors.text.primary,
                    border: `1px solid ${theme.colors.border.default}`
                  }}
                  title="Numbered List"
                  disabled={disabled}
                >
                  1. List
                </button>
              </div>
            </>
          )}
        </div>

        {/* Editor Content */}
        <div style={{ height }}>
          {mode === "edit" && (
            <div
              ref={editorRef}
              contentEditable={!disabled}
              onInput={handleInput}
              onKeyUp={handleKeyUp}
              onPaste={handlePaste}
              className="w-full h-full p-6 outline-none overflow-y-auto rich-editor-content focus:ring-0"
              style={{
                fontFamily,
                textAlign,
                direction,
                color: theme.colors.text.primary,
                backgroundColor: disabled ? theme.colors.background.secondary : theme.colors.background.primary,
                minHeight: '200px',
                lineHeight: '1.7',
                fontSize: '14px',
                cursor: 'text'
              }}
              dangerouslySetInnerHTML={{ __html: content }}
              suppressContentEditableWarning={true}
            />
          )}

          {mode === "preview" && (
            <div
              className="w-full h-full p-6 overflow-y-auto rich-editor-content"
              style={{
                fontFamily,
                textAlign,
                direction,
                color: theme.colors.text.primary,
                backgroundColor: theme.colors.background.secondary,
                lineHeight: '1.7',
                fontSize: '14px',
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          {mode === "html" && (
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                onChange(e.target.value);
              }}
              className="w-full h-full p-6 outline-none resize-none font-mono text-sm focus:ring-0"
              style={{
                backgroundColor: disabled ? theme.colors.background.secondary : theme.colors.background.primary,
                color: theme.colors.text.primary,
                lineHeight: '1.5',
                fontSize: '13px',
                border: 'none'
              }}
              placeholder="Enter HTML content..."
              disabled={disabled}
            />
          )}
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      {/* Quick Insert Buttons */}
      {mode === "edit" && !disabled && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => insertHTML('<h2>Heading</h2>')}
            className="px-3 py-2 text-sm rounded-md transition-colors hover:shadow-sm"
            style={{
              backgroundColor: theme.colors.background.primary,
              color: theme.colors.text.secondary,
              border: `1px solid ${theme.colors.border.default}`,
              fontFamily: fontFamily
            }}
          >
            + Heading
          </button>
          <button
            type="button"
            onClick={() => insertHTML('<p>Paragraph text here...</p>')}
            className="px-3 py-2 text-sm rounded-md transition-colors hover:shadow-sm"
            style={{
              backgroundColor: theme.colors.background.primary,
              color: theme.colors.text.secondary,
              border: `1px solid ${theme.colors.border.default}`,
              fontFamily: fontFamily
            }}
          >
            + Paragraph
          </button>
          <button
            type="button"
            onClick={() => insertHTML('<ul><li>List item 1</li><li>List item 2</li></ul>')}
            className="px-3 py-2 text-sm rounded-md transition-colors hover:shadow-sm"
            style={{
              backgroundColor: theme.colors.background.primary,
              color: theme.colors.text.secondary,
              border: `1px solid ${theme.colors.border.default}`,
              fontFamily: fontFamily
            }}
          >
            + Bullet List
          </button>
          <button
            type="button"
            onClick={() => insertHTML('<blockquote>Quote text here...</blockquote>')}
            className="px-3 py-2 text-sm rounded-md transition-colors hover:shadow-sm"
            style={{
              backgroundColor: theme.colors.background.primary,
              color: theme.colors.text.secondary,
              border: `1px solid ${theme.colors.border.default}`,
              fontFamily: fontFamily
            }}
          >
            + Quote
          </button>
        </div>
      )}

      <style jsx>{`
        .rich-text-editor [contenteditable="true"]:empty:before {
          content: "${placeholder}";
          color: #9ca3af;
          pointer-events: none;
          font-style: italic;
          opacity: 0.7;
        }

        .rich-text-editor [contenteditable="true"]:focus:before {
          display: none;
        }

        .rich-text-editor [contenteditable="true"] {
          cursor: text;
          transition: all 0.2s ease;
        }

        .rich-text-editor [contenteditable="true"]:focus {
          outline: none;
          cursor: text;
          box-shadow: inset 0 0 0 1px ${theme.colors.primary}20;
        }

        .rich-text-editor [contenteditable="true"] h1,
        .rich-text-editor .rich-editor-content h1 {
          font-size: 2rem !important;
          font-weight: 700 !important;
          margin: 1.5rem 0 0.75rem 0 !important;
          color: ${theme.colors.text.primary} !important;
          line-height: 1.2 !important;
          display: block !important;
          border-bottom: 2px solid ${theme.colors.border.default} !important;
          padding-bottom: 0.5rem !important;
        }

        .rich-text-editor [contenteditable="true"] h2,
        .rich-text-editor .rich-editor-content h2 {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          margin: 1.25rem 0 0.5rem 0 !important;
          color: ${theme.colors.text.primary} !important;
          line-height: 1.3 !important;
          display: block !important;
        }

        .rich-text-editor [contenteditable="true"] h3,
        .rich-text-editor .rich-editor-content h3 {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          margin: 1rem 0 0.5rem 0 !important;
          color: ${theme.colors.text.primary} !important;
          line-height: 1.4 !important;
          display: block !important;
        }

        .rich-text-editor [contenteditable="true"] p,
        .rich-text-editor .rich-editor-content p {
          margin: 0.75rem 0 !important;
          line-height: 1.7 !important;
          color: ${theme.colors.text.secondary} !important;
          display: block !important;
        }

        .rich-text-editor [contenteditable="true"] ul,
        .rich-text-editor .rich-editor-content ul {
          margin: 0.75rem 0 !important;
          padding-left: 1.5rem !important;
          list-style-type: disc !important;
          display: block !important;
        }

        .rich-text-editor [contenteditable="true"] ol,
        .rich-text-editor .rich-editor-content ol {
          margin: 0.75rem 0 !important;
          padding-left: 1.5rem !important;
          list-style-type: decimal !important;
          display: block !important;
        }

        .rich-text-editor [contenteditable="true"] li,
        .rich-text-editor .rich-editor-content li {
          margin: 0.5rem 0 !important;
          color: ${theme.colors.text.secondary} !important;
          line-height: 1.6 !important;
          display: list-item !important;
          list-style-position: outside !important;
        }

        .rich-text-editor [contenteditable="true"] blockquote,
        .rich-text-editor .rich-editor-content blockquote {
          border-left: 4px solid ${theme.colors.primary} !important;
          padding: 1rem 1.5rem !important;
          margin: 1.5rem 0 !important;
          font-style: italic !important;
          color: ${theme.colors.text.secondary} !important;
          background-color: ${theme.colors.background.secondary} !important;
          display: block !important;
          border-radius: 0 8px 8px 0 !important;
          position: relative !important;
        }

        .rich-text-editor [contenteditable="true"] blockquote:before,
        .rich-text-editor .rich-editor-content blockquote:before {
          content: '"';
          font-size: 3rem !important;
          color: ${theme.colors.primary} !important;
          position: absolute !important;
          top: -0.5rem !important;
          left: 0.5rem !important;
          opacity: 0.3 !important;
        }

        .rich-text-editor [contenteditable="true"] strong,
        .rich-text-editor .rich-editor-content strong {
          font-weight: 600 !important;
          color: ${theme.colors.text.primary} !important;
        }

        .rich-text-editor [contenteditable="true"] em,
        .rich-text-editor .rich-editor-content em {
          font-style: italic !important;
        }

        .rich-text-editor [contenteditable="true"] u,
        .rich-text-editor .rich-editor-content u {
          text-decoration: underline !important;
          text-decoration-color: ${theme.colors.primary} !important;
        }

        .rich-text-editor [contenteditable="true"] a,
        .rich-text-editor .rich-editor-content a {
          color: ${theme.colors.primary} !important;
          text-decoration: underline !important;
        }

        .rich-text-editor [contenteditable="true"] a:hover,
        .rich-text-editor .rich-editor-content a:hover {
          opacity: 0.8 !important;
        }

        /* Improve selection appearance */
        .rich-text-editor .rich-editor-content ::selection {
          background-color: ${theme.colors.primary}30 !important;
        }

        /* Better focus states for toolbar buttons */
        .rich-text-editor button:focus {
          outline: 2px solid ${theme.colors.primary} !important;
          outline-offset: 2px !important;
        }

        /* Smooth transitions */
        .rich-text-editor button,
        .rich-text-editor select {
          transition: all 0.2s ease !important;
        }

        .rich-text-editor button:hover {
          transform: translateY(-1px) !important;
        }

        /* Ensure styles are applied to dynamically created elements */
        .rich-text-editor .rich-text-styled {
          /* This class is added by mutation observer to force style recalculation */
        }

        /* Additional real-time formatting support */
        .rich-text-editor [contenteditable="true"] * {
          /* Ensure all child elements inherit proper styling */
        }
      `}</style>
    </div>
  );
}
