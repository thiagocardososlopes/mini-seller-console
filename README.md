# Mini Seller Console

A lightweight front-end application built with React, TypeScript, and Tailwind CSS to manage a sales pipeline. This project allows users to view, filter, sort, and edit leads, and then convert them into opportunities. All data is persisted in the browser's local storage, requiring no backend.

Deployed at: https://mini-seller-console-dusky.vercel.app/leads

### Tech Stack

* React (with Vite)
* TypeScript
* Tailwind CSS for styling

### Core Features
* Leads List: View all leads in a sortable and filterable table.

* Filter Panel: Dynamically filter leads by name, company, status, and score range.

* Lead Detail Panel: Click on a lead to open a side panel with detailed information.

* Inline Editing: Edit a lead's email and status directly in the detail panel.

* Convert to Opportunity: Convert a qualified lead into an opportunity with a dedicated form.

* Data Persistence: All leads, opportunities, and filters are saved in localStorage.

* Dark Mode: Automatically adapts to the user's system theme preference.

### Getting Started
Prerequisites
* Node.js (version 18.x or higher is recommended)

* npm or yarn

Running Locally:

1- Clone the repository (if you haven't already):
````
git clone <repository-url>
cd mini-seller-console
````
2- Install dependencies:
```
npm install
```

3- Run the development server:
```
npm run dev
```
The application will now be running on http://localhost:5173 (or the next available port).