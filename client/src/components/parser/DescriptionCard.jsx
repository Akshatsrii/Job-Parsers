import { FileText } from "lucide-react";
import Card from "../common/Card.jsx";

export default function DescriptionCard({ jobData }) {
  if (!jobData || !jobData.description) return null;

  return (
    <Card title="Job Description" icon={FileText}>
      <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
        {jobData.description}
      </p>
    </Card>
  );
}
