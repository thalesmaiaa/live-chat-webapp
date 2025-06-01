'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { RegisterUserData, useRegister } from './useRegister';
import { Button } from '@/components/ui';

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function Register() {
  const { registerUser } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterUserData>();

  async function onLogin(state: RegisterUserData) {
    await registerUser(state).catch((error) => error);
  }

  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onLogin)} id='loginForm'>
          <div className='flex flex-row gap-4'>
            <div className='flex flex-col'>
              <input
                type='text'
                placeholder='Username'
                className='border border-gray-300 rounded px-4 py-2 text-blue-950'
                {...register('username', { required: true })}
              />
              <span className='text-red-500 text-sm h-4'>
                {errors.username && 'This field is required'}
              </span>
            </div>
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
          </div>

          <Button className='w-28' form='loginForm' type='submit' disabled={isSubmitting}>
            Register
          </Button>
        </form>
      </main>
    </div>
  );
}
