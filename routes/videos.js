import express from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

function readVideos() {
    return JSON.parse(fs.readFileSync("./data/videos.json"));
}

router
    .route("/")
    .get((req, res) => {
        const videosData = readVideos();

        const condensedData = videosData.map((video) => ({
            id: video.id,
            title: video.title,
            channel: video.channel,
            image: video.image,
        }));

        res.json(condensedData);
    })
    .post((req, res) => {
        const { title, description } = req.body;

        if (!title.trim() || !description.trim()) {
            if (!title.trim() && description.trim()) {
                res.status(400).send("Error: must provide title");
            } else if (title.trim() && !description.trim()) {
                res.status(400).send("Error: must provide description");
            } else {
                res.status(400).send("Error: must provide title and description");
            }
            return;
        }

        const newVideo = {
            id: uuidv4(),
            title: title,
            channel: "Arrayuv Sunshine",
            image: "./images/image8.jpg",
            description: description,
            views: "1,254",
            duration: "3:30",
            video: "temp-video",
            timestamp: new Date(),
            comments: [],
        };

        const videosData = readVideos();

        videosData.push(newVideo);
        fs.writeFileSync("./data/videos.json", JSON.stringify(videosData));

        res.status(201).json(newVideo);
    });

router.get("/:videoId", (req, res) => {
    const { videoId } = req.params;

    const videosData = readVideos();

    const currentVideo = videosData.find((video) => video.id === videoId);

    if (!currentVideo) {
        res.status(404).set(`Error: video ${videoId} not found`);
        return;
    }

    res.json(currentVideo);
});

export default router;
