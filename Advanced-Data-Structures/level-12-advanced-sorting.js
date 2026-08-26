(function () {
    "use strict";

    function snapshot(array, active, phase, message, comparisons, writes, pivot, complete) {
        return {
            array: array.slice(),
            active: (active || []).slice(),
            phase: phase,
            message: message,
            comparisons: comparisons,
            writes: writes,
            pivot: typeof pivot === "number" ? pivot : -1,
            complete: Boolean(complete)
        };
    }

    function mergeSortSteps(values) {
        const array = values.slice();
        const steps = [snapshot(array, [], "Ready", "Split the array, sort both halves and merge them.", 0, 0)];
        let comparisons = 0;
        let writes = 0;

        function sort(left, right) {
            if (left >= right) { return; }

            const middle = Math.floor((left + right) / 2);

            steps.push(snapshot(
                array,
                [left, middle, right],
                "Divide",
                "Divide range [" + left + ", " + right + "] at index " + middle + ".",
                comparisons,
                writes
            ));

            sort(left, middle);
            sort(middle + 1, right);

            const leftPart = array.slice(left, middle + 1);
            const rightPart = array.slice(middle + 1, right + 1);

            let i = 0;
            let j = 0;
            let output = left;

            while (i < leftPart.length && j < rightPart.length) {
                comparisons += 1;

                steps.push(snapshot(
                    array,
                    [left + i, middle + 1 + j],
                    "Compare",
                    "Compare " + leftPart[i] + " and " + rightPart[j] + ".",
                    comparisons,
                    writes
                ));

                if (leftPart[i] <= rightPart[j]) {
                    array[output] = leftPart[i];
                    i += 1;
                } else {
                    array[output] = rightPart[j];
                    j += 1;
                }

                writes += 1;

                steps.push(snapshot(
                    array,
                    [output],
                    "Merge",
                    "Write the smaller value at index " + output + ".",
                    comparisons,
                    writes
                ));

                output += 1;
            }

            while (i < leftPart.length) {
                array[output] = leftPart[i];
                i += 1;
                output += 1;
                writes += 1;

                steps.push(snapshot(
                    array,
                    [output - 1],
                    "Merge",
                    "Copy the remaining left-half value.",
                    comparisons,
                    writes
                ));
            }

            while (j < rightPart.length) {
                array[output] = rightPart[j];
                j += 1;
                output += 1;
                writes += 1;

                steps.push(snapshot(
                    array,
                    [output - 1],
                    "Merge",
                    "Copy the remaining right-half value.",
                    comparisons,
                    writes
                ));
            }
        }

        sort(0, array.length - 1);

        steps.push(snapshot(
            array,
            [],
            "Complete",
            "Merge Sort is complete.",
            comparisons,
            writes,
            -1,
            true
        ));

        return steps;
    }

    function quickSortSteps(values) {
        const array = values.slice();
        const steps = [snapshot(array, [], "Ready", "Partition around a pivot and recursively sort both sides.", 0, 0)];

        let comparisons = 0;
        let writes = 0;

        function swap(first, second) {
            if (first === second) { return; }

            const temp = array[first];
            array[first] = array[second];
            array[second] = temp;

            writes += 2;
        }

        function partition(low, high) {
            const pivotValue = array[high];
            let smaller = low - 1;

            steps.push(snapshot(
                array,
                [high],
                "Choose Pivot",
                "Choose " + pivotValue + " at index " + high + " as the pivot.",
                comparisons,
                writes,
                high
            ));

            for (let scan = low; scan < high; scan += 1) {
                comparisons += 1;

                steps.push(snapshot(
                    array,
                    [scan],
                    "Compare",
                    "Compare " + array[scan] + " with pivot " + pivotValue + ".",
                    comparisons,
                    writes,
                    high
                ));

                if (array[scan] <= pivotValue) {
                    smaller += 1;
                    swap(smaller, scan);

                    steps.push(snapshot(
                        array,
                        [smaller, scan],
                        "Move Left",
                        "Place the value in the ≤ pivot region.",
                        comparisons,
                        writes,
                        high
                    ));
                }
            }

            swap(smaller + 1, high);

            steps.push(snapshot(
                array,
                [smaller + 1],
                "Place Pivot",
                "Place pivot " + pivotValue + " at its final index " + (smaller + 1) + ".",
                comparisons,
                writes,
                smaller + 1
            ));

            return smaller + 1;
        }

        function sort(low, high) {
            if (low >= high) { return; }

            const pivot = partition(low, high);

            sort(low, pivot - 1);
            sort(pivot + 1, high);
        }

        sort(0, array.length - 1);

        steps.push(snapshot(
            array,
            [],
            "Complete",
            "Quick Sort is complete.",
            comparisons,
            writes,
            -1,
            true
        ));

        return steps;
    }

    function shellSortSteps(values) {
        const array = values.slice();
        const steps = [snapshot(array, [], "Ready", "Perform insertion sorting over progressively smaller gaps.", 0, 0)];

        let comparisons = 0;
        let writes = 0;

        for (let gap = Math.floor(array.length / 2); gap > 0; gap = Math.floor(gap / 2)) {
            steps.push(snapshot(
                array,
                [],
                "Gap " + gap,
                "Use gap = " + gap + ".",
                comparisons,
                writes
            ));

            for (let index = gap; index < array.length; index += 1) {
                const value = array[index];
                let position = index;

                while (position >= gap) {
                    comparisons += 1;

                    steps.push(snapshot(
                        array,
                        [position - gap, position],
                        "Compare",
                        "Compare gap-separated values " + array[position - gap] + " and " + value + ".",
                        comparisons,
                        writes
                    ));

                    if (array[position - gap] <= value) {
                        break;
                    }

                    array[position] = array[position - gap];
                    writes += 1;

                    steps.push(snapshot(
                        array,
                        [position - gap, position],
                        "Shift",
                        "Shift the larger value forward by gap " + gap + ".",
                        comparisons,
                        writes
                    ));

                    position -= gap;
                }

                array[position] = value;
                writes += 1;

                steps.push(snapshot(
                    array,
                    [position],
                    "Insert",
                    "Insert " + value + " at index " + position + ".",
                    comparisons,
                    writes
                ));
            }
        }

        steps.push(snapshot(
            array,
            [],
            "Complete",
            "Shell Sort is complete.",
            comparisons,
            writes,
            -1,
            true
        ));

        return steps;
    }

    function countingSortSteps(values) {
        const array = values.slice();
        const minimum = Math.min.apply(null, array);
        const maximum = Math.max.apply(null, array);

        if (maximum - minimum > 80) {
            throw new Error("For Counting Sort visualization, keep max − min at or below 80.");
        }

        const counts = new Array(maximum - minimum + 1).fill(0);
        const steps = [snapshot(
            array,
            [],
            "Ready",
            "Count the frequency of each key from " + minimum + " to " + maximum + ".",
            0,
            0
        )];

        let writes = 0;

        array.forEach(function (value, index) {
            counts[value - minimum] += 1;

            steps.push(snapshot(
                array,
                [index],
                "Count",
                "Count[" + value + "] becomes " + counts[value - minimum] + ".",
                0,
                writes
            ));
        });

        let output = 0;

        counts.forEach(function (frequency, offset) {
            for (let used = 0; used < frequency; used += 1) {
                array[output] = offset + minimum;
                writes += 1;

                steps.push(snapshot(
                    array,
                    [output],
                    "Reconstruct",
                    "Write " + (offset + minimum) + " at output index " + output + ".",
                    0,
                    writes
                ));

                output += 1;
            }
        });

        steps.push(snapshot(
            array,
            [],
            "Complete",
            "Counting Sort is complete.",
            0,
            writes,
            -1,
            true
        ));

        return steps;
    }

    function radixSortSteps(values) {
        const array = values.slice();

        if (array.some(function (value) { return value < 0; })) {
            throw new Error("This Radix Sort visualizer accepts non-negative integers only.");
        }

        const maximum = Math.max.apply(null, array);
        const steps = [snapshot(
            array,
            [],
            "Ready",
            "Sort by one decimal digit at a time, from least significant to most significant.",
            0,
            0
        )];

        let writes = 0;

        for (let place = 1; Math.floor(maximum / place) > 0; place *= 10) {
            const counts = new Array(10).fill(0);
            const output = new Array(array.length);

            array.forEach(function (value, index) {
                const digit = Math.floor(value / place) % 10;
                counts[digit] += 1;

                steps.push(snapshot(
                    array,
                    [index],
                    "Digit " + place,
                    "Value " + value + " has digit " + digit + " at place " + place + ".",
                    0,
                    writes
                ));
            });

            for (let digit = 1; digit < 10; digit += 1) {
                counts[digit] += counts[digit - 1];
            }

            for (let index = array.length - 1; index >= 0; index -= 1) {
                const digit = Math.floor(array[index] / place) % 10;

                output[counts[digit] - 1] = array[index];
                counts[digit] -= 1;
            }

            for (let index = 0; index < array.length; index += 1) {
                array[index] = output[index];
                writes += 1;
            }

            steps.push(snapshot(
                array,
                [],
                "Complete Pass",
                "Stable ordering after processing place " + place + ".",
                0,
                writes
            ));
        }

        steps.push(snapshot(
            array,
            [],
            "Complete",
            "Radix Sort is complete.",
            0,
            writes,
            -1,
            true
        ));

        return steps;
    }

    function bucketSortSteps(values) {
        const array = values.slice();
        const minimum = Math.min.apply(null, array);
        const maximum = Math.max.apply(null, array);
        const bucketCount = Math.min(6, array.length);
        const buckets = Array.from({ length: bucketCount }, function () {
            return [];
        });

        const steps = [snapshot(
            array,
            [],
            "Ready",
            "Distribute values into " + bucketCount + " ranges, sort each bucket and concatenate them.",
            0,
            0
        )];

        let comparisons = 0;
        let writes = 0;

        array.forEach(function (value, index) {
            const ratio = maximum === minimum
                ? 0
                : (value - minimum) / (maximum - minimum + 1);

            const bucketIndex = Math.min(
                bucketCount - 1,
                Math.floor(ratio * bucketCount)
            );

            buckets[bucketIndex].push(value);

            steps.push(snapshot(
                array,
                [index],
                "Distribute",
                "Place " + value + " into bucket " + bucketIndex + ".",
                comparisons,
                writes
            ));
        });

        buckets.forEach(function (bucket, bucketIndex) {
            for (let index = 1; index < bucket.length; index += 1) {
                const value = bucket[index];
                let position = index - 1;

                while (position >= 0) {
                    comparisons += 1;

                    if (bucket[position] <= value) {
                        break;
                    }

                    bucket[position + 1] = bucket[position];
                    writes += 1;
                    position -= 1;
                }

                bucket[position + 1] = value;
                writes += 1;
            }

            steps.push(snapshot(
                array,
                [],
                "Sort Bucket",
                "Bucket " + bucketIndex + " becomes [" + bucket.join(", ") + "].",
                comparisons,
                writes
            ));
        });

        let outputIndex = 0;

        buckets.forEach(function (bucket) {
            bucket.forEach(function (value) {
                array[outputIndex] = value;
                writes += 1;

                steps.push(snapshot(
                    array,
                    [outputIndex],
                    "Collect",
                    "Copy " + value + " from its bucket to output index " + outputIndex + ".",
                    comparisons,
                    writes
                ));

                outputIndex += 1;
            });
        });

        steps.push(snapshot(
            array,
            [],
            "Complete",
            "Bucket Sort is complete.",
            comparisons,
            writes,
            -1,
            true
        ));

        return steps;
    }

    const visualizer = {
        input: document.getElementById("sortingArrayInput"),
        algorithm: document.getElementById("sortingAlgorithm"),
        load: document.getElementById("loadSortingVisualizer"),
        prompt: document.getElementById("sortingVisualizerPrompt"),
        result: document.getElementById("sortingVisualizerResult"),
        bars: document.getElementById("sortingBars"),
        message: document.getElementById("sortingVisualizerMessage"),
        phase: document.getElementById("sortingPhase"),
        comparisons: document.getElementById("sortingComparisons"),
        writes: document.getElementById("sortingWrites"),
        pivot: document.getElementById("sortingPivot"),
        progress: document.getElementById("sortingProgress"),
        status: document.getElementById("sortingStepStatus"),
        previous: document.getElementById("sortingPrevious"),
        next: document.getElementById("sortingNext"),
        auto: document.getElementById("sortingAuto"),
        pause: document.getElementById("sortingPause"),
        reset: document.getElementById("sortingReset")
    };

    let visualSteps = [];
    let visualIndex = 0;
    let visualTimer = null;

    function stopVisualizer() {
        if (visualTimer !== null) {
            window.clearInterval(visualTimer);
            visualTimer = null;
        }
    }

    function parseValues() {
        const values = visualizer.input.value
            .trim()
            .split(/[\s,]+/)
            .filter(Boolean)
            .map(Number);

        if (
            values.length < 2 ||
            values.length > 12 ||
            values.some(function (value) {
                return !Number.isInteger(value);
            })
        ) {
            throw new Error("Enter 2 to 12 valid integers separated by commas or spaces.");
        }

        visualizer.input.value = values.join(", ");

        return values;
    }

    function buildVisualSteps(values, algorithm) {
        if (algorithm === "merge") {
            return mergeSortSteps(values);
        }

        if (algorithm === "quick") {
            return quickSortSteps(values);
        }

        if (algorithm === "shell") {
            return shellSortSteps(values);
        }

        if (algorithm === "counting") {
            return countingSortSteps(values);
        }

        if (algorithm === "radix") {
            return radixSortSteps(values);
        }

        return bucketSortSteps(values);
    }

    function renderBars(step) {
        visualizer.bars.innerHTML = "";

        const minimum = Math.min.apply(null, step.array);
        const maximum = Math.max.apply(null, step.array);
        const range = Math.max(1, maximum - minimum);

        step.array.forEach(function (value, index) {
            const wrapper = document.createElement("div");
            wrapper.className = "sorting-bar-wrap";

            const bar = document.createElement("span");
            bar.className = "sorting-bar";
            bar.style.height = (42 + ((value - minimum) / range) * 145) + "px";

            if (step.active.indexOf(index) !== -1) {
                bar.classList.add("is-active");
            }

            if (index === step.pivot) {
                bar.classList.add("is-pivot");
            }

            if (step.complete) {
                bar.classList.add("is-sorted");
            }

            const label = document.createElement("strong");
            label.textContent = String(value);

            const sub = document.createElement("small");
            sub.textContent = "i" + index;

            wrapper.appendChild(bar);
            wrapper.appendChild(label);
            wrapper.appendChild(sub);

            visualizer.bars.appendChild(wrapper);
        });
    }

    function renderVisualizer() {
        if (!visualSteps.length) {
            return;
        }

        const step = visualSteps[visualIndex];

        renderBars(step);

        visualizer.message.textContent = step.message;
        visualizer.phase.textContent = step.phase;
        visualizer.comparisons.textContent = String(step.comparisons);
        visualizer.writes.textContent = String(step.writes);
        visualizer.pivot.textContent =
            step.pivot < 0 ? "—" : String(step.array[step.pivot]);

        visualizer.status.textContent =
            "Step " + visualIndex + " of " + (visualSteps.length - 1);

        visualizer.progress.style.width =
            ((visualIndex / Math.max(1, visualSteps.length - 1)) * 100) + "%";

        visualizer.previous.disabled = visualIndex === 0;
        visualizer.next.disabled = visualIndex === visualSteps.length - 1;
    }

    function loadVisualizer() {
        let values;

        try {
            values = parseValues();
            visualSteps = buildVisualSteps(values, visualizer.algorithm.value);
        } catch (error) {
            window.alert(error.message);
            return;
        }

        stopVisualizer();

        visualIndex = 0;
        visualizer.prompt.hidden = true;
        visualizer.result.hidden = false;

        renderVisualizer();
    }

    if (visualizer.load) {
        visualizer.load.addEventListener("click", loadVisualizer);

        [visualizer.input, visualizer.algorithm].forEach(function (control) {
            control.addEventListener("input", function () {
                stopVisualizer();
                visualizer.result.hidden = true;
                visualizer.prompt.hidden = false;
            });

            control.addEventListener("change", function () {
                stopVisualizer();
                visualizer.result.hidden = true;
                visualizer.prompt.hidden = false;
            });
        });

        document.querySelectorAll("[data-sorting-example]").forEach(function (button) {
            button.addEventListener("click", function () {
                stopVisualizer();

                const examples = {
                    mixed: ["38, 27, 43, 3, 9, 82, 10", "merge"],
                    quick: ["8, 3, 1, 7, 0, 10, 2", "quick"],
                    digits: ["170, 45, 75, 90, 802, 24, 2, 66", "radix"]
                };

                const example = examples[button.dataset.sortingExample];

                if (!example) {
                    return;
                }

                visualizer.input.value = example[0];
                visualizer.algorithm.value = example[1];
                visualizer.result.hidden = true;
                visualizer.prompt.hidden = false;
                visualizer.input.focus();
            });
        });

        visualizer.previous.addEventListener("click", function () {
            stopVisualizer();
            visualIndex = Math.max(0, visualIndex - 1);
            renderVisualizer();
        });

        visualizer.next.addEventListener("click", function () {
            stopVisualizer();
            visualIndex = Math.min(visualSteps.length - 1, visualIndex + 1);
            renderVisualizer();
        });

        visualizer.auto.addEventListener("click", function () {
            stopVisualizer();

            if (visualIndex === visualSteps.length - 1) {
                visualIndex = 0;
                renderVisualizer();
            }

            visualTimer = window.setInterval(function () {
                if (visualIndex >= visualSteps.length - 1) {
                    stopVisualizer();
                    return;
                }

                visualIndex += 1;
                renderVisualizer();
            }, 800);
        });

        visualizer.pause.addEventListener("click", stopVisualizer);

        visualizer.reset.addEventListener("click", function () {
            stopVisualizer();
            visualIndex = 0;
            renderVisualizer();
        });
    }

    const programTraceDefinitions = {
        quick: {
            label: "Quick Sort",
            codeKey: "quick-sort",
            example: "8, 3, 1, 7, 0, 10, 2",
            kind: "integer"
        },
        merge: {
            label: "Merge Sort",
            codeKey: "merge-sort",
            example: "38, 27, 43, 3, 9, 82",
            kind: "integer"
        },
        shell: {
            label: "Shell Sort",
            codeKey: "shell-sort",
            example: "12, 34, 54, 2, 3",
            kind: "integer"
        },
        counting: {
            label: "Counting Sort",
            codeKey: "counting-sort",
            example: "4, -2, 2, 8, 3, 3, 1",
            kind: "integer"
        },
        radix: {
            label: "Radix Sort",
            codeKey: "radix-sort",
            example: "170, 45, 75, 90, 802, 24, 2, 66",
            kind: "nonnegative"
        },
        bucket: {
            label: "Bucket Sort",
            codeKey: "bucket-sort",
            example: "0.42, 0.32, 0.23, 0.52, 0.25, 0.47, 0.51",
            kind: "fraction"
        }
    };

    const programTracer = {
        input: document.getElementById("programTraceInput"),
        algorithm: document.getElementById("programTraceAlgorithm"),
        load: document.getElementById("loadProgramTracer"),
        help: document.getElementById("programTraceInputHelp"),
        prompt: document.getElementById("programTracePrompt"),
        result: document.getElementById("programTraceResult"),
        title: document.getElementById("programTraceTitle"),
        codeWindow: document.getElementById("programTraceCodeWindow"),
        code: document.getElementById("programTraceCode"),
        message: document.getElementById("programTraceMessage"),
        variables: document.getElementById("programTraceVariables"),
        array: document.getElementById("programTraceArray"),
        output: document.getElementById("programTraceOutput"),
        status: document.getElementById("programTraceStatus"),
        previous: document.getElementById("programTracePrevious"),
        next: document.getElementById("programTraceNext"),
        auto: document.getElementById("programTraceAuto"),
        pause: document.getElementById("programTracePause"),
        reset: document.getElementById("programTraceReset")
    };

    let programTraceSteps = [];
    let programTraceIndex = 0;
    let programTraceTimer = null;
    let programTraceLines = [];
    let programTraceValues = [];
    let activeProgramTraceDefinition = null;

    function stopProgramTrace() {
        if (programTraceTimer !== null) {
            window.clearInterval(programTraceTimer);
            programTraceTimer = null;
        }
    }

    function invalidateProgramTrace() {
        stopProgramTrace();

        programTraceSteps = [];
        programTraceIndex = 0;

        programTracer.result.hidden = true;
        programTracer.prompt.hidden = false;
    }

    function parseProgramTraceValues(definition) {
        const tokens = programTracer.input.value
            .trim()
            .split(/[\s,]+/)
            .filter(Boolean);

        const values = tokens.map(Number);

        if (
            values.length < 2 ||
            values.length > 10 ||
            values.some(function (value) {
                return !Number.isFinite(value);
            })
        ) {
            throw new Error("Enter 2 to 10 valid values separated by commas or spaces.");
        }

        if (
            definition.kind !== "fraction" &&
            values.some(function (value) {
                return !Number.isInteger(value);
            })
        ) {
            throw new Error("This program requires integer values.");
        }

        if (
            definition.kind === "nonnegative" &&
            values.some(function (value) {
                return value < 0;
            })
        ) {
            throw new Error("This Radix Sort program accepts non-negative integers only.");
        }

        if (
            definition.kind === "fraction" &&
            values.some(function (value) {
                return value < 0 || value >= 1;
            })
        ) {
            throw new Error("Bucket Sort values must satisfy 0 ≤ value < 1.");
        }

        if (
            definition.codeKey === "counting-sort" &&
            Math.max.apply(null, values) - Math.min.apply(null, values) > 80
        ) {
            throw new Error(
                "For a readable Counting Sort trace, keep maximum − minimum at or below 80."
            );
        }

        programTracer.input.value = values.join(", ");

        return values;
    }

    function getProgramTraceNeedle(algorithm, phase) {
        const complete = phase === "Complete";

        if (algorithm === "merge") {
            if (complete) {
                return 'printf("%d ", a[i])';
            }

            if (phase === "Ready") {
                return "mergeSort(a, temp, 0, n - 1)";
            }

            if (phase === "Divide") {
                return "int mid = low +";
            }

            if (phase === "Compare") {
                return "if (a[i] <= a[j])";
            }

            return "temp[k++] =";
        }

        if (algorithm === "quick") {
            if (complete) {
                return 'printf("%d ", a[i])';
            }

            if (phase === "Ready") {
                return "quickSort(a, 0, n - 1)";
            }

            if (phase === "Choose Pivot") {
                return "int pivot = a[high]";
            }

            if (phase === "Compare") {
                return "if (a[j] <= pivot)";
            }

            if (phase === "Move Left") {
                return "swap(&a[i], &a[j])";
            }

            if (phase === "Place Pivot") {
                return "swap(&a[i + 1], &a[high])";
            }

            return "int p = partition";
        }

        if (algorithm === "shell") {
            if (complete) {
                return 'printf("%d ", a[i])';
            }

            if (phase === "Ready") {
                return "shellSort(a, n)";
            }

            if (phase.indexOf("Gap ") === 0) {
                return "for (int gap = n / 2";
            }

            if (phase === "Compare") {
                return "while (j >= gap";
            }

            if (phase === "Shift") {
                return "a[j] = a[j - gap]";
            }

            return "a[j] = value";
        }

        if (algorithm === "counting") {
            if (complete) {
                return 'printf("%d ", a[i])';
            }

            if (phase === "Ready") {
                return "countingSort(a, n)";
            }

            if (phase === "Count") {
                return "count[a[i] - minimum]++";
            }

            return "output[--count[key]] = a[i]";
        }

        if (algorithm === "radix") {
            if (complete) {
                return 'printf("%d ", a[i])';
            }

            if (phase === "Ready") {
                return "radixSort(a, n)";
            }

            if (phase.indexOf("Digit ") === 0) {
                return "count[(a[i] / exponent) % 10]++";
            }

            return "a[i] = output[i]";
        }

        if (complete) {
            return 'printf("%.2f ", a[i])';
        }

        if (phase === "Ready") {
            return "bucketSort(a, n)";
        }

        if (phase === "Distribute") {
            return "buckets[index][sizes[index]++] = a[i]";
        }

        if (phase === "Sort Bucket") {
            return "insertionSort(buckets[i], sizes[i])";
        }

        return "a[output++] = buckets[i][j]";
    }

    function findProgramTraceLine(lines, needle) {
        for (let index = 0; index < lines.length; index += 1) {
            if (lines[index].indexOf(needle) !== -1) {
                return index + 1;
            }
        }

        return 1;
    }

    function loadProgramTraceCode(definition) {
        const source = document.querySelector(
            '[data-c-program="' + definition.codeKey + '"]'
        );

        if (!source) {
            throw new Error("The selected C program could not be found.");
        }

        const text = source.textContent
            .replace(/\r/g, "")
            .replace(/^\n+|\n+$/g, "");

        programTraceLines = text.split("\n");
        programTracer.code.innerHTML = "";

        programTraceLines.forEach(function (line, index) {
            const row = document.createElement("span");

            row.dataset.programTraceLine = String(index + 1);
            row.textContent =
                String(index + 1).padStart(2, "0") +
                " │ " +
                (line || " ");

            programTracer.code.appendChild(row);
        });

        programTracer.codeWindow.scrollTop = 0;
    }

    function decorateProgramTraceSteps(algorithm, steps) {
        return steps.map(function (step) {
            return Object.assign({}, step, {
                line: findProgramTraceLine(
                    programTraceLines,
                    getProgramTraceNeedle(algorithm, step.phase)
                )
            });
        });
    }

    function appendProgramTraceVariable(label, value) {
        const card = document.createElement("div");
        const name = document.createElement("span");
        const data = document.createElement("strong");

        name.textContent = label;
        data.textContent = String(value);

        card.appendChild(name);
        card.appendChild(data);

        programTracer.variables.appendChild(card);
    }

    function renderProgramTraceVariables(step) {
        programTracer.variables.innerHTML = "";

        appendProgramTraceVariable(
            "Algorithm",
            activeProgramTraceDefinition.label
        );

        appendProgramTraceVariable("Phase", step.phase);

        appendProgramTraceVariable(
            "Active Indices",
            step.active.length ? step.active.join(", ") : "—"
        );

        appendProgramTraceVariable("Comparisons", step.comparisons);
        appendProgramTraceVariable("Array Writes", step.writes);

        appendProgramTraceVariable(
            "Iteration",
            programTraceIndex + " / " + (programTraceSteps.length - 1)
        );

        if (activeProgramTraceDefinition.codeKey === "quick-sort") {
            appendProgramTraceVariable(
                "Pivot",
                step.pivot < 0 ? "—" : step.array[step.pivot]
            );
        } else if (
            activeProgramTraceDefinition.codeKey === "counting-sort"
        ) {
            appendProgramTraceVariable(
                "Key Range",
                Math.min.apply(null, programTraceValues) +
                    "…" +
                    Math.max.apply(null, programTraceValues)
            );
        } else if (
            activeProgramTraceDefinition.codeKey === "radix-sort"
        ) {
            appendProgramTraceVariable(
                "Digit Place",
                step.phase.indexOf("Digit ") === 0
                    ? step.phase.slice(6)
                    : "—"
            );
        } else if (
            activeProgramTraceDefinition.codeKey === "shell-sort"
        ) {
            appendProgramTraceVariable(
                "Gap",
                step.phase.indexOf("Gap ") === 0
                    ? step.phase.slice(4)
                    : "—"
            );
        } else if (
            activeProgramTraceDefinition.codeKey === "bucket-sort"
        ) {
            appendProgramTraceVariable(
                "Buckets",
                Math.min(6, programTraceValues.length)
            );
        }
    }

    function renderProgramTraceArray(step) {
        programTracer.array.innerHTML = "";

        step.array.forEach(function (value, index) {
            const cell = document.createElement("span");

            cell.textContent = String(value);

            if (step.active.indexOf(index) !== -1) {
                cell.classList.add("is-active-value");
            }

            if (index === step.pivot) {
                cell.classList.add("is-pivot-value");
            }

            programTracer.array.appendChild(cell);
        });
    }

    function renderProgramTrace() {
        if (!programTraceSteps.length) {
            return;
        }

        const step = programTraceSteps[programTraceIndex];
        let activeLine = null;

        programTracer.code
            .querySelectorAll("[data-program-trace-line]")
            .forEach(function (line) {
                const active =
                    Number(line.dataset.programTraceLine) === step.line;

                line.classList.toggle("is-active-line", active);

                if (active) {
                    activeLine = line;
                }
            });

        programTracer.message.textContent = step.message;

        renderProgramTraceVariables(step);
        renderProgramTraceArray(step);

        programTracer.output.textContent = step.complete
            ? "Sorted: [" + step.array.join(", ") + "]"
            : "—";

        programTracer.status.textContent =
            "Step " +
            programTraceIndex +
            " of " +
            (programTraceSteps.length - 1);

        programTracer.previous.disabled = programTraceIndex === 0;
        programTracer.next.disabled =
            programTraceIndex === programTraceSteps.length - 1;

        if (activeLine) {
            const top = activeLine.offsetTop;
            const bottom = top + activeLine.offsetHeight;

            if (
                top < programTracer.codeWindow.scrollTop + 12 ||
                bottom >
                    programTracer.codeWindow.scrollTop +
                        programTracer.codeWindow.clientHeight -
                        12
            ) {
                programTracer.codeWindow.scrollTo({
                    top: Math.max(
                        0,
                        top - programTracer.codeWindow.clientHeight / 2
                    ),
                    behavior: "smooth"
                });
            }
        }
    }

    function loadProgramTracer() {
        const definition =
            programTraceDefinitions[programTracer.algorithm.value];

        let values;

        try {
            values = parseProgramTraceValues(definition);
            loadProgramTraceCode(definition);

            programTraceSteps = decorateProgramTraceSteps(
                programTracer.algorithm.value,
                buildVisualSteps(values, programTracer.algorithm.value)
            );
        } catch (error) {
            window.alert(error.message);
            return;
        }

        stopProgramTrace();

        activeProgramTraceDefinition = definition;
        programTraceValues = values.slice();
        programTraceIndex = 0;

        programTracer.title.textContent =
            "PROGRAM TRACING — " + definition.label.toUpperCase();

        programTracer.prompt.hidden = true;
        programTracer.result.hidden = false;

        renderProgramTrace();
    }

    if (programTracer.load) {
        programTracer.load.addEventListener("click", loadProgramTracer);

        programTracer.input.addEventListener(
            "input",
            invalidateProgramTrace
        );

        programTracer.algorithm.addEventListener("change", function () {
            const definition =
                programTraceDefinitions[programTracer.algorithm.value];

            programTracer.input.value = definition.example;

            programTracer.help.textContent =
                definition.kind === "fraction"
                    ? "Bucket Sort: enter 2–10 decimal values where 0 ≤ value < 1."
                    : definition.kind === "nonnegative"
                        ? "Radix Sort: enter 2–10 non-negative integers."
                        : "Enter 2–10 comma-separated integers.";

            invalidateProgramTrace();
        });

        programTracer.previous.addEventListener("click", function () {
            stopProgramTrace();

            programTraceIndex = Math.max(0, programTraceIndex - 1);

            renderProgramTrace();
        });

        programTracer.next.addEventListener("click", function () {
            stopProgramTrace();

            programTraceIndex = Math.min(
                programTraceSteps.length - 1,
                programTraceIndex + 1
            );

            renderProgramTrace();
        });

        programTracer.auto.addEventListener("click", function () {
            stopProgramTrace();

            if (programTraceIndex === programTraceSteps.length - 1) {
                programTraceIndex = 0;
                renderProgramTrace();
            }

            programTraceTimer = window.setInterval(function () {
                if (programTraceIndex >= programTraceSteps.length - 1) {
                    stopProgramTrace();
                    return;
                }

                programTraceIndex += 1;
                renderProgramTrace();
            }, 820);
        });

        programTracer.pause.addEventListener(
            "click",
            stopProgramTrace
        );

        programTracer.reset.addEventListener("click", function () {
            stopProgramTrace();

            programTraceIndex = 0;

            renderProgramTrace();
        });
    }

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
            button.dataset.originalLabel = button.textContent.trim();

            button.setAttribute("aria-expanded", "false");
            button.setAttribute("aria-controls", target.id);

            button.addEventListener("click", function () {
                const open = target.hidden;

                target.hidden = !open;
                button.setAttribute("aria-expanded", String(open));

                button.textContent = open
                    ? target.classList.contains("ads-hint-box")
                        ? "Hide Hint"
                        : "Hide Answer"
                    : button.dataset.originalLabel;
            });
        });
}());
