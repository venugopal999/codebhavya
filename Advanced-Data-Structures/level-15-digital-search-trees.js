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
        button.setAttribute("aria-expanded", String(open));

        button.textContent = open
            ? (
                target.classList.contains("ads-hint-box")
                    ? "Hide Hint"
                    : "Hide Answer"
            )
            : button.dataset.originalLabel;
    });

    let nodeCounter = 0;

    function createNode(label) {
        nodeCounter += 1;

        return {
            id: "digital-node-" + nodeCounter,
            label: label || "",
            terminal: false,
            value: null,
            children: {}
        };
    }

    function cloneTree(node) {
        if (!node) { return null; }

        const copy = {
            id: node.id,
            label: node.label,
            terminal: node.terminal,
            value: node.value,
            children: {}
        };

        Object.keys(node.children).forEach(function (key) {
            copy.children[key] = cloneTree(
                node.children[key]
            );
        });

        return copy;
    }

    function makeStep(
        root,
        active,
        phase,
        message,
        needle,
        details
    ) {
        const data = details || {};

        return {
            tree: cloneTree(root),
            active: (active || []).slice(),
            phase: phase,
            message: message,
            needle: needle,
            current: data.current || "—",
            symbol: data.symbol || "—",
            depth:
                typeof data.depth === "number"
                    ? data.depth
                    : 0,
            created: data.created || 0,
            result: data.result || "—",
            complete: Boolean(data.complete)
        };
    }

    function childCount(node) {
        return Object.keys(node.children).length;
    }

    function buildTrieSteps(words, query) {
        nodeCounter = 0;

        const root = createNode("");
        const steps = [
            makeStep(
                root,
                [root.id],
                "Create Root",
                "Create an empty root. Characters are stored on outgoing edges.",
                "/* trie create root */",
                {
                    current: "root",
                    created: 1
                }
            )
        ];

        let created = 1;

        words.forEach(function (word) {
            let node = root;
            let path = "";

            steps.push(makeStep(
                root,
                [node.id],
                "Insert Word",
                "Insert “" + word +
                    "” one character at a time.",
                "/* trie insert call */",
                {
                    current: "root",
                    created: created
                }
            ));

            Array.from(word).forEach(
                function (letter, index) {
                    steps.push(makeStep(
                        root,
                        [node.id],
                        "Read Character",
                        "Read character “" + letter +
                            "” at depth " + index + ".",
                        "/* trie insert loop */",
                        {
                            current: path || "root",
                            symbol: letter,
                            depth: index,
                            created: created
                        }
                    ));

                    if (!node.children[letter]) {
                        node.children[letter] =
                            createNode(letter);

                        created += 1;

                        steps.push(makeStep(
                            root,
                            [
                                node.id,
                                node.children[letter].id
                            ],
                            "Create Child",
                            "No “" + letter +
                                "” edge exists, so create it.",
                            "/* trie create child */",
                            {
                                current:
                                    (path || "root") +
                                    " → " + letter,
                                symbol: letter,
                                depth: index + 1,
                                created: created
                            }
                        ));
                    }

                    node = node.children[letter];
                    path += letter;

                    steps.push(makeStep(
                        root,
                        [node.id],
                        "Move Down",
                        "Follow the “" + letter +
                            "” edge. Current prefix is “" +
                            path + "”.",
                        "/* trie move child */",
                        {
                            current: path,
                            symbol: letter,
                            depth: index + 1,
                            created: created
                        }
                    ));
                }
            );

            node.terminal = true;
            node.value = word;

            steps.push(makeStep(
                root,
                [node.id],
                "Mark Word",
                "Mark “" + word +
                    "” as a complete stored word.",
                "/* trie mark terminal */",
                {
                    current: word,
                    depth: word.length,
                    created: created
                }
            ));
        });

        let node = root;
        let path = "";
        let missing = false;

        steps.push(makeStep(
            root,
            [root.id],
            "Search",
            "Search for “" + query + "” from the root.",
            "/* trie search call */",
            {
                current: "root",
                created: created
            }
        ));

        for (
            let index = 0;
            index < query.length;
            index += 1
        ) {
            const letter = query[index];

            steps.push(makeStep(
                root,
                [node.id],
                "Loop Condition",
                "The search loop checks character “" +
                    letter + "” at position " + index + ".",
                "/* trie search loop */",
                {
                    current: path || "root",
                    symbol: letter,
                    depth: index,
                    created: created
                }
            ));

            if (!node.children[letter]) {
                missing = true;

                steps.push(makeStep(
                    root,
                    [node.id],
                    "Not Found",
                    "The required edge is absent, so “" +
                        query + "” is not stored.",
                    "/* trie search miss */",
                    {
                        current: path || "root",
                        symbol: letter,
                        depth: index,
                        created: created,
                        result: "Not found"
                    }
                ));

                break;
            }

            node = node.children[letter];
            path += letter;
        }

        if (!missing) {
            const found = node.terminal;

            steps.push(makeStep(
                root,
                [node.id],
                found ? "Found" : "Prefix Only",
                found
                    ? "The final node is terminal, so the word is found."
                    : "The path exists, but it is only a prefix.",
                "/* trie search found */",
                {
                    current: path,
                    depth: query.length,
                    created: created,
                    result: found
                        ? "Found"
                        : "Not found"
                }
            ));
        }

        steps.push(makeStep(
            root,
            [root.id],
            "Complete",
            "Standard Trie construction and search are complete.",
            "printf(\"%s\\n\", found ? \"Found\" : \"Not Found\");",
            {
                current: "root",
                created: created,
                result: steps[steps.length - 1].result,
                complete: true
            }
        ));

        return steps;
    }

    function toBits(value) {
        return value
            .toString(2)
            .padStart(8, "0");
    }

    function buildBinarySteps(values, query) {
        nodeCounter = 0;

        const root = createNode("");
        const steps = [
            makeStep(
                root,
                [root.id],
                "Create Root",
                "Create a Binary Trie root for 8-bit non-negative integers.",
                "/* binary create root */",
                {
                    current: "root",
                    created: 1
                }
            )
        ];

        let created = 1;

        values.forEach(function (value) {
            const bits = toBits(value);

            let node = root;
            let path = "";

            steps.push(makeStep(
                root,
                [root.id],
                "Insert Number",
                "Insert " + value + " as " + bits + ".",
                "/* binary insert call */",
                {
                    current: "root",
                    created: created
                }
            ));

            Array.from(bits).forEach(
                function (bit, index) {
                    steps.push(makeStep(
                        root,
                        [node.id],
                        "Read Bit",
                        "Read bit " + bit +
                            " at position " +
                            (7 - index) + ".",
                        "/* binary insert loop */",
                        {
                            current: path || "root",
                            symbol: bit,
                            depth: index,
                            created: created
                        }
                    ));

                    if (!node.children[bit]) {
                        node.children[bit] =
                            createNode(bit);

                        created += 1;

                        steps.push(makeStep(
                            root,
                            [
                                node.id,
                                node.children[bit].id
                            ],
                            "Create Bit Edge",
                            "Create the missing “" +
                                bit + "” branch.",
                            "/* binary create child */",
                            {
                                current: path + bit,
                                symbol: bit,
                                depth: index + 1,
                                created: created
                            }
                        ));
                    }

                    node = node.children[bit];
                    path += bit;

                    steps.push(makeStep(
                        root,
                        [node.id],
                        "Move Down",
                        "Follow the “" +
                            bit + "” branch.",
                        "/* binary move child */",
                        {
                            current: path,
                            symbol: bit,
                            depth: index + 1,
                            created: created
                        }
                    ));
                }
            );

            node.terminal = true;
            node.value = value;

            steps.push(makeStep(
                root,
                [node.id],
                "Store Value",
                "Store decimal value " +
                    value + " at this leaf.",
                "/* binary store value */",
                {
                    current: bits,
                    depth: 8,
                    created: created
                }
            ));
        });

        const queryBits = toBits(query);

        let node = root;
        let chosenBits = "";

        steps.push(makeStep(
            root,
            [root.id],
            "Maximum XOR",
            "Find the stored number that maximizes XOR with " +
                query + " (" + queryBits + ").",
            "/* binary xor call */",
            {
                current: "root",
                created: created
            }
        ));

        Array.from(queryBits).forEach(
            function (bit, index) {
                const preferred =
                    bit === "0" ? "1" : "0";

                const chosen =
                    node.children[preferred]
                        ? preferred
                        : bit;

                steps.push(makeStep(
                    root,
                    [node.id],
                    "Loop Condition",
                    "The maximum-XOR loop revisits bit position " +
                        (7 - index) +
                        "; query bit is " + bit +
                        " and preferred branch is " +
                        preferred + ".",
                    "/* binary xor loop */",
                    {
                        current: chosenBits || "root",
                        symbol: preferred,
                        depth: index,
                        created: created
                    }
                ));

                node = node.children[chosen];
                chosenBits += chosen;

                steps.push(makeStep(
                    root,
                    [node.id],
                    "Move Down",
                    "Take branch “" + chosen +
                        "”. Candidate prefix is " +
                        chosenBits + ".",
                    "/* binary xor move */",
                    {
                        current: chosenBits,
                        symbol: chosen,
                        depth: index + 1,
                        created: created
                    }
                ));
            }
        );

        const best = node.value;

        steps.push(makeStep(
            root,
            [node.id],
            "Maximum Found",
            "Best partner is " + best +
                "; " + query + " XOR " +
                best + " = " + (query ^ best) + ".",
            "/* binary xor result */",
            {
                current: chosenBits,
                depth: 8,
                created: created,
                result:
                    "Maximum XOR = " +
                    (query ^ best) +
                    " using " + best
            }
        ));

        steps.push(makeStep(
            root,
            [root.id],
            "Complete",
            "Binary Trie insertion and maximum-XOR search are complete.",
            "printf(\"Partner = %d\\nMaximum XOR = %d\\n\", partner, query ^ partner);",
            {
                current: "root",
                created: created,
                result:
                    "Maximum XOR = " +
                    (query ^ best),
                complete: true
            }
        ));

        return steps;
    }

    function commonPrefixLength(first, second) {
        let index = 0;

        while (
            index < first.length &&
            index < second.length &&
            first[index] === second[index]
        ) {
            index += 1;
        }

        return index;
    }

    function buildPatriciaSteps(words, query) {
        nodeCounter = 0;

        const root = createNode("");
        const steps = [
            makeStep(
                root,
                [root.id],
                "Create Root",
                "Create a compressed Patricia/Radix Trie root.",
                "/* patricia create root */",
                {
                    current: "root",
                    created: 1
                }
            )
        ];

        let created = 1;

        words.forEach(function (word) {
            let node = root;
            let remaining = word;
            let depth = 0;

            steps.push(makeStep(
                root,
                [root.id],
                "Insert Word",
                "Insert “" + word +
                    "” using compressed edge labels.",
                "/* patricia insert call */",
                {
                    current: "root",
                    created: created
                }
            ));

            while (remaining.length) {
                steps.push(makeStep(
                    root,
                    [node.id],
                    "Loop Condition",
                    "The insertion loop checks the remaining text “" +
                        remaining + "”.",
                    "/* patricia insert loop */",
                    {
                        current:
                            word.slice(0, depth) ||
                            "root",
                        symbol: remaining[0],
                        depth: depth,
                        created: created
                    }
                ));

                const key = remaining[0];
                const child = node.children[key];

                if (!child) {
                    const leaf = createNode(remaining);

                    leaf.terminal = true;
                    leaf.value = word;
                    node.children[key] = leaf;
                    created += 1;

                    steps.push(makeStep(
                        root,
                        [node.id, leaf.id],
                        "Create Compressed Edge",
                        "Create one edge labelled “" +
                            remaining + "”.",
                        "/* patricia new edge */",
                        {
                            current: word,
                            symbol: remaining,
                            depth:
                                depth +
                                remaining.length,
                            created: created
                        }
                    ));

                    remaining = "";
                    node = leaf;
                    break;
                }

                const common =
                    commonPrefixLength(
                        remaining,
                        child.label
                    );

                steps.push(makeStep(
                    root,
                    [node.id, child.id],
                    "Compare Edge",
                    "Compare remaining text “" +
                        remaining +
                        "” with edge “" +
                        child.label +
                        "”; common prefix length is " +
                        common + ".",
                    "/* patricia compare prefix */",
                    {
                        current:
                            word.slice(0, depth),
                        symbol: child.label,
                        depth: depth,
                        created: created
                    }
                ));

                if (common === child.label.length) {
                    node = child;
                    remaining =
                        remaining.slice(common);
                    depth += common;

                    steps.push(makeStep(
                        root,
                        [node.id],
                        "Follow Edge",
                        "The whole edge matches; continue after “" +
                            child.label + "”.",
                        "/* patricia descend */",
                        {
                            current:
                                word.slice(0, depth),
                            symbol: child.label,
                            depth: depth,
                            created: created
                        }
                    ));

                    if (!remaining.length) {
                        node.terminal = true;
                        node.value = word;

                        steps.push(makeStep(
                            root,
                            [node.id],
                            "Mark Word",
                            "Mark the matched node as a complete word.",
                            "/* patricia mark terminal */",
                            {
                                current: word,
                                depth: depth,
                                created: created
                            }
                        ));
                    }

                    continue;
                }

                const split = createNode(
                    child.label.slice(0, common)
                );

                const oldSuffix =
                    child.label.slice(common);

                const newSuffix =
                    remaining.slice(common);

                child.label = oldSuffix;
                split.children[oldSuffix[0]] =
                    child;

                node.children[key] = split;
                created += 1;

                if (newSuffix.length) {
                    const leaf =
                        createNode(newSuffix);

                    leaf.terminal = true;
                    leaf.value = word;

                    split.children[newSuffix[0]] =
                        leaf;

                    node = leaf;
                    created += 1;
                } else {
                    split.terminal = true;
                    split.value = word;
                    node = split;
                }

                depth +=
                    common + newSuffix.length;

                steps.push(makeStep(
                    root,
                    [
                        split.id,
                        child.id,
                        node.id
                    ],
                    "Split Edge",
                    "Split at “" +
                        split.label +
                        "”; preserve “" +
                        oldSuffix +
                        "” and add “" +
                        (newSuffix || "word end") +
                        "”.",
                    "current->child[index] = split;",
                    {
                        current: word,
                        symbol: split.label,
                        depth: depth,
                        created: created
                    }
                ));

                remaining = "";
            }
        });

        let node = root;
        let remaining = query;
        let consumed = 0;
        let found = true;

        steps.push(makeStep(
            root,
            [root.id],
            "Search",
            "Search compressed edges for “" +
                query + "”.",
            "/* patricia search call */",
            {
                current: "root",
                created: created
            }
        ));

        while (remaining.length) {
            steps.push(makeStep(
                root,
                [node.id],
                "Loop Condition",
                "The compressed-search loop checks the remaining text “" +
                    remaining + "”.",
                "/* patricia search loop */",
                {
                    current:
                        query.slice(0, consumed) ||
                        "root",
                    symbol: remaining[0],
                    depth: consumed,
                    created: created
                }
            ));

            const child =
                node.children[remaining[0]];

            steps.push(makeStep(
                root,
                child
                    ? [node.id, child.id]
                    : [node.id],
                "Check Edge",
                child
                    ? "Compare with compressed edge “" +
                        child.label + "”."
                    : "No edge begins with “" +
                        remaining[0] + "”.",
                "/* patricia search edge */",
                {
                    current:
                        query.slice(0, consumed) ||
                        "root",
                    symbol: remaining[0],
                    depth: consumed,
                    created: created
                }
            ));

            if (
                !child ||
                remaining.slice(
                    0,
                    child.label.length
                ) !== child.label
            ) {
                found = false;
                break;
            }

            node = child;
            remaining = remaining.slice(
                child.label.length
            );

            consumed += child.label.length;
        }

        found =
            found &&
            !remaining.length &&
            node.terminal;

        steps.push(makeStep(
            root,
            [node.id],
            found ? "Found" : "Not Found",
            found
                ? "The compressed path ends at a terminal node."
                : "The compressed path is absent or ends at a non-terminal node.",
            "/* patricia search result */",
            {
                current:
                    query.slice(0, consumed) ||
                    "root",
                depth: consumed,
                created: created,
                result:
                    found
                        ? "Found"
                        : "Not found"
            }
        ));

        steps.push(makeStep(
            root,
            [root.id],
            "Complete",
            "Patricia/Radix Trie construction and search are complete.",
            "printf(\"%s\\n\", found ? \"Found\" : \"Not Found\");",
            {
                current: "root",
                created: created,
                result:
                    found
                        ? "Found"
                        : "Not found",
                complete: true
            }
        ));

        return steps;
    }

    function buildSuffixSteps(text, query) {
        nodeCounter = 0;

        const root = createNode("");
        const steps = [
            makeStep(
                root,
                [root.id],
                "Create Root",
                "Create an empty Suffix Trie for “" +
                    text + "”.",
                "/* suffix create root */",
                {
                    current: "root",
                    created: 1
                }
            )
        ];

        let created = 1;

        for (
            let start = 0;
            start < text.length;
            start += 1
        ) {
            let node = root;
            const suffix = text.slice(start);
            let path = "";

            steps.push(makeStep(
                root,
                [root.id],
                "Insert Suffix",
                "Insert suffix “" +
                    suffix +
                    "” starting at index " +
                    start + ".",
                "/* suffix insert call */",
                {
                    current: "root",
                    created: created
                }
            ));

            for (
                let index = start;
                index < text.length;
                index += 1
            ) {
                const letter = text[index];

                steps.push(makeStep(
                    root,
                    [node.id],
                    "Read Character",
                    "Read “" + letter +
                        "” from text index " +
                        index + ".",
                    "/* suffix insert loop */",
                    {
                        current: path || "root",
                        symbol: letter,
                        depth: index - start,
                        created: created
                    }
                ));

                if (!node.children[letter]) {
                    node.children[letter] =
                        createNode(letter);

                    created += 1;

                    steps.push(makeStep(
                        root,
                        [
                            node.id,
                            node.children[letter].id
                        ],
                        "Create Child",
                        "Create the missing “" +
                            letter + "” branch.",
                        "/* suffix create child */",
                        {
                            current: path + letter,
                            symbol: letter,
                            depth:
                                index - start + 1,
                            created: created
                        }
                    ));
                }

                node = node.children[letter];
                path += letter;

                steps.push(makeStep(
                    root,
                    [node.id],
                    "Move Down",
                    "Current suffix prefix is “" +
                        path + "”.",
                    "/* suffix move child */",
                    {
                        current: path,
                        symbol: letter,
                        depth:
                            index - start + 1,
                        created: created
                    }
                ));
            }

            node.terminal = true;
            node.value = start;

            steps.push(makeStep(
                root,
                [node.id],
                "Mark Suffix",
                "Mark the end of suffix “" +
                    suffix + "”.",
                "/* suffix mark terminal */",
                {
                    current: suffix,
                    depth: suffix.length,
                    created: created
                }
            ));
        }

        let node = root;
        let path = "";
        let found = true;

        steps.push(makeStep(
            root,
            [root.id],
            "Substring Search",
            "Search for pattern “" +
                query +
                "”. Any root path proves substring occurrence.",
            "/* suffix search call */",
            {
                current: "root",
                created: created
            }
        ));

        for (
            let index = 0;
            index < query.length;
            index += 1
        ) {
            const letter = query[index];

            steps.push(makeStep(
                root,
                [node.id],
                "Loop Condition",
                "The substring-search loop checks edge “" +
                    letter +
                    "” at pattern position " +
                    index + ".",
                "/* suffix search loop */",
                {
                    current: path || "root",
                    symbol: letter,
                    depth: index,
                    created: created
                }
            ));

            if (!node.children[letter]) {
                found = false;
                break;
            }

            node = node.children[letter];
            path += letter;
        }

        steps.push(makeStep(
            root,
            [node.id],
            found ? "Found" : "Not Found",
            found
                ? "The complete pattern path exists, so it is a substring."
                : "The pattern path breaks, so it is absent.",
            "/* suffix search result */",
            {
                current: path || "root",
                depth: path.length,
                created: created,
                result:
                    found
                        ? "Substring found"
                        : "Substring not found"
            }
        ));

        steps.push(makeStep(
            root,
            [root.id],
            "Complete",
            "Suffix Trie construction and substring search are complete.",
            "printf(\"%s\\n\", found ? \"Substring Found\" : \"Substring Not Found\");",
            {
                current: "root",
                created: created,
                result:
                    found
                        ? "Substring found"
                        : "Substring not found",
                complete: true
            }
        ));

        return steps;
    }

    function countNodes(root) {
        if (!root) { return 0; }

        return 1 +
            Object.keys(root.children).reduce(
                function (total, key) {
                    return total +
                        countNodes(
                            root.children[key]
                        );
                },
                0
            );
    }

    function constructionOnly(
        allSteps,
        operationPhase
    ) {
        const cutoff = allSteps.findIndex(
            function (step) {
                return step.phase ===
                    operationPhase;
            }
        );

        return cutoff === -1
            ? allSteps.slice()
            : allSteps.slice(0, cutoff);
    }

    function completeOperation(
        steps,
        root,
        created,
        name,
        operation,
        result
    ) {
        steps.push(makeStep(
            root,
            [root.id],
            "Complete",
            name + " — " +
                operation + " is complete.",
            "/* operation complete */",
            {
                current: "root",
                created: created,
                result: result,
                complete: true
            }
        ));

        return steps;
    }

    function buildTrieOperationSteps(
        words,
        query,
        operation
    ) {
        const steps = constructionOnly(
            buildTrieSteps(words, words[0]),
            "Search"
        );

        const root = cloneTree(
            steps[steps.length - 1].tree
        );

        let created = countNodes(root);

        if (operation === "build") {
            return completeOperation(
                steps,
                root,
                created,
                "Standard Trie",
                "Build",
                words.length + " words stored"
            );
        }

        if (operation === "insert") {
            let node = root;
            let path = "";

            steps.push(makeStep(
                root,
                [root.id],
                "Insert Word",
                "Insert the new word “" +
                    query + "”.",
                "/* trie insert call */",
                {
                    current: "root",
                    created: created
                }
            ));

            Array.from(query).forEach(
                function (letter, index) {
                    steps.push(makeStep(
                        root,
                        [node.id],
                        "Read Character",
                        "Read “" + letter +
                            "” at position " +
                            index + ".",
                        "/* trie insert loop */",
                        {
                            current: path || "root",
                            symbol: letter,
                            depth: index,
                            created: created
                        }
                    ));

                    if (!node.children[letter]) {
                        node.children[letter] =
                            createNode(letter);

                        created += 1;

                        steps.push(makeStep(
                            root,
                            [
                                node.id,
                                node.children[letter].id
                            ],
                            "Create Child",
                            "Create the missing “" +
                                letter + "” edge.",
                            "/* trie create child */",
                            {
                                current:
                                    path + letter,
                                symbol: letter,
                                depth: index + 1,
                                created: created
                            }
                        ));
                    }

                    node = node.children[letter];
                    path += letter;

                    steps.push(makeStep(
                        root,
                        [node.id],
                        "Move Down",
                        "Current prefix is “" +
                            path + "”.",
                        "/* trie move child */",
                        {
                            current: path,
                            symbol: letter,
                            depth: index + 1,
                            created: created
                        }
                    ));
                }
            );

            const existed = node.terminal;

            node.terminal = true;
            node.value = query;

            steps.push(makeStep(
                root,
                [node.id],
                existed
                    ? "Already Stored"
                    : "Mark Word",
                existed
                    ? "The word was already present; the tree is unchanged."
                    : "Mark the final node as a complete word.",
                "/* trie mark terminal */",
                {
                    current: query,
                    depth: query.length,
                    created: created,
                    result:
                        existed
                            ? "Already stored"
                            : "Inserted"
                }
            ));

            return completeOperation(
                steps,
                root,
                created,
                "Standard Trie",
                "Insertion",
                existed
                    ? "Already stored"
                    : "Inserted " + query
            );
        }

        let node = root;
        let path = "";
        const stack = [];
        let pathExists = true;

        steps.push(makeStep(
            root,
            [root.id],
            operation === "delete"
                ? "Locate Word"
                : operation === "autocomplete"
                    ? "Locate Prefix"
                    : operation === "prefix"
                        ? "Prefix Search"
                        : "Exact Search",
            "Follow “" + query +
                "” from the root.",
            "/* trie search call */",
            {
                current: "root",
                created: created
            }
        ));

        for (
            let index = 0;
            index < query.length;
            index += 1
        ) {
            const letter = query[index];

            steps.push(makeStep(
                root,
                [node.id],
                "Check Edge",
                "Check the “" + letter +
                    "” edge at depth " +
                    index + ".",
                "/* trie search loop */",
                {
                    current: path || "root",
                    symbol: letter,
                    depth: index,
                    created: created
                }
            ));

            if (!node.children[letter]) {
                pathExists = false;

                steps.push(makeStep(
                    root,
                    [node.id],
                    "Path Missing",
                    "The required edge is absent.",
                    "/* trie search miss */",
                    {
                        current: path || "root",
                        symbol: letter,
                        depth: index,
                        created: created,
                        result: "Not found"
                    }
                ));

                break;
            }

            stack.push({
                parent: node,
                letter: letter
            });

            node = node.children[letter];
            path += letter;

            steps.push(makeStep(
                root,
                [node.id],
                "Move Down",
                "Reached prefix “" +
                    path + "”.",
                "/* trie move child */",
                {
                    current: path,
                    symbol: letter,
                    depth: index + 1,
                    created: created
                }
            ));
        }

        if (operation === "search") {
            const found =
                pathExists && node.terminal;

            steps.push(makeStep(
                root,
                [node.id],
                found
                    ? "Word Found"
                    : pathExists
                        ? "Prefix Only"
                        : "Not Found",
                found
                    ? "The path ends at a terminal node."
                    : pathExists
                        ? "The path exists, but the final node is not terminal."
                        : "The path is incomplete.",
                "/* trie search found */",
                {
                    current: path || "root",
                    depth: path.length,
                    created: created,
                    result:
                        found
                            ? "Found"
                            : "Not found"
                }
            ));

            return completeOperation(
                steps,
                root,
                created,
                "Standard Trie",
                "Exact Search",
                found ? "Found" : "Not found"
            );
        }

        if (operation === "prefix") {
            const found = pathExists;

            steps.push(makeStep(
                root,
                [node.id],
                found
                    ? "Prefix Found"
                    : "Prefix Missing",
                found
                    ? "Every prefix edge exists; terminal status is not required."
                    : "The prefix path is incomplete.",
                "/* trie search found */",
                {
                    current: path || "root",
                    depth: path.length,
                    created: created,
                    result:
                        found
                            ? "Prefix found"
                            : "Prefix not found"
                }
            ));

            return completeOperation(
                steps,
                root,
                created,
                "Standard Trie",
                "Prefix Search",
                found
                    ? "Prefix found"
                    : "Prefix not found"
            );
        }

        if (operation === "delete") {
            if (
                !pathExists ||
                !node.terminal
            ) {
                steps.push(makeStep(
                    root,
                    [node.id],
                    "Cannot Delete",
                    "The complete word is not stored, so the tree is unchanged.",
                    "/* trie delete miss */",
                    {
                        current: path || "root",
                        depth: path.length,
                        created: created,
                        result: "Word not found"
                    }
                ));

                return completeOperation(
                    steps,
                    root,
                    created,
                    "Standard Trie",
                    "Deletion",
                    "Word not found"
                );
            }

            node.terminal = false;
            node.value = null;

            steps.push(makeStep(
                root,
                [node.id],
                "Clear Terminal",
                "Unmark “" + query +
                    "” as a complete word.",
                "/* trie delete terminal */",
                {
                    current: query,
                    depth: query.length,
                    created: created
                }
            ));

            for (
                let index = stack.length - 1;
                index >= 0;
                index -= 1
            ) {
                const entry = stack[index];
                const child =
                    entry.parent.children[
                        entry.letter
                    ];

                if (
                    child.terminal ||
                    childCount(child) > 0
                ) {
                    steps.push(makeStep(
                        root,
                        [child.id],
                        "Stop Pruning",
                        "This node is terminal or shared by another word, so it must remain.",
                        "/* trie delete keep */",
                        {
                            current:
                                query.slice(
                                    0,
                                    index + 1
                                ),
                            depth: index + 1,
                            created: created
                        }
                    ));

                    break;
                }

                delete entry.parent.children[
                    entry.letter
                ];

                created -= 1;

                steps.push(makeStep(
                    root,
                    [entry.parent.id],
                    "Prune Node",
                    "Remove the unused “" +
                        entry.letter + "” node.",
                    "/* trie delete prune */",
                    {
                        current:
                            query.slice(0, index) ||
                            "root",
                        symbol: entry.letter,
                        depth: index,
                        created: created
                    }
                ));
            }

            return completeOperation(
                steps,
                root,
                created,
                "Standard Trie",
                "Deletion",
                "Deleted " + query
            );
        }

        if (!pathExists) {
            return completeOperation(
                steps,
                root,
                created,
                "Standard Trie",
                "Autocomplete",
                "No suggestions"
            );
        }

        const suggestions = [];

        function collect(
            current,
            currentWord
        ) {
            steps.push(makeStep(
                root,
                [current.id],
                "DFS Visit",
                "Explore descendants of “" +
                    currentWord + "”.",
                "/* trie autocomplete dfs */",
                {
                    current: currentWord,
                    depth: currentWord.length,
                    created: created
                }
            ));

            if (current.terminal) {
                const word =
                    current.value ||
                    currentWord;

                suggestions.push(word);

                steps.push(makeStep(
                    root,
                    [current.id],
                    "Suggestion",
                    "Terminal node found: “" +
                        word + "”.",
                    "/* trie autocomplete output */",
                    {
                        current: word,
                        depth: word.length,
                        created: created,
                        result:
                            suggestions.join(", ")
                    }
                ));
            }

            Object.keys(current.children)
                .sort()
                .forEach(function (letter) {
                    collect(
                        current.children[letter],
                        currentWord + letter
                    );
                });
        }

        collect(node, query);

        return completeOperation(
            steps,
            root,
            created,
            "Standard Trie",
            "Autocomplete",
            suggestions.length
                ? suggestions.join(", ")
                : "No suggestions"
        );
    }

    function buildBinaryOperationSteps(
        values,
        query,
        operation
    ) {
        const steps = constructionOnly(
            buildBinarySteps(
                values,
                values[0]
            ),
            "Maximum XOR"
        );

        const root = cloneTree(
            steps[steps.length - 1].tree
        );

        let created = countNodes(root);

        if (operation === "build") {
            return completeOperation(
                steps,
                root,
                created,
                "Binary Trie",
                "Build",
                values.length +
                    " integers stored"
            );
        }

        const bits = toBits(query);

        if (operation === "insert") {
            let node = root;
            let path = "";

            steps.push(makeStep(
                root,
                [root.id],
                "Insert Number",
                "Insert " + query +
                    " as " + bits + ".",
                "/* binary insert call */",
                {
                    current: "root",
                    created: created
                }
            ));

            Array.from(bits).forEach(
                function (bit, index) {
                    if (!node.children[bit]) {
                        node.children[bit] =
                            createNode(bit);

                        created += 1;

                        steps.push(makeStep(
                            root,
                            [
                                node.id,
                                node.children[bit].id
                            ],
                            "Create Bit Edge",
                            "Create the missing “" +
                                bit + "” branch.",
                            "/* binary create child */",
                            {
                                current: path + bit,
                                symbol: bit,
                                depth: index + 1,
                                created: created
                            }
                        ));
                    }

                    node = node.children[bit];
                    path += bit;

                    steps.push(makeStep(
                        root,
                        [node.id],
                        "Move Down",
                        "Follow bit “" +
                            bit + "”.",
                        "/* binary move child */",
                        {
                            current: path,
                            symbol: bit,
                            depth: index + 1,
                            created: created
                        }
                    ));
                }
            );

            const existed = node.terminal;

            node.terminal = true;
            node.value = query;

            steps.push(makeStep(
                root,
                [node.id],
                existed
                    ? "Already Stored"
                    : "Store Value",
                existed
                    ? "The integer was already stored."
                    : "Store " + query +
                        " at the leaf.",
                "/* binary store value */",
                {
                    current: bits,
                    depth: 8,
                    created: created,
                    result:
                        existed
                            ? "Already stored"
                            : "Inserted"
                }
            ));

            return completeOperation(
                steps,
                root,
                created,
                "Binary Trie",
                "Insertion",
                existed
                    ? "Already stored"
                    : "Inserted " + query
            );
        }

        if (
            operation === "maxxor" ||
            operation === "minxor"
        ) {
            let node = root;
            let chosenBits = "";

            const maximum =
                operation === "maxxor";

            steps.push(makeStep(
                root,
                [root.id],
                maximum
                    ? "Maximum XOR"
                    : "Minimum XOR",
                "Process " + bits +
                    " from MSB to LSB.",
                "/* binary xor call */",
                {
                    current: "root",
                    created: created
                }
            ));

            Array.from(bits).forEach(
                function (bit, index) {
                    const preferred =
                        maximum
                            ? (
                                bit === "0"
                                    ? "1"
                                    : "0"
                            )
                            : bit;

                    const other =
                        preferred === "0"
                            ? "1"
                            : "0";

                    const chosen =
                        node.children[preferred]
                            ? preferred
                            : other;

                    steps.push(makeStep(
                        root,
                        [node.id],
                        "Choose Branch",
                        (
                            maximum
                                ? "Prefer the opposite bit “"
                                : "Prefer the matching bit “"
                        ) +
                            preferred +
                            "”; take “" +
                            chosen + "”.",
                        "/* binary xor loop */",
                        {
                            current:
                                chosenBits ||
                                "root",
                            symbol: chosen,
                            depth: index,
                            created: created
                        }
                    ));

                    node = node.children[chosen];
                    chosenBits += chosen;

                    steps.push(makeStep(
                        root,
                        [node.id],
                        "Move Down",
                        "Candidate bit prefix is " +
                            chosenBits + ".",
                        "/* binary xor move */",
                        {
                            current: chosenBits,
                            symbol: chosen,
                            depth: index + 1,
                            created: created
                        }
                    ));
                }
            );

            const partner = node.value;
            const xorValue = query ^ partner;

            const label =
                maximum
                    ? "Maximum XOR"
                    : "Minimum XOR";

            steps.push(makeStep(
                root,
                [node.id],
                "Partner Found",
                "Partner " + partner +
                    " gives " + query +
                    " XOR " + partner +
                    " = " + xorValue + ".",
                "/* binary xor result */",
                {
                    current: chosenBits,
                    depth: 8,
                    created: created,
                    result:
                        label + " = " +
                        xorValue +
                        " using " + partner
                }
            ));

            return completeOperation(
                steps,
                root,
                created,
                "Binary Trie",
                label,
                label + " = " +
                    xorValue +
                    " using " + partner
            );
        }

        let node = root;
        let path = "";
        let pathExists = true;
        const stack = [];

        steps.push(makeStep(
            root,
            [root.id],
            operation === "delete"
                ? "Locate Number"
                : "Exact Search",
            "Follow the 8-bit key " +
                bits + ".",
            "/* binary search call */",
            {
                current: "root",
                created: created
            }
        ));

        for (
            let index = 0;
            index < bits.length;
            index += 1
        ) {
            const bit = bits[index];

            steps.push(makeStep(
                root,
                [node.id],
                "Check Bit",
                "Check branch “" + bit +
                    "” at bit position " +
                    (7 - index) + ".",
                "/* binary search loop */",
                {
                    current: path || "root",
                    symbol: bit,
                    depth: index,
                    created: created
                }
            ));

            if (!node.children[bit]) {
                pathExists = false;
                break;
            }

            stack.push({
                parent: node,
                bit: bit
            });

            node = node.children[bit];
            path += bit;

            steps.push(makeStep(
                root,
                [node.id],
                "Move Down",
                "Current bit prefix is " +
                    path + ".",
                "/* binary search move */",
                {
                    current: path,
                    symbol: bit,
                    depth: index + 1,
                    created: created
                }
            ));
        }

        if (operation === "search") {
            const found =
                pathExists && node.terminal;

            steps.push(makeStep(
                root,
                [node.id],
                found
                    ? "Number Found"
                    : "Not Found",
                found
                    ? "The full path ends at a stored leaf."
                    : "The full stored key is absent.",
                "/* binary search result */",
                {
                    current: path || "root",
                    depth: path.length,
                    created: created,
                    result:
                        found
                            ? "Found"
                            : "Not found"
                }
            ));

            return completeOperation(
                steps,
                root,
                created,
                "Binary Trie",
                "Exact Search",
                found ? "Found" : "Not found"
            );
        }

        if (
            !pathExists ||
            !node.terminal
        ) {
            steps.push(makeStep(
                root,
                [node.id],
                "Cannot Delete",
                "The integer is not stored, so the tree is unchanged.",
                "/* binary delete miss */",
                {
                    current: path || "root",
                    depth: path.length,
                    created: created,
                    result: "Number not found"
                }
            ));

            return completeOperation(
                steps,
                root,
                created,
                "Binary Trie",
                "Deletion",
                "Number not found"
            );
        }

        node.terminal = false;
        node.value = null;

        steps.push(makeStep(
            root,
            [node.id],
            "Clear Leaf",
            "Remove the stored value from its leaf.",
            "/* binary delete leaf */",
            {
                current: bits,
                depth: 8,
                created: created
            }
        ));

        for (
            let index = stack.length - 1;
            index >= 0;
            index -= 1
        ) {
            const entry = stack[index];

            const child =
                entry.parent.children[
                    entry.bit
                ];

            if (
                child.terminal ||
                childCount(child) > 0
            ) {
                break;
            }

            delete entry.parent.children[
                entry.bit
            ];

            created -= 1;

            steps.push(makeStep(
                root,
                [entry.parent.id],
                "Prune Bit Node",
                "Remove an unused “" +
                    entry.bit + "” branch.",
                "/* binary delete prune */",
                {
                    current:
                        bits.slice(0, index) ||
                        "root",
                    symbol: entry.bit,
                    depth: index,
                    created: created
                }
            ));
        }

        return completeOperation(
            steps,
            root,
            created,
            "Binary Trie",
            "Deletion",
            "Deleted " + query
        );
    }

    function buildPatriciaOperationSteps(
        words,
        query,
        operation
    ) {
        const steps = constructionOnly(
            buildPatriciaSteps(
                words,
                words[0]
            ),
            "Search"
        );

        const root = cloneTree(
            steps[steps.length - 1].tree
        );

        let created = countNodes(root);

        if (operation === "build") {
            return completeOperation(
                steps,
                root,
                created,
                "Patricia / Radix Trie",
                "Build",
                words.length + " words stored"
            );
        }

        if (operation === "insert") {
            let node = root;
            let remaining = query;
            let depth = 0;

            steps.push(makeStep(
                root,
                [root.id],
                "Insert Word",
                "Insert “" + query +
                    "” using compressed edges.",
                "/* patricia insert call */",
                {
                    current: "root",
                    created: created
                }
            ));

            while (remaining.length) {
                const key = remaining[0];
                const child =
                    node.children[key];

                steps.push(makeStep(
                    root,
                    [node.id],
                    "Check Edge",
                    "Compare the remaining text “" +
                        remaining + "”.",
                    "/* patricia insert loop */",
                    {
                        current:
                            query.slice(0, depth) ||
                            "root",
                        symbol: key,
                        depth: depth,
                        created: created
                    }
                ));

                if (!child) {
                    const leaf =
                        createNode(remaining);

                    leaf.terminal = true;
                    leaf.value = query;
                    node.children[key] = leaf;
                    created += 1;

                    steps.push(makeStep(
                        root,
                        [node.id, leaf.id],
                        "Create Compressed Edge",
                        "Create one edge labelled “" +
                            remaining + "”.",
                        "/* patricia new edge */",
                        {
                            current: query,
                            symbol: remaining,
                            depth: query.length,
                            created: created,
                            result: "Inserted"
                        }
                    ));

                    return completeOperation(
                        steps,
                        root,
                        created,
                        "Patricia / Radix Trie",
                        "Insertion",
                        "Inserted " + query
                    );
                }

                const common =
                    commonPrefixLength(
                        remaining,
                        child.label
                    );

                steps.push(makeStep(
                    root,
                    [node.id, child.id],
                    "Compare Prefix",
                    "The longest common prefix with edge “" +
                        child.label +
                        "” has length " +
                        common + ".",
                    "/* patricia compare prefix */",
                    {
                        current:
                            query.slice(0, depth) ||
                            "root",
                        symbol: child.label,
                        depth: depth,
                        created: created
                    }
                ));

                if (
                    common ===
                    child.label.length
                ) {
                    node = child;

                    remaining =
                        remaining.slice(common);

                    depth += common;

                    if (!remaining.length) {
                        const existed =
                            node.terminal;

                        node.terminal = true;
                        node.value = query;

                        steps.push(makeStep(
                            root,
                            [node.id],
                            existed
                                ? "Already Stored"
                                : "Mark Word",
                            existed
                                ? "The word was already stored."
                                : "Mark this compressed node terminal.",
                            "/* patricia mark terminal */",
                            {
                                current: query,
                                depth: query.length,
                                created: created,
                                result:
                                    existed
                                        ? "Already stored"
                                        : "Inserted"
                            }
                        ));

                        return completeOperation(
                            steps,
                            root,
                            created,
                            "Patricia / Radix Trie",
                            "Insertion",
                            existed
                                ? "Already stored"
                                : "Inserted " + query
                        );
                    }

                    continue;
                }

                const split = createNode(
                    child.label.slice(0, common)
                );

                const oldSuffix =
                    child.label.slice(common);

                const newSuffix =
                    remaining.slice(common);

                child.label = oldSuffix;

                split.children[oldSuffix[0]] =
                    child;

                node.children[key] = split;
                created += 1;

                if (newSuffix) {
                    const leaf =
                        createNode(newSuffix);

                    leaf.terminal = true;
                    leaf.value = query;

                    split.children[newSuffix[0]] =
                        leaf;

                    created += 1;
                } else {
                    split.terminal = true;
                    split.value = query;
                }

                steps.push(makeStep(
                    root,
                    [split.id, child.id],
                    "Split Edge",
                    "Create prefix “" +
                        split.label +
                        "”, preserve “" +
                        oldSuffix +
                        "” and add “" +
                        (newSuffix || "word end") +
                        "”.",
                    "/* patricia split edge */",
                    {
                        current: query,
                        symbol: split.label,
                        depth: query.length,
                        created: created,
                        result: "Inserted"
                    }
                ));

                return completeOperation(
                    steps,
                    root,
                    created,
                    "Patricia / Radix Trie",
                    "Insertion",
                    "Inserted " + query
                );
            }
        }

        let node = root;
        let remaining = query;
        let consumed = 0;
        let pathExists = true;
        let endedInsideEdge = false;
        const stack = [];

        steps.push(makeStep(
            root,
            [root.id],
            operation === "delete"
                ? "Locate Word"
                : operation === "autocomplete"
                    ? "Locate Prefix"
                    : operation === "prefix"
                        ? "Prefix Search"
                        : "Exact Search",
            "Match “" + query +
                "” against compressed edge labels.",
            "/* patricia search call */",
            {
                current: "root",
                created: created
            }
        ));

        while (remaining.length) {
            const key = remaining[0];
            const child =
                node.children[key];

            steps.push(makeStep(
                root,
                child
                    ? [node.id, child.id]
                    : [node.id],
                "Check Edge",
                child
                    ? "Compare with edge “" +
                        child.label + "”."
                    : "No edge begins with “" +
                        key + "”.",
                "/* patricia search edge */",
                {
                    current:
                        query.slice(0, consumed) ||
                        "root",
                    symbol: key,
                    depth: consumed,
                    created: created
                }
            ));

            if (!child) {
                pathExists = false;
                break;
            }

            const common =
                commonPrefixLength(
                    remaining,
                    child.label
                );

            if (
                (
                    operation === "prefix" ||
                    operation === "autocomplete"
                ) &&
                common === remaining.length
            ) {
                node = child;
                consumed += common;
                remaining = "";

                endedInsideEdge =
                    common < child.label.length;

                steps.push(makeStep(
                    root,
                    [node.id],
                    endedInsideEdge
                        ? "Prefix Ends Inside Edge"
                        : "Prefix Node Reached",
                    "The complete prefix matches, so the prefix exists.",
                    "/* patricia prefix result */",
                    {
                        current: query,
                        symbol: child.label,
                        depth: consumed,
                        created: created
                    }
                ));

                break;
            }

            if (
                common !== child.label.length
            ) {
                pathExists = false;
                break;
            }

            stack.push({
                parent: node,
                key: key,
                node: child
            });

            node = child;

            remaining =
                remaining.slice(common);

            consumed += common;

            steps.push(makeStep(
                root,
                [node.id],
                "Follow Edge",
                "Consume the full edge label “" +
                    child.label + "”.",
                "/* patricia descend */",
                {
                    current:
                        query.slice(0, consumed),
                    symbol: child.label,
                    depth: consumed,
                    created: created
                }
            ));
        }

        if (operation === "search") {
            const found =
                pathExists &&
                !remaining.length &&
                node.terminal;

            steps.push(makeStep(
                root,
                [node.id],
                found
                    ? "Word Found"
                    : "Not Found",
                found
                    ? "The compressed path ends at a terminal node."
                    : "The exact word is absent or ends at a non-terminal node.",
                "/* patricia search result */",
                {
                    current:
                        query.slice(0, consumed) ||
                        "root",
                    depth: consumed,
                    created: created,
                    result:
                        found
                            ? "Found"
                            : "Not found"
                }
            ));

            return completeOperation(
                steps,
                root,
                created,
                "Patricia / Radix Trie",
                "Exact Search",
                found ? "Found" : "Not found"
            );
        }

        if (operation === "prefix") {
            const found =
                pathExists &&
                !remaining.length;

            steps.push(makeStep(
                root,
                [node.id],
                found
                    ? "Prefix Found"
                    : "Prefix Missing",
                found
                    ? (
                        endedInsideEdge
                            ? "A prefix may end inside a compressed edge."
                            : "The complete prefix path exists."
                    )
                    : "The compressed path does not match the prefix.",
                "/* patricia prefix result */",
                {
                    current:
                        query.slice(0, consumed) ||
                        "root",
                    depth: consumed,
                    created: created,
                    result:
                        found
                            ? "Prefix found"
                            : "Prefix not found"
                }
            ));

            return completeOperation(
                steps,
                root,
                created,
                "Patricia / Radix Trie",
                "Prefix Search",
                found
                    ? "Prefix found"
                    : "Prefix not found"
            );
        }

        if (operation === "delete") {
            if (
                !pathExists ||
                remaining.length ||
                !node.terminal
            ) {
                steps.push(makeStep(
                    root,
                    [node.id],
                    "Cannot Delete",
                    "The exact word is not stored.",
                    "/* patricia delete miss */",
                    {
                        current:
                            query.slice(
                                0,
                                consumed
                            ) || "root",
                        depth: consumed,
                        created: created,
                        result: "Word not found"
                    }
                ));

                return completeOperation(
                    steps,
                    root,
                    created,
                    "Patricia / Radix Trie",
                    "Deletion",
                    "Word not found"
                );
            }

            node.terminal = false;
            node.value = null;

            steps.push(makeStep(
                root,
                [node.id],
                "Clear Terminal",
                "Unmark “" + query +
                    "” as a complete word.",
                "/* patricia delete terminal */",
                {
                    current: query,
                    depth: query.length,
                    created: created
                }
            ));

            for (
                let index = stack.length - 1;
                index >= 0;
                index -= 1
            ) {
                const entry = stack[index];

                const current =
                    entry.parent.children[
                        entry.key
                    ];

                if (!current) {
                    continue;
                }

                const keys =
                    Object.keys(
                        current.children
                    );

                if (
                    !current.terminal &&
                    keys.length === 0
                ) {
                    delete entry.parent.children[
                        entry.key
                    ];

                    created -= 1;

                    steps.push(makeStep(
                        root,
                        [entry.parent.id],
                        "Remove Empty Edge",
                        "Remove the empty compressed edge “" +
                            current.label + "”.",
                        "/* patricia delete leaf */",
                        {
                            current:
                                query.slice(
                                    0,
                                    index
                                ) || "root",
                            symbol: current.label,
                            created: created
                        }
                    ));

                    continue;
                }

                if (
                    !current.terminal &&
                    keys.length === 1
                ) {
                    const child =
                        current.children[keys[0]];

                    const oldLabel =
                        current.label;

                    current.label +=
                        child.label;

                    current.terminal =
                        child.terminal;

                    current.value =
                        child.value;

                    current.children =
                        child.children;

                    created -= 1;

                    steps.push(makeStep(
                        root,
                        [current.id],
                        "Merge Path",
                        "Merge “" +
                            oldLabel +
                            "” with its only child “" +
                            child.label + "”.",
                        "/* patricia delete merge */",
                        {
                            current:
                                current.label,
                            symbol:
                                current.label,
                            created: created
                        }
                    ));
                }
            }

            return completeOperation(
                steps,
                root,
                created,
                "Patricia / Radix Trie",
                "Deletion",
                "Deleted " + query
            );
        }

        if (
            !pathExists ||
            remaining.length
        ) {
            return completeOperation(
                steps,
                root,
                created,
                "Patricia / Radix Trie",
                "Autocomplete",
                "No suggestions"
            );
        }

        const suggestions = [];

        function collect(current) {
            steps.push(makeStep(
                root,
                [current.id],
                "DFS Visit",
                "Explore compressed descendants for matching words.",
                "/* patricia autocomplete dfs */",
                {
                    current:
                        current.value ||
                        current.label,
                    symbol: current.label,
                    created: created
                }
            ));

            if (
                current.terminal &&
                current.value
            ) {
                suggestions.push(
                    current.value
                );

                steps.push(makeStep(
                    root,
                    [current.id],
                    "Suggestion",
                    "Terminal word found: “" +
                        current.value + "”.",
                    "/* patricia autocomplete output */",
                    {
                        current:
                            current.value,
                        depth:
                            current.value.length,
                        created: created,
                        result:
                            suggestions.join(", ")
                    }
                ));
            }

            Object.keys(current.children)
                .sort()
                .forEach(function (key) {
                    collect(
                        current.children[key]
                    );
                });
        }

        collect(node);

        return completeOperation(
            steps,
            root,
            created,
            "Patricia / Radix Trie",
            "Autocomplete",
            suggestions.length
                ? suggestions.join(", ")
                : "No suggestions"
        );
    }

    function buildSuffixOperationSteps(
        text,
        query,
        operation
    ) {
        const steps = constructionOnly(
            buildSuffixSteps(text, text[0]),
            "Substring Search"
        );

        const root = cloneTree(
            steps[steps.length - 1].tree
        );

        const created = countNodes(root);

        if (operation === "build") {
            return completeOperation(
                steps,
                root,
                created,
                "Suffix Trie",
                "Build",
                text.length +
                    " suffixes stored"
            );
        }

        if (operation === "longest") {
            let best = "";
            let firstPosition = -1;
            let secondPosition = -1;

            steps.push(makeStep(
                root,
                [root.id],
                "Compare Suffixes",
                "Find the longest common prefix shared by at least two suffixes.",
                "/* suffix longest loop */",
                {
                    current: "root",
                    created: created
                }
            ));

            for (
                let first = 0;
                first < text.length;
                first += 1
            ) {
                for (
                    let second = first + 1;
                    second < text.length;
                    second += 1
                ) {
                    let length = 0;

                    while (
                        second + length <
                            text.length &&
                        text[first + length] ===
                            text[second + length]
                    ) {
                        length += 1;
                    }

                    if (length > best.length) {
                        best = text.slice(
                            first,
                            first + length
                        );

                        firstPosition = first;
                        secondPosition = second;
                    }
                }
            }

            let node = root;
            let path = "";

            Array.from(best).forEach(
                function (letter, index) {
                    node =
                        node.children[letter];

                    path += letter;

                    steps.push(makeStep(
                        root,
                        [node.id],
                        "Follow Repeated Path",
                        "The repeated prefix now reaches “" +
                            path + "”.",
                        "/* suffix longest path */",
                        {
                            current: path,
                            symbol: letter,
                            depth: index + 1,
                            created: created
                        }
                    ));
                }
            );

            const result = best
                ? (
                    "Longest repeated = " +
                    best +
                    " at " +
                    firstPosition +
                    ", " +
                    secondPosition
                )
                : "No repeated substring";

            steps.push(makeStep(
                root,
                best
                    ? [node.id]
                    : [root.id],
                best
                    ? "Longest Repeated Substring"
                    : "No Repetition",
                best
                    ? "The deepest path shared by two suffixes is “" +
                        best + "”."
                    : "No non-empty substring repeats.",
                "/* suffix longest result */",
                {
                    current: best || "root",
                    depth: best.length,
                    created: created,
                    result: result
                }
            ));

            return completeOperation(
                steps,
                root,
                created,
                "Suffix Trie",
                "Longest Repeated Substring",
                result
            );
        }

        let node = root;
        let path = "";
        let found = true;

        steps.push(makeStep(
            root,
            [root.id],
            operation === "suffix"
                ? "Suffix Search"
                : operation === "occurrences"
                    ? "Occurrence Search"
                    : "Substring Search",
            "Follow pattern “" +
                query + "” from the root.",
            "/* suffix search call */",
            {
                current: "root",
                created: created
            }
        ));

        for (
            let index = 0;
            index < query.length;
            index += 1
        ) {
            const letter = query[index];

            steps.push(makeStep(
                root,
                [node.id],
                "Check Edge",
                "Check edge “" + letter +
                    "” at pattern position " +
                    index + ".",
                "/* suffix search loop */",
                {
                    current: path || "root",
                    symbol: letter,
                    depth: index,
                    created: created
                }
            ));

            if (!node.children[letter]) {
                found = false;
                break;
            }

            node = node.children[letter];
            path += letter;

            steps.push(makeStep(
                root,
                [node.id],
                "Move Down",
                "Current matched pattern is “" +
                    path + "”.",
                "/* suffix move child */",
                {
                    current: path,
                    symbol: letter,
                    depth: index + 1,
                    created: created
                }
            ));
        }

        if (operation === "suffix") {
            found =
                found && node.terminal;

            steps.push(makeStep(
                root,
                [node.id],
                found
                    ? "Suffix Found"
                    : "Not a Suffix",
                found
                    ? "The path ends at a marked suffix end."
                    : "The path is absent or does not end at a suffix marker.",
                "/* suffix search result */",
                {
                    current: path || "root",
                    depth: path.length,
                    created: created,
                    result:
                        found
                            ? "Suffix found"
                            : "Suffix not found"
                }
            ));

            return completeOperation(
                steps,
                root,
                created,
                "Suffix Trie",
                "Suffix Search",
                found
                    ? "Suffix found"
                    : "Suffix not found"
            );
        }

        if (operation === "substring") {
            steps.push(makeStep(
                root,
                [node.id],
                found
                    ? "Substring Found"
                    : "Not Found",
                found
                    ? "A complete root path proves substring occurrence."
                    : "The pattern path breaks.",
                "/* suffix search result */",
                {
                    current: path || "root",
                    depth: path.length,
                    created: created,
                    result:
                        found
                            ? "Substring found"
                            : "Substring not found"
                }
            ));

            return completeOperation(
                steps,
                root,
                created,
                "Suffix Trie",
                "Substring Search",
                found
                    ? "Substring found"
                    : "Substring not found"
            );
        }

        const positions = [];

        if (found) {
            for (
                let index = 0;
                index <=
                    text.length - query.length;
                index += 1
            ) {
                if (
                    text.slice(
                        index,
                        index + query.length
                    ) === query
                ) {
                    positions.push(index);
                }
            }
        }

        const result = positions.length
            ? (
                positions.length +
                " occurrence(s) at " +
                positions.join(", ")
            )
            : "No occurrences";

        steps.push(makeStep(
            root,
            [node.id],
            positions.length
                ? "Occurrences Found"
                : "No Occurrences",
            positions.length
                ? "Collect every suffix position below the pattern node."
                : "No suffix begins with the pattern.",
            "/* suffix occurrence result */",
            {
                current: path || "root",
                depth: path.length,
                created: created,
                result: result
            }
        ));

        return completeOperation(
            steps,
            root,
            created,
            "Suffix Trie",
            "Occurrence Search",
            result
        );
    }

    function parseInputs(
        structure,
        dataInput,
        queryInput,
        operation
    ) {
        const queryRequired =
            operation !== "build" &&
            operation !== "longest";

        if (structure === "binary") {
            const values = dataInput.value
                .trim()
                .split(/[\s,]+/)
                .filter(Boolean)
                .map(Number);

            const query = queryRequired
                ? Number(
                    queryInput.value.trim()
                )
                : 0;

            if (
                values.length < 2 ||
                values.length > 10 ||
                values.some(function (value) {
                    return (
                        !Number.isInteger(value) ||
                        value < 0 ||
                        value > 255
                    );
                })
            ) {
                throw new Error(
                    "Enter 2 to 10 distinct integers from 0 to 255."
                );
            }

            if (
                new Set(values).size !==
                values.length
            ) {
                throw new Error(
                    "Use distinct integers in the Binary Trie."
                );
            }

            if (
                queryRequired &&
                (
                    !Number.isInteger(query) ||
                    query < 0 ||
                    query > 255
                )
            ) {
                throw new Error(
                    "Enter a query integer from 0 to 255."
                );
            }

            dataInput.value =
                values.join(", ");

            if (queryRequired) {
                queryInput.value =
                    String(query);
            }

            return {
                data: values,
                query: query
            };
        }

        if (structure === "suffix") {
            const text = dataInput.value
                .trim()
                .toLowerCase();

            const query = queryRequired
                ? queryInput.value
                    .trim()
                    .toLowerCase()
                : "";

            if (!/^[a-z]{3,8}$/.test(text)) {
                throw new Error(
                    "Enter one lowercase text containing 3 to 8 letters."
                );
            }

            if (
                queryRequired &&
                (
                    !/^[a-z]+$/.test(query) ||
                    query.length > text.length
                )
            ) {
                throw new Error(
                    "Enter a lowercase pattern no longer than the text."
                );
            }

            dataInput.value = text;

            if (queryRequired) {
                queryInput.value = query;
            }

            return {
                data: text,
                query: query
            };
        }

        const words = dataInput.value
            .trim()
            .toLowerCase()
            .split(/[\s,]+/)
            .filter(Boolean);

        const query = queryRequired
            ? queryInput.value
                .trim()
                .toLowerCase()
            : "";

        if (
            words.length < 2 ||
            words.length > 8 ||
            words.some(function (word) {
                return !/^[a-z]{1,10}$/.test(
                    word
                );
            })
        ) {
            throw new Error(
                "Enter 2 to 8 lowercase words, each containing at most 10 letters."
            );
        }

        if (
            new Set(words).size !==
            words.length
        ) {
            throw new Error(
                "Use distinct words."
            );
        }

        if (
            queryRequired &&
            !/^[a-z]{1,10}$/.test(query)
        ) {
            throw new Error(
                "Enter one lowercase query word."
            );
        }

        dataInput.value =
            words.join(", ");

        if (queryRequired) {
            queryInput.value = query;
        }

        return {
            data: words,
            query: query
        };
    }

    function buildSteps(
        structure,
        data,
        query,
        operation
    ) {
        if (operation) {
            if (structure === "trie") {
                return buildTrieOperationSteps(
                    data,
                    query,
                    operation
                );
            }

            if (structure === "binary") {
                return buildBinaryOperationSteps(
                    data,
                    query,
                    operation
                );
            }

            if (structure === "patricia") {
                return buildPatriciaOperationSteps(
                    data,
                    query,
                    operation
                );
            }

            return buildSuffixOperationSteps(
                data,
                query,
                operation
            );
        }

        if (structure === "trie") {
            return buildTrieSteps(
                data,
                query
            );
        }

        if (structure === "binary") {
            return buildBinarySteps(
                data,
                query
            );
        }

        if (structure === "patricia") {
            return buildPatriciaSteps(
                data,
                query
            );
        }

        return buildSuffixSteps(
            data,
            query
        );
    }

    function svgElement(name, attributes) {
        const element =
            document.createElementNS(
                SVG_NS,
                name
            );

        Object.keys(attributes || {})
            .forEach(function (key) {
                element.setAttribute(
                    key,
                    attributes[key]
                );
            });

        return element;
    }

    function renderDigitalTree(
        svg,
        root,
        active,
        structure
    ) {
        svg.innerHTML = "";

        if (!root) { return; }

        const items = [];
        const edges = [];
        let leafSlot = 0;

        function layout(node, depth) {
            const keys =
                Object.keys(node.children)
                    .sort();

            const childItems = keys.map(
                function (key) {
                    const childItem = layout(
                        node.children[key],
                        depth + 1
                    );

                    edges.push({
                        from: null,
                        to: childItem,
                        label:
                            node.children[key]
                                .label || key,
                        parentNode: node
                    });

                    return childItem;
                }
            );

            let x;

            if (!childItems.length) {
                x = leafSlot;
                leafSlot += 1;
            } else {
                x = childItems.reduce(
                    function (sum, item) {
                        return sum +
                            item.slot;
                    },
                    0
                ) / childItems.length;
            }

            const item = {
                node: node,
                depth: depth,
                slot: x,
                children: childItems
            };

            items.push(item);

            childItems.forEach(
                function (childItem) {
                    const edge = edges.find(
                        function (candidate) {
                            return (
                                candidate.to ===
                                    childItem &&
                                candidate.from ===
                                    null &&
                                candidate.parentNode ===
                                    node
                            );
                        }
                    );

                    if (edge) {
                        edge.from = item;
                    }
                }
            );

            return item;
        }

        layout(root, 0);

        const width = Math.max(
            900,
            Math.max(1, leafSlot) * 105
        );

        const maxDepth = items.reduce(
            function (maximum, item) {
                return Math.max(
                    maximum,
                    item.depth
                );
            },
            0
        );

        const height = Math.max(
            210,
            95 + maxDepth * 92
        );

        items.forEach(function (item) {
            item.x = leafSlot <= 1
                ? width / 2
                : 55 +
                    item.slot *
                    (
                        (width - 110) /
                        (leafSlot - 1)
                    );

            item.y =
                45 + item.depth * 92;
        });

        edges.forEach(function (edge) {
            if (!edge.from) { return; }

            svg.appendChild(svgElement(
                "line",
                {
                    x1: edge.from.x,
                    y1: edge.from.y + 22,
                    x2: edge.to.x,
                    y2: edge.to.y - 22,
                    class: "digital-tree-edge"
                }
            ));

            const label = svgElement(
                "text",
                {
                    x:
                        (
                            edge.from.x +
                            edge.to.x
                        ) / 2,
                    y:
                        (
                            edge.from.y +
                            edge.to.y
                        ) / 2 - 5,
                    class:
                        "digital-edge-label"
                }
            );

            label.textContent = edge.label;
            svg.appendChild(label);
        });

        items.forEach(function (item) {
            const className =
                "digital-tree-node is-" +
                structure +
                (
                    item.node.terminal
                        ? " is-terminal"
                        : ""
                ) +
                (
                    active.indexOf(
                        item.node.id
                    ) !== -1
                        ? " is-active"
                        : ""
                );

            const group = svgElement(
                "g",
                {
                    class: className
                }
            );

            group.appendChild(svgElement(
                "circle",
                {
                    cx: item.x,
                    cy: item.y,
                    r: "23"
                }
            ));

            if (item.node.terminal) {
                group.appendChild(
                    svgElement(
                        "circle",
                        {
                            cx: item.x,
                            cy: item.y,
                            r: "18",
                            class:
                                "digital-terminal-ring"
                        }
                    )
                );
            }

            const text = svgElement(
                "text",
                {
                    x: item.x,
                    y: item.y + 5,
                    class: "digital-node-key"
                }
            );

            text.textContent =
                item.depth === 0
                    ? "R"
                    : (
                        item.node.value !==
                            null &&
                        structure === "binary"
                    )
                        ? String(
                            item.node.value
                        )
                        : item.node.terminal
                            ? "✓"
                            : "•";

            group.appendChild(text);
            svg.appendChild(group);
        });

        svg.setAttribute(
            "viewBox",
            "0 0 " +
                width + " " + height
        );

        svg.style.height =
            Math.min(390, height) + "px";
    }

    const definitions = {
        trie: {
            label: "Standard Trie",
            codeKey: "standard-trie",
            dataLabel: "Words",
            queryLabel: "Search Word",
            exampleData:
                "app, apple, bat, ball, bag",
            exampleQuery: "apple",
            defaultOperation: "search"
        },
        binary: {
            label: "Binary Trie",
            codeKey: "binary-trie",
            dataLabel:
                "Integers (0–255)",
            queryLabel: "XOR Query",
            exampleData:
                "5, 25, 10, 2, 8",
            exampleQuery: "5",
            defaultOperation: "maxxor"
        },
        patricia: {
            label:
                "Patricia / Radix Trie",
            codeKey: "patricia-trie",
            dataLabel: "Words",
            queryLabel: "Search Word",
            exampleData:
                "bear, bell, bid, bull, buy",
            exampleQuery: "bell",
            defaultOperation: "search"
        },
        suffix: {
            label: "Suffix Trie",
            codeKey: "suffix-trie",
            dataLabel:
                "Text (3–8 letters)",
            queryLabel: "Substring",
            exampleData: "banana",
            exampleQuery: "ana",
            defaultOperation: "substring"
        }
    };

    const operationDefinitions = {
        trie: [
            {
                value: "build",
                label: "Build Dataset",
                queryLabel:
                    "No target required",
                example: "",
                queryRequired: false
            },
            {
                value: "insert",
                label: "Insert Word",
                queryLabel:
                    "Word to Insert",
                example: "band",
                queryRequired: true
            },
            {
                value: "search",
                label: "Exact Search",
                queryLabel:
                    "Search Word",
                example: "apple",
                queryRequired: true
            },
            {
                value: "prefix",
                label: "Prefix Search",
                queryLabel: "Prefix",
                example: "ba",
                queryRequired: true
            },
            {
                value: "delete",
                label: "Delete Word",
                queryLabel:
                    "Word to Delete",
                example: "ball",
                queryRequired: true
            },
            {
                value: "autocomplete",
                label: "Autocomplete",
                queryLabel: "Prefix",
                example: "ba",
                queryRequired: true
            }
        ],
        binary: [
            {
                value: "build",
                label: "Build Dataset",
                queryLabel:
                    "No target required",
                example: "",
                queryRequired: false
            },
            {
                value: "insert",
                label: "Insert Integer",
                queryLabel:
                    "Integer to Insert",
                example: "12",
                queryRequired: true
            },
            {
                value: "search",
                label: "Exact Search",
                queryLabel:
                    "Search Integer",
                example: "10",
                queryRequired: true
            },
            {
                value: "delete",
                label: "Delete Integer",
                queryLabel:
                    "Integer to Delete",
                example: "8",
                queryRequired: true
            },
            {
                value: "maxxor",
                label: "Maximum XOR",
                queryLabel: "XOR Query",
                example: "5",
                queryRequired: true
            },
            {
                value: "minxor",
                label: "Minimum XOR",
                queryLabel: "XOR Query",
                example: "7",
                queryRequired: true
            }
        ],
        patricia: [
            {
                value: "build",
                label: "Build Dataset",
                queryLabel:
                    "No target required",
                example: "",
                queryRequired: false
            },
            {
                value: "insert",
                label: "Insert Word",
                queryLabel:
                    "Word to Insert",
                example: "be",
                queryRequired: true
            },
            {
                value: "search",
                label: "Exact Search",
                queryLabel:
                    "Search Word",
                example: "bell",
                queryRequired: true
            },
            {
                value: "prefix",
                label: "Prefix Search",
                queryLabel: "Prefix",
                example: "bea",
                queryRequired: true
            },
            {
                value: "delete",
                label: "Delete Word",
                queryLabel:
                    "Word to Delete",
                example: "bell",
                queryRequired: true
            },
            {
                value: "autocomplete",
                label: "Autocomplete",
                queryLabel: "Prefix",
                example: "bu",
                queryRequired: true
            }
        ],
        suffix: [
            {
                value: "build",
                label:
                    "Build All Suffixes",
                queryLabel:
                    "No pattern required",
                example: "",
                queryRequired: false
            },
            {
                value: "substring",
                label:
                    "Substring Search",
                queryLabel: "Substring",
                example: "ana",
                queryRequired: true
            },
            {
                value: "suffix",
                label: "Suffix Search",
                queryLabel: "Suffix",
                example: "nana",
                queryRequired: true
            },
            {
                value: "occurrences",
                label:
                    "Find Occurrences",
                queryLabel: "Pattern",
                example: "ana",
                queryRequired: true
            },
            {
                value: "longest",
                label:
                    "Longest Repeated Substring",
                queryLabel:
                    "No pattern required",
                example: "",
                queryRequired: false
            }
        ]
    };

    function operationDefinition(
        structure,
        operation
    ) {
        const options =
            operationDefinitions[structure];

        return options.find(
            function (item) {
                return item.value ===
                    operation;
            }
        ) || options[0];
    }

    function populateOperationSelect(
        select,
        structure,
        selected
    ) {
        const definition =
            definitions[structure];

        const value =
            selected ||
            definition.defaultOperation;

        select.innerHTML = "";

        operationDefinitions[structure]
            .forEach(function (item) {
                const option =
                    document.createElement(
                        "option"
                    );

                option.value = item.value;
                option.textContent =
                    item.label;

                select.appendChild(option);
            });

        select.value = value;
    }

    function setLabels(
        structure,
        dataLabel,
        queryLabel,
        operation
    ) {
        const definition =
            definitions[structure];

        dataLabel.firstChild.textContent =
            definition.dataLabel;

        queryLabel.firstChild.textContent =
            operation
                ? operationDefinition(
                    structure,
                    operation
                ).queryLabel
                : definition.queryLabel;
    }

    const visualizer = {
        structure:
            document.getElementById(
                "digitalStructure"
            ),
        operation:
            document.getElementById(
                "digitalOperation"
            ),
        data:
            document.getElementById(
                "digitalDataInput"
            ),
        query:
            document.getElementById(
                "digitalQueryInput"
            ),
        dataLabel:
            document.getElementById(
                "digitalDataLabel"
            ),
        queryLabel:
            document.getElementById(
                "digitalQueryLabel"
            ),
        load:
            document.getElementById(
                "loadDigitalVisualizer"
            ),
        prompt:
            document.getElementById(
                "digitalPrompt"
            ),
        result:
            document.getElementById(
                "digitalResult"
            ),
        svg:
            document.getElementById(
                "digitalTreeSvg"
            ),
        message:
            document.getElementById(
                "digitalMessage"
            ),
        operationValue:
            document.getElementById(
                "digitalOperationValue"
            ),
        phase:
            document.getElementById(
                "digitalPhase"
            ),
        nodes:
            document.getElementById(
                "digitalNodes"
            ),
        depth:
            document.getElementById(
                "digitalDepth"
            ),
        resultValue:
            document.getElementById(
                "digitalResultValue"
            ),
        progress:
            document.getElementById(
                "digitalProgress"
            ),
        status:
            document.getElementById(
                "digitalStatus"
            ),
        previous:
            document.getElementById(
                "digitalPrevious"
            ),
        next:
            document.getElementById(
                "digitalNext"
            ),
        auto:
            document.getElementById(
                "digitalAuto"
            ),
        pause:
            document.getElementById(
                "digitalPause"
            ),
        reset:
            document.getElementById(
                "digitalReset"
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

        renderDigitalTree(
            visualizer.svg,
            step.tree,
            step.active,
            visualizer.structure.value
        );

        visualizer.message.textContent =
            step.message;

        visualizer.operationValue.textContent =
            operationDefinition(
                visualizer.structure.value,
                visualizer.operation.value
            ).label;

        visualizer.phase.textContent =
            step.phase;

        visualizer.nodes.textContent =
            String(step.created);

        visualizer.depth.textContent =
            String(step.depth);

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
            "Step " + visualIndex +
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
                visualizer.data,
                visualizer.query,
                visualizer.operation.value
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

    function changeVisualOperation(
        useExample
    ) {
        const item =
            operationDefinition(
                visualizer.structure.value,
                visualizer.operation.value
            );

        if (useExample !== false) {
            visualizer.query.value =
                item.example;
        }

        visualizer.query.disabled =
            !item.queryRequired;

        setLabels(
            visualizer.structure.value,
            visualizer.dataLabel,
            visualizer.queryLabel,
            visualizer.operation.value
        );

        invalidateVisual();
    }

    function changeVisualStructure() {
        const definition =
            definitions[
                visualizer.structure.value
            ];

        visualizer.data.value =
            definition.exampleData;

        populateOperationSelect(
            visualizer.operation,
            visualizer.structure.value,
            definition.defaultOperation
        );

        changeVisualOperation(true);
    }

    if (visualizer.load) {
        populateOperationSelect(
            visualizer.operation,
            visualizer.structure.value,
            definitions[
                visualizer.structure.value
            ].defaultOperation
        );

        changeVisualOperation(true);

        visualizer.load.addEventListener(
            "click",
            loadVisual
        );

        visualizer.structure
            .addEventListener(
                "change",
                changeVisualStructure
            );

        visualizer.operation
            .addEventListener(
                "change",
                function () {
                    changeVisualOperation(true);
                }
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
                "[data-digital-example]"
            )
            .forEach(function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        visualizer
                            .structure
                            .value =
                            button.dataset
                                .digitalExample;

                        changeVisualStructure();
                    }
                );
            });

        visualizer.previous
            .addEventListener(
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

        visualizer.next
            .addEventListener(
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

        visualizer.auto
            .addEventListener(
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
                                    visualSteps.length -
                                        1
                                ) {
                                    stopVisual();
                                    return;
                                }

                                visualIndex += 1;
                                renderVisual();
                            },
                            820
                        );
                }
            );

        visualizer.pause
            .addEventListener(
                "click",
                stopVisual
            );

        visualizer.reset
            .addEventListener(
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
                "digitalTraceStructure"
            ),
        data:
            document.getElementById(
                "digitalTraceData"
            ),
        query:
            document.getElementById(
                "digitalTraceQuery"
            ),
        dataLabel:
            document.getElementById(
                "digitalTraceDataLabel"
            ),
        queryLabel:
            document.getElementById(
                "digitalTraceQueryLabel"
            ),
        load:
            document.getElementById(
                "loadDigitalTracer"
            ),
        prompt:
            document.getElementById(
                "digitalTracePrompt"
            ),
        result:
            document.getElementById(
                "digitalTraceResult"
            ),
        title:
            document.getElementById(
                "digitalTraceTitle"
            ),
        codeWindow:
            document.getElementById(
                "digitalTraceCodeWindow"
            ),
        code:
            document.getElementById(
                "digitalTraceCode"
            ),
        message:
            document.getElementById(
                "digitalTraceMessage"
            ),
        variables:
            document.getElementById(
                "digitalTraceVariables"
            ),
        svg:
            document.getElementById(
                "digitalTraceSvg"
            ),
        output:
            document.getElementById(
                "digitalTraceOutput"
            ),
        status:
            document.getElementById(
                "digitalTraceStatus"
            ),
        previous:
            document.getElementById(
                "digitalTracePrevious"
            ),
        next:
            document.getElementById(
                "digitalTraceNext"
            ),
        auto:
            document.getElementById(
                "digitalTraceAuto"
            ),
        pause:
            document.getElementById(
                "digitalTracePause"
            ),
        reset:
            document.getElementById(
                "digitalTraceReset"
            )
    };

    let traceSteps = [];
    let traceIndex = 0;
    let traceTimer = null;
    let traceLines = [];
    let traceLookupLines = [];
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

        traceLines = traceLookupLines.map(
            function (line) {
                return line
                    .replace(
                        /\s*\/\*\s*(?:trie|binary|patricia|suffix)[^*]*\*\//g,
                        ""
                    )
                    .replace(/\s+$/g, "");
            }
        );

        tracer.code.innerHTML = "";

        traceLines.forEach(
            function (line, index) {
                const row =
                    document.createElement(
                        "span"
                    );

                row.dataset
                    .digitalTraceLine =
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
                "[data-digital-trace-line]"
            )
            .forEach(function (line) {
                const active =
                    Number(
                        line.dataset
                            .digitalTraceLine
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
            "Structure",
            activeDefinition.label
        );

        appendVariable(
            "Phase",
            step.phase
        );

        appendVariable(
            "Current Path",
            step.current
        );

        appendVariable(
            "Symbol / Edge",
            step.symbol
        );

        appendVariable(
            "Depth",
            step.depth
        );

        appendVariable(
            "Nodes Created",
            step.created
        );

        renderDigitalTree(
            tracer.svg,
            step.tree,
            step.active,
            tracer.structure.value
        );

        tracer.output.textContent =
            step.complete
                ? step.result
                : "—";

        tracer.status.textContent =
            "Step " + traceIndex +
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
                tracer.codeWindow
                    .clientHeight / 2 +
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
                tracer.data,
                tracer.query
            );

            loadCode(definition);

            traceSteps = decorate(
                buildSteps(
                    tracer.structure.value,
                    parsed.data,
                    parsed.query
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

    function changeTraceStructure() {
        const definition =
            definitions[
                tracer.structure.value
            ];

        tracer.data.value =
            definition.exampleData;

        tracer.query.value =
            definition.exampleQuery;

        setLabels(
            tracer.structure.value,
            tracer.dataLabel,
            tracer.queryLabel
        );

        invalidateTrace();
    }

    if (tracer.load) {
        tracer.load.addEventListener(
            "click",
            loadTrace
        );

        tracer.structure
            .addEventListener(
                "change",
                changeTraceStructure
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

        tracer.previous
            .addEventListener(
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

        tracer.next
            .addEventListener(
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

        tracer.auto
            .addEventListener(
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
                                    traceSteps.length -
                                        1
                                ) {
                                    stopTrace();
                                    return;
                                }

                                traceIndex += 1;
                                renderTrace();
                            },
                            850
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
