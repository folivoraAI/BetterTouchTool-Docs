import React from 'react';

export default function VimeoEmbed({ videoId, title, aspectRatio = '56.25%' }) {
  return (
    <div
      className="vimeo-embed"
      style={{ paddingBottom: aspectRatio }}
    >
      <iframe
        src={`https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
        allowFullScreen
        title={title || `Vimeo video ${videoId}`}
      />
    </div>
  );
}
