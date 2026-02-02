import { supabase } from "../src/supabase.js";

/* GET ALL STAFF */
export const getStaff = async (req, res) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};





/* CREATE STAFF (Admin only) */
export const createStaff = async (req, res) => {
  try {
    const { name, email, mobile, role, password } = req.body;

    // 1. Basic Validation
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields (name, email, mobile, password) are required" });
    }

    // 2. Admin Check (Checking if the requester is an admin)
    const { data: adminProfile, error: adminError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", req.user.id) // req.user.id auth middleware se aana chahiye
      .single();

    if (adminError || adminProfile?.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Only admins can create staff." });
    }

    // 3. Create User in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: role?.toLowerCase() || "staff" }
    });

    if (authError) return res.status(400).json({ message: authError.message });

    // 4. Create Profile in Public Table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: authUser.user.id,
          name,
          email,
          mobile,
          role: role?.toLowerCase() || "staff",
          status: "active",
        },
      ])
      .select()
      .single();

    if (profileError) {
      // Cleanup: Agar profile fail ho jaye toh auth user delete karna chahiye (optional logic)
      return res.status(500).json({ message: profileError.message });
    }

    res.status(201).json({
      message: "Staff created successfully",
      staff: profileData,
    });

  } catch (err) {
    console.error("Create Staff Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


/* UPDATE STAFF */
export const updateStaff = async (req, res) => {
  const { id } = req.params;
  const { name, role } = req.body;

  const { data, error } = await supabase
    .from("profiles")
    .update({
      name,
      role: role === "Admin" ? "admin" : "staff",
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};

/* ENABLE / DISABLE STAFF */
export const toggleStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const { data, error } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json(data);
};

/* DELETE STAFF */
export const deleteStaff = async (req, res) => {
  const { id } = req.params;

  await supabase.auth.admin.deleteUser(id);
  await supabase.from("profiles").delete().eq("id", id);

  res.json({ message: "Staff deleted" });
};


export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, mobile, role, status, created_at")
      .eq("id", id)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTicketsByStaff = async (req, res) => {
  try {
    const { staffId } = req.params;

    const { data, error } = await supabase
      .from("tickets")
      .select("id, ticket_number, issue, status, created_at")
      .eq("assigned_staff_id", staffId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
