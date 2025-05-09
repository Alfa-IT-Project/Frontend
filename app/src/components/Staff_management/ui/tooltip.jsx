import * as React from 'react';
import { cn } from '../../utils/cn';

export function Tooltip({
  content,
  side = 'top',
  align = 'center',
  className,
  children
}) {
  const [show, setShow] = React.useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div
          className={cn(
            'absolute z-50 rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
            {
              'bottom-full left-1/2 -translate-x-1/2 mb-2': side === 'top' && align === 'center',
              'bottom-full right-0 mb-2': side === 'top' && align === 'end',
              'bottom-full left-0 mb-2': side === 'top' && align === 'start',
              'left-full top-1/2 -translate-y-1/2 ml-2': side === 'right' && align === 'center',
              'left-full top-0 ml-2': side === 'right' && align === 'start',
              'left-full bottom-0 ml-2': side === 'right' && align === 'end',
              'top-full left-1/2 -translate-x-1/2 mt-2': side === 'bottom' && align === 'center',
              'top-full right-0 mt-2': side === 'bottom' && align === 'end',
              'top-full left-0 mt-2': side === 'bottom' && align === 'start',
              'right-full top-1/2 -translate-y-1/2 mr-2': side === 'left' && align === 'center',
              'right-full top-0 mr-2': side === 'left' && align === 'start',
              'right-full bottom-0 mr-2': side === 'left' && align === 'end',
            },
            className
          )}>
          {content}
        </div>
      )}
    </div>
  );
} 