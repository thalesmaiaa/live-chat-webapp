'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useLogin } from './useLogin';
import { Button } from '@/components/ui';

type Inputs = {
  email: string;
  password: string;
};

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function Login() {
  const router = useRouter();
  const { login, fetchAuthenticatedUserData } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  function onLogin(state: Inputs) {
    login(state)
      .then(() => {
        router.push('/');
        fetchAuthenticatedUserData();
      })
      .catch((error) => error);
  }

  function redirectToRegister() {
    router.push('/register');
  }

  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-[400px]'>
        <form
          className='flex flex-col gap-4 max-w-lg w-full'
          onSubmit={handleSubmit(onLogin)}
          id='loginForm'
        >
          <div className='flex flex-col'>
            <input
              type='text'
              placeholder='E-mail'
              className='border border-gray-300 rounded px-4 py-2 text-blue-950'
              {...register('email', {
                required: true,
                pattern: emailPattern,
              })}
            />
            <span className='text-red-500 text-sm h-4'>
              {errors.email && 'This field must be a valid email'}
            </span>
          </div>

          <div className='flex flex-col'>
            <input
              type='text'
              placeholder='Password'
              className='border border-gray-300 rounded px-4 py-2 text-blue-950'
              {...register('password', { required: true })}
            />
            <span className='text-red-500 text-sm h-4'>
              {errors.password && 'This field is required'}
            </span>

            <button
              type='button'
              onClick={redirectToRegister}
              className='mt-2 text-sm text-blue-600 hover:underline hover:text-blue-800 focus:outline-none text-start w-fit'
              disabled={isSubmitting}
            >
              New user? Register here
            </button>
          </div>

          <Button className='w-28' form='loginForm' type='submit' disabled={isSubmitting}>
            Login
          </Button>
        </form>
      </main>
    </div>
  );
}
