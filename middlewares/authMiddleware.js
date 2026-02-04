import { supabase } from "../src/supabase.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "No token" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Invalid token format" });

    // 1️⃣ Verify token (Auth data)
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData?.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = authData.user;

    const { data: profile } = await supabase
      .from("profiles") 
      .select("name, role")
      .eq("id", user.id)
      .single();

    // 3️⃣ Attach user to request (With Name)
    req.user = {
      id: user.id,
      email: user.email,
      name: profile?.name  || user.email.split('@')[0],
      role: profile?.role || user.user_metadata?.role || "user"
    };

    next();

  } catch (err) {
    console.error("Auth Error:", err);
    res.status(500).json({ message: "Auth failed" });
  }
};

export default authMiddleware;