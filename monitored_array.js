class MonitoredArray {
    current_array;
    original_array;
    length;
    operations = Array(0);
    latest_operation_index = 0;

    assign (i, val) {
        this.operations.push({
            type: OPERATION_TYPE.ASSIGN,
            index: i,
            value: val,
            color: OPERATION_COLOR.ASSIGN,
        });
        this.current_array[i] = val;
    }

    access (i) {
        this.operations.push({
            type: OPERATION_TYPE.ACCESS,
            index: i,
            value: undefined,
            color: OPERATION_COLOR.ACCESS,
        });
        return this.current_array[i];
    }

    swap (i, j) {
        const u = this.access(i);
        const v = this.access(j);
        this.assign(i, v);
        this.assign(j, u);
    }

    compare (arg1, arg2) {
        this.operations.push({
            type: OPERATION_TYPE.COMPARISON,
            index: undefined,
            value: undefined,
            color: undefined,
        });
        return arg1 < arg2;
    }

    get_latest_operation () {
        if (this.operations.length <= this.latest_operation_index) return undefined;
        return this.operations[this.latest_operation_index++];
    }

    init (len, allow_duplication) {
        this.length = len;

        { // 配列生成
            this.current_array = new Array(this.length);
            if (allow_duplication) {
                for (let i = 0; i < this.length; i++) this.current_array[i] = Math.floor(Math.random() * this.length) + 1;
            }
            else {
                for (let i = 0; i < this.length; i++) this.current_array[i] = i + 1;
            }
        }

        { // シャッフル
            for (let i = this.length - 1; 0 <= i; i--) {
                let rand = Math.floor(Math.random() * (i + 1))
                // 配列の要素の順番を入れ替える
                const tmp = this.current_array[i]
                this.current_array[i] = this.current_array[rand]
                this.current_array[rand] = tmp;
            }
        }

        this.original_array = this.current_array.slice();
    }
}

const OPERATION_TYPE = Object.freeze({
    ASSIGN: 0,
    ACCESS: 1,
    COMPARISON: 2,
});

const OPERATION_COLOR= Object.freeze({
    DEFAULT: "gray",
    ASSIGN: "red",
    ACCESS: "blue",
});

