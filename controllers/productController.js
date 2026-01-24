import { supabase } from "../src/supabase.js";

/**
 * GET ALL PRODUCTS
 */
export const getProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * CREATE PRODUCT
 */
export const createProduct = async (req, res) => {
  try {
    const { name, category, price, stock, image_url } = req.body;

    // validation
    if (!name || price === undefined) {
      return res.status(400).json({
        message: "Product name and price are required",
      });
    }

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          category,
          price,
          stock,
          image_url,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE PRODUCT
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
