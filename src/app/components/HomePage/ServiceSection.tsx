import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

const services = [
  {
    title: "RO Installation",
    description:
      "Professional installation of RO water purifiers for homes and offices.",
    image: "/RO/RO-Installation.jpg",
  },
  {
    title: "RO Repair",
    description:
      "Quick and efficient repair services for all types of RO systems.",
    image: "/RO/ro-repair-services.jpg",
  },
  {
    title: "AMC Services",
    description:
      "Annual Maintenance Contracts for hassle-free service and support.",
    image: "/RO/AMC-services.png",
  },

  {
    title: "Filter Replacement",
    description: "Timely replacement of filters to ensure optimal performance.",
    image: "/RO/filter-replacement.jpg",
  },
  {
    title: "RO Services",
    description:
      "Comprehensive water quality testing to ensure safety and purity.",
    image: "/RO/ro-services.png",
  },
  {
    title: "Commercial RO Systems",
    description:
      "Specialized solutions for businesses requiring large-scale water purification.",
    image: "/RO/commercial-ro.jpeg",
  },
];

const ServiceSection: React.FC = () => {
  return (
    <div className="p-4 md:p-6 flex flex-col items-center">
      <h2 className="text-5xl font-serif tracking-wide font-semibold mb-3 text-blue-500">
        Our Services
      </h2>
      <p className="text-gray-700 dark:text-green-600 mb-8 text-center max-w-2xl leading-6">
        We offer a wide range of services to ensure your water purification
        needs are met.
        <br />
        From installation to maintenance, we have you covered.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {services.map((service, index) => (
          <Card
            key={index}
            className="rounded-2xl shadow-md hover:scale-105 transition"
          >
            <CardHeader>
              <Image
                src={service.image}
                alt={service.title}
                width={450}
                height={300}
                className="rounded-lg mb-2 w-full object-cover h-[200px]"
              />
              <CardTitle className="text-xl px-6">{service.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {service.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceSection;
