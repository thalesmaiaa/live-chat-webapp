'use client';

import React from 'react';
import { Sidebar, WrapperContainer } from '@/components/ui';
import { Contacts } from './contacts';

export default function Home() {
  return (
    <WrapperContainer>
      <Sidebar />
      <Contacts />
    </WrapperContainer>
  );
}
