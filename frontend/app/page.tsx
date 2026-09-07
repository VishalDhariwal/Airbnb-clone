"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";

interface HealthData {
  status: string;
  app: string;
  api_version?: string;
}

export default function Home() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHealth();
  }, []);

  async function fetchHealth() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<HealthData>("/health");
      setHealth(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`${err.message} (HTTP ${err.status})`);
      } else {
        setError(err instanceof Error ? err.message : "Failed to connect to backend");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 sm:p-12 text-ink">
      <div className="w-full max-w-xl bg-white rounded-md p-8 shadow-card border border-hairline flex flex-col gap-6">
        {/* Header Block */}
        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-4 rounded-full bg-rausch" />
            <h1 className="t-display-xl text-ink">Airbnb Clone Scaffold</h1>
          </div>
          <span className="t-badge bg-surface-soft text-ink px-3 py-1 rounded-full border border-hairline">
            Phase 0 Verified
          </span>
        </div>

        {/* Backend Connectivity Status */}
        <div className="flex flex-col gap-2 p-4 rounded-sm bg-surface-soft border border-hairline-soft">
          <div className="flex items-center justify-between">
            <span className="t-caption text-muted">Backend Status (`/api/health`):</span>
            {loading && <span className="t-caption text-muted animate-pulse">Checking...</span>}
            {!loading && health && (
              <span className="t-caption text-emerald-600 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {health.status.toUpperCase()}
              </span>
            )}
            {!loading && error && (
              <span className="t-caption text-danger font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-danger" />
                OFFLINE
              </span>
            )}
          </div>
          {health && (
            <p className="t-body-sm text-bodytext">
              Connected to <strong>{health.app}</strong> (API Version: {health.api_version || "1.0.0"})
            </p>
          )}
          {error && (
            <p className="t-body-sm text-danger">
              {error} — ensure backend is running on `http://localhost:8000`
            </p>
          )}
        </div>

        {/* Token Verification & Design System Demo */}
        <div className="flex flex-col gap-3">
          <h2 className="t-title-md text-ink">Design Tokens & Typography</h2>
          <p className="t-body-sm text-bodytext">
            Rendered in <strong>Inter</strong> font with strict tokens from{" "}
            <code className="text-sm bg-surface-soft px-1.5 py-0.5 rounded text-ink">DESIGN_SYSTEM.md</code>.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={fetchHealth}
              className="bg-rausch hover:bg-rausch-active text-white rounded-sm h-12 px-6 t-button-md transition-colors shadow-card flex items-center gap-2"
            >
              Test Backend Connection
            </button>
            <div className="h-12 px-5 rounded-sm border border-border-strong text-ink t-button-md flex items-center">
              Secondary Outline
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-hairline text-center">
          <p className="t-caption-sm text-muted">
            All money computed server-side · Indian INR formatting · Zero arbitrary values
          </p>
        </div>
      </div>
    </main>
  );
}
