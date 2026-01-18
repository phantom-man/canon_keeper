# Copilot Instructions (Project Memory)

This file serves as persistent memory for GitHub Copilot. It is read at the start of every chat session.

## 1. Project Overview
<!-- Describe your project here -->
- **Project Name:** [Your Project]
- **Description:** [Brief description]
- **Tech Stack:** [Languages, frameworks, libraries]

## 2. Coding Standards
<!-- Define your coding conventions -->
- **Language:** [Primary language]
- **Style Guide:** [Link or description]
- **Naming Conventions:** [camelCase, snake_case, etc.]

## 3. Architecture Decisions
<!-- Document key architectural choices -->
- **Pattern:** [MVC, microservices, etc.]
- **Database:** [Type and rationale]
- **API Style:** [REST, GraphQL, etc.]

## 4. Operational Protocols
<!-- Define how Copilot should behave -->
- **Error Handling:** [Fail fast vs. graceful degradation]
- **Testing:** [Required coverage, test patterns]
- **Documentation:** [Docstring style, README requirements]

## 5. Memory Persistence

### Memory Persistence Protocol (@History) - CRITICAL
**Rule:** When the user includes `@History`, `save this`, `remember this`, or `add to memory` in any message:

1. **Extract Learnings:**
   - Analyze the conversation for technical decisions, architectural choices, workarounds, and insights
   - Format each as: `| Date | Topic | Decision | Rationale |`

2. **Check for Duplicates:**
   - Read the current `copilot-instructions.md` file
   - Compare each new learning against existing entries in the Session Learnings Log
   - Skip any learning that is semantically equivalent to an existing entry

3. **Append New Learnings:**
   - For each non-duplicate learning, append a new row to the Session Learnings Log table
   - Use today's date in YYYY-MM-DD format

4. **Report to User:**
   - Confirm what was saved: "✅ Saved X new learning(s): [topic names]"
   - Report what was skipped: "⏭️ Skipped Y duplicate(s): [topic names]"
   - If nothing new: "No new learnings detected in this conversation."

**Trigger Phrases:** `@History`, `save this`, `remember this`, `add to memory`, `save learning`, `persist this`

**Example:**
```
User: @History save what we learned
Copilot: [analyzes conversation for learnings]
         [reads copilot-instructions.md]
         [checks for duplicates in Session Learnings Log]
         [appends new rows to the table]
         ✅ Saved 2 new learning(s):
           - MCP Config Format
           - Python Venv Path
         ⏭️ Skipped 1 duplicate: Error Handling (already in log)
```

## 6. Session Learnings Log
This section tracks decisions and learnings that evolve over time. Copilot reads this at session start.

| Date | Topic | Decision | Rationale |
|------|-------|----------|----------|
| 2026-01-18 | Canon Keeper Installed | MCP-based memory persistence | Auto-extract and deduplicate learnings |
| 2026-01-18 | MCP Config Format | Use "servers" key (not "mcpServers"), add "type": "stdio", use absolute Python paths | VS Code MCP expects this exact format; ${workspaceFolder} doesn't expand |
| 2026-01-18 | MCP Enablement | Auto-create .vscode/settings.json with "github.copilot.chat.modelContextProtocol.enabled": true | MCP won't start without this setting |
| 2026-01-18 | GitHub Actions Environment | Remove `environment:` block from CI workflows unless actually needed | Environments require manual approval by default, causing all runs to fail |
| 2026-01-18 | One-Line Install | `pip install canon-keeper-mcp && python -m canon_keeper_mcp install` | Simple install command for end users |
| 2026-01-18 | No MCP Server Needed | Removed MCP server entirely - Copilot handles extraction, deduplication, and formatting directly | Eliminates dependencies, API keys, and complexity |
| 2026-01-18 | Package Rename | Renamed from `canon-keeper-mcp` to `canon-keeper` | Simpler name, no longer MCP-based |
| 2026-01-18 | Zero Dependencies | Package has no runtime dependencies, just an installer | Works with Python 3.8+, no pip install conflicts |
| 2026-01-18 | Preserve User Content | Installer appends to existing copilot-instructions.md instead of overwriting | Respects user's custom content; use --force to overwrite |
| 2026-01-18 | GitHub CLI | Use `gh auth login --web` then `gh repo rename` to rename repos | Easier than web UI for repo management |

---
*This file was initialized by Canon Keeper MCP. Use `@History` to save learnings from conversations.*
