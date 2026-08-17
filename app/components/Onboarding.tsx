import Image from "next/image";
import styles from "./Onboarding.module.css";

export default function OnboardingSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>
          Effortless practice.
          <br />
          Masterful preparation.
        </h2>

        <div className={styles.contentWrapper}>
          <div className={styles.imageContainer}>
            <Image
              src="/home/67.png"
              alt="Onboarding"
              width={400}
              height={200}
            />
          </div>
          <p className={styles.message}>
            Be patient! 🐴 We're a small non-profit, not a massive dev team.
            We're building things step by step to make everything effortless.
            Join us and grow together! 🚀
          </p>
        </div>
      </div>
    </section>
  );
}
