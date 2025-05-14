import * as React from 'react';
import { cn } from '../../utils/cn';

const Avatar = React.forwardRef(({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
  const [error, setError] = React.useState(false);

  return (
    <div
      ref={ref}
      className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', {
        'h-8 w-8': size === 'sm',
        'h-10 w-10': size === 'md',
        'h-12 w-12': size === 'lg',
      }, className)}
      {...props}>
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          className="aspect-square h-full w-full"
          onError={() => setError(true)} />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          {fallback}
        </div>
      )}
    </div>
  );
});
Avatar.displayName = 'Avatar';

export { Avatar }; 