#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri::{GlobalShortcutManager, Manager};
use window_vibrancy::apply_blur;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            
            #[cfg(target_os = "windows")]
            apply_blur(&window, Some((18, 18, 18, 125)))
                .expect("Failed to apply blur effect");

            let mut shortcut = app.global_shortcut_manager();
            shortcut
                .register("CommandOrControl+Shift+A", move || {
                    if let Some(window) = app.get_window("main") {
                        if window.is_visible().unwrap() {
                            window.hide().unwrap();
                        } else {
                            window.show().unwrap();
                            window.set_focus().unwrap();
                        }
                    }
                })
                .unwrap();

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
