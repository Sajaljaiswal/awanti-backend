import { supabase } from "../src/supabase.js";

const requireRole = (roles) => {
  return async (req, res, next) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", req.user.id)
      .single();

    if (!profile || !roles.includes(profile.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user.role = profile.role;
    next();
  };
};

export default requireRole;

