import { useState } from "react";
import { Sparkles, FileText, CheckCircle2, AlertTriangle, Play } from "lucide-react";
import { chatWithAI } from "../../api/parser.api.js";
import { classNames } from "../../utils/helpers.js";

export default function ResumeMatcher({ jobData }) {
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleMatchScan = async () => {
    if (!resumeText.trim() || loading) return;
    setError("");
    setLoading(true);

    try {
      const prompt = `
You are a top HR recruiter and Applicant Tracking System (ATS) optimization expert. 
Analyze the provided Resume text against the Target Job details and return a strictly structured JSON response.

Target Job Details:
Title: ${jobData.title}
Company: ${jobData.company}
Skills: ${jobData.skills?.join(", ") || "Not disclosed"}
Job Description: 
${jobData.description}

Applicant Resume:
${resumeText}

Return ONLY a valid JSON object in the following format (do not include markdown block syntax like \`\`\`json):
{
  "score": 85, // integer percentage matching score (0 to 100)
  "strengths": ["list critical matching factors here", "list another strength"],
  "gaps": ["list missing keywords/skills here", "list experience or credentials gaps"],
  "keywords": ["specific keyword 1", "specific keyword 2"], // keywords to add to increase ATS ranking
  "suggestions": ["list actionable resume improvement ideas", "recommend bullet point changes"]
}
`;

      const response = await chatWithAI(prompt, null, "application/json");

      if (response && response.success && response.data?.reply) {
        const rawText = response.data.reply;
        const cleanedJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsedData = JSON.parse(cleanedJson);
        setResult(parsedData);
      } else {
        throw new Error(response.message || "Failed to generate AI analysis");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to scan resume. Verify backend server environment configuration.");
    } finally {
      setLoading(false);
    }
  };

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = result
    ? circumference - (result.score / 100) * circumference
    : circumference;

  return (
    <div className="space-y-6">
      {!result || error ? (
        <div className="card space-y-4">
          <div className="flex items-center gap-2">
            <FileText className="text-primary-600" />
            <h3 className="text-sm font-bold text-slate-800">ATS Resume Score Analyzer</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Paste your resume text below. We will run an automated matching scan against the extracted job description requirements.
          </p>

          <textarea
            placeholder="Paste your Resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="w-full h-48 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-800 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 placeholder:text-slate-300 resize-none font-sans"
            disabled={loading}
          />

          {error && <div className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-4 py-2">{error}</div>}

          <div className="flex justify-end">
            <button
              onClick={handleMatchScan}
              disabled={!resumeText.trim() || loading}
              className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Sparkles size={14} className="animate-spin text-white" /> Scanning...
                </>
              ) : (
                <>
                  <Play size={14} /> Scan Resume
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-12">
          {/* Left panel (Score and keywords) */}
          <div className="card md:col-span-4 flex flex-col items-center justify-center text-center space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Match Accuracy</h4>
            
            {/* SVG Circular score bar */}
            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32">
                <circle
                  className="text-slate-100"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="64"
                  cy="64"
                />
                <circle
                  className={classNames(
                    "transition-all duration-300",
                    result.score >= 80 ? "text-emerald-500" : result.score >= 50 ? "text-amber-500" : "text-rose-500"
                  )}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="64"
                  cy="64"
                  style={{
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%"
                  }}
                />
              </svg>
              <span className="absolute text-3xl font-extrabold text-slate-800">{result.score}%</span>
            </div>

            <div className="pt-2">
              <span className={classNames(
                "rounded-full px-3 py-1 text-xs font-semibold border",
                result.score >= 80 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                  : result.score >= 50 
                    ? "bg-amber-50 text-amber-700 border-amber-200" 
                    : "bg-rose-50 text-rose-700 border-rose-200"
              )}>
                {result.score >= 80 ? "Strong Fit" : result.score >= 50 ? "Moderate Fit" : "Needs Optimization"}
              </span>
            </div>

            {/* Keyword tags */}
            <div className="w-full pt-4 border-t border-slate-100 text-left">
              <h5 className="text-xs font-bold text-slate-700 mb-2">Recommended Keywords:</h5>
              <div className="flex flex-wrap gap-1.5 justify-start">
                {result.keywords.map((kw, i) => (
                  <span key={i} className="text-[10px] rounded-lg bg-slate-50 text-slate-600 border border-slate-200 px-2 py-1 font-medium">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setResult(null)}
              className="text-xs text-slate-500 hover:text-slate-700 underline pt-4"
            >
              Scan new resume
            </button>
          </div>

          {/* Right panel (Detailed analysis lists) */}
          <div className="md:col-span-8 space-y-4">
            {/* Strengths & Gaps */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card border-emerald-100 bg-emerald-50/10">
                <h4 className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 mb-3">
                  <CheckCircle2 size={15} /> Core Alignment
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {result.strengths.map((str, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-emerald-500">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card border-amber-100 bg-amber-50/10">
                <h4 className="text-xs font-bold text-amber-700 flex items-center gap-1.5 mb-3">
                  <AlertTriangle size={15} /> Identified Gaps
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  {result.gaps.map((gp, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-amber-500">•</span>
                      <span>{gp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Suggestions */}
            <div className="card">
              <h4 className="text-xs font-bold text-primary-700 flex items-center gap-1.5 mb-3">
                <Sparkles size={15} /> Optimization Action Items
              </h4>
              <ul className="space-y-3 text-xs text-slate-600">
                {result.suggestions.map((sug, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="bg-primary-50 text-primary-700 border border-primary-100 rounded px-1.5 font-bold">{i+1}</span>
                    <span className="leading-relaxed">{sug}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
