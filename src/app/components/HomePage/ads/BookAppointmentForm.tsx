"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

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

type AppointmentFormInputs = z.infer<typeof contactFormSchema>;

interface BookAppointmentFormProps {
  onClose: () => void;
}

const BookAppointmentForm: React.FC<BookAppointmentFormProps> = ({
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<AppointmentFormInputs>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: AppointmentFormInputs) => {
    console.log("Appointment form submitted:", data);

    const message = `
      *Appointment Request:*
      *Name:* ${data.name}
      *Email:* ${data.email}
      *Contact Number:* ${data.contactNumber}
      *Subject:* ${data.subject}
      *Message:* ${data.message}
    `;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "919711569405";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");

    await new Promise((res) => setTimeout(res, 1500));
    reset();
    setTimeout(onClose, 2000);
  };

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    containerRef.current?.animate(
      [
        { transform: "scale(0.5)", opacity: 0 },
        { transform: "scale(1.05)", opacity: 1 },
        { transform: "scale(1)", opacity: 1 },
      ],
      {
        duration: 600,
        easing: "ease-out",
        fill: "forwards",
      }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6 rounded-xl shadow-2xl w-full max-w-md relative"
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-3 text-xl font-bold text-gray-600 dark:text-gray-300 hover:text-red-500"
      >
        ✕
      </button>

      <h2 className="text-2xl font-semibold mb-4 text-center">
        Book Appointment
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} placeholder="Your Name" />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="Your Email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            id="contactNumber"
            type="tel"
            {...register("contactNumber")}
            placeholder="Your Contact Number"
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.contactNumber.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" {...register("subject")} placeholder="Subject" />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">
              {errors.subject.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            rows={5}
            {...register("message")}
            placeholder="Your Message"
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Submit"}
        </Button>

        {isSubmitSuccessful && (
          <p className="text-green-500 text-center mt-3">
            Thank you! Your appointment request has been sent.
          </p>
        )}
      </form>
    </div>
  );
};

export default BookAppointmentForm;
