import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const { PORT, BACKEND_URL, CORS_ORIGIN } = process.env;

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

import videoRoutes from "./routes/videos.js";

app.use("/videos", videoRoutes);

app.listen(PORT, () => {
    console.log(`Listening on port ${BACKEND_URL}:${PORT}`);
    console.log("Press CTRL + C to stop server");
});
