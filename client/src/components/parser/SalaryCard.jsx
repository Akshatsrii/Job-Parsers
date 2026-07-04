import { IndianRupee, Clock } from "lucide-react";
import Card from "../common/Card.jsx";
import { formatSalary } from "../../utils/formatter.js";

export default function SalaryCard({ jobData }) {
  if (!jobData) return null;
  const { salary, experience } = jobData;

  return (
    <Card title="Compensation" icon={IndianRupee}>
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-base font-semibold text-gray-900">
          <IndianRupee size={18} className="text-primary-600 shrink-0" />
          {formatSalary(salary)}
        </div>
        {experience && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} className="shrink-0" />
            {experience}
          </div>
        )}
      </div>
    </Card>
  );
}
