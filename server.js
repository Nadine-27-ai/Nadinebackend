const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const status = {};

app.get("/", (req, res) => {
    res.send("Cat API is running");
});

app.get("/api/server/status", (req, res) => {
    status.msg = "Server is up and ready";
    res.json(status);
});

const kittySchema = new mongoose.Schema({
    name: String
});

const Kitten = mongoose.model('Kitten', kittySchema);

app.post("/api/submit-cat", async (req, res) => {
    const kittenName = req.body.catName;

    const kitty = new Kitten({ name: kittenName });
    await kitty.save();

    res.send("Cat submitted successfully");
});

app.get("/api/cats", async (req, res) => {
    const cats = await Kitten.find();
    res.json(cats);
});

app.put("/api/cats/:id", async (req, res) => {
    const updated = await Kitten.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true }
    );
    res.json(updated);
});

app.delete("/api/cats/:id", async (req, res) => {
    await Kitten.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
        console.log("API is listening on Port:", PORT);
    });
})
.catch(err => console.log(err));