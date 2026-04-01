import Image from "next/image";
import React from "react";
import { roProducts } from "@/app/data/roProducts"; // adjust this path as needed
import Wave from "@/app/components/Wave";

const OurGallery: React.FC = () => {
  return (
    <section className="w-full rounded-xl space-y-5">
      <div className="relative">
        <Wave />
        <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 dark:text-white mb-8">
            Our Products
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 justify-items-center">
        {roProducts.map((product, index) => (
          <div
            key={index}
            className="w-[280px] h-[300px] overflow-hidden rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
          >
            <Image
              src={product.imageUrl}
              alt={product.alt}
              width={300}
              height={300}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurGallery;
