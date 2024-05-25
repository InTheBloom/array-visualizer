class AnimationConfig {
    speed = 0;

    set_speed_input (input_form) {
        input_form.addEventListener("input", (e) => {
            this.speed = parseFloat(e.target.value);
        });
        this.speed = parseFloat(input_form.value);
    }
}

class ArrayAnimation {
    is_running = false;
    last_drawing_time = Date.now();
    animation_config;
    monitored_array;
    tracking_array;
    screen;

    set_config (config) {
        this.animation_config = config;
    }

    set_screen (src) {
        this.screen = src;
    }

    set_monitored_array (arr) {
        this.monitored_array = arr;
    }

    set_tracking_array (arr) {
        this.tracking_array = arr;
    }

    draw_current_frame () {
        const diff = Date.now() - this.last_drawing_time;

        let mul = (Math.exp(5) - Math.exp(this.animation_config.speed)) / (Math.exp(5) - Math.exp(0));
        mul = (1 - mul);
        const fps = mul * (this.monitored_array.operations.length);

        // 呼ばれたのが早すぎたので終了
        if (diff / 1000 < 1 / fps) return;

        const ctx = this.screen.context;
        const h = this.screen.height;
        const w = this.screen.width;
        const N = this.tracking_array.length;
        const rectangle_width = (w - 10) / N;
        const rectangle_unit_height = h / N;

        ctx.clearRect(0, 0, w, h);

        // スクリーン描画
        for (let i = 0; i < N; i++) {
            ctx.fillStyle = this.tracking_array.current_color[i];
            ctx.fillRect(10 + i * rectangle_width,
                h - rectangle_unit_height * this.tracking_array.current_array[i],
                rectangle_width,
                h);
        }

        // 統計情報描画
        document.getElementById("total_assigns").innerText = `${this.tracking_array.total_assigns}`;
        document.getElementById("total_accesses").innerText = `${this.tracking_array.total_accesses}`;
        document.getElementById("total_comparisons").innerText = `${this.tracking_array.total_comparisons}`;

        { // 終了
            const next_operation = this.monitored_array.get_latest_operation();
            if (next_operation == undefined) {
                this.is_running = false;
                return;
            }
            this.tracking_array.operation_reciever(next_operation);
        }

        // 遅延分だけ更新
        this.tracking_array.reset_colors();
        const required = Math.floor((diff / 1000) / (1 / fps));
        for (let i = 0; i < required; i++) {
            const next_operation = this.monitored_array.get_latest_operation();
            if (next_operation == undefined) break;
            this.tracking_array.operation_reciever(next_operation);
        }

        this.last_drawing_time = Date.now();
    }
}

