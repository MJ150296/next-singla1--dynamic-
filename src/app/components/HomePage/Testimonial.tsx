"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const testimonials = [
  {
    name: "Pushpa Devi",
    feedback:
      "Singla RO Mart in Chaar Murti, Gaur City offers exceptional RO service and quick installation. The water purifier quality is top-notch and the customer support is very responsive. Highly recommended for anyone in Noida Extension!",
    image: "/testimonials/pushpa.jpeg",
  },
  {
    name: "DC Joshi",
    feedback:
      "As a resident of Gaur Saundaryam, I've tried many RO service providers but none match the efficiency of Singla RO Mart. Their team is professional, punctual, and their AMC plans are very affordable.",
    image: "/testimonials/dcjoshi.jpeg",
  },
  {
    name: "Esha",
    feedback:
      "Living in Mahagun Mywoods, I needed urgent RO repair and Singla RO Mart responded immediately. Their technician arrived within 30 minutes and resolved everything perfectly. Excellent service experience!",
    image: "/testimonials/Esha.jpeg",
  },
  {
    name: "Siddharth",
    feedback:
      "I got my RO system installed from Singla RO Mart at my Ajnara home. The product quality is amazing, and their annual maintenance service is hassle-free. Best water purifier service in Greater Noida West!",
    image: "/testimonials/sid.jpeg",
  },
  {
    name: "Dr. Sumit Dinkar",
    feedback:
      "Staying at Fusion Homes, I've been using Singla RO Mart's services for over a year now. Their RO AMC packages are budget-friendly and their service team is always on time and polite. I trust them for all my water purifier needs.",
    image: "/testimonials/sumit.png",
  },
  {
    name: "Maya Joshi",
    feedback:
      "From installation to regular servicing, Singla RO Mart in Gaur City has delivered top-tier RO solutions. Their technicians are knowledgeable and courteous. A trusted choice for clean and safe drinking water in Noida Extension.",
    image: "/testimonials/maya.jpeg",
  },
];

const Testimonial: React.FC = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  return (
    <section className="w-full py-10 px-2 md:px-8 lg:px-12 bg-muted rounded-xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        What Our Customers Say
      </h2>

      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-6xl mx-auto"
        onMouseEnter={() => plugin.current.stop()}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent>
          {testimonials.map((testimonial, index) => (
            <CarouselItem
              key={index}
              className="basis-full md:basis-1/2 lg:basis-1/3"
            >
              <a href="https://g.page/r/CR6TUrVHWmaYEAE/review" target="_blank">
                <Card className="h-full shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
                  <CardHeader className="flex flex-col items-center pt-6">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover mb-4 border-2 border-primary dark:border-green-500"
                    />
                    <CardTitle className="text-center text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                      {testimonial.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow px-4 pb-6">
                    <p className="text-sm sm:text-base italic text-center text-muted-foreground leading-relaxed">
                      &quot;{testimonial.feedback}&quot;
                    </p>
                  </CardContent>
                </Card>
              </a>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default Testimonial;
