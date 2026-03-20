import React from 'react';
import { Platform } from '../types';
import { Youtube, Instagram, Linkedin, Twitter, Video } from 'lucide-react';

interface PlatformSelectorProps {
  selected: Platform;
  onSelect: (platform: Platform) => void;
  disabled?: boolean;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ selected, onSelect, disabled }) => {
  const platforms = [
    { id: Platform.YOUTUBE, icon: Youtube, color: 'text-red-500', label: 'YouTube' },
    { id: Platform.INSTAGRAM, icon: Instagram, color: 'text-pink-500', label: 'Instagram' },
    { id: Platform.TIKTOK, icon: Video, color: 'text-cyan-400', label: 'TikTok' }, // Using Video icon for TikTok
    { id: Platform.LINKEDIN, icon: Linkedin, color: 'text-blue-600', label: 'LinkedIn' },
    { id: Platform.TWITTER, icon: Twitter, color: 'text-blue-400', label: 'Twitter/X' },
  ];

  return (
    <div className="flex flex-wrap gap-3 justify-center mb-8">
      {platforms.map((p) => {
        const isSelected = selected === p.id;
        const Icon = p.icon;
        
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            disabled={disabled}
            className={`
              flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-200 border
              ${isSelected 
                ? 'bg-slate-800 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)] scale-105' 
                : 'bg-slate-900 border-slate-700 hover:border-slate-500 hover:bg-slate-800 opacity-80 hover:opacity-100'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <Icon className={`w-5 h-5 ${p.color}`} />
            <span className={`font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>
              {p.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default PlatformSelector;