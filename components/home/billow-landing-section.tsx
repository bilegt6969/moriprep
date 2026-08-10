"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function BillowLandingSection() {
  return (
    <section className="py-20 md:py-32 px-4 sm:px-6 bg-linear-to-b from-white to-neutral-50 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-[36px] font-medium tracking-tight text-neutral-900 mb-4">
            Built by students for students
          </h2>
          <p className="text-neutral-500 text-[15px] md:text-lg max-w-2xl mx-auto">
            Everything you need to learn and succeed on your DSAT journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "+45%",
              subtitle: "Order bumps",
              description:
                "Increase your knowledge with smart, well-timed practice sessions.",
            },
            {
              title: "Addon",
              subtitle: "6 months support",
              description: "Limited time offer",
              action: "Add for free",
            },
            {
              title: "Import products",
              subtitle: "Bring your content over",
              description:
                "Import practice materials from any source and start learning in minutes.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200/50 hover:shadow-md transition-shadow"
            >
              <div className="text-2xl font-bold text-neutral-900 mb-2">
                {item.title}
              </div>
              <div className="text-sm font-medium text-neutral-600 mb-3">
                {item.subtitle}
              </div>
              <p className="text-neutral-500 text-sm mb-4">
                {item.description}
              </p>
              {item.action && (
                <Link
                  href="/practice"
                  className="inline-block text-sm font-medium text-[#0061c9] hover:text-[#0042FF] transition-colors"
                >
                  {item.action} →
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
