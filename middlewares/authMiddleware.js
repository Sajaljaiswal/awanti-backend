import { supabase } from "../src/supabase.js";

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

  req.user = data.user;
  next();
};

export default authMiddleware;
