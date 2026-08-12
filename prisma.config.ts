// import "dotenv/config";gine
// @ts-ignore
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
<<<<<<< HEAD
});
=======
});
>>>>>>> feature/admin-api-integration
