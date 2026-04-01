// data/roContent.ts

export interface ROContentItem {
  id: number;
  slug: string;
  title: string;
  button: {
    text: string;
    link: string;
  };
  sections: {
    heading: string;
    paragraphs: string[];
    highlightedLink: {
      url: string;
      text: string;
    };
    image: {
      src: string;
      alt: string;
    };
  }[];
}

export const roContent: ROContentItem[] = [
  {
    id: 1,
    slug: "ro-services",
    title: "Singla RO Services",
    button: {
      text: "Contact Us",
      link: "/contact-us",
    },
    sections: [
      {
        heading: "Best RO Services Near Me in Greater Noida West",
        paragraphs: [
          "One of the most essential aspects of our health is pure and sustainable water. For that",
          "As the human body is about 60-70% water, clean water is crucial.",
        ],
        highlightedLink: {
          url: "https://g.co/kgs/9yNuqBd",
          text: "Singla RO Mart, Gaur Chowk, Greater Noida (W)",
        },
        image: {
          src: "/homepage/storeImage1.png",
          alt: "Singla RO Services",
        },
      },
      {
        heading: "Why Choose Singla RO?",
        paragraphs: [
          "We are committed to delivering clean, purified water through innovative technology and prompt service.",
          "Thousands of families rely on us for daily healthy hydration.",
        ],
        highlightedLink: {
          url: "https://singlaromart.in/about-us",
          text: "Learn More About Us",
        },
        image: {
          src: "/homepage/storeImage.png",
          alt: "RO Team at Work",
        },
      },
    ],
  },
  {
    id: 2,
    slug: "ro-repair",
    title: "RO Repair Services",
    button: {
      text: "Book a Technician",
      link: "/contact-us",
    },
    sections: [
      {
        heading: "Instant RO Repair Near You",
        paragraphs: [
          "Facing issues with your RO system? Classic RO offers fast and reliable repair services at your doorstep.",
          "We repair all major RO brands with genuine parts and expert hands.",
        ],
        highlightedLink: {
          url: "https://singlaromart.in/contact-us",
          text: "Schedule Repair",
        },
        image: {
          src: "/homepage/storeImage1.png",
          alt: "RO Technician Repairing Unit",
        },
      },
      {
        heading: "Experienced RO Experts",
        paragraphs: [
          "Our technicians are highly trained and experienced in diagnosing and fixing RO issues quickly.",
          "We provide quality service with a warranty on repairs.",
        ],
        highlightedLink: {
          url: "https://g.page/r/CR6TUrVHWmaYEAE/review",
          text: "See What Customers Say",
        },
        image: {
          src: "/homepage/storeImage.png",
          alt: "RO Repair in Progress",
        },
      },
    ],
  },
  {
    id: 3,
    slug: "amc-plans",
    title: "AMC Plans for RO",
    button: {
      text: "Explore AMC Plans",
      link: "/amc-plans",
    },
    sections: [
      {
        heading: "Affordable AMC Plans",
        paragraphs: [
          "With Classic RO&apos;s Annual Maintenance Contracts, enjoy peace of mind all year round.",
          "We ensure timely service, filter changes, and free repairs under your plan.",
        ],
        highlightedLink: {
          url: "https://singlaromart.in/amc-plans",
          text: "Know More",
        },
        image: {
          src: "/homepage/storeImage1.png",
          alt: "AMC Plan Coverage",
        },
      },
      {
        heading: "Why Opt for AMC?",
        paragraphs: [
          "Save money and avoid emergencies with our value-packed AMC options.",
          "Choose from basic to premium plans tailored to your usage.",
        ],
        highlightedLink: {
          url: "https://singlaromart.in/amc-plans",
          text: "Check Plan Pricing",
        },
        image: {
          src: "/homepage/storeImage.png",
          alt: "AMC Comparison Chart",
        },
      },
    ],
  },
  {
    id: 4,
    slug: "livpure-service",
    title: "Livpure RO Service",
    button: {
      text: "Service Your Livpure",
      link: "/contact-us",
    },
    sections: [
      {
        heading: "Dedicated Livpure RO Support",
        paragraphs: [
          "Our team specializes in servicing Livpure RO systems using genuine parts and trained professionals.",
          "We maintain your system for clean, fresh water at all times.",
        ],
        highlightedLink: {
          url: "https://singlaromart.in/contact-us",
          text: "Contact for Livpure Help",
        },

        image: {
          src: "/homepage/storeImage1.png",
          alt: "Livpure RO Maintenance",
        },
      },
      {
        heading: "Trust Classic RO for Livpure",
        paragraphs: [
          "From filter replacements to full system checks, we&apos;ve got Livpure covered.",
          "Quick response, honest pricing, and top service quality guaranteed.",
        ],
        highlightedLink: {
          url: "",
          text: "",
        },
        image: {
          src: "/homepage/storeImage.png",
          alt: "Livpure RO Technician",
        },
      },
    ],
  },
];
