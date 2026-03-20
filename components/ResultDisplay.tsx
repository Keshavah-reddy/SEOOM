import React, { useState } from 'react';
import { GeneratedContent, Platform } from '../types';
import { Copy, Check, ExternalLink, Lightbulb, Hash, FileText, Type, Youtube, Instagram } from 'lucide-react';

interface ResultDisplayProps {
  content: GeneratedContent;
  platform: Platform;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ content, platform }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getTagsString = () => {
    if (platform === Platform.YOUTUBE) {
      return content.tags.join(', ');
    }
    // For Instagram, hashtag format
    return content.tags.map(t => t.startsWith('#') ? t : `#${t}`).join(' ');
  };

  const PlatformIcon = platform === Platform.YOUTUBE ? Youtube : Instagram;
  const platformColor = platform === Platform.YOUTUBE ? 'text-red-500' : 'text-pink-500';
  const borderColor = platform === Platform.YOUTUBE ? 'border-red-500/30' : 'border-pink-500/30';
  const bgGradient = platform === Platform.YOUTUBE 
    ? 'from-red-900/20 to-orange-900/20' 
    : 'from-pink-900/20 to-purple-900/20';

  return (
    <div className={`w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-900/50 border ${borderColor} rounded-3xl p-6`}>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-slate-800 rounded-xl ${platformColor}`}>
            <PlatformIcon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{platform}</h2>
        </div>
        
        {/* Validity Meter */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Validity Score</span>
            <span className={`text-xs font-bold ${content.validityScore > 70 ? 'text-emerald-400' : content.validityScore > 40 ? 'text-amber-400' : 'text-red-400'}`}>
              {content.validityScore}%
            </span>
          </div>
          <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${
                content.validityScore > 70 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 
                content.validityScore > 40 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 
                'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
              }`}
              style={{ width: `${content.validityScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Strategy / Insight Card */}
      <div className={`bg-gradient-to-r ${bgGradient} border border-white/5 rounded-2xl p-5`}>
        <div className="flex items-start gap-3">
            <div className="mt-1">
                <Lightbulb className={`w-5 h-5 ${platformColor} opacity-80`} />
            </div>
            <div>
                <h3 className="text-sm font-semibold text-white mb-1">Strategy & Trends</h3>
                <p className="text-slate-300 leading-relaxed text-sm">{content.strategy}</p>
            </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title / Hook */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col relative group hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-slate-400">
                    <Type className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                        {platform === Platform.INSTAGRAM ? 'Hook / First Line' : 'Title'}
                    </span>
                </div>
                <button 
                    onClick={() => handleCopy(content.title, 'title')}
                    className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-white"
                >
                    {copiedSection === 'title' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
            <p className="text-lg font-medium text-white leading-snug">{content.title}</p>
        </div>

        {/* Tags */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col relative group hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-slate-400">
                    <Hash className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                        {platform === Platform.YOUTUBE ? 'SEO Tags (Comma Separated)' : 'Hashtags'}
                    </span>
                </div>
                <button 
                    onClick={() => handleCopy(getTagsString(), 'tags')}
                    className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-white"
                >
                    {copiedSection === 'tags' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                {content.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-900 rounded-md text-sm text-indigo-300 border border-slate-800">
                        {platform === Platform.INSTAGRAM && !tag.startsWith('#') ? `#${tag}` : tag}
                    </span>
                ))}
            </div>
        </div>

        {/* Description */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 relative group hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-slate-400">
                    <FileText className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Description / Caption</span>
                </div>
                <button 
                    onClick={() => handleCopy(content.description, 'desc')}
                    className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors text-slate-500 hover:text-white"
                >
                    {copiedSection === 'desc' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800/50">
                <pre className="whitespace-pre-wrap text-slate-300 font-sans text-sm leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar">{content.description}</pre>
            </div>
        </div>

        {/* Sources */}
        {content.sources && content.sources.length > 0 && (
            <div className="pt-4 border-t border-slate-800/50">
                <h4 className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-2">Sources</h4>
                <div className="flex flex-wrap gap-2">
                    {content.sources.map((source, i) => (
                        <a 
                            key={i} 
                            href={source.uri} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-950/20 px-2 py-1 rounded-full border border-indigo-900/30"
                        >
                            <ExternalLink className="w-3 h-3" />
                            <span className="truncate max-w-[150px]">{source.title}</span>
                        </a>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;