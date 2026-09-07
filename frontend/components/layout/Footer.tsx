import React from "react";
import { GlobeIcon } from "@/components/ui/Icons";

export function Footer() {
  return (
    <footer className="w-full bg-surface-soft border-t border-hairline-soft mt-auto">
      <div className="max-w-[2520px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-10">
        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-hairline-soft">
          <div>
            <h4 className="text-sm font-semibold text-ink mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-bodytext">
              <li><a href="#help" className="hover:underline">Help Centre</a></li>
              <li><a href="#aircover" className="hover:underline">AirCover</a></li>
              <li><a href="#anti-discrimination" className="hover:underline">Anti-discrimination</a></li>
              <li><a href="#disability" className="hover:underline">Disability support</a></li>
              <li><a href="#cancellation" className="hover:underline">Cancellation options</a></li>
              <li><a href="#neighbourhood" className="hover:underline">Report neighbourhood concern</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink mb-4">Hosting</h4>
            <ul className="space-y-3 text-sm text-bodytext">
              <li><a href="/host" className="hover:underline">Airbnb your home</a></li>
              <li><a href="#aircover-hosts" className="hover:underline">AirCover for Hosts</a></li>
              <li><a href="#resources" className="hover:underline">Hosting resources</a></li>
              <li><a href="#forum" className="hover:underline">Community forum</a></li>
              <li><a href="#responsibly" className="hover:underline">Hosting responsibly</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink mb-4">Airbnb</h4>
            <ul className="space-y-3 text-sm text-bodytext">
              <li><a href="#newsroom" className="hover:underline">Newsroom</a></li>
              <li><a href="#features" className="hover:underline">New features</a></li>
              <li><a href="#careers" className="hover:underline">Careers</a></li>
              <li><a href="#investors" className="hover:underline">Investors</a></li>
              <li><a href="#emergency" className="hover:underline">Airbnb.org emergency stays</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Band */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-bodytext">
          <div className="flex flex-wrap items-center gap-2 text-center md:text-left">
            <span>© 2026 Airbnb, Inc.</span>
            <span>·</span>
            <a href="#privacy" className="hover:underline">Privacy</a>
            <span>·</span>
            <a href="#terms" className="hover:underline">Terms</a>
            <span>·</span>
            <a href="#sitemap" className="hover:underline">Sitemap</a>
            <span>·</span>
            <a href="#company" className="hover:underline">Company details</a>
          </div>

          <div className="flex items-center gap-6 font-semibold text-ink">
            <button className="flex items-center gap-2 hover:underline">
              <GlobeIcon className="w-4 h-4" />
              <span>English (IN)</span>
            </button>
            <button className="hover:underline">
              <span>₹ INR</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
