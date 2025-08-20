document.addEventListener("DOMContentLoaded", async () => {
  const cartContainer = document.getElementById("cart-items");

  try {
    const res = await fetch("http://localhost:3000/api/cart");
    const cart = await res.json();

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    cartContainer.innerHTML = cart.map(item => `
      <div class="cart-item">
        <h4>${item.product_id}</h4>
        <p>Quantity: ${item.quantity}</p>
      </div>
    `).join("");
  } catch (err) {
    cartContainer.innerHTML = "<p>Error loading cart.</p>";
  }
});
