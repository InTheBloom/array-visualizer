// グローバルはここだけ
let screen;

document.addEventListener("DOMContentLoaded", initialize);

function initialize () {
    // screen initialization
    screen = new Screen();
    screen.set_screen(document.getElementById("screen"));
    screen.set_ratio_input(document.getElementById("screen_width_ratio_input"));

    visualize_start_button.addEventListener("click", start_visualize);
}
