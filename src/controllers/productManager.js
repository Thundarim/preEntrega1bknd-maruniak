const fs = require("fs").promises;

class ProductManager {
    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
    }

    async getProducts() {
        try {
            const respuesta = await fs.readFile("./src/models/products.json", "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;
        } catch (error) {
            console.error(error);
        }
    }

    async getProductById(id) {
        try {
            const arrayProductos = await this.getProducts();
            const buscado = arrayProductos.find(item => item.id === id);
            return buscado;
        } catch (error) {
            console.error(error);
        }
    }

    async addProducts(newProduct) {
        try {
            const arrayProductos = await this.getProducts();
            const ultId = arrayProductos.length > 0 ? Math.max(...arrayProductos.map(product => product.id)) : 0;
            newProduct.id = ultId + 1;
            arrayProductos.push(newProduct);
            await fs.writeFile("./src/models/products.json", JSON.stringify(arrayProductos, null, 2));
            return arrayProductos;
        } catch (error) {
            console.error(error);
        }
    }
}



module.exports = ProductManager;
