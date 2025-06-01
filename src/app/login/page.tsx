'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useLogin } from './useLogin';
import { Button, Input, InputErrorHelperText } from '@/components/ui';

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
            <Input
              type='text'
              placeholder='E-mail'
              {...register('email', {
                required: true,
                pattern: emailPattern,
              })}
            />
            <InputErrorHelperText
              label='This field must be a valid email'
              visible={!!errors.email}
            />
          </div>

          <div className='flex flex-col'>
            <Input
              type='password'
              placeholder='Password'
              {...register('password', { required: true })}
            />
            <InputErrorHelperText label='This field is required' visible={!!errors.password} />

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
