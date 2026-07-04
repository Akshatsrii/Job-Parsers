// Technical skills list for keyword extraction if skills are not explicitly listed in metadata
export const SKILLS_LIST = [
  "JavaScript", "TypeScript", "React", "Angular", "Vue", "Next.js", "Nuxt.js", "Node.js", "Express", "NestJS",
  "Python", "Django", "Flask", "FastAPI", "Java", "Spring Boot", "C++", "C#", ".NET", "Ruby", "Ruby on Rails",
  "PHP", "Laravel", "Go", "Golang", "Rust", "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Cassandra",
  "DynamoDB", "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Git", "GitHub", "CI/CD", "HTML", "CSS", "TailwindCSS",
  "Bootstrap", "GraphQL", "REST API", "Redux", "MobX", "Prisma", "Sequelize", "Mongoose", "Selenium",
  "Playwright", "Cypress", "Jest", "Mocha", "Machine Learning", "Deep Learning", "AI", "NLP", "Data Science",
  "Pandas", "NumPy", "TensorFlow", "PyTorch", "Scikit-Learn", "Hadoop", "Spark", "Figma", "UI/UX",
  "Jira", "Agile", "Scrum", "Linux", "DevOps", "Terraform", "Ansible", "Swift", "Kotlin", "Flutter", "React Native",
  "Web3", "Solidity", "Blockchain", "TypeScript", "System Design", "Microservices"
];

// Regex to extract salary/compensation
export const SALARY_PATTERNS = [
  /(?:₹|\$|£|€)\s*\d+(?:\.\d+)?\s*(?:-|to)\s*\d+(?:\.\d+)?\s*(?:LPA|Lakh|Lakhs|k|K|M|B|Cr)?/g,
  /\d+(?:\.\d+)?\s*-\s*\d+\s*(?:LPA|Lakhs|Lakh|k|K|M)/g,
  /\d+\s*(?:to|-)\s*\d+\s*(?:Years?|Yrs?)\s*(?:Experience)?\s*.*?(?:Rs\.?|₹|\$)\s*(\d+(?:\.\d+)?\s*(?:-|to)\s*\d+(?:\.\d+)?\s*(?:LPA|Lakhs|Lakh|k|K|M)?)/i,
  /(?:stipend|salary|compensation|pkg|package)\s*(?:is|of|around)?\s*(?:Rs\.?|₹|\$)?\s*(\d+[,.]?\d*\s*(?:-|to)?\s*\d*[,.]?\d*\s*(?:LPA|Lakhs|Lakh|k|K|M|pm|per\s*month|per\s*year)?)/i
];

// Regex to extract experience requirements
export const EXPERIENCE_PATTERNS = [
  /(\d+\s*(?:-|to)\s*\d+)\s*(?:years?|yrs?)/i,
  /(\d+\s*\+)\s*(?:years?|yrs?)/i,
  /(?:minimum|at least|req|requires?)\s*(\d+)\s*(?:years?|yrs?)/i,
  /(\d+)\s*(?:years?|yrs?)\s*(?:of)?\s*experience/i,
  /freshers?/i
];

/**
 * Scan raw text for skills in our SKILLS_LIST
 */
export function extractSkillsFromText(text) {
  if (!text) return [];
  const skillsFound = new Set();
  const lowerText = text.toLowerCase();
  
  for (const skill of SKILLS_LIST) {
    // Match skill as a whole word (e.g., matching Go but not Google, React but not Reaction)
    const escapedSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
    if (regex.test(lowerText)) {
      skillsFound.add(skill);
    }
  }
  return Array.from(skillsFound);
}

/**
 * Scan raw text for salary patterns
 */
export function extractSalaryFromText(text) {
  if (!text) return "";
  for (const pattern of SALARY_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }
  return "";
}

/**
 * Scan raw text for experience patterns
 */
export function extractExperienceFromText(text) {
  if (!text) return "";
  for (const pattern of EXPERIENCE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }
  return "";
}
