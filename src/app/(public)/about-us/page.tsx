import Image from "next/image";
import React from "react";

const AboutUs: React.FC = () => {
  return (
    <div className="w-full p-5">
      {/* Background image with heading */}
      <div
        className="w-full h-[450px] rounded-2xl bg-cover bg-start flex items-center justify-center"
        style={{
          backgroundImage: `url('/KitchenRO1.jpg')`, // Replace with your actual image path
        }}
      >
        <h1 className="px-10 rounded-2xl text-5xl bg-linear-to-r from-blue-400 via-blue-600 to-blue-400 font-bold text-white drop-shadow-lg">
          About Us
        </h1>
      </div>

      {/* About content */}
      <div className="px-5 py-12 flex flex-col md:flex-row w-full">
        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-semibold mb-4">
            Our Story: Delivering Clean & Pure Water Solutions -{" "}
            <span className="text-blue-600">Singla </span>
            <span className="text-green-600">RO Mart</span>
            <span className="text-lg">, Char Murti chowk</span>
          </h2>

          <p className="mb-4 text-lg">
            At <strong>Singla RO Mart</strong>, we are passionate about
            transforming lives with the power of clean, purified water. Founded
            with the mission to provide safe, great-tasting drinking water, we
            serve homes and businesses across{" "}
            <strong>Greater Noida West</strong> and beyond.
          </p>

          <p className="mb-4 text-lg">
            Our dedicated team of water purification experts brings years of
            industry experience in <strong>RO water purifier sales</strong>,{" "}
            <strong>RO service and repair</strong>, and reliable{" "}
            <strong>Annual Maintenance Contracts (AMC)</strong>. Whether you&apos;re
            looking for new RO systems, regular servicing, or AMC plans, Singla
            RO Mart ensures you receive high-quality solutions and personalized
            customer care.
          </p>

          <p className="mb-6 text-lg italic border-l-4 border-blue-500 pl-4">
            “Your trusted local partner for RO service, RO purifier sales, and
            AMC packages. Serving Greater Noida West with quality water
            solutions, always within reach.”
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <a
              href="/contact-us"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl shadow hover:bg-blue-700 transition"
            >
              Contact RO Experts
            </a>
            <a
              href="/gallery"
              className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl shadow hover:bg-gray-300 transition"
            >
              Explore Our Work
            </a>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center items-center">
          <Image
            src="/aboutUs/aboutUs.png"
            alt="Commercial RO setup"
            width={400}
            height={400}
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
