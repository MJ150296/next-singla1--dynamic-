"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import FiveStar from "@/app/components/FiveStar";

// Zod schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  contactNumber: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number is too long"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Infer the form type
type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactUs: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    const { name, email, contactNumber, subject, message } = data;

    const text = `New Contact Form Submission:%0A%0A Name: ${name}%0A Email: ${email}%0A Contact Number: ${contactNumber}%0A Subject: ${subject}%0A Message: ${message}`;

    const whatsappUrl = `https://wa.me/918700051152?text=${text}`;

    window.open(whatsappUrl, "_blank");

    reset(); // Clear form after submit
  };

  return (
    <div className="p-6">
      {/* Top Section */}
      <div className="relative w-full rounded-2xl shadow-lg overflow-hidden">
        <div className="absolute inset-0" />
        <div
          className="relative w-full py-20 px-6 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/ContactUsBackground.jpg')` }}
        >
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-0" />
          <div className="relative z-10 text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-10">Contact Us</h1>

            <div className="flex justify-center items-center gap-x-5 md:gap-x-10">
              {[
                {
                  href: "https://www.instagram.com/romartgaurcity/?hl=en",
                  src: "/icons/Instagram.png",
                  alt: "Instagram",
                },
                {
                  href: "https://www.facebook.com/profile.php?id=61570484670946",
                  src: "/icons/Facebook.png",
                  alt: "Facebook",
                },
                {
                  href: "https://wa.me/+919711569405",
                  src: "/icons/WhatsApp.png",
                  alt: "WhatsApp",
                },
                {
                  href: "mailto:singlaromart@gmail.in",
                  src: "/icons/Gmail.png",
                  alt: "Gmail",
                },
              ].map((icon, index) => (
                <a
                  key={index}
                  href={icon.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform duration-300 ease-in-out hover:scale-105"
                >
                  <Image src={icon.src} alt={icon.alt} width={50} height={50} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col justify-center items-center my-2">
          <div className="w-full flex justify-center items-center gap-x-1 md:gap-x-2">
            <FiveStar />
            {/* <div>
              <p className="text-7xl md:text-9xl font-sans text-blue-600">5</p>
            </div>
            <div className="flex flex-col items-center justify-center font-sans text-xl md:text-4xl">
              <span className="text-blue-600">star rated</span>
              <span className="text-green-600">on Google</span>
            </div> */}
          </div>
          <div>
            <a href="tel:+919711569405" className="block text-green-600">
              <div className="flex items-center text-2xl font-semibold space-x-2 hover:opacity-80 transition-opacity duration-200">
                <span className="text-blue-600">Call us at - </span>
                <span className="text-green-600 font-semibold">
                  +91-97115 69405
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="mt-10 flex flex-col-reverse md:flex-row justify-around items-start">
        <div className="w-full md:w-1/2 flex justify-center items-center py-10">
          <a
            href="https://maps.app.goo.gl/HeTEZm253shoiSfv6"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/store-image.jpg"
              alt="Store/ Shop Image, Gaur City Center, Greater Noida"
              priority
              width={400}
              height={300}
              className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-500"
            />
          </a>
        </div>

        <div className="w-full md:w-1/2 p-0 md:p-5">
          <h2 className="text-3xl font-semibold mb-3">
            10% OFF when you book online - Only at Singla RO Mart! <br />
          </h2>{" "}
          <p className="text-gray-600 mb-5">
            We would love to hear from you! Please fill out the form below and
            we&apos;ll get back to you shortly.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your Name" {...register("name")} />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your Email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                type="tel"
                placeholder="Your Contact Number"
                {...register("contactNumber")}
              />
              {errors.contactNumber && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.contactNumber.message}
                </p>
              )}
            </div>

            {/* Subject */}
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Subject"
                {...register("subject")}
              />
              {errors.subject && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.subject.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Your Message"
                rows={5}
                {...register("message")}
              />
              {errors.message && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Submit"}
            </Button>

            {isSubmitSuccessful && (
              <p className="text-green-600 text-center mt-3">
                Thank you! Your message has been sent.
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Google Map */}
      <div className="py-5 md:py-10 rounded-3xl overflow-hidden shadow-2xl px-2 md:px-20">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.803276386607!2d77.42460267934571!3d28.605677900000014!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef143d84a553%3A0x98665a47b552931e!2sSingla%20RO%20Mart%20-%20RO%20Services%2C%20Sales%2C%20Repairs!5e0!3m2!1sen!2sin!4v1744102786830!5m2!1sen!2sin"
          loading="lazy"
          className="w-full h-80"
        ></iframe>
      </div>
    </div>
  );
};

export default ContactUs;
