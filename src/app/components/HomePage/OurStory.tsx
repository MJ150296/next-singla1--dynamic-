import Image from "next/image";
import Link from "next/link";
import React from "react";

const OurStory: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-12">
      {/* Text Section */}
      <div className="md:w-1/2 text-center md:text-left mb-6 md:mb-0">
        <h2 className="text-4xl font-bold mb-4 text-blue-500 hover:text-blue-600">
          Our Story: <br />
          <span className="text-2xl text-green-500 hover:text-green-600">
            Pure Water, Pure Peace
          </span>
        </h2>
        <p className="text-gray-700 dark:text-gray-200 mb-6 tracking-wide leading-6">
          Welcome to <strong>Singla RO Mart - Chaar Murti Chowk</strong>, your
          go-to expert for{" "}
          <strong>RO water purifier sales, service, and AMC</strong> in{" "}
          <strong>Greater Noida West</strong>. Our mission is simple: to provide
          every home with{" "}
          <strong>clean, safe, and great-tasting drinking water</strong>.
          <br />
          <br />
          With years of experience, we specialize in{" "}
          <strong>
            RO installation, repair, filter replacement, and annual maintenance
            contracts (AMC)
          </strong>
          . Whether it&apos;s a{" "}
          <strong>domestic or commercial RO system</strong>, we ensure
          top-quality service for uninterrupted pure water supply.
          <br />
          <br />
          <em>
            &quot;Reliable RO services in Greater Noida West - because every
            drop matters!&quot;
          </em>
        </p>
        <Link href="/gallery">
          <button className="cursor-pointer px-6 py-2 bg-blue-600 text-white rounded tracking-wide font-medium hover:bg-blue-700 transition">
            GALLERY
          </button>
        </Link>
      </div>

      {/* Image Section */}
      <div className="md:w-1/2 flex justify-center items-center">
        <Image
          src="/homepage/OurStory.jpg"
          alt="Technician Repairing water purifier"
          width={450}
          height={450}
          className="h-[450px] w-[450px] rounded-lg shadow-lg object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    </div>
  );
};

export default OurStory;
