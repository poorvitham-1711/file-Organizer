const fs = require("fs");
const path = require("path");
const File = require("../models/File");
const Folder = require("../models/Folder");

// Upload File
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = await File.create({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      folder: req.body.folderId || null,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Files
const getAllFiles = async (req, res) => {
  try {
    const files = await File.find().populate("folder");

    res.status(200).json({
      count: files.length,
      files,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Folder
const createFolder = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Folder name is required",
      });
    }

    const existingFolder = await Folder.findOne({
      name: name.trim(),
    });

    if (existingFolder) {
      return res.status(400).json({
        message: "Folder already exists",
      });
    }

    const folder = await Folder.create({
      name: name.trim(),
    });

    res.status(201).json({
      message: "Folder created successfully",
      folder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Folders
const getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.find();

    res.status(200).json({
      count: folders.length,
      folders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Move File To Folder
const moveFileToFolder = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { folderId } = req.body;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    file.folder = folderId;
    await file.save();

    res.status(200).json({
      message: "File moved successfully",
      file,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rename File
const renameFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { originalName } = req.body;

    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    file.originalName = originalName;
    await file.save();

    res.status(200).json({
      message: "File renamed successfully",
      file,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete File
const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    await File.findByIdAndDelete(req.params.fileId);

    res.json({
      message: "File deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download File
const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.download(path.resolve(file.filePath), file.originalName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadFile,
  getAllFiles,
  createFolder,
  getAllFolders,
  moveFileToFolder,
  renameFile,
  deleteFile,
  downloadFile,
};