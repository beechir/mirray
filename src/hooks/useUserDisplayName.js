import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function useUserDisplayName(navigationName) {
  const [user, setUser] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserDisplayName() {
      setLoading(true);

      const { data, error } = await supabase.auth.getUser();
      if (error) console.error(error);

      const currentUser = data?.user || null;
      setUser(currentUser);

      if (!currentUser || navigationName) {
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, user_name")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (profileError) {
        console.error(profileError);
      }

      setProfileName(profile?.first_name || profile?.user_name || "");
      setLoading(false);
    }

    getUserDisplayName();
  }, [navigationName]);

  const name =
    navigationName ||
    profileName ||
    user?.user_metadata?.first_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Guest";

  return { user, name, loading };
}
