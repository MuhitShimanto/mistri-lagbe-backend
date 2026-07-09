import dotenv from "dotenv";
import app from "./app.js";
import config from "./config/index.js";

dotenv.config();

const startServer = async (): Promise<void> => {
  try {
    app.listen(config.port, () => {
      console.log(`🚀 Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();