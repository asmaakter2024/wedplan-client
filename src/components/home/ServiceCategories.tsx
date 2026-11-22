import Link from "next/link";
import Image from "next/image";

/* ------------------------------------------------------------------ */
/* Category data                                                       */
/* ------------------------------------------------------------------ */

type Category = {
  name: string;
  tag: string;
  description: string;
  image: string;
};

/**
 * The six categories required by the assignment.
 * Clicking a card opens the Browse Services page filtered by that category.
 */
const CATEGORIES: Category[] = [
  {
    name: "Photography & Videography",
    tag: "Cinematic Capture",
    description: "Timeless editorial storytelling, drone films & candid moments",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80",
  },
  {
    name: "Wedding Venues",
    tag: "Curated Spaces",
    description:
      "Historic estates, garden conservatories & luxury ballrooms",
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80",
  },
  {
    name: "Decoration & Florist",
    tag: "Botanical Artistry",
    description:
      "Bespoke floral arches, candlelit tablescapes & dreamy styling",
    image:
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=80",
  },
  {
    name: "Catering Services",
    tag: "Culinary Excellence",
    description:
      "Chef-crafted tasting menus, patisserie & craft beverage bars",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80",
  },
  {
    name: "Makeup & Styling",
    tag: "Bridal Glamour",
    description: "Radiant bridal beauty, hair artistry & on-site touch-up teams",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&q=80",
  },
  {
    name: "Wedding Fashion",
    tag: "Atelier Couture",
    description:
      "Couture bridal gowns, bespoke tuxedos & heirloom accessories",
    image:
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=900&q=80",
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

const ServiceCategories = () => {
  return (
    <section className="bg-[#f7f5f2] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header (centered) */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7a1f2b]">
            Explore by Specialty
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 md:text-4xl">
            Wedding Service Categories
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">
            Select a category to browse specialists tailored to every chapter of
            your wedding weekend.
          </p>
        </div>

        {/* Category cards */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category.name}
              href={`/services?category=${encodeURIComponent(category.name)}`}
              className="group relative block aspect-[4/3] overflow-hidden rounded-2xl"
            >
              {/* Background photo */}
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Dark gradient so the text stays readable */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
                aria-hidden="true"
              />

              {/* Text block */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="inline-block rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-gray-800">
                  {category.tag}
                </span>
                <h3 className="mt-2.5 font-display text-xl font-bold text-white">
                  {category.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-white/75 line-clamp-2">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCategories;
