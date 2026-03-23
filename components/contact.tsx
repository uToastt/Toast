"use client";

import { Mail, MessageCircle, Send, Youtube, Twitter, Instagram, Twitch } from "lucide-react";
import Link from "next/link";

const socials = [
  { icon: Youtube, label: "YouTube", href: "https://youtube.com", followers: "1.2M" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com", followers: "450K" },
  { icon: Instagram, label: "Instagram", href: "https://instagram.com", followers: "320K" },
  { icon: Twitch, label: "Twitch", href: "https://twitch.tv", followers: "280K" },
];

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left - Contact Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-primary font-display uppercase tracking-widest text-sm font-semibold">
                Contact
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground text-balance">
                {"Let's"} <span className="text-primary">Connect</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Have a question, business inquiry, or just want to say hi? {"I'd"} love to hear from you. For business inquiries, please email me directly.
              </p>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Business Inquiries</p>
                <p className="font-semibold text-foreground">hello@toastmc.com</p>
              </div>
            </div>

            {/* Discord */}
            <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Join the Community</p>
                <Link href="#" className="font-semibold text-primary hover:underline">
                  discord.gg/toast
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
                Social Media
              </p>
              <div className="grid grid-cols-2 gap-4">
                {socials.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border hover:border-primary/50 transition-all group"
                  >
                    <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <div>
                      <p className="font-medium text-foreground text-sm">{social.label}</p>
                      <p className="text-xs text-muted-foreground">{social.followers} followers</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="bg-card p-8 rounded-2xl border border-border">
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">
              Send a Message
            </h3>
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-foreground">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  placeholder="What's this about?"
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Your message..."
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-all hover:scale-[1.02]"
              >
                <Send className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
