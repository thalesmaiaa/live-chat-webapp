import { twMerge } from 'tailwind-merge';

type IconProps = {
  color?: string;
};

export function CheckIcon({ color }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={twMerge('h-6 w-6 text-green-600', color)}
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
    </svg>
  );
}
