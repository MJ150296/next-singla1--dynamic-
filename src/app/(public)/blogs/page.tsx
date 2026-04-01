// Example using pages directory: pages/blog/index.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Wave from "@/app/components/Wave";
import { blogs } from "@/app/data/blogs";

const BlogList: React.FC = () => {
  return (
    <section className="space-y-5">
      <div className="relative">
        <Wave />
        <div className="absolute inset-0 z-10 w-full h-full flex items-center justify-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-800 dark:text-white mb-8">
            Our Blogs
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link key={blog.id} href={`/blogs/${blog.id}`}>
            <Card className="h-full shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative w-full h-48">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg"
                />
              </div>
              <CardHeader className="px-4 pt-4">
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  {blog.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-6">
                <p className="text-gray-600 dark:text-gray-300">
                  {blog.excerpt}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BlogList;
