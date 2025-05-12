'use server';

import { createClient } from '@/utils/supabase/server';
import { Provider } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

// Define the signinWith function to return an async function
const signinWith = (provider: Provider) => {
  return async () => {
    const supabase = await createClient();

    // Make sure to use the full URL for your callback
    // In production, this should be your actual domain
    const auth_callback_url = `${process.env.SITE_URL}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: auth_callback_url,
        // Specify where to go after successful authentication
        queryParams: {
          next: '/dashboard',
        },
      },
    });

    if (error) {
      console.error('Error signing in with OAuth:', error);
      throw new Error(error.message);
    }

    // Important: We need to redirect to the URL provided by Supabase
    if (data?.url) {
      redirect(data.url);
    }

    return null;
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
    throw new Error(error.message);
  }

  // redirect
  redirect('/');
};
