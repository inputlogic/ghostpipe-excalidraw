# Default registry and image name
registry := env_var_or_default("REGISTRY", "registry.example.com/ghostpipe-excalidraw")
image_name := env_var_or_default("IMAGE_NAME", "ghostpipe-excalidraw")
docker_context := env_var_or_default("DOCKER_CONTEXT", "default")

# Get version from package.json
version := `node -p "require('./package.json').version"`

build-container:
    docker --context default buildx build --platform linux/amd64,linux/arm64 -t {{image_name}}:{{version}} --load .

push-container:
    docker --context default buildx build --platform linux/amd64,linux/arm64 -t {{registry}}:{{version}} --push .

deploy: push-container
    docker --context {{docker_context}} pull {{registry}}:{{version}}
    VERSION={{version}} REGISTRY={{registry}} DOMAIN=$DOMAIN docker --context {{docker_context}} stack deploy -c docker-compose.yml ghostpipe-excalidraw
