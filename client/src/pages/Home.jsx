import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Award, Briefcase, Zap, Star } from "lucide-react";
import Button from "../components/common/Button.jsx";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 py-2">
      {/* Curved Royal Blue Hero Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 sm:px-16 sm:py-16 text-white shadow-lg">
        {/* Subtle decorative glow circles */}
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/5 blur-2xl" />

        <div className="grid gap-10 md:grid-cols-12 items-center relative z-10">
          {/* Left Column: Hero Content */}
          <div className="md:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-blue-100">
              ⚡ Smart AI Scraper
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Optimize Your Job <br />
              <span className="text-yellow-300">Applications With AI</span>
            </h1>

            <p className="text-sm text-blue-100/90 leading-relaxed max-w-lg">
              Simply copy and paste job posting URLs from Internshala or AmbitionBox. Automatically extract key skills, salary details, and build your tracking pipeline.
            </p>

            {/* Micro Checkmarks */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2 text-xs text-blue-50/90 font-medium">
                <CheckCircle2 size={15} className="text-yellow-300 fill-yellow-300/10" />
                <span>Instant automated details extraction</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-50/90 font-medium">
                <CheckCircle2 size={15} className="text-yellow-300 fill-yellow-300/10" />
                <span>Local application tracking (Absolute Privacy)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-50/90 font-medium">
                <CheckCircle2 size={15} className="text-yellow-300 fill-yellow-300/10" />
                <span>Resume matching against job descriptions</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/parser">
                <button className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-blue-700 shadow-md hover:bg-blue-50 transition-colors active:scale-95">
                  Start Scraper <ArrowRight size={16} />
                </button>
              </Link>
              <Link to="/dashboard">
                <button className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-colors active:scale-95">
                  View Tracker
                </button>
              </Link>
            </div>

            {/* Stats block inside hero */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
              <div>
                <h4 className="text-xl sm:text-2xl font-black">500+</h4>
                <p className="text-[10px] uppercase font-semibold text-blue-200">Scanned Jobs</p>
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-black">100%</h4>
                <p className="text-[10px] uppercase font-semibold text-blue-200">Local Privacy</p>
              </div>
              <div>
                <h4 className="text-xl sm:text-2xl font-black">24/7</h4>
                <p className="text-[10px] uppercase font-semibold text-blue-200">AI Copilot</p>
              </div>
            </div>
          </div>

          {/* Right Column: Floating mockups resembling the reference image card */}
          <div className="md:col-span-5 flex justify-center relative">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-slate-800 shadow-2xl space-y-4 border border-slate-100 transform md:rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ATS Scanner Online</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                  <Star size={13} className="fill-current" />
                  <span>4.9 Rating</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h3 className="text-xs font-black text-slate-700 uppercase tracking-wide">Target Position</h3>
                <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">Software Engineer Intern</h4>
                <p className="text-[10px] text-slate-500 mt-1">AmbitionBox Listing Details</p>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                    <Award size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">Resume Match Score</h4>
                    <p className="text-[10px] text-slate-500">Perfect alignment found</p>
                  </div>
                </div>
                <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">94%</span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">Pipeline Tracker</h4>
                    <p className="text-[10px] text-slate-500">Added to Wishlist column</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Saved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="grid gap-6 sm:grid-cols-3">
        <div className="card text-center p-6 bg-white border border-slate-200 shadow-sm rounded-2xl hover:border-slate-300 transition-colors">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4 font-bold">
            <Zap size={22} />
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-1.5">Instant Web Scraper</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Automatically scan salary, required skills, and job highlights from listing pages.
          </p>
        </div>

        <div className="card text-center p-6 bg-white border border-slate-200 shadow-sm rounded-2xl hover:border-slate-300 transition-colors">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4 font-bold">
            <Award size={22} />
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-1.5">ATS Match Optimizer</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Instantly grade resume content against target jobs and discover missing keywords.
          </p>
        </div>

        <div className="card text-center p-6 bg-white border border-slate-200 shadow-sm rounded-2xl hover:border-slate-300 transition-colors">
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4 font-bold">
            <Briefcase size={22} />
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-1.5">Pipeline Board</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Move jobs across Wishlist, Applied, Interviewing, and Offers in a visual Kanban view.
          </p>
        </div>
      </section>

      {/* Platforms Directory */}
      <section className="card bg-slate-50 border-slate-200 p-8 rounded-2xl text-center">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          Supported Directories
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          <span className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 shadow-sm">
            Internshala
          </span>
          <span className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 shadow-sm">
            AmbitionBox
          </span>
        </div>
      </section>
    </div>
  );
}

