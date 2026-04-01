"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { blogs } from "@/app/data/blogs";

const BlogCarousel: React.FC = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false })
  );

  return (
    <section className="w-full py-10 px-4 md:px-8 lg:px-12 rounded-xl">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Latest Blog Articles
      </h2>

      <Carousel
        plugins={[plugin.current]}
        opts={{ align: "start", loop: true }}
        className="w-full max-w-6xl mx-auto"
        onMouseEnter={() => plugin.current.stop()}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent>
          {blogs.map((blog, index) => (
            <CarouselItem
              key={index}
              className="basis-full md:basis-1/2 lg:basis-1/3"
            >
              <Link href={`/blogs/${blog.id}`} className="block">
                <Card className="h-full shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden cursor-pointer">
                  <div className="relative w-full h-56 md:h-48 lg:h-40">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="px-4 pt-4">
                    <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
                      {blog.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-6">
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default BlogCarousel;
