document.addEventListener("DOMContentLoaded", async () => {
  const productContainer = document.getElementById("home-products");

  try {
    const res = await fetch("http://localhost:3000/api/products");
    const products = await res.json();

    // Show first 4 products on homepage
    const featured = products.slice(0, 5);

    productContainer.innerHTML = featured.map(product => `
      <div class="product-card">
        <img src="${product.image_url}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p class="price">$${product.price}</p>
        <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
      </div>
    `).join("");

    // Handle Add to Cart button clicks
    document.querySelectorAll(".add-to-cart").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const productId = e.target.getAttribute("data-id");

        await fetch("http://localhost:3000/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity: 1 })
        });

        alert("✅ Item added to cart!");
      });
    });

  } catch (err) {
    console.error(err);
    productContainer.innerHTML = "<p>⚠️ Unable to load products.</p>";
  }
});
