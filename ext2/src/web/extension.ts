import { Wasm, Environment } from '@vscode/wasm-wasi/v1';
import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "ext2" is now active in the web extension host!');
	const wasm: Wasm = await Wasm.load(); 

	const disposable = vscode.commands.registerCommand('ext2.run', async () => {
		vscode.window.showInformationMessage('Hello World from extension_2 in a web extension host!');

		const pty = wasm.createPseudoterminal();
		const terminal = vscode.window.createTerminal({
			name: 'Run Rust Example',
			pty,
			isTransient: true
		});
		terminal.show(true);
		const raw = await vscode.workspace.fs.readFile(
			vscode.Uri.joinPath(
				context.extensionUri,
				"target",
				"wasm32-wasi",
				"debug",
				"hello_world.wasm"
			)
		);
		const bytes = new Uint8Array(raw);
		const module = await WebAssembly.compile(bytes);
		const process = await wasm.createProcess(
			'hello',
			module,
			{ 
				stdio: pty.stdio
			}
		);
		const result = await process.run();
		if (result !== 0) {
			console.log(`Process hello ended with error: ${result}`);
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
