import { supabase } from "../src/supabase.js";

/* CREATE AMC */
export const createAMC = async (req, res) => {
  try {
    const {
      customer_id,
      customer_type,
      amc_type,
      duration_months,
      fees,
      products_covered,
    } = req.body;

    if (!customer_id || !fees) {
      return res.status(400).json({ message: "Customer & fees required" });
    }

    const start = new Date();
    const end = new Date();
    end.setMonth(end.getMonth() + (duration_months || 12));

    const { data, error } = await supabase
      .from("amcs")
      .insert([
        {
          customer_id,
          customer_type,
          amc_type,
          duration_months: duration_months || 12,
          start_date: start,
          end_date: end,
          fees,
          products_covered,
          status: "active",
        },
      ])
      .select(
        `*, customers(name, mobile)`
      )
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET ALL AMCs */
export const getAllAMCs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("amcs")
      .select(`*, customers(name, mobile)`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE AMC */
export const updateAMC = async (req, res) => {
  try {
    const { id } = req.params;

    const { fees, products_covered, status } = req.body;

    const { data, error } = await supabase
      .from("amcs")
      .update({
        fees,
        products_covered,
        status,
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

/* DELETE AMC */
export const deleteAMC = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("amcs").delete().eq("id", id);

    if (error) throw error;

    res.json({ message: "AMC deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
