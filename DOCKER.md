# Running with Docker

A development stack (hot reload for backend + frontend, plus a local MongoDB) that
runs the same on **Windows 11, macOS, and Linux**, including Apple Silicon.

## 1. Prerequisites

| OS | What to install |
| --- | --- |
| Windows 11 | Docker Desktop (uses the WSL2 backend — enable WSL2 if prompted) |
| macOS (Intel or Apple Silicon) | Docker Desktop |
| Linux | `docker` + the Compose plugin. Arch: `sudo pacman -S docker docker-compose`, then `sudo systemctl enable --now docker` and `sudo usermod -aG docker $USER` (re-login). |

Confirm it's working: `docker compose version`.

## 2. Configure env files

Copy the examples and fill in your keys:

```
cp backend/.env.example  backend/.env
cp frontend/.env.example frontend/.env
```

- Keep `PORT=5000` in `backend/.env` (the frontend's axios URL and the compose port map both expect it).
- Database: use the bundled Mongo (`MONGODB_URI=mongodb://mongo:27017/spotify-clone`) or your Atlas string (then delete the `mongo` service + the backend `depends_on` block).

## 3. Run

From the repo root:

```
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend:  http://localhost:5000

Stop with `Ctrl+C`; `docker compose down` removes the containers (add `-v` to also wipe the Mongo volume).

## 4. Seed the database (only if using the bundled Mongo)

```
docker compose exec backend npm run seed:albums
docker compose exec backend npm run backfill:artists
```

## Notes

- **Hot reload** uses polling (nodemon `-L`, and `VITE_USE_POLLING=true` for vite), which is required on Windows/macOS bind mounts and harmless on Linux.
- **Performance (Windows/macOS):** bind mounts are slower than native. On Windows, keeping the project inside the WSL2 filesystem is noticeably faster. On macOS, enable VirtioFS in Docker Desktop settings.
- **Apple Silicon:** images are multi-arch, so they run natively (arm64). If a future dependency lacks arm64 builds, add `platform: linux/amd64` to that service.
- **Ports busy?** If 3000/5000/27017 are taken, change the left side of the `"host:container"` mappings in `docker-compose.yml`.
