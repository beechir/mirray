// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function handleSession(session) {
      const currentUser = session?.user ?? null;

      if (currentUser && !currentUser.email_confirmed_at) {
        await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
        return;
      }

      if (currentUser) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (error || !profile) {
          if (error) console.error(error);
          await supabase.auth.signOut();
          setUser(null);
          setLoading(false);
          return;
        }
      }

      setUser(currentUser);
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}
