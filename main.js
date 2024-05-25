// グローバルはここだけ
let array_animation;

document.addEventListener("DOMContentLoaded", initialize);

function initialize () {
    // screen initialization
    const screen = new Screen();
    screen.set_ratio_input(document.getElementById("screen_width_ratio_input"));
    screen.set_screen(document.getElementById("screen"));

    const animation_config = new AnimationConfig();
    animation_config.set_speed_input(document.getElementById("speed_input"));

    array_animation = new ArrayAnimation();
    array_animation.set_config(animation_config);
    array_animation.set_screen(screen);

    document.getElementById("start_button").addEventListener("click", start_visualize);
}

function start_visualize () {
    // すでにアニメーションが走っていたら止める。
    array_animation.is_running = false;

    // 要素数取得
    const N = parseInt(document.getElementById("array_size_input").value);
    if (isNaN(N) || N <= 0) {
        alert("要素数は0より大きな整数である必要があります。");
        return;
    }

    // 操作取得
    const selected_index = parseInt(document.getElementById("operation_selection_input").selectedIndex);
    if (selected_index == 0) {
        alert("操作を選択してください。");
        return;
    }

    // 配列生成の設定
    const allow_duplication = document.getElementById("allow_duplication_input").checked;

    // アニメーション関連の設定
    const monitored_array = new MonitoredArray();
    monitored_array.init(N, allow_duplication);

    const tracking_array = new TrackingArray();
    tracking_array.set_original_array(monitored_array.original_array);

    array_animation.set_monitored_array(monitored_array);
    array_animation.set_tracking_array(tracking_array);

    // イベント生成
    const operations = [
        quick_sort,
        merge_sort,
        msb_radix_sort,
        selection_sort,
        bubble_sort,
    ];
    operations[selected_index - 1](monitored_array);

    // アニメーションを走らせる
    function animation () {
        if (!array_animation.is_running) return;
        array_animation.draw_current_frame();
        window.requestAnimationFrame(animation);
    }

    array_animation.last_drawing_time = Date.now();
    array_animation.is_running = true;
    window.requestAnimationFrame(animation);
}

