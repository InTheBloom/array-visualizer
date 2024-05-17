class ElementsInfo {
    length = 0;
    value = [];
    color = [];
    total_comparing = 0;
    total_array_access = 0;

    constructor (array) {
        this.length = array.length;
        this.value.length = array.length;
        this.color.length = array.length;

        for (let i = 0; i < array.length; i++) {
            this.value[i] = array[i];
            this.color[i] = "gray";
        }
    }

    event_reciever (e) {
        switch (e.type) {
            case SORT_EVENT_TYPE.ASSIGN:
                this.value[e.index] = e.value;
                this.color[e.index] = "red";
                this.total_array_access++;
                break;

            case SORT_EVENT_TYPE.ACCESS:
                this.color[e.index] = "red";
                this.total_array_access++;
                break;

            case SORT_EVENT_TYPE.COMPARE:
                this.total_comparing++;
                break;

            default:
                console.error("Unexpected event type.");
                break;
        }
    }

    draw_array (ctx) {
        const element_width = (width - 20) / this.length;
        const element_unit_height = (height - 80) / this.length;

        let left_low_x = 10;

        for (let i = 0; i < this.length; i++) {
            ctx.fillStyle = this.color[i];
            ctx.fillRect(left_low_x, height - (element_unit_height * (this.value[i]+1)),
                element_width, element_unit_height * (this.value[i]+1));
            this.color[i] = "gray";
            left_low_x += element_width;
        }
    }

    draw_statistics (ctx, current_time) {
        ctx.fillStyle = "black";
        ctx.fillText(`Comparing : ${this.total_comparing}times`, 10, 30);
        ctx.fillText(`Array access : ${this.total_array_access}times`, 300, 30);
        ctx.fillText(`Elapsed time : ${(current_time / 1000).toFixed(3)}s`, width - 320, 30);
        ctx.fillText(`Array operation delay : ${sleep_time_ms}ms`, width - 320, 60);
    }
}

function generate_shuffled_array (N) {
    arr = [];
    arr.length = N;
    for (let i = 0; i < N; i++) {
        arr[i] = i;
    }

    for (let i = arr.length - 1; 0 <= i; i--) {
        let rand = Math.floor(Math.random() * (i + 1));
        let tmp = arr[i];
        arr[i] = arr[rand];
        arr[rand] = tmp;
    }

    return arr;
}

// The field 'elapsed_time' is required for all events.
const SORT_EVENT_TYPE = Object.freeze({
    ASSIGN : 0, // Field 'index', 'value' is required.
    ACCESS : 1, // Field 'index' is required
    COMPARE : 2,
});

