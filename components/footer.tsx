"use client";

import Link from "next/link";
import { Youtube, Twitter, Instagram, Twitch, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="font-display font-bold text-xl text-primary-foreground">T</span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">TOAST</span>
            </Link>
            <p className="text-muted-foreground max-w-sm">
              Minecraft content creator bringing epic adventures, insane builds, and unforgettable gaming moments to millions of viewers worldwide.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
                { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                { icon: Twitch, href: "https://twitch.tv", label: "Twitch" },
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "About", "Videos", "Merch", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`#${item.toLowerCase()}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Resources</h4>
            <ul className="space-y-2">
              {["Discord Server", "Twitch Stream", "Business Inquiries", "Press Kit", "FAQ"].map(
                (item) => (
                  <li key={item}>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Toast. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary fill-current" /> for the gaming community
          </p>
        </div>
      </div>
    </footer>
  );
}
