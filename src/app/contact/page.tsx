"use client";

import {useState} from "react";
import {contactData} from "@/data/contact";
import {theme} from "@/config/theme";
import Navebar from "../components/Navbar";
import Footer from "../components/Footer";
import * as Fa from "react-icons/fa";
import * as Md from "react-icons/md";

// Icon mapping
const IconMap: { [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>> } = {
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

export default function Page() {
  const [currentLanguage, setCurrentLanguage] = useState("en");

  // Add helper function for text alignment
  const getTextAlignment = (lang: string) => {
    return lang === "ur" ? "text-right" : "text-left";
  };
  // Update formData to match all fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    phone: "",
    subject: "",
    organization: "",
  });
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
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send message");

      setStatus({loading: false, error: null, success: true});
      setFormData({
        name: "",
        email: "",
        message: "",
        phone: "",
        subject: "",
        organization: "",
      });
      setTimeout(() => setStatus((prev) => ({...prev, success: false})), 5000);
    } catch (error) {
      console.log("API error message", error)
      setStatus({loading: false, error: "Failed to send message. Please try again later.", success: false});
      setTimeout(() => setStatus((prev) => ({...prev, error: null})), 5000);
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = IconMap[iconName];
    return Icon ? <Icon className="w-7 h-7" /> : null;
  };

  return (
    <>
      <Navebar />
      <div className={currentLanguage === "ur" ? "rtl" : "ltr"}>
        {/* Hero Image */}
        <div className="relative h-[calc(100vh-20rem)]">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
            style={{
              backgroundImage: 'url("/images/community-hero.jpeg")',
              filter: "brightness(0.8)",
            }}
          />
          <div className="absolute inset-0 bg-black/20" />

          {/* Floating Card Title */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-4xl px-4 z-10">
            <div className="bg-white rounded-3xl shadow-2xl p-10">
              <div className={`text-center ${currentLanguage === "ur" ? "rtl" : "ltr"}`}>
                <h1
                  className="text-5xl font-bold mb-4"
                  style={{
                    color: theme.colors.primary,
                    fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                    direction: currentLanguage === "ur" ? "rtl" : "ltr",
                  }}
                >
                  {contactData.title[currentLanguage as keyof typeof contactData.title]}
                </h1>
                <p
                  className="text-xl max-w-2xl mx-auto"
                  style={{
                    color: theme.colors.text.secondary,
                    fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                    direction: currentLanguage === "ur" ? "rtl" : "ltr",
                  }}
                >
                  {contactData.subtitle[currentLanguage as keyof typeof contactData.subtitle]}
                </p>
                <div className="flex justify-center space-x-4 mt-4">
                  <button onClick={() => setCurrentLanguage("en")} className={`px-6 py-2 rounded-lg transition-all duration-300 ${currentLanguage === "en" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`} style={{backgroundColor: currentLanguage === "en" ? theme.colors.primary : undefined}}>
                    English
                  </button>
                  <button onClick={() => setCurrentLanguage("ur")} className={`px-6 py-2 rounded-lg transition-all duration-300 ${currentLanguage === "ur" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`} style={{backgroundColor: currentLanguage === "ur" ? theme.colors.primary : undefined,
                    fontFamily: theme.fonts.ur.primary,
                  }}>
                    اردو
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Adjust top padding of content section */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-32">
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Info Section */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl p-10 h-full transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  {Object.entries(contactData.contactInfo).map(([key, info]) => (
                    <a
                      key={key}
                      href={info.url}
                      className="mb-10 last:mb-0 group cursor-pointer block"
                      target={key === 'address' ? '_blank' : undefined}
                      rel={key === 'address' ? 'noopener noreferrer' : undefined}
                    >
                      <div className={`flex items-center mb-4 ${currentLanguage === "ur" ? "flex-row-reverse" : ""}`}>
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${currentLanguage === "ur" ? "ml-4" : "mr-4"}`} 
                             style={{backgroundColor: `${theme.colors.primary}15`, color: theme.colors.primary}}>
                          {getIcon(info.icon)}
                        </div>
                        <h3 className="text-2xl font-semibold transition-colors duration-300 group-hover:text-primary"
                            style={{color: theme.colors.text.primary, textAlign: currentLanguage === "ur" ? "right" : "left",
                                fontFamily: currentLanguage === "ur"? theme.fonts.ur.primary : theme.fonts.en.primary,
                            }}>
                          {info.label[currentLanguage as keyof typeof info.label]}
                        </h3>
                      </div>
                      <p className={`text-xl transition-all duration-300 ${currentLanguage === "ur" ? "pr-20 group-hover:pr-24" : "pl-20 group-hover:pl-24"}`} 
                         style={{color: theme.colors.text.secondary}}>
                        {typeof info.value === "string" ? info.value : info.value[currentLanguage as keyof typeof info.value]}
                      </p>
                    </a>
                  ))}
                </div>
              </div>

              {/* Form Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h2 className={`text-3xl font-bold mb-8 ${getTextAlignment(currentLanguage)}`} style={{color: theme.colors.text.primary}}>
                    {contactData.form.title[currentLanguage as keyof typeof contactData.form.title]}
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${currentLanguage === "ur" ? "rtl" : ""}`}>
                      {Object.entries(contactData.form)
                        .sort((a, b) => {
                          if (currentLanguage === "ur") {
                            // Swap email and name fields in Urdu
                            if (a[0] === "email" && b[0] === "name") return -1;
                            if (a[0] === "name" && b[0] === "email") return 1;
                          }
                          return 0;
                        })
                        .map(([key, field]) => {
                          if (key === "submitButton" || key === "title" || key === "successMessage" || key === "errorMessage" || key === "loadingMessage") return null;

                          const isFullWidth = key === "message" || key === "subject";

                          return (
                            <div key={key} className={`${isFullWidth ? "md:col-span-2" : ""}`}>
                              <label className={`block text-sm font-medium mb-2 ${getTextAlignment(currentLanguage)}`} style={{color: theme.colors.text.primary,
                                fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,

                              }}>
                                {typeof field === "object" && "label" in field ? field.label[currentLanguage as keyof typeof field.label] : ""}
                              </label>
                              {key === "message" ? (
                                <textarea
                                  value={formData[key as keyof typeof formData]}
                                  onChange={(e) => setFormData({...formData, [key]: e.target.value})}
placeholder={typeof field === "object" && "placeholder" in field ? field.placeholder[currentLanguage as keyof typeof field.placeholder] : ""}
                                  rows={12}
                                  className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-opacity-50 transition-all duration-300 ${getTextAlignment(currentLanguage)}`}
                                  style={{
                                    borderColor: theme.colors.text.secondary,
                                    backgroundColor: "white",
                                    color: theme.colors.text.primary,
                                    direction: currentLanguage === "ur" ? "rtl" : "ltr",
                                    textAlign: currentLanguage === "ur" ? "right" : "left",
                                    fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,

                                  }}
                                  required
                                />
                              ) : (
                                <input
                                  type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                                  value={formData[key as keyof typeof formData]}
                                  onChange={(e) => setFormData({...formData, [key]: e.target.value})}
placeholder={typeof field === "object" && "placeholder" in field ? field.placeholder[currentLanguage as keyof typeof field.placeholder] : ""}
                                  className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-opacity-50 transition-all duration-300 ${getTextAlignment(currentLanguage)}`}
                                  style={{
                                    borderColor: theme.colors.text.secondary,
                                    backgroundColor: "white",
                                    color: theme.colors.text.primary,
                                    direction: currentLanguage === "ur" ? "rtl" : "ltr",
                                    textAlign: currentLanguage === "ur" ? "right" : "left",
                                    fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,

                                  }}
                                  required
                                />
                              )}
                            </div>
                          );
                        })}
                    </div>

                    {/* Status messages and submit button remain the same */}
                    {status.error && <div className="text-red-500 text-sm text-center">{status.error}</div>}

                    {status.success && <div className="text-green-500 text-sm text-center">{contactData.form.successMessage[currentLanguage as keyof typeof contactData.form.successMessage]}</div>}

                    <button type="submit" disabled={status.loading} className="w-full py-4 px-6 rounded-xl text-white font-medium text-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" style={{backgroundColor: theme.colors.primary,
                        fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,

                    }}>
                      {status.loading ? contactData.form.loadingMessage[currentLanguage as keyof typeof contactData.form.loadingMessage] : contactData.form.submitButton[currentLanguage as keyof typeof contactData.form.submitButton]}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Follow Us Section - Full Width */}
            <div className="mt-12">
              <div className="bg-white rounded-2xl shadow-xl p-10 transform transition-all duration-300 hover:shadow-2xl">
                <h3 className={`text-2xl font-bold mb-8 ${getTextAlignment(currentLanguage)}`} style={{color: theme.colors.text.primary, fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary}}>
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
                      <span className={`text-lg font-medium transition-colors duration-300 group-hover:text-primary ${getTextAlignment(currentLanguage)}`}
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

            {/* Office Locations Section */}
            <div className="mt-16">
              <h2
                className={`text-3xl font-bold mb-8 ${getTextAlignment(currentLanguage)}`}
                style={{
                  color: theme.colors.text.primary,
                  textAlign: currentLanguage === "ur" ? "right" : "left",
                  fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                }}
              >
                {contactData.offices.title[currentLanguage as keyof typeof contactData.offices.title]}
              </h2>
              <div
                className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8`}
                style={{
                  direction: currentLanguage === "ur" ? "rtl" : "ltr",
                  display: "grid",
                  gridAutoFlow: currentLanguage === "ur" ? "dense" : "row",
                }}
              >
                {[...contactData.offices.locations].reverse().map((office, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    <h3
                      className={`text-2xl font-bold mb-4 ${getTextAlignment(currentLanguage)}`}
                      style={{
                        color: theme.colors.primary,
                        textAlign: currentLanguage === "ur" ? "right" : "left",
                        fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                      }}
                    >
                      {office.title[currentLanguage as keyof typeof office.title]}
                    </h3>
                    <div className="space-y-4">
                      <p className={`flex items-start ${currentLanguage === "ur" ? "flex-row-revers" : ""}`}>
                        <span className={`${currentLanguage === "ur" ? "ml-3" : "mr-3"} mt-1 flex-shrink-0`} style={{color: theme.colors.primary}}>
                          {getIcon(office.icons.location)}
                        </span>
                        <span
                          className={`text-gray-600 ${getTextAlignment(currentLanguage)}`}
                          style={{
                            color: theme.colors.text.secondary,
                            fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                          }}
                        >
                          {office.address[currentLanguage as keyof typeof office.address]}
                        </span>
                      </p>
                      <div className={`flex items-start ${currentLanguage === "ur" ? "flex-row-revers" : ""}`}>
                        <span className={`${currentLanguage === "ur" ? "ml-3" : "mr-3"} mt-1 flex-shrink-0`} style={{color: theme.colors.primary}}>
                          {getIcon(office.icons.person)}
                        </span>
                        <div className={getTextAlignment(currentLanguage)}>
                          <p className="font-medium" style={{color: theme.colors.text.primary, fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary, fontWeight: currentLanguage === "ur" ? "bold" : "bold"}}>
                            {office.incharge.name[currentLanguage as keyof typeof office.incharge.name]}
                          </p>
                          <p
                            className="text-gray-600"
                            style={{
                              color: theme.colors.text.secondary,
                              fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary,
                            }}
                          >
                            {office.incharge.designation[currentLanguage as keyof typeof office.incharge.designation]}
                          </p>
                        </div>
                      </div>
                      <p className={`flex items-center ${currentLanguage === "ur" ? "flex-row-revers" : ""}`}>
                        <span className={`${currentLanguage === "ur" ? "ml-3" : "mr-3"} flex-shrink-0`} style={{color: theme.colors.primary, fontFamily: currentLanguage === "ur" ? theme.fonts.ur.primary : theme.fonts.en.primary}}>
                          {getIcon(office.icons.phone)}
                        </span>
                        <a 
                          href={`tel:${office.contact.phone}`}
                          className={`text-gray-600 hover:text-primary transition-colors duration-300 ${getTextAlignment(currentLanguage)}`}
                          style={{
                            color: theme.colors.text.primary,
                            fontFamily: theme.fonts.en.primary,
                            direction: currentLanguage === "ur" ? "ltr" : "ltr",
                          }}
                        >
                          {office.contact.phone}
                        </a>
                      </p>
                      <p className={`flex items-center ${currentLanguage === "ur" ? "flex-row-revers" : ""}`}>
                        <span className={`${currentLanguage === "ur" ? "ml-3" : "mr-3"} flex-shrink-0`} style={{color: theme.colors.primary}}>
                          {getIcon(office.icons.email)}
                        </span>
                        <a
                          href={`mailto:${office.contact.email}`}
                          className={`text-gray-600 hover:text-primary transition-colors duration-300 ${getTextAlignment(currentLanguage)}`}
                          style={{
                            color: theme.colors.text.primary,
                            fontFamily: theme.fonts.en.primary,
                            direction: currentLanguage === "ur" ? "ltr" : "ltr",
                          }}
                        >
                          {office.contact.email}
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
