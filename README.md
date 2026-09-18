<div align="center">

<img src="public/logo_teamsync.png" alt="TeamSync logo" width="140" />

# TeamSync Frontend

A modern React application for managing cycling teams, athletes, staff, sponsors, competitions, and team operations.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React%20Router-6-CA4245?style=flat-square&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![API](https://img.shields.io/badge/API-TeamSync%20Backend-black?style=flat-square)](https://github.com/AFaria20s/TeamSync-Backend)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](https://github.com/AFaria20s/TeamSync-Backend)

</div>

---

## Overview

TeamSync Frontend is the web interface for a cycling team management platform. It consumes the real TeamSync REST API and does not contain demo data or a mock server.

## Related project

The backend API, database model and endpoint documentation are maintained in the separate backend repository:

**[TeamSync Backend](https://github.com/AFaria20s/TeamSync-Backend)**

The backend repository is the source of truth for:

- REST endpoints
- Authentication and JWT configuration
- PostgreSQL persistence
- Entity relationships
- API error responses

## Features

- JWT manager authentication
- Protected application routes
- Team dashboard with live API data
- Upcoming competition overview
- Interactive competition calendar
- Athlete management
- Staff and staff-role management
- Sponsor management
- Discipline management
- Address management with inline address creation
- Team and manager settings
- Relation selectors that display readable names and addresses instead of UUIDs
- Create, edit and delete workflows for supported entities
- Responsive fixed-sidebar application layout
- Public landing page
- English, Portuguese (Portugal), Portuguese (Brazil), Spanish, French and Simplified Chinese UI
- Browser-persisted language preference
- Shared footer with source, credits and licence links

## Technology

- React 19
- React Router 6
- Vite 5
- Native browser Fetch API
- CSS with reusable layout and component classes
- JWT authentication

## Requirements

- Node.js 18 or newer
- npm
- TeamSync Backend running locally or deployed

## Getting started

Clone and install dependencies:

```bash
git clone https://github.com/AFaria20s/TeamSync-Frontend.git
cd TeamSync-Frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend is available at:

```text
http://localhost:3000
```

During development, Vite proxies requests to the API URL configured in `.env`:

```text
http://localhost:8080
```

Start the backend separately by following the instructions in the [TeamSync Backend](https://github.com/AFaria20s/TeamSync-Backend) repository.

## Configuration

The API base URL is configured with `VITE_API_URL`. For local development, copy the example environment file:

For a deployment where the API is exposed through a different public base URL, create a local environment file:

```bash
cp .env.example .env.local
```

For production, `.env.production` configures the deployed backend URL. To override the API URL locally, configure:

```env
VITE_API_URL=https://your-api.example.com/api
```

Never commit `.env` or `.env.local`. The checked-in `.env.example` and `.env.production` files contain non-secret API URLs.

## Project structure

```text
src/
├── app/          # Application routes and protected route shell
├── components/   # Reusable layout, form and UI components
├── context/      # Authentication and language providers
├── pages/        # Route-level screens
├── services/     # API client and request handling
└── styles/       # Global application styles
public/
└── logo_teamsync.png
```

## API integration

All HTTP requests are centralized in [`src/services/api.js`](./src/services/api.js).

The client:

- Uses `/api` by default
- Adds the JWT bearer token from browser storage
- Supports empty `204` and successful empty response bodies
- Converts API failures into `ApiError` instances
- Removes an invalid session when the API returns an authentication failure

Keep endpoint changes synchronized with the [backend controllers and README](https://github.com/AFaria20s/TeamSync-Backend).

## Available commands

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build in dist/
npm run preview  # Preview the production build locally
```

## Security and data handling

This repository contains frontend source code only. It does not contain:

- Database credentials
- JWT secrets
- API keys
- Passwords
- Private certificates
- Production environment files
- Real authentication tokens

User session tokens are created by the backend and stored in the browser at runtime. They are never hardcoded in the source code.

Before publishing changes, review environment files and run:

```bash
git status --short
git grep -n -i -E 'password=|jwt.secret|api[_-]?key|BEGIN .* PRIVATE KEY'
```

## Licence

MIT. See the licence information and project ownership in the [TeamSync Backend repository](https://github.com/AFaria20s/TeamSync-Backend).

## Credits

Created by [AFaria20s](https://github.com/AFaria20s).
