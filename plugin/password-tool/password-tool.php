<?php
/**
 * Plugin Name: Password Tool JS
 * Description: パスワード生成ツール用のJavaScriptを読み込みます。
 * Version: 1.0
 * Author: shuno
 */

// JavaScriptを安全に読み込む
function password_tool_enqueue_assets() {
    // JavaScriptを読み込み
    wp_enqueue_script(
        'password-tool-js',
        plugin_dir_url(__FILE__) . 'password-tool.js',
        array(),
        '1.0',
        true // body閉じタグ直前で読み込む
    );
}
add_action('wp_enqueue_scripts', 'password_tool_enqueue_assets');