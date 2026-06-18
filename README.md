# CleanWash Laundry Hub

A full-stack MERN laundry management system with customer and admin workflows, built with MongoDB, Express, React, Vite, Node.js, Tailwind CSS, JWT, Google authentication, Cloudinary image uploads, and Nodemailer notifications.

## Features

- Customer registration and login
- Google sign-in
- JWT-based auth with RBAC
- Customer dashboard, order management, order tracking, receipts
- Admin analytics, order workflow management, inventory control, reports
- Responsive dark mode UI with Tailwind CSS
- Email notifications and QR-based order tracking

## Setup

### Backend

1. `cd server`
2. `npm install`
3. Copy `.env.example` to `.env`
4. Fill in MongoDB Atlas, JWT secret, Google OAuth, Cloudinary, and SMTP values
5. `npm run dev`

### Frontend

1. `cd client`
2. `npm install`
3. `npm run dev`

## Project structure

- `server/` - Express backend, controllers, routes, models, middleware
- `client/` - React Vite frontend, pages, components, services

