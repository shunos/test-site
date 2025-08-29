<?php
/**
 * Plugin Name: Password Tool JS
 * Description: ショートコードでパスワード生成ツールのJavaScriptを読み込みます。
 * Version: 1.0
 * Author: shuno
 */

// ショートコードが使われたときに実行される関数
function password_tool_js_shortcode_handler() {
    // wp_enqueue_scriptを直接呼び出すことで、このショートコードが使われたページでのみJSを読み込む
    wp_enqueue_script(
        'password-tool-js',
        plugin_dir_url(__FILE__) . 'password-tool.js',
        array(),
        '1.0',
        true // body閉じタグ直前で読み込む
    );

    // ショートコード自体は何も表示しない
    return '';
}

// 'password_tool_js' というショートコードを登録
add_shortcode('password_tool_js', 'password_tool_js_shortcode_handler');