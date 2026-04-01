"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface SinglaROMartAdProps {
  adImage: string;
  description: string;
  onClose: () => void;
}

const SinglaROMartAd: React.FC<SinglaROMartAdProps> = ({
  adImage,
  description,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    containerRef.current?.animate(
      [
        { transform: "scale(0.5)", opacity: 0 },
        { transform: "scale(1.05)", opacity: 1 },
        { transform: "scale(1)", opacity: 1 },
      ],
      {
        duration: 600,
        easing: "ease-out",
        fill: "forwards",
      }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-[320px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-4 flex flex-col items-center text-center space-y-4"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-red-500 transition"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Image */}
      <Image
        src={adImage}
        alt="Singla RO Mart"
        width={300}
        height={150}
        className="rounded-xl object-contain h-60"
      />

      {/* Heading */}
      <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
        Singla RO Mart
      </h2>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>

      {/* CTA Button */}
      <a
        href="https://wa.me/919711569405?text=Hi%20Singla%20RO%20Mart%2C%20I%20want%20to%20book%20a%20RO%20repair%20appointment."
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition"
      >
        Book on WhatsApp
      </a>
    </div>
  );
};

export default SinglaROMartAd;
