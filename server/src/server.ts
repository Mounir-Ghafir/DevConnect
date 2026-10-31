import "dotenv/config";

import app from "./app";
import { connectDatabase } from "./config/database";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB first
    await connectDatabase();

    // Start Express
    app.listen(PORT, () => {
      console.log(`DevConnect API running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

void startServer();