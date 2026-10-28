#!/bin/bash
set -e

echo "=================================================="
echo "  M_Dalats Villa - Đóng gói & Đẩy lên Docker Hub  "
echo "=================================================="

USERNAME=${1:-}
IMAGE_NAME=${2:-"mdalats-villa"}
TAG=${3:-"latest"}

if [ -z "$USERNAME" ]; then
    read -p "Nhập Docker Hub Username của bạn (ví dụ: myusername): " USERNAME
fi

if [ -z "$USERNAME" ]; then
    echo "Lỗi: Cần nhập Docker Hub Username để tag và đẩy image!"
    exit 1
fi

FULL_IMAGE_TAG="${USERNAME}/${IMAGE_NAME}:${TAG}"
LATEST_TAG="${USERNAME}/${IMAGE_NAME}:latest"

echo ""
echo "[1/3] Đang đóng gói Docker image: $FULL_IMAGE_TAG ..."
docker build -t "$FULL_IMAGE_TAG" -t "$LATEST_TAG" .

echo ""
echo "[2/3] Kiểm tra đăng nhập Docker Hub..."
docker login

echo ""
echo "[3/3] Đang đẩy image lên Docker Hub..."
docker push "$FULL_IMAGE_TAG"
if [ "$TAG" != "latest" ]; then
    docker push "$LATEST_TAG"
fi

echo ""
echo "=================================================="
echo "  HOÀN TẤT! Image đã được đẩy lên Docker Hub:    "
echo "  👉 https://hub.docker.com/r/${USERNAME}/${IMAGE_NAME}"
echo "=================================================="
echo "Để chạy trên máy chủ bất kỳ:"
echo "docker run -d -p 3000:3000 --name mdalats-app ${FULL_IMAGE_TAG}"
