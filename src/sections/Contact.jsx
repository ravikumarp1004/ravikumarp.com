import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../components/Button";
import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { contactInfo, availability } from "../data/contact";
import { profile } from "../data/profile";

export const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: "" });
  const [statusVisible, setStatusVisible] = useState(false);

  useEffect(() => {
    if (submitStatus.type) {
      setStatusVisible(true);
      const hideTimer = setTimeout(() => setStatusVisible(false), 3000);
      const clearTimer = setTimeout(() => setSubmitStatus({ type: null, message: "" }), 3500);
      return () => {
        clearTimeout(hideTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [submitStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error(
          "EmailJS is not configured. Please set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY.",
        );
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          reply_to: formData.email,
        },
        publicKey,
      );

      setSubmitStatus({
        type: "success",
        message: "Thank you for your message. I will get back to you shortly.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setSubmitStatus({
        type: "error",
        message: err?.text || err?.message || "Failed to send message. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-5 md:py-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-highlight/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full max-w-full">
        <div className="text-center max-w-3xl mx-auto mb-6">
          <span className="text-secondary-foreground text-sm font-medium tracking-wider uppercase animate-fade-in">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 animate-fade-in animation-delay-100 text-secondary-foreground">
            Let's <span className="font-serif italic font-normal text-white">work together.</span>
          </h2>
          <p className="text-muted-foreground animate-fade-in animation-delay-200">
            If my work aligns with your requirements, feel free to reach out. I'm open to
            opportunities in Communications (Exstream), Cloud-Native, and cloud application roles.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Form */}
          <div className="glass rounded-3xl p-5 sm:p-8 animate-fade-in animation-delay-300 w-full max-w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name..."
                  className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Your message..."
                  className="w-full px-4 py-3 bg-surface rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                />
              </div>

              <Button className="w-full" type="submit" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>Sending...</>
                ) : (
                  <>
                    Get in Touch
                    <Send className="w-5 h-5" />
                  </>
                )}
              </Button>

              {submitStatus.type && (
                <div
                  className={`flex items-center gap-3 p-4 rounded-xl transition-opacity duration-500 ${
                    statusVisible ? "opacity-100" : "opacity-0"
                  } ${
                    submitStatus.type === "success"
                      ? "bg-green-500/10 border border-green-500/20 text-green-400"
                      : "bg-red-500/10 border border-red-500/20 text-red-400"
                  }`}
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <p className="text-sm">{submitStatus.message}</p>
                </div>
              )}
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6 animate-fade-in animation-delay-400">
            <div className="glass rounded-3xl p-5 sm:p-8 w-full max-w-full">
              <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-4">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-surface transition-colors group min-w-0"
                  >
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium break-all sm:break-normal">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Toggle profile.showAvailabilityCard in src/data/profile.ts to re-enable */}
            {profile.showAvailabilityCard && (
              <div className="glass rounded-3xl p-5 sm:p-8 border border-primary/30 w-full max-w-full">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium">{availability.status}</span>
                </div>
                <p className="text-muted-foreground text-sm">{availability.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
