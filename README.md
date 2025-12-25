# Practice Site (Next.js + Bootstrap)

A simple practice website for test automation using Next.js, Bootstrap, and JSON file storage.

## Features
- Signup form with: FirstName, LastName, Email, Phone, Password, Gender (radio), Agreement (checkbox)
- Login form with a "Signup" link that opens in a new tab
- Dashboard with Profile showing logged-in user data
- Dashboard Users table with search and pagination

## Getting Started

```bash
git clone https://github.com/salmansrabon/practice-site.git
npm install
npm run dev
```

- Open http://localhost:3000
- Use Signup to create a user, then Login.

## Build and Start

```bash
npm run build
npm run start
```

## Notes
- Data is stored in `data/users.json`.
- Auth uses a signed JWT in an HttpOnly cookie.
- For demo purposes, passwords are hashed with SHA-256 (not for production).
