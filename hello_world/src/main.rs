fn main() {
    #[cfg(all(target_os = "wasi", target_env = "p1"))]
    println!("Hello from Wasm");
}
