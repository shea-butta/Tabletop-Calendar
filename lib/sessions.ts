import { supabase } from './supabase';

export type Session = {
  id: string;
  title: string;
  notes: string | null;
  session_date: string;
  start_time: string | null;
  created_at: string;
  updated_at: string;
};

export type NewSession = {
  title: string;
  notes?: string | null;
  session_date: string;
  start_time?: string | null;
};

export async function listSessions(): Promise<Session[]> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('session_date', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Session[];
}

export async function createSession(input: NewSession): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data as Session;
}
