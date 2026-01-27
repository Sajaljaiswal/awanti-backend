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

    if (amcError) throw amcError;

    // Insert configurations if they exist
    if (computer_configs && computer_configs.length > 0) {
      const configsToInsert = computer_configs.map(conf => ({
        amc_id: newAMC.id,
        user_name: conf.user,
        config_details: conf.config
      }));

      const { error: configError } = await supabase
        .from("computer_configs")
        .insert(configsToInsert);

      if (configError) throw configError;
    }

    res.status(201).json({ data: newAMC });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* GET ALL AMCs */
export const getAllAMCs = async (req, res) => {
  try {
    // Fetches AMC and joins the computer_configs array automatically
    const { data, error } = await supabase
      .from("amcs")
      .select(`*, computer_configs(*)`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* UPDATE AMC */
export const updateAMC = async (req, res) => {
  try {
    const { id } = req.params;
    const { computer_configs, ...updateData } = req.body;

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

    if (amcError) throw amcError;

    // If configs are provided, we replace the old ones (Sync strategy)
    if (computer_configs) {
      // Delete old configs
      await supabase.from("computer_configs").delete().eq("amc_id", id);
      
      // Insert new configs
      const configsToInsert = computer_configs.map(conf => ({
        amc_id: id,
        user_name: conf.user,
        config_details: conf.config
      }));
      await supabase.from("computer_configs").insert(configsToInsert);
    }

    res.json({ data: updatedAMC });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* DELETE AMC */
export const deleteAMC = async (req, res) => {
  try {
    const { id } = req.params;

    // If you set up ON DELETE CASCADE in SQL, computer_configs will delete automatically
    const { error } = await supabase
      .from("amcs")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "AMC and related configurations deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};