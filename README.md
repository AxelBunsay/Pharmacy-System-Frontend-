# Pharmacy Admin UI (frontend)

This is a TailwindCSS + React frontend scaffold for a Pharmacy Admin UI (inventory, orders, suppliers, reports). It's intentionally UI-focused and stores demo data in localStorage so you can try features quickly.

How to run (Windows PowerShell):

1. Open a PowerShell in the project folder: `C:\Users\...\Pharmacy System (frontend)`
2. Install dependencies:

```powershell
npm install
```

3. Start the dev server:

```powershell
npm run dev
```

The app will open at the URL printed by Vite (usually http://localhost:5173).

Notes:
- Data is saved to `localStorage` key `pharmacy_products` so you can persist changes in your browser session.
- Basic features: search (topbar), inventory list with add/edit/delete modal, CSV export for inventory, simple pages for orders/suppliers/reports.
- This is frontend-only — no backend. You can replace localStorage usage with API calls in `src/App.jsx` and `src/components/Inventory.jsx`.
