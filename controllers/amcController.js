import { supabase } from "../src/supabase.js";
export const createAMC = async (req, res) => {
  try {
    const {
      user_id,
      company_name,
      site_address,
      num_laptops,
      num_computers,
      num_printers,
      num_scanners,
      computer_configs,
      on_network,
      os_type,
      payment_cycle,
      rate_per_pc,
      payment_method,
      status,
      amc_type, // optional (agar add kiya hai)
    } = req.body;

    // Required fields
    if (!user_id || !rate_per_pc) {
      return res
        .status(400)
        .json({ message: "user_id & rate_per_pc required" });
    }

    const { data, error } = await supabase
      .from("amcs")
      .insert([
        {
          user_id,
          company_name,
          site_address,
          num_laptops,
          num_computers,
          num_printers,
          num_scanners,
          computer_configs,
          on_network,
          os_type,
          payment_cycle,
          rate_per_pc,
          payment_method,
          status,
          amc_type, // only if column exists
        },
      ])
      .select("*")
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

    const {
      company_name,
      site_address,
      num_laptops,
      num_computers,
      num_printers,
      num_scanners,
      computer_configs,
      on_network,
      os_type,
      payment_cycle,
      rate_per_pc,
      payment_method,
      status,
      amc_type, // agar column hai
    } = req.body;

    const { data, error } = await supabase
      .from("amcs")
      .update({
        company_name,
        site_address,
        num_laptops,
        num_computers,
        num_printers,
        num_scanners,
        computer_configs,
        on_network,
        os_type,
        payment_cycle,
        rate_per_pc,
        payment_method,
        status,
        amc_type,
      })
      .eq("id", id)
      .select("*")
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
