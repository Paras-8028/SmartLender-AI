import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `SmartLender AI Backend running on http://localhost:${PORT}`
  );
});

server.on("error", (error) => {
  console.error(
    "Server startup error:",
    error.message
  );
});