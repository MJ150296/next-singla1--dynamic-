"use client";

import React from "react";
import Link from "next/link";

// Data structure holding categories with their places
const data = [
  {
    category: "Singla RO Services",
    places: [
      "Greater Noida West",
      "Noida Extention",
      "Gaur City",
      "Sector-1 Greater Noida",
      "Sector 16 B",
      "Eco Village",
      "Ace Divino",
      "Panchsheel Green",
      "Saviour Green Arch",
      "Gaur Saundaryam",
      "Bisrakh",
      "Patwari",
      "Chipyana",
      "Noida Sector 115",
      "Noida Sector 119",
      "Noida Sector 120",
      "Noida Sector 121",
      "Noida Sector 122",
      "Noida Sector 123",
      "Crossing Republic",
      "TechZone-4",
    ],
  },
  {
    category: "Singla RO Repair Services",
    places: [
      "Greater Noida West",
      "Noida Extention",
      "Gaur City",
      "Sector-1 Greater Noida",
      "Sector 16 B",
      "Eco Village",
      "Ace Divino",
      "Panchsheel Green",
      "Saviour Green Arch",
      "Gaur Saundaryam",
      "Bisrakh",
      "Patwari",
      "Chipyana",
      "Noida Sector 115",
      "Noida Sector 119",
      "Noida Sector 120",
      "Noida Sector 121",
      "Noida Sector 122",
      "Noida Sector 123",
      "Crossing Republic",
      "TechZone-4",
    ],
  },
  {
    category: "Singla RO AMC Services",
    places: [
      "Greater Noida West",
      "Noida Extention",
      "Gaur City",
      "Sector-1 Greater Noida",
      "Sector 16 B",
      "Eco Village",
      "Ace Divino",
      "Panchsheel Green",
      "Saviour Green Arch",
      "Gaur Saundaryam",
      "Bisrakh",
      "Patwari",
      "Chipyana",
      "Noida Sector 115",
      "Noida Sector 119",
      "Noida Sector 120",
      "Noida Sector 121",
      "Noida Sector 122",
      "Noida Sector 123",
      "Crossing Republic",
      "TechZone-4",
    ],
  },
  {
    category: "Singla RO Water Purifier Repair",
    places: [
      "Greater Noida West",
      "Noida Extention",
      "Gaur City",
      "Sector-1 Greater Noida",
      "Sector 16 B",
      "Eco Village",
      "Ace Divino",
      "Panchsheel Green",
      "Saviour Green Arch",
      "Gaur Saundaryam",
      "Bisrakh",
      "Patwari",
      "Chipyana",
      "Noida Sector 115",
      "Noida Sector 119",
      "Noida Sector 120",
      "Noida Sector 121",
      "Noida Sector 122",
      "Noida Sector 123",
      "Crossing Republic",
      "TechZone-4",
    ],
  },
  {
    category: "Singla Livpure RO Services",
    places: [
      "Greater Noida West",
      "Noida Extention",
      "Gaur City",
      "Sector-1 Greater Noida",
      "Sector 16 B",
      "Eco Village",
      "Ace Divino",
      "Panchsheel Green",
      "Saviour Green Arch",
      "Gaur Saundaryam",
      "Bisrakh",
      "Patwari",
      "Chipyana",
      "Noida Sector 115",
      "Noida Sector 119",
      "Noida Sector 120",
      "Noida Sector 121",
      "Noida Sector 122",
      "Noida Sector 123",
      "Crossing Republic",
      "TechZone-4",
    ],
  },
];

const PlacesLinks: React.FC = () => {
  return (
    <div className="p-4 space-y-8 flex flex-col justify-center items-center">
      {data.map((categoryObj, index) => (
        <div key={index} className="w-full p-6 rounded-lg shadow-md flex flex-col justify-center items-center"> 
          <h2 className="text-xl font-bold mb-4">{categoryObj.category}</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {categoryObj.places.map((place, idx) => (
              <Link
                key={idx}
                href={`/location/${encodeURIComponent(place)}`}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                {place}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlacesLinks;
