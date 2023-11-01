import fs from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  async getProducts() {
    try {
      const products = await fs.promises.readFile(this.path, "utf-8");
      const productsJson = await JSON.parse(products);
      return productsJson;
    } catch (error) {
      console.error(error.message);
    }
  }

  async addProduct(product) {
    try {
      const { title, description, price, thumbnail, code, stock } = product;
      let productValid = true;
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log("All the fields need to be completed");
        productValid = false;
      } else if (this.products.find((p) => p.code === code)) {
        console.log(
          `The code ${code} was alrady in use, please ckeck the field code again.`
        );
        productValid = false;
      }

      if (productValid) {
        if (this.products.length === 0) {
          product.id = 1;
        } else {
          product.id = this.products[this.products.length - 1].id + 1;
        }
        this.products.push(product);
      }
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, "\t")
      );
    } catch (error) {
      console.error(error.message);
    }
  }

  async getProductById(id) {
    try {
      const products = await fs.promises.readFile(this.path, "utf-8");
      const productsJson = await JSON.parse(products);
      let product = productsJson.find((p) => p.id === id);
      if (product) return product;
      console.log("Not found.");
    } catch (error) {
      console.error(error.message);
    }
  }

  async updateProduct(id, newProduct) {
    try {
      const products = await fs.promises.readFile(this.path, "utf-8");
      const productsJson = await JSON.parse(products);
      const productIndex = productsJson.findIndex((p) => p.id === id);
      if (productIndex === -1) {
        console.log("Product not found");
      } else {
        newProduct.id = id;
        productsJson[productIndex] = newProduct;
      }
      return await fs.promises.writeFile(
        this.path,
        JSON.stringify(productsJson, null, "\t")
      );
    } catch (error) {
      console.error(error.message);
    }
  }

  async deleteProducts(id) {
    try {
      const products = await fs.promises.readFile(this.path, "utf-8");
      const productsJson = await JSON.parse(products);
      const productIndex = productsJson.findIndex((p) => p.id === id);
      if (productIndex === -1) {
        console.log("Product not found");
      } else {
        productsJson.splice(productIndex, 1);
      }
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productsJson, null, "\t")
      );
    } catch (error) {
      console.error(error.message);
    }
  }
}
