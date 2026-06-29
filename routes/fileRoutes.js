const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const {
  uploadFile,
  getAllFiles,
  createFolder,
  getAllFolders,
  moveFileToFolder,
  renameFile,
  deleteFile,
  downloadFile,
} = require("../controllers/fileController");

// upload file
router.post("/upload", upload.single("file"), uploadFile);

// get all files
router.get("/", getAllFiles);

// create folder
router.post("/folder", createFolder);

// get folders
router.get("/folders", getAllFolders);

// move file to folder
router.put("/move/:fileId", moveFileToFolder);

// rename file
router.put("/rename/:fileId", renameFile);

// delete file
router.delete("/:fileId", deleteFile);

// download file
router.get("/download/:fileId", downloadFile);

module.exports = router;