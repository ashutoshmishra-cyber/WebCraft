import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

// GET: Fetch all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ userId: "local-user" })
      .sort({ updatedAt: -1 })
      .select("-data");

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

// POST: Create a new project
router.post("/", async (req, res) => {
  try {
    const { name, description, data } = req.body;

    if (!name?.trim() || data === undefined || data === null) {
      return res.status(400).json({
        message: "Project name and data are required",
      });
    }

    const project = await Project.create({
      name,
      description,
      data,
      userId: "local-user",
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to create project" });
  }
});

// GET: Fetch one project
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: "local-user",
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: "Invalid project ID" });
  }
});

// PUT: Update a project
router.put("/:id", async (req, res) => {
  try {
    const { name, description, data } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (data !== undefined) updates.data = data;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: "local-user" },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: "Failed to update project" });
  }
});

// DELETE: Delete a project
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: "local-user",
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete project" });
  }
});

export default router;