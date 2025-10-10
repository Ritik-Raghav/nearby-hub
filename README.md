 LocalFinder Frontend

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3-blue?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

LocalFinder is a web application that helps users discover and connect with local service providers in their area. This **frontend** is built with **React**, **Tailwind CSS**, and **Google Maps API**, offering an interactive and user-friendly experience.

---

## 🌟 Features

* **Interactive Map View**: See service providers on a map with markers.
* **Provider Profiles**: View detailed info, ratings, and contact details.
* **Search & Filters**: Quickly find providers by name, category, or location.
* **User Authentication**: Sign up, log in, and manage your account.
* **Ratings & Reviews**: Submit and view provider reviews.
* **Responsive Design**: Works on both desktop and mobile devices.
* **Real-time Data Fetch**: Get the latest provider info from the backend API.

---

## 🛠️ Tech Stack

* **Frontend**: React, Tailwind CSS, React Router, Axios
* **Map Integration**: Google Maps API (or alternative map library)
* **State Management**: React Context API / useState / useReducer
* **HTTP Client**: Axios
* **Environment Variables**: `.env` for API URLs and keys

---

## 📂 Project Structure

```
localfinder-frontend/
├─ public/
│  ├─ index.html
│  └─ assets/
├─ src/
│  ├─ components/       # Reusable components (Map, Navbar, Cards)
│  ├─ pages/            # Pages (Home, Provider Details, Login, Register)
│  ├─ services/         # Axios API calls
│  ├─ context/          # React Context for global state
│  ├─ App.jsx
│  └─ main.jsx
├─ .env.example
├─ package.json
└─ tailwind.config.js
```

---

## ⚡ Getting Started (Run Locally)

### 1. Clone the repository

```bash
git clone https://github.com/Ritik-Raghav/nearby-hub.git
cd nearby-hub
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env` file in the root folder based on `.env.example`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

> Replace the API URL with your backend URL and add your Google Maps API key.

### 4. Run the frontend

```bash
npm run dev
# or
yarn dev
```

The app will be accessible at `http://localhost:8080`.

### 5. Build for production

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist/` folder, ready for deployment.

---

## 📌 Notes

* Ensure the **backend API** is running and accessible.
* Images and provider data are fetched from the backend via Axios.
* Enable the **Maps JavaScript API** and **Places API** in your Google Cloud account for map functionality.

---

## 🚀 Future Improvements

* Real-time chat with providers
* Advanced filtering and sorting
* Dark mode theme
* Progressive Web App (PWA) support

---

## ✉️ Author

**Ritik Raghav**

* GitHub: [https://github.com/Ritik-Raghav](https://github.com/Ritik-Raghav)
* Email: [ritikrghv313@gmail.com](mailto:ritikrghv313@gmail.com)
