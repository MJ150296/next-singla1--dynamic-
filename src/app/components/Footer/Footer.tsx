"use client";

import React from "react";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <Image
            src="/logo.png"
            alt="Singla RO Mart- RO repair, sales, maintanance"
            width={150}
            height={150}
            className="mb-4"
          />
          <h3 className="text-lg font-semibold mb-4">
            Singla RO Mart, Char Murti Chowk, Greater Noida (W)
          </h3>
          <p className="text-sm text-gray-400">
            Your trusted source for RO service, sales, and AMC. Serving Greater
            Noida West. Quality water, always within reach.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {[
              "Home",
              "About Us",
              "Gallery",
              "Location",
              "Blogs",
              "Contact Us",
            ].map((item) => (
              <li key={item}>
                <Link
                  href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="hover:text-white"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Our Services */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Our Services</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {["RO Services", "RO Repair", "AMC Plans", "Livpure Service"].map(
              (service) => (
                <li key={service}>
                  <Link
                    href={`/services/${service
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                    className="hover:text-white"
                  >
                    {service}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Contact Us</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <a href="tel:+919711569405" className="hover:text-white">
                +91-97115 69405
              </a>
            </li>
            <li>
              <a
                href="mailto:singlaromart@gmail.com"
                className="hover:text-white"
              >
                singlaromart@gmail.com
              </a>
            </li>
            <li>
              LG-144, Lower Ground Floor,
              <br />
              Gaur city center, Char Murti Chowk,
              <br />
              Greater Noida (W), Uttar Pradesh 201318
            </li>
          </ul>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4 text-gray-400">
            <a
              href="https://www.facebook.com/profile.php?id=61570484670946"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://x.com/singlaromart"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.instagram.com/romartgaurcity/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              <FaInstagram />
            </a>
          </div>

          {/* Image Credits  */}
          <div className="mt-2">
            <Link
              href="/credits"
              className="text-sm text-gray-400 hover:underline"
            >
              Image Credits
            </Link>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-sm text-center text-gray-400">
        <p>© 2025 Singla RO Mart. All rights reserved.</p>
        <p className="mt-2">
          Designed by{" "}
          <span>
            Avaco Technologies - Website | Mobile Apps | Digital Marketing
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
