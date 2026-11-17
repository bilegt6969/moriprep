import { SKILLS } from "./math-skills.js";

export { SKILLS };

export const mathDomainSkills = Object.values(SKILLS).reduce<
  Record<string, string[]>
>((domains, { domain, skill }) => {
  (domains[domain] ??= []).push(skill);
  return domains;
}, {});

export const mathDomains = Object.keys(mathDomainSkills);
export const mathAllSkills = Object.values(mathDomainSkills).flat();
