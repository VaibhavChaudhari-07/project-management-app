import Ticket from "../models/Ticket.js";

// Create ticket
export const createTicket = async (req, res) => {
  try {
    const { title, description, priority, projectId } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      priority,
      project: projectId,
      createdBy: req.user.id,
    });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get tickets by project
export const getTicketsByProject = async (req, res) => {
  try {
    const tickets = await Ticket.find({ project: req.params.projectId })
      .populate("assignee", "name email");

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update ticket status
export const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Assign user
export const assignUser = async (req, res) => {
  try {
    const { userId } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { assignee: userId },
      { new: true }
    );

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete ticket
export const deleteTicket = async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: "Ticket deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
