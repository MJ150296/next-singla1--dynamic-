// src/app/components/GlobalOverlay.tsx
"use client";

import { useEffect, useState } from "react";
import BookAppointmentForm from "./HomePage/ads/BookAppointmentForm";
import SinglaROMartAd from "./HomePage/ads/SinglaROMartAd";
import Image from "next/image";

const ads = [
  {
    image: "/Ads/Ad9.png",
    description:
      "Get your RO serviced by experts! Book now and avail exclusive discounts on repairs and AMC plans.",
  },
  {
    image: "/Ads/Ad1.png",
    description:
      "Upgrade your RO system with our latest models! Enjoy a cleaner and safer water experience.",
  },
  {
    image: "/Ads/Ad4.png",
    description:
      "Need an AMC plan? Get reliable service for your RO with our yearly AMC subscription.",
  },
];

export default function GlobalOverlay() {
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [adIndex, setAdIndex] = useState(0);
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    const formTimer = setTimeout(() => setShowAppointmentForm(true), 5000);
    const adTimer = setTimeout(() => setShowAd(true), 10000);
    const adCycleTimer = setInterval(() => {
      setAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 30000);

    return () => {
      clearTimeout(formTimer);
      clearTimeout(adTimer);
      clearInterval(adCycleTimer);
    };
  }, []);

  return (
    <>
      {showAppointmentForm && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center">
          <BookAppointmentForm onClose={() => setShowAppointmentForm(false)} />
        </div>
      )}

      {showAd && (
        <div className="fixed bottom-5 left-5 z-40">
          <SinglaROMartAd
            adImage={ads[adIndex].image}
            description={ads[adIndex].description}
            onClose={() => setShowAd(false)}
          />
        </div>
      )}
      <div className="fixed bottom-5 right-5 z-40">
        <a href="tel:+919711569405">
          <Image
            src="/icons/phone.png"
            alt="Special Offer - Call Now"
            width={50}
            height={50}
            className="rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform"
          />
        </a>
      </div>
    </>
  );
}
