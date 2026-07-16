import { normalizeJobData } from "./server/services/parser/normalizer.js";

const raw = {
  title: "Test",
  email: "complaints@internshala.com",
  description: "Contact us at complaints@internshala.com for issues.",
  postedDate: "Recently"
};

const norm = normalizeJobData(raw);
console.log(norm);
