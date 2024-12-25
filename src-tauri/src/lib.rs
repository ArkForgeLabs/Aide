use std::sync::Mutex;
use tauri::{Manager, State};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn inference(
    state: State<'_, Mutex<inference::InferenceEngine>>,
    prompt: &str,
    system: &str,
) -> String {
    let state = state.lock().unwrap();
    state.inference(system, prompt)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let inference_engine =
                inference::InferenceEngine::new().expect("Could not start the llama backend");

            app.manage(inference_engine);

            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, inference])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
