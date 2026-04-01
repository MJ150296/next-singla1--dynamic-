import Image from "next/image";
import React from "react";
import { roProducts } from "@/app/data/roProducts"; // Adjust the import path
import Link from "next/link";

const OurGallery: React.FC = () => {
  const firstEightProducts = roProducts.slice(0, 8);

  return (
    <section className="w-full py-12 px-4 md:px-12 rounded-xl">
      <h2 className="text-4xl font-semibold text-center text-gray-800 dark:text-white mb-8">
        Our Gallery
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-8 justify-items-center">
        {firstEightProducts.map((product, index) => (
          <Link href="/gallery" key={index}>
            <div className="w-[300px] h-[300px] overflow-hidden rounded-lg shadow-md hover:scale-105 transition-transform duration-300">
              <Image
                src={product.imageUrl}
                alt={product.alt}
                width={300}
                height={300}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default OurGallery;
