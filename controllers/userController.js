import { supabase } from "../src/supabase.js";

/* CREATE USER */
export const createUser = async (req, res) => {
  try {
    const { name, mobile, email, address, amc_details } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({ message: "Name and mobile are required" });
    }

    const { data, error } = await supabase
      .from("customers")
      .insert([
        {
          name,
          mobile,
          email,
          address,
          amc_details: amc_details || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/* GET ALL USERS */
export const getUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE USER */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, mobile, email, address, amc_details } = req.body;

    const { data, error } = await supabase
      .from("customers")
      .update({
        name,
        mobile,
        email,
        address,
        amc_details,
        updated_at: new Date(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE USER */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("customers")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



/* GET ALL USERS (name, email, mobile) */

export const getUsersBasicInfo = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("name, email, mobile")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
