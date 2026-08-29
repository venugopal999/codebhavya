(function () {
    "use strict";

    const DELETED = "__HASH_DELETED__";

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
        chaining: {
            label: "Separate Chaining",
            codeKey: "separate-chaining"
        },

        linear: {
            label: "Linear Probing",
            codeKey: "open-addressing"
        },

        quadratic: {
            label: "Quadratic Probing",
            codeKey: "open-addressing"
        },

        double: {
            label: "Double Hashing",
            codeKey: "open-addressing"
        }
    };

    const operationLabels = {
        build: "Build Table",
        insert: "Insert",
        search: "Search",
        delete: "Delete",
        rehash: "Rehash"
    };

    const operationOrder = [
        "build",
        "insert",
        "search",
        "delete",
        "rehash"
    ];

    function populateOperations(select) {
        select.innerHTML = "";

        operationOrder.forEach(function (operation) {
            const option =
                document.createElement("option");

            option.value = operation;
            option.textContent =
                operationLabels[operation];

            select.appendChild(option);
        });

        select.value = "search";
    }

    function positiveMod(value, modulus) {
        return (
            (value % modulus) + modulus
        ) % modulus;
    }

    function hashOne(key, size) {
        return positiveMod(key, size);
    }

    function hashTwo(key, size) {
        return 1 + positiveMod(
            key,
            size - 1
        );
    }

    function probeIndex(
        key,
        attempt,
        method,
        size
    ) {
        const first = hashOne(key, size);

        if (method === "linear") {
            return (
                first + attempt
            ) % size;
        }

        if (method === "quadratic") {
            return (
                first + attempt * attempt
            ) % size;
        }

        return (
            first +
            attempt * hashTwo(key, size)
        ) % size;
    }

    function probeNeedle(method) {
        if (method === "linear") {
            return "/* open linear probe */";
        }

        if (method === "quadratic") {
            return "/* open quadratic probe */";
        }

        return "/* open double probe */";
    }

    function createTable(method, size) {
        if (method === "chaining") {
            return Array.from(
                { length: size },
                function () {
                    return [];
                }
            );
        }

        return Array.from(
            { length: size },
            function () {
                return null;
            }
        );
    }

    function cloneTable(table, method) {
        if (method === "chaining") {
            return table.map(function (bucket) {
                return bucket.slice();
            });
        }

        return table.slice();
    }

    function countEntries(table, method) {
        if (method === "chaining") {
            return table.reduce(
                function (sum, bucket) {
                    return sum + bucket.length;
                },
                0
            );
        }

        return table.filter(function (value) {
            return (
                value !== null &&
                value !== DELETED
            );
        }).length;
    }

    function makeStep(
        table,
        method,
        phase,
        message,
        needle,
        details
    ) {
        const data = details || {};
        const count =
            countEntries(table, method);

        return {
            table: cloneTable(table, method),
            method: method,
            phase: phase,
            message: message,
            needle: needle,

            activeIndex:
                typeof data.activeIndex === "number"
                    ? data.activeIndex
                    : -1,

            activeKey:
                typeof data.activeKey === "number"
                    ? data.activeKey
                    : null,

            hashIndex:
                typeof data.hashIndex === "number"
                    ? data.hashIndex
                    : -1,

            probe:
                typeof data.probe === "number"
                    ? data.probe
                    : 0,

            collisions:
                typeof data.collisions === "number"
                    ? data.collisions
                    : 0,

            count: count,
            size: table.length,
            loadFactor: count / table.length,
            result: data.result || "—",
            complete: Boolean(data.complete)
        };
    }

    function pushInitialStep(
        steps,
        table,
        method,
        counters
    ) {
        steps.push(
            makeStep(
                table,
                method,
                "Create Table",
                "Create " +
                    table.length +
                    " empty buckets.",
                method === "chaining"
                    ? "/* chain create table */"
                    : "/* open create table */",
                {
                    collisions:
                        counters.collisions
                }
            )
        );
    }

    function insertChaining(
        table,
        key,
        steps,
        counters,
        context
    ) {
        const index =
            hashOne(key, table.length);

        const bucket = table[index];
        const prefix = context || "Insert";

        steps.push(
            makeStep(
                table,
                "chaining",
                "Compute Hash",
                prefix +
                    " key " +
                    key +
                    ": h(" +
                    key +
                    ") = " +
                    index +
                    ".",
                "/* chain insert hash */",
                {
                    activeIndex: index,
                    activeKey: key,
                    hashIndex: index,
                    collisions:
                        counters.collisions
                }
            )
        );

        for (
            let position = 0;
            position < bucket.length;
            position += 1
        ) {
            counters.collisions += 1;

            steps.push(
                makeStep(
                    table,
                    "chaining",
                    "Scan Chain",
                    "Bucket " +
                        index +
                        " already contains " +
                        bucket[position] +
                        "; compare it with " +
                        key +
                        ".",
                    "/* chain insert check */",
                    {
                        activeIndex: index,
                        activeKey:
                            bucket[position],
                        hashIndex: index,
                        probe: position + 1,
                        collisions:
                            counters.collisions
                    }
                )
            );

            if (bucket[position] === key) {
                steps.push(
                    makeStep(
                        table,
                        "chaining",
                        "Duplicate",
                        "Key " +
                            key +
                            " is already stored; " +
                            "do not insert it again.",
                        "return 0;",
                        {
                            activeIndex: index,
                            activeKey: key,
                            hashIndex: index,
                            probe: position + 1,
                            collisions:
                                counters.collisions,
                            result:
                                "Duplicate key " +
                                key
                        }
                    )
                );

                return false;
            }
        }

        if (bucket.length > 0) {
            steps.push(
                makeStep(
                    table,
                    "chaining",
                    "Collision",
                    "A collision occurred at " +
                        "bucket " +
                        index +
                        "; the new node will " +
                        "join its chain.",
                    "/* chain insert link */",
                    {
                        activeIndex: index,
                        activeKey: key,
                        hashIndex: index,
                        collisions:
                            counters.collisions
                    }
                )
            );
        }

        bucket.unshift(key);

        steps.push(
            makeStep(
                table,
                "chaining",
                "Link Node",
                "Insert " +
                    key +
                    " at the front of bucket " +
                    index +
                    "'s chain.",
                "/* chain insert link */",
                {
                    activeIndex: index,
                    activeKey: key,
                    hashIndex: index,
                    collisions:
                        counters.collisions,
                    result:
                        "Inserted " + key
                }
            )
        );

        return true;
    }

    function searchChaining(
        table,
        key,
        steps,
        counters
    ) {
        const index =
            hashOne(key, table.length);

        const bucket = table[index];

        steps.push(
            makeStep(
                table,
                "chaining",
                "Compute Hash",
                "Search key " +
                    key +
                    " begins at bucket " +
                    index +
                    ".",
                "/* chain search hash */",
                {
                    activeIndex: index,
                    activeKey: key,
                    hashIndex: index,
                    collisions:
                        counters.collisions
                }
            )
        );

        for (
            let position = 0;
            position < bucket.length;
            position += 1
        ) {
            steps.push(
                makeStep(
                    table,
                    "chaining",
                    "Compare Node",
                    "Compare " +
                        key +
                        " with chain node " +
                        bucket[position] +
                        ".",
                    "/* chain search loop */",
                    {
                        activeIndex: index,
                        activeKey:
                            bucket[position],
                        hashIndex: index,
                        probe: position + 1,
                        collisions:
                            counters.collisions
                    }
                )
            );

            if (bucket[position] === key) {
                steps.push(
                    makeStep(
                        table,
                        "chaining",
                        "Found",
                        "Key " +
                            key +
                            " is present in bucket " +
                            index +
                            ".",
                        "/* chain search found */",
                        {
                            activeIndex: index,
                            activeKey: key,
                            hashIndex: index,
                            probe: position + 1,
                            collisions:
                                counters.collisions,
                            result:
                                "Found " +
                                key +
                                " in bucket " +
                                index
                        }
                    )
                );

                return true;
            }
        }

        steps.push(
            makeStep(
                table,
                "chaining",
                "Not Found",
                "Bucket " +
                    index +
                    " ended without key " +
                    key +
                    ".",
                "/* chain search miss */",
                {
                    activeIndex: index,
                    activeKey: key,
                    hashIndex: index,
                    probe: bucket.length,
                    collisions:
                        counters.collisions,
                    result:
                        "Key " +
                        key +
                        " not found"
                }
            )
        );

        return false;
    }

    function deleteChaining(
        table,
        key,
        steps,
        counters
    ) {
        const index =
            hashOne(key, table.length);

        const bucket = table[index];

        steps.push(
            makeStep(
                table,
                "chaining",
                "Compute Hash",
                "Deletion of " +
                    key +
                    " begins at bucket " +
                    index +
                    ".",
                "/* chain delete hash */",
                {
                    activeIndex: index,
                    activeKey: key,
                    hashIndex: index,
                    collisions:
                        counters.collisions
                }
            )
        );

        for (
            let position = 0;
            position < bucket.length;
            position += 1
        ) {
            steps.push(
                makeStep(
                    table,
                    "chaining",
                    "Scan Chain",
                    "Check chain node " +
                        bucket[position] +
                        " for key " +
                        key +
                        ".",
                    "/* chain delete loop */",
                    {
                        activeIndex: index,
                        activeKey:
                            bucket[position],
                        hashIndex: index,
                        probe: position + 1,
                        collisions:
                            counters.collisions
                    }
                )
            );

            if (bucket[position] === key) {
                bucket.splice(position, 1);

                steps.push(
                    makeStep(
                        table,
                        "chaining",
                        "Unlink Node",
                        "Remove " +
                            key +
                            " and reconnect bucket " +
                            index +
                            "'s chain.",
                        "/* chain delete remove */",
                        {
                            activeIndex: index,
                            hashIndex: index,
                            probe: position + 1,
                            collisions:
                                counters.collisions,
                            result:
                                "Deleted " + key
                        }
                    )
                );

                return true;
            }
        }

        steps.push(
            makeStep(
                table,
                "chaining",
                "Not Found",
                "Key " +
                    key +
                    " is absent, so no node " +
                    "is removed.",
                "/* chain delete miss */",
                {
                    activeIndex: index,
                    activeKey: key,
                    hashIndex: index,
                    probe: bucket.length,
                    collisions:
                        counters.collisions,
                    result:
                        "Key " +
                        key +
                        " not found"
                }
            )
        );

        return false;
    }

    function insertOpen(
        table,
        method,
        key,
        steps,
        counters,
        context
    ) {
        const home =
            hashOne(key, table.length);

        let firstDeleted = -1;
        const prefix = context || "Insert";

        steps.push(
            makeStep(
                table,
                method,
                "Compute Hash",
                prefix +
                    " key " +
                    key +
                    ": home bucket is " +
                    home +
                    ".",
                "/* hash compute */",
                {
                    activeIndex: home,
                    activeKey: key,
                    hashIndex: home,
                    collisions:
                        counters.collisions
                }
            )
        );

        if (method === "double") {
            steps.push(
                makeStep(
                    table,
                    method,
                    "Second Hash",
                    "The double-hash step is " +
                        "1 + (" +
                        key +
                        " mod " +
                        (table.length - 1) +
                        ") = " +
                        hashTwo(
                            key,
                            table.length
                        ) +
                        ".",
                    "/* open second hash */",
                    {
                        activeIndex: home,
                        activeKey: key,
                        hashIndex: home,
                        collisions:
                            counters.collisions
                    }
                )
            );
        }

        for (
            let attempt = 0;
            attempt < table.length;
            attempt += 1
        ) {
            const index = probeIndex(
                key,
                attempt,
                method,
                table.length
            );

            steps.push(
                makeStep(
                    table,
                    method,
                    "Probe Slot",
                    "Probe " +
                        attempt +
                        " checks index " +
                        index +
                        ".",
                    probeNeedle(method),
                    {
                        activeIndex: index,
                        activeKey: key,
                        hashIndex: home,
                        probe: attempt,
                        collisions:
                            counters.collisions
                    }
                )
            );

            if (
                table[index] !== null &&
                table[index] !== DELETED
            ) {
                if (table[index] === key) {
                    steps.push(
                        makeStep(
                            table,
                            method,
                            "Duplicate",
                            "Index " +
                                index +
                                " already stores key " +
                                key +
                                ".",
                            "return 0;",
                            {
                                activeIndex: index,
                                activeKey: key,
                                hashIndex: home,
                                probe: attempt,
                                collisions:
                                    counters.collisions,
                                result:
                                    "Duplicate key " +
                                    key
                            }
                        )
                    );

                    return false;
                }

                counters.collisions += 1;

                steps.push(
                    makeStep(
                        table,
                        method,
                        "Collision",
                        "Index " +
                            index +
                            " stores " +
                            table[index] +
                            ", so continue the " +
                            "probe sequence.",
                        "/* open insert loop */",
                        {
                            activeIndex: index,
                            activeKey:
                                table[index],
                            hashIndex: home,
                            probe: attempt,
                            collisions:
                                counters.collisions
                        }
                    )
                );

                continue;
            }

            if (table[index] === DELETED) {
                if (firstDeleted === -1) {
                    firstDeleted = index;
                }

                steps.push(
                    makeStep(
                        table,
                        method,
                        "Remember Tombstone",
                        "Remember deleted index " +
                            index +
                            ", but continue to check " +
                            "for a duplicate key.",
                        "/* open remember tombstone */",
                        {
                            activeIndex: index,
                            activeKey: key,
                            hashIndex: home,
                            probe: attempt,
                            collisions:
                                counters.collisions
                        }
                    )
                );

                continue;
            }

            const destination =
                firstDeleted === -1
                    ? index
                    : firstDeleted;

            table[destination] = key;

            steps.push(
                makeStep(
                    table,
                    method,
                    firstDeleted === -1
                        ? "Store Key"
                        : "Reuse Tombstone",
                    "Store " +
                        key +
                        " at index " +
                        destination +
                        ".",
                    "/* open insert store */",
                    {
                        activeIndex:
                            destination,
                        activeKey: key,
                        hashIndex: home,
                        probe: attempt,
                        collisions:
                            counters.collisions,
                        result:
                            "Inserted " +
                            key +
                            " at index " +
                            destination
                    }
                )
            );

            return true;
        }

        if (firstDeleted !== -1) {
            table[firstDeleted] = key;

            steps.push(
                makeStep(
                    table,
                    method,
                    "Reuse Tombstone",
                    "The probe cycle ended; " +
                        "store " +
                        key +
                        " in remembered tombstone " +
                        firstDeleted +
                        ".",
                    "/* open insert tombstone */",
                    {
                        activeIndex:
                            firstDeleted,
                        activeKey: key,
                        hashIndex: home,
                        probe: table.length,
                        collisions:
                            counters.collisions,
                        result:
                            "Inserted " +
                            key +
                            " at index " +
                            firstDeleted
                    }
                )
            );

            return true;
        }

        steps.push(
            makeStep(
                table,
                method,
                "Insertion Failed",
                "No reachable empty slot is " +
                    "available for key " +
                    key +
                    ".",
                "/* open insert full */",
                {
                    activeKey: key,
                    hashIndex: home,
                    probe: table.length,
                    collisions:
                        counters.collisions,
                    result:
                        "Insertion failed for " +
                        key
                }
            )
        );

        return false;
    }

    function searchOpen(
        table,
        method,
        key,
        steps,
        counters,
        deleteMode
    ) {
        const home =
            hashOne(key, table.length);

        steps.push(
            makeStep(
                table,
                method,
                "Compute Hash",
                (
                    deleteMode
                        ? "Delete"
                        : "Search"
                ) +
                    " key " +
                    key +
                    ": home bucket is " +
                    home +
                    ".",
                deleteMode
                    ? "/* open delete search */"
                    : "/* hash compute */",
                {
                    activeIndex: home,
                    activeKey: key,
                    hashIndex: home,
                    collisions:
                        counters.collisions
                }
            )
        );

        for (
            let attempt = 0;
            attempt < table.length;
            attempt += 1
        ) {
            const index = probeIndex(
                key,
                attempt,
                method,
                table.length
            );

            const value = table[index];

            steps.push(
                makeStep(
                    table,
                    method,
                    "Probe Slot",
                    "Probe " +
                        attempt +
                        " checks index " +
                        index +
                        ".",
                    "/* open search loop */",
                    {
                        activeIndex: index,

                        activeKey:
                            value !== null &&
                            value !== DELETED
                                ? value
                                : key,

                        hashIndex: home,
                        probe: attempt,
                        collisions:
                            counters.collisions
                    }
                )
            );

            if (value === null) {
                steps.push(
                    makeStep(
                        table,
                        method,
                        "Stop at Empty",
                        "Index " +
                            index +
                            " has never been used, " +
                            "so key " +
                            key +
                            " is absent.",
                        "/* open search empty */",
                        {
                            activeIndex: index,
                            activeKey: key,
                            hashIndex: home,
                            probe: attempt,
                            collisions:
                                counters.collisions,
                            result:
                                "Key " +
                                key +
                                " not found"
                        }
                    )
                );

                return -1;
            }

            if (value === key) {
                steps.push(
                    makeStep(
                        table,
                        method,
                        "Found",
                        "Key " +
                            key +
                            " is stored at index " +
                            index +
                            ".",
                        "/* open search found */",
                        {
                            activeIndex: index,
                            activeKey: key,
                            hashIndex: home,
                            probe: attempt,
                            collisions:
                                counters.collisions,
                            result:
                                "Found " +
                                key +
                                " at index " +
                                index
                        }
                    )
                );

                return index;
            }

            if (value === DELETED) {
                steps.push(
                    makeStep(
                        table,
                        method,
                        "Pass Tombstone",
                        "Index " +
                            index +
                            " is deleted, so " +
                            "searching must continue.",
                        "/* open search loop */",
                        {
                            activeIndex: index,
                            activeKey: key,
                            hashIndex: home,
                            probe: attempt,
                            collisions:
                                counters.collisions
                        }
                    )
                );
            }
        }

        steps.push(
            makeStep(
                table,
                method,
                "Not Found",
                "A full probe cycle ended " +
                    "without key " +
                    key +
                    ".",
                "/* open search miss */",
                {
                    activeKey: key,
                    hashIndex: home,
                    probe: table.length,
                    collisions:
                        counters.collisions,
                    result:
                        "Key " +
                        key +
                        " not found"
                }
            )
        );

        return -1;
    }

    function deleteOpen(
        table,
        method,
        key,
        steps,
        counters
    ) {
        const index = searchOpen(
            table,
            method,
            key,
            steps,
            counters,
            true
        );

        if (index === -1) {
            return false;
        }

        table[index] = DELETED;

        steps.push(
            makeStep(
                table,
                method,
                "Create Tombstone",
                "Replace key " +
                    key +
                    " at index " +
                    index +
                    " with a deleted marker.",
                "/* open delete tombstone */",
                {
                    activeIndex: index,
                    activeKey: key,
                    hashIndex: hashOne(
                        key,
                        table.length
                    ),
                    collisions:
                        counters.collisions,
                    result:
                        "Deleted " +
                        key +
                        " from index " +
                        index
                }
            )
        );

        return true;
    }

    function isPrime(value) {
        if (value < 2) {
            return false;
        }

        for (
            let divisor = 2;
            divisor * divisor <= value;
            divisor += 1
        ) {
            if (value % divisor === 0) {
                return false;
            }
        }

        return true;
    }

    function nextPrime(value) {
        let candidate =
            Math.max(2, value);

        while (!isPrime(candidate)) {
            candidate += 1;
        }

        return candidate;
    }

    function tableKeys(table, method) {
        if (method === "chaining") {
            return table.reduce(
                function (keys, bucket) {
                    return keys.concat(bucket);
                },
                []
            );
        }

        return table.filter(function (value) {
            return (
                value !== null &&
                value !== DELETED
            );
        });
    }

    function rehashTable(
        table,
        method,
        steps,
        counters
    ) {
        const keys =
            tableKeys(table, method);

        const oldSize = table.length;

        const newSize = nextPrime(
            oldSize * 2 + 1
        );

        const resized =
            createTable(method, newSize);

        steps.push(
            makeStep(
                table,
                method,
                "Choose New Capacity",
                "Grow from " +
                    oldSize +
                    " buckets to the next prime, " +
                    newSize +
                    ".",
                method === "chaining"
                    ? "/* chain create table */"
                    : "/* open create table */",
                {
                    collisions:
                        counters.collisions,
                    result:
                        "New size = " +
                        newSize
                }
            )
        );

        steps.push(
            makeStep(
                resized,
                method,
                "Create New Table",
                "Create a new empty table. " +
                    "Old positions and tombstones " +
                    "are not copied.",
                method === "chaining"
                    ? "/* chain create table */"
                    : "/* open create table */",
                {
                    collisions:
                        counters.collisions
                }
            )
        );

        keys.forEach(function (key) {
            if (method === "chaining") {
                insertChaining(
                    resized,
                    key,
                    steps,
                    counters,
                    "Reinsert"
                );
            } else {
                insertOpen(
                    resized,
                    method,
                    key,
                    steps,
                    counters,
                    "Reinsert"
                );
            }
        });

        return resized;
    }

    function buildHashSteps(
        values,
        method,
        operation,
        target,
        size
    ) {
        let table =
            createTable(method, size);

        const steps = [];

        const counters = {
            collisions: 0
        };

        pushInitialStep(
            steps,
            table,
            method,
            counters
        );

        values.forEach(function (key) {
            if (method === "chaining") {
                insertChaining(
                    table,
                    key,
                    steps,
                    counters,
                    "Build with"
                );
            } else {
                insertOpen(
                    table,
                    method,
                    key,
                    steps,
                    counters,
                    "Build with"
                );
            }
        });

        if (operation === "insert") {
            if (method === "chaining") {
                insertChaining(
                    table,
                    target,
                    steps,
                    counters,
                    "Insert"
                );
            } else {
                insertOpen(
                    table,
                    method,
                    target,
                    steps,
                    counters,
                    "Insert"
                );
            }
        } else if (operation === "search") {
            if (method === "chaining") {
                searchChaining(
                    table,
                    target,
                    steps,
                    counters
                );
            } else {
                searchOpen(
                    table,
                    method,
                    target,
                    steps,
                    counters,
                    false
                );
            }
        } else if (operation === "delete") {
            if (method === "chaining") {
                deleteChaining(
                    table,
                    target,
                    steps,
                    counters
                );
            } else {
                deleteOpen(
                    table,
                    method,
                    target,
                    steps,
                    counters
                );
            }
        } else if (operation === "rehash") {
            table = rehashTable(
                table,
                method,
                steps,
                counters
            );
        }

        let result;

        if (operation === "build") {
            result =
                "Built table with " +
                countEntries(
                    table,
                    method
                ) +
                " keys";
        } else if (operation === "rehash") {
            result =
                "Rehashed into " +
                table.length +
                " buckets";
        } else {
            result =
                steps[steps.length - 1]
                    .result;
        }

        steps.push(
            makeStep(
                table,
                method,
                "Complete",
                operationLabels[operation] +
                    " is complete.",
                "display();",
                {
                    collisions:
                        counters.collisions,
                    result: result,
                    complete: true
                }
            )
        );

        return steps;
    }

    function parseInputs(
        dataInput,
        targetInput,
        sizeInput,
        method,
        operation
    ) {
        const values = dataInput.value
            .trim()
            .split(/[\s,]+/)
            .filter(Boolean)
            .map(Number);

        const target = Number(
            targetInput.value.trim()
        );

        const size = Number(
            sizeInput.value.trim()
        );

        if (
            values.length < 1 ||
            values.length > 12 ||
            values.some(function (value) {
                return (
                    !Number.isInteger(value) ||
                    value < -999 ||
                    value > 999
                );
            })
        ) {
            throw new Error(
                "Enter 1 to 12 integer keys " +
                "from -999 to 999."
            );
        }

        if (
            new Set(values).size !==
            values.length
        ) {
            throw new Error(
                "Use distinct keys in the " +
                "starting sequence."
            );
        }

        if (
            !Number.isInteger(size) ||
            size < 5 ||
            size > 17
        ) {
            throw new Error(
                "Enter a table size from 5 to 17."
            );
        }

        if (
            method === "double" &&
            !isPrime(size)
        ) {
            throw new Error(
                "Use a prime table size for " +
                "Double Hashing so every bucket " +
                "is reachable."
            );
        }

        if (
            method !== "chaining" &&
            values.length > size
        ) {
            throw new Error(
                "Open addressing cannot start " +
                "with more keys than slots."
            );
        }

        if (
            operation !== "build" &&
            operation !== "rehash" &&
            (
                !Number.isInteger(target) ||
                target < -999 ||
                target > 999
            )
        ) {
            throw new Error(
                "Enter a target integer from " +
                "-999 to 999."
            );
        }

        dataInput.value =
            values.join(", ");

        sizeInput.value =
            String(size);

        if (Number.isInteger(target)) {
            targetInput.value =
                String(target);
        }

        return {
            values: values,

            target:
                Number.isInteger(target)
                    ? target
                    : 0,

            size: size
        };
    }

    function renderHashTable(
        container,
        step
    ) {
        container.innerHTML = "";

        step.table.forEach(
            function (bucket, index) {
                const row =
                    document.createElement("div");

                const indexBox =
                    document.createElement("span");

                const content =
                    document.createElement("div");

                row.className =
                    "hash-bucket";

                indexBox.className =
                    "hash-bucket-index";

                content.className =
                    "hash-bucket-content";

                indexBox.textContent =
                    String(index);

                if (
                    index ===
                    step.activeIndex
                ) {
                    row.classList.add(
                        "is-active"
                    );
                }

                row.appendChild(indexBox);

                if (
                    step.method ===
                    "chaining"
                ) {
                    if (!bucket.length) {
                        const empty =
                            document.createElement(
                                "span"
                            );

                        empty.className =
                            "hash-empty-slot";

                        empty.textContent =
                            "EMPTY";

                        content.appendChild(
                            empty
                        );
                    } else {
                        bucket.forEach(
                            function (
                                key,
                                position
                            ) {
                                if (position > 0) {
                                    const arrow =
                                        document.createElement(
                                            "span"
                                        );

                                    arrow.className =
                                        "hash-chain-arrow";

                                    arrow.textContent =
                                        "→";

                                    content.appendChild(
                                        arrow
                                    );
                                }

                                const node =
                                    document.createElement(
                                        "span"
                                    );

                                node.className =
                                    "hash-chain-node";

                                node.textContent =
                                    String(key);

                                if (
                                    index ===
                                        step.activeIndex &&
                                    key ===
                                        step.activeKey
                                ) {
                                    node.classList.add(
                                        "is-active-key"
                                    );
                                }

                                content.appendChild(
                                    node
                                );
                            }
                        );
                    }
                } else {
                    const slot =
                        document.createElement(
                            "span"
                        );

                    slot.className =
                        "hash-open-slot";

                    if (bucket === null) {
                        slot.classList.add(
                            "is-empty"
                        );

                        slot.textContent =
                            "EMPTY";
                    } else if (
                        bucket === DELETED
                    ) {
                        slot.classList.add(
                            "is-deleted"
                        );

                        slot.textContent =
                            "DELETED";
                    } else {
                        slot.textContent =
                            String(bucket);

                        if (
                            index ===
                                step.activeIndex &&
                            bucket ===
                                step.activeKey
                        ) {
                            slot.classList.add(
                                "is-active-key"
                            );
                        }
                    }

                    content.appendChild(slot);
                }

                row.appendChild(content);
                container.appendChild(row);
            }
        );
    }

    function setTargetLabel(
        label,
        input,
        operation
    ) {
        const labels = {
            build: "Target (unused)",
            insert: "Insert Key",
            search: "Search Key",
            delete: "Delete Key",
            rehash: "Target (unused)"
        };

        label.firstChild.textContent =
            labels[operation];

        input.disabled =
            operation === "build" ||
            operation === "rehash";

        if (
            operation === "insert" &&
            input.value === "39"
        ) {
            input.value = "50";
        }
    }

    const visualizer = {
        data:
            document.getElementById(
                "hashDataInput"
            ),

        target:
            document.getElementById(
                "hashTargetInput"
            ),

        size:
            document.getElementById(
                "hashSizeInput"
            ),

        method:
            document.getElementById(
                "hashMethod"
            ),

        operation:
            document.getElementById(
                "hashOperation"
            ),

        targetLabel:
            document.getElementById(
                "hashTargetLabel"
            ),

        load:
            document.getElementById(
                "loadHashVisualizer"
            ),

        prompt:
            document.getElementById(
                "hashPrompt"
            ),

        result:
            document.getElementById(
                "hashResult"
            ),

        table:
            document.getElementById(
                "hashTableView"
            ),

        message:
            document.getElementById(
                "hashMessage"
            ),

        progress:
            document.getElementById(
                "hashProgress"
            ),

        methodValue:
            document.getElementById(
                "hashMethodValue"
            ),

        operationValue:
            document.getElementById(
                "hashOperationValue"
            ),

        phase:
            document.getElementById(
                "hashPhase"
            ),

        indexValue:
            document.getElementById(
                "hashIndexValue"
            ),

        probeValue:
            document.getElementById(
                "hashProbeValue"
            ),

        collisionValue:
            document.getElementById(
                "hashCollisionValue"
            ),

        countValue:
            document.getElementById(
                "hashCountValue"
            ),

        loadValue:
            document.getElementById(
                "hashLoadValue"
            ),

        resultValue:
            document.getElementById(
                "hashResultValue"
            ),

        previous:
            document.getElementById(
                "hashPrevious"
            ),

        next:
            document.getElementById(
                "hashNext"
            ),

        auto:
            document.getElementById(
                "hashAuto"
            ),

        pause:
            document.getElementById(
                "hashPause"
            ),

        reset:
            document.getElementById(
                "hashReset"
            ),

        status:
            document.getElementById(
                "hashStatus"
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

        renderHashTable(
            visualizer.table,
            step
        );

        visualizer.message.textContent =
            step.message;

        visualizer.methodValue.textContent =
            definitions[step.method].label;

        visualizer.operationValue.textContent =
            operationLabels[
                visualizer.operation.value
            ];

        visualizer.phase.textContent =
            step.phase;

        visualizer.indexValue.textContent =
            step.hashIndex < 0
                ? "—"
                : String(step.hashIndex);

        visualizer.probeValue.textContent =
            String(step.probe);

        visualizer.collisionValue.textContent =
            String(step.collisions);

        visualizer.countValue.textContent =
            String(step.count);

        visualizer.loadValue.textContent =
            step.loadFactor.toFixed(2);

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
                visualizer.data,
                visualizer.target,
                visualizer.size,
                visualizer.method.value,
                visualizer.operation.value
            );

            visualSteps = buildHashSteps(
                parsed.values,
                visualizer.method.value,
                visualizer.operation.value,
                parsed.target,
                parsed.size
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

    function setExample(
        method,
        controls
    ) {
        controls.method.value = method;

        controls.data.value =
            "27, 18, 29, 28, 39, 13, 16";

        controls.target.value =
            controls.operation.value ===
            "insert"
                ? "50"
                : "39";

        controls.size.value = "11";
    }

    if (visualizer.load) {
        populateOperations(
            visualizer.operation
        );

        setTargetLabel(
            visualizer.targetLabel,
            visualizer.target,
            visualizer.operation.value
        );

        visualizer.load.addEventListener(
            "click",
            loadVisual
        );

        [
            visualizer.data,
            visualizer.target,
            visualizer.size,
            visualizer.method
        ].forEach(function (control) {
            control.addEventListener(
                "input",
                invalidateVisual
            );

            control.addEventListener(
                "change",
                invalidateVisual
            );
        });

        visualizer.operation.addEventListener(
            "change",
            function () {
                setTargetLabel(
                    visualizer.targetLabel,
                    visualizer.target,
                    visualizer.operation.value
                );

                invalidateVisual();
            }
        );

        document
            .querySelectorAll(
                "[data-hash-example]"
            )
            .forEach(function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        setExample(
                            button.dataset
                                .hashExample,
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
                        820
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
                "hashTraceData"
            ),

        target:
            document.getElementById(
                "hashTraceTarget"
            ),

        size:
            document.getElementById(
                "hashTraceSize"
            ),

        method:
            document.getElementById(
                "hashTraceMethod"
            ),

        operation:
            document.getElementById(
                "hashTraceOperation"
            ),

        targetLabel:
            document.getElementById(
                "hashTraceTargetLabel"
            ),

        load:
            document.getElementById(
                "loadHashTracer"
            ),

        prompt:
            document.getElementById(
                "hashTracePrompt"
            ),

        result:
            document.getElementById(
                "hashTraceResult"
            ),

        title:
            document.getElementById(
                "hashTraceTitle"
            ),

        codeWindow:
            document.getElementById(
                "hashTraceCodeWindow"
            ),

        code:
            document.getElementById(
                "hashTraceCode"
            ),

        message:
            document.getElementById(
                "hashTraceMessage"
            ),

        variables:
            document.getElementById(
                "hashTraceVariables"
            ),

        table:
            document.getElementById(
                "hashTraceTable"
            ),

        output:
            document.getElementById(
                "hashTraceOutput"
            ),

        previous:
            document.getElementById(
                "hashTracePrevious"
            ),

        next:
            document.getElementById(
                "hashTraceNext"
            ),

        auto:
            document.getElementById(
                "hashTraceAuto"
            ),

        pause:
            document.getElementById(
                "hashTracePause"
            ),

        reset:
            document.getElementById(
                "hashTraceReset"
            ),

        status:
            document.getElementById(
                "hashTraceStatus"
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

    function loadCode(
        definition,
        size
    ) {
        const source =
            document.querySelector(
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
            .replace(
                /#define SIZE 11/g,
                "#define SIZE " + size
            )
            .replace(/\r/g, "")
            .replace(
                /^\n+|\n+$/g,
                ""
            );

        traceLookupLines =
            text.split("\n");

        traceLines =
            traceLookupLines.map(
                function (line) {
                    return line
                        .replace(
                            /\s*\/\*\s*(?:hash|chain|open)[^*]*\*\//g,
                            ""
                        )
                        .replace(
                            /\s+$/g,
                            ""
                        );
                }
            );

        tracer.code.innerHTML = "";

        traceLines.forEach(
            function (line, index) {
                const row =
                    document.createElement(
                        "span"
                    );

                row.dataset.hashTraceLine =
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
                "[data-hash-trace-line]"
            )
            .forEach(function (line) {
                const active =
                    Number(
                        line.dataset
                            .hashTraceLine
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
            "Strategy",
            activeDefinition.label
        );

        appendVariable(
            "Operation",
            operationLabels[
                tracer.operation.value
            ]
        );

        appendVariable(
            "Phase",
            step.phase
        );

        appendVariable(
            "Hash Index",
            step.hashIndex < 0
                ? "—"
                : step.hashIndex
        );

        appendVariable(
            "Probe",
            step.probe
        );

        appendVariable(
            "Collisions",
            step.collisions
        );

        appendVariable(
            "Keys / Buckets",
            step.count +
                " / " +
                step.size
        );

        appendVariable(
            "Load Factor",
            step.loadFactor.toFixed(2)
        );

        renderHashTable(
            tracer.table,
            step
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
                tracer.method.value
            ];

        let parsed;

        try {
            parsed = parseInputs(
                tracer.data,
                tracer.target,
                tracer.size,
                tracer.method.value,
                tracer.operation.value
            );

            loadCode(
                definition,
                parsed.size
            );

            traceSteps = decorate(
                buildHashSteps(
                    parsed.values,
                    tracer.method.value,
                    tracer.operation.value,
                    parsed.target,
                    parsed.size
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
            definition.label.toUpperCase() +
            " " +
            operationLabels[
                tracer.operation.value
            ].toUpperCase();

        tracer.prompt.hidden = true;
        tracer.result.hidden = false;

        renderTrace();
    }

    if (tracer.load) {
        populateOperations(
            tracer.operation
        );

        setTargetLabel(
            tracer.targetLabel,
            tracer.target,
            tracer.operation.value
        );

        tracer.load.addEventListener(
            "click",
            loadTrace
        );

        [
            tracer.data,
            tracer.target,
            tracer.size,
            tracer.method
        ].forEach(function (control) {
            control.addEventListener(
                "input",
                invalidateTrace
            );

            control.addEventListener(
                "change",
                invalidateTrace
            );
        });

        tracer.operation.addEventListener(
            "change",
            function () {
                setTargetLabel(
                    tracer.targetLabel,
                    tracer.target,
                    tracer.operation.value
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
