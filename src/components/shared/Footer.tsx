"use client";

import Link from "next/link";
import {
  Heart,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Social icons (inline SVG — lucide removed brand icons)              */
/* ------------------------------------------------------------------ */

const FacebookIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
  </svg>
);

const InstagramIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const TwitterIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Link data                                                           */
/* ------------------------------------------------------------------ */

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
  { label: "Vendor Hub", href: "/vendors" },
  { label: "Sign In", href: "/signin" },
  { label: "Sign Up", href: "/signup" },
];

const dashboardLinks = [
  { label: "Customer Dashboard", href: "/dashboard" },
  { label: "Vendor Dashboard", href: "/dashboard" },
  { label: "Admin Dashboard", href: "/dashboard" },
];

const categories = [
  { label: "Photography & Videography", href: "/services?category=Photography%20%26%20Videography" },
  { label: "Wedding Venues", href: "/services?category=Wedding%20Venues" },
  { label: "Decoration & Florist", href: "/services?category=Decoration%20%26%20Florist" },
  { label: "Catering Services", href: "/services?category=Catering%20Services" },
  { label: "Makeup & Styling", href: "/services?category=Makeup%20%26%20Styling" },
  { label: "Wedding Fashion", href: "/services?category=Wedding%20Fashion" },
];

const contactInfo = [
  { icon: MapPin, text: "123 Wedding Avenue, New York, NY 10001" },
  { icon: Phone, text: "+1 (555) 123-4567" },
  { icon: Mail, text: "support@wedplan.com" },
];

const socialLinks = [
  { icon: FacebookIcon, label: "Facebook", href: "https://facebook.com" },
  { icon: InstagramIcon, label: "Instagram", href: "https://instagram.com" },
  { icon: TwitterIcon, label: "Twitter", href: "https://twitter.com" },
  { icon: YoutubeIcon, label: "YouTube", href: "https://youtube.com" },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#1c0f12] text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Top area — 4 columns */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1 — Logo + short description + socials */}
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7a1f2b]">
                <Heart className="h-5 w-5 fill-white text-white" />
              </span>
              <span className="font-bold text-white">WedPlan</span>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              WedPlan is your trusted wedding marketplace — discover verified
              vendors, request bookings, and plan your dream celebration all in
              one place.
            </p>

            {/* Social media links */}
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-300 transition-colors hover:bg-[#7a1f2b] hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* 2 — Quick links */}
          <div>
            <h3 className="font-display text-base font-bold text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3 — Categories */}
          <div>
            <h3 className="font-display text-base font-bold text-white">
              Service Categories
            </h3>
            <ul className="mt-4 space-y-2.5">
              {categories.map((category) => (
                <li key={category.label}>
                  <Link
                    href={category.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4 — Contact information */}
          <div>
            <h3 className="font-display text-base font-bold text-white">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-3">
              {contactInfo.map((contact) => {
                const Icon = contact.icon;

                return (
                  <li key={contact.text} className="flex items-start gap-2.5">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#c9a227]" />
                    <span className="text-sm leading-relaxed text-gray-400">
                      {contact.text}
                    </span>
                  </li>
                );
              })}
            </ul>

            <h3 className="mt-6 font-display text-base font-bold text-white">
              For Vendors
            </h3>
            <ul className="mt-3 space-y-2.5">
              {dashboardLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom — copyright */}
        <div className="mt-12 border-t border-white/10 pt-6 text-center text-sm text-gray-500">
          © 2026 WedPlan. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
