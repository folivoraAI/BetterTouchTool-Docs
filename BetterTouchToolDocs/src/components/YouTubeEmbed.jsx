import React from 'react';

export default function YouTubeEmbed({videoId, title = 'YouTube video'}) {
  return (
    <div className="video-embed" style={{position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', marginBottom: '1rem'}}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0}}
      />
    </div>
  );
}
