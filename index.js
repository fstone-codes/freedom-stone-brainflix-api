import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const { PORT, BACKEND_URL, CORS_ORIGIN } = process.env;

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use(express.static("public"));

import videoRoutes from "./routes/videos.js";

app.use("/videos", videoRoutes);

app.listen(PORT, () => {
    if (BACKEND_URL) {
        console.log(`Listening on port ${BACKEND_URL}:${PORT}`);
    } else {
        console.log(`Listening on port ${PORT}`);
    }
});
