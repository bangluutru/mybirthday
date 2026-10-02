'use client';

import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { Download, Share2, Copy, Check, Sparkles, X } from 'lucide-react';
import { vi } from '@/messages/vi';

interface ShareCardModalProps {
  month: number;
  day: number;
  monthNameVi: string;
  onClose?: () => void;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  month,
  day,
  monthNameVi,
  onClose,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      // Trigger joyful celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#f59e0b', '#38bdf8'],
      });

      const dataUrl = await toPng(cardRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `Birthdayverse-${day}-${month}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download image', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Your Birthday Universe',
      text: `Tôi cùng ngày sinh ${day} ${monthNameVi} với những con người đặc biệt trên thế giới! Khám phá ngày sinh của bạn tại:`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        console.log('Share canceled or failed', e);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-4 px-4">
      {/* Share Card Container to be exported */}
      <div
        ref={cardRef}
        className="w-full max-w-xs aspect-square rounded-3xl overflow-hidden relative shadow-2xl flex flex-col justify-between p-5 text-white select-none border border-slate-700/30"
        style={{
          background: 'linear-gradient(180deg, #090e1f 0%, #151d38 45%, #2a203f 80%, #3e203c 100%)',
        }}
      >
        {/* Subtle background starry dots */}
        <div className="absolute inset-0 bg-cosmic-stars opacity-50 pointer-events-none" />

        {/* Card Header */}
        <div className="relative z-10 text-center space-y-0.5">
          <span className="text-xs uppercase tracking-widest text-slate-300 font-semibold">
            {vi.share.badge}
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-b from-white via-slate-100 to-indigo-100 bg-clip-text text-transparent">
            {day} {monthNameVi}
          </h2>
          <p className="text-xs text-indigo-200/90 font-medium whitespace-pre-line leading-tight pt-1">
            {vi.share.headline}
          </p>
        </div>

        {/* Center Artwork: High-res Constellation Collage */}
        <div className="relative z-10 my-2 flex items-center justify-center">
          <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border border-white/10">
            <img
              src="/share/share-card-collage.png"
              alt="Birthday Universe Celebrities"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/backgrounds/hero-space.png';
              }}
            />
          </div>
        </div>

        {/* Card Footer */}
        <div className="relative z-10 text-center pt-1 border-t border-white/10">
          <p className="text-[11px] italic font-medium text-slate-200">
            {vi.share.tagline}
          </p>
          <span className="text-[10px] font-bold tracking-wider uppercase text-amber-300">
            {vi.share.hashtag}
          </span>
        </div>
      </div>

      {/* Copy Alert Banner */}
      {copied && (
        <div className="mt-3 flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-3 py-1.5 rounded-full animate-fadeIn">
          <Check className="w-3.5 h-3.5" />
          <span>{vi.share.copiedAlert}</span>
        </div>
      )}

      {/* Share Action Buttons matching Screen 09 */}
      <div className="w-full max-w-sm grid grid-cols-6 gap-2 mt-6 pt-2">
        {/* Tải ảnh */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex flex-col items-center space-y-1.5 group"
        >
          <div className="w-11 h-11 rounded-full bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 active:scale-95 transition-all">
            <Download className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-medium text-slate-600">
            {downloading ? '...' : vi.share.download}
          </span>
        </button>

        {/* Facebook */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center space-y-1.5 group"
        >
          <div className="w-11 h-11 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-md group-hover:scale-110 active:scale-95 transition-all font-bold text-base">
            f
          </div>
          <span className="text-[11px] font-medium text-slate-600">{vi.share.facebook}</span>
        </button>

        {/* Instagram */}
        <button
          onClick={handleDownload}
          className="flex flex-col items-center space-y-1.5 group"
        >
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-md group-hover:scale-110 active:scale-95 transition-all">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-medium text-slate-600">{vi.share.instagram}</span>
        </button>

        {/* X */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center space-y-1.5 group"
        >
          <div className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shadow-md group-hover:scale-110 active:scale-95 transition-all font-bold text-sm">
            𝕏
          </div>
          <span className="text-[11px] font-medium text-slate-600">{vi.share.x}</span>
        </button>

        {/* LINE */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center space-y-1.5 group"
        >
          <div className="w-11 h-11 rounded-full bg-[#06C755] text-white flex items-center justify-center shadow-md group-hover:scale-110 active:scale-95 transition-all font-bold text-xs">
            LINE
          </div>
          <span className="text-[11px] font-medium text-slate-600">{vi.share.line}</span>
        </button>

        {/* Khác */}
        <button
          onClick={handleCopyLink}
          className="flex flex-col items-center space-y-1.5 group"
        >
          <div className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shadow-sm group-hover:scale-110 active:scale-95 transition-all">
            <Copy className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-medium text-slate-600">{vi.share.other}</span>
        </button>
      </div>
    </div>
  );
};
