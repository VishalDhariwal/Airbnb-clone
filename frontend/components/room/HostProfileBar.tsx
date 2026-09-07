"use client";

import React from "react";
import { HostSummary } from "@/lib/types";
import { UserAvatarIcon } from "@/components/ui/Icons";

interface HostProfileBarProps {
  host: HostSummary;
}

export function HostProfileBar({ host }: HostProfileBarProps) {
  return (
    <div className="pt-2 pb-6 border-b border-hairline">
      <div className="flex items-center gap-4">
        {/* Host Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden border border-hairline flex items-center justify-center bg-surface-soft flex-shrink-0">
          {host.avatar_url ? (
            <img
              src={host.avatar_url}
              alt={host.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserAvatarIcon className="w-6 h-6 text-muted" />
          )}
        </div>

        {/* Host Info */}
        <div>
          <h3 className="font-semibold text-base text-ink leading-tight">
            Hosted by {host.name}
          </h3>
          <p className="text-xs text-muted mt-0.5">
            {host.is_superhost ? "Superhost · " : ""}3 months hosting
          </p>
        </div>
      </div>
    </div>
  );
}
