// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use sysinfo::System;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_system_ram() -> u64 {
    let mut sys = System::new_all();
    sys.refresh_memory();
    sys.total_memory() / 1024 / 1024 / 1024
}

#[tauri::command]
fn create_installation(profiles_path: String, name: String) -> Result<(), String> {
    return std::fs::create_dir_all(format!("{}/{}", profiles_path, name)).map_err(|e| e.to_string());
}

#[tauri::command]
fn delete_installation(profiles_path: String, name: String) -> Result<(), String> {
    return std::fs::remove_dir_all(format!("{}/{}", profiles_path, name)).map_err(|e| e.to_string());
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![greet, get_system_ram, create_installation, delete_installation])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
