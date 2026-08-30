(function () {
    "use strict";

    document
        .querySelectorAll("[data-toggle-target]")
        .forEach(function (button) {
            const target = document.getElementById(
                button.dataset.toggleTarget
            );

            if (!target) {
                return;
            }

            target.hidden = true;
            button.dataset.originalLabel =
                button.textContent.trim();

            button.setAttribute(
                "aria-expanded",
                "false"
            );

            button.setAttribute(
                "aria-controls",
                target.id
            );
        });

    document.addEventListener(
        "click",
        function (event) {
            const button = event.target.closest
                ? event.target.closest(
                    "[data-toggle-target]"
                )
                : null;

            if (!button) {
                return;
            }

            const target = document.getElementById(
                button.dataset.toggleTarget
            );

            if (!target) {
                return;
            }

            const open = target.hidden;

            target.hidden = !open;

            button.setAttribute(
                "aria-expanded",
                String(open)
            );

            button.textContent = open
                ? (
                    target.classList.contains(
                        "ads-hint-box"
                    )
                        ? "Hide Hint"
                        : "Hide Answer"
                )
                : button.dataset.originalLabel;
        }
    );

    const definitions = {
        kth: {
            label: "Kth Largest Stream",
            codeKey: "kth",
            dataLabel: "Stream Values",
            auxLabel: "K",
            data: "4, 5, 8, 2, 10, 9",
            aux: "3"
        },
        median: {
            label: "Running Median",
            codeKey: "median",
            dataLabel: "Stream Values",
            auxLabel: "Optional",
            data: "5, 15, 1, 3, 8, 7",
            aux: "—"
        },
        lru: {
            label: "LRU Cache",
            codeKey: "lru",
            dataLabel: "Operations",
            auxLabel: "Capacity",
            data:
                "put:1:10, put:2:20, get:1, " +
                "put:3:30, get:2, put:4:40, get:1",
            aux: "2"
        },
        merge: {
            label: "Merge K Sorted Arrays",
            codeKey: "merge",
            dataLabel: "Sorted Arrays (use |)",
            auxLabel: "Optional",
            data:
                "1 4 7 | 2 5 8 | 3 6 9",
            aux: "—"
        },
        range: {
            label: "Range Minimum Query",
            codeKey: "range",
            dataLabel: "Array Values",
            auxLabel: "Left:Right",
            data: "5, 2, 6, 3, 1, 7, 4",
            aux: "1:5"
        },
        dsu: {
            label: "Dynamic Connectivity",
            codeKey: "dsu",
            dataLabel: "Union Edges",
            auxLabel: "Connectivity Query",
            data:
                "A-B, C-D, B-C, E-F, D-E",
            aux: "A:F"
        },
        topk: {
            label: "Top K Frequent",
            codeKey: "topk",
            dataLabel: "Values",
            auxLabel: "K",
            data:
                "1, 1, 1, 2, 2, 3, 3, 3, 3, 4",
            aux: "2"
        },
        ladder: {
            label: "Word Ladder",
            codeKey: "ladder",
            dataLabel: "Dictionary",
            auxLabel: "Start:Target",
            data:
                "hot, dot, dog, lot, log, cog",
            aux: "hit:cog"
        }
    };

    function numberList(
        text,
        minimum,
        maximum
    ) {
        const values = text
            .trim()
            .split(/[\s,]+/)
            .filter(Boolean)
            .map(Number);

        if (
            values.length < minimum ||
            values.length > maximum ||
            values.some(function (value) {
                return (
                    !Number.isSafeInteger(value) ||
                    Math.abs(value) > 9999
                );
            })
        ) {
            throw new Error(
                "Enter " +
                minimum +
                " to " +
                maximum +
                " integer values."
            );
        }

        return values;
    }

    function positiveInteger(
        text,
        label,
        maximum
    ) {
        const value = Number(text.trim());

        if (
            !Number.isInteger(value) ||
            value < 1 ||
            value > maximum
        ) {
            throw new Error(
                label +
                " must be an integer from 1 to " +
                maximum +
                "."
            );
        }

        return value;
    }

    function parseInput(
        algorithm,
        dataInput,
        auxInput
    ) {
        const dataText =
            dataInput.value.trim();

        const auxText =
            auxInput.value.trim();

        let parsed;

        if (
            algorithm === "kth" ||
            algorithm === "topk"
        ) {
            const values =
                numberList(dataText, 2, 25);

            const k = positiveInteger(
                auxText,
                "K",
                values.length
            );

            parsed = {
                values: values,
                k: k
            };

            dataInput.value =
                values.join(", ");

            auxInput.value =
                String(k);
        } else if (algorithm === "median") {
            const values =
                numberList(dataText, 2, 25);

            parsed = {
                values: values
            };

            dataInput.value =
                values.join(", ");

            auxInput.value = "—";
        } else if (algorithm === "lru") {
            const operations = dataText
                .split(/\s*,\s*/)
                .filter(Boolean)
                .map(function (part) {
                    const getMatch = part.match(
                        /^get\s*:\s*(-?\d+)$/i
                    );

                    const putMatch = part.match(
                        /^put\s*:\s*(-?\d+)\s*:\s*(-?\d+)$/i
                    );

                    if (getMatch) {
                        return {
                            type: "get",
                            key: Number(getMatch[1])
                        };
                    }

                    if (putMatch) {
                        return {
                            type: "put",
                            key: Number(putMatch[1]),
                            value: Number(
                                putMatch[2]
                            )
                        };
                    }

                    throw new Error(
                        "Use put:key:value or get:key " +
                        "operations separated by commas."
                    );
                });

            if (
                operations.length < 2 ||
                operations.length > 20
            ) {
                throw new Error(
                    "Enter 2 to 20 cache operations."
                );
            }

            const capacity = positiveInteger(
                auxText,
                "Capacity",
                8
            );

            parsed = {
                operations: operations,
                capacity: capacity
            };

            dataInput.value =
                operations.map(function (operation) {
                    return operation.type === "get"
                        ? "get:" + operation.key
                        : (
                            "put:" +
                            operation.key +
                            ":" +
                            operation.value
                        );
                }).join(", ");

            auxInput.value =
                String(capacity);
        } else if (algorithm === "merge") {
            const arrays = dataText
                .split("|")
                .map(function (part) {
                    return numberList(
                        part,
                        1,
                        10
                    );
                });

            if (
                arrays.length < 2 ||
                arrays.length > 6
            ) {
                throw new Error(
                    "Enter 2 to 6 sorted arrays " +
                    "separated by |."
                );
            }

            arrays.forEach(function (array) {
                for (
                    let index = 1;
                    index < array.length;
                    index += 1
                ) {
                    if (
                        array[index] <
                        array[index - 1]
                    ) {
                        throw new Error(
                            "Every source array must " +
                            "already be sorted."
                        );
                    }
                }
            });

            parsed = {
                arrays: arrays
            };

            dataInput.value =
                arrays.map(function (array) {
                    return array.join(" ");
                }).join(" | ");

            auxInput.value = "—";
        } else if (algorithm === "range") {
            const values =
                numberList(dataText, 2, 16);

            const match = auxText.match(
                /^(\d+)\s*:\s*(\d+)$/
            );

            if (!match) {
                throw new Error(
                    "Enter the range as left:right, " +
                    "for example 1:5."
                );
            }

            const left = Number(match[1]);
            const right = Number(match[2]);

            if (
                left > right ||
                right >= values.length
            ) {
                throw new Error(
                    "The query range must stay " +
                    "inside array indexes 0 to " +
                    (values.length - 1) +
                    "."
                );
            }

            parsed = {
                values: values,
                left: left,
                right: right
            };

            dataInput.value =
                values.join(", ");

            auxInput.value =
                left + ":" + right;
        } else if (algorithm === "dsu") {
            const edges = dataText
                .split(/\s*,\s*/)
                .filter(Boolean)
                .map(function (part) {
                    const match = part.match(
                        /^([A-Ha-h])-([A-Ha-h])$/
                    );

                    if (
                        !match ||
                        match[1].toUpperCase() ===
                            match[2].toUpperCase()
                    ) {
                        throw new Error(
                            "Use different vertices " +
                            "in A-B edge format."
                        );
                    }

                    return [
                        match[1].toUpperCase(),
                        match[2].toUpperCase()
                    ];
                });

            if (
                edges.length < 1 ||
                edges.length > 15
            ) {
                throw new Error(
                    "Enter 1 to 15 union edges."
                );
            }

            const query = auxText.match(
                /^([A-Ha-h])\s*:\s*([A-Ha-h])$/
            );

            if (!query) {
                throw new Error(
                    "Enter the connectivity " +
                    "query as A:F."
                );
            }

            const first =
                query[1].toUpperCase();

            const second =
                query[2].toUpperCase();

            const vertices =
                new Set([first, second]);

            edges.forEach(function (edge) {
                vertices.add(edge[0]);
                vertices.add(edge[1]);
            });

            parsed = {
                edges: edges,
                first: first,
                second: second,
                vertices:
                    Array.from(vertices).sort()
            };

            dataInput.value =
                edges.map(function (edge) {
                    return edge.join("-");
                }).join(", ");

            auxInput.value =
                first + ":" + second;
        } else {
            const words = dataText
                .toLowerCase()
                .split(/[\s,]+/)
                .filter(Boolean);

            const pair = auxText
                .toLowerCase()
                .match(
                    /^([a-z]+)\s*:\s*([a-z]+)$/
                );

            if (
                words.length < 2 ||
                words.length > 20 ||
                words.some(function (word) {
                    return !/^[a-z]{2,8}$/.test(
                        word
                    );
                }) ||
                !pair
            ) {
                throw new Error(
                    "Enter 2 to 20 lowercase words " +
                    "and a start:target pair."
                );
            }

            const start = pair[1];
            const target = pair[2];
            const length = start.length;

            if (
                target.length !== length ||
                words.some(function (word) {
                    return word.length !== length;
                }) ||
                words.indexOf(target) === -1
            ) {
                throw new Error(
                    "All words must have equal length " +
                    "and the target must be in the " +
                    "dictionary."
                );
            }

            parsed = {
                words:
                    Array.from(new Set(words)),
                start: start,
                target: target
            };

            dataInput.value =
                parsed.words.join(", ");

            auxInput.value =
                start + ":" + target;
        }

        return parsed;
    }

    function cloneItems(items) {
        return (items || []).map(
            function (item) {
                return Object.assign({}, item);
            }
        );
    }

    function makeStep(
        phase,
        message,
        needle,
        data
    ) {
        const details = data || {};

        return {
            phase: phase,
            message: message,
            needle: needle,
            items: cloneItems(details.items),
            state:
                Object.assign(
                    {},
                    details.state || {}
                ),
            current:
                details.current === undefined
                    ? "—"
                    : details.current,
            comparisons:
                details.comparisons || 0,
            updates:
                details.updates || 0,
            result:
                details.result || "—",
            complete:
                Boolean(details.complete)
        };
    }

    function valueItems(
        values,
        prefix,
        active
    ) {
        return values.map(
            function (value, index) {
                return {
                    label: prefix + index,
                    value:
                        typeof value === "object"
                            ? value.value
                            : value,
                    status:
                        index === active
                            ? "active"
                            : "normal"
                };
            }
        );
    }

    function buildKth(input) {
        const steps = [];
        const heap = [];

        let comparisons = 0;
        let updates = 0;

        steps.push(makeStep(
            "Initialize",
            "Create an empty min-heap with " +
            "capacity " + input.k + ".",
            "/* kth initialize */",
            {
                items: [],
                state: {
                    Capacity: input.k
                }
            }
        ));

        input.values.forEach(
            function (value, streamIndex) {
                steps.push(makeStep(
                    "Stream Loop",
                    "Process stream position " +
                    streamIndex + ".",
                    "/* kth loop */",
                    {
                        items:
                            valueItems(
                                heap,
                                "H",
                                -1
                            ),
                        current: streamIndex,
                        comparisons: comparisons,
                        updates: updates
                    }
                ));

                steps.push(makeStep(
                    "Read Value",
                    "Read value " + value + ".",
                    "/* kth read */",
                    {
                        items:
                            valueItems(
                                heap,
                                "H",
                                -1
                            ),
                        current: value,
                        comparisons: comparisons,
                        updates: updates
                    }
                ));

                if (heap.length < input.k) {
                    heap.push(value);

                    heap.sort(
                        function (first, second) {
                            return first - second;
                        }
                    );

                    updates += 1;

                    steps.push(makeStep(
                        "Heap Insert",
                        "Insert " + value +
                        " because the heap has " +
                        "fewer than k values.",
                        "/* kth insert */",
                        {
                            items:
                                valueItems(
                                    heap,
                                    "H",
                                    heap.indexOf(value)
                                ),
                            current: value,
                            comparisons:
                                comparisons,
                            updates: updates,
                            state: {
                                Root: heap[0],
                                Size: heap.length
                            }
                        }
                    ));
                } else {
                    comparisons += 1;

                    steps.push(makeStep(
                        "Compare Root",
                        "Compare " + value +
                        " with heap root " +
                        heap[0] + ".",
                        "/* kth compare */",
                        {
                            items:
                                valueItems(
                                    heap,
                                    "H",
                                    0
                                ),
                            current: value,
                            comparisons:
                                comparisons,
                            updates: updates
                        }
                    ));

                    if (value > heap[0]) {
                        heap[0] = value;

                        heap.sort(
                            function (
                                first,
                                second
                            ) {
                                return (
                                    first -
                                    second
                                );
                            }
                        );

                        updates += 1;

                        steps.push(makeStep(
                            "Replace Root",
                            "Replace the old root " +
                            "and restore min-heap " +
                            "order.",
                            "/* kth replace */",
                            {
                                items:
                                    valueItems(
                                        heap,
                                        "H",
                                        heap.indexOf(
                                            value
                                        )
                                    ),
                                current: value,
                                comparisons:
                                    comparisons,
                                updates: updates,
                                state: {
                                    Root: heap[0]
                                }
                            }
                        ));
                    }
                }
            }
        );

        steps.push(makeStep(
            "Complete",
            "The heap root is the kth " +
            "largest stream value.",
            "/* kth result */",
            {
                items:
                    valueItems(
                        heap,
                        "H",
                        0
                    ),
                current: heap[0],
                comparisons: comparisons,
                updates: updates,
                result:
                    "Kth largest (k = " +
                    input.k +
                    ") = " +
                    heap[0],
                complete: true
            }
        ));

        return steps;
    }

    function medianItems(lower, upper) {
        return lower.map(
            function (value, index) {
                return {
                    label: "Lower " + index,
                    value: value,
                    status:
                        index === 0
                            ? "selected"
                            : "normal"
                };
            }
        ).concat(
            upper.map(
                function (value, index) {
                    return {
                        label: "Upper " + index,
                        value: value,
                        status:
                            index === 0
                                ? "selected"
                                : "normal"
                    };
                }
            )
        );
    }

    function buildMedian(input) {
        const steps = [];
        const lower = [];
        const upper = [];
        const medians = [];

        let comparisons = 0;
        let updates = 0;

        steps.push(makeStep(
            "Initialize",
            "Create an empty max-side " +
            "and min-side heap.",
            "/* median initialize */",
            {
                state: {
                    Lower: 0,
                    Upper: 0
                }
            }
        ));

        input.values.forEach(
            function (value, index) {
                steps.push(makeStep(
                    "Stream Loop",
                    "Process value " +
                    (index + 1) +
                    " of " +
                    input.values.length +
                    ".",
                    "/* median loop */",
                    {
                        items:
                            medianItems(
                                lower,
                                upper
                            ),
                        current: index,
                        comparisons:
                            comparisons,
                        updates: updates
                    }
                ));

                steps.push(makeStep(
                    "Read Value",
                    "Read " + value +
                    " from the stream.",
                    "/* median read */",
                    {
                        items:
                            medianItems(
                                lower,
                                upper
                            ),
                        current: value,
                        comparisons:
                            comparisons,
                        updates: updates
                    }
                ));

                comparisons +=
                    lower.length ? 1 : 0;

                if (
                    !lower.length ||
                    value <= lower[0]
                ) {
                    lower.push(value);

                    lower.sort(
                        function (
                            first,
                            second
                        ) {
                            return (
                                second -
                                first
                            );
                        }
                    );

                    updates += 1;

                    steps.push(makeStep(
                        "Add Lower",
                        "Insert " + value +
                        " into the lower " +
                        "max-side.",
                        "/* median add lower */",
                        {
                            items:
                                medianItems(
                                    lower,
                                    upper
                                ),
                            current: value,
                            comparisons:
                                comparisons,
                            updates: updates
                        }
                    ));
                } else {
                    upper.push(value);

                    upper.sort(
                        function (
                            first,
                            second
                        ) {
                            return (
                                first -
                                second
                            );
                        }
                    );

                    updates += 1;

                    steps.push(makeStep(
                        "Add Upper",
                        "Insert " + value +
                        " into the upper " +
                        "min-side.",
                        "/* median add upper */",
                        {
                            items:
                                medianItems(
                                    lower,
                                    upper
                                ),
                            current: value,
                            comparisons:
                                comparisons,
                            updates: updates
                        }
                    ));
                }

                if (
                    lower.length >
                    upper.length + 1
                ) {
                    upper.push(lower.shift());

                    upper.sort(
                        function (
                            first,
                            second
                        ) {
                            return (
                                first -
                                second
                            );
                        }
                    );

                    updates += 1;
                } else if (
                    upper.length >
                    lower.length + 1
                ) {
                    lower.push(upper.shift());

                    lower.sort(
                        function (
                            first,
                            second
                        ) {
                            return (
                                second -
                                first
                            );
                        }
                    );

                    updates += 1;
                }

                steps.push(makeStep(
                    "Balance",
                    "Keep the two heap sizes " +
                    "within one.",
                    "/* median balance */",
                    {
                        items:
                            medianItems(
                                lower,
                                upper
                            ),
                        current: value,
                        comparisons:
                            comparisons,
                        updates: updates,
                        state: {
                            Lower:
                                lower.length,
                            Upper:
                                upper.length
                        }
                    }
                ));

                const median =
                    lower.length ===
                    upper.length
                        ? (
                            lower[0] +
                            upper[0]
                        ) / 2
                        : (
                            lower.length >
                            upper.length
                                ? lower[0]
                                : upper[0]
                        );

                medians.push(median);

                steps.push(makeStep(
                    "Calculate Median",
                    "The running median is " +
                    median + ".",
                    "/* median calculate */",
                    {
                        items:
                            medianItems(
                                lower,
                                upper
                            ),
                        current: value,
                        comparisons:
                            comparisons,
                        updates: updates,
                        result: String(median)
                    }
                ));
            }
        );

        steps.push(makeStep(
            "Complete",
            "All running medians have " +
            "been produced.",
            "/* median output */",
            {
                items:
                    medianItems(
                        lower,
                        upper
                    ),
                comparisons: comparisons,
                updates: updates,
                result: medians.join(", "),
                complete: true
            }
        ));

        return steps;
    }

    function cacheItems(
        order,
        activeKey
    ) {
        return order.map(
            function (entry, index) {
                return {
                    label:
                        index === 0
                            ? "MRU"
                            : (
                                index ===
                                order.length - 1
                                    ? "LRU"
                                    : "Cache " +
                                        index
                            ),
                    value:
                        entry.key +
                        " → " +
                        entry.value,
                    status:
                        entry.key === activeKey
                            ? "active"
                            : "normal"
                };
            }
        );
    }

    function buildLru(input) {
        const steps = [];
        const order = [];
        const outputs = [];

        let comparisons = 0;
        let updates = 0;

        steps.push(makeStep(
            "Initialize",
            "Create an empty cache with " +
            "capacity " +
            input.capacity +
            ".",
            "/* lru initialize */",
            {
                state: {
                    Capacity:
                        input.capacity
                }
            }
        ));

        input.operations.forEach(
            function (operation) {
                const position =
                    order.findIndex(
                        function (entry) {
                            comparisons += 1;

                            return (
                                entry.key ===
                                operation.key
                            );
                        }
                    );

                if (operation.type === "get") {
                    steps.push(makeStep(
                        "GET",
                        "Look up key " +
                        operation.key +
                        ".",
                        "/* lru get */",
                        {
                            items:
                                cacheItems(
                                    order,
                                    operation.key
                                ),
                            current:
                                "get:" +
                                operation.key,
                            comparisons:
                                comparisons,
                            updates: updates
                        }
                    ));

                    if (position === -1) {
                        outputs.push(
                            "get(" +
                            operation.key +
                            ")=-1"
                        );

                        steps.push(makeStep(
                            "Cache Miss",
                            "Key " +
                            operation.key +
                            " is absent.",
                            "/* lru miss */",
                            {
                                items:
                                    cacheItems(
                                        order,
                                        null
                                    ),
                                current:
                                    operation.key,
                                comparisons:
                                    comparisons,
                                updates: updates,
                                result: "-1"
                            }
                        ));
                    } else {
                        const entry =
                            order.splice(
                                position,
                                1
                            )[0];

                        order.unshift(entry);
                        updates += 1;

                        outputs.push(
                            "get(" +
                            operation.key +
                            ")=" +
                            entry.value
                        );

                        steps.push(makeStep(
                            "Move to Front",
                            "Key " +
                            operation.key +
                            " becomes most " +
                            "recently used.",
                            "/* lru move */",
                            {
                                items:
                                    cacheItems(
                                        order,
                                        operation.key
                                    ),
                                current:
                                    operation.key,
                                comparisons:
                                    comparisons,
                                updates: updates,
                                result:
                                    String(
                                        entry.value
                                    )
                            }
                        ));
                    }
                } else {
                    steps.push(makeStep(
                        "PUT",
                        "Store key " +
                        operation.key +
                        " with value " +
                        operation.value +
                        ".",
                        "/* lru put */",
                        {
                            items:
                                cacheItems(
                                    order,
                                    operation.key
                                ),
                            current:
                                "put:" +
                                operation.key,
                            comparisons:
                                comparisons,
                            updates: updates
                        }
                    ));

                    if (position !== -1) {
                        const entry =
                            order.splice(
                                position,
                                1
                            )[0];

                        entry.value =
                            operation.value;

                        order.unshift(entry);
                        updates += 1;

                        steps.push(makeStep(
                            "Update Entry",
                            "Update the value and " +
                            "move the key to the " +
                            "front.",
                            "/* lru update */",
                            {
                                items:
                                    cacheItems(
                                        order,
                                        operation.key
                                    ),
                                current:
                                    operation.key,
                                comparisons:
                                    comparisons,
                                updates: updates
                            }
                        ));
                    } else {
                        if (
                            order.length ===
                            input.capacity
                        ) {
                            const evicted =
                                order.pop();

                            updates += 1;

                            steps.push(makeStep(
                                "Evict LRU",
                                "Evict least recently " +
                                "used key " +
                                evicted.key +
                                ".",
                                "/* lru evict */",
                                {
                                    items:
                                        cacheItems(
                                            order,
                                            null
                                        ),
                                    current:
                                        evicted.key,
                                    comparisons:
                                        comparisons,
                                    updates: updates
                                }
                            ));
                        }

                        order.unshift({
                            key: operation.key,
                            value:
                                operation.value
                        });

                        updates += 1;

                        steps.push(makeStep(
                            "Insert Entry",
                            "Insert the new entry " +
                            "at the most-recent " +
                            "position.",
                            "/* lru insert */",
                            {
                                items:
                                    cacheItems(
                                        order,
                                        operation.key
                                    ),
                                current:
                                    operation.key,
                                comparisons:
                                    comparisons,
                                updates: updates
                            }
                        ));
                    }
                }
            }
        );

        steps.push(makeStep(
            "Complete",
            "All cache operations are complete.",
            "/* lru output */",
            {
                items:
                    cacheItems(order, null),
                comparisons: comparisons,
                updates: updates,
                result:
                    outputs.length
                        ? outputs.join(", ")
                        : "Cache updated",
                complete: true
            }
        ));

        return steps;
    }

    function mergeItems(heap) {
        return heap.map(
            function (item, index) {
                return {
                    label:
                        "A" +
                        item.array +
                        "[" +
                        item.index +
                        "]",
                    value: item.value,
                    status:
                        index === 0
                            ? "selected"
                            : "normal"
                };
            }
        );
    }

    function buildMerge(input) {
        const steps = [];
        const heap = [];
        const output = [];

        let comparisons = 0;
        let updates = 0;

        steps.push(makeStep(
            "Initialize",
            "Create an empty min-heap " +
            "for source heads.",
            "/* merge initialize */",
            {
                state: {
                    Sources:
                        input.arrays.length
                }
            }
        ));

        input.arrays.forEach(
            function (array, arrayIndex) {
                steps.push(makeStep(
                    "Seed Loop",
                    "Read the first value from " +
                    "source array " +
                    arrayIndex +
                    ".",
                    "/* merge seed loop */",
                    {
                        items:
                            mergeItems(heap),
                        current:
                            "Array " +
                            arrayIndex,
                        comparisons:
                            comparisons,
                        updates: updates
                    }
                ));

                heap.push({
                    value: array[0],
                    array: arrayIndex,
                    index: 0
                });

                heap.sort(
                    function (first, second) {
                        return (
                            first.value -
                            second.value
                        );
                    }
                );

                updates += 1;

                steps.push(makeStep(
                    "Seed Heap",
                    "Insert " +
                    array[0] +
                    " from array " +
                    arrayIndex +
                    ".",
                    "/* merge seed */",
                    {
                        items:
                            mergeItems(heap),
                        current: array[0],
                        comparisons:
                            comparisons,
                        updates: updates
                    }
                ));
            }
        );

        while (heap.length) {
            steps.push(makeStep(
                "Heap Loop",
                "Extract the smallest " +
                "available source head.",
                "/* merge loop */",
                {
                    items: mergeItems(heap),
                    current: heap[0].value,
                    comparisons:
                        comparisons,
                    updates: updates
                }
            ));

            const smallest =
                heap.shift();

            updates += 1;

            steps.push(makeStep(
                "Pop Minimum",
                "Remove " +
                smallest.value +
                " from the heap.",
                "/* merge pop */",
                {
                    items: mergeItems(heap),
                    current:
                        smallest.value,
                    comparisons:
                        comparisons,
                    updates: updates
                }
            ));

            output.push(smallest.value);

            steps.push(makeStep(
                "Append Output",
                "Append " +
                smallest.value +
                " to the merged output.",
                "/* merge output */",
                {
                    items:
                        valueItems(
                            output,
                            "O",
                            output.length - 1
                        ),
                    current:
                        smallest.value,
                    comparisons:
                        comparisons,
                    updates: updates,
                    result:
                        output.join(", ")
                }
            ));

            const nextIndex =
                smallest.index + 1;

            if (
                nextIndex <
                input.arrays[
                    smallest.array
                ].length
            ) {
                const next =
                    input.arrays[
                        smallest.array
                    ][nextIndex];

                heap.push({
                    value: next,
                    array:
                        smallest.array,
                    index: nextIndex
                });

                heap.sort(
                    function (
                        first,
                        second
                    ) {
                        return (
                            first.value -
                            second.value
                        );
                    }
                );

                updates += 1;

                steps.push(makeStep(
                    "Advance Source",
                    "Insert next value " +
                    next +
                    " from source array " +
                    smallest.array +
                    ".",
                    "/* merge advance */",
                    {
                        items:
                            mergeItems(heap),
                        current: next,
                        comparisons:
                            comparisons,
                        updates: updates,
                        result:
                            output.join(", ")
                    }
                ));
            }
        }

        steps.push(makeStep(
            "Complete",
            "All source arrays are merged.",
            "/* merge output */",
            {
                items:
                    valueItems(
                        output,
                        "O",
                        -1
                    ),
                comparisons: comparisons,
                updates: updates,
                result: output.join(", "),
                complete: true
            }
        ));

        return steps;
    }

    function buildRange(input) {
        const steps = [];
        const tree = {};
        const intervals = {};

        let comparisons = 0;
        let updates = 0;

        function items(active) {
            return Object.keys(tree)
                .sort(function (first, second) {
                    return (
                        Number(first) -
                        Number(second)
                    );
                })
                .map(function (key) {
                    return {
                        label:
                            "T" +
                            key +
                            " " +
                            intervals[key],
                        value: tree[key],
                        status:
                            String(active) === key
                                ? "active"
                                : "normal"
                    };
                });
        }

        function build(
            node,
            left,
            right
        ) {
            steps.push(makeStep(
                "Build Call",
                "Build segment [" +
                left +
                ", " +
                right +
                "].",
                "/* range build call */",
                {
                    items: items(node),
                    current:
                        left + ":" + right,
                    comparisons:
                        comparisons,
                    updates: updates
                }
            ));

            intervals[node] =
                "[" +
                left +
                "," +
                right +
                "]";

            if (left === right) {
                tree[node] =
                    input.values[left];

                updates += 1;

                steps.push(makeStep(
                    "Build Leaf",
                    "Store array value " +
                    input.values[left] +
                    " at this leaf.",
                    "/* range build leaf */",
                    {
                        items: items(node),
                        current: left,
                        comparisons:
                            comparisons,
                        updates: updates
                    }
                ));

                return;
            }

            const middle = Math.floor(
                (left + right) / 2
            );

            steps.push(makeStep(
                "Split Segment",
                "Split at middle index " +
                middle +
                ".",
                "/* range split */",
                {
                    items: items(node),
                    current: middle,
                    comparisons:
                        comparisons,
                    updates: updates
                }
            ));

            build(
                node * 2,
                left,
                middle
            );

            build(
                node * 2 + 1,
                middle + 1,
                right
            );

            tree[node] = Math.min(
                tree[node * 2],
                tree[node * 2 + 1]
            );

            updates += 1;

            steps.push(makeStep(
                "Combine Minimum",
                "Store minimum " +
                tree[node] +
                " for segment " +
                intervals[node] +
                ".",
                "/* range combine */",
                {
                    items: items(node),
                    current: tree[node],
                    comparisons:
                        comparisons,
                    updates: updates
                }
            ));
        }

        function query(
            node,
            left,
            right
        ) {
            steps.push(makeStep(
                "Query Call",
                "Visit segment [" +
                left +
                ", " +
                right +
                "].",
                "/* range query call */",
                {
                    items: items(node),
                    current:
                        left + ":" + right,
                    comparisons:
                        comparisons,
                    updates: updates
                }
            ));

            comparisons += 1;

            if (
                input.right < left ||
                right < input.left
            ) {
                steps.push(makeStep(
                    "No Overlap",
                    "This segment does not " +
                    "overlap the query.",
                    "/* range no overlap */",
                    {
                        items: items(node),
                        current:
                            intervals[node],
                        comparisons:
                            comparisons,
                        updates: updates
                    }
                ));

                return Infinity;
            }

            if (
                input.left <= left &&
                right <= input.right
            ) {
                steps.push(makeStep(
                    "Total Overlap",
                    "Use stored minimum " +
                    tree[node] +
                    ".",
                    "/* range total overlap */",
                    {
                        items: items(node),
                        current: tree[node],
                        comparisons:
                            comparisons,
                        updates: updates
                    }
                ));

                return tree[node];
            }

            const middle = Math.floor(
                (left + right) / 2
            );

            steps.push(makeStep(
                "Query Split",
                "Partially covered segment: " +
                "query both children.",
                "/* range query split */",
                {
                    items: items(node),
                    current: middle,
                    comparisons:
                        comparisons,
                    updates: updates
                }
            ));

            const first = query(
                node * 2,
                left,
                middle
            );

            const second = query(
                node * 2 + 1,
                middle + 1,
                right
            );

            const result = Math.min(
                first,
                second
            );

            steps.push(makeStep(
                "Query Combine",
                "Combine child answers to " +
                "obtain " +
                result +
                ".",
                "/* range query combine */",
                {
                    items: items(node),
                    current: result,
                    comparisons:
                        comparisons,
                    updates: updates
                }
            ));

            return result;
        }

        build(
            1,
            0,
            input.values.length - 1
        );

        const result = query(
            1,
            0,
            input.values.length - 1
        );

        steps.push(makeStep(
            "Complete",
            "The minimum in range [" +
            input.left +
            ", " +
            input.right +
            "] is " +
            result +
            ".",
            "/* range output */",
            {
                items: items(1),
                current: result,
                comparisons: comparisons,
                updates: updates,
                result:
                    "Minimum = " + result,
                complete: true
            }
        ));

        return steps;
    }

    function buildDsu(input) {
        const steps = [];
        const parent = {};
        const rank = {};

        let comparisons = 0;
        let updates = 0;

        input.vertices.forEach(
            function (vertex) {
                parent[vertex] = vertex;
                rank[vertex] = 0;
            }
        );

        function items(active) {
            return input.vertices.map(
                function (vertex) {
                    return {
                        label: vertex,
                        value:
                            "parent " +
                            parent[vertex],
                        status:
                            active.indexOf(
                                vertex
                            ) !== -1
                                ? "active"
                                : "normal"
                    };
                }
            );
        }

        steps.push(makeStep(
            "Initialize",
            "Make every vertex its own " +
            "component.",
            "/* dsu initialize */",
            {
                items: items([]),
                state: parent
            }
        ));

        function find(vertex) {
            steps.push(makeStep(
                "Find Root",
                "Follow parent links from " +
                vertex +
                ".",
                "/* dsu find */",
                {
                    items:
                        items([vertex]),
                    current: vertex,
                    comparisons:
                        comparisons,
                    updates: updates
                }
            ));

            comparisons += 1;

            if (
                parent[vertex] !== vertex
            ) {
                const old =
                    parent[vertex];

                parent[vertex] =
                    find(parent[vertex]);

                if (
                    old !== parent[vertex]
                ) {
                    updates += 1;

                    steps.push(makeStep(
                        "Path Compression",
                        "Point " +
                        vertex +
                        " directly to root " +
                        parent[vertex] +
                        ".",
                        "/* dsu compress */",
                        {
                            items:
                                items([
                                    vertex,
                                    parent[vertex]
                                ]),
                            current: vertex,
                            comparisons:
                                comparisons,
                            updates: updates
                        }
                    ));
                }
            }

            return parent[vertex];
        }

        input.edges.forEach(
            function (edge, edgeIndex) {
                steps.push(makeStep(
                    "Edge Loop",
                    "Process union edge " +
                    (edgeIndex + 1) +
                    ".",
                    "/* dsu edge loop */",
                    {
                        items: items(edge),
                        current:
                            edge.join("-"),
                        comparisons:
                            comparisons,
                        updates: updates
                    }
                ));

                steps.push(makeStep(
                    "Union",
                    "Union " +
                    edge[0] +
                    " and " +
                    edge[1] +
                    ".",
                    "/* dsu union */",
                    {
                        items: items(edge),
                        current:
                            edge.join("-"),
                        comparisons:
                            comparisons,
                        updates: updates
                    }
                ));

                const rootA =
                    find(edge[0]);

                const rootB =
                    find(edge[1]);

                steps.push(makeStep(
                    "Compare Roots",
                    "Roots are " +
                    rootA +
                    " and " +
                    rootB +
                    ".",
                    "/* dsu roots */",
                    {
                        items:
                            items([
                                rootA,
                                rootB
                            ]),
                        current:
                            rootA +
                            "/" +
                            rootB,
                        comparisons:
                            comparisons,
                        updates: updates
                    }
                ));

                if (rootA !== rootB) {
                    if (
                        rank[rootA] <
                        rank[rootB]
                    ) {
                        parent[rootA] =
                            rootB;
                    } else if (
                        rank[rootA] >
                        rank[rootB]
                    ) {
                        parent[rootB] =
                            rootA;
                    } else {
                        parent[rootB] =
                            rootA;

                        rank[rootA] += 1;
                    }

                    updates += 1;

                    steps.push(makeStep(
                        "Attach Component",
                        "Attach one root using " +
                        "union by rank.",
                        "/* dsu attach */",
                        {
                            items:
                                items([
                                    rootA,
                                    rootB
                                ]),
                            current:
                                rootA +
                                "/" +
                                rootB,
                            comparisons:
                                comparisons,
                            updates: updates,
                            state: parent
                        }
                    ));
                }
            }
        );

        const firstRoot =
            find(input.first);

        const secondRoot =
            find(input.second);

        const connected =
            firstRoot === secondRoot;

        steps.push(makeStep(
            "Complete",
            input.first +
            " and " +
            input.second +
            (
                connected
                    ? " are connected."
                    : " are not connected."
            ),
            "/* dsu output */",
            {
                items:
                    items([
                        input.first,
                        input.second
                    ]),
                current:
                    input.first +
                    ":" +
                    input.second,
                comparisons: comparisons,
                updates: updates,
                result:
                    connected
                        ? "Connected"
                        : "Not connected",
                complete: true
            }
        ));

        return steps;
    }

    function buildTopK(input) {
        const steps = [];
        const counts = {};
        const heap = [];

        let comparisons = 0;
        let updates = 0;

        steps.push(makeStep(
            "Initialize",
            "Create an empty frequency table.",
            "/* topk initialize */",
            {}
        ));

        input.values.forEach(
            function (value, index) {
                steps.push(makeStep(
                    "Count Loop",
                    "Read value at position " +
                    index +
                    ".",
                    "/* topk count loop */",
                    {
                        items:
                            valueItems(
                                input.values,
                                "V",
                                index
                            ),
                        current: value,
                        comparisons:
                            comparisons,
                        updates: updates
                    }
                ));

                if (
                    !Object.prototype
                        .hasOwnProperty.call(
                            counts,
                            value
                        )
                ) {
                    counts[value] = 1;
                    updates += 1;

                    steps.push(makeStep(
                        "New Frequency",
                        "Create count " +
                        value +
                        " → 1.",
                        "/* topk new count */",
                        {
                            state: counts,
                            current: value,
                            comparisons:
                                comparisons,
                            updates: updates
                        }
                    ));
                } else {
                    counts[value] += 1;
                    updates += 1;

                    steps.push(makeStep(
                        "Increase Frequency",
                        "Increase count of " +
                        value +
                        " to " +
                        counts[value] +
                        ".",
                        "/* topk increase count */",
                        {
                            state: counts,
                            current: value,
                            comparisons:
                                comparisons,
                            updates: updates
                        }
                    ));
                }
            }
        );

        Object.keys(counts).forEach(
            function (key) {
                const candidate = {
                    value: Number(key),
                    frequency: counts[key]
                };

                steps.push(makeStep(
                    "Candidate Loop",
                    "Process candidate " +
                    key +
                    " with frequency " +
                    counts[key] +
                    ".",
                    "/* topk candidate loop */",
                    {
                        items:
                            heap.map(
                                function (item) {
                                    return {
                                        label:
                                            "frequency " +
                                            item.frequency,
                                        value:
                                            item.value,
                                        status:
                                            "normal"
                                    };
                                }
                            ),
                        current: key,
                        comparisons:
                            comparisons,
                        updates: updates
                    }
                ));

                if (
                    heap.length <
                    input.k
                ) {
                    heap.push(candidate);

                    heap.sort(
                        function (
                            first,
                            second
                        ) {
                            return (
                                first.frequency -
                                second.frequency
                            );
                        }
                    );

                    updates += 1;

                    steps.push(makeStep(
                        "Heap Insert",
                        "Insert candidate because " +
                        "the heap has fewer than " +
                        "k values.",
                        "/* topk insert */",
                        {
                            items:
                                heap.map(
                                    function (item) {
                                        return {
                                            label:
                                                "frequency " +
                                                item.frequency,
                                            value:
                                                item.value,
                                            status:
                                                item.value ===
                                                candidate.value
                                                    ? "active"
                                                    : "normal"
                                        };
                                    }
                                ),
                            current: key,
                            comparisons:
                                comparisons,
                            updates: updates
                        }
                    ));
                } else {
                    comparisons += 1;

                    if (
                        candidate.frequency >
                        heap[0].frequency
                    ) {
                        heap[0] = candidate;

                        heap.sort(
                            function (
                                first,
                                second
                            ) {
                                return (
                                    first.frequency -
                                    second.frequency
                                );
                            }
                        );

                        updates += 1;

                        steps.push(makeStep(
                            "Replace Minimum",
                            "Replace the weakest " +
                            "retained frequency.",
                            "/* topk replace */",
                            {
                                items:
                                    heap.map(
                                        function (
                                            item
                                        ) {
                                            return {
                                                label:
                                                    "frequency " +
                                                    item.frequency,
                                                value:
                                                    item.value,
                                                status:
                                                    item.value ===
                                                    candidate.value
                                                        ? "active"
                                                        : "normal"
                                            };
                                        }
                                    ),
                                current: key,
                                comparisons:
                                    comparisons,
                                updates:
                                    updates
                            }
                        ));
                    }
                }
            }
        );

        const result = heap
            .slice()
            .sort(
                function (first, second) {
                    return (
                        second.frequency -
                        first.frequency
                    );
                }
            );

        steps.push(makeStep(
            "Complete",
            "The heap contains the top " +
            input.k +
            " frequent values.",
            "/* topk output */",
            {
                items:
                    result.map(
                        function (item) {
                            return {
                                label:
                                    "frequency " +
                                    item.frequency,
                                value: item.value,
                                status: "selected"
                            };
                        }
                    ),
                comparisons: comparisons,
                updates: updates,
                result:
                    result.map(
                        function (item) {
                            return (
                                item.value +
                                "(" +
                                item.frequency +
                                ")"
                            );
                        }
                    ).join(", "),
                complete: true
            }
        ));

        return steps;
    }

    function oneApart(first, second) {
        let differences = 0;

        for (
            let index = 0;
            index < first.length;
            index += 1
        ) {
            if (
                first[index] !==
                second[index]
            ) {
                differences += 1;
            }
        }

        return differences === 1;
    }

    function buildLadder(input) {
        const steps = [];

        const queue = [{
            word: input.start,
            level: 1
        }];

        const visited =
            new Set([input.start]);

        let comparisons = 0;
        let updates = 1;
        let answer = 0;

        function items(active) {
            return queue.map(
                function (entry, index) {
                    return {
                        label:
                            "Level " +
                            entry.level,
                        value: entry.word,
                        status:
                            entry.word === active ||
                            index === 0
                                ? "active"
                                : "normal"
                    };
                }
            );
        }

        steps.push(makeStep(
            "Initialize",
            "Create the BFS queue and " +
            "visited set.",
            "/* ladder initialize */",
            {
                state: {
                    Start: input.start,
                    Target: input.target
                }
            }
        ));

        steps.push(makeStep(
            "Enqueue Start",
            "Enqueue " +
            input.start +
            " at level 1.",
            "/* ladder enqueue start */",
            {
                items:
                    items(input.start),
                current: input.start,
                comparisons: comparisons,
                updates: updates
            }
        ));

        while (
            queue.length &&
            !answer
        ) {
            steps.push(makeStep(
                "Queue Loop",
                "The BFS frontier contains " +
                queue.map(
                    function (entry) {
                        return entry.word;
                    }
                ).join(", ") +
                ".",
                "/* ladder queue loop */",
                {
                    items:
                        items(
                            queue[0].word
                        ),
                    current:
                        queue[0].word,
                    comparisons:
                        comparisons,
                    updates: updates
                }
            ));

            const current =
                queue.shift();

            steps.push(makeStep(
                "Dequeue",
                "Dequeue " +
                current.word +
                " at level " +
                current.level +
                ".",
                "/* ladder dequeue */",
                {
                    items: items(null),
                    current:
                        current.word,
                    comparisons:
                        comparisons,
                    updates: updates
                }
            ));

            if (
                current.word ===
                input.target
            ) {
                answer =
                    current.level;

                steps.push(makeStep(
                    "Target Found",
                    "The target is reached " +
                    "at level " +
                    answer +
                    ".",
                    "/* ladder found */",
                    {
                        items:
                            items(null),
                        current:
                            current.word,
                        comparisons:
                            comparisons,
                        updates: updates,
                        result:
                            String(answer)
                    }
                ));

                break;
            }

            input.words.forEach(
                function (word) {
                    if (answer) {
                        return;
                    }

                    steps.push(makeStep(
                        "Neighbor Loop",
                        "Inspect dictionary word " +
                        word +
                        ".",
                        "/* ladder neighbor loop */",
                        {
                            items:
                                items(null),
                            current: word,
                            comparisons:
                                comparisons,
                            updates: updates
                        }
                    ));

                    comparisons += 1;

                    const neighbor =
                        !visited.has(word) &&
                        oneApart(
                            current.word,
                            word
                        );

                    steps.push(makeStep(
                        "Neighbor Check",
                        neighbor
                            ? (
                                word +
                                " is an unseen " +
                                "one-letter neighbor."
                            )
                            : (
                                word +
                                " is not an " +
                                "available neighbor."
                            ),
                        "/* ladder neighbor check */",
                        {
                            items:
                                items(null),
                            current:
                                current.word +
                                "→" +
                                word,
                            comparisons:
                                comparisons,
                            updates: updates
                        }
                    ));

                    if (neighbor) {
                        visited.add(word);

                        queue.push({
                            word: word,
                            level:
                                current.level +
                                1
                        });

                        updates += 1;

                        steps.push(makeStep(
                            "Enqueue Neighbor",
                            "Enqueue " +
                            word +
                            " at level " +
                            (
                                current.level +
                                1
                            ) +
                            ".",
                            "/* ladder enqueue */",
                            {
                                items:
                                    items(word),
                                current: word,
                                comparisons:
                                    comparisons,
                                updates:
                                    updates
                            }
                        ));

                        if (
                            word ===
                            input.target
                        ) {
                            answer =
                                current.level +
                                1;

                            steps.push(makeStep(
                                "Target Found",
                                "The target is " +
                                "discovered at " +
                                "level " +
                                answer +
                                ".",
                                "/* ladder found */",
                                {
                                    items:
                                        items(
                                            word
                                        ),
                                    current:
                                        word,
                                    comparisons:
                                        comparisons,
                                    updates:
                                        updates,
                                    result:
                                        String(
                                            answer
                                        )
                                }
                            ));
                        }
                    }
                }
            );
        }

        steps.push(makeStep(
            "Complete",
            answer
                ? (
                    "The shortest transformation " +
                    "uses " +
                    answer +
                    " words."
                )
                : (
                    "No valid transformation " +
                    "path exists."
                ),
            answer
                ? "/* ladder output */"
                : "/* ladder no path */",
            {
                items: items(null),
                comparisons: comparisons,
                updates: updates,
                result:
                    answer
                        ? (
                            "Length = " +
                            answer
                        )
                        : "No path",
                complete: true
            }
        ));

        return steps;
    }

    function buildSteps(
        algorithm,
        input
    ) {
        if (algorithm === "kth") {
            return buildKth(input);
        }

        if (algorithm === "median") {
            return buildMedian(input);
        }

        if (algorithm === "lru") {
            return buildLru(input);
        }

        if (algorithm === "merge") {
            return buildMerge(input);
        }

        if (algorithm === "range") {
            return buildRange(input);
        }

        if (algorithm === "dsu") {
            return buildDsu(input);
        }

        if (algorithm === "topk") {
            return buildTopK(input);
        }

        return buildLadder(input);
    }

    function renderStage(
        container,
        step
    ) {
        container.innerHTML = "";

        if (!step.items.length) {
            const empty =
                document.createElement("div");

            empty.className =
                "placement-empty";

            empty.textContent = "EMPTY";

            container.appendChild(empty);

            return;
        }

        step.items.forEach(
            function (item) {
                const card =
                    document.createElement(
                        "div"
                    );

            card.className =
    "placement-item is-" +
    (
        item.status ||
        "normal"
    );

                const label =
                    document.createElement(
                        "span"
                    );

                const value =
                    document.createElement(
                        "strong"
                    );

                label.textContent =
                    item.label;

                value.textContent =
                    String(item.value);

                card.appendChild(label);
                card.appendChild(value);
                container.appendChild(card);
            }
        );
    }

    function renderState(
        container,
        state
    ) {
        container.innerHTML = "";

        const keys =
            Object.keys(state || {});

        if (!keys.length) {
            return;
        }

        const grid =
            document.createElement("div");

        grid.className =
            "placement-state-grid";

        keys.forEach(function (key) {
            const card =
                document.createElement("div");

            const name =
                document.createElement("span");

            const value =
                document.createElement("strong");

            name.textContent = key;

            value.textContent =
                String(state[key]);

            card.appendChild(name);
            card.appendChild(value);
            grid.appendChild(card);
        });

        container.appendChild(grid);
    }

    function setLabels(
        algorithm,
        dataLabel,
        auxLabel
    ) {
        const definition =
            definitions[algorithm];

        dataLabel.firstChild.textContent =
            definition.dataLabel;

        auxLabel.firstChild.textContent =
            definition.auxLabel;
    }

    function setExample(
        algorithm,
        controls
    ) {
        const definition =
            definitions[algorithm];

        controls.algorithm.value =
            algorithm;

        controls.data.value =
            definition.data;

        controls.aux.value =
            definition.aux;

        setLabels(
            algorithm,
            controls.dataLabel,
            controls.auxLabel
        );
    }

    const visualizer = {
        data:
            document.getElementById(
                "placementData"
            ),
        aux:
            document.getElementById(
                "placementAux"
            ),
        dataLabel:
            document.getElementById(
                "placementDataLabel"
            ),
        auxLabel:
            document.getElementById(
                "placementAuxLabel"
            ),
        algorithm:
            document.getElementById(
                "placementAlgorithm"
            ),
        load:
            document.getElementById(
                "loadPlacementVisualizer"
            ),
        prompt:
            document.getElementById(
                "placementPrompt"
            ),
        result:
            document.getElementById(
                "placementResult"
            ),
        stage:
            document.getElementById(
                "placementStage"
            ),
        message:
            document.getElementById(
                "placementMessage"
            ),
        progress:
            document.getElementById(
                "placementProgress"
            ),
        problemValue:
            document.getElementById(
                "placementProblemValue"
            ),
        phase:
            document.getElementById(
                "placementPhase"
            ),
        current:
            document.getElementById(
                "placementCurrent"
            ),
        comparisons:
            document.getElementById(
                "placementComparisons"
            ),
        updates:
            document.getElementById(
                "placementUpdates"
            ),
        resultValue:
            document.getElementById(
                "placementResultValue"
            ),
        state:
            document.getElementById(
                "placementState"
            ),
        previous:
            document.getElementById(
                "placementPrevious"
            ),
        next:
            document.getElementById(
                "placementNext"
            ),
        auto:
            document.getElementById(
                "placementAuto"
            ),
        pause:
            document.getElementById(
                "placementPause"
            ),
        reset:
            document.getElementById(
                "placementReset"
            ),
        status:
            document.getElementById(
                "placementStatus"
            )
    };

    let visualSteps = [];
    let visualIndex = 0;
    let visualTimer = null;

    function stopVisual() {
        if (visualTimer !== null) {
            window.clearInterval(
                visualTimer
            );

            visualTimer = null;
        }
    }

    function invalidateVisual() {
        stopVisual();
        visualSteps = [];

        if (visualizer.result) {
            visualizer.result.hidden = true;
            visualizer.prompt.hidden = false;
        }
    }

    function renderVisual() {
        if (!visualSteps.length) {
            return;
        }

        const step =
            visualSteps[visualIndex];

        renderStage(
            visualizer.stage,
            step
        );

        renderState(
            visualizer.state,
            step.state
        );

        visualizer.message.textContent =
            step.message;

        visualizer.problemValue.textContent =
            definitions[
                visualizer.algorithm.value
            ].label;

        visualizer.phase.textContent =
            step.phase;

        visualizer.current.textContent =
            step.current;

        visualizer.comparisons.textContent =
            String(step.comparisons);

        visualizer.updates.textContent =
            String(step.updates);

        visualizer.resultValue.textContent =
            step.result;

        visualizer.progress.style.width =
            (
                visualIndex /
                Math.max(
                    1,
                    visualSteps.length - 1
                ) *
                100
            ) + "%";

        visualizer.previous.disabled =
            visualIndex === 0;

        visualizer.next.disabled =
            visualIndex ===
            visualSteps.length - 1;

        visualizer.status.textContent =
            "Step " +
            visualIndex +
            " of " +
            (visualSteps.length - 1);
    }

    function loadVisual() {
        try {
            const input = parseInput(
                visualizer.algorithm.value,
                visualizer.data,
                visualizer.aux
            );

            visualSteps = buildSteps(
                visualizer.algorithm.value,
                input
            );
        } catch (error) {
            window.alert(error.message);
            return;
        }

        stopVisual();

        visualIndex = 0;
        visualizer.prompt.hidden = true;
        visualizer.result.hidden = false;

        renderVisual();
    }

    if (visualizer.load) {
        visualizer.load.addEventListener(
            "click",
            loadVisual
        );

        [
            visualizer.data,
            visualizer.aux
        ].forEach(function (control) {
            control.addEventListener(
                "input",
                invalidateVisual
            );
        });

        visualizer.algorithm.addEventListener(
            "change",
            function () {
                setExample(
                    visualizer.algorithm.value,
                    visualizer
                );

                invalidateVisual();
            }
        );

        document
            .querySelectorAll(
                "[data-placement-example]"
            )
            .forEach(function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        setExample(
                            button.dataset
                                .placementExample,
                            visualizer
                        );

                        invalidateVisual();
                    }
                );
            });

        visualizer.previous.addEventListener(
            "click",
            function () {
                stopVisual();

                visualIndex = Math.max(
                    0,
                    visualIndex - 1
                );

                renderVisual();
            }
        );

        visualizer.next.addEventListener(
            "click",
            function () {
                stopVisual();

                visualIndex = Math.min(
                    visualSteps.length - 1,
                    visualIndex + 1
                );

                renderVisual();
            }
        );

        visualizer.auto.addEventListener(
            "click",
            function () {
                stopVisual();

                if (
                    visualIndex ===
                    visualSteps.length - 1
                ) {
                    visualIndex = 0;
                    renderVisual();
                }

                visualTimer =
                    window.setInterval(
                        function () {
                            if (
                                visualIndex >=
                                visualSteps.length - 1
                            ) {
                                stopVisual();
                                return;
                            }

                            visualIndex += 1;
                            renderVisual();
                        },
                        760
                    );
            }
        );

        visualizer.pause.addEventListener(
            "click",
            stopVisual
        );

        visualizer.reset.addEventListener(
            "click",
            function () {
                stopVisual();
                visualIndex = 0;
                renderVisual();
            }
        );
    }

    const tracer = {
        data:
            document.getElementById(
                "placementTraceData"
            ),
        aux:
            document.getElementById(
                "placementTraceAux"
            ),
        dataLabel:
            document.getElementById(
                "placementTraceDataLabel"
            ),
        auxLabel:
            document.getElementById(
                "placementTraceAuxLabel"
            ),
        algorithm:
            document.getElementById(
                "placementTraceAlgorithm"
            ),
        load:
            document.getElementById(
                "loadPlacementTracer"
            ),
        prompt:
            document.getElementById(
                "placementTracePrompt"
            ),
        result:
            document.getElementById(
                "placementTraceResult"
            ),
        title:
            document.getElementById(
                "placementTraceTitle"
            ),
        codeWindow:
            document.getElementById(
                "placementTraceCodeWindow"
            ),
        code:
            document.getElementById(
                "placementTraceCode"
            ),
        message:
            document.getElementById(
                "placementTraceMessage"
            ),
        variables:
            document.getElementById(
                "placementTraceVariables"
            ),
        stage:
            document.getElementById(
                "placementTraceStage"
            ),
        state:
            document.getElementById(
                "placementTraceState"
            ),
        output:
            document.getElementById(
                "placementTraceOutput"
            ),
        previous:
            document.getElementById(
                "placementTracePrevious"
            ),
        next:
            document.getElementById(
                "placementTraceNext"
            ),
        auto:
            document.getElementById(
                "placementTraceAuto"
            ),
        pause:
            document.getElementById(
                "placementTracePause"
            ),
        reset:
            document.getElementById(
                "placementTraceReset"
            ),
        status:
            document.getElementById(
                "placementTraceStatus"
            )
    };

    let traceSteps = [];
    let traceIndex = 0;
    let traceTimer = null;
    let traceLookupLines = [];
    let traceVisibleLines = [];
    let traceScrollFrame = null;
    let activeDefinition = null;

    function stopTrace() {
        if (traceTimer !== null) {
            window.clearInterval(
                traceTimer
            );

            traceTimer = null;
        }
    }

    function invalidateTrace() {
        stopTrace();
        traceSteps = [];

        if (tracer.result) {
            tracer.result.hidden = true;
            tracer.prompt.hidden = false;
        }
    }

    function loadCode(definition) {
        const source = document.querySelector(
            '[data-c-program="' +
            definition.codeKey +
            '"]'
        );

        if (!source) {
            throw new Error(
                "The selected C program " +
                "could not be found."
            );
        }

        const text = source.textContent
            .replace(/\r/g, "")
            .replace(/^\n+|\n+$/g, "");

        traceLookupLines =
            text.split("\n");

        traceVisibleLines =
            traceLookupLines.map(
                function (line) {
                    return line
                        .replace(
                            /\s*\/\*\s*(?:kth|median|lru|merge|range|dsu|topk|ladder)[^*]*\*\//g,
                            ""
                        )
                        .replace(
                            /\s+$/g,
                            ""
                        );
                }
            );

        tracer.code.innerHTML = "";

        traceVisibleLines.forEach(
            function (line, index) {
                const row =
                    document.createElement(
                        "span"
                    );

                row.dataset
                    .placementTraceLine =
                        String(index + 1);

                row.textContent =
                    String(index + 1)
                        .padStart(3, "0") +
                    " │ " +
                    (line || " ");

                tracer.code.appendChild(row);
            }
        );

        tracer.codeWindow.style
            .scrollBehavior = "auto";

        tracer.codeWindow.scrollTop = 0;
    }

    function countCharacter(
        text,
        character
    ) {
        return Array.from(text).reduce(
            function (count, current) {
                return (
                    count +
                    (
                        current === character
                            ? 1
                            : 0
                    )
                );
            },
            0
        );
    }

    function statementStart(lineIndex) {
        let balance = 0;

        for (
            let index = lineIndex;
            index >= 0;
            index -= 1
        ) {
            const line =
                traceVisibleLines[
                    index
                ].trim();

            if (!line) {
                continue;
            }

            balance +=
                countCharacter(line, ")") -
                countCharacter(line, "(");

            if (balance <= 0) {
                return index + 1;
            }
        }

        return lineIndex + 1;
    }

    function findLine(needle) {
        for (
            let index = 0;
            index <
                traceLookupLines.length;
            index += 1
        ) {
            if (
                traceLookupLines[index]
                    .indexOf(needle) === -1
            ) {
                continue;
            }

            let executable = index;

            while (
                executable >= 0 &&
                !traceVisibleLines[
                    executable
                ].trim()
            ) {
                executable -= 1;
            }

            if (executable >= 0) {
                return statementStart(
                    executable
                );
            }

            executable = index + 1;

            while (
                executable <
                    traceVisibleLines.length &&
                !traceVisibleLines[
                    executable
                ].trim()
            ) {
                executable += 1;
            }

            return executable <
                traceVisibleLines.length
                ? statementStart(executable)
                : -1;
        }

        return -1;
    }

    function decorate(steps) {
        let previous = 1;

        return steps.map(function (step) {
            const line =
                findLine(step.needle);

            if (line > 0) {
                previous = line;
            }

            return Object.assign(
                {},
                step,
                {
                    line:
                        line > 0
                            ? line
                            : previous
                }
            );
        });
    }

    function appendVariable(
        label,
        value
    ) {
        const card =
            document.createElement("div");

        const name =
            document.createElement("span");

        const data =
            document.createElement("strong");

        name.textContent = label;
        data.textContent = String(value);

        card.appendChild(name);
        card.appendChild(data);
        tracer.variables.appendChild(card);
    }

    function positionTraceLine(activeLine) {
        const codeWindow =
            tracer.codeWindow;

        function move() {
            if (
                !activeLine ||
                activeLine.isConnected === false
            ) {
                return;
            }

            const windowRectangle =
                codeWindow
                    .getBoundingClientRect();

            const lineRectangle =
                activeLine
                    .getBoundingClientRect();

            const lineHeight =
                lineRectangle.height ||
                activeLine.offsetHeight;

            const maximum = Math.max(
                0,
                codeWindow.scrollHeight -
                codeWindow.clientHeight
            );

            const target =
                codeWindow.scrollTop +
                lineRectangle.top -
                windowRectangle.top -
                (
                    codeWindow.clientHeight -
                    lineHeight
                ) / 2;

            codeWindow.style.scrollBehavior =
                "auto";

            codeWindow.scrollTop =
                Math.max(
                    0,
                    Math.min(
                        maximum,
                        target
                    )
                );
        }

        if (
            traceScrollFrame !== null &&
            typeof window
                .cancelAnimationFrame ===
                "function"
        ) {
            window.cancelAnimationFrame(
                traceScrollFrame
            );
        }

        move();

        if (
            typeof window
                .requestAnimationFrame ===
                "function"
        ) {
            traceScrollFrame =
                window.requestAnimationFrame(
                    function () {
                        traceScrollFrame = null;
                        move();
                    }
                );
        }
    }

    function renderTrace() {
        if (!traceSteps.length) {
            return;
        }

        const step =
            traceSteps[traceIndex];

        let activeLine = null;

        tracer.code
            .querySelectorAll(
                "[data-placement-trace-line]"
            )
            .forEach(function (line) {
                const active =
                    Number(
                        line.dataset
                            .placementTraceLine
                    ) === step.line;

                line.classList.toggle(
                    "is-active-line",
                    active
                );

                if (active) {
                    activeLine = line;
                }
            });

        tracer.message.textContent =
            step.message;

        tracer.variables.innerHTML = "";

        appendVariable(
            "Problem",
            activeDefinition.label
        );

        appendVariable(
            "Phase",
            step.phase
        );

        appendVariable(
            "Current",
            step.current
        );

        appendVariable(
            "Comparisons",
            step.comparisons
        );

        appendVariable(
            "Updates",
            step.updates
        );

        appendVariable(
            "Step Result",
            step.result
        );

        renderStage(
            tracer.stage,
            step
        );

        renderState(
            tracer.state,
            step.state
        );

        tracer.output.textContent =
            step.complete
                ? step.result
                : "—";

        tracer.previous.disabled =
            traceIndex === 0;

        tracer.next.disabled =
            traceIndex ===
            traceSteps.length - 1;

        tracer.status.textContent =
            "Step " +
            traceIndex +
            " of " +
            (traceSteps.length - 1);

        if (activeLine) {
            positionTraceLine(activeLine);
        }
    }

    function loadTrace() {
        const definition =
            definitions[
                tracer.algorithm.value
            ];

        try {
            const input = parseInput(
                tracer.algorithm.value,
                tracer.data,
                tracer.aux
            );

            loadCode(definition);

            traceSteps = decorate(
                buildSteps(
                    tracer.algorithm.value,
                    input
                )
            );
        } catch (error) {
            window.alert(error.message);
            return;
        }

        stopTrace();

        activeDefinition = definition;
        traceIndex = 0;

        tracer.title.textContent =
            "PROGRAM TRACING — " +
            definition.label.toUpperCase();

        tracer.prompt.hidden = true;
        tracer.result.hidden = false;

        renderTrace();
    }

    if (tracer.load) {
        tracer.load.addEventListener(
            "click",
            loadTrace
        );

        [
            tracer.data,
            tracer.aux
        ].forEach(function (control) {
            control.addEventListener(
                "input",
                invalidateTrace
            );
        });

        tracer.algorithm.addEventListener(
            "change",
            function () {
                setExample(
                    tracer.algorithm.value,
                    tracer
                );

                invalidateTrace();
            }
        );

        tracer.previous.addEventListener(
            "click",
            function () {
                stopTrace();

                traceIndex = Math.max(
                    0,
                    traceIndex - 1
                );

                renderTrace();
            }
        );

        tracer.next.addEventListener(
            "click",
            function () {
                stopTrace();

                traceIndex = Math.min(
                    traceSteps.length - 1,
                    traceIndex + 1
                );

                renderTrace();
            }
        );

        tracer.auto.addEventListener(
            "click",
            function () {
                stopTrace();

                if (
                    traceIndex ===
                    traceSteps.length - 1
                ) {
                    traceIndex = 0;
                    renderTrace();
                }

                traceTimer =
                    window.setInterval(
                        function () {
                            if (
                                traceIndex >=
                                traceSteps.length - 1
                            ) {
                                stopTrace();
                                return;
                            }

                            traceIndex += 1;
                            renderTrace();
                        },
                        800
                    );
            }
        );

        tracer.pause.addEventListener(
            "click",
            stopTrace
        );

        tracer.reset.addEventListener(
            "click",
            function () {
                stopTrace();
                traceIndex = 0;
                renderTrace();
            }
        );
    }
}());
