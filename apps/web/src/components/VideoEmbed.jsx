import React from 'react';
import { Play } from 'lucide-react';

const VideoEmbed = ({ url, title }) => {
  // Helper functions to parse URLs
  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getVimeoId = (url) => {
    if (!url) return null;
    const regExp = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const getTiktokId = (url) => {
    if (!url) return null;
    // Basic extraction for TikTok video ID from standard URLs
    const regExp = /tiktok\.com\/(@[\w.-]+)\/video\/(\d+)/;
    const match = url.match(regExp);
    return match ? match[2] : null;
  };

  const youtubeId = getYoutubeId(url);
  const vimeoId = getVimeoId(url);
  const tiktokId = getTiktokId(url);

  if (youtubeId) {
    return (
      <div className="w-full aspect-video rounded-[1.5rem] overflow-hidden shadow-xl border border-white/20 dark:border-white/5 bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0`}
          title={title || "YouTube video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          loading="lazy"
        ></iframe>
      </div>
    );
  }

  if (vimeoId) {
    return (
      <div className="w-full aspect-video rounded-[1.5rem] overflow-hidden shadow-xl border border-white/20 dark:border-white/5 bg-black">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}`}
          title={title || "Vimeo video player"}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          loading="lazy"
        ></iframe>
      </div>
    );
  }

  if (tiktokId) {
    // TikTok embeds are usually best served via their standard embed or an iframe to their embed URL
    return (
      <div className="w-full rounded-[1.5rem] overflow-hidden shadow-xl border border-white/20 dark:border-white/5 bg-black flex justify-center items-center" style={{ height: '500px' }}>
        <iframe
          src={`https://www.tiktok.com/embed/v2/${tiktokId}`}
          className="w-full h-full"
          allowFullScreen
          scrolling="no"
          allow="encrypted-media;"
          loading="lazy"
        ></iframe>
      </div>
    );
  }

  // Fallback if URL is not a recognized video format, render a simple clickable card
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block w-full"
    >
      <div className="h-full flex items-center justify-between py-6 px-8 bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/20 dark:border-white/5 text-foreground rounded-[1.5rem] shadow-xl hover:bg-white/20 transition-all duration-300">
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight">{title || "Assistir Vídeo"}</span>
          <span className="text-sm opacity-50 truncate max-w-[200px] mt-1">{url}</span>
        </div>
        <div className="bg-primary/20 p-3 rounded-full text-primary">
          <Play className="h-6 w-6" />
        </div>
      </div>
    </a>
  );
};

export default VideoEmbed;
