// Shared domain skills mapping used across practice config popup and practice pages
export const domainSkills: Record<string, string[]> = {
  "Information and Ideas": [
    "Central Ideas and Details",
    "Inferences",
    "Command of Evidence",
  ],
  "Craft and Structure": [
    "Words in Context",
    "Text Structure and Purpose",
    "Cross-Text Connections",
  ],
  "Expression of Ideas": ["Rhetorical Synthesis", "Transitions"],
  "Standard English Convention": ["Boundaries", "Form Structure and Sense"],
};

export const domains = Object.keys(domainSkills);
export const allSkills = Object.values(domainSkills).flat();
