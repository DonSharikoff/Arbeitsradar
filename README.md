# Arbeitsradar

Job portal for the German market with extended context around each vacancy.

Not just a listing — every job is shown together with data about the
profession behind it: how many people move into it, how many leave, how
many openings exist right now. All data comes from Bundesagentur für Arbeit
public APIs (Jobsuche, BERUFENET, NewPlan).

A portfolio project. The goal is not a business product but a backend
engineering skills demonstration: NestJS, MongoDB, Redis, Docker, Angular.

## Stack

- **Backend:** NestJS (monolith, modular structure)
- **DB:** MongoDB 8.0 + Mongoose (TTL-based caching, no long-term storage)
- **Cache:** Redis (reference data, resolve maps, rate limiting)
- **Frontend:** Angular + Tailwind
- **Infrastructure:** Docker Compose, nginx

## Quick start

Requires Docker with the Compose v2 plugin (`docker compose version`).

```bash
cp .env.dist .env
make up
```

The app will be available at `http://localhost`.

### Useful commands

| Command | What it does |
| --- | --- |
| `make up` | bring up the environment |
| `make down` | stop and remove containers |
| `make down-volume` | same, but also removes volumes (⚠️ deletes DB data) |
| `make start` / `make stop` | start/stop already created containers |
| `make ps` | container status |
| `make build` | rebuild images |
| `make connect_back` | open a shell in the backend container |
| `make connect_nginx` | open a shell in the nginx container |

## Repository structure

```
back/            NestJS application
docker/          Dockerfiles (node, nginx)
mongo/snapshot/  MongoDB dumps/snapshots
docker-compose.yml
Makefile
CLAUDE.md        conventions and architectural decisions for working with Claude Code
ROADMAP.md       sprint plan
```

## Status and roadmap

The project is under active development. The current sprint and feature
plan live in [ROADMAP.md](./ROADMAP.md). Architectural decisions and code
conventions are in [CLAUDE.md](./CLAUDE.md).