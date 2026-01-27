import { supabase } from "../src/supabase.js";

/* 1. CREATE DETAILED AMC (With Configs) */
export const createDetailedAMC = async (req, res) => {
  try {
    const { computer_configs, ...amcData } = req.body;

    // Insert the main record
    const { data: newAMC, error: amcError } = await supabase
      .from("amcs")
      .insert([{ ...amcData, status: "active" }])
      .select()
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

/* 2. GET ALL DETAILED AMCs */
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

/* 3. UPDATE DETAILED AMC */
export const updateDetailedAMC = async (req, res) => {
  try {
    const { id } = req.params;
    const { computer_configs, ...updateData } = req.body;

    // Update main AMC details
    const { data: updatedAMC, error: amcError } = await supabase
      .from("amcs")
      .update({ ...updateData, updated_at: new Date() })
      .eq("id", id)
      .select()
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

/* 4. DELETE AMC */
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