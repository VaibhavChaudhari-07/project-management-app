import Project from "../models/Project.js";

// Create project
export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      owner: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id,
    }).populate("owner", "name email");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
