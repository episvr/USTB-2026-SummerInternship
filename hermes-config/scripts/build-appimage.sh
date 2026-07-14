#!/usr/bin/env bash
# build-appimage.sh — Build a portable AppImage for Aurobo with bundled dependencies
#
# Usage:
#   ./scripts/build-appimage.sh [--python PYTHON_PATH] [--output OUTPUT_DIR]
#
# Requirements:
#   - Python 3.10+
#   - pip
#   - appimagetool (auto-downloaded if not present)
#
# Output:
#   Aurobo-X.Y.Z-x86_64.AppImage (fully portable, no system deps needed)

set -euo pipefail

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

STEP=0
TOTAL=7
STEP_START=0

step_begin() {
    STEP=$((STEP + 1))
    STEP_START=$(date +%s)
    echo ""
    echo -e "${BOLD}${CYAN}[$STEP/$TOTAL]${NC} ${BOLD}$1${NC}"
}

step_done() {
    local elapsed=$(( $(date +%s) - STEP_START ))
    echo -e "    ${GREEN}✓${NC} ${DIM}done${NC} ${DIM}(${elapsed}s)${NC}"
}

step_warn() {
    echo -e "    ${YELLOW}⚠${NC} $1"
}

spinner() {
    local pid=$1
    local msg=${2:-"Working..."}
    local spin_chars='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
    local i=0
    while kill -0 "$pid" 2>/dev/null; do
        local ch="${spin_chars:$((i % ${#spin_chars})):1}"
        printf "\r    ${CYAN}%s${NC} %s" "$ch" "$msg"
        sleep 0.1
        i=$((i + 1))
    done
    printf "\r"
}

