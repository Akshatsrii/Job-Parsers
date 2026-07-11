import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, Sparkles } from "lucide-react";
import { chatWithAI } from "../../api/parser.api.js";
import useParser from "../../hooks/useParser.js";
import { classNames } from "../../utils/helpers.js";

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { jobData } = useParser();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I am your AI Career Copilot. Ask me anything about your job descriptions, or generate cover letters and interview prep tips!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen]);

  const handleSend = async (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: queryText }]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const jobContext = jobData && !jobData.isJobList && !jobData.isCompanyList
        ? `\n\nContext - Target Job Details:\nTitle: ${jobData.title}\nCompany: ${jobData.company}\nLocation: ${jobData.location}\nSalary: ${jobData.salary || "Not specified"}\nRequired Skills: ${jobData.skills?.join(", ") || "Not specified"}\nJob Description:\n${jobData.description || "Not specified"}`
        : "";

      const systemPrompt = "You are a helpful and expert AI Career Coach and Resume Optimizer assistant. Answer questions accurately and professionally. Use markdown for styling your responses (lists, bold text, headers).";

      const promptWithContext = `${systemPrompt}${jobContext}\n\nUser Question: ${queryText}`;

      const response = await chatWithAI(promptWithContext);
      
      if (response && response.success && response.data?.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: response.data.reply }]);
      } else {
        throw new Error(response.message || "Failed to generate AI response");
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Error: ${err.message}. (Please verify GEMINI_API_KEY is configured on the backend server .env file).`,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleShortcut = (type) => {
    if (!jobData) return;
    let query = "";
    if (type === "cover") {
      query = `Write a highly tailored professional cover letter for the role of ${jobData.title} at ${jobData.company}. Make it highlight my alignment with the job description.`;
    } else if (type === "prep") {
      query = `Generate 5 specific, behavioral interview questions I should prepare for the role of ${jobData.title} at ${jobData.company}, along with tips on how to structure the answers using the STAR method.`;
    } else if (type === "skills") {
      query = `Based on the job description, list the most critical skills required. What are the key gaps an applicant might face, and what learning path or resources do you recommend?`;
    }
    handleSend(query);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[500px] bg-white border border-slate-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary-50 p-1.5 text-primary-600">
                <Bot size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                  AI Career Copilot
                  <Sparkles size={12} className="text-primary-500 animate-pulse" />
                </h4>
                <p className="text-[9px] text-slate-500">Ask questions, prepare cover letters & interviews</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/20">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={classNames(
                  "flex gap-3 max-w-[85%] rounded-xl p-3 text-xs leading-relaxed",
                  msg.role === "user"
                    ? "ml-auto bg-primary-50 text-slate-800 border border-primary-100 rounded-tr-none"
                    : classNames(
                        "bg-white text-slate-700 border border-slate-200 rounded-tl-none",
                        msg.isError && "bg-rose-50 border-rose-100 text-rose-800"
                      )
                )}
              >
                <div className="flex-1 whitespace-pre-line prose prose-sm max-w-none">
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2 items-center text-slate-500 text-[10px] bg-slate-100/50 border border-slate-200 rounded-lg px-3 py-1.5 w-max animate-pulse">
                <Bot size={12} className="animate-spin text-primary-500" />
                AI is writing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Context shortcuts (if job is active) */}
          {jobData && !jobData.isJobList && !jobData.isCompanyList && (
            <div className="px-3 py-2 border-t border-slate-100 bg-slate-50 flex items-center gap-1 overflow-x-auto">
              <span className="text-[9px] text-slate-400 font-bold uppercase shrink-0 mr-1">AI Prompt:</span>
              <button
                onClick={() => handleShortcut("cover")}
                disabled={loading}
                className="text-[9px] font-semibold bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg px-2 py-1 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                Cover Letter
              </button>
              <button
                onClick={() => handleShortcut("prep")}
                disabled={loading}
                className="text-[9px] font-semibold bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg px-2 py-1 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                Interview Prep
              </button>
              <button
                onClick={() => handleShortcut("skills")}
                disabled={loading}
                className="text-[9px] font-semibold bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg px-2 py-1 transition-colors whitespace-nowrap disabled:opacity-50"
              >
                Skill Gaps
              </button>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-100 bg-white flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 outline-none focus:bg-white focus:border-primary-500 transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg px-3 py-2 flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        title="Toggle AI Copilot"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}
