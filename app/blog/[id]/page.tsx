"use client";

import { ArrowLeft, Copy, Mail, Share2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ReactNode, useState } from "react";

const blogPosts: Record<
  string,
  {
    title: string;
    date: string;
    author: string;
    categories: string[];
    content: ReactNode;
  }
> = {
  "closing-dsat-information-gap": {
    title: "Closing the DSAT Information Gap in Mongolia",
    date: "13 May, 2026",
    author: "Bytecode Team",
    categories: ["News", "Education"],
    content: (
      <>
        <p className="pb-8">
          There are talented students everywhere in Mongolia.
        </p>
        <p className="pb-8">
          Some live in Ulaanbaatar. Some live hundreds of kilometers away. Some
          attend expensive private schools. Others study in public schools with
          far fewer resources. Some have parents who can spend millions of
          tugriks on university preparation. Others have a laptop, an internet
          connection, and a dream.
        </p>
        <p className="pb-8">
          What separates these students is not always ability.
        </p>
        <p className="pb-8">Sometimes, it is information.</p>
        <p className="pb-8">
          For many Mongolian students preparing for the Digital SAT, even
          figuring out <strong>how to prepare</strong> can become an obstacle.
          Students often turn to Reddit, Instagram, Facebook groups, Telegram
          channels, older students, or whatever resources they can find online.
          Some buy preparation books from other students. Some enroll in
          expensive SAT preparation courses that can cost millions of Mongolian
          tugriks. Others simply do not know that official SAT preparation
          resources exist at all.
        </p>
        <p className="pb-8">
          The information is out there. But knowing that it exists, knowing
          which information to trust, and knowing how to use it effectively are
          three very different things.
        </p>
        <p className="pb-8">That is the information gap.</p>
        <p className="pb-8">And that is why we built Mori Prep.</p>

        <section id="the-hidden-price" className="pt-6">
          <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
            The hidden price of taking the SAT
          </h2>
          <p className="pb-8">
            Preparing for the SAT can already be stressful. For an international
            student, it is only one part of a much larger process: understanding
            U.S. universities, financial aid, application requirements, essays,
            deadlines, scholarships, and standardized testing.
          </p>
          <p className="pb-8">
            In Mongolia, the problem often begins even earlier.
          </p>
          <p className="pb-8">
            A student might know that the SAT matters, but not know what score
            they should aim for.
          </p>
          <p className="pb-8">
            They might have taken a practice test, but not know what their
            weaknesses are.
          </p>
          <p className="pb-8">
            They might know they need to improve their math score, but not know
            which specific concepts are holding them back.
          </p>
          <p className="pb-8">
            They might spend months studying without ever understanding whether
            their preparation is actually working.
          </p>
          <p className="pb-8">
            And when they look for help, the easiest option can appear to be
            paying for a course.
          </p>
          <p className="pb-8">
            There is nothing inherently wrong with paid education. Good teachers
            and good preparation programs deserve to be compensated.
          </p>
          <p className="pb-8">
            But we began asking ourselves a different question:
          </p>
          <p className="pb-8 font-semibold">
            What happens to the student who simply cannot afford it?
          </p>
          <p className="pb-8">
            If a student has to spend millions of tugriks just to gain access to
            information that is fundamentally available online, then financial
            circumstances are quietly becoming an admissions advantage.
          </p>
          <p className="pb-8">We don't think that should be the case.</p>
        </section>

        <section id="information-is-free" className="pt-6">
          <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
            Information is free. So why is access so expensive?
          </h2>
          <p className="pb-8">
            Bytecode was founded in the summer of 2023 with a very simple idea.
          </p>
          <p className="pb-8">
            We wanted to make learning to code more accessible in Mongolia.
          </p>
          <p className="pb-8">
            At the time, we saw students hesitate to learn programming because
            many of the available learning opportunities came with a price tag.
            Yet the internet already contained an enormous amount of
            high-quality educational information that was freely available.
          </p>
          <p className="pb-8">We kept asking ourselves:</p>
          <p className="pb-8 font-semibold">
            If the information is already available on the internet, why should
            access to learning it depend on whether someone can afford a course?
          </p>
          <p className="pb-8">
            So Bytecode began as an open-source coding education initiative.
          </p>
          <p className="pb-8">
            The goal was never simply to build another educational website. It
            was to make knowledge easier to access.
          </p>
          <p className="pb-8">
            That same philosophy eventually brought us to standardized testing.
          </p>
          <p className="pb-8">
            We realized that the problem we had seen in coding existed in
            another form in university preparation.
          </p>
          <p className="pb-8">
            There were Mongolian students who wanted to study abroad, but many
            of them had no reliable place to begin preparing for the SAT.
          </p>
          <p className="pb-8">There was no single platform they could trust.</p>
          <p className="pb-8">There was no obvious starting point.</p>
          <p className="pb-8">
            There was no system telling them, clearly,{" "}
            <em>
              this is where you are, this is where you need to go, and this is
              what you should work on next.
            </em>
          </p>
          <p className="pb-8">So we decided to build one.</p>
        </section>

        <section id="meet-mori-prep" className="pt-6">
          <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
            Meet Mori Prep
          </h2>
          <p className="pb-8">
            Mori means <strong>horse</strong> in Mongolian.
          </p>
          <p className="pb-8">
            We chose the name because horses are intelligent, capable, and fast.
            We want Mori Prep users to become smarter and faster learners as
            they prepare for the opportunities ahead of them.
          </p>
          <p className="pb-8">
            Mori Prep is our attempt to build the SAT preparation infrastructure
            we wish more Mongolian students had access to.
          </p>
          <p className="pb-8">
            The platform currently provides a Digital SAT question bank using
            official College Board questions, alongside resources for SAT Math,
            Reading and Writing, vocabulary, SAT preparation, and the broader
            college application process.
          </p>
          <p className="pb-8">
            We are also continuing to build new features, including full-length
            practice tests, more extensive Math resources, and AI-powered
            explanations.
          </p>
          <p className="pb-8">
            But the technology itself isn't the most important part.
          </p>
          <p className="pb-8 font-semibold">
            The important part is that a student's ability to use Mori Prep
            should not depend on their family's income.
          </p>
          <p className="pb-8">
            Whether you are a student in Ulaanbaatar or studying in the
            countryside, if you have a computer and an internet connection, you
            can use the same platform.
          </p>
          <p className="pb-8">
            The gap between students should not be determined by geography.
          </p>
          <p className="pb-8">
            It shouldn't be determined by the school they attend.
          </p>
          <p className="pb-8">
            And it shouldn't be determined by how many millions of tugriks their
            family can spend on preparation.
          </p>
        </section>

        <section id="you-dont-need-to-be-rich" className="pt-6">
          <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
            You don't need to be rich to study abroad
          </h2>
          <p className="pb-8">
            There is a perception that studying abroad, especially in the United
            States, is something reserved for wealthy families.
          </p>
          <p className="pb-8">And honestly, we understand why.</p>
          <p className="pb-8">
            The application process can look expensive and complicated from the
            outside.
          </p>
          <p className="pb-8">
            But there is another side of the story that is much less visible.
          </p>
          <p className="pb-8">
            Many universities provide substantial financial aid to international
            students, and some Mongolian students are able to attend U.S.
            universities with scholarships and financial aid covering most or
            even all of their costs.
          </p>
          <p className="pb-8">
            For a student who has never encountered that possibility before,
            simply learning that these opportunities exist can change the
            trajectory of their life.
          </p>
          <p className="pb-8">
            That is why we believe information itself can be a form of
            opportunity.
          </p>
          <p className="pb-8">
            A student cannot apply for a scholarship they do not know exists.
          </p>
          <p className="pb-8">
            They cannot prepare for the SAT if they do not know where to start.
          </p>
          <p className="pb-8">
            They cannot aim for a score if nobody has explained what they should
            be aiming for.
          </p>
          <p className="pb-8">
            And they cannot identify their weaknesses if they have no way to
            measure them.
          </p>
          <p className="pb-8">The first step is access.</p>
        </section>

        <section id="filling-the-gap" className="pt-6">
          <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
            Filling the gap with knowledge, not money
          </h2>
          <p className="pb-8">Imagine two students.</p>
          <p className="pb-8">
            One can afford millions of tugriks for private SAT preparation. They
            have teachers, books, practice materials, and someone who can tell
            them exactly what to study.
          </p>
          <p className="pb-8">The other student cannot afford any of that.</p>
          <p className="pb-8">
            The first student can fill the information gap with money.
          </p>
          <p className="pb-8">
            The second student shouldn't have to accept that the gap is
            permanent.
          </p>
          <p className="pb-8 font-semibold">
            Mori Prep is our attempt to fill that gap with an open educational
            platform instead.
          </p>
          <p className="pb-8">
            We don't want to put advertisements between students and their
            education.
          </p>
          <p className="pb-8">
            We don't want to put a subscription fee between a student and a
            practice question.
          </p>
          <p className="pb-8">
            We don't want a student's financial situation to determine how much
            of the platform they can access.
          </p>
          <p className="pb-8">That is why Mori Prep is non-profit.</p>
          <p className="pb-8">And we intend to keep it that way.</p>
        </section>

        <section id="we-are-still-at-the-beginning" className="pt-6">
          <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
            We are still at the beginning
          </h2>
          <p className="pb-8">
            Mori Prep officially launched at the beginning of August 2026.
          </p>
          <p className="pb-8">
            Since then, around 700 students have already joined the platform,
            and students have collectively spent roughly 60 hours using its
            resources to prepare and practice.
          </p>
          <p className="pb-8">For us, those numbers are not just statistics.</p>
          <p className="pb-8">
            Every hour represents someone choosing to learn.
          </p>
          <p className="pb-8">
            Every practice question represents someone trying to get a little
            closer to their goal.
          </p>
          <p className="pb-8">
            And every student who uses Mori Prep without paying for an expensive
            preparation course is another example of what open education can
            make possible.
          </p>
          <p className="pb-8">We are still building.</p>
          <p className="pb-8">
            The question bank is growing. More practice tests are being
            integrated. More explanations and preparation resources are being
            added. The platform itself is evolving alongside the students using
            it.
          </p>
          <p className="pb-8">But the principle will remain the same.</p>
        </section>

        <section id="students-potential" className="pt-6">
          <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
            A student's potential should not have a price tag
          </h2>
          <p className="pb-8">
            We don't know where every Mori Prep student will end up.
          </p>
          <p className="pb-8">
            Maybe some will attend universities in the United States.
          </p>
          <p className="pb-8">Maybe some will study somewhere else.</p>
          <p className="pb-8">
            Maybe some will decide that the SAT is not the path they want to
            take at all.
          </p>
          <p className="pb-8">That's okay.</p>
          <p className="pb-8">
            Our goal isn't to decide what a student should become.
          </p>
          <p className="pb-8">
            Our goal is to make sure that if a student <strong>does</strong>{" "}
            decide to pursue an opportunity, lack of money doesn't stop them
            before they even get the chance to try.
          </p>
          <p className="pb-8">
            Mongolia has students with extraordinary potential.
          </p>
          <p className="pb-8">Some are already surrounded by opportunities.</p>
          <p className="pb-8">Others are still searching for them.</p>
          <p className="pb-8">
            We believe the internet can help make that difference smaller.
          </p>
          <p className="pb-8">
            Bytecode started with coding because we believed knowledge shouldn't
            be locked behind a price tag when the knowledge itself is already
            available to everyone.
          </p>
          <p className="pb-8">
            Mori Prep is the next expression of that belief.
          </p>
          <p className="pb-8">
            We are building a bridge across the information gap.
          </p>
          <p className="pb-8">Not with money.</p>
          <p className="pb-8">With knowledge.</p>
          <p className="pb-8">
            And if all a student has is a computer, an internet connection, and
            the willingness to work hard, we want that to be enough to get
            started.
          </p>
          <p className="pb-8 font-semibold">
            Hope for the best. Work as hard as you can. And give yourself a
            chance.
          </p>
          <p className="pb-8">
            Because sometimes, the first thing standing between a student and a
            world-class education isn't ability.
          </p>
          <p className="pb-8">It's simply knowing that the door exists.</p>
        </section>
      </>
    ),
  },
  "integrating-college-board-question-bank": {
    title: "Integrating the Official College Board Question Bank",
    date: "2 April, 2026",
    author: "Bytecode Team",
    categories: ["News", "Education"],
    content: (
      <>
        <p className="pb-8">
          How we brought thousands of official Digital SAT practice questions,
          multi-stage adaptive testing logic, and curated prep resources under
          one seamless, 100% free dashboard built for student success.
        </p>

        <section id="it-started-with-one-question" className="pt-6">
          <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
            It started with one question: What can we build around the official
            material?
          </h2>
          <p className="pb-8">
            When we started working on Mori Prep, we didn't want to create
            another collection of SAT questions.
          </p>
          <p className="pb-8">The official questions already exist.</p>
          <p className="pb-8">
            College Board provides thousands of official Digital SAT practice
            questions through its Student Question Bank, organized by section,
            domain, skill, and difficulty.
          </p>
          <p className="pb-8">The opportunity was somewhere else:</p>
          <p className="pb-8 font-semibold">
            Could we build a better way for students to practice with them?
          </p>
          <p className="pb-8">
            Instead of sending students between different resources, we wanted
            to create one environment where questions, practice, performance,
            and preparation could live together.
          </p>
          <p className="pb-8">That sounds simple.</p>
          <p className="pb-8">Building it wasn't.</p>
        </section>

        <section id="turning-thousands-of-questions" className="pt-6">
          <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
            Turning thousands of questions into a usable system
          </h2>
          <p className="pb-8">
            A large question bank is only useful when students can navigate it
            effectively.
          </p>
          <p className="pb-8">
            We built Mori Prep's question experience around the structure of the
            Digital SAT, allowing students to work with official questions while
            organizing their practice around the concepts and skills that
            matter.
          </p>
          <p className="pb-8">
            Instead of treating every question as an isolated item, each
            question becomes part of a larger learning system.
          </p>
          <p className="pb-8">
            Students can practice by section, work on specific areas, and
            progressively identify the areas where they need more attention.
          </p>
          <p className="pb-8">The goal is to reduce the friction between:</p>
          <p className="pb-8 font-semibold">"I need to practice."</p>
          <p className="pb-8 font-semibold">and</p>
          <p className="pb-8 font-semibold">
            "I know exactly what I should practice."
          </p>
        </section>

        <section id="building-the-digital-sat-experience" className="pt-6">
          <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
            Building the Digital SAT experience
          </h2>
          <p className="pb-8">
            The Digital SAT introduced a fundamentally different testing
            experience from the old paper-based SAT.
          </p>
          <p className="pb-8">
            One of the most important parts of that experience is its multistage
            adaptive structure. Each section is divided into two modules, with
            performance in the first module influencing the difficulty of the
            second.
          </p>
          <p className="pb-8">
            We wanted Mori Prep to reflect that structure rather than treating a
            practice test as a simple sequence of unrelated questions.
          </p>
          <p className="pb-8">That required building logic around:</p>
          <p className="pb-8 font-semibold">Module progression.</p>
          <p className="pb-8 font-semibold">Question selection.</p>
          <p className="pb-8 font-semibold">Difficulty.</p>
          <p className="pb-8 font-semibold">Student performance.</p>
          <p className="pb-8 font-semibold">Timing.</p>
          <p className="pb-8">
            The result is a practice architecture designed around the way the
            Digital SAT actually works.
          </p>
        </section>

        <section id="the-context-matters" className="pt-6">
          <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
            The question isn't enough. The context matters.
          </h2>
          <p className="pb-8">
            One of our biggest design decisions was to think beyond simply
            presenting a question and four answer choices.
          </p>
          <p className="pb-8">
            A student also needs to understand where that question fits.
          </p>
          <p className="pb-8">What skill is it testing?</p>
          <p className="pb-8">How difficult is it?</p>
          <p className="pb-8">What does getting it wrong tell me?</p>
          <p className="pb-8">What should I practice next?</p>
          <p className="pb-8">
            This is why the metadata surrounding each question is just as
            important as the question itself.
          </p>
          <p className="pb-8">
            The more structured the underlying data is, the more useful the
            platform can become.
          </p>
          <p className="pb-8">
            It allows us to build better filtering, better practice sessions,
            better analytics, and eventually better recommendations.
          </p>
        </section>

        <section id="from-answers-to-weaknesses" className="pt-6">
          <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
            From answers to weaknesses
          </h2>
          <p className="pb-8">
            Getting 7 out of 10 questions correct tells you something.
          </p>
          <p className="pb-8">
            Knowing <em>which three skills produced those mistakes</em> tells
            you much more.
          </p>
          <p className="pb-8">
            Mori Prep is designed to make that distinction possible.
          </p>
          <p className="pb-8">
            Rather than focusing only on an overall practice result, we can
            organize performance around the underlying skills and domains
            represented in the question bank.
          </p>
          <p className="pb-8">
            That gives students a more useful answer to a much more important
            question:
          </p>
          <p className="pb-8 font-semibold">What should I work on now?</p>
          <p className="pb-8">
            This is also the foundation for future features that can make
            practice increasingly personalized.
          </p>
        </section>

        <section id="why-adaptive-practice-matters" className="pt-6">
          <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
            Why adaptive practice matters
          </h2>
          <p className="pb-8">Not every student needs the same questions.</p>
          <p className="pb-8">
            A student who consistently performs well on a particular skill
            shouldn't spend all of their preparation time answering basic
            questions in that area.
          </p>
          <p className="pb-8">
            At the same time, a student struggling with a specific concept
            shouldn't be forced into increasingly difficult material without
            first addressing the underlying weakness.
          </p>
          <p className="pb-8">
            Adaptive logic gives us a framework for making practice respond to
            the student rather than forcing every student through exactly the
            same sequence.
          </p>
          <p className="pb-8">
            We're continuing to improve this system as we build more
            sophisticated ways of connecting performance with practice.
          </p>
        </section>

        <section id="one-place-for-preparation" className="pt-6">
          <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
            One place for preparation
          </h2>
          <p className="pb-8">
            The question bank is only one part of Mori Prep.
          </p>
          <p className="pb-8">
            We've also been bringing together supplementary preparation
            materials, including resources for Math, Reading and Writing,
            vocabulary, and broader SAT preparation.
          </p>
          <p className="pb-8">
            The point isn't to collect as many resources as possible.
          </p>
          <p className="pb-8">It's to make them easier to use together.</p>
          <p className="pb-8">
            A student shouldn't have to open one resource to practice questions,
            another to review concepts, another to find vocabulary, and another
            to understand their performance.
          </p>
          <p className="pb-8">
            We're working toward one connected preparation experience.
          </p>
        </section>

        <section id="building-the-dashboard" className="pt-6">
          <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
            Building the dashboard
          </h2>
          <p className="pb-8">
            This also changed how we approached the interface.
          </p>
          <p className="pb-8">
            Instead of designing separate pages that happen to contain different
            features, we wanted the dashboard to become the center of the
            experience.
          </p>
          <p className="pb-8">
            From there, students can move between practice and preparation
            without losing context.
          </p>
          <p className="pb-8">
            The interface is intentionally simple because the complexity should
            exist underneath the product—not in front of the student.
          </p>
          <p className="pb-8">
            A student shouldn't need to understand our database structure,
            filtering system, or adaptive algorithms.
          </p>
          <p className="pb-8">
            They should simply be able to open Mori Prep and practice.
          </p>
        </section>

        <section id="ai-explanations" className="pt-6">
          <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
            AI explanations are the next layer
          </h2>
          <p className="pb-8">Correct and incorrect answers are useful.</p>
          <p className="pb-8">An explanation can be even more useful.</p>
          <p className="pb-8">
            We're currently working on integrating AI-powered explanations so
            that students can get additional context when they don't understand
            why an answer is correct.
          </p>
          <p className="pb-8">
            The goal isn't to replace learning with an AI-generated answer.
          </p>
          <p className="pb-8">It's to make the feedback loop faster.</p>
          <p className="pb-8 font-semibold">
            Question → attempt → mistake → explanation → understanding → another
            attempt.
          </p>
          <p className="pb-8">
            That cycle is where much of the learning happens.
          </p>
        </section>

        <section id="more-than-a-question-bank" className="pt-6">
          <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
            More than a question bank
          </h2>
          <p className="pb-8">
            Ultimately, the project isn't about importing thousands of
            questions.
          </p>
          <p className="pb-8">
            It's about building the infrastructure around them.
          </p>
          <p className="pb-8">Official questions provide the content.</p>
          <p className="pb-8">Our systems organize that content.</p>
          <p className="pb-8">Adaptive logic makes practice responsive.</p>
          <p className="pb-8">Performance data gives context.</p>
          <p className="pb-8">Explanations provide feedback.</p>
          <p className="pb-8">The dashboard connects everything.</p>
          <p className="pb-8">
            Each part is useful independently, but the real value comes from
            making them work together.
          </p>
        </section>

        <section id="whats-next" className="pt-6">
          <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
            What's next
          </h2>
          <p className="pb-8">The current system is only the beginning.</p>
          <p className="pb-8">
            We're continuing to work on full-length practice tests, expanded
            Math preparation, better performance analytics, AI explanations, and
            more sophisticated adaptive experiences.
          </p>
          <p className="pb-8">
            The goal is to keep moving from a platform where students{" "}
            <strong>find questions</strong> toward one where the platform helps
            students understand{" "}
            <strong>which questions they should be doing next and why</strong>.
          </p>
          <p className="pb-8">Because a great question bank is valuable.</p>
          <p className="pb-8">
            But a great learning system can do much more with it.
          </p>
          <p className="pb-8">And that's what we're building.</p>
        </section>
      </>
    ),
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const postId = params.id as string;
  const post = blogPosts[postId];
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(
      post?.title || "Check out this article from Mori Prep",
    );
    const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(
      post?.title || "Check out this article from Mori Prep",
    );
    const body = encodeURIComponent(
      `I thought you might be interested in this article from Mori Prep:\n\n${shareUrl}`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        setToastMessage("Link copied to clipboard");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      })
      .catch(() => {
        setToastMessage("Failed to copy link");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      });
  };

  const handleCopyText = () => {
    const articleText = `${post?.title}\n\n${post?.date}\n\nBy ${post?.author}\n\n${post?.categories.join(", ")}`;
    navigator.clipboard
      .writeText(articleText)
      .then(() => {
        setToastMessage("Article text copied");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      })
      .catch(() => {
        setToastMessage("Failed to copy text");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      });
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-white text-neutral-medium font-sans flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[36px] font-medium text-[#343433] mb-4">
            Post not found
          </h1>
          <Link href="/blog" className="text-[#1A88F8] hover:underline">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-neutral-medium font-sans selection:bg-[#D8ECFC] selection:text-[#008cff]">
      <div className="max-w-[48rem] mx-auto px-6 pt-12 py-16 md:py-24">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[15px] font-medium text-[#848281] hover:text-[#343433] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back to Blog
          </Link>
        </div>

        {/* Header Section */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-[15px] text-[#848281] mb-6">
            <span>{post.date}</span>
            <span>by</span>
            <strong className="font-medium text-[#343433]">
              {post.author}
            </strong>
            <span className="mx-1">/</span>
            <Link
              href="/blog"
              className="hover:text-[#343433] transition-colors"
            >
              {post.categories.join(", ")}
            </Link>
          </div>
          <h1 className="text-[36px] md:text-[44px] font-medium leading-[42px] md:leading-[48px] tracking-[-1.35px] text-[#343433]">
            {post.title}
          </h1>
        </header>

        {/* Article Body */}
        <article className="flex flex-col gap-6 text-[17px] leading-[26px] tracking-[-0.22px] text-[#494440]">
          {post.content}
        </article>

        {/* Footer Sharing & Metadata Section */}
        <div className="mt-16 pt-12 border-t border-[#f2f0ed] flex flex-col gap-8 text-[15px] text-[#848281]">
          {/* Share Article */}
          <div>
            <h4 className="font-medium text-[#343433] mb-3">Share Article</h4>
            <div className="flex items-center gap-4 text-[#494440]">
              <button
                onClick={handleFacebookShare}
                className="p-2 bg-[#FBFAF9] rounded-full hover:bg-[#EAEAEA] transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </button>
              <button
                onClick={handleTwitterShare}
                className="p-2 bg-[#FBFAF9] rounded-full hover:bg-[#EAEAEA] transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </button>
              <button
                onClick={handleEmailShare}
                className="p-2 bg-[#FBFAF9] rounded-full hover:bg-[#EAEAEA] transition-colors"
              >
                <Mail className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopyLink}
                className="p-2 bg-[#FBFAF9] rounded-full hover:bg-[#EAEAEA] transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-medium text-[#343433] mb-2">Resources</h4>
            <button
              onClick={handleCopyText}
              className="text-[#1A88F8] hover:underline inline-flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" /> Copy Text
            </button>
          </div>

          {/* About Mori Prep */}
          <div>
            <h4 className="font-medium text-[#343433] mb-2">About Mori Prep</h4>
            <p className="leading-[22px]">
              Mori Prep is a non-profit open education initiative by{" "}
              <a
                href="https://bytecode.mn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A88F8] hover:underline"
              >
                Bytecode
              </a>{" "}
              dedicated to making Digital SAT preparation accessible to every
              student in Mongolia.
            </p>
          </div>

          {/* About Bytecode */}
          <div>
            <h4 className="font-medium text-[#343433] mb-2">About Bytecode</h4>
            <p className="leading-[22px]">
              Bytecode was founded in 2023 to make learning to code more
              accessible in Mongolia through open-source education initiatives.
              Mori Prep extends this mission to university preparation, ensuring
              financial status never stands between a Mongolian student and
              world-class higher education.
            </p>
          </div>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-200">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
