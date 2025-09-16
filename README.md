# Ghostpipe Excalidraw

A customized Excalidraw instance with Ghostpipe integration for collaborative whiteboarding and diagramming.

## Features

- Full Excalidraw functionality
- WebRTC-based real-time collaboration via Yjs
- Docker deployment ready with Traefik support
- Multi-platform container support (linux/amd64, linux/arm64)

## Prerequisites

- Node.js 18+
- Docker (for containerization)
- Just command runner (optional, for simplified commands)

## Development

### Local Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building

Build the production bundle:
```bash
npm run build
```

## Deployment

### Environment Configuration

1. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

2. Update the environment variables:
- `REGISTRY`: Your container registry (e.g., `ghcr.io/yourorg/ghostpipe-excalidraw`)
- `DOMAIN`: Your domain for the Excalidraw instance
- `VERSION`: Docker image version tag

### Using Just (Recommended)

Build container:
```bash
just build-container
```

Push to registry:
```bash
just push-container
```

Deploy with Docker Swarm:
```bash
just deploy
```

### Manual Docker Commands

Build and push:
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t your-registry/ghostpipe-excalidraw:latest --push .
```

Deploy with docker-compose:
```bash
docker stack deploy -c docker-compose.yml ghostpipe-excalidraw
```

## Configuration

The application expects the following environment variables for deployment:
- `REGISTRY`: Container registry URL with image name
- `DOMAIN`: Domain where the application will be hosted
- `VERSION`: Version tag for the Docker image

## Tech Stack

- **Frontend**: React 18 with Vite
- **Whiteboard**: Excalidraw
- **Collaboration**: Yjs with WebRTC provider
- **Containerization**: Docker with multi-platform support
- **Reverse Proxy**: Traefik (for production deployment)

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.