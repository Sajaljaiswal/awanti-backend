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
  const { name, email, mobile, role } = req.body;

  if (!name || !email || !mobile) {
    return res.status(400).json({
      message: "Name, email and mobile are required",
    });
  }

  // create auth user
  const { data: authUser, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    });

  if (authError) {
    return res.status(400).json({ message: authError.message });
  }

  // create profile
  const { data, error } = await supabase
    .from("profiles")
    .insert([
      {
        id: authUser.user.id,
        name,
        email,
        mobile,
        role: role ,
        status: "active",
      },
    ])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.status(201).json(data);
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
