import { useState } from "react";

export function ImageWithFallback({ src, alt, className, fallbackSrc }) {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = hasError && fallbackSrc ? fallbackSrc : src;

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}
