import { supabase } from "../src/supabase.js";

/* CREATE TICKET (ADMIN) */
export const createTicket = async (req, res) => {
  const { customer_name, phone, address, product_type, issue } = req.body;

  const { data, error } = await supabase
    .from("tickets")
    .insert([
      {
        customer_name,
        phone,
        address,
        product_type,
        issue,
        ticket_number: `TCK-${Date.now()}`,
        created_by: "38e6ead6-4ab4-42a6-a11b-cdffaf4da863"||req.user.id,
      },
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ message: error.message });

  res.status(201).json(data);
};

/* GET ALL TICKETS */
export const getAllTickets = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return res.status(500).json({ message: error.message });
    }

    res.json(data);
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* UPDATE TICKET DETAILS (ADMIN) */
export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { customer_name, phone, address, product_type, issue } = req.body;

  const { data, error } = await supabase
    .from("tickets")
    .update({
      customer_name,
      phone,
      address,
      product_type,
      issue,
      updated_at: new Date(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};

/* ASSIGN TICKET TO STAFF (ADMIN) */
export const assignTicket = async (req, res) => {
  const { id } = req.params;
  const { staff_id } = req.body;

  const { error } = await supabase
    .from("tickets")
    .update({ assigned_staff_id: staff_id })
    .eq("id", id);

  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: "Ticket assigned" });
};


/* DELETE TICKET (ADMIN) */
export const deleteTicket = async (req, res) => {
  const { id } = req.params;

  await supabase.from("tickets").delete().eq("id", id);
  res.json({ message: "Ticket deleted" });
};


export const getTicketHistory = async (req, res) => {
  const { id } = req.params;

  const { data } = await supabase
    .from("ticket_status_logs")
    .select(`
      old_status,
      new_status,
      changed_at,
      profiles(name)
    `)
    .eq("ticket_id", id)
    .order("changed_at", { ascending: false });

  res.json(data);
};




//ticket updated history
export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 1. Ticket fetch karein aur error handle karein
    const { data: ticket, error: fetchError } = await supabase
      .from("tickets")
      .select("status_history")
      .eq("id", id)
      .single();

    // Agar ticket nahi mila toh turant return karein
    if (fetchError || !ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    
    const oldHistory = Array.isArray(ticket.status_history) ? ticket.status_history : [];
console.log(oldHistory);

    
    const newLog = {
      status: status,
      at: new Date().toLocaleString("en-IN", {
        day: '2-digit', 
        month: 'short', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true
      }),
      // Middleware se data nikalne ka sabse safe tarika
      by: req.user?.name ||req.user?.email|| "Unknown Staff",
      role: req.user?.role || "Staff"
    };

    
    const { data, error: updateError } = await supabase
      .from("tickets")
      .update({
        status: status,
        status_history: [...oldHistory, newLog] // Appending history
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Success response
    res.status(200).json(data);

  } catch (err) {
    console.error("CRASH ERROR:", err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};


// ticket details 
export const getTicketDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("tickets")
      .select("*") // Saare columns (issue, history, customer details, everything)
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// All status of every ticket
export const getLatestStatus = async (req, res) => {
  try {
    // 1. Saare tickets fetch karein jinki history empty nahi hai
    const { data: tickets, error } = await supabase
      .from("tickets")
      .select("ticket_number, customer_name, status_history")
      .not("status_history", "is", null);

    if (error) throw error;

    // 2. Saare tickets ki history ko ek single array mein merge karein
    let allActivities = [];
    tickets.forEach(ticket => {
      if (Array.isArray(ticket.status_history)) {
        ticket.status_history.forEach(log => {
          allActivities.push({
            ticket_number: ticket.ticket_number,
            customer_name: ticket.customer_name,
            ...log // Isme status, at, aur by pehle se hai
          });
        });
      }
    });

    // 3. Latest activity ko sabse upar dikhane ke liye sort karein
    // Note: Iske liye hum 'at' string ko date mein parse karenge
    allActivities.sort((a, b) => new Date(b.at) - new Date(a.at));

    // Sirf top 10 activities bhejein
    res.status(200).json(allActivities.slice(0, 10));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};