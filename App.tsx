import React, { useState, useEffect } from 'react';
import { Platform, DualPlatformContent, Language } from './types';
import { generateDualSeoContent, validateTopic } from './services/geminiService';
import ResultDisplay from './components/ResultDisplay';
import { Sparkles, Search, Loader2, Youtube, Instagram, Key, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [result, setResult] = useState<DualPlatformContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const has = await window.aistudio.hasSelectedApiKey();
        setHasKey(has);
      } else {
        // Fallback for dev/preview if aistudio is not available
        setHasKey(!!process.env.API_KEY || !!process.env.GEMINI_API_KEY);
      }
    };
    checkKey();
  }, []);

  const handleLogin = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Assume success after dialog closes
        setHasKey(true);
        // Force a re-render or state update to ensure new key is picked up
        window.location.reload(); 
      } catch (e) {
        console.error("Failed to select key", e);
      }
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setValidating(true);
    setError(null);
    setResult(null);

    try {
      // Step 1: Validate Topic
      await validateTopic(topic);
      setValidating(false);

      // Step 2: Generate Content
      const data = await generateDualSeoContent(topic, language);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30 flex flex-col">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20 flex-grow w-full">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 relative">
            <div className="text-center md:text-left w-full">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                     <div className="space-y-2 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-indigo-400 text-xs font-medium">
                            <Sparkles className="w-3 h-3" />
                            <span>Powered by Gemini 3 Flash & Live Search</span>
                        </div>
                        <h1 className="text-4xl font-bold text-white tracking-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">SEOOM</span> AI
                        </h1>
                     </div>
                     
                     {!hasKey && (
                       <button 
                          onClick={handleLogin}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white rounded-lg transition-all text-sm font-medium"
                       >
                          <Key className="w-4 h-4" />
                          <span>Use My Own API Key</span>
                       </button>
                     )}
                </div>
            </div>
        </div>

        <div className="text-center mb-12">
             <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Generate viral, SEO-optimized content for 
                <span className="text-red-400 font-medium"> YouTube</span> & 
                <span className="text-pink-400 font-medium"> Instagram</span> simultaneously.
            </p>
        </div>

        {/* Controls */}
        <div className="max-w-3xl mx-auto mb-12">
            
            {/* Platform & Language Badges */}
            <div className="flex flex-col items-center gap-6 mb-8">
                <div className="flex justify-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-950/30 border border-red-900/50 rounded-full text-red-200 text-sm">
                        <Youtube className="w-4 h-4" />
                        <span>YouTube</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-pink-950/30 border border-pink-900/50 rounded-full text-pink-200 text-sm">
                        <Instagram className="w-4 h-4" />
                        <span>Instagram</span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Select Output Language</span>
                    <div className="flex items-center gap-3 bg-slate-900/50 p-1.5 rounded-2xl border border-slate-700/50">
                        <div className="px-3 text-slate-500">
                            <Globe className="w-4 h-4" />
                        </div>
                        {Object.values(Language).map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-all ${
                                    language === lang 
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                                }`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <form onSubmit={handleGenerate} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-md" />
                <div className="relative flex items-center bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl transition-all focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/20">
                    <Search className="w-6 h-6 text-slate-500 ml-4" />
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="What's your content about? (e.g., 'Travel Vlog Japan')"
                        className="w-full bg-transparent border-none text-lg text-white placeholder-slate-500 focus:ring-0 px-4 py-4"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !topic.trim()}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:hover:bg-indigo-600 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>{validating ? 'Validating...' : 'Generating...'}</span>
                            </>
                        ) : (
                            <>
                                <span>Generate</span>
                                <Sparkles className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </form>
            
            {/* Suggestions / Hints */}
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-slate-500">
                <span>Try:</span>
                <button onClick={() => setTopic("Travel vlog Japan 2025")} className="hover:text-indigo-400 transition-colors">"Japan Travel Vlog"</button>
                <span>•</span>
                <button onClick={() => setTopic("Digital Marketing Tips for Beginners")} className="hover:text-indigo-400 transition-colors">"Digital Marketing"</button>
                <span>•</span>
                <button onClick={() => setTopic("Healthy Meal Prep 101")} className="hover:text-indigo-400 transition-colors">"Healthy Meal Prep"</button>
            </div>
        </div>

        {/* Error Message */}
        {error && (
            <div className="max-w-2xl mx-auto bg-red-900/20 border border-red-800/50 text-red-200 p-4 rounded-xl mb-8 text-center animate-in fade-in">
                {error}
            </div>
        )}

        {/* Results */}
        {result && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                <ResultDisplay content={result.youtube} platform={Platform.YOUTUBE} />
                <ResultDisplay content={result.instagram} platform={Platform.INSTAGRAM} />
            </div>
        )}

      </div>

      {/* Footer */}
      <div className="relative z-10 py-6 text-center border-t border-slate-800/50">
        <p className="text-slate-500 text-sm">
          Created by{' '}
          <a 
            href="http://instagram.com/keshavah_reddy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            @KESHAVAH_REDDY
          </a>
        </p>
      </div>
    </div>
  );
};

export default App;