const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cartManager");
const fs = require("fs").promises;
const cartManager = new CartManager("./src/models/carts.json");

router.get("/carts", async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json(carts);
    } catch (error) {
        console.error("Error al obtener carritos:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.post("/carts", async (req, res) => {
    try {
        const newCart = req.body;
        if (!isValidCart(newCart)) {
            return res.status(400).json({ error: "Datos de carrito no válidos" });
        }
        newCart.id = generateCartId();

        const carts = await cartManager.getCarts();

        carts.push(newCart);
        await fs.writeFile("./src/models/carts.json", JSON.stringify(carts, null, 2), "utf-8");
        res.json(newCart);
    } catch (error) {
        console.error("Error al agregar carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get("/carts/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener carrito por ID:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


router.post("/carts/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);

        res.json(updatedCart);
    } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

function isValidCart(cart) {
    return (
        cart &&
        typeof cart.id === "string" &&
        true
    );
}

function generateCartId() {
    return Math.random().toString(36).substr(2, 9);
}

module.exports = router;
