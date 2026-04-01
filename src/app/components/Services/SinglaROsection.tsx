"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROContentItem } from "@/app/data/roContent";
import Wave from "../Wave";
import Image from "next/image";

interface Props {
  data: ROContentItem[];
}

const SinglaROSection: React.FC<Props> = ({ data }) => {
  return (
    <section className="w-full py-12">
      {data.map((item) => (
        <div key={item.id}>
          {/* Title + CTA */}
          <div className="max-w-6xl mx-auto px-4 flex flex-col items-center text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-6">
              {item.title}
            </h2>
            <Link href={item.button.link}>
              <Button size="sm" className="mb-10">
                {item.button.text}
              </Button>
            </Link>
          </div>

          <Wave />

          {/* Sections */}
          {item.sections.map((section, sectionIndex) => {
            const isImageLeft = sectionIndex % 2 !== 0;

            return (
              <div
                key={sectionIndex}
                className={`max-w-6xl mx-auto px-4 py-10 flex flex-col-reverse md:flex-row items-center gap-10 ${
                  isImageLeft ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div className="w-full md:w-1/2">
                  <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-800 dark:text-white">
                    {section.heading}
                  </h3>
                  {section.paragraphs.map((para, idx) => (
                    <p
                      key={idx}
                      className="text-gray-700 dark:text-gray-300 mb-4"
                    >
                      {para}
                    </p>
                  ))}
                  <a
                    href={section.highlightedLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 font-semibold underline"
                  >
                    {section.highlightedLink.text}
                  </a>
                </div>

                {/* Image */}
                <div className="w-full md:w-1/2">
                  <Image
                    src={section.image.src}
                    alt={section.image.alt}
                    width={500}
                    height={500}
                    className="rounded-xl shadow-lg w-full h-auto object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </section>
  );
};

export default SinglaROSection;
