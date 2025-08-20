// api.js — tiny API client for NovaMart (works with the Express backend)

const API_BASE =
  (location.hostname === "localhost")
    ? "http://localhost:3000/api"
    : "/api";

// Generic helpers
async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, { credentials: "omit" });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

async function apiSend(path, method, payload) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`);
  return res.json();
}

// Products
export async function listProducts() {
  return apiGet("/products");
}
export async function getProduct(id) {
  return apiGet(`/products/${id}`);
}

// Cart
export async function getCart() {
  return apiGet("/cart");
}
export async function addToCart(productId, quantity = 1) {
  return apiSend("/cart", "POST", { productId, quantity });
}
export async function updateCartQty(productId, delta) {
  return apiSend("/cart", "PUT", { productId, delta });
}
export async function removeFromCart(productId) {
  return apiSend(`/cart/${productId}`, "DELETE");
}
