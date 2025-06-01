import { twMerge } from 'tailwind-merge';

type InputErrorHelperTextProps = {
  label: string;
  visible?: boolean;
};

export function InputErrorHelperText({ label, visible }: InputErrorHelperTextProps) {
  if (visible) {
    return <span className={twMerge('text-red-500 text-sm h-4')}>{label}</span>;
  }
  return null;
}
