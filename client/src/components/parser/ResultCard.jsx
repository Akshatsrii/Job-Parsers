import { Briefcase } from "lucide-react";
import CompanyCard from "./CompanyCard.jsx";
import SalaryCard from "./SalaryCard.jsx";
import SkillsCard from "./SkillsCard.jsx";
import DescriptionCard from "./DescriptionCard.jsx";
import ExportCard from "./ExportCard.jsx";

export default function ResultCard({ jobData }) {
  if (!jobData) return null;

  return (
    <div className="mt-6 space-y-4">
      <div className="card">
        <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <Briefcase size={22} className="text-primary-600" />
          {jobData.title || "Job Title Not Found"}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CompanyCard jobData={jobData} />
        <SalaryCard jobData={jobData} />
      </div>

      <SkillsCard jobData={jobData} />
      <DescriptionCard jobData={jobData} />
      <ExportCard jobData={jobData} />
    </div>
  );
}
