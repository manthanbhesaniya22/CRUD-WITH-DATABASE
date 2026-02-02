const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Manthan@123",
  database: "node_crud",
});

db.connect(err => {
  if (err) console.error("DB Error:", err);
  else console.log("MySQL Connected");
});

// Fixed GET with Pagination (Keep only this one)
app.get("/api/posts", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10; 
  const offset = (page - 1) * limit;

  // MySQL query parameters must be numbers for LIMIT
  db.query(
    "SELECT * FROM posts LIMIT ? OFFSET ?",
    [limit, offset],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

app.get("/api/posts/:id", (req, res) => {
  db.query("SELECT * FROM posts WHERE id = ?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows[0]);
  });
});

app.post("/api/posts", (req, res) => {
  const { title, body } = req.body;
  db.query("INSERT INTO posts (title, body) VALUES (?, ?)", [title, body], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, title, body });
  });
});

app.delete("/api/posts/:id", (req, res) => {
  db.query("DELETE FROM posts WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Post Deleted Successfully" });
  });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));