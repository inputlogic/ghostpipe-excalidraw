# Ghostpipe Web Justfile

# Default registry and image name
registry := "ghcr.io/inputlogic"
image_name := "ghostpipe-excalidraw"

build-container:
    docker --context default buildx build --platform linux/amd64,linux/arm64 -t {{image_name}}:0.2 --load .

push-container:
    docker --context default buildx build --platform linux/amd64,linux/arm64 -t {{registry}}/{{image_name}}:0.2 --push .

deploy:
    docker --context do stack deploy -c docker-compose.yml ghostpipe-excalidraw
