'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useRegister } from './useRegister';
import { Button, Input, InputErrorHelperText } from '@/components/ui';
import { RegisterUserData } from '@/@types';

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
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
      <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit(onLogin)} id='loginForm'>
          <div className='flex flex-row gap-4'>
            <div className='flex flex-col'>
              <Input
                type='text'
                placeholder='Username'
                {...register('username', { required: true })}
              />
              <InputErrorHelperText label='This field is required' visible={!!errors.username} />
            </div>
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
          </div>

          <div className='flex flex-col'>
            <Input
              type='text'
              placeholder='Password'
              {...register('password', { required: true })}
            />
            <InputErrorHelperText label='This field is required' visible={!!errors.password} />
          </div>

          <Button className='w-28' form='loginForm' type='submit' disabled={isSubmitting}>
            Register
          </Button>
        </form>
      </main>
    </div>
  );
}
