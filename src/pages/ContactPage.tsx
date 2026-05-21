import React, { useEffect, useState } from "react";

import bg from "../assets/images/img_35.png"; // Top hero background
import contact_bg from "../assets/images/contact01.png"; // Second section background
import handsImage from "../assets/images/img_36.png"; // Hands holding beans
import location from "../assets/images/img_25.svg";
import phone from "../assets/images/img_26.svg";
import history from "../assets/images/img_27.svg";
import Header from "@/components/layout/Header";


import { submitContactForm, clearSubmitSuccess, clearContactError } from '@/store/slices/contactSlice';
import type { AppDispatch, RootState } from '@/store/store';
import { useDispatch, useSelector } from "react-redux";


const SendArrow = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
    <path
      d="M1 7L7 1M7 1H2M7 1V6"
      stroke="#474653"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ContactForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, submitSuccess, error } = useSelector((state: RootState) => state.contact);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const inputBase =
    "w-full px-4 sm:px-5 py-4 sm:py-5 rounded-[8px] outline outline-1 outline-[#474653] bg-transparent text-[#474653] placeholder-[rgba(71,70,83,0.60)] text-[0.9rem] sm:text-[clamp(0.95rem,1.5vw,1.25rem)] font-medium focus:outline-2 focus:outline-[#474653] transition-all";

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!form.name || !form.email || !form.subject || !form.message) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    dispatch(submitContactForm(form));
  };

  // Handle success/error messages
  useEffect(() => {
    if (submitSuccess) {
      setShowSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" }); // Reset form
      setTimeout(() => {
        setShowSuccess(false);
        dispatch(clearSubmitSuccess());
      }, 3000);
    }
  }, [submitSuccess, dispatch]);

  useEffect(() => {
    if (error) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        dispatch(clearContactError());
      }, 3000);
    }
  }, [error, dispatch]);

  return (
    <form
      className="flex flex-col justify-between h-full p-4 sm:p-5 md:p-6 bg-[#DDC6AD] shadow-[6px_28px_51.8px_rgba(0,0,0,0.08)] rounded-[16px] relative"
      onSubmit={handleSubmit}
      style={{ fontFamily: "'League Spartan', sans-serif" }}
    >
      {/* Success Message */}
      {showSuccess && (
        <div className="absolute top-4 left-4 right-4 bg-green-500 text-white p-3 rounded-lg z-10">
          Message sent successfully! We'll get back to you soon.
        </div>
      )}

      {/* Error Message */}
      {showError && (
        <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-3 rounded-lg z-10">
          {error || "Please fill all fields correctly."}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:gap-4 flex-1">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className={inputBase}
          disabled={loading}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          className={inputBase}
          disabled={loading}
          required
        />
        <input
          type="text"
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
          className={inputBase}
          disabled={loading}
          required
        />
        <textarea
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          className={`${inputBase} resize-none h-[160px] sm:h-[180px] md:h-[260px]`}
          disabled={loading}
          required
        />
      </div>

      <div className="flex justify-end mt-5 sm:mt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-[10px] bg-[#E19D5E] w-full justify-center hover:bg-[#d88f4f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-[#474653] text-[0.95rem] sm:text-[clamp(1rem,4vw,22px)] font-medium">
            {loading ? "Sending..." : "Send Message"}
          </span>
          <div className="w-7 h-7 sm:w-9 sm:h-9 bg-[#F7D5A0] rounded-full flex items-center justify-center flex-shrink-0">
            <SendArrow />
          </div>
        </button>
      </div>
    </form>
  );
};


const ContactPage = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent ">
      <Header />

      {/* ==================== SECTION 1 - Hero with Heading ==================== */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[520px] lg:h-[620px] w-full">
        <img
          src={bg}
          alt="Coffee plantation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />

        {/* Hands Image - Responsive positioning */}
        <img
          src={handsImage}
          alt="Hands holding coffee beans"
          className="absolute 
             left-1/2 -translate-x-1/2 md:left-auto md:right-6 lg:right-40 md:translate-x-0
             right-2 sm:right-4 md:right-6 lg:right-40 
             bottom-[0px] md:bottom-[-60px] lg:bottom-[-60px] 
             w-[250px] md:w-[300px] lg:w-[560px] 
             z-10 drop-shadow-2xl opacity-70 sm:opacity-100"
        />

        {/* Get in Touch Heading - Responsive */}
        <div
          className="absolute bottom-4 sm:bottom-8 md:bottom-12 lg:bottom-6 
                  left-0 right-0 md:right-8 lg:right-20 
                  z-20 text-center md:text-right"
        >
          <h1
            className=" text-[50px] sm:text-[48px] md:text-[60px] lg:text-[100px] xl:text-[128px] 
                 font-bold leading-[1.2] sm:leading-[1.1] 
                 text-transparent 
                 drop-shadow-[0_4px_20px_rgba(0,0,0,0.65)] 
                 [-webkit-text-stroke-width:2px] sm:[-webkit-text-stroke-width:3px] md:[-webkit-text-stroke-width:4px] 
                 [-webkit-text-stroke-color:#F7D5A0]"
           style={{ fontFamily: "'League Spartan', sans-serif" }}
          >
            Get in Touch
          </h1>
        </div>
      </div>

      {/* ==================== SECTION 2 - Contact Details + Form ==================== */}
      <div className="relative z-0  lg:-mt-[260px] my-10">
        {/* Background Container */}
        <div className="relative min-h-[500px] sm:min-h-[600px] md:min-h-[800px] lg:h-[980px] w-full">
          {/* Contact Background Image */}
          <img
            src={contact_bg}
            alt="Contact background"
            className="absolute inset-0 w-full h-full object-cover object-center sm:object-cover"
          />

          {/* Content Card - Responsive positioning */}
          <div className="absolute left-0 right-0 mb-10 md:bottom-[-150px] lg:bottom-[-200px] px-3 sm:px-4 md:px-6">
            <div className="max-w-[1360px] mx-auto p-3 sm:p-4 md:p-6 lg:p-12 rounded-[16px] sm:rounded-[20px] grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-10 lg:gap-16 bg-black/10 sm:bg-black/10 backdrop-blur-[2px]">
              {/* Left - Contact Info */}
              <div className="flex-1 flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-12  sm:bg-transparent p-4 sm:p-0 rounded-[12px] sm:rounded-none">
                <p
                  className="text-[#474653] font-medium leading-relaxed text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] xl:text-[22px] max-w-full lg:max-w-md"
                  style={{ fontFamily: "'League Spartan', sans-serif" }}
                >
                  Have a question, feedback, or want to learn more about our
                  coffee and beans? We'd love to hear from you.
                </p>

                <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
                  <div className="flex items-start gap-3 sm:gap-4 md:gap-5">
                    <img
                      src={location}
                      alt="Location"
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mt-1 flex-shrink-0"
                    />
                    <div className="text-[#474653] text-[0.85rem] sm:text-[0.95rem] md:text-[1.05rem] lg:text-lg font-semibold leading-relaxed">
                      73 Fiesta Way Unit 1,
                      <br />
                      Whitby, ON L1P 0H9
                      <br />
                      Canada
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                    <img
                      src={phone}
                      alt="Phone"
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 flex-shrink-0"
                    />
                    <div className="text-[#474653] text-[0.85rem] sm:text-[0.95rem] md:text-[1.05rem] lg:text-lg font-semibold break-all">
                      +1 416-407-3677
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 md:gap-5">
                    <img
                      src={history}
                      alt="Hours"
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mt-1 flex-shrink-0"
                    />
                    <div className="text-[#474653] text-[0.85rem] sm:text-[0.95rem] md:text-[1.05rem] font-semibold leading-relaxed">
                      Mon – Thu: 8:00 am – 10:00 pm
                      <br />
                      Fri – Sat: 8:00 am – 11:00 pm
                      <br />
                      Sunday: 9:00 am – 10:00 pm
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Form */}
              <div className="w-full flex-shrink-0">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
