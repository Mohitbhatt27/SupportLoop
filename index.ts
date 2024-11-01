import express, { Request, Response, Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

import CONFIG from "./src/config/server_config";
import apiRouter from "./src/routes";

const app: Application = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

// Serve static files from the "dist" directory
app.use(express.static(path.join(__dirname, "dist")));

// API routes
app.use("/api", apiRouter);

// Fallback route to serve React app's index.html for any unknown routes
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(CONFIG.PORT, async () => {
  console.log(`Server started on port ${CONFIG.PORT}`);
});
