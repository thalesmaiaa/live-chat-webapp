import React from 'react';
import { twMerge } from 'tailwind-merge';

type InputProps = React.ComponentPropsWithRef<'input'>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={twMerge('border border-gray-300 rounded px-4 py-2 text-blue-950', className)}
      {...props}
    />
  );
}
