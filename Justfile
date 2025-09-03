# Ghostpipe Web Justfile

# Default registry and image name
registry := "ghcr.io/inputlogic"
image_name := "ghostpipe-excalidraw"

build-container:
    docker buildx build --platform linux/amd64,linux/arm64 -t {{image_name}}:0.1 --load .

push-container:
    docker buildx build --platform linux/amd64,linux/arm64 -t {{registry}}/{{image_name}}:0.1 --push .
