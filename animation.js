class AnimationConfig {
    fps = 60;
    sleep_ms = 1;

    set_sleep_input (input_form) {
        input_form.addEventListener("input", (e) => {
            this.sleep_ms = parseInt(e.target.value);
        });
    }

    set_fps_input (input_form) {
        input_form.addEventListener("input", (e) => {
            this.fps = parseInt(e.target.value);
        });
    }
}

class Animation {
    is_running = false;
    current_potision = 0;
    animation_config;
    array_events;

    set_config (config) {
        this.animation_config = config;
    }

    set_array_events (events) {
        this.array_events = events;
    }

    draw_current_frame (screen) {
        // do something
    }
}

// timer setting (1ms / x ms)
let time_speed;
// array operation sleeptime
let sleep_time_ms;


// 工事中...
// This function is called when the button is pressed.
function start_visualize () {
    const N = parseInt(array_size_input.value);
    if (N <= 0) {
        alert("不正な入力");
        return;
    }

    time_speed = 1001 - parseInt(time_speed_input.value);
    sleep_time_ms = parseFloat(sleep_time_ms_input.value);

    let array = generate_shuffled_array(N);
    const Info = new ElementsInfo(array);

    const events = generate_sort_events(array);

    /* debug
    console.log(array.concat());
    console.log(Info);
    console.log(events.concat());
    // */

    const ctx = screen.getContext("2d");
    ctx.font = "20px sans-serif";

    let cycle_ago_time = Date.now();
    let current_time = 0;

    function draw_screen () {
        // End of animation
        if (events.length == 0) return;

        // Wating for time updating
        if (Date.now() - cycle_ago_time < time_speed) {
            window.requestAnimationFrame(draw_screen);
            return;
        }

        cycle_ago_time = Date.now();
        current_time++;

        // Manage events
        while (0 < events.length
            && (events[0].elapsed_time + events[0].elapsed_time_padding * sleep_time_ms) <= current_time) {
            Info.event_reciever(events[0]);
            events.shift();
        }

        // Redraw
        ctx.clearRect(0, 0, width, height);

        Info.draw_array(ctx);
        Info.draw_statistics(ctx, current_time);

        window.requestAnimationFrame(draw_screen);
    }

    draw_screen();
}


