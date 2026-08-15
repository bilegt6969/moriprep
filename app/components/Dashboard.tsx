"use client";

import { useState } from "react";

export function Dashboard() {
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  const toggleDomain = (domain: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : [...prev, domain],
    );
  };

  return (
    <section className="py-12 px-4 md:px-8 bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          Practice, Learn, Review. All in one place.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score Prediction Card */}
          <div className="flex min-h-0 flex-1 flex-col bg-sky-100 px-3 pt-3.5 pb-0 md:px-4 md:pt-4 rounded-2xl">
            <div className="relative flex select-none flex-col overflow-hidden rounded-t-xl bg-sky-100 px-3 pt-3 pb-0 md:px-4 md:pt-4 min-h-0 flex-1">
              <div className="relative flex min-h-full flex-1 flex-col rounded-t-xl bg-background px-4 pt-4 pb-0 md:px-5 md:pt-5 md:pb-0">
                <div className="flex min-h-full flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="space-y-1">
                      <p className="font-medium text-[10px] text-muted-foreground sm:text-xs">
                        Predicted Score
                      </p>
                      <p className="font-dm-sans-regular text-2xl leading-none tracking-tight md:text-3xl text-foreground !text-4xl !leading-none !tracking-tighter sm:!text-[2.75rem] tabular-nums">
                        1420
                      </p>
                    </div>
                    <div className="my-2 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-muted-foreground sm:text-xs">
                          Reading & Writing
                        </p>
                        <p className="font-dm-sans-regular text-2xl leading-none tracking-tight md:text-3xl text-foreground mt-0.5 !text-lg !leading-none md:!text-lg tabular-nums">
                          720
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground sm:text-xs">
                          Math
                        </p>
                        <p className="font-dm-sans-regular text-2xl leading-none tracking-tight md:text-3xl text-foreground mt-0.5 !text-lg !leading-none md:!text-lg tabular-nums">
                          700
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-[10px] text-muted-foreground sm:text-xs">
                      Focus next
                    </p>
                    <div className="space-y-1">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="min-w-0 truncate text-[10px] text-foreground sm:text-xs">
                            Information and Ideas
                          </span>
                          <span className="shrink-0 text-[10px] text-muted-foreground sm:text-xs tabular-nums">
                            72%
                          </span>
                        </div>
                        <div
                          aria-hidden="true"
                          className="relative h-1 w-full overflow-hidden rounded-full bg-muted"
                        >
                          <div
                            className="absolute inset-y-0 left-0 rounded-full bg-accent-primary-foreground"
                            style={{ width: "72%" }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="min-w-0 truncate text-[10px] text-foreground sm:text-xs">
                            Craft and Structure
                          </span>
                          <span className="shrink-0 text-[10px] text-muted-foreground sm:text-xs tabular-nums">
                            58%
                          </span>
                        </div>
                        <div
                          aria-hidden="true"
                          className="relative h-1 w-full overflow-hidden rounded-full bg-muted"
                        >
                          <div
                            className="absolute inset-y-0 left-0 rounded-full bg-accent-primary-foreground"
                            style={{ width: "58%" }}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="min-w-0 truncate text-[10px] text-foreground sm:text-xs">
                            Standard English Conventions
                          </span>
                          <span className="shrink-0 text-[10px] text-muted-foreground sm:text-xs tabular-nums">
                            81%
                          </span>
                        </div>
                        <div
                          aria-hidden="true"
                          className="relative h-1 w-full overflow-hidden rounded-full bg-muted"
                        >
                          <div
                            className="absolute inset-y-0 left-0 rounded-full bg-accent-primary-foreground"
                            style={{ width: "81%" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Practice Domains List */}
          <div className="flex min-h-0 flex-1 flex-col bg-sky-100 px-3 pt-3.5 pb-0 md:px-4 md:pt-4 rounded-2xl">
            <div className="relative flex select-none flex-col overflow-hidden rounded-t-xl bg-sky-100 px-3 pt-3 pb-0 md:px-4 md:pt-4 min-h-0 flex-1">
              <div className="relative flex min-h-full flex-1 flex-col rounded-t-xl bg-transparent p-0">
                <div className="pointer-events-none flex min-h-full select-none flex-col">
                  <div className="flex flex-col divide-y-2 divide-subtle">
                    {[
                      {
                        name: "Information and Ideas",
                        subject: "R&W",
                        time: "30m",
                      },
                      { name: "Algebra", subject: "Math", time: "25m" },
                      { name: "Vocab", subject: "", time: "15m" },
                    ].map((domain) => (
                      <div
                        key={domain.name}
                        className="group relative w-full min-w-0 max-w-full overflow-hidden transition-all rounded-none px-4 pt-4 pb-3 cursor-pointer bg-transparent"
                        draggable="false"
                        role="button"
                        tabIndex={0}
                      >
                        <div className="relative z-10 flex items-start mb-2 gap-1.5">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={selectedDomains.includes(domain.name)}
                            onClick={() => toggleDomain(domain.name)}
                            className={`peer box-border rounded-lg border-2 me-2 ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shrink-0 border-foreground/20 bg-transparent size-5 ${
                              selectedDomains.includes(domain.name)
                                ? "border-primary bg-primary text-primary-foreground"
                                : ""
                            }`}
                          />
                          <div className="flex-1">
                            <button
                              className="block min-w-0 flex-1 cursor-pointer text-left no-underline"
                              type="button"
                            >
                              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                                <h4 className="break-words font-medium tracking-tight text-base leading-snug line-clamp-2 min-w-0">
                                  {domain.name}
                                </h4>
                              </div>
                            </button>
                          </div>
                        </div>
                        <button
                          className="relative z-10 flex w-full cursor-pointer items-center justify-between gap-1 bg-transparent p-0 text-left no-underline"
                          type="button"
                        >
                          <div className="flex items-center font-medium text-muted-foreground gap-x-2.5 gap-y-1 text-sm min-w-0 flex-1 flex-wrap">
                            {domain.subject && (
                              <span className="inline-flex shrink-0 items-center">
                                <span className="inline-flex align-middle w-fit max-w-full shrink-0 items-center rounded-lg font-semibold tracking-tight px-2 py-1.5 text-xs leading-none bg-accent-sat-english text-accent-sat-english-foreground">
                                  {domain.subject}
                                </span>
                              </span>
                            )}
                            <span className="inline-flex items-center gap-0.5">
                              <svg
                                className="size-4 opacity-60"
                                aria-hidden="true"
                                width="24px"
                                height="24px"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM13 8C13 7.44772 12.5523 7 12 7C11.4477 7 11 7.44772 11 8V12C11 12.2652 11.1054 12.5196 11.2929 12.7071L13.7929 15.2071C14.1834 15.5976 14.8166 15.5976 15.2071 15.2071C15.5976 14.8166 15.5976 14.1834 15.2071 13.7929L13 11.5858V8Z"
                                  fill="currentColor"
                                />
                              </svg>
                              <span>{domain.time}</span>
                            </span>
                          </div>
                          <span className="inline-flex shrink-0 items-center justify-end">
                            <span className="inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 h-8 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4 rounded-full bg-muted text-muted-foreground hover:bg-border hover:text-foreground focus-visible:ring-muted-foreground/50 group">
                              Start
                              <span className="inline-flex shrink-0 items-center justify-center opacity-60 transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                                <svg
                                  aria-hidden="true"
                                  width="24px"
                                  height="24px"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8.79289 5.29289C9.18342 4.90237 9.81643 4.90237 10.207 5.29289L16.207 11.2929C16.5975 11.6834 16.5975 12.3164 16.207 12.707L10.207 18.707C9.81643 19.0975 9.18342 19.0975 8.79289 18.707C8.40237 18.3164 8.40237 17.6834 8.79289 17.2929L14.0859 11.9999L8.79289 6.70696C8.40237 6.31643 8.40237 5.68342 8.79289 5.29289Z"
                                    fill="currentColor"
                                  />
                                </svg>
                              </span>
                            </span>
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="flex min-h-0 flex-1 flex-col bg-sky-100 px-3 pt-3.5 pb-0 md:px-4 md:pt-4 rounded-2xl">
            <div className="relative flex select-none flex-col overflow-hidden rounded-t-xl bg-sky-100 px-3 pt-3 pb-0 md:px-4 md:pt-4 min-h-0 flex-1">
              <div className="relative flex min-h-full flex-1 flex-col rounded-t-xl bg-transparent p-0">
                <div className="pointer-events-none flex min-h-full w-full select-none flex-col gap-2.5 md:gap-3">
                  <div className="relative flex w-full flex-col gap-2.5 overflow-hidden rounded-2xl bg-background p-3.5 md:gap-3 md:p-4">
                    <svg
                      className="pointer-events-none absolute -right-2 -bottom-2 size-20 -rotate-12 text-foreground opacity-[0.06] md:size-24"
                      aria-hidden="true"
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M7 2C5.34315 2 4 3.34315 4 5V19C4 20.6569 5.34315 22 7 22H17C18.6569 22 20 20.6569 20 19V5C20 3.34315 18.6569 2 17 2H7ZM6 19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V17.8293C17.6872 17.9398 17.3506 18 17 18H7C6.44772 18 6 18.4477 6 19ZM9 6C8.44772 6 8 6.44772 8 7C8 7.55228 8.44772 8 9 8H15C15.5523 8 16 7.55228 16 7C16 6.44772 15.5523 6 15 6H9ZM8 11C8 10.4477 8.44772 10 9 10H12C12.5523 10 13 10.4477 13 11C13 11.5523 12.5523 12 12 12H9C8.44772 12 8 11.5523 8 11Z"
                        fill="currentColor"
                      />
                    </svg>
                    <div className="relative min-w-0">
                      <p className="text-base text-foreground leading-snug">
                        Question bank
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-snug md:text-sm">
                        Work through questions at your own pace with full
                        explanations.
                      </p>
                    </div>
                    <button
                      className="inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap font-medium outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4 rounded-full bg-muted text-muted-foreground hover:bg-border hover:text-foreground focus-visible:ring-muted-foreground/50 h-7 w-fit text-xs"
                      tabIndex={-1}
                      type="button"
                    >
                      Continue
                    </button>
                  </div>
                  <div className="relative flex w-full flex-col gap-2.5 overflow-hidden rounded-2xl bg-background p-3.5 md:gap-3 md:p-4 -mb-6">
                    <svg
                      className="pointer-events-none absolute -right-2 -bottom-2 size-20 rotate-10 text-foreground opacity-[0.06] md:size-24"
                      aria-hidden="true"
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.06444 2C8.49628 2 7.97688 2.321 7.72279 2.82918L3.22279 11.8292C2.72412 12.8265 3.44936 14 4.56443 14H7.62982L5.62308 20.1874C5.15109 21.6427 6.90506 22.7879 8.04755 21.7703L21.6899 9.62015C22.7193 8.70329 22.0708 7 20.6922 7H16.7716L18.4086 4.27174C19.0084 3.27196 18.2883 2 17.1223 2H9.06444Z"
                        fill="currentColor"
                      />
                    </svg>
                    <div className="relative min-w-0">
                      <p className="text-base text-foreground leading-snug">
                        Question Rush
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-snug md:text-sm">
                        Race against the clock to practice your speed.
                      </p>
                    </div>
                    <button
                      className="inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap font-medium outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4 rounded-full bg-muted text-muted-foreground hover:bg-border hover:text-foreground focus-visible:ring-muted-foreground/50 h-7 w-fit text-xs"
                      tabIndex={-1}
                      type="button"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
