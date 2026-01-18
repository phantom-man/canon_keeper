import * as vscode from 'vscode';
import * as fs from 'fs/promises';
import * as path from 'path';

const SERVER_KEY = 'canon-keeper';

function getServerConfig(workspacePath: string): object {
    // Determine Python path based on OS
    const isWindows = process.platform === 'win32';
    const venvPython = isWindows
        ? path.join(workspacePath, '.venv', 'Scripts', 'python.exe')
        : path.join(workspacePath, '.venv', 'bin', 'python');
    
    // Use venv if it exists, otherwise fall back to system python
    const pythonPath = venvPython.replace(/\\/g, '/');
    
    return {
        type: 'stdio',
        command: pythonPath,
        args: ['-m', 'canon_keeper_mcp']
    };
}

async function ensureMcpConfig(folder: vscode.WorkspaceFolder): Promise<boolean> {
    const workspacePath = folder.uri.fsPath;
    const vscodeDir = path.join(workspacePath, '.vscode');
    const mcpPath = path.join(vscodeDir, 'mcp.json');

    await fs.mkdir(vscodeDir, { recursive: true });

    let config: any = {};
    try {
        const raw = await fs.readFile(mcpPath, 'utf8');
        config = JSON.parse(raw);
    } catch {
        config = {};
    }

    if (typeof config !== 'object' || Array.isArray(config) || config === null) {
        config = {};
    }

    let changed = false;

    // Remove old schema key if present
    if (config.$schema) {
        delete config.$schema;
        changed = true;
    }

    // Migrate old mcpServers to servers
    if (config.mcpServers && !config.servers) {
        config.servers = config.mcpServers;
        delete config.mcpServers;
        changed = true;
    }

    // Ensure servers key exists
    if (!config.servers || typeof config.servers !== 'object' || Array.isArray(config.servers)) {
        config.servers = {};
        changed = true;
    }

    const serverConfig = getServerConfig(workspacePath);
    const existing = config.servers[SERVER_KEY];
    if (!existing || JSON.stringify(existing) !== JSON.stringify(serverConfig)) {
        config.servers[SERVER_KEY] = serverConfig;
        changed = true;
    }

    if (changed) {
        await fs.writeFile(mcpPath, JSON.stringify(config, null, 2));
    }

    return changed;
}

async function ensureVscodeSettings(folder: vscode.WorkspaceFolder): Promise<boolean> {
    const vscodeDir = path.join(folder.uri.fsPath, '.vscode');
    const settingsPath = path.join(vscodeDir, 'settings.json');

    await fs.mkdir(vscodeDir, { recursive: true });

    let settings: any = {};
    try {
        const raw = await fs.readFile(settingsPath, 'utf8');
        if (raw.trim()) {
            settings = JSON.parse(raw);
        }
    } catch {
        settings = {};
    }

    const mcpKey = 'github.copilot.chat.modelContextProtocol.enabled';
    if (settings[mcpKey] !== true) {
        settings[mcpKey] = true;
        await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
        return true;
    }

    return false;
}

export async function activate(context: vscode.ExtensionContext) {
    const folders = vscode.workspace.workspaceFolders || [];
    if (!folders.length) {
        return;
    }

    let updated = false;
    for (const folder of folders) {
        const mcpChanged = await ensureMcpConfig(folder);
        const settingsChanged = await ensureVscodeSettings(folder);
        updated = updated || mcpChanged || settingsChanged;
    }

    if (updated) {
        const choice = await vscode.window.showInformationMessage(
            'Canon Keeper MCP registered. Reload VS Code to activate?',
            'Reload now',
            'Later'
        );
        if (choice === 'Reload now') {
            await vscode.commands.executeCommand('workbench.action.reloadWindow');
        }
    }
}

export function deactivate() {}
