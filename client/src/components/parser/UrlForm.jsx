import { useState } from "react";
import { Link2, Search } from "lucide-react";
import Input from "../common/Input.jsx";
import Button from "../common/Button.jsx";
import { validateUrlInput } from "../../utils/validator.js";
import useParser from "../../hooks/useParser.js";
import { PARSE_STATUS } from "../../utils/constants.js";

export default function UrlForm() {
  const [url, setUrl] = useState("");
  const [pages, setPages] = useState("1");
  const [fieldError, setFieldError] = useState("");
  const { parseUrl, status } = useParser();

  const isLoading = status === PARSE_STATUS.LOADING;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔍 [Frontend UrlForm] URL:", url, "Pages:", pages);
    const { valid, message } = validateUrlInput(url);
    if (!valid) {
      setFieldError(message);
      return;
    }
    setFieldError("");
    try {
      console.log("🔍 [Frontend UrlForm] Dispatching parseUrl with pages count:", parseInt(pages) || 1);
      await parseUrl(url.trim(), parseInt(pages) || 1);
    } catch {
      // error already surfaced via toast + context
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-4 border border-slate-200/60 bg-white shadow-sm hover:border-slate-300/80 transition-colors duration-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <Input
            icon={Link2}
            placeholder="Paste a listing URL, e.g. https://internshala.com/internships/wfh-jobs"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            error={fieldError}
          />
        </div>
        <Button type="submit" icon={Search} loading={isLoading} className="sm:mt-0 px-6 py-2.5">
          {isLoading ? "Parsing..." : "Extract Data"}
        </Button>
      </div>

      <div className="flex items-center gap-2 pl-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Pages to scrape (for list pages):
        </label>
        <select
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs font-semibold text-slate-600 shadow-sm focus:border-primary-500 focus:outline-none cursor-pointer hover:border-slate-300 transition-colors"
        >
          <option value="1">1 Page (20 items)</option>
          <option value="3">3 Pages (60 items)</option>
          <option value="5">5 Pages (100 items)</option>
          <option value="10">10 Pages (200 items)</option>
          <option value="20">20 Pages (400 items)</option>
          <option value="30">30 Pages (600 items)</option>
          <option value="50">50 Pages (1000 items - Max)</option>
        </select>
      </div>
    </form>
  );
}
