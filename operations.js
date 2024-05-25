function quick_sort (monitored_array) {
    const N = monitored_array.length;
    internal_quick_sort(0, N);

    function internal_quick_sort (l, r) {
        if (r - l <= 1) return;

        const pivot = monitored_array.access(l + Math.floor(Math.random() * (r - l)));
        let left = l, right = r;
        for (let i = l; i < r; i++) {
            const u = monitored_array.access(i);

            if (monitored_array.compare(u, pivot)) {
                monitored_array.swap(i, left);
                left++;
            }
        }

        for (let i = r - 1; l <= i; i--) {
            const u = monitored_array.access(i);

            if (monitored_array.compare(pivot, u)) {
                right--;
                monitored_array.swap(i, right);
            }
        }

        internal_quick_sort(l, left);
        internal_quick_sort(right, r);
    }
}

function merge_sort (monitored_array) {
    const N = monitored_array.length;
    const sub = new Array(N);
    internal_merge_sort(0, N);

    function internal_merge_sort (l, r) {
        if (r - l <= 1) return;
        const mid = Math.floor((l + r) / 2);
        internal_merge_sort(l, mid);
        internal_merge_sort(mid, r);

        for (let i = 0; i < mid - l; i++) {
            sub[l + i] = monitored_array.access(l + i);
        }
        for (let i = 0; i < r - mid; i++) {
            sub[r - i - 1] = monitored_array.access(mid + i);
        }

        const width = r - l;
        let left = l, right = r - 1;
        for (let i = 0; i < width; i++) {
            if (monitored_array.compare(sub[left], sub[right])) {
                monitored_array.assign(l + i, sub[left]);
                left++;
            }
            else {
                monitored_array.assign(l + i, sub[right]);
                right--;
            }
        }
    }
}

function msb_radix_sort (monitored_array) {
    const N = monitored_array.length;
    const s = Math.floor(Math.log2(N));
    internal_msb_radix_sort(0, N, Math.floor(Math.log2(N)));

    function internal_msb_radix_sort (l, r, shift) {
        if (r - l <= 1) return;
        if (shift < 0) return;

        let left = l;
        for (let i = l; i < r; i++) {
            const u = monitored_array.access(i);
            if (monitored_array.compare((u & (1 << shift)), 1 << shift)) {
                monitored_array.swap(left, i);
                left++;
            }
        }
        internal_msb_radix_sort(l, left, shift - 1);
        internal_msb_radix_sort(left, r, shift - 1);
    }
}

function selection_sort (monitored_array) {
    const N = monitored_array.length;

    for (let i = 0; i < N; i++) {
        let min_idx = -1;
        let min_val = (1 << 61);

        for (let j = i; j < N; j++) {
            const v = monitored_array.access(j);
            if (monitored_array.compare(v, min_val)) {
                min_val = v;
                min_idx = j;
            }
        }

        monitored_array.swap(i, min_idx);
    }
}

function bubble_sort (monitored_array) {
    const N = monitored_array.length;

    for (let i = N - 1; 0 <= i; i--) {
        for (let j = i; j < N - 1; j++) {
            const u = monitored_array.access(j);
            const v = monitored_array.access(j + 1);
            if (monitored_array.compare(v, u)) monitored_array.swap(j, j + 1);
        }
    }
}
