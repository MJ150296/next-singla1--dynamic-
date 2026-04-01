"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Wrench, Cog } from "lucide-react"; // Lucide Icons

export default function HomePageCarousel() {
  const autoplay = React.useRef(Autoplay({ delay: 4000 }));

  const carouselItems = [
    {
      id: 1,
      imgURL: "/homepage/storeImage.png",
      title: "Singla RO Mart!",
      message: "Your one-stop solution for all RO services.",
      icon: <MapPin className="w-10 h-10 text-white" />, // Location
      description:
        "Located in Gaur City, Greater Noida West - easily accessible for all your RO needs.",
    },
    {
      id: 2,
      imgURL: "/homepage/storeImage2.png",
      title: "Top Quality Services",
      message:
        "Explore our top-quality RO repair, maintenance, and installation services.",
      icon: <Wrench className="w-10 h-10 text-white" />, // Service
      description:
        "Expert technicians offering fast, reliable RO repair, maintenance, and setup at your doorstep.",
    },
    {
      id: 3,
      imgURL: "/homepage/storeImage1.png",
      title: "Genuine Spare Parts",
      message: "Looking for genuine RO spare parts? We've got you covered!",
      icon: <Cog className="w-10 h-10 text-white" />, // Spare Parts
      description:
        "We stock only original, high-quality RO spare parts to ensure long-lasting performance.",
    },
  ];

  return (
    <div className="relative w-full">
      <Carousel
        plugins={[autoplay.current]}
        className="w-full"
        onMouseEnter={() => autoplay.current.stop()} // Pause on hover
        onMouseLeave={() => autoplay.current.play()} // Resume autoplay properly
        opts={{ loop: true }} // ✅ Enables looping
      >
        <CarouselContent>
          {carouselItems.map((item) => (
            <CarouselItem key={item.id}>
              <div className="">
                <Card>
                  <div
                    style={{ backgroundImage: `url(${item.imgURL})` }}
                    className="relative bg-cover bg-bottom h-[450px] rounded-lg hover:scale-105 transition duration-500 animate-[pulse_6s_ease-in_infinite]"
                  >
                    <CardContent className="h-full flex flex-col items-center justify-center bg-black/50 rounded-lg z-20">
                      <h1 className="hidden md:block">
                        <span className="text-6xl font-bold text-center text-white">
                          {item.title}
                        </span>
                        <br />
                        <span className="text-xl font-semibold text-center text-white">
                          {item.message}
                        </span>
                      </h1>
                      <div className="flex items-center gap-2 text-white mt-40 md:mt-10">
                        {item.icon}
                        <span className="text-lg">{item.description}</span>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Next and Prev buttons are now children of <Carousel /> */}
        <CarouselPrevious className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100" />
        <CarouselNext className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow p-2 hover:bg-gray-100" />
      </Carousel>
    </div>
  );
}
