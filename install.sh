#!/bin/bash

set -e

# Configuration
REPO="Tomyail/abridge"
APP_NAME="abridge"
INSTALL_ROOT="$HOME/.abridge"
BIN_DIR="$INSTALL_ROOT/bin"
BINARY_NAME="abridge"

# Colors
reset="\033[0m"
red="\033[31m"
green="\033[32m"
yellow="\033[33m"
blue="\033[34m"
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

# Create directories
mkdir -p "$BIN_DIR"

info "Downloading ${VERSION} from ${DOWNLOAD_URL}..."
TMP_FILE=$(mktemp)
curl -L -o "$TMP_FILE" "$DOWNLOAD_URL"

# Install
info "Installing to ${BIN_DIR}/${BINARY_NAME}..."
chmod +x "$TMP_FILE"
mv "$TMP_FILE" "${BIN_DIR}/${BINARY_NAME}"

# Shell Profile Update Logic
update_shell_profile() {
  local shell_profile=$1
  if [ -f "$shell_profile" ]; then
    if ! grep -q "$BIN_DIR" "$shell_profile"; then
      info "Adding $BIN_DIR to PATH in $shell_profile"
      echo "" >> "$shell_profile"
      echo "# Abridge CLI" >> "$shell_profile"
      echo "export PATH=\"$BIN_DIR:\$PATH\"" >> "$shell_profile"
      return 0
    fi
  fi
  return 1
}

# Try updating common profiles
SHELL_UPDATED=false
if [[ "$SHELL" == */zsh ]]; then
  update_shell_profile "$HOME/.zshrc" && SHELL_UPDATED=true
elif [[ "$SHELL" == */bash ]]; then
  update_shell_profile "$HOME/.bashrc" && SHELL_UPDATED=true
  update_shell_profile "$HOME/.bash_profile" && SHELL_UPDATED=true
fi

success "Abridge ${VERSION} installed successfully!"
echo -e "\n${cyan}Location:${reset} ${BIN_DIR}/${BINARY_NAME}"

if [ "$SHELL_UPDATED" = true ]; then
  echo -e "${yellow}Please restart your terminal or run:${reset} source <your_shell_profile>"
else
  if ! [[ ":$PATH:" == *":$BIN_DIR:"* ]]; then
    warn "Binary path is not in your PATH. Please add it manually:"
    echo -e "  export PATH=\"$BIN_DIR:\$PATH\""
  fi
fi

echo -e "\nTry running: ${cyan}abridge --help${reset}"
