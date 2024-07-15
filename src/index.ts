import express from "express";

const app = express();
const port = 3000;

app.post("/login", (req, res) => {});

app.post("/logout", (req, res) => {});

app.post("/signup", (req, res) => {});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
