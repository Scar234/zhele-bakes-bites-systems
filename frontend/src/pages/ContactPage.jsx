import { useState } from 'react';
import { BUSINESS_PHONE, BUSINESS_EMAIL, BUSINESS_WHATSAPP } from '../config/business';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!BUSINESS_EMAIL) {
      setSubmitError('The contact form is not connected yet. Please configure VITE_BUSINESS_EMAIL before launch.');
      return;
    }

    const subject = encodeURIComponent(`Zhele Bakes & Bites — ${formData.subject}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email || 'Not provided'}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:${BUSINESS_EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const whatsappUrl = BUSINESS_WHATSAPP
    ? `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent('Hello Zhele Bakes & Bites! I would like to inquire about customized orders or event catering.')}`
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C8874A] block">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#4B2E2B] font-display">
          We&rsquo;d Love to Hear From You
        </h1>
        <p className="text-xs sm:text-sm text-[#776D68] leading-relaxed">
          Questions about custom birthday cakes, bulk event catering, or daily campus deliveries? Reach out using the contact options configured below, or prepare a message using the form.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Info Card */}
        <div className="lg:col-span-5 bg-[#4B2E2B] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border border-[#C8874A]/30">
          <div>
            <h3 className="text-xl font-black font-display text-white mb-2">
              Bakehouse &amp; Counter
            </h3>
            <p className="text-xs text-[#F4D7C4]/80 leading-relaxed">
              We operate daily serving Daystar University campus, Athi River town, and greater Nairobi.
            </p>
          </div>

          <div className="space-y-4 pt-2 text-xs">
            {/* Phone */}
            {BUSINESS_PHONE && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#C8874A]/20 border border-[#C8874A]/40 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-[#C8874A]" />
                </div>
                <div>
                  <span className="font-bold text-[#F4D7C4] block uppercase text-[10px]">Call Us Directly</span>
                  <a href={`tel:${BUSINESS_PHONE}`} className="text-sm font-extrabold text-white hover:text-[#C8874A] transition-colors">{BUSINESS_PHONE}</a>
                </div>
              </div>
            )}

            {/* WhatsApp */}
            {BUSINESS_WHATSAPP && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-500/20 border border-green-500/40 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <span className="font-bold text-[#F4D7C4] block uppercase text-[10px]">Instant WhatsApp Chat</span>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-green-300 hover:text-green-200 transition-colors block mt-0.5">Start WhatsApp Message →</a>
                </div>
              </div>
            )}

            {/* Email */}
            {BUSINESS_EMAIL && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#C8874A]/20 border border-[#C8874A]/40 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#C8874A]" />
                </div>
                <div>
                  <span className="font-bold text-[#F4D7C4] block uppercase text-[10px]">Email Inquiries</span>
                  <a href={`mailto:${BUSINESS_EMAIL}`} className="text-xs font-extrabold text-white hover:text-[#C8874A] transition-colors">{BUSINESS_EMAIL}</a>
                </div>
              </div>
            )}

            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C8874A]/20 border border-[#C8874A]/40 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#C8874A]" />
              </div>
              <div>
                <span className="font-bold text-[#F4D7C4] block uppercase text-[10px]">
                  Main Location
                </span>
                <p className="text-xs font-medium text-[#F4D7C4]/90">
                  Daystar Main Campus &amp; Athi River / Nairobi, Kenya
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#C8874A]/20 border border-[#C8874A]/40 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[#C8874A]" />
              </div>
              <div>
                <span className="font-bold text-[#F4D7C4] block uppercase text-[10px]">
                  Bakery Operating Hours
                </span>
                <p className="text-xs font-medium text-[#F4D7C4]/90">
                  Monday – Saturday: 7:00 AM – 9:00 PM
                </p>
                <p className="text-xs font-medium text-[#F4D7C4]/70">
                  Sunday: 8:00 AM – 7:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#EEDCCB] shadow-sm space-y-4">
          <h3 className="text-xl font-extrabold text-[#4B2E2B] font-display">
            Send Our Bakers a Message
          </h3>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-2xl text-center space-y-2 animate-in fade-in">
              <CheckCircle2 className="w-10 h-10 text-[#00A859] mx-auto" />
              <h4 className="font-extrabold text-base">Asante Sana! Message Received</h4>
              <p className="text-xs text-green-700">
                Your email app should open with a prepared draft. Please review it and press Send there. This website has not sent the message automatically.
              </p>
            </div>
          ) : (
            <>
            {submitError && <p role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">{submitError}</p>}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-[#4B2E2B]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Gabriel Amani"
                    className="w-full p-3 rounded-xl bg-[#FAF4ED] border border-[#EEDCCB] text-[#292321] focus:outline-none focus:border-[#C8874A]"
                  />
                </div>

                <div>
                  <label className="block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 0712345678"
                    className="w-full p-3 rounded-xl bg-[#FAF4ED] border border-[#EEDCCB] text-[#292321] focus:outline-none focus:border-[#C8874A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full p-3 rounded-xl bg-[#FAF4ED] border border-[#EEDCCB] text-[#292321] focus:outline-none focus:border-[#C8874A]"
                  />
                </div>

                <div>
                  <label className="block mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#FAF4ED] border border-[#EEDCCB] text-[#292321] focus:outline-none focus:border-[#C8874A]"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Custom Cake Order">Custom Birthday/Wedding Cake</option>
                    <option value="Event Catering">Event / Graduation Catering</option>
                    <option value="Campus Delivery Question">Campus Delivery Question</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1">Your Message *</label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what you have in mind (flavors, date, number of people, etc.)..."
                  className="w-full p-3 rounded-xl bg-[#FAF4ED] border border-[#EEDCCB] text-[#292321] focus:outline-none focus:border-[#C8874A]"
                ></textarea>
              </div>

              <button
                type="submit"
                
                className="w-full py-3.5 bg-[#4B2E2B] hover:bg-[#2D150F] text-white font-extrabold text-xs rounded-full shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </form>
            </>
          )}
        </div>

      </div>

    </div>
  );
}
