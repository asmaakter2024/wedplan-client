"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

/** The three benefits shown next to the image. */
const FEATURES = [
  {
    title: "Trusted & Verified Vendors",
    description:
      "Every vendor is reviewed by our team before going live on WedPlan.",
  },
  {
    title: "Easy Booking Process",
    description:
      "Send a booking request in seconds and track its status from your dashboard.",
  },
  {
    title: "All-in-One Wedding Planning",
    description:
      "Venues, decor, photography, catering and more — all in one place.",
  },
];

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

/**
 * Eight-pointed gold star used before each benefit,
 * matching the design (drawn as a simple SVG polygon).
 */
const StarBurst = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M12 0 13.84 7.57 20.49 3.52 16.43 10.16 24 12 16.43 13.84 20.49 20.49 13.84 16.43 12 24 10.16 16.43 3.52 20.49 7.57 13.84 0 12 7.57 10.16 3.52 3.52 10.16 7.57Z" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const WhyChooseUs = () => {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — venue image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1546195643-70f48f9c5b87?w=1200&q=80"
              alt="Elegant wedding ceremony venue with white chairs and floral arch"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>

          {/* Right — heading + benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          >
            <h2 className="font-display text-3xl font-bold text-[#c9a227] md:text-4xl">
              Why Choose WedPlan?
            </h2>

            <p className="mt-3 text-base font-medium leading-relaxed text-gray-800 sm:text-lg">
              Your Trusted Partner in Crafting Unforgettable Wedding
              Celebrations
            </p>

            <p className="mt-4 text-sm leading-relaxed text-gray-500 sm:text-base">
              WedPlan brings together a carefully selected community of wedding
              vendors who specialize in turning your vision into reality. From
              elegant venues and exquisite decor to professional photography and
              more, we help you find the perfect team to make every moment
              special. With trusted services, seamless booking, and expert
              support, WedPlan makes planning your dream wedding simple,
              organized, and stress-free.
            </p>

            {/* Benefits list */}
            <ul className="mt-8 space-y-5">
              {FEATURES.map((feature, index) => (
                <motion.li
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.4, delay: 0.25 + index * 0.12 }}
                  className="flex items-start gap-3"
                >
                  <StarBurst className="mt-0.5 h-5 w-5 shrink-0 text-[#c9a227]" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 sm:text-base">
                      {feature.title}
                    </p>
                    <p className="mt-0.5 text-sm leading-relaxed text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
