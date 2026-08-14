"use client";

import { ArrowLeft, Copy, Mail, Share2 } from "lucide-react";
import Link from "next/link";

export default function BlogPostPage() {
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
            <span>13 May, 2025</span>
            <span>by</span>
            <strong className="font-medium text-[#343433]">Family Team</strong>
            <span className="mx-1">/</span>
            <Link
              href="/blog"
              className="hover:text-[#343433] transition-colors"
            >
              News, Wallet
            </Link>
          </div>
          <h1 className="text-[36px] md:text-[44px] font-medium leading-[42px] md:leading-[48px] tracking-[-1.35px] text-[#343433]">
            The Crypto Wallet Problem – Why We Created Family Accounts
          </h1>
        </header>

        {/* Article Body */}
        <article className="flex flex-col gap-6 text-[17px] leading-[26px] tracking-[-0.22px] text-[#494440]">
          {/* Section: The Problem with Traditional Wallets */}
          <section id="the-problem-with-traditional-wallets" className="pt-6">
            <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
              The Problem with Traditional Wallets
            </h2>
            <p className="pb-8">
              Traditional wallets rely on seed phrases and private keys, but
              this approach has fundamental flaws. Losing access to your bank
              account because you misplaced a single piece of information would
              be unthinkable—yet in crypto, this remains a common reality. Most
              users struggle with managing seed phrases and private keys, often
              resorting to insecure storage methods like screenshots or digital
              notes.
            </p>
            <p className="pb-8">
              Even those who carefully write down their seed phrase risk losing
              it. A single mistake shouldn't mean losing access to your assets
              forever. Some argue that this is the cost of self-ownership, but
              at Family, we disagree. With the right design, security and ease
              of use can go hand in hand.
            </p>
            <p className="pb-8">
              Embedded wallets have simplified onboarding, but they often
              compromise self-custody. We set out to build something that is
              truly self-custodial—not just in theory, but in every practical
              scenario.
            </p>
            <p className="pb-4">
              The industry has explored multiple approaches:
            </p>
            <ul className="list-disc pl-6 space-y-2 pb-8 text-[#494440]">
              <li>
                HSMs with AWS permissions that can technically be revoked but
                remain a central point of control
              </li>
              <li>
                multi-party computation solutions that distributes private key
                shares but introduce dependencies on external parties
              </li>
              <li>
                PIN codes and weak encryption layers that create new security
                risks
              </li>
            </ul>
          </section>

          {/* Section: Introducing Family Accounts */}
          <section id="introducing-family-accounts" className="pt-6">
            <h2 className="text-[23px] font-medium leading-[28px] tracking-[-0.44px] text-[#343433] mb-4">
              Introducing Family Accounts
            </h2>
            <p className="pb-8">
              After extensive audits, we're introducing Family Accounts—a
              completely non-custodial approach to wallet management.
            </p>
            <p className="pb-8">
              Family Accounts use industry-standard encryption to validate only
              you can access your wallet, using information that only you
              control. This preserves the security principles of crypto while
              eliminating the friction and complexity of traditional wallet
              management.
            </p>
          </section>

          {/* Subsections */}
          <section id="seamless-authentication" className="pt-4">
            <h3 className="text-[19px] font-medium leading-[24px] tracking-[-0.3px] text-[#343433] mb-3">
              Seamless Authentication
            </h3>
            <p className="pb-8">
              With Family Accounts, users log in using an email or phone number,
              combined with a password or passkey. No more seed phrases, no
              unnecessary security hurdles. Every account is secured with
              two-factor authentication via email or SMS, ensuring that even if
              a password or passkey is compromised, encrypted data remains
              inaccessible without proof of device ownership.
            </p>
          </section>

          <section id="true-self-custody" className="pt-4">
            <h3 className="text-[19px] font-medium leading-[24px] tracking-[-0.3px] text-[#343433] mb-3">
              True Self-Custody
            </h3>
            <p className="pb-8">
              Decryption happens entirely on the client side, making Family
              Accounts 100% self-custodial. Your private key exists only in
              memory while you're online. On the web, we use iframes and secure
              communication protocols to protect decrypted keys from exposure.
              On iOS, your key never leaves your device.
            </p>
          </section>

          <section id="built-in-recovery-options" className="pt-4">
            <h3 className="text-[19px] font-medium leading-[24px] tracking-[-0.3px] text-[#343433] mb-3">
              Built-In Recovery Options
            </h3>
            <p className="pb-8">
              Recovery is integrated directly into your devices. If you forget
              your password or lose your passkey, you can recover your account
              as long as you've previously logged in on that device before. For
              added security, we provide account recovery codes that can be
              stored separately.
            </p>
          </section>

          {/* Diagram / Visual Placeholder */}
          <div className="my-8 flex justify-center items-center w-full rounded-lg bg-[#FBFAF9] border border-[#f2f0ed] p-12">
            <div className="text-center text-[#848281] text-[15px]">
              [Account Creation Architecture Diagram Placeholder]
            </div>
          </div>
        </article>

        {/* Footer Sharing & Metadata Section */}
        <div className="mt-16 pt-12 border-t border-[#f2f0ed] flex flex-col gap-8 text-[15px] text-[#848281]">
          {/* Share Article */}
          <div>
            <h4 className="font-medium text-[#343433] mb-3">Share Article</h4>
            <div className="flex items-center gap-4 text-[#494440]">
              <a
                href="#facebook"
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
              </a>
              <a
                href="#twitter"
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
              </a>
              <a
                href="#email"
                className="p-2 bg-[#FBFAF9] rounded-full hover:bg-[#EAEAEA] transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="#copy"
                className="p-2 bg-[#FBFAF9] rounded-full hover:bg-[#EAEAEA] transition-colors"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-medium text-[#343433] mb-2">Resources</h4>
            <button className="text-[#1A88F8] hover:underline inline-flex items-center gap-1.5">
              <Copy className="w-3.5 h-3.5" /> Copy Text
            </button>
          </div>

          {/* About Family */}
          <div>
            <h4 className="font-medium text-[#343433] mb-2">About Family</h4>
            <p className="leading-[22px]">
              Family is part of{" "}
              <a
                href="https://avara.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A88F8] hover:underline"
              >
                Avara
              </a>{" "}
              and creates best-in-class crypto products, including its flagship
              eponymous Ethereum wallet for mobile, as well as{" "}
              <a
                href="https://connectkit.family.co"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A88F8] hover:underline"
              >
                ConnectKit
              </a>
              , a powerful developer library for wallet-to-dapp connectivity.
            </p>
          </div>

          {/* About Avara */}
          <div>
            <h4 className="font-medium text-[#343433] mb-2">About Avara</h4>
            <p className="leading-[22px]">
              Avara is a leading web3 technology company building products for
              users, creatives, and developers. Founded by Stani Kulechov, Avara
              created the pioneering{" "}
              <a
                href="https://aave.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A88F8] hover:underline"
              >
                Aave Protocol
              </a>{" "}
              as well as the Aave-native stablecoin{" "}
              <a
                href="https://gho.aave.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A88F8] hover:underline"
              >
                GHO
              </a>
              , and social network{" "}
              <a
                href="https://lens.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A88F8] hover:underline"
              >
                Lens
              </a>
              . Avara's vision is a people-powered internet that benefits all.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
