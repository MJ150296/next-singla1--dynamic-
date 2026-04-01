import React from "react";
import { Wrench, Cog, ShieldCheck, Hammer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceCards = [
  { icon: <Wrench size={60} />, title: "Service", color: "text-blue-600" },
  { icon: <Cog size={60} />, title: "Installation", color: "text-green-600" },
  {
    icon: <ShieldCheck size={60} />,
    title: "Maintenance",
    color: "text-yellow-600",
  },
  { icon: <Hammer size={60} />, title: "Repair", color: "text-red-600" },
];

const CustomerSupport: React.FC = () => {
  return (
    <div
      className="relative bg-cover bg-fixed bg-center w-full rounded-2xl"
      style={{ backgroundImage: "url('/BG-Image.jpg')" }}
    >
      <div className="text-center py-14">
        <h1 className="text-4xl font-bold text-white bg-black/30 p-2 rounded-xl inline-block">
          Singla RO Mart - One Stop Solution
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8 py-10">
        {serviceCards.map((card, index) => (
          <Card
            key={index}
            className="p-2 text-center transition-transform duration-300 hover:scale-105 hover:shadow-lg dark:bg-gray-800"
          >
            <CardHeader>
              <div className={`flex justify-center ${card.color}`}>
                {card.icon}
              </div>
              <CardTitle className="text-2xl dark:text-white">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Reliable {card.title.toLowerCase()} support at your doorstep.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomerSupport;
