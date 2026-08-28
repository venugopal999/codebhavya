(function () {
    "use strict";

    const SVG_NS = "http://www.w3.org/2000/svg";

    document.querySelectorAll("[data-toggle-target]").forEach(function (button) {
        const target = document.getElementById(button.dataset.toggleTarget);
        if (!target) { return; }

        target.hidden = true;
        button.dataset.originalLabel = button.textContent.trim();
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", target.id);
    });

    document.addEventListener("click", function (event) {
        const button = event.target.closest
            ? event.target.closest("[data-toggle-target]")
            : null;

        if (!button) { return; }

        const target = document.getElementById(
            button.dataset.toggleTarget
        );

        if (!target) { return; }

        const open = target.hidden;
        target.hidden = !open;

        button.setAttribute(
            "aria-expanded",
            String(open)
        );

        button.textContent = open
            ? (
                target.classList.contains("ads-hint-box")
                    ? "Hide Hint"
                    : "Hide Answer"
            )
            : button.dataset.originalLabel;
    });

    let nodeCounter = 0;

    function createMeldNode(key) {
        nodeCounter += 1;

        return {
            id: "heap-node-" + nodeCounter,
            key: key,
            children: [],
            parent: null,
            mark: false
        };
    }

    function cloneMeldNode(node) {
        return {
            id: node.id,
            key: node.key,
            mark: Boolean(node.mark),
            children: node.children.map(cloneMeldNode)
        };
    }

    function binaryForest(array) {
        function build(index) {
            if (index >= array.length) {
                return null;
            }

            const node = {
                id: "heap-index-" + index,
                key: array[index],
                mark: false,
                children: []
            };

            const left = build(index * 2 + 1);
            const right = build(index * 2 + 2);

            if (left) {
                node.children.push(left);
            }

            if (right) {
                node.children.push(right);
            }

            return node;
        }

        const root = build(0);

        return root ? [root] : [];
    }

    function captureState(state) {
        if (state.type === "binary") {
            return {
                forest: binaryForest(state.array),
                array: state.array.slice()
            };
        }

        return {
            forest: state.roots.map(cloneMeldNode),
            array: []
        };
    }

    function forestNodeCount(roots) {
        let count = 0;

        function visit(node) {
            count += 1;
            node.children.forEach(visit);
        }

        roots.forEach(visit);

        return count;
    }

    function forestHeight(roots) {
        function height(node) {
            if (!node.children.length) {
                return 1;
            }

            return 1 + Math.max.apply(
                null,
                node.children.map(height)
            );
        }

        return roots.length
            ? Math.max.apply(null, roots.map(height))
            : 0;
    }

    function makeStep(
        state,
        active,
        phase,
        message,
        needle,
        details
    ) {
        const snapshot = captureState(state);
        const data = details || {};

        return {
            forest: snapshot.forest,
            array: snapshot.array,
            active: (active || []).slice(),
            phase: phase,
            message: message,
            needle: needle,
            key: typeof data.key === "number"
                ? data.key
                : "—",
            other: typeof data.other === "number"
                ? data.other
                : "—",
            index: typeof data.index === "number"
                ? data.index
                : "—",
            comparisons: data.comparisons || 0,
            swaps: data.swaps || 0,
            nodes: forestNodeCount(snapshot.forest),
            height: forestHeight(snapshot.forest),
            result: data.result || "—",
            complete: Boolean(data.complete)
        };
    }

    function markerPrefix(structure) {
        if (structure === "binomial") {
            return "binomial";
        }

        if (structure === "fibonacci") {
            return "fibonacci";
        }

        return "heap";
    }

    function completeSteps(
        steps,
        state,
        structure,
        operation,
        result
    ) {
        const prefix = markerPrefix(structure);

        steps.push(makeStep(
            state,
            [],
            "Complete",
            operation + " is complete.",
            "/* " + prefix + " complete */",
            {
                result: result,
                complete: true
            }
        ));

        return steps;
    }

    function priorityBefore(
        state,
        first,
        second
    ) {
        return state.mode === "min"
            ? first < second
            : first > second;
    }

    function binaryActive(indexes) {
        return indexes
            .filter(function (index) {
                return index >= 0;
            })
            .map(function (index) {
                return "heap-index-" + index;
            });
    }

    function swapBinary(
        state,
        first,
        second
    ) {
        const temporary = state.array[first];

        state.array[first] = state.array[second];
        state.array[second] = temporary;
    }

    function heapifyDown(
        state,
        start,
        steps,
        totals
    ) {
        let index = start;

        while (index < state.array.length) {
            let best = index;

            const left = index * 2 + 1;
            const right = index * 2 + 2;

            if (left < state.array.length) {
                totals.comparisons += 1;

                if (
                    priorityBefore(
                        state,
                        state.array[left],
                        state.array[best]
                    )
                ) {
                    best = left;
                }
            }

            if (right < state.array.length) {
                totals.comparisons += 1;

                if (
                    priorityBefore(
                        state,
                        state.array[right],
                        state.array[best]
                    )
                ) {
                    best = right;
                }
            }

            steps.push(makeStep(
                state,
                binaryActive([index, best]),
                "Compare Children",
                best === index
                    ? (
                        "The item at index " +
                        index +
                        " already has priority over its children."
                    )
                    : (
                        "Child at index " +
                        best +
                        " has higher priority than index " +
                        index +
                        "."
                    ),
                "/* heap compare child */",
                {
                    key: state.array[index],
                    other: state.array[best],
                    index: index,
                    comparisons: totals.comparisons,
                    swaps: totals.swaps
                }
            ));

            if (best === index) {
                break;
            }

            swapBinary(state, index, best);
            totals.swaps += 1;

            steps.push(makeStep(
                state,
                binaryActive([index, best]),
                "Swap Down",
                "Swap the parent position with its higher-priority child.",
                "/* heap swap */",
                {
                    key: state.array[best],
                    other: state.array[index],
                    index: best,
                    comparisons: totals.comparisons,
                    swaps: totals.swaps
                }
            ));

            index = best;
        }
    }

    function bubbleUp(
        state,
        start,
        steps,
        totals
    ) {
        let index = start;

        while (index > 0) {
            const parent =
                Math.floor((index - 1) / 2);

            totals.comparisons += 1;

            steps.push(makeStep(
                state,
                binaryActive([index, parent]),
                "Compare Parent",
                "Compare index " +
                    index +
                    " with parent index " +
                    parent +
                    ".",
                "/* heap bubble loop */",
                {
                    key: state.array[index],
                    other: state.array[parent],
                    index: index,
                    comparisons: totals.comparisons,
                    swaps: totals.swaps
                }
            ));

            if (
                !priorityBefore(
                    state,
                    state.array[index],
                    state.array[parent]
                )
            ) {
                break;
            }

            swapBinary(state, index, parent);
            totals.swaps += 1;

            steps.push(makeStep(
                state,
                binaryActive([index, parent]),
                "Swap Up",
                "The child has higher priority, so swap it with its parent.",
                "/* heap swap */",
                {
                    key: state.array[parent],
                    other: state.array[index],
                    index: parent,
                    comparisons: totals.comparisons,
                    swaps: totals.swaps
                }
            ));

            index = parent;
        }
    }

    function buildBinary(
        values,
        mode,
        steps,
        totals
    ) {
        const state = {
            type: "binary",
            mode: mode,
            array: values.slice()
        };

        steps.push(makeStep(
            state,
            binaryActive(
                state.array.map(
                    function (_, index) {
                        return index;
                    }
                )
            ),
            "Create Complete Tree",
            "Place the input keys in level order.",
            "/* heap create */",
            {
                comparisons: totals.comparisons,
                swaps: totals.swaps
            }
        ));

        for (
            let index =
                Math.floor(state.array.length / 2) - 1;
            index >= 0;
            index -= 1
        ) {
            steps.push(makeStep(
                state,
                binaryActive([index]),
                "Build Heap",
                "Heapify the internal node at index " +
                    index +
                    ".",
                "/* heap build */",
                {
                    index: index,
                    key: state.array[index],
                    comparisons: totals.comparisons,
                    swaps: totals.swaps
                }
            ));

            heapifyDown(
                state,
                index,
                steps,
                totals
            );
        }

        return state;
    }

    function insertBinary(
        state,
        key,
        steps,
        totals
    ) {
        if (state.array.indexOf(key) !== -1) {
            steps.push(makeStep(
                state,
                [],
                "Duplicate Ignored",
                "Key " + key + " is already present.",
                "/* heap insert */",
                {
                    key: key,
                    result: "Already stored",
                    comparisons: totals.comparisons,
                    swaps: totals.swaps
                }
            ));

            return false;
        }

        state.array.push(key);

        const index = state.array.length - 1;

        steps.push(makeStep(
            state,
            binaryActive([index]),
            "Append Key",
            "Append " +
                key +
                " at index " +
                index +
                ".",
            "/* heap insert */",
            {
                key: key,
                index: index,
                comparisons: totals.comparisons,
                swaps: totals.swaps
            }
        ));

        bubbleUp(
            state,
            index,
            steps,
            totals
        );

        return true;
    }

    function peekBinary(
        state,
        steps,
        totals
    ) {
        const value = state.array[0];

        steps.push(makeStep(
            state,
            binaryActive([0]),
            "Read Root",
            "The root stores the " +
                (
                    state.mode === "min"
                        ? "minimum"
                        : "maximum"
                ) +
                " value " +
                value +
                ".",
            "/* heap peek */",
            {
                key: value,
                index: 0,
                result: String(value),
                comparisons: totals.comparisons,
                swaps: totals.swaps
            }
        ));

        return value;
    }

    function extractBinary(
        state,
        steps,
        totals
    ) {
        if (!state.array.length) {
            return null;
        }

        const value = state.array[0];
        const last = state.array.pop();

        if (state.array.length) {
            state.array[0] = last;
        }

        steps.push(makeStep(
            state,
            state.array.length
                ? binaryActive([0])
                : [],
            "Remove Root",
            "Remove root " +
                value +
                " and move the last item to index 0.",
            "/* heap extract */",
            {
                key: value,
                result: String(value),
                comparisons: totals.comparisons,
                swaps: totals.swaps
            }
        ));

        if (state.array.length) {
            heapifyDown(
                state,
                0,
                steps,
                totals
            );
        }

        return value;
    }

    function changeBinary(
        state,
        oldKey,
        newKey,
        steps,
        totals
    ) {
        const index =
            state.array.indexOf(oldKey);

        if (index === -1) {
            steps.push(makeStep(
                state,
                [],
                "Key Missing",
                "Key " +
                    oldKey +
                    " is not stored.",
                "/* heap change key */",
                {
                    key: oldKey,
                    result: "Not found",
                    comparisons: totals.comparisons,
                    swaps: totals.swaps
                }
            ));

            return false;
        }

        if (
            oldKey !== newKey &&
            state.array.indexOf(newKey) !== -1
        ) {
            steps.push(makeStep(
                state,
                binaryActive([index]),
                "Duplicate Rejected",
                "New key " +
                    newKey +
                    " is already stored.",
                "/* heap change key */",
                {
                    key: oldKey,
                    other: newKey,
                    result: "Duplicate key",
                    comparisons: totals.comparisons,
                    swaps: totals.swaps
                }
            ));

            return false;
        }

        state.array[index] = newKey;

        steps.push(makeStep(
            state,
            binaryActive([index]),
            "Change Key",
            "Replace " +
                oldKey +
                " with " +
                newKey +
                " at index " +
                index +
                ".",
            "/* heap change key */",
            {
                key: oldKey,
                other: newKey,
                index: index,
                comparisons: totals.comparisons,
                swaps: totals.swaps
            }
        ));

        const parent = index > 0
            ? Math.floor((index - 1) / 2)
            : -1;

        if (
            parent >= 0 &&
            priorityBefore(
                state,
                state.array[index],
                state.array[parent]
            )
        ) {
            bubbleUp(
                state,
                index,
                steps,
                totals
            );
        } else {
            heapifyDown(
                state,
                index,
                steps,
                totals
            );
        }

        return true;
    }

    function deleteBinary(
        state,
        key,
        steps,
        totals
    ) {
        const index = state.array.indexOf(key);

        if (index === -1) {
            steps.push(makeStep(
                state,
                [],
                "Key Missing",
                "Key " + key + " is not stored.",
                "/* heap delete */",
                {
                    key: key,
                    result: "Not found",
                    comparisons: totals.comparisons,
                    swaps: totals.swaps
                }
            ));

            return false;
        }

        const last = state.array.pop();

        if (index < state.array.length) {
            state.array[index] = last;
        }

        steps.push(makeStep(
            state,
            index < state.array.length
                ? binaryActive([index])
                : [],
            "Delete Key",
            "Delete " +
                key +
                " and fill its position with the last item.",
            "/* heap delete */",
            {
                key: key,
                index: index,
                comparisons: totals.comparisons,
                swaps: totals.swaps
            }
        ));

        if (index < state.array.length) {
            const parent = index > 0
                ? Math.floor((index - 1) / 2)
                : -1;

            if (
                parent >= 0 &&
                priorityBefore(
                    state,
                    state.array[index],
                    state.array[parent]
                )
            ) {
                bubbleUp(
                    state,
                    index,
                    steps,
                    totals
                );
            } else {
                heapifyDown(
                    state,
                    index,
                    steps,
                    totals
                );
            }
        }

        return true;
    }

    function buildBinarySteps(
        values,
        query,
        operation,
        structure
    ) {
        const steps = [];

        const totals = {
            comparisons: 0,
            swaps: 0
        };

        const mode = structure === "binary-max"
            ? "max"
            : "min";

        const state = buildBinary(
            values,
            mode,
            steps,
            totals
        );

        const name = mode === "min"
            ? "Binary Min-Heap"
            : "Binary Max-Heap";

        if (operation === "build") {
            return completeSteps(
                steps,
                state,
                structure,
                "Build",
                name + " built"
            );
        }

        if (operation === "insert") {
            const inserted = insertBinary(
                state,
                query,
                steps,
                totals
            );

            return completeSteps(
                steps,
                state,
                structure,
                "Insertion",
                inserted
                    ? "Inserted " + query
                    : "Already stored"
            );
        }

        if (operation === "peek") {
            const value = peekBinary(
                state,
                steps,
                totals
            );

            return completeSteps(
                steps,
                state,
                structure,
                "Peek",
                (
                    mode === "min"
                        ? "Minimum = "
                        : "Maximum = "
                ) + value
            );
        }

        if (operation === "extract") {
            const value = extractBinary(
                state,
                steps,
                totals
            );

            return completeSteps(
                steps,
                state,
                structure,
                "Extract Root",
                "Extracted " + value
            );
        }

        if (operation === "change") {
            const changed = changeBinary(
                state,
                query.oldKey,
                query.newKey,
                steps,
                totals
            );

            return completeSteps(
                steps,
                state,
                structure,
                "Change Key",
                changed
                    ? (
                        query.oldKey +
                        " → " +
                        query.newKey
                    )
                    : "Change not performed"
            );
        }

        if (operation === "delete") {
            const deleted = deleteBinary(
                state,
                query,
                steps,
                totals
            );

            return completeSteps(
                steps,
                state,
                structure,
                "Deletion",
                deleted
                    ? "Deleted " + query
                    : "Not found"
            );
        }

        const output = [];

        while (state.array.length) {
            const value = extractBinary(
                state,
                steps,
                totals
            );

            output.push(value);

            steps.push(makeStep(
                state,
                [],
                "Heap Sort Output",
                "Place extracted value " +
                    value +
                    " into the output.",
                "/* heap sort */",
                {
                    key: value,
                    result: output.join(", "),
                    comparisons: totals.comparisons,
                    swaps: totals.swaps
                }
            ));
        }

        if (mode === "max") {
            output.reverse();
        }

        return completeSteps(
            steps,
            state,
            structure,
            "Heap Sort",
            output.join(", ")
        );
    }

    function findMeldNode(roots, key) {
        let answer = null;

        function visit(node) {
            if (answer) {
                return;
            }

            if (node.key === key) {
                answer = node;
                return;
            }

            node.children.forEach(visit);
        }

        roots.forEach(visit);

        return answer;
    }

    function allMeldKeys(roots) {
        const values = [];

        function visit(node) {
            values.push(node.key);
            node.children.forEach(visit);
        }

        roots.forEach(visit);

        return values;
    }

    function binomialLink(
        heap,
        first,
        second,
        steps
    ) {
        let parent = first;
        let child = second;

        if (second.key < first.key) {
            parent = second;
            child = first;
        }

        child.parent = parent;
        parent.children.push(child);

        parent.children.sort(
            function (firstChild, secondChild) {
                return (
                    secondChild.children.length -
                    firstChild.children.length
                );
            }
        );

        if (steps) {
            steps.push(makeStep(
                heap,
                [parent.id, child.id],
                "Link Equal Degrees",
                "Link root " +
                    child.key +
                    " below root " +
                    parent.key +
                    ".",
                "/* binomial link */",
                {
                    key: parent.key,
                    other: child.key
                }
            ));
        }

        return parent;
    }

    function normalizeBinomial(heap, steps) {
        const buckets = {};

        const roots = heap.roots
            .slice()
            .sort(function (first, second) {
                return (
                    first.children.length -
                    second.children.length
                );
            });

        heap.roots = roots.slice();

        roots.forEach(function (root) {
            let current = root;
            current.parent = null;

            let degree = current.children.length;

            while (buckets[degree]) {
                const other = buckets[degree];

                delete buckets[degree];

                heap.roots = heap.roots.filter(
                    function (candidate) {
                        return (
                            candidate !== current &&
                            candidate !== other
                        );
                    }
                );

                current = binomialLink(
                    heap,
                    current,
                    other,
                    steps
                );

                current.parent = null;
                heap.roots.push(current);
                degree = current.children.length;
            }

            buckets[degree] = current;
        });

        heap.roots = Object.keys(buckets)
            .map(Number)
            .sort(function (first, second) {
                return first - second;
            })
            .map(function (degree) {
                const root = buckets[degree];
                root.parent = null;
                return root;
            });

        if (steps) {
            steps.push(makeStep(
                heap,
                heap.roots.map(function (root) {
                    return root.id;
                }),
                "Finish Union",
                "Every root now has a unique degree.",
                "/* binomial union */",
                {
                    result: heap.roots
                        .map(function (root) {
                            return (
                                "B" +
                                root.children.length
                            );
                        })
                        .join(", ")
                }
            ));
        }
    }

    function insertBinomial(
        heap,
        key,
        steps
    ) {
        if (findMeldNode(heap.roots, key)) {
            if (steps) {
                steps.push(makeStep(
                    heap,
                    [],
                    "Duplicate Ignored",
                    "Key " +
                        key +
                        " is already stored.",
                    "/* binomial insert */",
                    {
                        key: key,
                        result: "Already stored"
                    }
                ));
            }

            return false;
        }

        const node = createMeldNode(key);
        heap.roots.push(node);

        if (steps) {
            steps.push(makeStep(
                heap,
                [node.id],
                "Insert Singleton",
                "Create a B₀ tree containing " +
                    key +
                    ".",
                "/* binomial insert */",
                {
                    key: key
                }
            ));
        }

        normalizeBinomial(heap, steps);

        return true;
    }

    function findBinomialMinimum(
        heap,
        steps
    ) {
        let minimum = null;

        heap.roots.forEach(function (root) {
            if (
                !minimum ||
                root.key < minimum.key
            ) {
                minimum = root;
            }

            if (steps) {
                steps.push(makeStep(
                    heap,
                    [root.id],
                    "Scan Root",
                    "Compare root " +
                        root.key +
                        " with the best minimum so far.",
                    "/* binomial find min */",
                    {
                        key: root.key,
                        result: String(minimum.key)
                    }
                ));
            }
        });

        return minimum;
    }

    function extractBinomialMinimum(
        heap,
        steps
    ) {
        const minimum =
            findBinomialMinimum(heap, steps);

        if (!minimum) {
            return null;
        }

        heap.roots = heap.roots.filter(
            function (root) {
                return root !== minimum;
            }
        );

        minimum.children.forEach(
            function (child) {
                child.parent = null;
                heap.roots.push(child);
            }
        );

        minimum.children = [];

        if (steps) {
            steps.push(makeStep(
                heap,
                heap.roots.map(function (root) {
                    return root.id;
                }),
                "Remove Minimum Root",
                "Remove " +
                    minimum.key +
                    ", reverse its children conceptually, and union them with the remaining forest.",
                "/* binomial extract min */",
                {
                    key: minimum.key,
                    result: String(minimum.key)
                }
            ));
        }

        normalizeBinomial(heap, steps);

        return minimum.key;
    }

    function decreaseBinomial(
        heap,
        oldKey,
        newKey,
        steps
    ) {
        let node = findMeldNode(
            heap.roots,
            oldKey
        );

        if (
            !node ||
            newKey > oldKey ||
            (
                newKey !== oldKey &&
                findMeldNode(heap.roots, newKey)
            )
        ) {
            if (steps) {
                steps.push(makeStep(
                    heap,
                    node ? [node.id] : [],
                    "Decrease Rejected",
                    "The target is missing, duplicated, or the new key is larger.",
                    "/* binomial decrease key */",
                    {
                        key: oldKey,
                        other: newKey,
                        result: "Not changed"
                    }
                ));
            }

            return false;
        }

        node.key = newKey;

        if (steps) {
            steps.push(makeStep(
                heap,
                [node.id],
                "Decrease Key",
                "Change " +
                    oldKey +
                    " to " +
                    newKey +
                    ".",
                "/* binomial decrease key */",
                {
                    key: oldKey,
                    other: newKey
                }
            ));
        }

        while (
            node.parent &&
            node.key < node.parent.key
        ) {
            const temporary = node.key;

            node.key = node.parent.key;
            node.parent.key = temporary;

            if (steps) {
                steps.push(makeStep(
                    heap,
                    [node.id, node.parent.id],
                    "Swap with Parent",
                    "Move the decreased priority toward a root.",
                    "/* binomial decrease key */",
                    {
                        key: newKey
                    }
                ));
            }

            node = node.parent;
        }

        return true;
    }

    function deleteBinomial(
        heap,
        key,
        steps
    ) {
        const node = findMeldNode(
            heap.roots,
            key
        );

        if (!node) {
            if (steps) {
                steps.push(makeStep(
                    heap,
                    [],
                    "Key Missing",
                    "Key " +
                        key +
                        " is not stored.",
                    "/* binomial delete */",
                    {
                        key: key,
                        result: "Not found"
                    }
                ));
            }

            return false;
        }

        if (steps) {
            steps.push(makeStep(
                heap,
                [node.id],
                "Prepare Deletion",
                "Decrease " +
                    key +
                    " to negative infinity, then extract the minimum.",
                "/* binomial delete */",
                {
                    key: key
                }
            ));
        }

        decreaseBinomial(
            heap,
            key,
            Number.NEGATIVE_INFINITY,
            steps
        );

        extractBinomialMinimum(heap, steps);

        return true;
    }

    function buildBinomialSteps(
        values,
        query,
        operation
    ) {
        nodeCounter = 0;

        const heap = {
            type: "binomial",
            roots: []
        };

        const steps = [
            makeStep(
                heap,
                [],
                "Create Empty Forest",
                "Create an empty Binomial Min-Heap.",
                "/* binomial create */"
            )
        ];

        values.forEach(function (value) {
            insertBinomial(
                heap,
                value,
                steps
            );
        });

        if (operation === "build") {
            return completeSteps(
                steps,
                heap,
                "binomial",
                "Build",
                values.length + " keys stored"
            );
        }

        if (operation === "insert") {
            const inserted = insertBinomial(
                heap,
                query,
                steps
            );

            return completeSteps(
                steps,
                heap,
                "binomial",
                "Insertion",
                inserted
                    ? "Inserted " + query
                    : "Already stored"
            );
        }

        if (operation === "find-min") {
            const minimum =
                findBinomialMinimum(
                    heap,
                    steps
                );

            return completeSteps(
                steps,
                heap,
                "binomial",
                "Find Minimum",
                "Minimum = " + minimum.key
            );
        }

        if (operation === "extract-min") {
            const minimum =
                extractBinomialMinimum(
                    heap,
                    steps
                );

            return completeSteps(
                steps,
                heap,
                "binomial",
                "Extract Minimum",
                "Extracted " + minimum
            );
        }

        if (operation === "decrease") {
            const changed = decreaseBinomial(
                heap,
                query.oldKey,
                query.newKey,
                steps
            );

            return completeSteps(
                steps,
                heap,
                "binomial",
                "Decrease Key",
                changed
                    ? (
                        query.oldKey +
                        " → " +
                        query.newKey
                    )
                    : "Not changed"
            );
        }

        if (operation === "delete") {
            const deleted = deleteBinomial(
                heap,
                query,
                steps
            );

            return completeSteps(
                steps,
                heap,
                "binomial",
                "Deletion",
                deleted
                    ? "Deleted " + query
                    : "Not found"
            );
        }

        const second = {
            type: "binomial",
            roots: []
        };

        query.forEach(function (value) {
            insertBinomial(
                second,
                value,
                null
            );
        });

        heap.roots =
            heap.roots.concat(second.roots);

        heap.roots.forEach(function (root) {
            root.parent = null;
        });

        steps.push(makeStep(
            heap,
            heap.roots.map(function (root) {
                return root.id;
            }),
            "Merge Root Lists",
            "Combine both forests, then link duplicate degrees.",
            "/* binomial union */",
            {
                result:
                    query.length +
                    " incoming keys"
            }
        ));

        normalizeBinomial(heap, steps);

        return completeSteps(
            steps,
            heap,
            "binomial",
            "Union",
            allMeldKeys(heap.roots).length +
                " keys stored"
        );
    }

    function fibMinimum(heap) {
        if (!heap.roots.length) {
            return null;
        }

        return heap.roots.reduce(
            function (best, root) {
                return root.key < best.key
                    ? root
                    : best;
            },
            heap.roots[0]
        );
    }

    function insertFibonacci(
        heap,
        key,
        steps
    ) {
        if (findMeldNode(heap.roots, key)) {
            if (steps) {
                steps.push(makeStep(
                    heap,
                    [],
                    "Duplicate Ignored",
                    "Key " +
                        key +
                        " is already stored.",
                    "/* fibonacci insert */",
                    {
                        key: key,
                        result: "Already stored"
                    }
                ));
            }

            return false;
        }

        const node = createMeldNode(key);

        heap.roots.push(node);

        heap.minimum =
            !heap.minimum ||
            key < heap.minimum.key
                ? node
                : heap.minimum;

        if (steps) {
            steps.push(makeStep(
                heap,
                [node.id],
                "Lazy Insert",
                "Add " +
                    key +
                    " directly to the root list and update the minimum pointer.",
                "/* fibonacci insert */",
                {
                    key: key,
                    result:
                        "Minimum = " +
                        heap.minimum.key
                }
            ));
        }

        return true;
    }

    function linkFibonacci(
        heap,
        first,
        second,
        steps
    ) {
        let parent = first;
        let child = second;

        if (second.key < first.key) {
            parent = second;
            child = first;
        }

        heap.roots = heap.roots.filter(
            function (root) {
                return root !== child;
            }
        );

        child.parent = parent;
        child.mark = false;
        parent.children.push(child);

        if (steps) {
            steps.push(makeStep(
                heap,
                [parent.id, child.id],
                "Link Equal Degrees",
                "Link root " +
                    child.key +
                    " below smaller root " +
                    parent.key +
                    ".",
                "/* fibonacci link */",
                {
                    key: parent.key,
                    other: child.key
                }
            ));
        }

        return parent;
    }

    function consolidateFibonacci(
        heap,
        steps
    ) {
        if (steps) {
            steps.push(makeStep(
                heap,
                heap.roots.map(function (root) {
                    return root.id;
                }),
                "Begin Consolidation",
                "Repeatedly link roots with equal degree.",
                "/* fibonacci consolidate */"
            ));
        }

        let linked = true;

        while (linked) {
            linked = false;

            const byDegree = {};

            for (
                let index = 0;
                index < heap.roots.length;
                index += 1
            ) {
                const root = heap.roots[index];
                const degree =
                    root.children.length;

                if (
                    byDegree[degree] &&
                    byDegree[degree] !== root
                ) {
                    linkFibonacci(
                        heap,
                        byDegree[degree],
                        root,
                        steps
                    );

                    linked = true;
                    break;
                }

                byDegree[degree] = root;
            }
        }

        heap.roots.sort(
            function (first, second) {
                return (
                    first.children.length -
                    second.children.length
                );
            }
        );

        heap.minimum = fibMinimum(heap);

        if (steps) {
            steps.push(makeStep(
                heap,
                heap.minimum
                    ? [heap.minimum.id]
                    : [],
                "Finish Consolidation",
                "Root degrees are unique and the minimum pointer is refreshed.",
                "/* fibonacci consolidate */",
                {
                    result: heap.minimum
                        ? (
                            "Minimum = " +
                            heap.minimum.key
                        )
                        : "Empty"
                }
            ));
        }
    }

    function extractFibonacciMinimum(
        heap,
        steps
    ) {
        const minimum =
            heap.minimum || fibMinimum(heap);

        if (!minimum) {
            return null;
        }

        heap.roots = heap.roots.filter(
            function (root) {
                return root !== minimum;
            }
        );

        minimum.children.forEach(
            function (child) {
                child.parent = null;
                child.mark = false;
                heap.roots.push(child);
            }
        );

        minimum.children = [];
        heap.minimum = fibMinimum(heap);

        if (steps) {
            steps.push(makeStep(
                heap,
                heap.roots.map(function (root) {
                    return root.id;
                }),
                "Remove Minimum",
                "Remove " +
                    minimum.key +
                    " and promote all of its children to roots.",
                "/* fibonacci extract min */",
                {
                    key: minimum.key,
                    result: String(minimum.key)
                }
            ));
        }

        if (heap.roots.length) {
            consolidateFibonacci(
                heap,
                steps
            );
        }

        return minimum.key;
    }

    function cutFibonacci(
        heap,
        node,
        parent,
        steps
    ) {
        parent.children = parent.children.filter(
            function (child) {
                return child !== node;
            }
        );

        node.parent = null;
        node.mark = false;

        heap.roots.push(node);

        if (steps) {
            steps.push(makeStep(
                heap,
                [node.id, parent.id],
                "Cut Node",
                "Cut " +
                    node.key +
                    " from parent " +
                    parent.key +
                    " and move it to the root list.",
                "/* fibonacci cut */",
                {
                    key: node.key,
                    other: parent.key
                }
            ));
        }
    }

    function cascadingCutFibonacci(
        heap,
        node,
        steps
    ) {
        const parent = node.parent;

        if (!parent) {
            return;
        }

        if (!node.mark) {
            node.mark = true;

            if (steps) {
                steps.push(makeStep(
                    heap,
                    [node.id],
                    "Mark Parent",
                    "This is the first child lost by " +
                        node.key +
                        ", so mark it.",
                    "/* fibonacci cascading cut */",
                    {
                        key: node.key
                    }
                ));
            }
        } else {
            cutFibonacci(
                heap,
                node,
                parent,
                steps
            );

            if (steps) {
                steps.push(makeStep(
                    heap,
                    [node.id],
                    "Cascade Upward",
                    "The marked node lost another child, so continue the cut upward.",
                    "/* fibonacci cascading cut */",
                    {
                        key: node.key
                    }
                ));
            }

            cascadingCutFibonacci(
                heap,
                parent,
                steps
            );
        }
    }

    function decreaseFibonacci(
        heap,
        oldKey,
        newKey,
        steps
    ) {
        const node = findMeldNode(
            heap.roots,
            oldKey
        );

        if (
            !node ||
            newKey > oldKey ||
            (
                newKey !== oldKey &&
                findMeldNode(heap.roots, newKey)
            )
        ) {
            if (steps) {
                steps.push(makeStep(
                    heap,
                    node ? [node.id] : [],
                    "Decrease Rejected",
                    "The target is missing, duplicated, or the new key is larger.",
                    "/* fibonacci decrease key */",
                    {
                        key: oldKey,
                        other: newKey,
                        result: "Not changed"
                    }
                ));
            }

            return false;
        }

        node.key = newKey;

        if (steps) {
            steps.push(makeStep(
                heap,
                [node.id],
                "Decrease Key",
                "Change " +
                    oldKey +
                    " to " +
                    newKey +
                    ".",
                "/* fibonacci decrease key */",
                {
                    key: oldKey,
                    other: newKey
                }
            ));
        }

        const parent = node.parent;

        if (
            parent &&
            node.key < parent.key
        ) {
            cutFibonacci(
                heap,
                node,
                parent,
                steps
            );

            cascadingCutFibonacci(
                heap,
                parent,
                steps
            );
        }

        heap.minimum = fibMinimum(heap);

        return true;
    }

    function deleteFibonacci(
        heap,
        key,
        steps
    ) {
        const node = findMeldNode(
            heap.roots,
            key
        );

        if (!node) {
            if (steps) {
                steps.push(makeStep(
                    heap,
                    [],
                    "Key Missing",
                    "Key " +
                        key +
                        " is not stored.",
                    "/* fibonacci delete */",
                    {
                        key: key,
                        result: "Not found"
                    }
                ));
            }

            return false;
        }

        if (steps) {
            steps.push(makeStep(
                heap,
                [node.id],
                "Prepare Deletion",
                "Decrease " +
                    key +
                    " to negative infinity, then extract it.",
                "/* fibonacci delete */",
                {
                    key: key
                }
            ));
        }

        decreaseFibonacci(
            heap,
            key,
            Number.NEGATIVE_INFINITY,
            steps
        );

        extractFibonacciMinimum(
            heap,
            steps
        );

        return true;
    }

    function buildFibonacciSteps(
        values,
        query,
        operation
    ) {
        nodeCounter = 0;

        const heap = {
            type: "fibonacci",
            roots: [],
            minimum: null
        };

        const steps = [
            makeStep(
                heap,
                [],
                "Create Empty Root List",
                "Create an empty Fibonacci Min-Heap.",
                "/* fibonacci create */"
            )
        ];

        values.forEach(function (value) {
            insertFibonacci(
                heap,
                value,
                steps
            );
        });

        if (operation === "build") {
            return completeSteps(
                steps,
                heap,
                "fibonacci",
                "Build",
                values.length +
                    " lazy roots stored"
            );
        }

        if (operation === "insert") {
            const inserted = insertFibonacci(
                heap,
                query,
                steps
            );

            return completeSteps(
                steps,
                heap,
                "fibonacci",
                "Insertion",
                inserted
                    ? "Inserted " + query
                    : "Already stored"
            );
        }

        if (operation === "find-min") {
            steps.push(makeStep(
                heap,
                [heap.minimum.id],
                "Read Minimum Pointer",
                "The minimum pointer directly identifies " +
                    heap.minimum.key +
                    ".",
                "/* fibonacci find min */",
                {
                    key: heap.minimum.key,
                    result: String(
                        heap.minimum.key
                    )
                }
            ));

            return completeSteps(
                steps,
                heap,
                "fibonacci",
                "Find Minimum",
                "Minimum = " +
                    heap.minimum.key
            );
        }

        if (operation === "extract-min") {
            const value =
                extractFibonacciMinimum(
                    heap,
                    steps
                );

            return completeSteps(
                steps,
                heap,
                "fibonacci",
                "Extract Minimum",
                "Extracted " + value
            );
        }

        if (
            operation === "decrease" ||
            operation === "delete"
        ) {
            steps.push(makeStep(
                heap,
                heap.roots.map(function (root) {
                    return root.id;
                }),
                "Existing Consolidated State",
                "Consolidate the current roots to model a heap after an earlier extract-min.",
                "/* fibonacci consolidate */"
            ));

            consolidateFibonacci(
                heap,
                steps
            );
        }

        if (operation === "decrease") {
            const changed = decreaseFibonacci(
                heap,
                query.oldKey,
                query.newKey,
                steps
            );

            return completeSteps(
                steps,
                heap,
                "fibonacci",
                "Decrease Key",
                changed
                    ? (
                        query.oldKey +
                        " → " +
                        query.newKey
                    )
                    : "Not changed"
            );
        }

        if (operation === "delete") {
            const deleted = deleteFibonacci(
                heap,
                query,
                steps
            );

            return completeSteps(
                steps,
                heap,
                "fibonacci",
                "Deletion",
                deleted
                    ? "Deleted " + query
                    : "Not found"
            );
        }

        const second = {
            type: "fibonacci",
            roots: [],
            minimum: null
        };

        query.forEach(function (value) {
            insertFibonacci(
                second,
                value,
                null
            );
        });

        heap.roots =
            heap.roots.concat(second.roots);

        heap.minimum = fibMinimum(heap);

        steps.push(makeStep(
            heap,
            heap.roots.map(function (root) {
                return root.id;
            }),
            "Concatenate Root Lists",
            "Union lazily concatenates the two root lists without consolidation.",
            "/* fibonacci union */",
            {
                result:
                    "Minimum = " +
                    heap.minimum.key
            }
        ));

        return completeSteps(
            steps,
            heap,
            "fibonacci",
            "Union",
            allMeldKeys(heap.roots).length +
                " keys stored"
        );
    }

    const definitions = {
        "binary-min": {
            label: "Binary Min-Heap",
            codeKey: "binary-heap",
            exampleData:
                "12, 3, 17, 8, 25, 1, 10"
        },
        "binary-max": {
            label: "Binary Max-Heap",
            codeKey: "binary-heap",
            exampleData:
                "12, 3, 17, 8, 25, 1, 10"
        },
        binomial: {
            label: "Binomial Min-Heap",
            codeKey: "binomial-heap",
            exampleData:
                "10, 3, 17, 8, 25, 1, 12, 6"
        },
        fibonacci: {
            label: "Fibonacci Min-Heap",
            codeKey: "fibonacci-heap",
            exampleData:
                "10, 3, 17, 8, 25, 1, 12, 6"
        }
    };

    const binaryOperations = [
        {
            value: "build",
            label: "Build Heap",
            queryLabel: "No value required",
            example: "",
            type: "none"
        },
        {
            value: "insert",
            label: "Insert Key",
            queryLabel: "Key to Insert",
            example: "5",
            type: "single"
        },
        {
            value: "peek",
            label: "Peek Root",
            queryLabel: "No value required",
            example: "",
            type: "none"
        },
        {
            value: "extract",
            label: "Extract Root",
            queryLabel: "No value required",
            example: "",
            type: "none"
        },
        {
            value: "change",
            label: "Change Key",
            queryLabel: "Old Key, New Key",
            example: "17, 2",
            type: "pair"
        },
        {
            value: "delete",
            label: "Delete Key",
            queryLabel: "Key to Delete",
            example: "8",
            type: "single"
        },
        {
            value: "sort",
            label: "Heap Sort",
            queryLabel: "No value required",
            example: "",
            type: "none"
        }
    ];

    const mergeableOperations = [
        {
            value: "build",
            label: "Build Heap",
            queryLabel: "No value required",
            example: "",
            type: "none"
        },
        {
            value: "insert",
            label: "Insert Key",
            queryLabel: "Key to Insert",
            example: "5",
            type: "single"
        },
        {
            value: "find-min",
            label: "Find Minimum",
            queryLabel: "No value required",
            example: "",
            type: "none"
        },
        {
            value: "extract-min",
            label: "Extract Minimum",
            queryLabel: "No value required",
            example: "",
            type: "none"
        },
        {
            value: "decrease",
            label: "Decrease Key",
            queryLabel: "Old Key, New Key",
            example: "17, 2",
            type: "decrease"
        },
        {
            value: "delete",
            label: "Delete Key",
            queryLabel: "Key to Delete",
            example: "8",
            type: "single"
        },
        {
            value: "union",
            label: "Union with Keys",
            queryLabel: "Second Heap Keys",
            example: "4, 14, 22",
            type: "sequence"
        }
    ];

    function operationsFor(structure) {
        return structure.indexOf("binary-") === 0
            ? binaryOperations
            : mergeableOperations;
    }

    function operationFor(
        structure,
        operation
    ) {
        return operationsFor(structure).find(
            function (item) {
                return item.value === operation;
            }
        ) || operationsFor(structure)[0];
    }

    function populateOperations(
        select,
        structure,
        selected
    ) {
        select.innerHTML = "";

        operationsFor(structure).forEach(
            function (item) {
                const option =
                    document.createElement("option");

                option.value = item.value;
                option.textContent = item.label;

                select.appendChild(option);
            }
        );

        select.value =
            selected &&
            operationsFor(structure).some(
                function (item) {
                    return item.value === selected;
                }
            )
                ? selected
                : "build";
    }

    function updateQueryControl(
        structure,
        operation,
        label,
        input
    ) {
        const definition = operationFor(
            structure,
            operation
        );

        label.firstChild.textContent =
            definition.queryLabel;

        input.disabled =
            definition.type === "none";

        input.value = definition.example;
    }

    function parseIntegerSequence(
        text,
        minimumLength,
        maximumLength,
        label
    ) {
        const values = text
            .trim()
            .split(/[\s,]+/)
            .filter(Boolean)
            .map(Number);

        if (
            values.length < minimumLength ||
            values.length > maximumLength ||
            values.some(function (value) {
                return (
                    !Number.isInteger(value) ||
                    value < -99 ||
                    value > 999
                );
            })
        ) {
            throw new Error(
                "Enter " +
                    minimumLength +
                    " to " +
                    maximumLength +
                    " distinct integers from -99 to 999 for " +
                    label +
                    "."
            );
        }

        if (
            new Set(values).size !==
            values.length
        ) {
            throw new Error(
                "Use distinct keys in " +
                    label +
                    "."
            );
        }

        return values;
    }

    function parseInputs(
        structure,
        operation,
        dataInput,
        queryInput
    ) {
        const values = parseIntegerSequence(
            dataInput.value,
            3,
            12,
            "the heap"
        );

        dataInput.value = values.join(", ");

        const definition = operationFor(
            structure,
            operation
        );

        if (definition.type === "none") {
            return {
                data: values,
                query: null
            };
        }

        if (definition.type === "sequence") {
            const second = parseIntegerSequence(
                queryInput.value,
                1,
                8,
                "the second heap"
            );

            if (
                second.some(function (value) {
                    return (
                        values.indexOf(value) !== -1
                    );
                })
            ) {
                throw new Error(
                    "The second heap must not repeat keys from the first heap."
                );
            }

            queryInput.value =
                second.join(", ");

            return {
                data: values,
                query: second
            };
        }

        if (
            definition.type === "pair" ||
            definition.type === "decrease"
        ) {
            const pair = queryInput.value
                .trim()
                .split(/[\s,]+/)
                .filter(Boolean)
                .map(Number);

            if (
                pair.length !== 2 ||
                pair.some(function (value) {
                    return (
                        !Number.isInteger(value) ||
                        value < -99 ||
                        value > 999
                    );
                })
            ) {
                throw new Error(
                    "Enter exactly two integers: old key, new key."
                );
            }

            if (
                definition.type === "decrease" &&
                pair[1] > pair[0]
            ) {
                throw new Error(
                    "The new key must be smaller than or equal to the old key."
                );
            }

            queryInput.value =
                pair.join(", ");

            return {
                data: values,
                query: {
                    oldKey: pair[0],
                    newKey: pair[1]
                }
            };
        }

        const query =
            Number(queryInput.value.trim());

        if (
            !Number.isInteger(query) ||
            query < -99 ||
            query > 999
        ) {
            throw new Error(
                "Enter one integer key from -99 to 999."
            );
        }

        queryInput.value = String(query);

        return {
            data: values,
            query: query
        };
    }

    function buildSteps(
        structure,
        data,
        query,
        operation
    ) {
        if (structure === "binomial") {
            return buildBinomialSteps(
                data,
                query,
                operation
            );
        }

        if (structure === "fibonacci") {
            return buildFibonacciSteps(
                data,
                query,
                operation
            );
        }

        return buildBinarySteps(
            data,
            query,
            operation,
            structure
        );
    }

    function svgElement(name, attributes) {
        const element =
            document.createElementNS(
                SVG_NS,
                name
            );

        Object.keys(attributes || {}).forEach(
            function (key) {
                element.setAttribute(
                    key,
                    attributes[key]
                );
            }
        );

        return element;
    }

    function renderHeap(
        svg,
        roots,
        active,
        structure
    ) {
        svg.innerHTML = "";

        if (!roots.length) {
            svg.setAttribute(
                "viewBox",
                "0 0 900 190"
            );

            svg.style.height = "190px";

            const empty = svgElement(
                "text",
                {
                    x: "450",
                    y: "96",
                    "text-anchor": "middle",
                    fill: "#64748b",
                    "font-size": "18",
                    "font-weight": "700"
                }
            );

            empty.textContent = "Empty heap";
            svg.appendChild(empty);

            return;
        }

        const items = [];
        const edges = [];

        let leafSlot = 0;

        function layout(node, depth) {
            const children = node.children.map(
                function (child) {
                    const item = layout(
                        child,
                        depth + 1
                    );

                    edges.push({
                        fromNode: node,
                        to: item
                    });

                    return item;
                }
            );

            let slot;

            if (!children.length) {
                slot = leafSlot;
                leafSlot += 1;
            } else {
                slot = children.reduce(
                    function (sum, child) {
                        return sum + child.slot;
                    },
                    0
                ) / children.length;
            }

            const item = {
                node: node,
                depth: depth,
                slot: slot,
                children: children
            };

            items.push(item);

            return item;
        }

        const rootItems = roots.map(
            function (root, index) {
                if (index > 0) {
                    leafSlot += 0.65;
                }

                return layout(root, 0);
            }
        );

        const width = Math.max(
            900,
            Math.ceil(
                Math.max(1, leafSlot)
            ) * 105
        );

        const maxDepth = items.reduce(
            function (best, item) {
                return Math.max(
                    best,
                    item.depth
                );
            },
            0
        );

        const height = Math.max(
            210,
            110 + maxDepth * 95
        );

        items.forEach(function (item) {
            item.x = leafSlot <= 1
                ? width / 2
                : (
                    58 +
                    item.slot *
                    (
                        (width - 116) /
                        Math.max(
                            1,
                            leafSlot - 1
                        )
                    )
                );

            item.y =
                52 + item.depth * 95;
        });

        function findItem(node) {
            return items.find(
                function (item) {
                    return item.node === node;
                }
            );
        }

        edges.forEach(function (edge) {
            const from =
                findItem(edge.fromNode);

            if (!from) {
                return;
            }

            svg.appendChild(svgElement(
                "line",
                {
                    x1: from.x,
                    y1: from.y + 24,
                    x2: edge.to.x,
                    y2: edge.to.y - 24,
                    stroke: "#94a3b8",
                    "stroke-width": "2.5"
                }
            ));
        });

        if (rootItems.length > 1) {
            for (
                let index = 0;
                index < rootItems.length - 1;
                index += 1
            ) {
                svg.appendChild(svgElement(
                    "line",
                    {
                        x1:
                            rootItems[index].x +
                            25,
                        y1: rootItems[index].y,
                        x2:
                            rootItems[index + 1].x -
                            25,
                        y2:
                            rootItems[index + 1].y,
                        stroke:
                            structure ===
                            "fibonacci"
                                ? "#f97316"
                                : "#7c3aed",
                        "stroke-width": "2",
                        "stroke-dasharray":
                            "6 5"
                    }
                ));
            }
        }

        const colors =
            structure === "fibonacci"
                ? {
                    fill: "#c2410c",
                    stroke: "#fed7aa"
                }
                : structure === "binomial"
                    ? {
                        fill: "#7c3aed",
                        stroke: "#ddd6fe"
                    }
                    : structure === "binary-max"
                        ? {
                            fill: "#be123c",
                            stroke: "#fecdd3"
                        }
                        : {
                            fill: "#0f766e",
                            stroke: "#99f6e4"
                        };

        items.forEach(function (item) {
            const activeNode =
                active.indexOf(
                    item.node.id
                ) !== -1;

            const group =
                svgElement("g", {});

            group.appendChild(svgElement(
                "circle",
                {
                    cx: item.x,
                    cy: item.y,
                    r: activeNode
                        ? "28"
                        : "25",
                    fill: activeNode
                        ? "#f59e0b"
                        : colors.fill,
                    stroke: activeNode
                        ? "#fef3c7"
                        : colors.stroke,
                    "stroke-width":
                        activeNode
                            ? "5"
                            : "3"
                }
            ));

            if (item.node.mark) {
                group.appendChild(svgElement(
                    "circle",
                    {
                        cx: item.x,
                        cy: item.y,
                        r: "20",
                        fill: "none",
                        stroke: "#fde68a",
                        "stroke-width": "2",
                        "stroke-dasharray":
                            "4 3"
                    }
                ));
            }

            const key = svgElement(
                "text",
                {
                    x: item.x,
                    y: item.y + 6,
                    "text-anchor": "middle",
                    fill: "#ffffff",
                    "font-size": "15",
                    "font-weight": "900"
                }
            );

            key.textContent =
                item.node.key ===
                Number.NEGATIVE_INFINITY
                    ? "−∞"
                    : String(item.node.key);

            group.appendChild(key);

            const degree = svgElement(
                "text",
                {
                    x: item.x,
                    y: item.y + 42,
                    "text-anchor": "middle",
                    fill: "#475569",
                    "font-size": "11",
                    "font-weight": "800"
                }
            );

            degree.textContent =
                structure.indexOf(
                    "binary-"
                ) === 0
                    ? item.node.id.replace(
                        "heap-index-",
                        "i="
                    )
                    : (
                        "degree " +
                        item.node.children.length +
                        (
                            item.node.mark
                                ? " • marked"
                                : ""
                        )
                    );

            group.appendChild(degree);
            svg.appendChild(group);
        });

        svg.setAttribute(
            "viewBox",
            "0 0 " +
                width +
                " " +
                height
        );

        svg.style.height =
            Math.min(430, height) + "px";
    }

    function forestSummary(
        step,
        structure
    ) {
        if (
            structure.indexOf("binary-") === 0
        ) {
            return (
                "Array: [" +
                step.array.join(", ") +
                "]"
            );
        }

        return (
            "Root list: " +
            (
                step.forest.length
                    ? step.forest
                        .map(function (root) {
                            return (
                                root.key +
                                "(d" +
                                root.children.length +
                                ")"
                            );
                        })
                        .join(" → ")
                    : "empty"
            )
        );
    }

    const visualizer = {
        structure:
            document.getElementById(
                "heapStructure"
            ),
        operation:
            document.getElementById(
                "heapOperation"
            ),
        data:
            document.getElementById(
                "heapDataInput"
            ),
        query:
            document.getElementById(
                "heapQueryInput"
            ),
        queryLabel:
            document.getElementById(
                "heapQueryLabel"
            ),
        load:
            document.getElementById(
                "loadHeapVisualizer"
            ),
        prompt:
            document.getElementById(
                "heapPrompt"
            ),
        result:
            document.getElementById(
                "heapResult"
            ),
        svg:
            document.getElementById(
                "heapTreeSvg"
            ),
        array:
            document.getElementById(
                "heapArrayView"
            ),
        message:
            document.getElementById(
                "heapMessage"
            ),
        progress:
            document.getElementById(
                "heapProgress"
            ),
        structureValue:
            document.getElementById(
                "heapStructureValue"
            ),
        operationValue:
            document.getElementById(
                "heapOperationValue"
            ),
        phase:
            document.getElementById(
                "heapPhase"
            ),
        nodes:
            document.getElementById(
                "heapNodes"
            ),
        height:
            document.getElementById(
                "heapHeight"
            ),
        resultValue:
            document.getElementById(
                "heapResultValue"
            ),
        previous:
            document.getElementById(
                "heapPrevious"
            ),
        next:
            document.getElementById(
                "heapNext"
            ),
        auto:
            document.getElementById(
                "heapAuto"
            ),
        pause:
            document.getElementById(
                "heapPause"
            ),
        reset:
            document.getElementById(
                "heapReset"
            ),
        status:
            document.getElementById(
                "heapStatus"
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

        renderHeap(
            visualizer.svg,
            step.forest,
            step.active,
            visualizer.structure.value
        );

        visualizer.array.textContent =
            forestSummary(
                step,
                visualizer.structure.value
            );

        visualizer.message.textContent =
            step.message;

        visualizer.structureValue.textContent =
            definitions[
                visualizer.structure.value
            ].label;

        visualizer.operationValue.textContent =
            operationFor(
                visualizer.structure.value,
                visualizer.operation.value
            ).label;

        visualizer.phase.textContent =
            step.phase;

        visualizer.nodes.textContent =
            String(step.nodes);

        visualizer.height.textContent =
            String(step.height);

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

        visualizer.status.textContent =
            "Step " +
            visualIndex +
            " of " +
            (visualSteps.length - 1);

        visualizer.previous.disabled =
            visualIndex === 0;

        visualizer.next.disabled =
            visualIndex ===
            visualSteps.length - 1;
    }

    function loadVisual() {
        let parsed;

        try {
            parsed = parseInputs(
                visualizer.structure.value,
                visualizer.operation.value,
                visualizer.data,
                visualizer.query
            );

            visualSteps = buildSteps(
                visualizer.structure.value,
                parsed.data,
                parsed.query,
                visualizer.operation.value
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

    function changeVisualStructure() {
        const definition =
            definitions[
                visualizer.structure.value
            ];

        visualizer.data.value =
            definition.exampleData;

        populateOperations(
            visualizer.operation,
            visualizer.structure.value,
            "build"
        );

        updateQueryControl(
            visualizer.structure.value,
            visualizer.operation.value,
            visualizer.queryLabel,
            visualizer.query
        );

        invalidateVisual();
    }

    function changeVisualOperation() {
        updateQueryControl(
            visualizer.structure.value,
            visualizer.operation.value,
            visualizer.queryLabel,
            visualizer.query
        );

        invalidateVisual();
    }

    if (visualizer.load) {
        populateOperations(
            visualizer.operation,
            visualizer.structure.value,
            "build"
        );

        updateQueryControl(
            visualizer.structure.value,
            visualizer.operation.value,
            visualizer.queryLabel,
            visualizer.query
        );

        visualizer.load.addEventListener(
            "click",
            loadVisual
        );

        visualizer.structure.addEventListener(
            "change",
            changeVisualStructure
        );

        visualizer.operation.addEventListener(
            "change",
            changeVisualOperation
        );

        [
            visualizer.data,
            visualizer.query
        ].forEach(function (input) {
            input.addEventListener(
                "input",
                invalidateVisual
            );
        });

        document
            .querySelectorAll(
                "[data-heap-example]"
            )
            .forEach(function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        visualizer.structure.value =
                            button.dataset.heapExample;

                        changeVisualStructure();
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
                        850
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
        structure:
            document.getElementById(
                "heapTraceStructure"
            ),
        operation:
            document.getElementById(
                "heapTraceOperation"
            ),
        data:
            document.getElementById(
                "heapTraceData"
            ),
        query:
            document.getElementById(
                "heapTraceQuery"
            ),
        queryLabel:
            document.getElementById(
                "heapTraceQueryLabel"
            ),
        load:
            document.getElementById(
                "loadHeapTracer"
            ),
        prompt:
            document.getElementById(
                "heapTracePrompt"
            ),
        result:
            document.getElementById(
                "heapTraceResult"
            ),
        title:
            document.getElementById(
                "heapTraceTitle"
            ),
        codeWindow:
            document.getElementById(
                "heapTraceCodeWindow"
            ),
        code:
            document.getElementById(
                "heapTraceCode"
            ),
        message:
            document.getElementById(
                "heapTraceMessage"
            ),
        variables:
            document.getElementById(
                "heapTraceVariables"
            ),
        svg:
            document.getElementById(
                "heapTraceSvg"
            ),
        output:
            document.getElementById(
                "heapTraceOutput"
            ),
        status:
            document.getElementById(
                "heapTraceStatus"
            ),
        previous:
            document.getElementById(
                "heapTracePrevious"
            ),
        next:
            document.getElementById(
                "heapTraceNext"
            ),
        auto:
            document.getElementById(
                "heapTraceAuto"
            ),
        pause:
            document.getElementById(
                "heapTracePause"
            ),
        reset:
            document.getElementById(
                "heapTraceReset"
            )
    };

    let traceSteps = [];
    let traceIndex = 0;
    let traceTimer = null;
    let traceLookupLines = [];
    let activeTraceDefinition = null;

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
        const source =
            document.querySelector(
                '[data-c-program="' +
                    definition.codeKey +
                    '"]'
            );

        if (!source) {
            throw new Error(
                "The selected C program could not be found."
            );
        }

        const text = source.textContent
            .replace(/\r/g, "")
            .replace(/^\n+|\n+$/g, "");

        traceLookupLines =
            text.split("\n");

        tracer.code.innerHTML = "";

        traceLookupLines.forEach(
            function (sourceLine, index) {
                const line = sourceLine
                    .replace(
                        /\s*\/\*\s*(?:heap|binomial|fibonacci)[^*]*\*\//g,
                        ""
                    )
                    .replace(/\s+$/g, "");

                const row =
                    document.createElement(
                        "span"
                    );

                row.dataset.heapTraceLine =
                    String(index + 1);

                row.textContent =
                    String(index + 1)
                        .padStart(3, "0") +
                    " │ " +
                    (line || " ");

                tracer.code.appendChild(row);
            }
        );

        tracer.codeWindow.scrollTop = 0;
    }

    function findLine(needle) {
        for (
            let index = 0;
            index < traceLookupLines.length;
            index += 1
        ) {
            if (
                traceLookupLines[index]
                    .indexOf(needle) !== -1
            ) {
                return index + 1;
            }
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

    function renderTrace() {
        if (!traceSteps.length) {
            return;
        }

        const step =
            traceSteps[traceIndex];

        let activeLine = null;

        tracer.code
            .querySelectorAll(
                "[data-heap-trace-line]"
            )
            .forEach(function (line) {
                const active =
                    Number(
                        line.dataset
                            .heapTraceLine
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
            "Heap",
            activeTraceDefinition.label
        );

        appendVariable(
            "Phase",
            step.phase
        );

        appendVariable(
            "Key",
            step.key
        );

        appendVariable(
            "Other Key",
            step.other
        );

        appendVariable(
            "Index",
            step.index
        );

        appendVariable(
            "Nodes",
            step.nodes
        );

        appendVariable(
            "Height",
            step.height
        );

        appendVariable(
            "Comparisons",
            step.comparisons
        );

        appendVariable(
            "Swaps",
            step.swaps
        );

        renderHeap(
            tracer.svg,
            step.forest,
            step.active,
            tracer.structure.value
        );

        tracer.output.textContent =
            step.complete
                ? step.result
                : "—";

        tracer.status.textContent =
            "Step " +
            traceIndex +
            " of " +
            (traceSteps.length - 1);

        tracer.previous.disabled =
            traceIndex === 0;

        tracer.next.disabled =
            traceIndex ===
            traceSteps.length - 1;

        if (activeLine) {
            const top =
                activeLine.offsetTop -
                tracer.codeWindow.clientHeight /
                    2 +
                activeLine.offsetHeight / 2;

            tracer.codeWindow.scrollTo({
                top: Math.max(0, top),
                behavior: "smooth"
            });
        }
    }

    function loadTrace() {
        const definition =
            definitions[
                tracer.structure.value
            ];

        let parsed;

        try {
            parsed = parseInputs(
                tracer.structure.value,
                tracer.operation.value,
                tracer.data,
                tracer.query
            );

            loadCode(definition);

            traceSteps = decorate(
                buildSteps(
                    tracer.structure.value,
                    parsed.data,
                    parsed.query,
                    tracer.operation.value
                )
            );
        } catch (error) {
            window.alert(error.message);
            return;
        }

        stopTrace();

        activeTraceDefinition = definition;
        traceIndex = 0;

        tracer.title.textContent =
            "PROGRAM TRACING — " +
            definition.label.toUpperCase() +
            " — " +
            operationFor(
                tracer.structure.value,
                tracer.operation.value
            ).label.toUpperCase();

        tracer.prompt.hidden = true;
        tracer.result.hidden = false;

        renderTrace();
    }

    function changeTraceStructure() {
        const definition =
            definitions[
                tracer.structure.value
            ];

        tracer.data.value =
            definition.exampleData;

        populateOperations(
            tracer.operation,
            tracer.structure.value,
            "build"
        );

        updateQueryControl(
            tracer.structure.value,
            tracer.operation.value,
            tracer.queryLabel,
            tracer.query
        );

        invalidateTrace();
    }

    function changeTraceOperation() {
        updateQueryControl(
            tracer.structure.value,
            tracer.operation.value,
            tracer.queryLabel,
            tracer.query
        );

        invalidateTrace();
    }

    if (tracer.load) {
        populateOperations(
            tracer.operation,
            tracer.structure.value,
            "build"
        );

        updateQueryControl(
            tracer.structure.value,
            tracer.operation.value,
            tracer.queryLabel,
            tracer.query
        );

        tracer.load.addEventListener(
            "click",
            loadTrace
        );

        tracer.structure.addEventListener(
            "change",
            changeTraceStructure
        );

        tracer.operation.addEventListener(
            "change",
            changeTraceOperation
        );

        [
            tracer.data,
            tracer.query
        ].forEach(function (input) {
            input.addEventListener(
                "input",
                invalidateTrace
            );
        });

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
                        870
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
