import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
  }),
);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);

// GET products
app.get("/products", async (_req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("id, product_name, price");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// POST products
app.post("/products", async (req, res) => {
  const { product_name, price } = req.body;

  if (!product_name || !price) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const { data, error } = await supabase
    .from("products")
    .insert([{ product_name, price }])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

// PUT products
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { product_name, price } = req.body;

  if (!product_name || !price) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const { data, error } = await supabase
    .from("products")
    .update({ product_name, price })
    .eq("id", id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// DELETE products
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ message: "Product deleted successfully" });
});
