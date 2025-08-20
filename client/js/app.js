// app.js — page scripts: render products & cart, wire buttons

import {
  listProducts,
  getCart,
  addToCart,
  updateCartQty,
  removeFromCart,
} from "./api.js";

// -------- Utilities
function $(sel, root = document) {
  return root.querySelector(sel);
}
function $all(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}
function fmtMoney(cents) {
  return `\$${(Number(cents || 0) / 100).toFixed(2)}`;
}

// -------- Products page logic
async function renderProductsPage() {
  const container = $("#product-list");
  if (!container) return; // not on products.html

  container.innerHTML = "Loading products...";
  try {
    const products = await listProducts();
    if (!products.length) {
      container.innerHTML = "<p>No products yet.</p>";
      return;
    }
    container.innerHTML = "";
    products.forEach((p) => {
      const card = document.createElement("div");
      card.className = "product-card";
      const imgUrl =
        p.image_url ||
        `https://picsum.photos/seed/${encodeURIComponent(p.slug || p.id)}/600/400`;

      card.innerHTML = `
        <img src="${imgUrl}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>${p.description || ""}</p>
        <a href="cart.html" class="btn add-btn" data-id="${p.id}">
          Add to Cart — ${fmtMoney(p.price)}
        </a>
      `;
      container.appendChild(card);
    });

    // Wire "Add to Cart" buttons
    $all(".add-btn", container).forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        const id = Number(btn.getAttribute("data-id"));
        btn.textContent = "Adding...";
        try {
          await addToCart(id, 1);
          btn.textContent = "Added ✓";
          // Optional: navigate to cart
          setTimeout(() => (location.href = "cart.html"), 300);
        } catch (err) {
          console.error(err);
          btn.textContent = "Try again";
        }
      });
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Failed to load products.</p>";
  }
}

// -------- Cart page logic
async function renderCartPage() {
  const itemsWrap = $("#cart-items");
  const totalWrap = $("#cart-total");
  const checkoutBtn = $("#checkout-btn");
  if (!itemsWrap || !totalWrap) return; // not on cart.html

  async function refresh() {
    itemsWrap.innerHTML = "Loading cart...";
    totalWrap.textContent = "";
    try {
      const cart = await getCart();
      const items = cart.items || [];
      if (!items.length) {
        itemsWrap.innerHTML = "<p>Your cart is empty.</p>";
        totalWrap.textContent = "";
        return;
      }

      // Build list
      const ul = document.createElement("ul");
      let total = 0;
      items.forEach((it) => {
        total += Number(it.price) * Number(it.quantity);
        const li = document.createElement("li");
        li.innerHTML = `
          <span><strong>${it.name}</strong> — ${fmtMoney(it.price)}</span>
          <span>
            <button class="qty" data-id="${it.product_id}" data-d="-1">−</button>
            <strong style="padding:0 .5rem">${it.quantity}</strong>
            <button class="qty" data-id="${it.product_id}" data-d="1">+</button>
            <button class="rm" data-id="${it.product_id}">Remove</button>
          </span>
        `;
        ul.appendChild(li);
      });

      itemsWrap.classList.add("cart-items");
      itemsWrap.innerHTML = "";
      itemsWrap.appendChild(ul);

      totalWrap.textContent = `Total: ${fmtMoney(total)}`;

      // Wire qty buttons
      $all(".qty", itemsWrap).forEach((btn) => {
        btn.addEventListener("click", async () => {
          const id = Number(btn.getAttribute("data-id"));
          const d = Number(btn.getAttribute("data-d"));
          try {
            await updateCartQty(id, d);
            await refresh();
          } catch (e) {
            console.error(e);
          }
        });
      });

      // Wire remove buttons
      $all(".rm", itemsWrap).forEach((btn) => {
        btn.addEventListener("click", async () => {
          const id = Number(btn.getAttribute("data-id"));
          try {
            await removeFromCart(id);
            await refresh();
          } catch (e) {
            console.error(e);
          }
        });
      });
    } catch (err) {
      console.error(err);
      itemsWrap.innerHTML = "<p>Failed to load cart.</p>";
    }
  }

  // Fake checkout
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      alert("Checkout flow can be integrated later (orders, payments).");
    });
  }

  await refresh();
}

// -------- Contact page demo (optional UX only)
function wireContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    console.log("Contact form submitted:", Object.fromEntries(formData));
    alert("Thanks! We received your message.");
    form.reset();
  });
}

// -------- Init on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  renderProductsPage();
  renderCartPage();
  wireContactForm();
});
