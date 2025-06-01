import { twMerge } from 'tailwind-merge';

type IconProps = {
  color?: string;
};
export function SendMessageIcon({ color }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={twMerge('h-5 w-5 text-blue-600', color)}
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={2}
    >
      <path strokeLinecap='round' strokeLinejoin='round' d='M5 12h14M12 5l7 7-7 7' />
    </svg>
  );
}
