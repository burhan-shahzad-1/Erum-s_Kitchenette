Here's your complete Figma Make prompt — single paste, everything included:

🎨 Figma Make Prompt — Admin Panel (Full Integration)
Paste this entire prompt into Figma Make:

Design a complete Admin Panel Dashboard for a food delivery app. The customer-facing app is already designed — this admin panel must feel like the same design system (matching typography, color palette, component style, border radius, shadows, and spacing) but with a more professional, data-dense layout suited for business owners.

🖥️ Layout & Structure

Desktop-first design at 1440x900px, also responsive for 1280px and 1024px
Fixed left sidebar for navigation (collapsed icon-only mode + expanded label mode)
Top navbar with admin avatar, notification bell, and restaurant name/logo
Use dark sidebar + light main content area (or full dark mode variant)
All pages should use card-based layout with consistent padding, shadows, and grid


🔐 Page 1 — Admin Login

Centered login card with restaurant logo at top
Email and password fields with show/hide toggle
"Login as Admin" primary button
Subtle background (blurred food image or brand gradient)
Error state for wrong credentials


📊 Page 2 — Main Dashboard (Home)

Top KPI cards row: Total Orders Today, Revenue Today, Active Deliveries, New Customers
Line chart: Weekly Revenue Overview
Bar chart: Orders per Day (last 7 days)
Two-column bottom section:

Left: Recent Orders table (Order ID, Customer, Items, Status, Time)
Right: Most Popular Products list with dish image, name, order count, revenue


All charts use the app's primary color palette


🍲 Page 3 — Product Management

Top bar: search input + "Add New Item" button (primary CTA)
Filter tabs by category (All, Burgers, Desserts, Drinks, etc.)
Product grid/table with columns: Image, Name, Category, Price, Status (Active/Hidden), Actions (Edit, Delete)
Add/Edit Product modal/drawer:

Upload product image (drag & drop zone)
Fields: Name, Description, Category (dropdown), Price, Availability toggle
Save and Cancel buttons


Delete confirmation modal


📦 Page 4 — Order Management

Top filter tabs: All, Pending, Preparing, Ready, Out for Delivery, Delivered
Orders displayed as a table with columns: Order ID, Customer Name, Items Summary, Total, Status Badge, Time Placed, Actions
Each row has Accept / Reject buttons for Pending orders
Status update dropdown inline in each row to move order through stages
Clicking a row opens an Order Detail side panel: full item list, customer info, delivery address, payment method, status timeline tracker (same 5-step tracker from customer app)
Color-coded status badges: Pending (orange), Preparing (blue), Ready (purple), Out for Delivery (yellow), Delivered (green)


👥 Page 5 — Customer Management

Searchable customer table: Avatar, Name, Email, Phone, Total Orders, Join Date, Actions
Clicking a customer opens a Customer Detail drawer:

Profile info at top
Full order history table
Complaints/notes section with a text area to add internal notes


Filter by: All Customers, New (this week), Frequent Buyers


📈 Page 6 — Sales & Reports

Date range picker at top (Today / This Week / This Month / Custom)
KPI strip: Total Revenue, Total Orders, Average Order Value, Top Category
Line chart: Revenue trend over selected period
Bar chart: Orders breakdown by category
Pie/Donut chart: Revenue share by category
Most Popular Products table: Rank, Image, Name, Orders Count, Revenue Generated
Export button (PDF / CSV) at top right


🚚 Page 7 — Delivery Management

Delivery Areas section: Table of active delivery zones (Area Name, Min Order, Delivery Charge, Status toggle)
Add/Edit Area modal with fields: Area Name, Delivery Fee, Estimated Time, Active toggle
Delivery Settings card: Default delivery time, Free delivery threshold toggle + amount input, Max delivery radius
Active Deliveries map view (optional panel): Pins showing current out-for-delivery orders on a map


🎨 Design System Rules

Match the existing customer app's color palette, font family, border radius, and button styles exactly
Use the same component library — extend it with admin-specific components (tables, charts, badges, drawers)
Status badges must be pill-shaped with matching colors used in the customer order tracking screen
All modals/drawers should have a backdrop overlay, close on outside click, and have consistent header + footer button layout
Design both light mode and dark mode variants
Use auto layout throughout — every card, table row, sidebar item, and modal must be built with auto layout
All components (sidebar nav item, KPI card, order row, product card, status badge) must be published as reusable components
Include empty states for tables (no orders yet, no products added)
Include loading skeleton states for KPI cards and tables