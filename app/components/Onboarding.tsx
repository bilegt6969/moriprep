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

        <div className={styles.columns}>
          {/* Column 1 */}
          <div className={styles.column}>
            <div className={styles.panel}>
              <Image
                src="/mockup-onboarding.png"
                alt="Instant Access UI"
                width={400}
                height={300}
              />
            </div>
            <div className={styles.label} style={{ color: "#22C55E" }}>
              <span
                className={styles.iconDot}
                style={{ backgroundColor: "#22C55E" }}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.4693 0.605839C4.69442 0.179151 5.30551 0.179152 5.53063 0.60584L6.57392 2.58325C6.66074 2.74779 6.81898 2.86276 7.0023 2.89448L9.20532 3.27566C9.68069 3.35791 9.86953 3.93909 9.53329 4.28505L7.97506 5.88833C7.84539 6.02174 7.78495 6.20776 7.81143 6.39191L8.12968 8.6049C8.19836 9.08242 7.70397 9.44161 7.27105 9.22874L5.26471 8.24222C5.09776 8.16012 4.90217 8.16012 4.73521 8.24222L2.72888 9.22874C2.29595 9.44161 1.80157 9.08242 1.87024 8.6049L2.18849 6.39191C2.21497 6.20776 2.15453 6.02174 2.02487 5.88833L0.466636 4.28505C0.130399 3.93909 0.319237 3.35791 0.794608 3.27566L2.99763 2.89448C3.18095 2.86276 3.33919 2.74779 3.426 2.58325L4.4693 0.605839Z"
                    fill="white"
                  ></path>
                </svg>
              </span>
              Instant Access
            </div>
          </div>

          {/* Column 2 */}
          <div className={styles.column}>
            <div className={styles.panel}>
              <Image
                src="/mockup-mission-control.png"
                alt="Practice Dashboard UI"
                width={400}
                height={300}
              />
            </div>
            <div className={styles.label} style={{ color: "#F59E0B" }}>
              <span
                className={styles.iconDot}
                style={{ backgroundColor: "#F59E0B" }}
              >
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.200001"
                    width="4.4"
                    height="2.8"
                    rx="0.8"
                    fill="white"
                  ></rect>
                  <rect
                    x="5.40005"
                    width="4.4"
                    height="2.8"
                    rx="0.8"
                    fill="white"
                  ></rect>
                  <rect
                    x="0.20005"
                    y="3.59998"
                    width="4.4"
                    height="2.8"
                    rx="0.8"
                    fill="white"
                  ></rect>
                  <rect
                    x="5.40005"
                    y="3.59998"
                    width="4.4"
                    height="2.8"
                    rx="0.8"
                    fill="white"
                  ></rect>
                  <rect
                    x="0.20005"
                    y="7.20001"
                    width="4.4"
                    height="2.8"
                    rx="0.8"
                    fill="white"
                  ></rect>
                </svg>
              </span>
              Practice Hub
            </div>
          </div>

          {/* Column 3 */}
          <div className={styles.column}>
            <div className={styles.panel}>
              <Image
                src="/mockup-drag-and-drop.png"
                alt="Analytics UI"
                width={400}
                height={300}
              />
            </div>
            <div className={styles.label} style={{ color: "#EF4444" }}>
              <span
                className={styles.iconDot}
                style={{ backgroundColor: "#EF4444" }}
              >
                <svg
                  width="12"
                  height="10"
                  viewBox="0 0 12 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="1.99993"
                    y="4.80001"
                    width="8"
                    height="4.8"
                    rx="1.2"
                    fill="white"
                    stroke="#EF4444"
                    strokeWidth="0.8"
                  ></rect>
                  <rect
                    x="1.19995"
                    y="2.80001"
                    width="9.6"
                    height="4.8"
                    rx="1.2"
                    fill="white"
                    stroke="#EF4444"
                    strokeWidth="0.8"
                  ></rect>
                  <rect
                    x="0.399988"
                    y="0.800012"
                    width="11.2"
                    height="4.8"
                    rx="1.2"
                    fill="white"
                    stroke="#EF4444"
                    strokeWidth="0.8"
                  ></rect>
                </svg>
              </span>
              Track & Improve
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
