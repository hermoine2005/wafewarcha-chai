import { useState } from 'react';
export default function Img({ src, alt = '', className = '' }) {
  const [bad, setBad] = useState(!src);
  if (bad) return <div className={`img-fallback ${className}`} role="img" aria-label={alt}>☕</div>;
  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setBad(true)} />;
}
