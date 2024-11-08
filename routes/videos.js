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
            image: "./images/Upload-video-preview.jpg",
            description: description,
            views: "1",
            likes: 0,
            duration: "3:30",
            video: "temp-video",
            timestamp: Date.now(),
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
        res.status(404).set(`Error: video "${videoId}" not found`);
        return;
    }

    res.json(currentVideo);
});

router.post("/:videoId/comments", (req, res) => {
    const { videoId } = req.params;
    const { name, comment } = req.body;

    if (!comment.trim()) {
        return res.status(400).send("Error: must provide comment");
    }

    const videosData = readVideos();

    const currentVideo = videosData.find((video) => video.id === videoId);

    if (!currentVideo) {
        res.status(404).set(`Error: video "${videoId}" not found`);
        return;
    }

    const newComment = {
        name: name,
        comment: comment,
        id: uuidv4(),
        timestamp: Date.now(),
    };

    currentVideo.comments.push(newComment);
    fs.writeFileSync("./data/videos.json", JSON.stringify(videosData));

    res.status(201).json(newComment);
});

router
    .route("/:videoId/comments/:commentId")
    .put((req, res) => {
        const { videoId, commentId } = req.params;

        const videosData = readVideos();

        const currentVideo = videosData.find((video) => video.id === videoId);

        if (!currentVideo) {
            res.status(404).send(`Error: video "${videoId}" not found`);
            return;
        }

        const currentComment = currentVideo.comments.find((comment) => comment.id === commentId);

        currentComment.likes += 1;
        fs.writeFileSync("./data/videos.json", JSON.stringify(videosData));

        res.status(200).json({ likes: currentComment.likes });
    })
    .delete((req, res) => {
        const { videoId, commentId } = req.params;

        const videosData = readVideos();

        const currentVideo = videosData.find((video) => video.id === videoId);

        if (!currentVideo) {
            res.status(404).send(`Error: video "${videoId}" not found`);
            return;
        }

        const deleteComment = currentVideo.comments.find((comment) => comment.id === commentId);

        if (!deleteComment) {
            res.status(404).send(`Error: comment "${commentId}" not found`);
            return;
        }

        currentVideo.comments = currentVideo.comments.filter((comment) => comment.id !== commentId);
        fs.writeFileSync("./data/videos.json", JSON.stringify(videosData));

        res.status(204).json(deleteComment);
    });

router.put("/:videoId/likes", (req, res) => {
    const { videoId } = req.params;

    const videosData = readVideos();

    const currentVideo = videosData.find((video) => video.id === videoId);

    if (!currentVideo) {
        res.status(404).send(`Error: video "${videoId}" not found`);
        return;
    }

    currentVideo.likes += 1;
    fs.writeFileSync("./data/videos.json", JSON.stringify(videosData));

    res.status(200).json({ likes: currentVideo.likes });
});

export default router;
