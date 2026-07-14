<p align="center">
  <img src="assets/background.jpg" alt="Aurobo Agent" width="100%">
</p>

# Aurobo Agent

<p align="center">
  <a href="https://github.com/NousResearch/hermes-agent/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License: MIT"></a>
  <a href="https://discord.gg/NousResearch"><img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Discord"></a>
</p>

**A personal AI agent with persistent memory, skills, and tool-calling capabilities.** Aurobo runs locally on your machine as a CLI or TUI application, with optional gateway support for messaging platforms.

Use any model you want — OpenRouter, OpenAI, Anthropic, Google Gemini, DeepSeek, xAI, or your own endpoint. Switch with `aurobo model` — no code changes, no lock-in.

<table>
<tr><td><b>Real terminal interface</b></td><td>Full TUI with multiline editing, slash-command autocomplete, conversation history, and streaming tool output.</td></tr>
<tr><td><b>Persistent memory</b></td><td>Agent-curated memory with periodic nudges. FTS5 session search with LLM summarization for cross-session recall.</td></tr>
<tr><td><b>Skills system</b></td><td>Autonomous skill creation after complex tasks. Skills self-improve during use.</td></tr>
<tr><td><b>Tool calling</b></td><td>Terminal, file operations, code execution, web search, browser automation, vision, and TTS.</td></tr>
<tr><td><b>Scheduled automations</b></td><td>Built-in cron scheduler for daily reports, nightly backups, weekly audits — all in natural language.</td></tr>
<tr><td><b>Delegates and parallelizes</b></td><td>Spawn isolated subagents for parallel workstreams.</td></tr>
</table>

---

## Quick Install

### Linux, macOS, WSL2

```bash
pip install aurobo
```

Or install from source:

```bash
git clone https://github.com/your-repo/aurobo.git
cd aurobo
pip install -e .
```

### AppImage (Linux)

Download the latest AppImage from the releases page:

```bash
chmod +x Aurobo-*.AppImage
./Aurobo-*.AppImage
```

After installation:

```bash
aurobo              # start chatting!
aurobo --tui        # launch the modern TUI
```

---

## Getting Started

```bash
aurobo              # Interactive CLI — start a conversation
aurobo model        # Choose your LLM provider and model
aurobo tools        # Configure which tools are enabled
aurobo config set   # Set individual config values
aurobo setup        # Run the full setup wizard (configures everything at once)
aurobo doctor       # Diagnose any issues
```

---

## Configuration

Configuration lives at `~/.aurobo/config.yaml` (settings) and `~/.aurobo/.env` (API keys only).

```bash
aurobo config edit         # Open config in $EDITOR
aurobo config set model gpt-4   # Set a config value
```

---

## Features

| Feature | Description |
|---------|-------------|
| `aurobo chat` | Interactive chat session |
| `aurobo --tui` | Modern terminal UI |
| `aurobo model` | Select LLM provider |
| `aurobo tools` | Configure toolsets |
| `aurobo skills` | Manage skills |
| `aurobo memory` | Manage persistent memory |
| `aurobo sessions` | Browse session history |
| `aurobo cron` | Schedule recurring tasks |
| `aurobo logs` | View agent logs |

---

## Documentation

Full documentation is available in the `docs/` directory:

- [Architecture](docs/README.md) — Project structure, agent loop, key classes
- [Tools](docs/tools.md) — Available tools and toolsets
- [Configuration](docs/config.md) — Config file reference
- [Memory](docs/memory.md) — Persistent memory system
- [Skills](docs/skills.md) — Skills system

---

## Community

- 💬 [Discord](https://discord.gg/NousResearch)
- 🐛 [Issues](https://github.com/NousResearch/hermes-agent/issues)

---

## License

MIT — see [LICENSE](LICENSE).

Built by [Aurobo](https://github.com/NousResearch/hermes-agent).
