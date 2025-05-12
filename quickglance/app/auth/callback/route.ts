import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  // Get the code from the URL
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  // If no code in the URL, redirect to an error page
  if (!code) {
    return NextResponse.redirect(new URL('/auth/auth-code-error', request.url));
  }

  const supabase = await createClient();

  // Exchange the code for a session
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Error exchanging code for session:', error);
    return NextResponse.redirect(new URL('/auth/auth-code-error', request.url));
  }

  // Redirect to the dashboard (or whatever was specified in 'next')
  const redirectUrl = new URL(next, request.url);

  // Create a response with the redirect
  const response = NextResponse.redirect(redirectUrl);

  return response;
}
