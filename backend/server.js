const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT;

// middlewares
app.use(cors());
app.use(express.json());

// маршруты API
app.use("/api/todos", require("./routes/todos"));

// отдаём фронтенд
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});

// подключение к MongoDB и запуск сервера
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todos";

mongoose.connect(MONGO_URI)
.then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})
.catch(err => console.error(err));