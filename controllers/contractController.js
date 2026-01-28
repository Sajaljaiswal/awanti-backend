import { supabase } from "../src/supabase.js";

/* CREATE CONTRACT */
export const createContract = async (req, res) => {
  const { 
    username, 
    mobile, 
    email, 
    address, 
    no_of_laptop, 
    starting_date, 
    end_date, 
    price, 
    signature 
  } = req.body;

  try {
    const { data, error } = await supabase
      .from("contracts")
      .insert([
        {
          username,
          mobile,
          email,
          address,
          no_of_laptop,
          starting_date,
          end_date,
          price,
          signature, // Base64 string or URL
          contract_number: `CON-${Date.now()}`,
          created_by: req.user.id,
        },
      ])
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/* GET ALL CONTRACTS */
export const getAllContracts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("contracts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ message: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/* GET SINGLE CONTRACT BY ID */
export const getContractById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ message: "Contract not found" });
  res.json(data);
};

/* UPDATE CONTRACT */
export const updateContract = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const { data, error } = await supabase
    .from("contracts")
    .update({
      ...updateData,
      updated_at: new Date(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};

/* DELETE CONTRACT */
export const deleteContract = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from("contracts")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: "Contract deleted successfully" });
};