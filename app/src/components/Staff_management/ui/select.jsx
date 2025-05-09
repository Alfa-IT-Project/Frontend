import React from 'react';
import { cn } from '../../../utils/cn';

const Select = React.forwardRef(({ className, children, register, ...props }, ref) => {
  return (
    <select
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={(e) => {
        // Handle both the forwarded ref and the register ref
        if (typeof ref === 'function') {
          ref(e);
        } else if (ref) {
          ref.current = e;
        }
        if (register?.ref) {
          register.ref(e);
        }
      }}
      {...register}
      {...props}>
      {children}
    </select>
  );
});
Select.displayName = 'Select';

export { Select }; 