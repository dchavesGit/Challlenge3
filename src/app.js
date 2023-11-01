import express from "express";
import ProductManager from "./manager/product_manager.js";

const PORT = 8080;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const productManager = new ProductManager("./src/files/products.json");

app.get("/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const { limit } = req.query;
    if (!limit) {
    } else {
      if (limit < products.length) {
        products.splice(limit - products.length);
      }
    }
    res.send(products);
  } catch (error) {
    console.log(error);
  }
});

app.get("/products/:pid", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const pid = parseInt(req.params.pid);
    const productSelected = products.find((p) => p.id === pid);
    if (!productSelected) {
      res.status(400).send("Product not found");
    } else {
      res.send(productSelected);
    }
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
