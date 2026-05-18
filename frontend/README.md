# Salesforce Validation Rule Manager

A full-stack Salesforce administration dashboard built using React.js, Node.js, Express.js, and Salesforce APIs. This application allows users to securely authenticate with Salesforce, fetch validation rules dynamically, and enable or disable validation rules directly from a web interface using Salesforce Tooling API and Metadata API.

---

# Live Demo

Frontend: (https://salesforce-validation-rule-manager-flame.vercel.app/)

Backend: https://salesforce-validation-rule-manager-ad6h.onrender.com



# Features

* Salesforce OAuth 2.0 Authentication with PKCE
* Fetch Salesforce Validation Rules dynamically
* Enable or Disable individual validation rules
* Enable All validation rules
* Disable All validation rules
* Real-time Salesforce Metadata API updates
* Responsive React UI
* Loading states during API requests
* Disabled buttons while requests are processing
* Cloud deployment using Vercel and Render

---

# Tech Stack

## Frontend

* React.js
* Axios
* CSS

## Backend

* Node.js
* Express.js
* JSForce

## Salesforce APIs

* OAuth 2.0 PKCE Flow
* Salesforce Tooling API
* Salesforce Metadata API

## Deployment

* Vercel (Frontend)
* Render (Backend)

---

# Application Workflow

1. User logs in using Salesforce OAuth authentication.
2. Backend authenticates the user using OAuth 2.0 PKCE flow.
3. Validation rules are fetched dynamically from Salesforce using Tooling API.
4. User can enable or disable validation rules directly from the dashboard.
5. Changes are deployed back to Salesforce using Metadata API.

---


# Environment Variables

Create a `.env` file inside the backend folder and add the following variables:

```env
CLIENT_ID=your_salesforce_client_id
CLIENT_SECRET=your_salesforce_client_secret
REDIRECT_URI=your_callback_url
LOGIN_URL=https://login.salesforce.com
```

---

# Installation and Setup

## Clone Repository

```bash
git clone  https://github.com/Hshariq123/salesforce-validation-rule-manager
```

---

## Backend Setup

```bash
cd backend
npm install
node server.js
```

Backend will run on:

```text
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will run on:

```text
http://localhost:3000
```



# Key Learnings

* OAuth 2.0 PKCE Authentication
* Salesforce Tooling API Integration
* Salesforce Metadata API Updates
* Full-stack cloud deployment
* React state management
* Secure API integration
* Metadata automation

---


# Future Improvements

* Toggle switch UI
* Search and filter validation rules
* Better notifications and alerts
* Rule grouping by object
* Authentication persistence
* Improved error handling

---

# Author

Shariq Hussain

---

# License

This project is developed for educational and assignment purposes.
