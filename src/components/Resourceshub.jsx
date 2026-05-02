import React, { useState } from 'react';
import {
  PlayCircle, Globe, BookOpen, Code2, Users, Trophy, Clock, Star,
  ExternalLink, Heart, CheckCircle, ArrowRight, Filter
} from 'lucide-react';

const ResourcesHub = ({ resources, language = "C" }) => {
  const [activeTab, setActiveTab] = useState("youtube");
  const [favorited, setFavorited] = useState(new Set());

  const toggleFavorite = (id) => {
    setFavorited(prev => {
      const updated = new Set(prev);
      if (updated.has(id)) updated.delete(id);
      else updated.add(id);
      return updated;
    });
  };

  return (
    <div className="space-y-8">
      {/* ════════ HEADER ════════ */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
          📚 Learning Resources
        </div>
        <h2 className="text-4xl font-extrabold text-white mb-2">
          {language} Programming Resources Hub
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Curated learning materials from top creators and platforms to accelerate your {language} journey
        </p>
      </div>

      {/* ════════ TAB NAVIGATION ════════ */}
      <div className="flex flex-wrap gap-2 justify-center bg-[#0b0e17] rounded-2xl border border-slate-800/60 p-2 max-w-3xl mx-auto">
        {[
          { key: "youtube", label: "🎥 YouTube Channels", icon: PlayCircle },
          { key: "websites", label: "🌐 Websites", icon: Globe },
          { key: "books", label: "📖 Books", icon: BookOpen },
          { key: "practice", label: "💻 Practice", icon: Code2 },
          { key: "community", label: "👥 Community", icon: Users }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-transparent text-slate-400 hover:text-slate-300 hover:bg-slate-800/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ════════ YOUTUBE CHANNELS ════════ */}
      {activeTab === "youtube" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.youtubeChannels.map(channel => (
            <div
              key={channel.id}
              className="bg-[#0b0e17] rounded-2xl border border-slate-800/60 overflow-hidden hover:border-red-500/40 hover:shadow-lg hover:shadow-red-900/10 transition-all duration-300 group"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-900/20 to-slate-900/40 p-4 border-b border-slate-800/40">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="text-4xl">{channel.thumbnail}</div>
                  <button
                    onClick={() => toggleFavorite(`yt-${channel.id}`)}
                    className={`transition-all ${favorited.has(`yt-${channel.id}`) ? "text-red-500" : "text-slate-600 hover:text-red-400"}`}
                  >
                    <Heart size={18} fill={favorited.has(`yt-${channel.id}`) ? "currentColor" : "none"} />
                  </button>
                </div>
                <h3 className="font-bold text-white text-lg group-hover:text-red-400 transition-colors">{channel.name}</h3>
                <div className="flex items-center gap-2 mt-2 text-[11px]">
                  <span className="bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">{channel.language}</span>
                  <span className="text-slate-500">{channel.subscribers} subscribers</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4">
                <p className="text-sm text-slate-400 leading-relaxed">{channel.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/40">
                  <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                    <p className="text-xs text-slate-500">Videos</p>
                    <p className="font-bold text-white">{channel.videoCount}+</p>
                  </div>
                  <div className="bg-slate-900/40 rounded-lg p-2 text-center">
                    <p className="text-xs text-slate-500">Best For</p>
                    <p className="font-bold text-blue-400 text-xs">{channel.bestFor}</p>
                  </div>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-1.5">
                  {channel.highlights.map((highlight, i) => (
                    <span key={i} className="bg-slate-800/60 text-[11px] text-slate-400 px-2.5 py-1 rounded-lg border border-slate-700/40">
                      {highlight}
                    </span>
                  ))}
                </div>

                {/* Button */}
                <a
                  href={channel.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95 mt-3"
                >
                  Watch <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════════ WEBSITES ════════ */}
      {activeTab === "websites" && (
        <div className="space-y-4 max-w-4xl mx-auto">
          {resources.websites.map(site => (
            <div
              key={site.id}
              className="bg-[#0b0e17] rounded-2xl border border-slate-800/60 overflow-hidden hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300"
            >
              <div className="p-6 space-y-4">
                {/* Top Section */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Globe size={20} className="text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{site.name}</h3>
                        <p className="text-xs text-slate-500">{site.category}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20">
                    <Star size={14} className="text-yellow-400" fill="currentColor" />
                    <span className="text-sm font-bold text-yellow-400">{site.rating}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed">{site.description}</p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-2">
                  {site.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                      <span className="text-xs text-slate-400">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Best For */}
                <div className="pt-2 border-t border-slate-800/40">
                  <p className="text-[11px] text-slate-500 font-bold mb-1.5">BEST FOR</p>
                  <p className="text-sm text-blue-400">{site.bestFor}</p>
                </div>

                {/* Button */}
                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95 mt-4"
                >
                  Visit <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════════ BOOKS ════════ */}
      {activeTab === "books" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.books.map(book => (
            <div
              key={book.id}
              className="bg-[#0b0e17] rounded-2xl border border-slate-800/60 overflow-hidden hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-900/10 transition-all duration-300 flex flex-col"
            >
              {/* Cover */}
              <div className="bg-gradient-to-br from-purple-900/30 to-slate-900/40 p-8 flex items-center justify-center border-b border-slate-800/40 aspect-square">
                <BookOpen size={60} className="text-purple-400 opacity-50" />
              </div>

              {/* Content */}
              <div className="p-5 space-y-3 flex-1 flex flex-col">
                <div>
                  <h3 className="font-bold text-white text-base mb-1">{book.title}</h3>
                  <p className="text-sm text-slate-500">{book.author}</p>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed flex-1">{book.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/40 text-center">
                  <div>
                    <p className="text-[10px] text-slate-500">Level</p>
                    <p className="text-xs font-bold text-white">{book.level.split(" to ")[0]}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Pages</p>
                    <p className="text-xs font-bold text-white">{book.pages}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500">Rating</p>
                    <p className="text-xs font-bold text-yellow-400">⭐ {book.rating}</p>
                  </div>
                </div>

                {/* Button */}
                <a
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 mt-auto"
                >
                  Get Book <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════════ PRACTICE PLATFORMS ════════ */}
      {activeTab === "practice" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {resources.practiceProblems.map(platform => (
            <div
              key={platform.id}
              className="bg-[#0b0e17] rounded-2xl border border-slate-800/60 p-6 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-900/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-white text-lg">{platform.platform}</h3>
                  <div className="flex items-center gap-2 mt-2 text-[11px]">
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      {platform.difficulty}
                    </span>
                  </div>
                </div>
                <Code2 size={24} className="text-emerald-400 opacity-60" />
              </div>

              <p className="text-sm text-slate-400 mb-4">{platform.description}</p>

              <div className="bg-slate-900/40 rounded-lg p-3 mb-4 text-center">
                <p className="text-xs text-slate-500 mb-1">Problems</p>
                <p className="text-2xl font-bold text-emerald-400">{platform.problemCount}</p>
              </div>

              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95"
              >
                Start Practicing <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* ════════ COMMUNITY ════════ */}
      {activeTab === "community" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {resources.communities.map(community => (
            <div
              key={community.id}
              className="bg-[#0b0e17] rounded-2xl border border-slate-800/60 p-6 hover:border-teal-500/40 hover:shadow-lg hover:shadow-teal-900/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-bold text-white text-lg">{community.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{community.type}</p>
                </div>
                <Users size={24} className="text-teal-400 opacity-60" />
              </div>

              <p className="text-sm text-slate-400 mb-4">{community.description}</p>

              <div className="bg-slate-900/40 rounded-lg p-3 mb-4 text-center">
                <p className="text-[10px] text-slate-500 mb-1">Community Size</p>
                <p className="font-bold text-teal-400 text-sm">{community.community}</p>
              </div>

              <a
                href={community.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-teal-600 hover:bg-teal-500 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition active:scale-95"
              >
                Join Now <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* ════════ FOOTER ════════ */}
      <div className="mt-12 bg-gradient-to-r from-blue-900/10 to-purple-900/10 border border-slate-800/60 rounded-2xl p-6 text-center">
        <h3 className="font-bold text-white mb-2">💡 Pro Tip</h3>
        <p className="text-slate-400 text-sm">
          Mix multiple resources - use YouTube for understanding, websites for reference, books for deep learning, and practice platforms to solve real problems.
        </p>
      </div>
    </div>
  );
};

export default ResourcesHub;