class TrackingArray {
    current_array;
    current_color;
    length;
    total_comparisons = 0;
    total_accesses = 0;
    total_assigns = 0;
    color_reset_indexes = new Array(0);

    set_original_array (original_array) {
        this.current_array = original_array.slice();
        this.current_color = new Array(this.current_array.length);
        for (let i = 0; i < this.current_color.length; i++) this.current_color[i] = OPERATION_COLOR.DEFAULT;
        this.length = this.current_array.length;
    }

    reset_colors () {
        while (0 < this.color_reset_indexes.length) {
            this.current_color[this.color_reset_indexes[this.color_reset_indexes.length - 1]] = OPERATION_COLOR.DEFAULT;
            this.color_reset_indexes.pop();
        }
    }

    operation_reciever (operation) {
        const i = operation.index;
        const v = operation.value;

        switch (operation.type) {
            case OPERATION_TYPE.ASSIGN:
                this.current_array[i] = v;
                this.current_color[i] = OPERATION_COLOR.ASSIGN;
                this.total_assigns++;
                this.color_reset_indexes.push(i);
                break;

            case OPERATION_TYPE.ACCESS:
                this.current_color[i] = OPERATION_COLOR.ACCESS;
                this.total_accesses++;
                this.color_reset_indexes.push(i);
                break;

            case OPERATION_TYPE.COMPARISON:
                this.total_comparisons++;
                break;

            default:
                console.error(`Unexpected operation. {operation.type}`);
                break;
        }
    }
}

