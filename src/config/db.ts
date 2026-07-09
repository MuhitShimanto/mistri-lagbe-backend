import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import config from "./index.js";

const adapter = new PrismaPg({
  connectionString: config.databaseUrl!,
});

const prisma = new PrismaClient({
  adapter,
  log:
    config.nodeEnv === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

export default prisma;