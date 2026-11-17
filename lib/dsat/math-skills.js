/** @type {Readonly<Record<number, { domain: string, skill: string }>>} */
const SKILLS = Object.freeze({
  1: { domain: "Algebra", skill: "Linear equations in one variable" },
  2: { domain: "Algebra", skill: "Linear functions" },
  3: { domain: "Algebra", skill: "Linear equations in two variables" },
  4: {
    domain: "Algebra",
    skill: "Systems of two linear equations in two variables",
  },
  5: {
    domain: "Algebra",
    skill: "Linear inequalities in one or two variables",
  },
  6: { domain: "Advanced Math", skill: "Nonlinear functions" },
  7: {
    domain: "Advanced Math",
    skill:
      "Nonlinear equations in one variable and systems of equations in two variables",
  },
  8: { domain: "Advanced Math", skill: "Equivalent expressions" },
  9: {
    domain: "Problem-Solving and Data Analysis",
    skill: "Ratios, rates, proportional relationships, and units",
  },
  10: {
    domain: "Problem-Solving and Data Analysis",
    skill: "Percentages",
  },
  11: {
    domain: "Problem-Solving and Data Analysis",
    skill: "One-variable data: Distributions and measures of center and spread",
  },
  12: {
    domain: "Problem-Solving and Data Analysis",
    skill: "Two-variable data: Models and scatterplots",
  },
  13: {
    domain: "Problem-Solving and Data Analysis",
    skill: "Probability and conditional probability",
  },
  14: {
    domain: "Problem-Solving and Data Analysis",
    skill: "Inference from sample statistics and margin of error",
  },
  15: {
    domain: "Problem-Solving and Data Analysis",
    skill:
      "Evaluating statistical claims: Observational studies and experiments",
  },
  16: {
    domain: "Geometry and Trigonometry",
    skill: "Area and volume",
  },
  17: {
    domain: "Geometry and Trigonometry",
    skill: "Lines, angles, and triangles",
  },
  18: {
    domain: "Geometry and Trigonometry",
    skill: "Right triangles and trigonometry",
  },
  19: { domain: "Geometry and Trigonometry", skill: "Circles" },
});

module.exports = { SKILLS };
