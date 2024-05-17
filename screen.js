class Screen {
    width_ratio = 0.5;
    context;
    width;
    height;

    constructor () {
        window.addEventListener("resize", () => this.resize_screen(this));
    }

    resize_screen (screen) {
        const ratio = 9.0 / 16;
        screen.context.width = Math.floor(window.innerWidth * screen.width_ratio);
        screen.context.height = Math.floor(screen.context.width * ratio);

        screen.width = screen.context.width;
        screen.height = screen.context.height;
    }

    set_screen (scr) {
        this.context = scr;
        this.resize_screen(this);
    }

    set_ratio_input (input_form) {
        input_form.addEventListener("input", (e) => { 
            this.width_ratio = parseFloat(e.target.value);
            this.resize_screen(this);
        });
    }
}

