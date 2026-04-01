"use client";
import FiveStar from "../components/FiveStar";
import AnimatedService from "../components/HomePage/AnimatedService";
import CustomerSupport from "../components/HomePage/CustomerSupport";
import HomePageCarousel from "../components/HomePage/HomePageCarousel";
import BlogCarousel from "../components/HomePage/MyBlogs";
import OurGallery from "../components/HomePage/OurGallery";
import OurStory from "../components/HomePage/OurStory";
import ServiceSection from "../components/HomePage/ServiceSection";
import Testimonial from "../components/HomePage/Testimonial";

export default function Home() {
  return (
    <div className="p-4 space-y-5 w-full flex flex-col justify-center items-center relative">
      <HomePageCarousel />
      <OurStory />
      <ServiceSection />
      <CustomerSupport />
      <OurGallery />
      <Testimonial />
      <FiveStar />
      <AnimatedService />
      <BlogCarousel />
    </div>
  );
}
