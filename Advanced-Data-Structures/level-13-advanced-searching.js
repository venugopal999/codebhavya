(function () {
    "use strict";

    function searchStep(array, active, visited, phase, message, comparisons, low, high, current, needle, complete, found) {
        return {
            array: array.slice(),
            active: (active || []).slice(),
            visited: (visited || []).slice(),
            phase: phase,
            message: message,
            comparisons: comparisons,
            low: typeof low === "number" ? low : -1,
            high: typeof high === "number" ? high : -1,
            current: typeof current === "number" ? current : -1,
            needle: needle,
            complete: Boolean(complete),
            found: Boolean(found)
        };
    }

    function addVisited(visited, index) {
        if (index >= 0 && visited.indexOf(index) === -1) {
            visited.push(index);
        }
    }

    function jumpSearchSteps(values, target) {
        const array = values.slice();
        const steps = [];
        const visited = [];
        const jumpSize = Math.max(1, Math.floor(Math.sqrt(array.length)));

        let blockEnd = jumpSize;
        let previous = 0;
        let comparisons = 0;

        steps.push(searchStep(
            array,
            [],
            visited,
            "Ready",
            "Call Jump Search with block size ⌊√n⌋ = " + jumpSize + ".",
            comparisons,
            0,
            array.length - 1,
            -1,
            "jumpSearch(a, n, target)"
        ));

        while (previous < array.length) {
            const probe = Math.min(blockEnd, array.length) - 1;

            comparisons += 1;
            addVisited(visited, probe);

            steps.push(searchStep(
                array,
                [probe],
                visited,
                "Check Block",
                "Compare block-end value " + array[probe] +
                    " at index " + probe + " with target " + target + ".",
                comparisons,
                previous,
                Math.min(blockEnd, array.length) - 1,
                probe,
                "while (previous < n && a[minInt(step, n) - 1] < target)"
            ));

            if (array[probe] >= target) {
                break;
            }

            previous = blockEnd;

            steps.push(searchStep(
                array,
                [Math.min(previous, array.length - 1)],
                visited,
                "Jump Forward",
                "The target must be later; move previous to " + previous + ".",
                comparisons,
                previous,
                Math.min(blockEnd + jumpSize, array.length) - 1,
                Math.min(previous, array.length - 1),
                "previous = step"
            ));

            blockEnd += jumpSize;

            steps.push(searchStep(
                array,
                [],
                visited,
                "Extend Block",
                "Extend the next block boundary to " + blockEnd + ".",
                comparisons,
                previous,
                Math.min(blockEnd, array.length) - 1,
                -1,
                "step += (int)sqrt((double)n)"
            ));

            if (previous >= array.length) {
                steps.push(searchStep(
                    array,
                    [],
                    visited,
                    "Complete",
                    "The jumps passed the array; target " +
                        target + " is not present.",
                    comparisons,
                    -1,
                    -1,
                    -1,
                    "if (previous >= n) return -1",
                    true,
                    false
                ));

                return steps;
            }
        }

        const limit = Math.min(blockEnd, array.length);

        while (previous < limit) {
            comparisons += 1;
            addVisited(visited, previous);

            steps.push(searchStep(
                array,
                [previous],
                visited,
                "Linear Scan",
                "Check value " + array[previous] +
                    " at index " + previous +
                    " inside the selected block.",
                comparisons,
                previous,
                limit - 1,
                previous,
                "while (previous < minInt(step, n) && a[previous] < target)"
            ));

            if (array[previous] >= target) {
                break;
            }

            previous += 1;

            steps.push(searchStep(
                array,
                [],
                visited,
                "Advance",
                "Advance to index " + previous + ".",
                comparisons,
                previous,
                limit - 1,
                -1,
                "previous++;"
            ));
        }

        if (previous < array.length) {
            comparisons += 1;
            addVisited(visited, previous);

            steps.push(searchStep(
                array,
                [previous],
                visited,
                "Check Match",
                "Compare a[" + previous + "] = " +
                    array[previous] + " with target " + target + ".",
                comparisons,
                previous,
                previous,
                previous,
                "if (previous < n && a[previous] == target)"
            ));

            if (array[previous] === target) {
                steps.push(searchStep(
                    array,
                    [previous],
                    visited,
                    "Complete",
                    "Target " + target +
                        " found at index " + previous + ".",
                    comparisons,
                    previous,
                    previous,
                    previous,
                    "return previous;",
                    true,
                    true
                ));

                return steps;
            }
        }

        steps.push(searchStep(
            array,
            [],
            visited,
            "Complete",
            "Target " + target + " is not present.",
            comparisons,
            -1,
            -1,
            -1,
            "return -1;",
            true,
            false
        ));

        return steps;
    }

    function interpolationSearchSteps(values, target) {
        const array = values.slice();
        const steps = [];
        const visited = [];

        let low = 0;
        let high = array.length - 1;
        let comparisons = 0;

        steps.push(searchStep(
            array,
            [],
            visited,
            "Ready",
            "Call Interpolation Search on the complete sorted range.",
            comparisons,
            low,
            high,
            -1,
            "interpolationSearch(a, n, target)"
        ));

        while (
            low <= high &&
            target >= array[low] &&
            target <= array[high]
        ) {
            steps.push(searchStep(
                array,
                [low, high],
                visited,
                "Check Range",
                "Target lies within values " +
                    array[low] + " and " + array[high] + ".",
                comparisons,
                low,
                high,
                -1,
                "while (low <= high && target >= a[low] && target <= a[high])"
            ));

            comparisons += 1;

            steps.push(searchStep(
                array,
                [low, high],
                visited,
                "Check Uniform Range",
                "Check whether both boundary values are equal.",
                comparisons,
                low,
                high,
                -1,
                "if (a[high] == a[low])"
            ));

            if (array[high] === array[low]) {
                comparisons += 1;
                addVisited(visited, low);

                const found = array[low] === target;

                steps.push(searchStep(
                    array,
                    [low],
                    visited,
                    "Complete",
                    found
                        ? "Target " + target + " found at index " + low + "."
                        : "The constant range does not contain target " +
                            target + ".",
                    comparisons,
                    low,
                    high,
                    low,
                    "return a[low] == target ? low : -1",
                    true,
                    found
                ));

                return steps;
            }

            let position =
                low +
                Math.floor(
                    ((target - array[low]) * (high - low)) /
                    (array[high] - array[low])
                );

            position = Math.max(low, Math.min(high, position));
            addVisited(visited, position);

            steps.push(searchStep(
                array,
                [position],
                visited,
                "Estimate Position",
                "Estimate index " + position +
                    " from the target's relative value.",
                comparisons,
                low,
                high,
                position,
                "int position = low +"
            ));

            comparisons += 1;

            steps.push(searchStep(
                array,
                [position],
                visited,
                "Check Match",
                "Compare estimated value " + array[position] +
                    " with target " + target + ".",
                comparisons,
                low,
                high,
                position,
                "if (a[position] == target)"
            ));

            if (array[position] === target) {
                steps.push(searchStep(
                    array,
                    [position],
                    visited,
                    "Complete",
                    "Target " + target +
                        " found at index " + position + ".",
                    comparisons,
                    position,
                    position,
                    position,
                    "return position;",
                    true,
                    true
                ));

                return steps;
            }

            comparisons += 1;

            steps.push(searchStep(
                array,
                [position],
                visited,
                "Choose Side",
                "Determine which side of index " +
                    position + " can contain the target.",
                comparisons,
                low,
                high,
                position,
                "if (a[position] < target)"
            ));

            if (array[position] < target) {
                low = position + 1;

                steps.push(searchStep(
                    array,
                    [],
                    visited,
                    "Move Low",
                    "Discard the left range; low becomes " + low + ".",
                    comparisons,
                    low,
                    high,
                    -1,
                    "low = position + 1"
                ));
            } else {
                high = position - 1;

                steps.push(searchStep(
                    array,
                    [],
                    visited,
                    "Move High",
                    "Discard the right range; high becomes " + high + ".",
                    comparisons,
                    low,
                    high,
                    -1,
                    "high = position - 1"
                ));
            }
        }

        steps.push(searchStep(
            array,
            [],
            visited,
            "Complete",
            "Target " + target +
                " falls outside the remaining range and is not present.",
            comparisons,
            low,
            high,
            -1,
            "return -1;",
            true,
            false
        ));

        return steps;
    }

    function exponentialSearchSteps(values, target) {
        const array = values.slice();
        const steps = [];
        const visited = [];

        let comparisons = 1;

        steps.push(searchStep(
            array,
            [0],
            visited,
            "Check First",
            "Check the first value before expanding the search range.",
            comparisons,
            0,
            0,
            0,
            "if (a[0] == target)"
        ));

        addVisited(visited, 0);

        if (array[0] === target) {
            steps.push(searchStep(
                array,
                [0],
                visited,
                "Complete",
                "Target " + target + " found at index 0.",
                comparisons,
                0,
                0,
                0,
                "return 0;",
                true,
                true
            ));

            return steps;
        }

        let bound = 1;

        steps.push(searchStep(
            array,
            [bound],
            visited,
            "Initialize Bound",
            "Start exponential probing with bound 1.",
            comparisons,
            0,
            Math.min(bound, array.length - 1),
            bound,
            "int bound = 1"
        ));

        while (bound < array.length) {
            comparisons += 1;
            addVisited(visited, bound);

            steps.push(searchStep(
                array,
                [bound],
                visited,
                "Exponential Probe",
                "Compare a[" + bound + "] = " +
                    array[bound] + " with target " + target + ".",
                comparisons,
                0,
                bound,
                bound,
                "while (bound < n && a[bound] < target)"
            ));

            if (array[bound] >= target) {
                break;
            }

            bound *= 2;

            steps.push(searchStep(
                array,
                [],
                visited,
                "Double Bound",
                "Double the bound to " + bound + ".",
                comparisons,
                Math.floor(bound / 2),
                Math.min(bound, array.length - 1),
                -1,
                "bound *= 2"
            ));
        }

        let low = Math.floor(bound / 2);
        let high = Math.min(bound, array.length - 1);

        steps.push(searchStep(
            array,
            [low, high],
            visited,
            "Binary Range",
            "Run Binary Search in the discovered range [" +
                low + ", " + high + "].",
            comparisons,
            low,
            high,
            -1,
            "return binarySearch(a, bound / 2, minInt(bound, n - 1), target)"
        ));

        while (low <= high) {
            const middle =
                low + Math.floor((high - low) / 2);

            comparisons += 1;
            addVisited(visited, middle);

            steps.push(searchStep(
                array,
                [middle],
                visited,
                "Binary Compare",
                "Compare a[" + middle + "] = " +
                    array[middle] + " with target " + target + ".",
                comparisons,
                low,
                high,
                middle,
                "if (a[middle] == target)"
            ));

            if (array[middle] === target) {
                steps.push(searchStep(
                    array,
                    [middle],
                    visited,
                    "Complete",
                    "Target " + target +
                        " found at index " + middle + ".",
                    comparisons,
                    middle,
                    middle,
                    middle,
                    "return middle;",
                    true,
                    true
                ));

                return steps;
            }

            comparisons += 1;

            if (array[middle] < target) {
                low = middle + 1;

                steps.push(searchStep(
                    array,
                    [],
                    visited,
                    "Move Low",
                    "Target is larger; low becomes " + low + ".",
                    comparisons,
                    low,
                    high,
                    -1,
                    "low = middle + 1"
                ));
            } else {
                high = middle - 1;

                steps.push(searchStep(
                    array,
                    [],
                    visited,
                    "Move High",
                    "Target is smaller; high becomes " + high + ".",
                    comparisons,
                    low,
                    high,
                    -1,
                    "high = middle - 1"
                ));
            }
        }

        steps.push(searchStep(
            array,
            [],
            visited,
            "Complete",
            "Target " + target + " is not present.",
            comparisons,
            low,
            high,
            -1,
            "return -1;",
            true,
            false
        ));

        return steps;
    }

    function fibonacciSearchSteps(values, target) {
        const array = values.slice();
        const steps = [];
        const visited = [];

        let fibMm2 = 0;
        let fibMm1 = 1;
        let fibM = fibMm1 + fibMm2;
        let comparisons = 0;

        steps.push(searchStep(
            array,
            [],
            visited,
            "Ready",
            "Build the smallest Fibonacci number not less than n.",
            comparisons,
            0,
            array.length - 1,
            -1,
            "int fibM = fibMm1 + fibMm2"
        ));

        while (fibM < array.length) {
            fibMm2 = fibMm1;
            fibMm1 = fibM;
            fibM = fibMm1 + fibMm2;

            steps.push(searchStep(
                array,
                [],
                visited,
                "Grow Fibonacci",
                "Fibonacci window grows to " + fibM + ".",
                comparisons,
                0,
                array.length - 1,
                -1,
                "while (fibM < n)"
            ));
        }

        let offset = -1;

        steps.push(searchStep(
            array,
            [],
            visited,
            "Initialize Offset",
            "No eliminated prefix yet; offset is -1.",
            comparisons,
            0,
            array.length - 1,
            -1,
            "int offset = -1"
        ));

        while (fibM > 1) {
            const index =
                Math.min(offset + fibMm2, array.length - 1);

            addVisited(visited, index);

            steps.push(searchStep(
                array,
                [index],
                visited,
                "Choose Probe",
                "Use Fibonacci offset to probe index " + index + ".",
                comparisons,
                Math.max(0, offset + 1),
                array.length - 1,
                index,
                "int i = minInt(offset + fibMm2, n - 1)"
            ));

            comparisons += 1;

            steps.push(searchStep(
                array,
                [index],
                visited,
                "Compare",
                "Compare a[" + index + "] = " +
                    array[index] + " with target " + target + ".",
                comparisons,
                Math.max(0, offset + 1),
                array.length - 1,
                index,
                "if (a[i] < target)"
            ));

            if (array[index] < target) {
                fibM = fibMm1;
                fibMm1 = fibMm2;
                fibMm2 = fibM - fibMm1;
                offset = index;

                steps.push(searchStep(
                    array,
                    [],
                    visited,
                    "Move Right",
                    "Discard through index " + index +
                        "; offset becomes " + offset + ".",
                    comparisons,
                    offset + 1,
                    array.length - 1,
                    -1,
                    "offset = i"
                ));
            } else {
                comparisons += 1;

                steps.push(searchStep(
                    array,
                    [index],
                    visited,
                    "Check Smaller",
                    "Check whether the probed value is greater than the target.",
                    comparisons,
                    Math.max(0, offset + 1),
                    array.length - 1,
                    index,
                    "else if (a[i] > target)"
                ));

                if (array[index] > target) {
                    fibM = fibMm2;
                    fibMm1 = fibMm1 - fibMm2;
                    fibMm2 = fibM - fibMm1;

                    steps.push(searchStep(
                        array,
                        [],
                        visited,
                        "Move Left",
                        "Reduce the Fibonacci window to search the left portion.",
                        comparisons,
                        Math.max(0, offset + 1),
                        index - 1,
                        -1,
                        "fibM = fibMm2"
                    ));
                } else {
                    steps.push(searchStep(
                        array,
                        [index],
                        visited,
                        "Complete",
                        "Target " + target +
                            " found at index " + index + ".",
                        comparisons,
                        index,
                        index,
                        index,
                        "return i;",
                        true,
                        true
                    ));

                    return steps;
                }
            }
        }

        const finalIndex = offset + 1;

        if (fibMm1 && finalIndex < array.length) {
            comparisons += 1;
            addVisited(visited, finalIndex);

            steps.push(searchStep(
                array,
                [finalIndex],
                visited,
                "Final Candidate",
                "Check the remaining candidate at index " +
                    finalIndex + ".",
                comparisons,
                finalIndex,
                finalIndex,
                finalIndex,
                "if (fibMm1 && offset + 1 < n && a[offset + 1] == target)"
            ));

            if (array[finalIndex] === target) {
                steps.push(searchStep(
                    array,
                    [finalIndex],
                    visited,
                    "Complete",
                    "Target " + target +
                        " found at index " + finalIndex + ".",
                    comparisons,
                    finalIndex,
                    finalIndex,
                    finalIndex,
                    "return offset + 1;",
                    true,
                    true
                ));

                return steps;
            }
        }

        steps.push(searchStep(
            array,
            [],
            visited,
            "Complete",
            "Target " + target + " is not present.",
            comparisons,
            -1,
            -1,
            -1,
            "return -1;",
            true,
            false
        ));

        return steps;
    }

    function skipLevels(length) {
        const levels = [];

        for (let index = 0; index < length; index += 1) {
            let level = 0;
            let position = index + 1;

            while (position % 2 === 0 && level < 4) {
                level += 1;
                position = Math.floor(position / 2);
            }

            levels.push(level);
        }

        return levels;
    }

    function nextAtLevel(levels, current, level) {
        for (
            let index = current + 1;
            index < levels.length;
            index += 1
        ) {
            if (levels[index] >= level) {
                return index;
            }
        }

        return -1;
    }

    function skipListSearchSteps(values, target) {
        const array = values.slice();
        const levels = skipLevels(array.length);
        const steps = [];
        const visited = [];

        const maximumLevel = Math.max.apply(null, levels);

        let current = -1;
        let comparisons = 0;

        steps.push(searchStep(
            array,
            [],
            visited,
            "Ready",
            "Start from the header at the highest deterministic level " +
                maximumLevel + ".",
            comparisons,
            0,
            array.length - 1,
            -1,
            "/* search start */"
        ));

        for (
            let level = maximumLevel;
            level >= 0;
            level -= 1
        ) {
            steps.push(searchStep(
                array,
                current >= 0 ? [current] : [],
                visited,
                "Level " + level,
                "Search horizontally on level " + level + ".",
                comparisons,
                Math.max(0, current + 1),
                array.length - 1,
                current,
                "/* search levels */"
            ));

            let next = nextAtLevel(levels, current, level);

            while (next !== -1) {
                comparisons += 1;
                addVisited(visited, next);

                steps.push(searchStep(
                    array,
                    [next],
                    visited,
                    "Compare Forward",
                    "At level " + level +
                        ", compare forward value " +
                        array[next] + " with target " + target + ".",
                    comparisons,
                    Math.max(0, current + 1),
                    array.length - 1,
                    next,
                    "/* search compare */"
                ));

                if (array[next] >= target) {
                    break;
                }

                current = next;

                steps.push(searchStep(
                    array,
                    [current],
                    visited,
                    "Move Forward",
                    "Move forward to value " +
                        array[current] + " at index " + current + ".",
                    comparisons,
                    current + 1,
                    array.length - 1,
                    current,
                    "/* search move */"
                ));

                next = nextAtLevel(levels, current, level);
            }
        }

        const candidate = nextAtLevel(levels, current, 0);

        steps.push(searchStep(
            array,
            candidate >= 0 ? [candidate] : [],
            visited,
            "Level 0 Candidate",
            candidate >= 0
                ? "Move to the first level-0 candidate, value " +
                    array[candidate] + "."
                : "There is no level-0 candidate after the current node.",
            comparisons,
            candidate,
            candidate,
            candidate,
            "/* level-zero candidate */"
        ));

        if (candidate >= 0) {
            comparisons += 1;
            addVisited(visited, candidate);

            const found = array[candidate] === target;

            steps.push(searchStep(
                array,
                [candidate],
                visited,
                "Check Match",
                "Compare candidate " +
                    array[candidate] + " with target " + target + ".",
                comparisons,
                candidate,
                candidate,
                candidate,
                "/* search match */"
            ));

            if (found) {
                steps.push(searchStep(
                    array,
                    [candidate],
                    visited,
                    "Complete",
                    "Target " + target +
                        " found at index " + candidate + ".",
                    comparisons,
                    candidate,
                    candidate,
                    candidate,
                    "/* search found */",
                    true,
                    true
                ));

                return steps;
            }
        }

        steps.push(searchStep(
            array,
            [],
            visited,
            "Complete",
            "Target " + target +
                " is not present in the skip list.",
            comparisons,
            -1,
            -1,
            -1,
            "/* search absent */",
            true,
            false
        ));

        return steps;
    }

    function buildSearchSteps(values, target, algorithm) {
        if (algorithm === "jump") {
            return jumpSearchSteps(values, target);
        }

        if (algorithm === "interpolation") {
            return interpolationSearchSteps(values, target);
        }

        if (algorithm === "exponential") {
            return exponentialSearchSteps(values, target);
        }

        if (algorithm === "fibonacci") {
            return fibonacciSearchSteps(values, target);
        }

        return skipListSearchSteps(values, target);
    }

    function parseSortedValues(input) {
        const values = input.value
            .trim()
            .split(/[\s,]+/)
            .filter(Boolean)
            .map(Number);

        if (
            values.length < 2 ||
            values.length > 14 ||
            values.some(function (value) {
                return !Number.isInteger(value);
            })
        ) {
            throw new Error(
                "Enter 2 to 14 valid integers separated by commas or spaces."
            );
        }

        for (let index = 1; index < values.length; index += 1) {
            if (values[index] < values[index - 1]) {
                throw new Error(
                    "Advanced searching requires values in ascending order."
                );
            }
        }

        input.value = values.join(", ");

        return values;
    }

    function parseTarget(input) {
        const target = Number(input.value);

        if (!Number.isInteger(target)) {
            throw new Error("Enter a valid integer target.");
        }

        return target;
    }

    const visualizer = {
        input: document.getElementById("searchArrayInput"),
        target: document.getElementById("searchTargetInput"),
        algorithm: document.getElementById("searchAlgorithm"),
        load: document.getElementById("loadSearchVisualizer"),
        prompt: document.getElementById("searchVisualizerPrompt"),
        result: document.getElementById("searchVisualizerResult"),
        array: document.getElementById("searchVisualizerArray"),
        message: document.getElementById("searchVisualizerMessage"),
        phase: document.getElementById("searchPhase"),
        comparisons: document.getElementById("searchComparisons"),
        range: document.getElementById("searchRange"),
        candidate: document.getElementById("searchCandidate"),
        progress: document.getElementById("searchProgress"),
        status: document.getElementById("searchStepStatus"),
        previous: document.getElementById("searchPrevious"),
        next: document.getElementById("searchNext"),
        auto: document.getElementById("searchAuto"),
        pause: document.getElementById("searchPause"),
        reset: document.getElementById("searchReset")
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

    function invalidateVisualizer() {
        stopVisualizer();

        if (visualizer.result) {
            visualizer.result.hidden = true;
            visualizer.prompt.hidden = false;
        }
    }

    function renderSearchArray(container, step) {
        container.innerHTML = "";

        step.array.forEach(function (value, index) {
            const cell = document.createElement("span");

            cell.textContent = index + ": " + value;

            if (step.visited.indexOf(index) !== -1) {
                cell.classList.add("is-pivot-value");
            }

            if (step.active.indexOf(index) !== -1) {
                cell.classList.remove("is-pivot-value");
                cell.classList.add("is-active-value");
            }

            container.appendChild(cell);
        });
    }

    function renderVisualizer() {
        if (!visualSteps.length) {
            return;
        }

        const step = visualSteps[visualIndex];

        renderSearchArray(visualizer.array, step);

        visualizer.message.textContent = step.message;
        visualizer.phase.textContent = step.phase;
        visualizer.comparisons.textContent =
            String(step.comparisons);

        visualizer.range.textContent =
            step.low >= 0 && step.high >= 0
                ? step.low + "…" + step.high
                : "—";

        visualizer.candidate.textContent =
            step.current >= 0
                ? String(step.current)
                : "—";

        visualizer.status.textContent =
            "Step " + visualIndex +
            " of " + (visualSteps.length - 1);

        visualizer.progress.style.width =
            (
                (visualIndex /
                    Math.max(1, visualSteps.length - 1)) *
                100
            ) + "%";

        visualizer.previous.disabled = visualIndex === 0;

        visualizer.next.disabled =
            visualIndex === visualSteps.length - 1;
    }

    function loadVisualizer() {
        try {
            const values =
                parseSortedValues(visualizer.input);

            const target =
                parseTarget(visualizer.target);

            visualSteps = buildSearchSteps(
                values,
                target,
                visualizer.algorithm.value
            );
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
        visualizer.load.addEventListener(
            "click",
            loadVisualizer
        );

        [
            visualizer.input,
            visualizer.target,
            visualizer.algorithm
        ].forEach(function (control) {
            control.addEventListener(
                "input",
                invalidateVisualizer
            );

            control.addEventListener(
                "change",
                invalidateVisualizer
            );
        });

        document
            .querySelectorAll("[data-search-example]")
            .forEach(function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        const examples = {
                            jump: [
                                "3, 8, 14, 21, 29, 36, 44, 53, 67, 79",
                                "44",
                                "jump"
                            ],
                            interpolation: [
                                "10, 20, 30, 40, 50, 60, 70, 80, 90",
                                "70",
                                "interpolation"
                            ],
                            absent: [
                                "2, 5, 9, 14, 20, 27, 35, 44, 54",
                                "31",
                                "fibonacci"
                            ]
                        };

                        const example =
                            examples[
                                button.dataset.searchExample
                            ];

                        if (!example) {
                            return;
                        }

                        visualizer.input.value = example[0];
                        visualizer.target.value = example[1];
                        visualizer.algorithm.value = example[2];

                        invalidateVisualizer();
                    }
                );
            });

        visualizer.previous.addEventListener(
            "click",
            function () {
                stopVisualizer();

                visualIndex =
                    Math.max(0, visualIndex - 1);

                renderVisualizer();
            }
        );

        visualizer.next.addEventListener(
            "click",
            function () {
                stopVisualizer();

                visualIndex =
                    Math.min(
                        visualSteps.length - 1,
                        visualIndex + 1
                    );

                renderVisualizer();
            }
        );

        visualizer.auto.addEventListener(
            "click",
            function () {
                stopVisualizer();

                if (
                    visualIndex ===
                    visualSteps.length - 1
                ) {
                    visualIndex = 0;
                    renderVisualizer();
                }

                visualTimer = window.setInterval(
                    function () {
                        if (
                            visualIndex >=
                            visualSteps.length - 1
                        ) {
                            stopVisualizer();
                            return;
                        }

                        visualIndex += 1;
                        renderVisualizer();
                    },
                    820
                );
            }
        );

        visualizer.pause.addEventListener(
            "click",
            stopVisualizer
        );

        visualizer.reset.addEventListener(
            "click",
            function () {
                stopVisualizer();
                visualIndex = 0;
                renderVisualizer();
            }
        );
    }

    const traceDefinitions = {
        jump: {
            label: "Jump Search",
            codeKey: "jump-search",
            example:
                "3, 8, 14, 21, 29, 36, 44, 53, 67, 79",
            target: "44"
        },

        interpolation: {
            label: "Interpolation Search",
            codeKey: "interpolation-search",
            example:
                "10, 20, 30, 40, 50, 60, 70, 80, 90",
            target: "70"
        },

        exponential: {
            label: "Exponential Search",
            codeKey: "exponential-search",
            example:
                "2, 5, 9, 14, 20, 27, 35, 44, 54, 65",
            target: "44"
        },

        fibonacci: {
            label: "Fibonacci Search",
            codeKey: "fibonacci-search",
            example:
                "2, 5, 9, 14, 20, 27, 35, 44, 54",
            target: "27"
        },

        skip: {
            label: "Skip List Search",
            codeKey: "skip-list-search",
            example:
                "4, 9, 15, 22, 31, 43, 58, 72, 89",
            target: "58"
        }
    };

    const tracer = {
        input:
            document.getElementById("searchTraceInput"),

        target:
            document.getElementById("searchTraceTarget"),

        algorithm:
            document.getElementById("searchTraceAlgorithm"),

        load:
            document.getElementById("loadSearchTracer"),

        prompt:
            document.getElementById("searchTracePrompt"),

        result:
            document.getElementById("searchTraceResult"),

        title:
            document.getElementById("searchTraceTitle"),

        codeWindow:
            document.getElementById("searchTraceCodeWindow"),

        code:
            document.getElementById("searchTraceCode"),

        message:
            document.getElementById("searchTraceMessage"),

        variables:
            document.getElementById("searchTraceVariables"),

        array:
            document.getElementById("searchTraceArray"),

        output:
            document.getElementById("searchTraceOutput"),

        status:
            document.getElementById("searchTraceStatus"),

        previous:
            document.getElementById("searchTracePrevious"),

        next:
            document.getElementById("searchTraceNext"),

        auto:
            document.getElementById("searchTraceAuto"),

        pause:
            document.getElementById("searchTracePause"),

        reset:
            document.getElementById("searchTraceReset")
    };

    let traceSteps = [];
    let traceIndex = 0;
    let traceTimer = null;
    let traceLines = [];
    let traceTarget = 0;
    let activeDefinition = null;

    function stopTracer() {
        if (traceTimer !== null) {
            window.clearInterval(traceTimer);
            traceTimer = null;
        }
    }

    function invalidateTracer() {
        stopTracer();

        traceSteps = [];
        traceIndex = 0;

        if (tracer.result) {
            tracer.result.hidden = true;
            tracer.prompt.hidden = false;
        }
    }

    function findTraceLine(needle) {
        if (!needle) {
            return -1;
        }

        for (
            let index = 0;
            index < traceLines.length;
            index += 1
        ) {
            if (
                traceLines[index].indexOf(needle) !== -1
            ) {
                return index + 1;
            }
        }

        return -1;
    }

    function loadTraceCode(definition) {
        const source = document.querySelector(
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

        traceLines = text.split("\n");

        tracer.code.innerHTML = "";

        traceLines.forEach(function (line, index) {
            const row = document.createElement("span");

            row.dataset.searchTraceLine =
                String(index + 1);

            row.textContent =
                String(index + 1).padStart(2, "0") +
                " │ " +
                (line || " ");

            tracer.code.appendChild(row);
        });

        tracer.codeWindow.scrollTop = 0;
    }

    function decorateTraceSteps(steps) {
        let previousLine = 1;

        return steps.map(function (step) {
            const line = findTraceLine(step.needle);

            if (line > 0) {
                previousLine = line;
            }

            return Object.assign({}, step, {
                line:
                    line > 0
                        ? line
                        : previousLine
            });
        });
    }

    function appendTraceVariable(label, value) {
        const card = document.createElement("div");
        const name = document.createElement("span");
        const data = document.createElement("strong");

        name.textContent = label;
        data.textContent = String(value);

        card.appendChild(name);
        card.appendChild(data);

        tracer.variables.appendChild(card);
    }

    function renderTracer() {
        if (!traceSteps.length) {
            return;
        }

        const step = traceSteps[traceIndex];

        let activeLine = null;

        tracer.code
            .querySelectorAll("[data-search-trace-line]")
            .forEach(function (line) {
                const active =
                    Number(
                        line.dataset.searchTraceLine
                    ) === step.line;

                line.classList.toggle(
                    "is-active-line",
                    active
                );

                if (active) {
                    activeLine = line;
                }
            });

        tracer.message.textContent = step.message;

        tracer.variables.innerHTML = "";

        appendTraceVariable(
            "Algorithm",
            activeDefinition.label
        );

        appendTraceVariable("Phase", step.phase);
        appendTraceVariable("Target", traceTarget);

        appendTraceVariable(
            "Comparisons",
            step.comparisons
        );

        appendTraceVariable(
            "Range",
            step.low >= 0 && step.high >= 0
                ? step.low + "…" + step.high
                : "—"
        );

        appendTraceVariable(
            "Current Index",
            step.current >= 0
                ? step.current
                : "—"
        );

        renderSearchArray(tracer.array, step);

        tracer.output.textContent =
            step.complete
                ? (
                    step.found
                        ? "Target found at index " +
                            step.current + "."
                        : "Target not found."
                )
                : "—";

        tracer.status.textContent =
            "Step " + traceIndex +
            " of " + (traceSteps.length - 1);

        tracer.previous.disabled =
            traceIndex === 0;

        tracer.next.disabled =
            traceIndex === traceSteps.length - 1;

        if (activeLine) {
            const centeredTop =
                activeLine.offsetTop -
                (tracer.codeWindow.clientHeight / 2) +
                (activeLine.offsetHeight / 2);

            tracer.codeWindow.scrollTo({
                top: Math.max(0, centeredTop),
                behavior: "smooth"
            });
        }
    }

    function loadTracer() {
        const definition =
            traceDefinitions[
                tracer.algorithm.value
            ];

        try {
            const values =
                parseSortedValues(tracer.input);

            traceTarget =
                parseTarget(tracer.target);

            loadTraceCode(definition);

            traceSteps = decorateTraceSteps(
                buildSearchSteps(
                    values,
                    traceTarget,
                    tracer.algorithm.value
                )
            );
        } catch (error) {
            window.alert(error.message);
            return;
        }

        stopTracer();

        activeDefinition = definition;
        traceIndex = 0;

        tracer.title.textContent =
            "PROGRAM TRACING — " +
            definition.label.toUpperCase();

        tracer.prompt.hidden = true;
        tracer.result.hidden = false;

        renderTracer();
    }

    if (tracer.load) {
        tracer.load.addEventListener(
            "click",
            loadTracer
        );

        [
            tracer.input,
            tracer.target
        ].forEach(function (control) {
            control.addEventListener(
                "input",
                invalidateTracer
            );
        });

        tracer.algorithm.addEventListener(
            "change",
            function () {
                const definition =
                    traceDefinitions[
                        tracer.algorithm.value
                    ];

                tracer.input.value =
                    definition.example;

                tracer.target.value =
                    definition.target;

                invalidateTracer();
            }
        );

        tracer.previous.addEventListener(
            "click",
            function () {
                stopTracer();

                traceIndex =
                    Math.max(0, traceIndex - 1);

                renderTracer();
            }
        );

        tracer.next.addEventListener(
            "click",
            function () {
                stopTracer();

                traceIndex =
                    Math.min(
                        traceSteps.length - 1,
                        traceIndex + 1
                    );

                renderTracer();
            }
        );

        tracer.auto.addEventListener(
            "click",
            function () {
                stopTracer();

                if (
                    traceIndex ===
                    traceSteps.length - 1
                ) {
                    traceIndex = 0;
                    renderTracer();
                }

                traceTimer = window.setInterval(
                    function () {
                        if (
                            traceIndex >=
                            traceSteps.length - 1
                        ) {
                            stopTracer();
                            return;
                        }

                        traceIndex += 1;
                        renderTracer();
                    },
                    840
                );
            }
        );

        tracer.pause.addEventListener(
            "click",
            stopTracer
        );

        tracer.reset.addEventListener(
            "click",
            function () {
                stopTracer();
                traceIndex = 0;
                renderTracer();
            }
        );
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

            button.addEventListener(
                "click",
                function () {
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
        });
}());
