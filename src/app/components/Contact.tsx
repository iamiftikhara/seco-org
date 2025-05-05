"use client";

import {useState} from "react";
import emailjs from "@emailjs/browser";
import {contactData} from "@/data/contact";
import {theme} from "@/config/theme";
import * as Fa from "react-icons/fa";
import * as Md from "react-icons/md";

export default function Contact() {
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const initialFormData = {
    name: "",
    email: "",
    message: "",
  };
  const IconMap: {[key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>>} = {
    FaPhone: Fa.FaPhone,
    FaWhatsapp: Fa.FaWhatsapp,
    MdEmail: Md.MdEmail,
    FaMapMarkerAlt: Fa.FaMapMarkerAlt,
    FaFacebook: Fa.FaFacebook,
    FaTwitter: Fa.FaTwitter,
    FaInstagram: Fa.FaInstagram,
    FaLinkedin: Fa.FaLinkedin,
    FaUser: Fa.FaUser,
  };

  // Add state hook in correct location
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState({
    loading: false,
    error: null as string | null,
    success: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({loading: true, error: null, success: false});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus({loading: false, error: null, success: true});
      setFormData({name: "", email: "", message: ""});

      setTimeout(() => {
        setStatus((prev) => ({...prev, success: false}));
      }, 5000);
    } catch (error) {
      setStatus({
        loading: false,
        error: "Failed to send message. Please try again later.",
        success: false,
      });

      setTimeout(() => {
        setStatus((prev) => ({...prev, error: null}));
      }, 5000);
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = IconMap[iconName];
    return Icon ? <Icon className="w-7 h-7" /> : null;
  };

  return (
    <section id="contact" className="py-20" style={{backgroundColor: theme.colors.secondary}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-4xl font-bold mb-4"
            style={{
              color: theme.colors.text.primary,
              fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
            }}
          >
            {contactData.title[currentLanguage as keyof typeof contactData.title]}
          </h2>
          <p
            className="text-lg mb-4"
            style={{
              color: theme.colors.text.secondary,
              fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
            }}
          >
            {contactData.subtitle[currentLanguage as keyof typeof contactData.subtitle]}
          </p>
          <div className="w-20 h-1 mx-auto" style={{backgroundColor: theme.colors.primary}}></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 h-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            {Object.entries(contactData.contactInfo).map(([key, info]) => (
              <a key={key} href={info.url} className="mb-6 last:mb-0 group cursor-pointer block" target={key === "address" ? "_blank" : undefined} rel={key === "address" ? "noopener noreferrer" : undefined}>
                <div className={`flex items-center mb-2 ${currentLanguage === "ur" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${currentLanguage === "ur" ? "ml-3" : "mr-3"}`} style={{backgroundColor: `${theme.colors.primary}15`, color: theme.colors.primary}}>
                    {getIcon(info.icon)}
                  </div>
                  <h3 className="text-lg font-medium transition-colors duration-300 group-hover:text-primary" style={{color: theme.colors.text.primary, textAlign: currentLanguage === "ur" ? "right" : "left", fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary}}>
                    {info.label[currentLanguage as keyof typeof info.label]}
                  </h3>
                </div>
                <p className={`text-base transition-all duration-300 ${currentLanguage === "ur" ? "pr-14 group-hover:pr-16" : "pl-14 group-hover:pl-16"}`} style={{color: theme.colors.text.secondary}}>
                  {typeof info.value === "string" ? info.value : info.value[currentLanguage as keyof typeof info.value]}
                </p>
              </a>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-lg lg:col-span-2 p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className={`grid grid-cols-1 gap-4 ${currentLanguage === "ur" ? "rtl" : ""}`}>
                {["name", "email"].map((fieldKey) => {
                  const field = contactData.form[fieldKey as keyof typeof contactData.form];

                  return (
                    <div key={fieldKey}>
                      <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.primary}}>
                        {('label' in field) ? field.label[currentLanguage as keyof typeof field.label] : field[currentLanguage as keyof typeof field]}
                      </label>
                      <input
                        type={fieldKey === "email" ? "email" : "text"}
                        value={formData[fieldKey as keyof typeof formData]}
                        onChange={(e) => setFormData({...formData, [fieldKey]: e.target.value})}
                        placeholder={('placeholder' in field && field.placeholder) ? field.placeholder[currentLanguage as keyof typeof field.placeholder] : ''}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                        style={{borderColor: theme.colors.primary, color: theme.colors.text.primary, fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary}}
                        required
                      />
                    </div>
                  );
                })}
              </div>

              {/* Message textarea */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{color: theme.colors.text.primary}}>
                  {contactData.form.message.label[currentLanguage as keyof typeof contactData.form.message.label]}
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder={contactData.form.message.placeholder[currentLanguage as keyof typeof contactData.form.message.placeholder]}
                  rows={7}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                  style={{borderColor: theme.colors.primary, color: theme.colors.text.primary, fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary}}
                  required
                />
              </div>

              {/* Existing status messages and submit button remain unchanged */}
              {status.error && <div className="text-red-500 text-sm text-center">{status.error}</div>}

              {status.success && <div className="text-green-500 text-sm text-center">{contactData.form.successMessage[currentLanguage as keyof typeof contactData.form.successMessage]}</div>}

              <button type="submit" disabled={status.loading} className="w-full py-4 px-6 rounded-xl text-white font-medium text-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" style={{backgroundColor: theme.colors.primary, fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary}}>
                {status.loading ? contactData.form.loadingMessage[currentLanguage as keyof typeof contactData.form.loadingMessage] : contactData.form.submitButton[currentLanguage as keyof typeof contactData.form.submitButton]}
              </button>
            </form>
          </div>
        </div>
         {/* Follow Us Section - Full Width */}
         <div className="mt-12">
              <div className="bg-white rounded-2xl shadow-xl p-10 transform transition-all duration-300 hover:shadow-2xl">
                <h3 className={`text-2xl font-bold mb-8`} style={{color: theme.colors.text.primary, fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary}}>
                  {contactData.socialMedia.title[currentLanguage as keyof typeof contactData.socialMedia.title]}
                </h3>
                <div className={`grid grid-cols-2 md:grid-cols-5 gap-8 ${currentLanguage === 'ur' ? 'rtl' : ''}`}>
                  {contactData.socialMedia.platforms.map((platform, index) => (
                    <a
                      key={index}
                      href={platform.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center group ${currentLanguage === 'ur' ? 'flex-row-reverse justify-end' : 'space-x-5'}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                        currentLanguage === 'ur' ? 'ml-4' : ''
                      }`}
                        style={{ backgroundColor: `${theme.colors.primary}15`, color: theme.colors.primary }}>
                        {getIcon(platform.icon)}
                      </div>
                      <span className={`text-lg font-medium transition-colors duration-300 group-hover:text-primary`}
                        style={{ color: theme.colors.text.primary,
                            fontFamily: currentLanguage === "ur"? theme.fonts.ur.primary : theme.fonts.en.primary,
                         }}>
                        {platform.label[currentLanguage as keyof typeof platform.label]}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

      </div>
    </section>
  );
}
