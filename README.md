# Wasel Palestine
## Smart Mobility & Checkpoint Intelligence Platform

---

## System Overview
Wasel Palestine is a backend API platform designed to help Palestinians navigate daily movement challenges. It provides real-time mobility intelligence including checkpoints, road incidents, crowdsourced reports, and route estimation.

---

## Technology Stack
| Technology | Usage |
|------------|-------|
| Node.js + NestJS | Backend framework |
| PostgreSQL | Relational database |
| TypeORM | ORM for database management |
| JWT | Authentication (Access + Refresh tokens) |
| OpenStreetMap | Routing and geolocation |
| OpenWeatherMap | Weather data |
| Docker | Deployment |
| k6 | Performance testing |

---

## Architecture
- Modular RESTful API architecture
- Each feature is a separate NestJS module
- All endpoints versioned under `/api/v1/`
- JWT authentication with role-based access control (citizen, moderator, admin)
- PostgreSQL with TypeORM (ORM + raw queries)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    Client (Mobile/Web)               │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP Requests
                      ▼
┌─────────────────────────────────────────────────────┐
│                  NestJS API Server                   │
│                  Port: 3001                          │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │   Auth   │  │Incidents │  │   Checkpoints    │  │
│  │ /auth    │  │/incidents│  │  /checkpoints    │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Reports  │  │  Routes  │  │     Alerts       │  │
│  │/reports  │  │ /routes  │  │    /alerts       │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
└─────────────┬───────────────────────┬───────────────┘
              │                       │
              ▼                       ▼
┌─────────────────────┐   ┌──────────────────────────┐
│   PostgreSQL DB      │   │    External APIs         │
│   wasel_db           │   │  - OpenStreetMap (OSM)   │
│                      │   │  - OpenWeatherMap        │
└─────────────────────┘   └──────────────────────────┘
```

---

## Database Schema (ERD)

### Authentication
| Table | Description |
|-------|-------------|
| users | System users with roles |
| refresh_tokens | JWT refresh token management |

### Checkpoints
| Table | Description |
|-------|-------------|
| checkpoints | Checkpoint registry with location data |
| checkpoint_status_history | History of checkpoint status changes |

### Incidents
| Table | Description |
|-------|-------------|
| incidents | Road incidents and hazards |
| incident_status_history | History of incident status changes |

### Reports
| Table | Description |
|-------|-------------|
| reports | Crowdsourced reports from citizens |
| report_votes | Community voting on reports |
| report_audit_log | Audit trail for report moderation |

### Alerts
| Table | Description |
|-------|-------------|
| alert_subscriptions | User alert subscriptions by region/category |
| alert_records | Generated alert records |

### Routes
| Table | Description |
|-------|-------------|
| route_cache | Cached route estimations |

---

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/v1/auth/register | Register new user | Public |
| POST | /api/v1/auth/login | Login and get tokens | Public |
| POST | /api/v1/auth/logout | Logout | Required |

### Incidents
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/incidents | Get all incidents (filter, sort, paginate) | Public |
| GET | /api/v1/incidents/:id | Get incident by ID | Public |
| GET | /api/v1/incidents/:id/history | Get incident status history | Public |
| POST | /api/v1/incidents | Create incident | Admin/Moderator |
| PUT | /api/v1/incidents/:id | Update incident | Admin/Moderator |
| PATCH | /api/v1/incidents/:id/verify | Verify incident | Admin/Moderator |
| PATCH | /api/v1/incidents/:id/close | Close incident | Admin/Moderator |
| PATCH | /api/v1/incidents/:id/resolve | Resolve incident | Admin/Moderator |
| DELETE | /api/v1/incidents/:id | Delete incident | Admin |

### Checkpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/checkpoints | Get all checkpoints (filter, paginate) | Public |
| GET | /api/v1/checkpoints/:id | Get checkpoint by ID | Public |
| GET | /api/v1/checkpoints/:id/history | Get checkpoint status history | Public |
| POST | /api/v1/checkpoints | Create checkpoint | Admin/Moderator |
| PUT | /api/v1/checkpoints/:id | Update checkpoint | Admin/Moderator |
| DELETE | /api/v1/checkpoints/:id | Delete checkpoint | Admin |

### Reports
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/v1/reports | Submit report | Required |
| GET | /api/v1/reports | Get all reports | Public |
| GET | /api/v1/reports/:id | Get report by ID | Public |
| GET | /api/v1/reports/:id/audit-log | Get report audit log | Required |
| PATCH | /api/v1/reports/:id/approve | Approve report | Admin/Moderator |
| PATCH | /api/v1/reports/:id/reject | Reject report | Admin/Moderator |
| POST | /api/v1/reports/:id/vote | Vote on report | Required |

### Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/routes/estimate | Estimate route between two points | Public |

---

## External API Integrations
| API | Usage |
|-----|-------|
| OpenStreetMap (OSM) | Routing and geolocation services |
| OpenWeatherMap | Weather data affecting road conditions |

---

## Running the Project

**Step 1:** Clone the repository
```
git clone https://github.com/saradaas01/Software-Project.git
```

**Step 2:** Install dependencies
```
npm install
```

**Step 3:** Create `.env` file
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=wasel_db
JWT_SECRET=your_secret_key
```

**Step 4:** Run the project
```
npm start
```

---

## Git Workflow
- One feature per branch
- Commit often with clear messages
- Always pull main before starting new work
- Never work directly on main
- At least one person must review before merging
- Delete branch after merging

---

## Team
| Dev           | Feature                         | Extra                              |
|---------------|---------------------------------|------------------------------------|
| Dev 1 (Layal) | Checkpoints + Incidents         | Architecture docs + ERD            |
| Dev 2 (Reem)  | Reports                         | API-Dog all endpoints              |
| Dev 3 (Sara)  | Auth + Alerts + Docker          | System overview + testing strategy |
| Dev 4 (Waad)  | Routes + External APIs          | k6 performance testing + report    |