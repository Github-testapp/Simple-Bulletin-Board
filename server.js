const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const apiRouter = require("./routes/api");

mongoose
  .connect("mongodb://localhost:27017/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/thread/:id", (req, res) => {
  res.render("thread", { threadId: req.params.id });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
