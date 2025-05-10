'use client';
import React from 'react';

import { signInWithGoogle } from '@/utils/supabase/actions';

const page = () => {
  return (
    <div>
      <h1>Authentication Page</h1>
      <p>This is the authentication page for QuickGlance.</p>
      <h1>Not Authenticated</h1>
      <form>
        <button
          formAction={async (formData: FormData) => {
            await signInWithGoogle();
          }}
          type="submit"
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
};

export default page;
