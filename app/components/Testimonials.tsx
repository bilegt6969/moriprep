import Image from "next/image";
import Link from "next/link";

// Dynamic blog data for Mori Prep / Bytecode initiatives
const BLOG_POSTS = [
  {
    slug: "closing-the-dsat-gap",
    title: "Closing the DSAT Information Gap in Mongolia",
    date: "13 May, 2026",
    excerpt:
      "Why Bytecode built Mori Prep as a non-profit open education initiative to ensure that financial status never stands between a Mongolian student and world-class higher education. We are bringing structured test prep, open lessons, and strategy guides to everyone for free.",
    image: "/blog/closing-gap.png",
  },
  {
    slug: "official-question-bank-integration",
    title: "Integrating the Official College Board Question Bank",
    date: "2 April, 2026",
    excerpt:
      "How we brought thousands of official Digital SAT practice questions, multi-stage adaptive testing logic, and curated prep resources under one seamless, 100% free dashboard built for student success.",
    image: "/blog/collegeboard.png",
  },
];

export default function LatestFromMoriPrep() {
  return (
    // Outer section with the specific padding and max-width logic from the CSS
    <section className="pt-[7.75rem]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-10">
        {/* Heading with precise typography values */}
        <h1 className="font-medium text-[44px] leading-[48px] tracking-[-1.35px] text-[#121212] m-0">
          The latest from Bytecode & Mori Prep
        </h1>

        {/* Grid Container */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-[36px] pt-[2.75rem] pb-[76px] relative list-none">
          {BLOG_POSTS.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block w-full group pb-9"
              >
                <div className="flex flex-col gap-5">
                  {/* Image Container & Date */}
                  <div className="flex flex-col gap-6">
                    <div className="relative flex items-center justify-center overflow-hidden bg-[#FBFAF9] rounded-xl mb-[5px] z-10 aspect-[2160/1140]">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-[220ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.02]"
                      />
                    </div>

                    <div className="flex items-center gap-[10px] w-full text-[#888888]">
                      <p className="text-[15px] m-0">Published {post.date}</p>
                    </div>
                  </div>

                  {/* Text Content Container */}
                  <div className="flex flex-col gap-3">
                    <h5 className="text-[20px] font-medium leading-snug text-[#121212] m-0">
                      {post.title}
                    </h5>

                    {/* Excerpt with 3-line clamp */}
                    <div className="overflow-hidden">
                      <p className="text-[16px] leading-relaxed text-[#474645] m-0 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
