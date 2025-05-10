'use server';

import { createClient } from '@/utils/supabase/server';
import { Provider } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

// Define the signinWith function to return an async function
const signinWith = (provider: Provider) => {
  return async () => {
    const supabase = await createClient();
    const auth_callback_url = `${process.env.SITE_URL}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: auth_callback_url,
      },
    });

    if (error) {
      console.error('Error signing in with OAuth:', error);
      return null;
    }

    console.log('OAuth sign-in data:', data);

    // redirect
    redirect(data.url);

    return data;
  };
};

// Create the signInWithGoogle async function
export const signInWithGoogle = signinWith('google');

// Create the signout async function
export const signOut = async () => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    return null;
  }

  // redirect
  redirect('/');

  return true;
};
