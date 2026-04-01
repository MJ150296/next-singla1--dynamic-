"use client";
import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FaTools, FaSyncAlt, FaTint, FaHandHolding, FaStar, FaMapMarkerAlt, FaWater, FaExclamationTriangle } from "react-icons/fa";
import Wave from "@/app/components/Wave";
import Link from "next/link";
import AnimatedService from "@/app/components/HomePage/AnimatedService";
import { getLocationData } from "@/app/data/locations";
import Head from "next/head";

const PlacePage: React.FC = () => {
  const params = useParams();
  const place = decodeURIComponent(params.place as string);
  const locationData = getLocationData(place);
  // const [currentService, setCurrentService] = useState(0);

  const services = [
    "RO Services",
    "RO Repair",
    "Livpure RO Services",
    "RO Water Purifier Repair",
  ];
  const brands = [
    "Kent RO",
    "Aquaguard RO",
    "Livpure RO",
    "Pureit RO",
    "Blue Star RO",
    "AO Smith RO",
    "Havells RO",
    "Eureka Forbes RO",
    "Tata Swach RO",
    "Zero B RO",
    "Whirlpool RO",
    "LG RO",
    "Panasonic RO",
    "Voltas RO",
    "Nasaka RO",
    "Aquafresh RO",
    "Aqua Grand RO",
    "Aqua Ultra RO",
    "Aqua D Pure RO",
    "Aqua Sure RO",
    "Konvio RO",
    "Faber RO",
    "Xiaomi Mi Smart Water Purifier",
    "Moonbow RO",
    "HUL RO",
    "Electrolux RO",
    "V-Guard RO",
    "Usha RO",
    "Alfaa RO",
    "Alka RO",
    "Urban Company Water Purifier Services",
    "Classic RO",
    "Nexqua RO",
    "Ruby RO",
    "Kinsco RO",
    "LG Puricare RO",
    "Prestige RO",
    "Kutchina RO",
    "Aqua Fresh Prime RO",
    "Aqua Glory RO",
  ];

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentService((prev) => (prev + 1) % services.length);
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <>
      {/* Meta Description for SEO */}
      <Head>
        <title>RO Water Purifier Repair in {place} | Singla RO Mart</title>
        <meta 
          name="description" 
          content={locationData?.metaDescription || `Professional RO water purifier repair services in ${place}. Expert technicians for Kent, Aquaguard, Livpure, Pureit and all major brands. Same-day service available. Call +91-97115 69405.`} 
        />
        <meta name="keywords" content={`RO repair ${place}, water purifier service ${place}, Kent RO ${place}, Aquaguard ${place}, Livpure ${place}, RO AMC ${place}`} />
        <meta property="og:title" content={`RO Water Purifier Repair in ${place} | Singla RO Mart`} />
        <meta property="og:description" content={locationData?.metaDescription || `Expert RO repair services in ${place}. All brands serviced.`} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://singlaromart.com/location/${encodeURIComponent(place)}`} />
      </Head>
      
      <div className="">
      {/* Hero Section */}
      <section className="">
        <div className="relative">
          <Wave />
          <div className="absolute inset-0 z-10 w-full h-full flex flex-col items-center justify-center">
            <h2 className="text-xl md:text-4xl font-bold">
              RO Water Purifier Repair in {place}
            </h2>
            <div className="h-1 w-24 bg-blue-500 mx-auto mb-8"></div>
          </div>
        </div>
      </section>

      {/* Unique Content Section - Water Quality & Local Info */}
      {locationData && (
        <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Water Quality Info */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <FaWater className="text-3xl text-blue-500" />
                  <h3 className="text-2xl font-bold">Water Quality in {place}</h3>
                </div>
                <p className="text-gray-700 mb-4">{locationData.waterQuality}</p>
                
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <FaExclamationTriangle className="text-orange-500" />
                  Common Issues in {place}
                </h4>
                <ul className="space-y-2">
                  {locationData.commonIssues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Local Landmarks */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <FaMapMarkerAlt className="text-3xl text-green-500" />
                  <h3 className="text-2xl font-bold">We Serve Near {place}</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Our technicians provide fast service throughout {place} and nearby areas including:
                </p>
                <ul className="space-y-2">
                  {locationData.localLandmarks.map((landmark, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      <span>{landmark}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                {[...Array(locationData.testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-4">
                &ldquo;{locationData.testimonial.text}&rdquo;
              </p>
              <p className="font-semibold text-blue-600">
                — {locationData.testimonial.name}, {place}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Trusted Partner Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto md:flex md:gap-8">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold mb-4">
              Your Trusted Partner for RO Water Purifier Repair in {place}
            </h2>
            <p className="mb-4">
              One of the basic needs of a human being is pure water. For that,
              we at Classic RO Solutions provide reliable RO water purifier
              repair in {place}, ensuring your family enjoys uninterrupted
              access to clean and safe water.
            </p>

            <h3 className="text-2xl font-bold mt-8 mb-4">
              Comprehensive Repairs for All Your RO Needs
            </h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Reverse Osmosis Membrane issues</li>
              <li>Carbon filter issues</li>
              <li>Sediment Pre-Filter issues</li>
              <li>Water leakage or low water pressure problems</li>
              <li>Electrical and motor-related faults</li>
              <li>Tank not filling or slow water output</li>
            </ul>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/homepage/storeImage2.png"
              alt="RO Service"
              width={450}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold mt-8 mb-4">
            Why Choose Us in {place}?
          </h3>
          <ul className="mb-4 text-lg bg-gradient-to-l from-white dark:from-black dark:via-gray-500 dark:to-black via-gray-500 to-white text-white p-4 rounded-lg">
            <li>Experienced technicians with brand expertise</li>
            <li>Affordable and transparent pricing</li>
            <li>Original spare parts and filters used</li>
            <li>Same-day service available in most areas</li>
            <li>
              Support for all major brands including Kent, Aquaguard, Pureit,
              Livpure, and more
            </li>
          </ul>

          <p className="mt-4 text-blue-600 text-xl">
            Whether it's a minor filter change or a major repair, trust
            Singla RO Mart in {place} to get it done right. Call us today to
            book a visit or request a free quote!
          </p>
        </div>
      </section>

      {/* Animated Services Section */}
      <AnimatedService />

      {/* Service Types */}

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          {/* Servicing */}
          <Link href="/services/ro-services">
            <div className="text-center p-6 hover:bg-blue-50 rounded-lg transition">
              <FaHandHolding className="text-4xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold">Servicing</h3>
            </div>
          </Link>

          {/* Repair */}
          <Link href="/services/ro-repair">
            <div className="text-center p-6 hover:bg-blue-50 rounded-lg transition">
              <FaTools className="text-4xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold">Repair</h3>
            </div>
          </Link>

          {/* AMC Plans */}
          <Link href="/services/amc-plans">
            <div className="text-center p-6 hover:bg-blue-50 rounded-lg transition">
              <FaSyncAlt className="text-4xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold">AMC Plans</h3>
            </div>
          </Link>

          {/* Water Purifier Installation */}
          <Link href="/contact-us">
            <div className="text-center p-6 hover:bg-blue-50 rounded-lg transition">
              <FaTint className="text-4xl text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold">Installation</h3>
            </div>
          </Link>
        </div>
      </section>

      {/* Price List Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 font-bold">
            <div>#</div>
            <div>RO Water Purifier Service</div>
            <div>Contact Number</div>
          </div>

          {services.map((service, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b py-4"
            >
              <div>{index + 1}</div>
              <div>
                {service} {place}
              </div>
              <div>+91-97115 69405</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto md:flex md:gap-8">
          <div className="md:w-1/2 mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Quality Service at Affordable Prices
            </h2>
            <p className="mb-4">
              At Classic RO Solutions, we believe everyone deserves access to
              clean water. That&apos;s why we offer our services at competitive
              prices in {place}.
            </p>
            <Link href="/contact-us">
              <button className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
                Contact Us
              </button>
            </Link>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/homepage/storeImage2.png"
              alt="Storefront of Singla RO Mart"
              width={800}
              height={450}
              className="rounded-xl shadow-md object-cover object-bottom w-full h-60"
            />
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            We Provide Services to These Brands
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[brands.slice(0, 12), brands.slice(12, 24), brands.slice(24)].map(
              (column, i) => (
                <ul key={i} className="space-y-2">
                  {column.map((brand, j) => (
                    <li key={j} className="flex items-center">
                      <span className="text-blue-500 mr-2">•</span>
                      {brand} in {place}
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default PlacePage;
