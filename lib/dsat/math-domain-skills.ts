// Shared domain skills mapping for Math practice
export const mathDomainSkills: Record<string, string[]> = {
  Algebra: [
    "Linear equations in one variable",
    "Systems of two linear equations in two variables",
    "Linear functions",
    "Linear equations in two variables",
    "Linear inequalities in one or two variables",
  ],
  "Data Analysis": [
    "Problem-Solving and Inference from sample Data Analysis statistics and margin of error",
    "Problem-Solving and Ratios, rates, Data Analysis proportional relationships, and units",
    "Problem-Solving and Probability and Data Analysis conditional probability",
    "Problem-Solving and Percentages Data Analysis",
    "Problem-Solving and One-variable data: Data Analysis Distributions and measures of center and spread",
    "Problem-Solving and Two-variable data: Data Analysis Models and scatterplots",
    "Problem-Solving and Evaluating statistical Data Analysis claims: Observational studies and experiments",
    "Problem-Solving and Ratios, rates, proportional Data Analysis relationships, and units",
  ],
  Geometry: [
    "Geometry and Lines, angles, and Trigonometry triangles",
    "Geometry and Right triangles and Trigonometry trigonometry",
    "Geometry and Area and volume Trigonometry",
    "Geometry and Circles Trigonometry",
  ],
  "Advanced Math": [
    "Nonlinear functions",
    "Nonlinear equations in one variable and systems of equations in two variables",
    "Equivalent expressions",
  ],
};

export const mathDomains = Object.keys(mathDomainSkills);
export const mathAllSkills = Object.values(mathDomainSkills).flat();
