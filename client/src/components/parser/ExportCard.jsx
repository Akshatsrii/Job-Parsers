import { Download, FileJson, FileSpreadsheet } from "lucide-react";
import Card from "../common/Card.jsx";
import Button from "../common/Button.jsx";
import { downloadFile, jsonToCsv } from "../../utils/helpers.js";

export default function ExportCard({ jobData }) {
  if (!jobData) return null;

  const handleJsonExport = () => {
    downloadFile(
      `${jobData.company || "job"}-data.json`,
      JSON.stringify(jobData, null, 2),
      "application/json"
    );
  };

  const handleCsvExport = () => {
    downloadFile(`${jobData.company || "job"}-data.csv`, jsonToCsv(jobData), "text/csv");
  };

  return (
    <Card title="Export" icon={Download}>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" icon={FileJson} onClick={handleJsonExport}>
          Export JSON
        </Button>
        <Button variant="outline" icon={FileSpreadsheet} onClick={handleCsvExport}>
          Export CSV
        </Button>
      </div>
    </Card>
  );
}