progress_bar() {
    local current=$1
    local total=$2
    local width=30
    if [ "$total" -eq 0 ]; then return; fi
    local pct=$((current * 100 / total))
    local filled=$((current * width / total))
    local empty=$((width - filled))
    printf "\r    ["
    printf '%0.s█' $(seq 1 "$filled" 2>/dev/null) || true
    printf '%0.s░' $(seq 1 "$empty" 2>/dev/null) || true
    printf "] %3d%% (%d/%d)" "$pct" "$current" "$total"
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

# ---------------------------------------------------------------------------
# Defaults
# ---------------------------------------------------------------------------
PYTHON="${PYTHON:-python3}"
OUTPUT_DIR="${OUTPUT_DIR:-$REPO_ROOT/dist}"
APP_NAME="Aurobo"
APPDIR="$REPO_ROOT/.appimage-build/AppDir"
BUILD_LOG="$REPO_ROOT/.appimage-build/build.log"

# Read version from hermes_cli/__init__.py
VERSION=$("$PYTHON" -c "
import re, pathlib
text = pathlib.Path('$REPO_ROOT/hermes_cli/__init__.py').read_text()
m = re.search(r'__version__\s*=\s*\"(.+?)\"', text)
print(m.group(1) if m else '0.0.1')
")

ARCH="x86_64"
APPIMAGE_NAME="${APP_NAME}-${VERSION}-${ARCH}.AppImage"

echo ""
echo -e "${BOLD}╔══════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║   ${CYAN}Aurobo AppImage Builder${NC}  v${VERSION}      ${BOLD}║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════════╝${NC}"
echo -e "${DIM}  Arch: ${ARCH} | Python: $("$PYTHON" --version 2>&1 | awk '{print $2}')${NC}"
echo -e "${DIM}  Output: ${OUTPUT_DIR}/${APPIMAGE_NAME}${NC}"

TOTAL_START=$(date +%s)

# ---------------------------------------------------------------------------
# Step 1: Create AppDir structure
# ---------------------------------------------------------------------------
step_begin "Creating AppDir structure"
rm -rf "$REPO_ROOT/.appimage-build"
mkdir -p "$APPDIR/usr/bin"
mkdir -p "$APPDIR/usr/lib"
mkdir -p "$APPDIR/usr/share/applications"
mkdir -p "$APPDIR/usr/share/icons/hicolor/256x256/apps"
mkdir -p "$REPO_ROOT/.appimage-build"
step_done

# ---------------------------------------------------------------------------
# Step 2: Create Python venv
# ---------------------------------------------------------------------------
step_begin "Creating isolated Python venv"
VENV_DIR="$APPDIR/usr/lib/aurobo-venv"
$PYTHON -m venv "$VENV_DIR" --copies --without-pip 2>"$BUILD_LOG"
echo "    Python: $("$VENV_DIR/bin/python" --version 2>&1)"
step_done

# ---------------------------------------------------------------------------
# Step 3: Install pip + dependencies
# ---------------------------------------------------------------------------
step_begin "Installing pip into venv"
curl -sSL https://bootstrap.pypa.io/get-pip.py | "$VENV_DIR/bin/python" - --quiet 2>>"$BUILD_LOG"
echo "    pip $("$VENV_DIR/bin/pip" --version 2>&1 | awk '{print $2}')"
step_done

step_begin "Installing hermes-agent + dependencies"
echo -e "    ${DIM}This is the slowest step — downloading and compiling packages...${NC}"

# Use --prefer-binary to avoid compiling from source (much faster)
# Use --progress-bar for visual feedback
"$VENV_DIR/bin/pip" install \
    --prefer-binary \
    --no-cache-dir \
    --progress-bar off \
    "$REPO_ROOT" 2>>"$BUILD_LOG" &
PIP_PID=$!

# Show a spinner while pip runs
spinner $PIP_PID "Installing packages..."

# Wait for pip and capture exit code
wait $PIP_PID
PIP_EXIT=$?

if [ $PIP_EXIT -ne 0 ]; then
    step_warn "pip install failed (exit $PIP_EXIT), retrying with verbose output..."
    "$VENV_DIR/bin/pip" install \
        --prefer-binary \
        --no-cache-dir \
        "$REPO_ROOT" 2>>"$BUILD_LOG" || {
        echo -e "    ${RED}✗ Failed to install dependencies. Check ${BUILD_LOG}${NC}"
        exit 1
    }
fi

PKG_COUNT=$("$VENV_DIR/bin/pip" list 2>/dev/null | tail -n +3 | wc -l)
echo "    Installed ${PKG_COUNT} packages"
step_done

# ---------------------------------------------------------------------------
# Step 4: Strip unnecessary files
# ---------------------------------------------------------------------------
step_begin "Stripping unnecessary files (reducing size)"
BEFORE_SIZE=$(du -sh "$VENV_DIR" 2>/dev/null | awk '{print $1}')

# Count files before
FILE_COUNT_BEFORE=$(find "$VENV_DIR" -type f 2>/dev/null | wc -l)

# Remove caches, __pycache__, .pyc/.pyo
find "$VENV_DIR" -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
find "$VENV_DIR" -name "*.pyc" -delete 2>/dev/null || true
find "$VENV_DIR" -name "*.pyo" -delete 2>/dev/null || true

# Remove test suites (safe to strip)
find "$VENV_DIR" -type d \( -name "tests" -o -name "test" \) -exec rm -rf {} + 2>/dev/null || true

# Remove documentation (safe to strip)
find "$VENV_DIR" -type f \( -name "*.md" -o -name "*.rst" \) -delete 2>/dev/null || true

# Remove egg-info metadata (redundant with dist-info)
find "$VENV_DIR" -name "*.egg-info" -type d -exec rm -rf {} + 2>/dev/null || true

AFTER_SIZE=$(du -sh "$VENV_DIR" 2>/dev/null | awk '{print $1}')
FILE_COUNT_AFTER=$(find "$VENV_DIR" -type f 2>/dev/null | wc -l)
echo "    ${BEFORE_SIZE} → ${AFTER_SIZE} (${FILE_COUNT_BEFORE} → ${FILE_COUNT_AFTER} files)"
step_done

# ---------------------------------------------------------------------------
# Step 5: Create launcher script
# ---------------------------------------------------------------------------
step_begin "Creating launcher scripts"
cat > "$APPDIR/usr/bin/aurobo" << 'LAUNCHER'
#!/usr/bin/env bash
# Aurobo portable launcher
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

# Set up isolated home
export HERMES_HOME="${HERMES_HOME:-$HOME/.aurobo}"
mkdir -p "$HERMES_HOME"

# Activate bundled venv
VENV="$APP_ROOT/usr/lib/aurobo-venv"
source "$VENV/bin/activate"

# Run the agent
exec python -m hermes_cli.main "$@"
LAUNCHER
chmod +x "$APPDIR/usr/bin/aurobo"
ln -sf aurobo "$APPDIR/usr/bin/aurobo-cli"

# Create AppRun entry point (appimagetool may not generate it automatically)
cat > "$APPDIR/AppRun" << 'APPRUN'
#!/usr/bin/env bash
SELF="$(readlink -f "$0")"
HERE="${SELF%/*}"
exec "$HERE/usr/bin/aurobo" "$@"
APPRUN
chmod +x "$APPDIR/AppRun"

echo "    Created: aurobo, aurobo-cli, AppRun"
step_done

# ---------------------------------------------------------------------------
# Step 6: Copy assets + desktop file
# ---------------------------------------------------------------------------
step_begin "Copying assets and creating desktop entry"
cp "$REPO_ROOT/assets/avatar.jpg" "$APPDIR/usr/share/icons/hicolor/256x256/apps/aurobo.png"
cp "$REPO_ROOT/assets/avatar.jpg" "$APPDIR/aurobo.png"

cat > "$APPDIR/aurobo.desktop" << DESKTOP
[Desktop Entry]
Type=Application
Name=${APP_NAME}
Exec=aurobo
Icon=aurobo
Comment=Aurobo — Intelligent AI Assistant
Categories=Utility;Development;ArtificialIntelligence;
Terminal=true
DESKTOP

cp "$APPDIR/aurobo.desktop" "$APPDIR/usr/share/applications/aurobo.desktop"
echo "    avatar.png, background.jpg, aurobo.desktop"
step_done

# ---------------------------------------------------------------------------
# Step 7: Download appimagetool + build
# ---------------------------------------------------------------------------
step_begin "Downloading appimagetool"
APPIMAGETOOL="$REPO_ROOT/.appimage-build/appimagetool"
if [ ! -x "$APPIMAGETOOL" ]; then
    echo -e "    ${DIM}Downloading from GitHub...${NC}"
    curl -#L -o "$APPIMAGETOOL" \
        "https://github.com/AppImage/AppImageKit/releases/download/continuous/appimagetool-${ARCH}.AppImage" 2>&1 | \
        while IFS= read -r line; do printf "\r    %s" "$line"; done
    chmod +x "$APPIMAGETOOL"
    echo ""
    echo "    appimagetool downloaded"
else
    echo "    appimagetool already cached"
fi
step_done

step_begin "Building AppImage"
echo -e "    ${DIM}Packaging AppDir into AppImage...${NC}"
mkdir -p "$OUTPUT_DIR"

ARCH="$ARCH" "$APPIMAGETOOL" "$APPDIR" "$OUTPUT_DIR/$APPIMAGE_NAME" --no-appstream 2>&1 | \
    while IFS= read -r line; do printf "\r    %s" "${line:0:80}"; done
echo ""

if [ -f "$OUTPUT_DIR/$APPIMAGE_NAME" ]; then
    FINAL_SIZE=$(ls -lh "$OUTPUT_DIR/$APPIMAGE_NAME" | awk '{print $5}')
    echo "    File: ${OUTPUT_DIR}/${APPIMAGE_NAME}"
    echo "    Size: ${FINAL_SIZE}"
else
    step_warn "appimagetool may need --appimage-extract-and-run flag"
fi
step_done

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
TOTAL_ELAPSED=$(( $(date +%s) - TOTAL_START ))

echo ""
echo -e "${BOLD}╔══════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║         ${GREEN}Build Complete!${NC}                   ${BOLD}║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BOLD}Output:${NC}   $OUTPUT_DIR/$APPIMAGE_NAME"
echo -e "  ${BOLD}Size:${NC}     $(ls -lh "$OUTPUT_DIR/$APPIMAGE_NAME" 2>/dev/null | awk '{print $5}' || echo 'N/A')"
echo -e "  ${BOLD}Time:${NC}     ${TOTAL_ELAPSED}s"
echo ""
echo -e "  ${BOLD}Run with:${NC}"
echo -e "    chmod +x ${OUTPUT_DIR}/${APPIMAGE_NAME}"
echo -e "    ${OUTPUT_DIR}/${APPIMAGE_NAME}"
echo ""
