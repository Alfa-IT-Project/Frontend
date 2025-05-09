import * as React from 'react';
import { cn } from '../../utils/cn';

const Form = React.forwardRef(({ className, ...props }, ref) => {
  return (<form ref={ref} className={cn('space-y-4', className)} {...props} />);
});
Form.displayName = 'Form';

const FormGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (<div ref={ref} className={cn('space-y-2', className)} {...props} />);
});
FormGroup.displayName = 'FormGroup';

const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props} />
  );
});
FormLabel.displayName = 'FormLabel';

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}>
      {children}
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export {
  Form,
  FormGroup,
  FormLabel,
  FormMessage,
}; 