"use client";

import { motion } from "framer-motion";
import { Heart, CalendarCheck, Search } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type Step = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

/** The three steps required by the design. */
const STEPS: Step[] = [
  {
    icon: Search,
    title: "Discover & Search",
    description:
      "Browse verified wedding services, venues, and vendors tailored to your style.",
  },
  {
    icon: CalendarCheck,
    title: "Book with Confidence",
    description:
      "Send booking requests, compare options, and confirm your favorites hassle-free.",
  },
  {
    icon: Heart,
    title: "Plan Your Dream Wedding",
    description:
      "Track everything in one dashboard and enjoy a smooth planning journey.",
  },
];

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const HowItWorks = () => {
  return (
    <section className="bg-[#f7f5f2] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header (centered) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl font-bold text-gray-900 md:text-4xl">
            How WedPlan Works
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-500 sm:text-base">
            Follow 3 simple steps to plan your perfect wedding
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-12">
          {/* Dashed connectors between the steps (desktop only) */}
          <svg
            className="pointer-events-none absolute left-0 top-9 hidden h-16 w-full lg:block"
            viewBox="0 0 1200 64"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 340 32 Q 450 4 560 32"
              stroke="#c9a227"
              strokeWidth="2"
              strokeDasharray="6 8"
              strokeLinecap="round"
            />
            <path
              d="M 740 32 Q 850 60 960 32"
              stroke="#c9a227"
              strokeWidth="2"
              strokeDasharray="6 8"
              strokeLinecap="round"
            />
          </svg>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.15,
                    ease: "easeOut",
                  }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Gold circle with white icon */}
                  <div className="flex h-18 w-18 items-center justify-center rounded-full bg-[#c9a227] shadow-lg shadow-amber-200/60">
                    <Icon className="h-7 w-7 text-white" aria-hidden="true" />
                  </div>

                  <h3 className="mt-5 font-display text-lg font-bold text-gray-900 sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[22rem] text-sm leading-relaxed text-gray-500">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
