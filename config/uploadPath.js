const path = require("path");
const os = require("os");

const uploadPath = process.env.UPLOADS_DIR || (process.env.VERCEL ? path.join(os.tmpdir(), "uploads") : path.join(__dirname, "../uploads"));

module.exports = uploadPath;
