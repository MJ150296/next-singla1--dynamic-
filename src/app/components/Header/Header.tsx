"use client";

import React from "react";
import { Phone, Mail } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import EnterpriseThemeToggle from "../EnterpriseThemeToggle";

const Header: React.FC = () => {

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex justify-between items-center p-3 bg-black">
        <div className="flex gap-x-5">
          {/* Contact Section */}
          <a href="tel:+919711569405" className="block">
            <div className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200">
              <Phone className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <span className="text-sm text-white font-semibold">
                +91-97115 69405
              </span>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:singlaromart@gmail.in?subject=Service%20Enquiry&body=Hello,%0D%0A%0D%0AThanks%20%26%20Regards"
            className="hidden md:block"
          >
            <div className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200">
              <Mail className="w-5 h-5 text-green-400 dark:text-green-300" />
              <span className="text-sm text-white font-semibold">
                singlaromart@gmail.in
              </span>
            </div>
          </a>
        </div>

        <div className="flex items-center space-x-8">
          {/* Social Icons */}
          <div className="hidden h-full md:flex items-center space-x-4 text-gray-400">
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

          {/* Dark Mode Toggle */}
          <EnterpriseThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Header;
