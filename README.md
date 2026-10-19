# MLOps Lab 2: Dockerizing a 3D Maze RL Agent

This lab containerizes an app from one of my academic projects: a **3D maze game where a Q-learning agent learns to escape the maze**. It is built with [Three.js](https://threejs.org/) and [Vite](https://vite.dev/), and the whole RL loop (epsilon-greedy exploration, Q-table updates, reward shaping per difficulty) runs in the browser.

Based on [Docker Lab 1](https://github.com/raminmohammadi/MLOps/tree/main/Labs/Docker_Labs/Lab1) (build, save, run), extended with a multi-stage Dockerfile, Docker Compose, and a GitHub Actions pipeline that builds, tests, and pushes the image to GitHub Container Registry (GHCR).

## Repository layout

```
.
├── 3D_Maze_Game_Agent_Codebase/
│   ├── src/                 # main.js (scene + Q-learning agent), style.css
│   ├── index.html
│   ├── package.json
│   ├── Dockerfile           # multi-stage: node build -> nginx serve
│   └── .dockerignore
├── .github/workflows/docker.yml   # CI: build, smoke test, save, push to GHCR
├── compose.yaml
└── README.md
```

## How the image is built

The `Dockerfile` uses two stages:

1. **Build** (`node:22-alpine`): runs `npm ci` and `npm run build`, which outputs the static site to `dist/`.
2. **Serve** (`nginxinc/nginx-unprivileged:stable-alpine`): copies only `dist/` into nginx. Node and `node_modules` are not in the final image, and nginx runs as a non-root user on port **8080**.

The image also has a `HEALTHCHECK` so `docker ps` shows whether the server is up.

## Run it locally

Requirements: Docker Desktop (or Docker Engine) running.

### Option 1: plain Docker (the lab steps)

```bash
cd 3D_Maze_Game_Agent_Codebase

# 1. Build the image
docker build -t maze-rl-agent:v1 .

# 2. Export the image to a tar file
docker save maze-rl-agent:v1 -o maze-rl-agent.tar

# 3. Run the container
docker run -d --name maze-rl-agent -p 8080:8080 maze-rl-agent:v1
```

Open http://localhost:8080.

Stop and remove it:

```bash
docker rm -f maze-rl-agent
```

To load the exported tar on another machine: `docker load -i maze-rl-agent.tar`.

### Option 2: Docker Compose

From the repo root:

```bash
docker compose up -d --build
```

Open http://localhost:8080. Stop with `docker compose down`.

### Option 3: pull the prebuilt image from GHCR

```bash
docker run -d -p 8080:8080 ghcr.io/vashhdev/maze-rl-agent:latest
```

### Without Docker (dev mode)

```bash
cd 3D_Maze_Game_Agent_Codebase
npm ci
npm run dev
```

## CI/CD: GitHub Actions

`.github/workflows/docker.yml` runs on every push to `main`, on pull requests, and manually (`workflow_dispatch`). It:

1. Builds the image with Buildx (layers cached with the GitHub Actions cache).
2. Smoke tests it: starts the container and checks that the page is served.
3. Runs `docker save` and uploads the `.tar` as a workflow artifact (kept for 7 days).
4. On `main` only: logs in to GHCR with the built-in `GITHUB_TOKEN` and pushes the image tagged `latest` and `sha-<commit>`.

Pull requests only build and test. They never push.

## Using the app

- **Bulk Train**: trains the agent for many episodes without rendering.
- **Live train**: watch the agent explore in real time (epsilon decays as it learns).
- **Play greedy**: run the learned policy.
- **Maze / Difficulty**: switch maze size and reward settings.
- Keys `1`-`4` switch camera, `H` toggles the HUD, arrow keys move the agent manually.
