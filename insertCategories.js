const mongoose = require("mongoose");
const Category = require("./models/category");

mongoose
  .connect("mongodb://localhost:27017/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const categories = [
  { name: "テストカテゴリー1" },
  { name: "テストカテゴリー2" },
  { name: "テストカテゴリー3" },
];

Category.insertMany(categories)
  .then(() => {
    console.log("Categories inserted");
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error inserting categories:", err);
    mongoose.connection.close();
  });
