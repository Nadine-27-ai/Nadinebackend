const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

const status = {};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect("mongodb+srv://NadineM:orise003@cluster0.3cladee.mongodb.net/?appName=Cluster0")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const kittySchema = new mongoose.Schema({
    name: String
});

const Kitten = mongoose.model('Kitten', kittySchema);

app.get("/api/server/status", (req, res) => {
    status.msg = "Server is up and ready";
    res.json(status);
});

app.post("/api/submit-cat", async (req, res) => {
    const kitty = new Kitten({
        name: req.body.catName
    });

    await kitty.save();

    console.log(kitty.name);

    res.send("Cat submitted successfully");
});

app.get("/api/cats", async (req, res) => {
    const cats = await Kitten.find();
    res.json(cats);
});

app.put("/api/cats/:id", async (req, res) => {
    const updatedCat = await Kitten.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(updatedCat);
});

app.delete("/api/cats/:id", async (req, res) => {
    await Kitten.findByIdAndDelete(req.params.id);
    res.json({ message: "Cat deleted" });
});

app.listen(PORT, () => {
    console.log("API is listening on Port:", PORT);
});