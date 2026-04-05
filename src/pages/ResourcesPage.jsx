import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTools,
  faExternalLinkAlt,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { subscribeToTools } from "../services/resourceService";

const ToolsPage = () => {
  const [tools, setTools] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToTools((data) => {
      setTools(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = tools.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-10" dir="rtl">

      {/* Header */}
      <div className="mb-10 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md flex items-center justify-center gap-4">
          <FontAwesomeIcon icon={faTools} className="text-sky-400" />
          الأدوات التقنية
        </h1>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">
          مجموعة من أفضل الأدوات والبرامج التي ستساعدك في رحلتك التقنية
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-10 relative">
        <input
          type="text"
          placeholder="ابحث عن أداة..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/10 text-white border border-white/20 rounded-2xl py-3 px-5 pr-12 focus:outline-none focus:border-sky-400 focus:bg-white/15 transition-all placeholder:text-white/40"
        />
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-white/30 rounded-full" />
            <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}

      {/* Tools grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filtered.map((tool, i) => (
            <div
              key={tool.id}
              className={`card-in card-in-${Math.min(i + 1, 5)} bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(14,165,233,0.2)] transition-all duration-300 group flex flex-col h-full relative overflow-hidden`}
            >
              {/* Glow */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl group-hover:bg-sky-400/20 transition-colors pointer-events-none" />

              {/* Icon */}
              <div className="relative z-10 mb-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg bg-gradient-to-br ${tool.color || "from-sky-600 to-blue-700"}`}>
                  {tool.emoji || tool.icon || "🔧"}
                </div>
              </div>

              <h3 className="relative z-10 text-xl font-bold text-white mb-2 group-hover:text-sky-300 transition-colors">
                {tool.name}
              </h3>
              <p className="relative z-10 flex-grow text-sm text-white/70 mb-6 leading-relaxed">
                {tool.description}
              </p>

              <div className="mt-auto relative z-10">
                <a
                  href={tool.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2.5 bg-white/5 hover:bg-sky-500/20 text-sky-300 font-bold rounded-xl border border-white/10 hover:border-sky-500/40 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs" />
                  فتح الأداة
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-16 max-w-2xl mx-auto">
          <div className="text-6xl mb-4">🔧</div>
          <h2 className="text-2xl font-bold text-white mb-3">
            {search ? "لا توجد نتائج" : "لا توجد أدوات حالياً"}
          </h2>
          <p className="text-white/50 text-sm">
            {search
              ? "جرب كلمة بحث مختلفة"
              : "سيضيف المدراء أدوات تقنية قريباً"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ToolsPage;
