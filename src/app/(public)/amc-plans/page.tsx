import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AMCPlanPage = () => {
  return (
    <div className="p-4 space-y-8">
      <div className="z-10">
        <div className="relative py-14 space-y-3">
          {/* Background logo image */}
          <div className="absolute inset-0 flex justify-center items-center opacity-20 pointer-events-none z-0">
            <Image
              src="/logo.png"
              alt="Singla RO Mart Logo"
              width={300}
              height={300}
            />
          </div>
          <h1 className="text-3xl font-bold text-center">
            Annual Maintenance Contracts (AMC) for RO Systems
          </h1>
          <p className="text-center text-gray-600">
            Choose from a range of AMC plans designed to keep your water
            purifier in peak condition. Ideal for homes in Greater Noida West.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="transition-transform duration-300 hover:scale-105">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">Basic Plan</h2>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                <li>Routine servicing</li>
                <li>Filters not included</li>
                <li>Membrane not included</li>
                <li>Price: ₹1,450 - ₹2,700</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="transition-transform duration-300 hover:scale-105">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">Standard Plan</h2>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                <li>Routine servicing</li>
                <li>Filter replacements included</li>
                <li>Membrane optional</li>
                <li>Price: ₹2,700 - ₹5,500</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="transition-transform duration-300 hover:scale-105">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">Comprehensive Plan</h2>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                <li>All servicing & parts covered</li>
                <li>Includes filters, membrane, and electrical parts</li>
                <li>Price: ₹5,500 - ₹9,500</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="transition-transform duration-300 hover:scale-105">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold">Custom Plan</h2>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                <li>Tailored to your purifier brand</li>
                <li>Flexible visits and service options</li>
                <li>Call for rates and booking</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4 py-10">
          <h2 className="text-2xl font-bold">Book Your Plan by Brand</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" asChild>
              <a
                href="https://g.co/kgs/qToHFiq"
                target="_blank"
                rel="noopener noreferrer"
              >
                Kent
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://g.co/kgs/qToHFiq"
                target="_blank"
                rel="noopener noreferrer"
              >
                Aquaguard
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://g.co/kgs/qToHFiq"
                target="_blank"
                rel="noopener noreferrer"
              >
                Livpure
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://g.co/kgs/qToHFiq"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pureit
              </a>
            </Button>
          </div>
        </div>

        <div className="text-center pt-5">
          <p className="text-lg font-medium">
            Need Help? Call us now at <strong>+91-97115 69405</strong>
          </p>
          <p>
            Email:{" "}
            <a href="mailto:singlaromart@gmail.com" className="text-blue-600">
              singlaromart@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AMCPlanPage;
