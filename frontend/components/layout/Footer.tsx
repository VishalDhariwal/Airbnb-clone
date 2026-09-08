"use client";

import React from "react";
import { GlobeIcon } from "@/components/ui/Icons";

export function Footer() {
  return (
    <footer className="w-full bg-[#f7f7f7] border-t border-hairline mt-auto text-ink">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 py-12">
        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-hairline">
          {/* Column 1: Support */}
          <div>
            <h4 className="text-sm font-semibold text-ink mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-bodytext">
              <li><a href="#help" className="hover:underline">Help Centre</a></li>
              <li><a href="#safety" className="hover:underline">Get help with a safety issue</a></li>
              <li><a href="#aircover" className="hover:underline">AirCover</a></li>
              <li><a href="#anti-discrimination" className="hover:underline">Anti-discrimination</a></li>
              <li><a href="#disability" className="hover:underline">Disability support</a></li>
              <li><a href="#cancellation" className="hover:underline">Cancellation options</a></li>
              <li><a href="#neighbourhood" className="hover:underline">Report neighbourhood concern</a></li>
            </ul>
          </div>

          {/* Column 2: Hosting */}
          <div>
            <h4 className="text-sm font-semibold text-ink mb-4">Hosting</h4>
            <ul className="space-y-3 text-sm text-bodytext">
              <li><a href="/host" className="hover:underline">Airbnb your home</a></li>
              <li><a href="#experience" className="hover:underline">Airbnb your experience</a></li>
              <li><a href="#service" className="hover:underline">Airbnb your service</a></li>
              <li><a href="#aircover-hosts" className="hover:underline">AirCover for Hosts</a></li>
              <li><a href="#resources" className="hover:underline">Hosting resources</a></li>
              <li><a href="#forum" className="hover:underline">Community forum</a></li>
              <li><a href="#responsibly" className="hover:underline">Hosting responsibly</a></li>
              <li><a href="#class" className="hover:underline">Join a free hosting class</a></li>
              <li><a href="#cohost" className="hover:underline">Find a co-host</a></li>
              <li><a href="#refer" className="hover:underline">Refer a host</a></li>
            </ul>
          </div>

          {/* Column 3: Airbnb */}
          <div>
            <h4 className="text-sm font-semibold text-ink mb-4">Airbnb</h4>
            <ul className="space-y-3 text-sm text-bodytext">
              <li><a href="#release" className="hover:underline">2026 Summer Release</a></li>
              <li><a href="#newsroom" className="hover:underline">Newsroom</a></li>
              <li><a href="#careers" className="hover:underline">Careers</a></li>
              <li><a href="#investors" className="hover:underline">Investors</a></li>
              <li><a href="#emergency" className="hover:underline">Airbnb.org emergency stays</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-bodytext">
          {/* Left: Copyright & Legal */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <span>© 2026 Airbnb, Inc.</span>
            <span>·</span>
            <a href="#privacy" className="hover:underline">Privacy</a>
            <span>·</span>
            <a href="#terms" className="hover:underline">Terms</a>
            <span>·</span>
            <a href="#company" className="hover:underline">Company details</a>
          </div>

          {/* Right: Currency, Language & Socials */}
          <div className="flex items-center gap-6 text-sm font-semibold text-ink">
            <button className="flex items-center gap-2 hover:underline">
              <GlobeIcon className="w-4 h-4" />
              <span>English (IN)</span>
            </button>
            <button className="hover:underline">
              <span>₹ INR</span>
            </button>

            {/* Social Icons */}
            <div className="flex items-center gap-4 text-ink ml-1">
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-70 transition">
                <svg viewBox="0 0 32 32" className="w-4 h-4 fill-current">
                  <path d="M29.5 0h-27A2.5 2.5 0 0 0 0 2.5v27A2.5 2.5 0 0 0 2.5 32h14.54V19.61h-4.17v-4.83h4.17v-3.56c0-4.13 2.52-6.38 6.2-6.38 1.76 0 3.28.13 3.72.19v4.31h-2.55c-2 0-2.39.95-2.39 2.35v3.09h4.77l-.62 4.83h-4.15V32h8.13a2.5 2.5 0 0 0 2.5-2.5v-27A2.5 2.5 0 0 0 29.5 0z" />
                </svg>
              </a>
              {/* X / Twitter */}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:opacity-70 transition">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-70 transition">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
