class Screen {
    width_ratio = 0.5;
    context;
    screen_element;
    width;
    height;

    constructor () {
        window.addEventListener("resize", () => this.resize_screen(this));
    }

    resize_screen (screen) {
        const ratio = 9.0 / 16;
        screen.screen_element.width = Math.floor(window.innerWidth * screen.width_ratio);
        screen.screen_element.height = Math.floor(screen.screen_element.width * ratio);

        screen.width = screen.screen_element.width;
        screen.height = screen.screen_element.height;
    }

    set_screen (scr) {
        this.screen_element = scr;
        this.context = this.screen_element.getContext("2d");
        this.resize_screen(this);
    }

    set_ratio_input (input_form) {
        input_form.addEventListener("input", (e) => {
            this.width_ratio = parseFloat(e.target.value);
            if (this.screen_element != undefined) this.resize_screen(this);
        });
        this.width_ratio = parseFloat(input_form.value);
    }
}

