#!/bin/bash
set -e

# Clone VSCode if not present
if [ ! -d "vscode" ]; then
    git clone https://github.com/microsoft/vscode.git
    cd vscode
    git checkout tags/1.100.0
    npm install
    npm run compile
    npm run compile-web
    cd ..
fi

cd hello_world
# Build the wasm files
cargo build --target wasm32-wasip1 --target-dir ./../ext2/target
cd ./../ext2
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "node_modules already exists, skipping 'npm install'"
fi
# # Generate TypeScript bindings from WIT interfaces using wit2ts and the Rust-defined interfaces
# wit2ts --outDir ./src/web ./../wasm_calculator/wit
# # Remove the specific ESLint disable directive from generated files, since the package is deprecated
# find ./src/web -name '*.ts' -exec sed -i '/eslint-disable @typescript-eslint\/ban-types/d' {} +
npm run compile-web
cd ..

./vscode/scripts/code-web.sh \
    --host 0.0.0.0 \
    --extensionDevelopmentPath=/workspaces/fr_task_2/ext2 \
    --extensionPath=/workspaces/fr_task_2/vscode-wasm/wasm-wasi-core 
    