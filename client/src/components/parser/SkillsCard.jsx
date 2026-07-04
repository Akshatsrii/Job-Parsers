import { Sparkles } from "lucide-react";
import Card from "../common/Card.jsx";

export default function SkillsCard({ jobData }) {
  if (!jobData) return null;
  const skills = jobData.skills || [];

  if (skills.length === 0) return null;

  return (
    <Card title="Skills Required" icon={Sparkles}>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={`${skill}-${index}`}
            className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
          >
            {skill}
          </span>
        ))}
      </div>
    </Card>
  );
}