// Returns events
function generate_sort_events (array) {
    const start_unix_time = Date.now();
    const events = [];
    let padding_magnification = 0;

    function assign (i, val) {
        events.push({
            type : SORT_EVENT_TYPE.ASSIGN,
            index : i,
            value : val,
            elapsed_time : Date.now() - start_unix_time,
            elapsed_time_padding : padding_magnification,
        });
        padding_magnification++;

        array[i] = val;
    }

    function get (i) {
        events.push({
            type : SORT_EVENT_TYPE.ACCESS,
            index : i,
            elapsed_time : Date.now() - start_unix_time,
            elapsed_time_padding : padding_magnification,
        });
        padding_magnification++;

        return array[i];
    }

    function swap (i, j) {
        const u = get(i);
        const v = get(j);
        assign(i, v);
        assign(j, u);
    }

    // Returns 'true' if arg1 is less than arg2
    function compare (arg1, arg2) {
        events.push({
            type : SORT_EVENT_TYPE.COMPARE,
            elapsed_time : (Date.now() - start_unix_time),
            elapsed_time_padding : padding_magnification,
        });
        padding_magnification++;

        return arg1 < arg2;
    }

    // ========== your sorting algorithm is here ==========

    // you can use assign(), get(), swap(), compare()

    function calc_pivot_idx (l, r) {
        return l + Math.floor(Math.random() * (r-l));
    }

    function quick_sort (l, r) { // [l, r)
        if (r - l <= 1) return;

        const piv_idx= calc_pivot_idx(l, r);
        const piv = get(piv_idx);
        swap(l, piv_idx);

        let i = l;
        let j = r; // closed interval

        while (true) {
            while (i < r) {
                i++;
                if (compare(piv, get(i))) break;
            }
            while (true) {
                j--;
                if (!compare(piv, get(j))) break;
            }

            if (i < j) {
                swap(i, j);
                continue;
            }
            break;
        }

        swap(l, i-1);
        quick_sort(l, i-1);
        quick_sort(i, r);
    }

    const tmp_arr = [];
    tmp_arr.length = array.length;

    function merge_sort (l, r) { // [l, r)
        if (r - l <= 1) return;
        const mid = Math.floor((l + r) / 2);
        merge_sort(l, mid);
        merge_sort(mid, r);

        for (let i = 0; i < mid - l; i++) tmp_arr[l + i] = get(l + i);
        for (let i = 0; i < r - mid; i++) tmp_arr[r-i-1] = get(mid + i);

        let left = l;
        let right = r-1;
        for (let i = 0; i < r-l; i++) {
            if (compare(tmp_arr[left], tmp_arr[right])) {
                assign(l+i, tmp_arr[left]);
                left++;
            }
            else {
                assign(l+i, tmp_arr[right]);
                right--;
            }
        }
    }

    function selection_sort () {
        for (let i = 0; i < array.length; i++) {
            let MIN = get(i);
            let MIN_idx = i;
            for (let j = i+1; j < array.length; j++) {
                const v = get(j);
                if (compare(v, MIN)) {
                    MIN = v;
                    MIN_idx = j;
                }
            }
            swap(i, MIN_idx);
        }
    }

    function bubble_sort () {
        for (let i = array.length-1; 0 <= i; i--) {
            for (let j = 0; j < i; j++) {
                if (compare(get(j+1), get(j))) swap(j, j+1);
            }
        }
    }

    const bucket_0 = [];
    const bucket_1 = [];

    bucket_0.length = array.length;
    bucket_1.length = array.length;

    function radix_sort (shift) {
        if (array.length < (1<<shift)) return;

        let idx_0 = 0;
        let idx_1 = 0;

        for (let i = 0; i < array.length; i++) {
            let v = get(i);
            if (0 < (v & (1<<shift))) {
                bucket_1[idx_1] = v;
                idx_1++;
            }
            else {
                bucket_0[idx_0] = v;
                idx_0++;
            }
        }

        let idx = 0;
        for (let i = 0; i < idx_0; i++) {
            assign(idx, bucket_0[i]);
            idx++;
        }
        for (let i = 0; i < idx_1; i++) {
            assign(idx, bucket_1[i]);
            idx++;
        }

        radix_sort(shift+1);
    }

    function heap_sort () {
        // max heap
        for (let i = 0; i < array.length; i++) {
            let j = i;
            while (0 < j) {
                if (compare(get(Math.floor((j-1)/2)), get(j))) {
                    swap(Math.floor((j-1)/2), j);
                    j = Math.floor((j-1)/2);
                }
                else {
                    break;
                }
            }
        }

        for (let back = array.length-1; 0 < back; back--) {
            swap(0, back);
            let i = 0;
            while (true) {
                let next = 2*i+1;
                if (back <= next) break;

                if (next+1 < back && compare(get(next), get(next+1))) next = next + 1;
                if (compare(get(i), get(next))) {
                    swap(i, next);
                    i = next;
                }
                else {
                    break;
                }
            }
        }
    }

    // quick_sort(0, array.length);
    // merge_sort(0, array.length);
    selection_sort();
    // bubble_sort();
    // radix_sort(0);
    // heap_sort();

    // ====================================================

    return events;
}
