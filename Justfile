# Ghostpipe Web Justfile

# Default registry and image name
registry := "ghcr.io/inputlogic"
image_name := "ghostpipe-excalidraw"

# Get version from package.json
version := `node -p "require('./package.json').version"`

build-container:
    docker --context default buildx build --platform linux/amd64,linux/arm64 -t {{image_name}}:{{version}} --load .

push-container:
    docker --context default buildx build --platform linux/amd64,linux/arm64 -t {{registry}}/{{image_name}}:{{version}} --push .

deploy: push-container
    docker --context do pull {{registry}}/{{image_name}}:{{version}}
    VERSION={{version}} docker --context do stack deploy -c docker-compose.yml ghostpipe-excalidraw
