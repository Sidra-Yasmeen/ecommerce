
# NovaMart Full-Stack (HTML/CSS/JS + Node + MySQL)

This package converts your uploaded template into a working store demo with:
- Front-end in `/client` (kept from your theme, plus `products.html`, `css/novamart.css`, and `js/app.js`).
- Back-end in `/server` (Express + MySQL, product and cart APIs).
- Database schema in `/db/init.sql`.

Rebranding is applied to avoid potential copyright issues (generic name *NovaMart* and neutral CSS). Replace any images with your own or royalty-free assets for production.

## Quick Start

1. **MySQL**
   - Create database and tables:
     ```sql
     SOURCE db/init.sql;
     ```

   Or run the seed script from Node after .env is set.

2. **Server**
   ```bash
   cd server
   cp ../.env.example .env
   npm install
   npm run seed   # seeds DB using db/init.sql
   npm run dev    # starts server on http://localhost:3000
   ```

3. **Front-end**
   - Visit: `http://localhost:3000/products.html`
   - Products load from `/api/products`.
   - Cart is managed via `/api/cart` endpoints.

## API

- `GET /api/products` — list products
- `GET /api/products/:id` — product by id
- `GET /api/cart` — current cart
- `POST /api/cart` — `{ productId, quantity }`
- `PUT /api/cart` — `{ productId, delta }` increase/decrease quantity
- `DELETE /api/cart/:productId` — remove item

## Notes
- Replace placeholder imagery (currently using picsum.photos) with your own to fully avoid copyright concerns.
- Color palette inspired by your preferences (Yale/Berkeley/Oxford Blue, Powder Blue, Mint Cream).
