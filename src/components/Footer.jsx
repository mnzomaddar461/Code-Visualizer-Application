import React from "react";
import { Link } from "react-router-dom";
import { useLang } from "./LanguageContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isBn } = useLang();

  const t = {
    tagline:    isBn ? "ইন্টারেক্টিভ রিয়েল-টাইম ভিজুয়ালাইজেশনের মাধ্যমে ডেটা স্ট্রাকচার ও অ্যালগরিদম আয়ত্ত করো।"
                     : "Mastering data structures and algorithms through interactive real-time visualization.",
    platform:  isBn ? "প্ল্যাটফর্ম"   : "Platform",
    sorting:   isBn ? "সর্টিং এরিনা"  : "Sorting Arena",
    ds:        isBn ? "ডেটা স্ট্রাকচার" : "Data Structure",
    tree:      isBn ? "ট্রি ও গ্রাফ"   : "Tree & Graph",
    searching: isBn ? "সার্চিং"        : "Searching",
    resources: isBn ? "রিসোর্স"        : "Resources",
    leetcode:  isBn ? "লিটকোড প্রবলেম" : "LeetCode Problems",
    cRoadmap:  isBn ? "C রোডম্যাপ"    : "C Roadmap",
    cppRoadmap:isBn ? "C++ রোডম্যাপ"  : "C++ Roadmap",
    compiler:  isBn ? "কম্পাইলার"     : "Compiler",
    doc:       isBn ? "ডকুমেন্টেশন"   : "Documentation",
    developer: isBn ? "ডেভেলপার"      : "Developer",
    designer:  isBn ? "ডিজাইন করেছেন Md. Naim Zomaddar" : "Designed by Md. Naim Zomaddar",
    portfolio: isBn ? "পোর্টফোলিও"    : "Portfolio",
    status:    isBn ? "স্ট্যাটাস"      : "Status",
    live:      isBn ? "লাইভ ইঞ্জিন"   : "LIVE ENGINE",
    copyright: isBn ? `© ${currentYear} অ্যালগরিদম ভিজুয়ালাইজার স্টুডিও।`
                    : `© ${currentYear} Algorithm Visualizer Studio.`,
    built:     isBn ? "React ও Tailwind দিয়ে তৈরি" : "Built with React & Tailwind",
  };

  return (
    <footer className="relative z-10 bg-[#020617] border-t border-slate-800/60 pt-20 pb-10 px-8 mt-32 w-full font-sans">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">

          {/* Brand */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600/10 rounded-xl border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <span className="text-2xl font-bold tracking-tight text-white uppercase italic">
                  Code <span className="text-blue-500">Visualizer</span>
                </span>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">{t.tagline}</p>
            </div>

            <div className="flex gap-5">
              <SocialIcon href="https://github.com/mnzomaddar461"
                svg={<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>}
              />
              <SocialIcon href="https://linkedin.com/in/m-naim-zomaddar"
                svg={<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z"/>}
              />
              <SocialIcon href="mailto:wpexpert.naim@gmail.com"
                svg={<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>}
              />
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 text-sm pt-4">

            <div className="space-y-6">
              <h4 className="text-white font-bold uppercase tracking-[0.2em] text-xs">{t.platform}</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link to="/" className="hover:text-blue-500 transition-colors">{t.sorting}</Link></li>
                <li><Link to="/" className="hover:text-blue-500 transition-colors">{t.ds}</Link></li>
                <li><Link to="/" className="hover:text-blue-500 transition-colors">{t.tree}</Link></li>
                <li><Link to="/" className="hover:text-blue-500 transition-colors">{t.searching}</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-bold uppercase tracking-[0.2em] text-xs">{t.resources}</h4>
              <ul className="space-y-4 text-slate-400">
                <li><Link to="/leetcode-150" className="hover:text-blue-500 transition-colors">{t.leetcode}</Link></li>
                <li><Link to="/c-roadmap"    className="hover:text-blue-500 transition-colors">{t.cRoadmap}</Link></li>
                <li><Link to="/cpp-roadmap"  className="hover:text-blue-500 transition-colors">{t.cppRoadmap}</Link></li>
                <li><Link to="/compiler"     className="hover:text-blue-500 transition-colors">{t.compiler}</Link></li>
                <li><Link to="/documentation" className="hover:text-blue-500 transition-colors"><strong>{t.doc}</strong></Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-bold uppercase tracking-[0.2em] text-xs">{t.developer}</h4>
              <ul className="space-y-4 text-slate-400">
                <li className="text-blue-400 font-medium tracking-wide underline decoration-blue-500/30 underline-offset-8">{t.designer}</li>
                <li><a href="https://mdnaim.codzzup.com/" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition-colors">{t.portfolio}</a></li>
              </ul>
              <div className="pt-2">
                <h4 className="text-white font-bold uppercase tracking-[0.2em] text-xs mb-4">{t.status}</h4>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 font-bold text-[10px] tracking-widest w-fit">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  {t.live}
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="pt-10 border-t border-slate-800/40 flex flex-col md:flex-row justify-between items-center gap-6 text-[12px] text-slate-500 font-medium">
          <p>{t.copyright}</p>
          <p className="uppercase tracking-[0.3em] text-slate-600">{t.built}</p>
        </div>
      </div>
    </footer>
  );
};

const SocialIcon = ({ href, svg }) => (
  <a href={href} target="_blank" rel="noreferrer"
    className="group relative p-3.5 bg-slate-900/80 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all duration-500 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)]">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
      {svg}
    </svg>
    <div className="absolute inset-0 bg-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
  </a>
);

export default Footer;