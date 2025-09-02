const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

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
const MONGO_URI = 'mongodb+srv://kudkiril_db_user:kokos@cluster0.fk9hd6k.mongodb.net/';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log(`Connected to MongoDB at ${MONGO_URI}`);
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})
.catch(err => {
  console.error("Failed to connect to MongoDB:");
  console.error(err);
  process.exit(1); 
  });