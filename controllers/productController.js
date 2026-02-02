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




/**
 * UPDATE PRODUCT
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, category, price, stock, image_url } = req.body;

    // At least one field required
    if (!name && !category && price === undefined && stock === undefined && !image_url) {
      return res.status(400).json({
        message: "At least one field is required to update",
      });
    }

    // Build update object dynamically
    const updateData = {};

    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (image_url) updateData.image_url = image_url;

    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(403).json({
        message: "Update not allowed (Only admin can edit)",
        error: error.message,
      });
    }

    if (!data) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product updated successfully",
      product: data,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
