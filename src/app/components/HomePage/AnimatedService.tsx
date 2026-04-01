import React from "react";
import { Typewriter } from "react-simple-typewriter";

const AnimatedService: React.FC = () => {
  const services = [
    "RO Services",
    "RO Repair",
    "Livpure RO Services",
    "RO Water Purifier Repair",
  ];
  return (
    <div className="w-full">
      {/* Animated Services Section */}
      <section className="rounded-lg bg-blue-500 text-white py-16 px-4 hover:bg-green-500 duration-400">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Singla RO Customer Support{" "}
            <span className="border-b-2 border-white inline-block">
              <Typewriter
                words={services}
                loop={0} // infinite loop
                cursor
                cursorStyle="|"
                typeSpeed={125}
                deleteSpeed={100}
                delaySpeed={1500} // wait before deleting
              />
            </span>
          </h2>
        </div>
      </section>
    </div>
  );
};

export default AnimatedService;
