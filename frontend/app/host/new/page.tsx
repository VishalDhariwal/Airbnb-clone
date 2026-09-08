"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { api } from "@/lib/api";
import { HostListingCreateInput, HostListing } from "@/lib/types/host";
import { WizardProgress } from "@/components/host/wizard/WizardProgress";
import { StepBasics } from "@/components/host/wizard/StepBasics";
import { StepLocation } from "@/components/host/wizard/StepLocation";
import { StepPhotos } from "@/components/host/wizard/StepPhotos";
import { StepAmenities } from "@/components/host/wizard/StepAmenities";
import { StepPricing } from "@/components/host/wizard/StepPricing";
import { HostEmptyState } from "@/components/host/HostEmptyState";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { slideVariants } from "@/lib/motion";

const INITIAL_DATA: HostListingCreateInput = {
  title: "",
  description: "",
  property_type: "Villa",
  room_type: "Entire place",
  address: "",
  city: "Goa",
  state: "Goa",
  country: "India",
  latitude: 15.2993,
  longitude: 74.124,
  price_per_night: 4500,
  cleaning_fee: 500,
  max_guests: 4,
  bedrooms: 2,
  beds: 2,
  bathrooms: 2,
  photo_urls: [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
  ],
  amenity_ids: [1, 2, 3, 5, 6],
  category_ids: [1, 2],
};

export default function CreateListingPage() {
  const router = useRouter();
  const { user, loading: isAuthLoading } = useAuth();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  // +1 forward, -1 back — tells the step transition which way to slide.
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<HostListingCreateInput>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = 5;

  const handleChange = (updates: Partial<HostListingCreateInput>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    setError(null);
  };

  const handleNext = async () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.property_type || !formData.room_type) {
        setError("Please select both property and room type");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim()) {
        setError("Please complete your address, city, and state");
        return;
      }
    } else if (currentStep === 3) {
      if (formData.photo_urls.length === 0) {
        setError("Please add at least one photo of your place");
        return;
      }
    } else if (currentStep === 4) {
      // Amenities optional but valid
    } else if (currentStep === 5) {
      // Final submission
      if (!formData.title.trim() || formData.title.length < 3) {
        setError("Please provide a title (at least 3 characters)");
        return;
      }
      if (!formData.description.trim() || formData.description.length < 10) {
        setError("Please provide a description (at least 10 characters)");
        return;
      }
      if (formData.price_per_night < 100) {
        setError("Price per night must be at least ₹100");
        return;
      }

      try {
        setIsSubmitting(true);
        setError(null);
        await api.post<HostListing>("/host/listings", formData);
        showToast("Listing published successfully!", "success");
        // The hosting homepage opens on Today. Take the host directly to the
        // database-backed Listings view so the newly published home is visible.
        router.push("/host?view=listings#listings");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to publish listing";
        setError(msg);
        showToast(msg, "error");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    setDirection(1);
    setCurrentStep((s) => Math.min(s + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setDirection(-1);
    setCurrentStep((s) => Math.max(s - 1, 1));
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-rausch animate-spin" />
      </div>
    );
  }

  if (!user || !user.is_host) {
    return <HostEmptyState />;
  }

  return (
    <div className="min-h-screen bg-surface-soft flex flex-col pt-20 pb-28">
      <WizardProgress
        currentStep={currentStep}
        totalSteps={totalSteps}
        onBack={handleBack}
        onNext={handleNext}
        isSubmitting={isSubmitting}
        nextLabel={currentStep === 5 ? "Publish listing" : "Next"}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-6">
        {error && (
          <div className="mb-6 flex items-center justify-between rounded-sm border border-danger/30 bg-danger/5 p-4 t-body-sm text-danger">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="font-bold ml-4 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {currentStep === 1 && <StepBasics data={formData} onChange={handleChange} />}
            {currentStep === 2 && <StepLocation data={formData} onChange={handleChange} />}
            {currentStep === 3 && <StepPhotos data={formData} onChange={handleChange} />}
            {currentStep === 4 && <StepAmenities data={formData} onChange={handleChange} />}
            {currentStep === 5 && <StepPricing data={formData} onChange={handleChange} />}
          </motion.div>
        </AnimatePresence>

      </main>
    </div>
  );
}
