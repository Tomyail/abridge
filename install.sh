#!/bin/bash

set -e

# Configuration
REPO="Tomyail/abridge"
INSTALL_DIR="/usr/local/bin"
BINARY_NAME="abridge"

# Colors
reset="\033[0m"
red="\033[31m"
green="\033[32m"
yellow="\033[33m"
blue="\033[34m"
magenta="\033[35m"
cyan="\033[36m"

info() { echo -e "${blue}info${reset} $1"; }
success() { echo -e "${green}success${reset} $1"; }
error() { echo -e "${red}error${reset} $1"; }
warn() { echo -e "${yellow}warning${reset} $1"; }

# Detect OS
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
case "$OS" in
  darwin)  PLATFORM="macos" ;;
  linux)   PLATFORM="linux" ;;
  *)       error "Unsupported OS: $OS"; exit 1 ;;
esac

# Detect Architecture
ARCH_RAW=$(uname -m)
case "$ARCH_RAW" in
  x86_64) ARCH="x64" ;;
  arm64|aarch64) ARCH="arm64" ;;
  *) error "Unsupported architecture: $ARCH_RAW"; exit 1 ;;
esac

ASSET_NAME="abridge-${PLATFORM}-${ARCH}"

info "Detecting platform: ${PLATFORM} (${ARCH})"

# Get latest release from GitHub
info "Fetching latest version from GitHub..."
LATEST_RELEASE=$(curl -s https://api.github.com/repos/${REPO}/releases/latest)
VERSION=$(echo "$LATEST_RELEASE" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')

if [ -z "$VERSION" ]; then
  error "Could not find latest release version. Maybe no release has been created yet?"
  exit 1
fi

DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${VERSION}/${ASSET_NAME}"

info "Downloading ${VERSION} from ${DOWNLOAD_URL}..."
TMP_DIR=$(mktemp -d)
curl -L -o "${TMP_DIR}/${BINARY_NAME}" "${DOWNLOAD_URL}"

# Install
info "Installing to ${INSTALL_DIR}/${BINARY_NAME}..."
chmod +x "${TMP_DIR}/${BINARY_NAME}"

# Move to destination (may require sudo)
if [ -w "$INSTALL_DIR" ]; then
  mv "${TMP_DIR}/${BINARY_NAME}" "${INSTALL_DIR}/${BINARY_NAME}"
else
  warn "Permission denied for ${INSTALL_DIR}. Using sudo..."
  sudo mv "${TMP_DIR}/${BINARY_NAME}" "${INSTALL_DIR}/${BINARY_NAME}"
fi

rm -rf "${TMP_DIR}"

success "Abridge ${VERSION} installed successfully!"
echo -e "Try running: ${cyan}abridge --help${reset}"
