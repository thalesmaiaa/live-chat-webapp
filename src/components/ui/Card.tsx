import * as React from 'react';
import { twMerge } from 'tailwind-merge';

type CardProps = React.ComponentProps<'li'>;
type CardTitleProps = React.ComponentProps<'span'>;
type CardIconProps = React.ComponentProps<'div'>;
type CardActionsProps = React.ComponentProps<'div'>;

function Container({ className, ...props }: CardProps) {
  return (
    <li
      className={twMerge(
        'flex items-center justify-between p-4 border border-gray-300 rounded shadow-sm bg-white cursor-pointer hover:bg-blue-50',
        className,
      )}
      role='button'
      tabIndex={0}
      {...props}
    />
  );
}

function Icon({ className, ...props }: CardIconProps) {
  return (
    <div
      className={twMerge(
        'w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-lg',
        className,
      )}
      {...props}
    />
  );
}

function Title({ className, ...props }: CardTitleProps) {
  return <span className={twMerge('text-ray-900', className)} {...props} />;
}

function Actions({ className, ...props }: CardActionsProps) {
  return <div className={twMerge('flex items-center gap-2', className)} {...props} />;
}

export { Container, Icon, Title, Actions };
