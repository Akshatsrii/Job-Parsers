import { useState } from "react";
import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react";
import Card from "../common/Card.jsx";
import Button from "../common/Button.jsx";
import { downloadFile, jsonToCsv } from "../../utils/helpers.js";
import PrintReportModal from "./PrintReportModal.jsx";

export default function ExportCard({ jobData }) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  if (!jobData) return null;

  const handleJsonExport = () => {
    downloadFile(
      `${jobData.company || "scraped"}-data.json`,
      JSON.stringify(jobData, null, 2),
      "application/json"
    );
  };

  const handleCsvExport = () => {
    downloadFile(`${jobData.company || "scraped"}-data.csv`, jsonToCsv(jobData), "text/csv");
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
        <Button 
          variant="primary" 
          icon={FileText} 
          onClick={() => setIsReportOpen(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white"
        >
          Generate PDF Report
        </Button>
      </div>

      <PrintReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
        jobData={jobData} 
      />
    </Card>
  );
}
