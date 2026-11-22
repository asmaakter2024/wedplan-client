import type { Service } from "./services";

/**
 * Temporary showcase data used while the Express API is offline.
 * As soon as the API responds with real services, these are replaced.
 * Remove this file once the database is fully seeded.
 *
 * Every image URL was verified to load correctly.
 */
export const DEMO_SERVICES: Service[] = [
  {
    _id: "demo-1",
    serviceName: "Bespoke Garden Arch & Candlelit Ceremony",
    category: "Decoration & Florist",
    description:
      "Custom seasonal ceremony arch installation, bridal and bridesmaid bouquets, lush runner centerpiece styling and candlelit tablescapes for your venue.",
    price: 3400,
    location: "San Francisco, CA",
    images: [
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80",
    ],
    vendorId: {
      _id: "demo-vendor-1",
      businessName: "Atelier Lumiere Weddings",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces",
    },
    status: "approved",
    isActive: true,
  },
  {
    _id: "demo-2",
    serviceName: "Super 8mm Documentary Wedding Film",
    category: "Photography & Videography",
    description:
      "Nostalgic Super 8mm film blended with digital 4K audio capture for vows and toasts, producing an heirloom cinematic wedding documentary.",
    price: 3100,
    location: "Santa Barbara, CA",
    images: [
      "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=900&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=80",
      "https://images.unsplash.com/photo-1529636798458-92182e662485?w=900&q=80",
    ],
    vendorId: {
      _id: "demo-vendor-1",
      businessName: "Atelier Lumiere Weddings",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces",
    },
    status: "approved",
    isActive: true,
  },
  {
    _id: "demo-3",
    serviceName: "Haute Bridal Couture & Custom Gown Experience",
    category: "Wedding Fashion",
    description:
      "Private showroom appointment with European silk gowns, cathedral veils, bespoke tuxedo tailoring and three fittings with your personal stylist.",
    price: 2900,
    location: "Beverly Hills, CA",
    images: [
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=900&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80",
    ],
    vendorId: {
      _id: "demo-vendor-1",
      businessName: "Atelier Lumiere Weddings",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces",
    },
    status: "approved",
    isActive: true,
  },
  {
    _id: "demo-4",
    serviceName: "Grand Crystal Ballroom Reception Package",
    category: "Wedding Venues",
    description:
      "Historic chandelier ballroom for 250 guests with gold chiavari seating, private bridal suite, valet parking and an on-site event coordinator.",
    price: 7800,
    location: "New York, NY",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=80",
    ],
    vendorId: {
      _id: "demo-vendor-2",
      businessName: "Eternal Estates Venues",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=96&h=96&fit=crop&crop=faces",
    },
    status: "approved",
    isActive: true,
  },
  {
    _id: "demo-5",
    serviceName: "Chef's Tasting Menu & Live Cooking Stations",
    category: "Catering Services",
    description:
      "Five-course plated dinner or interactive live stations, craft cocktail bar, artisan patisserie table and full service staff for up to 200 guests.",
    price: 4200,
    location: "Chicago, IL",
    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=900&q=80",
    ],
    vendorId: {
      _id: "demo-vendor-2",
      businessName: "Eternal Estates Venues",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=96&h=96&fit=crop&crop=faces",
    },
    status: "approved",
    isActive: true,
  },
  {
    _id: "demo-6",
    serviceName: "Bridal Glamour: Hair & Makeup Artistry",
    category: "Makeup & Styling",
    description:
      "Airbrush foundation, individual lash application, soft-glam hairstyle trials and an on-site touch-up artist who stays with you through the reception.",
    price: 950,
    location: "Miami, FL",
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=900&q=80",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=900&q=80",
    ],
    vendorId: {
      _id: "demo-vendor-3",
      businessName: "Rosé Beauty Atelier",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces",
    },
    status: "approved",
    isActive: true,
  },
  {
    _id: "demo-7",
    serviceName: "Enchanted Gazebo Ceremony & Photography",
    category: "Photography & Videography",
    description:
      "Full-day coverage with a second shooter, an enchanted garden gazebo first-look session, 600+ edited digital images and a handcrafted heirloom album.",
    price: 2600,
    location: "Austin, TX",
    images: [
      "https://images.unsplash.com/photo-1546195643-70f48f9c5b87?w=900&q=80",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80",
      "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=900&q=80",
    ],
    vendorId: {
      _id: "demo-vendor-3",
      businessName: "Rosé Beauty Atelier",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces",
    },
    status: "approved",
    isActive: true,
  },
  {
    _id: "demo-8",
    serviceName: "Rustic Estate Reception Styling",
    category: "Decoration & Florist",
    description:
      "Long-table farm styling with dried florals, layered linens, warm bistro lighting and a custom welcome installation designed around your palette.",
    price: 3800,
    location: "Seattle, WA",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80",
    ],
    vendorId: {
      _id: "demo-vendor-2",
      businessName: "Eternal Estates Venues",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=96&h=96&fit=crop&crop=faces",
    },
    status: "approved",
    isActive: true,
  },
];

/** Fallback when the API is offline: filter + sort the demo data locally. */
export function filterDemoServices(options: {
  search?: string;
  category?: string;
  location?: string;
  sort?: string;
}): Service[] {
  let result = [...DEMO_SERVICES];

  const search = options.search?.trim().toLowerCase();
  if (search) {
    result = result.filter((service) =>
      service.serviceName.toLowerCase().includes(search),
    );
  }

  if (options.category && options.category !== "all") {
    result = result.filter((service) => service.category === options.category);
  }

  const location = options.location?.trim().toLowerCase();
  if (location) {
    result = result.filter((service) =>
      service.location.toLowerCase().includes(location),
    );
  }

  if (options.sort === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (options.sort === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  }

  return result;
}
