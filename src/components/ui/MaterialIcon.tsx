import type { CSSProperties } from 'react';

export function MaterialIcon({
  name,
  className = '',
  style,
  title,
}: {
  name: string;
  className?: string;
  style?: CSSProperties;
  title?: string;
}) {
  return (
    <span aria-hidden="true" className={`material-symbols-outlined ${className}`} style={style} title={title}>
      {name}
    </span>
  );
}
