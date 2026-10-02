import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qwmjdyaprqmtkgcbvhoo.supabase.co';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY || 'dummy_key_for_oauth');

/**
 * Inicia o fluxo de login oficial do Google via Supabase OAuth.
 * Redireciona o navegador diretamente para o endpoint de autorização do Supabase,
 * garantindo o parâmetro prompt=select_account para exibir a seleção de e-mails do Google.
 */
export function redirectToGoogleOAuth() {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://cassara-fin.vercel.app';
  const redirectTo = `${origin}/login`;
  
  // Endpoint oficial do Supabase Auth para Google OAuth
  const authorizeUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=google&prompt=select_account&redirect_to=${encodeURIComponent(redirectTo)}`;
  
  window.location.href = authorizeUrl;
}
