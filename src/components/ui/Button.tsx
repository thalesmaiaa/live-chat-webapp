import React from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonProps = React.ComponentProps<'button'>;

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button className={twMerge('bg-blue-500 text-white rounded px-4 py-2', className)} {...props} />
  );
}
