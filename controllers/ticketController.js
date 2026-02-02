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

/* UPDATE STATUS + LOG HISTORY */
export const updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // get old status
  const { data: ticket } = await supabase
    .from("tickets")
    .select("status")
    .eq("id", id)
    .single();

  // update ticket
  await supabase
    .from("tickets")
    .update({ status, updated_at: new Date() })
    .eq("id", id);

  // insert log
  await supabase.from("ticket_status_logs").insert([
    {
      ticket_id: id,
      old_status: ticket.status,
      new_status: status,
      changed_by: req.user.id,
    },
  ]);

  res.json({ message: "Status updated" });
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


