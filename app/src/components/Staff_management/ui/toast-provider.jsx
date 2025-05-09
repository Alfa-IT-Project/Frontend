import * as React from 'react';
import { Toast, ToastTitle, ToastDescription } from './toast';
import { useToast } from './use-toast';

export function ToastProvider({
  children
}) {
  const { toasts } = useToast();

  return (
    <>
      {children}
      <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4">
        {toasts.map(({ id, title, description, variant, ...props }) => {
          return (
            <Toast key={id} variant={variant} {...props}>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </Toast>
          );
        })}
      </div>
    </>
  );
} 