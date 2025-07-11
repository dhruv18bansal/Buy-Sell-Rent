require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");
const orderRoutes = require("./routes/orders");
const chatbotRoutes = require("./routes/chatbot");
// database connection
console.log(__dirname);
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatbotRoutes);
app.use(express.static(path.join(__dirname, "client", "build")));
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
// app.use(express.static("/client/build"));
const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
