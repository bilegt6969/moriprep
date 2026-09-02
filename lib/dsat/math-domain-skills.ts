// Shared domain skills mapping for Math practice
export const mathDomainSkills: Record<string, string[]> = {
  "Advanced Math": [
    "Equivalent expressions",
    "Nonlinear equations in one variable and systems of equations in two variables",
    "Nonlinear functions",
  ],
};

export const mathDomains = Object.keys(mathDomainSkills);
export const mathAllSkills = Object.values(mathDomainSkills).flat();
