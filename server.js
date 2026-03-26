const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SERVE YOUR HTML FILE
app.use(express.static(__dirname));

// ROOT ROUTE → SHOW YOUR WEBSITE
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// STATUS ROUTE
app.get("/api/server/status", (req, res) => {
    res.json({ msg: "Server is up and ready" });
});

// SCHEMA
const kittySchema = new mongoose.Schema({
    name: String
});

const Kitten = mongoose.model('Kitten', kittySchema);

// CREATE
app.post("/api/submit-cat", async (req, res) => {
    const kitty = new Kitten({ name: req.body.catName });
    await kitty.save();
    res.send("Cat submitted successfully");
});

// READ
app.get("/api/cats", async (req, res) => {
    const cats = await Kitten.find();
    res.json(cats);
});

// UPDATE
app.put("/api/cats/:id", async (req, res) => {
    const updated = await Kitten.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true }
    );
    res.json(updated);
});

// DELETE
app.delete("/api/cats/:id", async (req, res) => {
    await Kitten.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// CONNECT TO MONGO
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
        console.log("Server running on port:", PORT);
    });
})
.catch(err => console.log(err));