const Task = require("../models/Task");

// Tüm taskleri getir
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Taskler getirilemedi",
      error: error.message
    });
  }
};

// Tek task getir
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task bulunamadı"
      });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: "Task getirilemedi",
      error: error.message
    });
  }
};

// Yeni task oluştur
const createTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Title alanı zorunludur"
      });
    }

    const task = await Task.create({
      title
    });

    res.status(201).json({
      message: "Task oluşturuldu",
      task
    });
  } catch (error) {
    res.status(500).json({
      message: "Task oluşturulamadı",
      error: error.message
    });
  }
};

// Task güncelle
const updateTask = async (req, res) => {
  try {
    const { title, completed } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task bulunamadı"
      });
    }

    if (title !== undefined) {
      task.title = title;
    }

    if (completed !== undefined) {
      task.completed = completed;
    }

    const updatedTask = await task.save();

    res.json({
      message: "Task güncellendi",
      task: updatedTask
    });
  } catch (error) {
    res.status(500).json({
      message: "Task güncellenemedi",
      error: error.message
    });
  }
};

// Task sil
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task bulunamadı"
      });
    }

    await task.deleteOne();

    res.json({
      message: "Task silindi",
      task
    });
  } catch (error) {
    res.status(500).json({
      message: "Task silinemedi",
      error: error.message
    });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};