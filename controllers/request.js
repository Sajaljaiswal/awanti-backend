import { supabase } from "../src/supabase.js";

// controller for user to request. 
export const createRequest = async (req, res) => {
  try {
  
    const userId = req.user.id;
    const userEmail = req.user.email;

    // Form data (from frontend / postman)
    const { name, phone, issue } = req.body;

    // Validation
    if (!name || !phone || !issue) {
      return res.status(400).json({
        message: "Name, phone, and issue are required",
      });
    }

    // ✅ Current Date & Time (Auto)
    const now = new Date();

    const request_date = now.toISOString().split("T")[0]; 
    // YYYY-MM-DD

    const request_time = now.toTimeString().split(" ")[0]; 
    // HH:MM:SS

    // Insert into requests table
    const { data, error } = await supabase
      .from("requests")
      .insert([
        {
          user_id: userId,
          name,
          phone,
          issue,
          email: userEmail,
          request_date,
          request_time,
        },
      ])
      .select();

    if (error) {
      console.error(error);
      return res.status(500).json({
        message: "Database error",
        error,
      });
    }

    return res.status(201).json({
      message: "Request submitted successfully ✅",
      data,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};



// controller for admin to get all requests from users
export const getAllRequests = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return res.status(500).json({
        message: "Database error",
        error,
      });
    }

    res.status(200).json({
      message: "All requests fetched ✅",
      total: data.length,
      data,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};
