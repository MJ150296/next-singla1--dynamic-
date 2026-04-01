"use client";

import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { blogs } from "@/app/data/blogs";

const BlogDetail: React.FC = () => {
  const params = useParams();
  const slug = params.slug as string;

  const blog = blogs.find((b) => b.id === slug);
  if (!blog) return <p className="text-center p-10">Blog not found.</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Link
        href="/blogs"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to Blogs
      </Link>
      <Card className="shadow-lg relative overflow-hidden">
        {/* Background logo */}
        <div className="absolute inset-0 z-0 opacity-40 flex justify-center items-center pointer-events-none">
          <Image
            src="/logo.png" // your logo path
            alt="Background Logo"
            width={400} // adjust size as needed
            height={400}
            className="object-contain"
          />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10">
          <div className="relative w-full h-80">
            <Image
              src={blog.image}
              alt={blog.title}
              layout="fill"
              objectFit="cover"
              className="rounded-t-lg"
            />
          </div>

          <CardHeader className="px-4 pt-4">
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
              {blog.title}
            </CardTitle>
            {blog.subheading && (
              <h3 className="text-xl text-gray-500 dark:text-gray-400 mt-2">
                {blog.subheading}
              </h3>
            )}
          </CardHeader>

          <CardContent className="px-4 pb-6">
            <div
              className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Additional Content/Images */}
            {blog.additionalImages[0] && (
              <div className="w-full flex flex-col md:flex-row md:justify-between mt-5">
                <div className="relative w-full md:w-1/2 h-64 my-4">
                  <Image
                    src={blog.additionalImages[0]}
                    alt={`${blog.title} extra image 1`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div className="w-full md:w-1/2 p-5 md:pl-10">
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    {blog.content1}
                  </p>
                </div>
              </div>
            )}

            {blog.additionalImages[1] && (
              <div className="w-full flex flex-col md:flex-row md:justify-between mt-10">
                <div className="w-full md:w-1/2 p-5 md:pr-10">
                  <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    {blog.content2}
                  </p>
                </div>
                <div className="relative w-full md:w-1/2 h-64 my-4">
                  <Image
                    src={blog.additionalImages[1]}
                    alt={`${blog.title} extra image 2`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default BlogDetail;
