import React from 'react';

export function Loader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center font-[family-name:var(--font-geist-sans)] bg-gray-50 p-8'>
      <svg
        className='animate-spin -ml-1 mr-3 h-12 w-12 text-blue-600'
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
      >
        <circle
          className='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        ></circle>
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
        ></path>
      </svg>
      <p className='text-blue-950 text-lg font-semibold'>{message}</p>
    </div>
  );
}
