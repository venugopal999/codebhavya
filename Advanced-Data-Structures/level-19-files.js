(function () {
    "use strict";

    const BLOCK_FACTOR = 3;
    const DIRECT_SIZE = 11;
    const DELETED = "__FILE_DELETED__";

    document.querySelectorAll("[data-toggle-target]").forEach(function (button) {
        const target = document.getElementById(button.dataset.toggleTarget);

        if (!target) {
            return;
        }

        target.hidden = true;
        button.dataset.originalLabel = button.textContent.trim();
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", target.id);
    });

    document.addEventListener("click", function (event) {
        const button = event.target.closest
            ? event.target.closest("[data-toggle-target]")
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
        button.setAttribute("aria-expanded", String(open));

        button.textContent = open
            ? (
                target.classList.contains("ads-hint-box")
                    ? "Hide Hint"
                    : "Hide Answer"
            )
            : button.dataset.originalLabel;
    });

    const definitions = {
        sequential: {
            label: "Ordered Sequential",
            codeKey: "sequential-file"
        },
        indexed: {
            label: "Indexed Sequential",
            codeKey: "indexed-file"
        },
        direct: {
            label: "Direct / Hashed",
            codeKey: "direct-file"
        }
    };

    const operationLabels = {
        build: "Build File",
        insert: "Insert Record",
        search: "Search Record",
        update: "Update Record",
        delete: "Delete Record",
        traverse: "Traverse File"
    };

    const operationOrder = [
        "build",
        "insert",
        "search",
        "update",
        "delete",
        "traverse"
    ];

    const examples = {
        sequential: {
            data:
                "105:Asha:82, 101:Ravi:76, " +
                "109:Meena:91, 103:Kiran:68, " +
                "107:Divya:88",
            target: "103",
            value: "Nikhil:79"
        },
        indexed: {
            data:
                "105:Asha:82, 101:Ravi:76, " +
                "109:Meena:91, 103:Kiran:68, " +
                "107:Divya:88, 111:Arun:73, " +
                "113:Sara:85",
            target: "109",
            value: "Nikhil:79"
        },
        direct: {
            data:
                "27:Asha:82, 38:Ravi:76, " +
                "49:Meena:91, 16:Kiran:68",
            target: "49",
            value: "Nikhil:79"
        }
    };

    function populateOperations(select) {
        select.innerHTML = "";

        operationOrder.forEach(function (operation) {
            const option = document.createElement("option");

            option.value = operation;
            option.textContent =
                operationLabels[operation];

            select.appendChild(option);
        });

        select.value = "search";
    }

    function cloneRecord(record) {
        return {
            key: record.key,
            name: record.name,
            marks: record.marks
        };
    }

    function cloneRecords(records) {
        return records.map(cloneRecord);
    }

    function cloneSlots(slots) {
        return slots.map(function (slot) {
            if (
                slot === null ||
                slot === DELETED
            ) {
                return slot;
            }

            return cloneRecord(slot);
        });
    }

    function createState(organization) {
        if (organization === "direct") {
            return {
                records: [],
                slots: Array.from(
                    { length: DIRECT_SIZE },
                    function () {
                        return null;
                    }
                )
            };
        }

        return {
            records: [],
            slots: []
        };
    }

    function countState(state, organization) {
        if (organization !== "direct") {
            return state.records.length;
        }

        return state.slots.filter(function (slot) {
            return (
                slot !== null &&
                slot !== DELETED
            );
        }).length;
    }

    function makeStep(
        state,
        organization,
        phase,
        message,
        needle,
        details
    ) {
        const data = details || {};

        return {
            organization: organization,
            records: cloneRecords(state.records),
            slots: cloneSlots(state.slots),
            phase: phase,
            message: message,
            needle: needle,

            activeBlock:
                typeof data.activeBlock === "number"
                    ? data.activeBlock
                    : -1,

            activeSlot:
                typeof data.activeSlot === "number"
                    ? data.activeSlot
                    : -1,

            activeKey:
                typeof data.activeKey === "number"
                    ? data.activeKey
                    : null,

            comparisons: data.comparisons || 0,
            reads: data.reads || 0,
            count: countState(state, organization),
            result: data.result || "—",
            complete: Boolean(data.complete)
        };
    }

    function positiveMod(value, modulus) {
        return (
            (value % modulus + modulus) %
            modulus
        );
    }

    function sortRecords(records) {
        records.sort(function (first, second) {
            return first.key - second.key;
        });
    }

    function recordText(record) {
        return (
            record.key +
            ":" +
            record.name +
            ":" +
            record.marks
        );
    }

    function buildSequentialBase(
        input,
        steps,
        counters
    ) {
        const state =
            createState("sequential");

        const ordered =
            cloneRecords(input);

        steps.push(makeStep(
            state,
            "sequential",
            "Open File",
            "Create an empty binary file for ordered records.",
            "/* sequential open write */",
            counters
        ));

        sortRecords(ordered);

        steps.push(makeStep(
            state,
            "sequential",
            "Sort Records",
            "Sort the input by primary key before writing: " +
                ordered.map(function (record) {
                    return record.key;
                }).join(", ") +
                ".",
            "/* sequential sort */",
            counters
        ));

        ordered.forEach(function (record, index) {
            state.records.push(
                cloneRecord(record)
            );

            counters.reads += 1;

            steps.push(makeStep(
                state,
                "sequential",
                "Write Record",
                "Write " +
                    recordText(record) +
                    " to data block " +
                    Math.floor(
                        index / BLOCK_FACTOR
                    ) +
                    ".",
                "/* sequential write */",
                Object.assign({}, counters, {
                    activeBlock:
                        Math.floor(
                            index /
                            BLOCK_FACTOR
                        ),
                    activeKey: record.key
                })
            ));
        });

        return state;
    }

    function sequentialSearch(
        state,
        target,
        steps,
        counters,
        purpose
    ) {
        const label =
            purpose || "Search";

        steps.push(makeStep(
            state,
            "sequential",
            "Open for Reading",
            label +
                " opens the ordered file at its first record.",
            "/* sequential open read */",
            counters
        ));

        for (
            let index = 0;
            index < state.records.length;
            index += 1
        ) {
            const record =
                state.records[index];

            const block =
                Math.floor(
                    index / BLOCK_FACTOR
                );

            if (
                index % BLOCK_FACTOR === 0
            ) {
                counters.reads += 1;
            }

            counters.comparisons += 1;

            steps.push(makeStep(
                state,
                "sequential",
                "Scan Record",
                "Read key " +
                    record.key +
                    " from block " +
                    block +
                    " and compare it with " +
                    target +
                    ".",
                "/* sequential search loop */",
                Object.assign({}, counters, {
                    activeBlock: block,
                    activeKey: record.key
                })
            ));

            if (record.key === target) {
                steps.push(makeStep(
                    state,
                    "sequential",
                    "Record Found",
                    "Key " +
                        target +
                        " matches record " +
                        recordText(record) +
                        ".",
                    "/* sequential search found */",
                    Object.assign({}, counters, {
                        activeBlock: block,
                        activeKey: target,
                        result:
                            "Found " +
                            record.name +
                            " (" +
                            record.marks +
                            ")"
                    })
                ));

                return index;
            }

            if (record.key > target) {
                steps.push(makeStep(
                    state,
                    "sequential",
                    "Stop Early",
                    "Key " +
                        record.key +
                        " is greater than " +
                        target +
                        "; the target cannot appear later in this ordered file.",
                    "/* sequential early stop */",
                    Object.assign({}, counters, {
                        activeBlock: block,
                        activeKey: record.key,
                        result:
                            "Key " +
                            target +
                            " not found"
                    })
                ));

                return -1;
            }
        }

        steps.push(makeStep(
            state,
            "sequential",
            "End of File",
            "End-of-file is reached without finding key " +
                target +
                ".",
            "/* sequential search miss */",
            Object.assign({}, counters, {
                result:
                    "Key " +
                    target +
                    " not found"
            })
        ));

        return -1;
    }

    function runSequentialOperation(
        state,
        operation,
        target,
        value,
        steps,
        counters
    ) {
        let position;

        if (operation === "search") {
            sequentialSearch(
                state,
                target,
                steps,
                counters,
                "Search"
            );

            return;
        }

        if (operation === "insert") {
            position =
                sequentialSearch(
                    state,
                    target,
                    steps,
                    counters,
                    "Duplicate check"
                );

            if (position >= 0) {
                return;
            }

            state.records.push({
                key: target,
                name: value.name,
                marks: value.marks
            });

            steps.push(makeStep(
                state,
                "sequential",
                "Append Record",
                "Append the new record temporarily before restoring key order.",
                "/* sequential insert append */",
                Object.assign({}, counters, {
                    activeBlock:
                        Math.floor(
                            (
                                state.records.length -
                                1
                            ) /
                            BLOCK_FACTOR
                        ),
                    activeKey: target
                })
            ));

            sortRecords(state.records);

            counters.reads +=
                Math.ceil(
                    state.records.length /
                    BLOCK_FACTOR
                );

            const insertedPosition =
                state.records.findIndex(
                    function (record) {
                        return (
                            record.key ===
                            target
                        );
                    }
                );

            steps.push(makeStep(
                state,
                "sequential",
                "Rewrite Ordered File",
                "Rewrite the file in sorted order with key " +
                    target +
                    " included.",
                "/* sequential insert rewrite */",
                Object.assign({}, counters, {
                    activeBlock:
                        Math.floor(
                            insertedPosition /
                            BLOCK_FACTOR
                        ),
                    activeKey: target,
                    result:
                        "Inserted " +
                        target
                })
            ));

            return;
        }

        if (operation === "update") {
            for (
                let index = 0;
                index <
                    state.records.length;
                index += 1
            ) {
                const record =
                    state.records[index];

                const block =
                    Math.floor(
                        index /
                        BLOCK_FACTOR
                    );

                if (
                    index %
                        BLOCK_FACTOR ===
                    0
                ) {
                    counters.reads += 1;
                }

                counters.comparisons += 1;

                steps.push(makeStep(
                    state,
                    "sequential",
                    "Find Record",
                    "Compare stored key " +
                        record.key +
                        " with update key " +
                        target +
                        ".",
                    "/* sequential update loop */",
                    Object.assign({}, counters, {
                        activeBlock: block,
                        activeKey: record.key
                    })
                ));

                if (
                    record.key === target
                ) {
                    record.name =
                        value.name;

                    record.marks =
                        value.marks;

                    counters.reads += 1;

                    steps.push(makeStep(
                        state,
                        "sequential",
                        "Write Update",
                        "Overwrite key " +
                            target +
                            " with " +
                            value.name +
                            " and marks " +
                            value.marks +
                            ".",
                        "/* sequential update write */",
                        Object.assign(
                            {},
                            counters,
                            {
                                activeBlock:
                                    block,
                                activeKey:
                                    target,
                                result:
                                    "Updated " +
                                    target
                            }
                        )
                    ));

                    return;
                }
            }

            steps.push(makeStep(
                state,
                "sequential",
                "Not Found",
                "Key " +
                    target +
                    " was not updated because it is absent.",
                "/* sequential update loop */",
                Object.assign({}, counters, {
                    result:
                        "Key " +
                        target +
                        " not found"
                })
            ));

            return;
        }

        if (operation === "delete") {
            const retained = [];
            let deleted = false;

            state.records.forEach(
                function (record, index) {
                    const block =
                        Math.floor(
                            index /
                            BLOCK_FACTOR
                        );

                    if (
                        index %
                            BLOCK_FACTOR ===
                        0
                    ) {
                        counters.reads += 1;
                    }

                    counters.comparisons += 1;

                    steps.push(makeStep(
                        state,
                        "sequential",
                        "Copy or Skip",
                        "Compare key " +
                            record.key +
                            " with deletion key " +
                            target +
                            ".",
                        "/* sequential delete loop */",
                        Object.assign(
                            {},
                            counters,
                            {
                                activeBlock:
                                    block,
                                activeKey:
                                    record.key
                            }
                        )
                    ));

                    if (
                        record.key === target
                    ) {
                        deleted = true;

                        steps.push(makeStep(
                            state,
                            "sequential",
                            "Skip Record",
                            "Do not copy key " +
                                target +
                                " into the temporary file.",
                            "/* sequential delete skip */",
                            Object.assign(
                                {},
                                counters,
                                {
                                    activeBlock:
                                        block,
                                    activeKey:
                                        target
                                }
                            )
                        ));
                    } else {
                        retained.push(
                            cloneRecord(record)
                        );
                    }
                }
            );

            state.records = retained;

            counters.reads +=
                Math.ceil(
                    retained.length /
                    BLOCK_FACTOR
                );

            steps.push(makeStep(
                state,
                "sequential",
                "Replace File",
                deleted
                    ? "Replace the original file with the compacted temporary file."
                    : "No matching record was removed; the file remains unchanged.",
                "/* sequential delete replace */",
                Object.assign({}, counters, {
                    activeKey:
                        deleted
                            ? target
                            : null,
                    result:
                        deleted
                            ? (
                                "Deleted " +
                                target
                            )
                            : (
                                "Key " +
                                target +
                                " not found"
                            )
                })
            ));

            return;
        }

        state.records.forEach(
            function (record, index) {
                const block =
                    Math.floor(
                        index /
                        BLOCK_FACTOR
                    );

                if (
                    index %
                        BLOCK_FACTOR ===
                    0
                ) {
                    counters.reads += 1;
                }

                steps.push(makeStep(
                    state,
                    "sequential",
                    "Traverse Record",
                    "Output " +
                        recordText(record) +
                        " from block " +
                        block +
                        ".",
                    "/* sequential search loop */",
                    Object.assign({}, counters, {
                        activeBlock: block,
                        activeKey: record.key,
                        result:
                            "Reading " +
                            record.key
                    })
                ));
            }
        );
    }

    function buildIndexedBase(
        input,
        steps,
        counters
    ) {
        const state =
            createState("indexed");

        const ordered =
            cloneRecords(input);

        sortRecords(ordered);

        steps.push(makeStep(
            state,
            "indexed",
            "Sort Records",
            "Sort all records before building the sparse index.",
            "/* indexed sort */",
            counters
        ));

        steps.push(makeStep(
            state,
            "indexed",
            "Create Files",
            "Create the data file and its separate sparse-index file.",
            "/* indexed create files */",
            counters
        ));

        ordered.forEach(
            function (record, index) {
                const block =
                    Math.floor(
                        index /
                        BLOCK_FACTOR
                    );

                if (
                    index %
                        BLOCK_FACTOR ===
                    0
                ) {
                    steps.push(makeStep(
                        state,
                        "indexed",
                        "Write Index Entry",
                        "Add sparse entry " +
                            record.key +
                            " → block " +
                            block +
                            ".",
                        "/* indexed write entry */",
                        Object.assign(
                            {},
                            counters,
                            {
                                activeBlock:
                                    block,
                                activeKey:
                                    record.key
                            }
                        )
                    ));
                }

                state.records.push(
                    cloneRecord(record)
                );

                counters.reads += 1;

                steps.push(makeStep(
                    state,
                    "indexed",
                    "Write Data Record",
                    "Write " +
                        recordText(record) +
                        " into data block " +
                        block +
                        ".",
                    "/* indexed write data */",
                    Object.assign({}, counters, {
                        activeBlock: block,
                        activeKey: record.key
                    })
                ));
            }
        );

        return state;
    }

    function indexedEntries(records) {
        const entries = [];

        for (
            let index = 0;
            index < records.length;
            index += BLOCK_FACTOR
        ) {
            entries.push({
                key: records[index].key,
                block:
                    Math.floor(
                        index /
                        BLOCK_FACTOR
                    ),
                start: index
            });
        }

        return entries;
    }

    function indexedSearch(
        state,
        target,
        steps,
        counters,
        purpose
    ) {
        const entries =
            indexedEntries(
                state.records
            );

        let candidate = null;

        const label =
            purpose || "Search";

        steps.push(makeStep(
            state,
            "indexed",
            "Read Sparse Index",
            label +
                " starts in the smaller index file.",
            "/* indexed search index */",
            counters
        ));

        if (entries.length) {
            counters.reads += 1;
        }

        for (
            let index = 0;
            index < entries.length;
            index += 1
        ) {
            const entry =
                entries[index];

            counters.comparisons += 1;

            steps.push(makeStep(
                state,
                "indexed",
                "Scan Index",
                "Compare index key " +
                    entry.key +
                    " with target " +
                    target +
                    ".",
                "/* indexed scan index */",
                Object.assign({}, counters, {
                    activeBlock:
                        entry.block,
                    activeKey:
                        entry.key
                })
            ));

            if (entry.key > target) {
                break;
            }

            candidate = entry;

            steps.push(makeStep(
                state,
                "indexed",
                "Choose Candidate",
                "The greatest index key not exceeding the target currently points to block " +
                    entry.block +
                    ".",
                "/* indexed choose block */",
                Object.assign({}, counters, {
                    activeBlock:
                        entry.block,
                    activeKey:
                        entry.key
                })
            ));
        }

        if (candidate === null) {
            steps.push(makeStep(
                state,
                "indexed",
                "No Candidate Block",
                "Target " +
                    target +
                    " is smaller than the first indexed key.",
                "/* indexed search miss */",
                Object.assign({}, counters, {
                    result:
                        "Key " +
                        target +
                        " not found"
                })
            ));

            return -1;
        }

        counters.reads += 1;

        steps.push(makeStep(
            state,
            "indexed",
            "Seek to Block",
            "Seek directly to data block " +
                candidate.block +
                ".",
            "/* indexed seek block */",
            Object.assign({}, counters, {
                activeBlock:
                    candidate.block,
                activeKey:
                    candidate.key
            })
        ));

        const end =
            Math.min(
                candidate.start +
                    BLOCK_FACTOR,
                state.records.length
            );

        for (
            let index = candidate.start;
            index < end;
            index += 1
        ) {
            const record =
                state.records[index];

            counters.comparisons += 1;

            steps.push(makeStep(
                state,
                "indexed",
                "Scan Data Block",
                "Compare data key " +
                    record.key +
                    " with target " +
                    target +
                    ".",
                "/* indexed scan block */",
                Object.assign({}, counters, {
                    activeBlock:
                        candidate.block,
                    activeKey:
                        record.key
                })
            ));

            if (record.key === target) {
                steps.push(makeStep(
                    state,
                    "indexed",
                    "Record Found",
                    "The selected block contains " +
                        recordText(record) +
                        ".",
                    "/* indexed search found */",
                    Object.assign({}, counters, {
                        activeBlock:
                            candidate.block,
                        activeKey:
                            target,
                        result:
                            "Found " +
                            record.name +
                            " (" +
                            record.marks +
                            ")"
                    })
                ));

                return index;
            }

            if (record.key > target) {
                break;
            }
        }

        steps.push(makeStep(
            state,
            "indexed",
            "Record Missing",
            "Key " +
                target +
                " is absent from candidate block " +
                candidate.block +
                ".",
            "/* indexed search miss */",
            Object.assign({}, counters, {
                activeBlock:
                    candidate.block,
                result:
                    "Key " +
                    target +
                    " not found"
            })
        ));

        return -1;
    }

    function indexedRebuildStep(
        state,
        steps,
        counters,
        target,
        result
    ) {
        sortRecords(state.records);

        counters.reads +=
            Math.ceil(
                state.records.length /
                BLOCK_FACTOR
            );

        steps.push(makeStep(
            state,
            "indexed",
            "Rebuild Data Blocks",
            "Rewrite ordered data blocks after the record change.",
            "/* indexed write data */",
            Object.assign({}, counters, {
                activeKey: target
            })
        ));

        steps.push(makeStep(
            state,
            "indexed",
            "Rebuild Sparse Index",
            "Write one new sparse-index entry for each data block.",
            "/* indexed write entry */",
            Object.assign({}, counters, {
                activeKey: target,
                result: result
            })
        ));
    }

    function runIndexedOperation(
        state,
        operation,
        target,
        value,
        steps,
        counters
    ) {
        let position;

        if (operation === "search") {
            indexedSearch(
                state,
                target,
                steps,
                counters,
                "Search"
            );

            return;
        }

        if (operation === "insert") {
            position =
                indexedSearch(
                    state,
                    target,
                    steps,
                    counters,
                    "Duplicate check"
                );

            if (position >= 0) {
                return;
            }

            state.records.push({
                key: target,
                name: value.name,
                marks: value.marks
            });

            steps.push(makeStep(
                state,
                "indexed",
                "Add New Record",
                "Add key " +
                    target +
                    " before reorganizing ordered data blocks.",
                "/* indexed sort */",
                Object.assign({}, counters, {
                    activeKey: target
                })
            ));

            indexedRebuildStep(
                state,
                steps,
                counters,
                target,
                "Inserted " + target
            );

            return;
        }

        if (operation === "update") {
            position =
                indexedSearch(
                    state,
                    target,
                    steps,
                    counters,
                    "Update lookup"
                );

            if (position < 0) {
                return;
            }

            state.records[position].name =
                value.name;

            state.records[position].marks =
                value.marks;

            indexedRebuildStep(
                state,
                steps,
                counters,
                target,
                "Updated " + target
            );

            return;
        }

        if (operation === "delete") {
            position =
                indexedSearch(
                    state,
                    target,
                    steps,
                    counters,
                    "Deletion lookup"
                );

            if (position < 0) {
                return;
            }

            state.records.splice(
                position,
                1
            );

            indexedRebuildStep(
                state,
                steps,
                counters,
                target,
                "Deleted " + target
            );

            return;
        }

        const blocks =
            Math.ceil(
                state.records.length /
                BLOCK_FACTOR
            );

        for (
            let block = 0;
            block < blocks;
            block += 1
        ) {
            counters.reads += 1;

            for (
                let index =
                    block *
                    BLOCK_FACTOR;
                index <
                    Math.min(
                        (
                            block +
                            1
                        ) *
                            BLOCK_FACTOR,
                        state.records.length
                    );
                index += 1
            ) {
                const record =
                    state.records[index];

                steps.push(makeStep(
                    state,
                    "indexed",
                    "Traverse Data Block",
                    "Output " +
                        recordText(record) +
                        " from indexed block " +
                        block +
                        ".",
                    "/* indexed scan block */",
                    Object.assign({}, counters, {
                        activeBlock: block,
                        activeKey: record.key,
                        result:
                            "Reading " +
                            record.key
                    })
                ));
            }
        }
    }

    function directInsert(
        state,
        record,
        steps,
        counters,
        context
    ) {
        const home =
            positiveMod(
                record.key,
                DIRECT_SIZE
            );

        let firstDeleted = -1;

        steps.push(makeStep(
            state,
            "direct",
            "Compute Hash",
            (context || "Insert") +
                " key " +
                record.key +
                ": home = " +
                home +
                ".",
            "/* direct hash */",
            Object.assign({}, counters, {
                activeSlot: home,
                activeKey: record.key
            })
        ));

        for (
            let attempt = 0;
            attempt < DIRECT_SIZE;
            attempt += 1
        ) {
            const index =
                (
                    home +
                    attempt
                ) %
                DIRECT_SIZE;

            const slot =
                state.slots[index];

            counters.reads += 1;
            counters.comparisons += 1;

            steps.push(makeStep(
                state,
                "direct",
                "Probe Slot",
                "Probe " +
                    attempt +
                    " reads slot " +
                    index +
                    ".",
                "/* direct insert loop */",
                Object.assign({}, counters, {
                    activeSlot: index,
                    activeKey: record.key
                })
            ));

            if (
                slot !== null &&
                slot !== DELETED &&
                slot.key === record.key
            ) {
                steps.push(makeStep(
                    state,
                    "direct",
                    "Duplicate Key",
                    "Key " +
                        record.key +
                        " already occupies slot " +
                        index +
                        ".",
                    "/* direct insert loop */",
                    Object.assign({}, counters, {
                        activeSlot: index,
                        activeKey: record.key,
                        result:
                            "Duplicate key " +
                            record.key
                    })
                ));

                return -1;
            }

            if (
                slot === DELETED &&
                firstDeleted === -1
            ) {
                firstDeleted = index;
            }

            if (slot === null) {
                const destination =
                    firstDeleted === -1
                        ? index
                        : firstDeleted;

                state.slots[destination] =
                    cloneRecord(record);

                counters.reads += 1;

                steps.push(makeStep(
                    state,
                    "direct",
                    "Store Record",
                    "Write " +
                        recordText(record) +
                        " into slot " +
                        destination +
                        ".",
                    "/* direct insert store */",
                    Object.assign({}, counters, {
                        activeSlot:
                            destination,
                        activeKey:
                            record.key,
                        result:
                            "Stored key " +
                            record.key +
                            " at slot " +
                            destination
                    })
                ));

                return destination;
            }
        }

        if (firstDeleted !== -1) {
            state.slots[firstDeleted] =
                cloneRecord(record);

            counters.reads += 1;

            steps.push(makeStep(
                state,
                "direct",
                "Reuse Deleted Slot",
                "The table has no empty slot, so reuse tombstone " +
                    firstDeleted +
                    ".",
                "/* direct insert store */",
                Object.assign({}, counters, {
                    activeSlot:
                        firstDeleted,
                    activeKey:
                        record.key,
                    result:
                        "Stored key " +
                        record.key +
                        " at slot " +
                        firstDeleted
                })
            ));

            return firstDeleted;
        }

        steps.push(makeStep(
            state,
            "direct",
            "File Full",
            "All " +
                DIRECT_SIZE +
                " slots are occupied.",
            "/* direct insert loop */",
            Object.assign({}, counters, {
                result:
                    "Direct file is full"
            })
        ));

        return -1;
    }

    function buildDirectBase(
        input,
        steps,
        counters
    ) {
        const state =
            createState("direct");

        steps.push(makeStep(
            state,
            "direct",
            "Initialize File",
            "Create " +
                DIRECT_SIZE +
                " fixed-length EMPTY slots.",
            "/* direct initialize */",
            counters
        ));

        input.forEach(function (record) {
            directInsert(
                state,
                record,
                steps,
                counters,
                "Build"
            );
        });

        return state;
    }

    function directSearch(
        state,
        target,
        steps,
        counters,
        purpose
    ) {
        const home =
            positiveMod(
                target,
                DIRECT_SIZE
            );

        steps.push(makeStep(
            state,
            "direct",
            "Compute Hash",
            (purpose || "Search") +
                " key " +
                target +
                ": home = " +
                home +
                ".",
            "/* direct hash */",
            Object.assign({}, counters, {
                activeSlot: home,
                activeKey: target
            })
        ));

        for (
            let attempt = 0;
            attempt < DIRECT_SIZE;
            attempt += 1
        ) {
            const index =
                (
                    home +
                    attempt
                ) %
                DIRECT_SIZE;

            const slot =
                state.slots[index];

            counters.reads += 1;
            counters.comparisons += 1;

            steps.push(makeStep(
                state,
                "direct",
                "Probe Sequence",
                "Probe " +
                    attempt +
                    " seeks to and reads slot " +
                    index +
                    ".",
                "/* direct probe */",
                Object.assign({}, counters, {
                    activeSlot: index,
                    activeKey: target
                })
            ));

            if (slot === null) {
                steps.push(makeStep(
                    state,
                    "direct",
                    "Never-used Slot",
                    "Slot " +
                        index +
                        " is EMPTY, so the probe sequence stops.",
                    "/* direct search empty */",
                    Object.assign({}, counters, {
                        activeSlot: index,
                        activeKey: target,
                        result:
                            "Key " +
                            target +
                            " not found"
                    })
                ));

                return -1;
            }

            if (
                slot !== DELETED &&
                slot.key === target
            ) {
                steps.push(makeStep(
                    state,
                    "direct",
                    "Record Found",
                    "Slot " +
                        index +
                        " contains " +
                        recordText(slot) +
                        ".",
                    "/* direct search found */",
                    Object.assign({}, counters, {
                        activeSlot: index,
                        activeKey: target,
                        result:
                            "Found " +
                            slot.name +
                            " (" +
                            slot.marks +
                            ") at slot " +
                            index
                    })
                ));

                return index;
            }
        }

        steps.push(makeStep(
            state,
            "direct",
            "Full Probe Complete",
            "Every slot was checked without finding key " +
                target +
                ".",
            "/* direct search loop */",
            Object.assign({}, counters, {
                result:
                    "Key " +
                    target +
                    " not found"
            })
        ));

        return -1;
    }

    function runDirectOperation(
        state,
        operation,
        target,
        value,
        steps,
        counters
    ) {
        let slot;

        if (operation === "search") {
            directSearch(
                state,
                target,
                steps,
                counters,
                "Search"
            );

            return;
        }

        if (operation === "insert") {
            directInsert(
                state,
                {
                    key: target,
                    name: value.name,
                    marks: value.marks
                },
                steps,
                counters,
                "Insert"
            );

            return;
        }

        if (operation === "update") {
            steps.push(makeStep(
                state,
                "direct",
                "Update Lookup",
                "Call the direct-file search before overwriting the slot.",
                "/* direct update search */",
                counters
            ));

            slot =
                directSearch(
                    state,
                    target,
                    steps,
                    counters,
                    "Update lookup"
                );

            if (slot < 0) {
                return;
            }

            state.slots[slot].name =
                value.name;

            state.slots[slot].marks =
                value.marks;

            counters.reads += 1;

            steps.push(makeStep(
                state,
                "direct",
                "Write Update",
                "Overwrite slot " +
                    slot +
                    " with the new name and marks.",
                "/* direct update write */",
                Object.assign({}, counters, {
                    activeSlot: slot,
                    activeKey: target,
                    result:
                        "Updated " +
                        target
                })
            ));

            return;
        }

        if (operation === "delete") {
            steps.push(makeStep(
                state,
                "direct",
                "Deletion Lookup",
                "Call the direct-file search before marking a slot deleted.",
                "/* direct delete search */",
                counters
            ));

            slot =
                directSearch(
                    state,
                    target,
                    steps,
                    counters,
                    "Deletion lookup"
                );

            if (slot < 0) {
                return;
            }

            state.slots[slot] =
                DELETED;

            counters.reads += 1;

            steps.push(makeStep(
                state,
                "direct",
                "Write Tombstone",
                "Mark slot " +
                    slot +
                    " DELETED so later probe paths remain valid.",
                "/* direct delete mark */",
                Object.assign({}, counters, {
                    activeSlot: slot,
                    activeKey: target,
                    result:
                        "Deleted " +
                        target
                })
            ));

            return;
        }

        state.slots.forEach(
            function (record, index) {
                counters.reads += 1;

                steps.push(makeStep(
                    state,
                    "direct",
                    "Read Slot",
                    record === null
                        ? (
                            "Slot " +
                            index +
                            " is EMPTY."
                        )
                        : record === DELETED
                            ? (
                                "Slot " +
                                index +
                                " is a DELETED tombstone."
                            )
                            : (
                                "Output " +
                                recordText(record) +
                                " from slot " +
                                index +
                                "."
                            ),
                    "/* direct seek */",
                    Object.assign({}, counters, {
                        activeSlot: index,
                        activeKey:
                            record !== null &&
                            record !== DELETED
                                ? record.key
                                : null,
                        result:
                            "Reading slot " +
                            index
                    })
                ));
            }
        );
    }

    function buildSteps(
        records,
        organization,
        operation,
        target,
        value
    ) {
        const steps = [];

      const counters = {
    comparisons: 0,
    reads: 0
};

let operationStart = 0;
let state;
        
        if (
            organization ===
            "sequential"
        ) {
            state =
                buildSequentialBase(
                    records,
                    steps,
                    counters
                );
        } else if (
            organization ===
            "indexed"
        ) {
            state =
                buildIndexedBase(
                    records,
                    steps,
                    counters
                );
        } else {
            state =
                buildDirectBase(
                    records,
                    steps,
                    counters
                );
        }

       if (operation !== "build") {
    operationStart = steps.length;

    if (
        organization ===
        "sequential"
    ) {
                runSequentialOperation(
                    state,
                    operation,
                    target,
                    value,
                    steps,
                    counters
                );
            } else if (
                organization ===
                "indexed"
            ) {
                runIndexedOperation(
                    state,
                    operation,
                    target,
                    value,
                    steps,
                    counters
                );
            } else {
                runDirectOperation(
                    state,
                    operation,
                    target,
                    value,
                    steps,
                    counters
                );
            }
        }

        const last =
            steps[steps.length - 1];

        let result;

        if (operation === "build") {
            result =
                "Built " +
                countState(
                    state,
                    organization
                ) +
                " records";
        } else if (
            operation === "traverse"
        ) {
            result =
                "Traversal complete: " +
                countState(
                    state,
                    organization
                ) +
                " records";
        } else {
            result = last.result;
        }

        steps.push(makeStep(
            state,
            organization,
            "Complete",
            operationLabels[operation] +
                " is complete.",
            last.needle,
            Object.assign({}, counters, {
                activeBlock:
                    last.activeBlock,
                activeSlot:
                    last.activeSlot,
                activeKey:
                    last.activeKey,
                result: result,
                complete: true
            })
        ));

        return operation === "build"
    ? steps
    : steps.slice(operationStart);
    }

    function parseRecords(input) {
        const parts =
            input.value
                .trim()
                .split(/\s*,\s*/)
                .filter(Boolean);

        if (
            parts.length < 2 ||
            parts.length > 10
        ) {
            throw new Error(
                "Enter 2 to 10 records in key:name:marks format."
            );
        }

        const records =
            parts.map(function (part) {
                const fields =
                    part
                        .split(":")
                        .map(function (field) {
                            return field.trim();
                        });

                if (fields.length !== 3) {
                    throw new Error(
                        "Every record must use key:name:marks format."
                    );
                }

                const key =
                    Number(fields[0]);

                const name =
                    fields[1];

                const marks =
                    Number(fields[2]);

                if (
                    !Number.isInteger(key) ||
                    Math.abs(key) > 999999
                ) {
                    throw new Error(
                        "Every key must be an integer from -999999 to 999999."
                    );
                }

                if (
                    !/^[A-Za-z][A-Za-z -]{0,15}$/.test(
                        name
                    )
                ) {
                    throw new Error(
                        "Names must contain 1 to 16 letters, spaces or hyphens."
                    );
                }

                if (
                    !Number.isInteger(marks) ||
                    marks < 0 ||
                    marks > 100
                ) {
                    throw new Error(
                        "Marks must be an integer from 0 to 100."
                    );
                }

                return {
                    key: key,
                    name: name,
                    marks: marks
                };
            });

        const uniqueKeys =
            new Set(
                records.map(
                    function (record) {
                        return record.key;
                    }
                )
            );

        if (
            uniqueKeys.size !==
            records.length
        ) {
            throw new Error(
                "Record keys must be unique."
            );
        }

        input.value =
            records
                .map(recordText)
                .join(", ");

        return records;
    }

    function parseTarget(
        input,
        operation
    ) {
        if (
            operation === "build" ||
            operation === "traverse"
        ) {
            return 0;
        }

        const target =
            Number(
                input.value.trim()
            );

        if (
            !Number.isInteger(target) ||
            Math.abs(target) > 999999
        ) {
            throw new Error(
                "Enter an integer target key from -999999 to 999999."
            );
        }

        input.value =
            String(target);

        return target;
    }

    function parseValue(
        input,
        operation
    ) {
        if (
            operation !== "insert" &&
            operation !== "update"
        ) {
            return {
                name: "",
                marks: 0
            };
        }

        const fields =
            input.value
                .split(":")
                .map(function (field) {
                    return field.trim();
                });

        if (fields.length !== 2) {
            throw new Error(
                "Enter the record value as name:marks."
            );
        }

        const name =
            fields[0];

        const marks =
            Number(fields[1]);

        if (
            !/^[A-Za-z][A-Za-z -]{0,15}$/.test(
                name
            )
        ) {
            throw new Error(
                "The name must contain 1 to 16 letters, spaces or hyphens."
            );
        }

        if (
            !Number.isInteger(marks) ||
            marks < 0 ||
            marks > 100
        ) {
            throw new Error(
                "Marks must be an integer from 0 to 100."
            );
        }

        input.value =
            name +
            ":" +
            marks;

        return {
            name: name,
            marks: marks
        };
    }

    function parseInputs(
        dataInput,
        targetInput,
        valueInput,
        organization,
        operation
    ) {
        const records =
            parseRecords(dataInput);

        if (
            organization === "direct" &&
            records.length >= DIRECT_SIZE
        ) {
            throw new Error(
                "Use at most 10 records in the 11-slot direct file."
            );
        }

        return {
            records: records,
            target:
                parseTarget(
                    targetInput,
                    operation
                ),
            value:
                parseValue(
                    valueInput,
                    operation
                )
        };
    }

    function element(
        name,
        className,
        textValue
    ) {
        const node =
            document.createElement(name);

        if (className) {
            node.className =
                className;
        }

        if (
            typeof textValue !==
            "undefined"
        ) {
            node.textContent =
                textValue;
        }

        return node;
    }

    function renderRecord(
        record,
        active
    ) {
        const row =
            element(
                "div",
                "file-record" +
                    (
                        active
                            ? " is-active"
                            : ""
                    )
            );

        row.appendChild(
            element(
                "strong",
                "file-record-key",
                String(record.key)
            )
        );

        row.appendChild(
            element(
                "span",
                "file-record-name",
                record.name
            )
        );

        row.appendChild(
            element(
                "span",
                "file-record-marks",
                String(record.marks)
            )
        );

        return row;
    }

    function renderDirectStorage(
        container,
        step
    ) {
        const grid =
            element(
                "div",
                "file-direct-grid"
            );

        step.slots.forEach(
            function (slot, index) {
                const active =
                    step.activeSlot ===
                    index;

                const card =
                    element(
                        "article",
                        "file-slot" +
                            (
                                active
                                    ? " is-active"
                                    : ""
                            ) +
                            (
                                slot === DELETED
                                    ? " is-deleted"
                                    : ""
                            )
                    );

                card.appendChild(
                    element(
                        "span",
                        "file-slot-number",
                        String(index)
                    )
                );

                if (slot === null) {
                    card.appendChild(
                        element(
                            "strong",
                            "file-slot-state",
                            "EMPTY"
                        )
                    );
                } else if (
                    slot === DELETED
                ) {
                    card.appendChild(
                        element(
                            "strong",
                            "file-slot-state",
                            "DELETED"
                        )
                    );
                } else {
                    card.appendChild(
                        renderRecord(
                            slot,
                            active
                        )
                    );
                }

                grid.appendChild(card);
            }
        );

        container.appendChild(grid);
    }

    function renderBlockedStorage(
        container,
        step
    ) {
        if (
            step.organization ===
                "indexed" &&
            step.records.length
        ) {
            const indexStrip =
                element(
                    "div",
                    "file-index-strip"
                );

            indexStrip.appendChild(
                element(
                    "strong",
                    "file-index-title",
                    "Sparse Index"
                )
            );

            indexedEntries(
                step.records
            ).forEach(function (entry) {
                const chip =
                    element(
                        "span",
                        "file-index-entry" +
                            (
                                entry.block ===
                                step.activeBlock
                                    ? " is-active"
                                    : ""
                            ),
                        entry.key +
                            " → B" +
                            entry.block
                    );

                indexStrip.appendChild(
                    chip
                );
            });

            container.appendChild(
                indexStrip
            );
        }

        const blocks =
            element(
                "div",
                "file-block-grid"
            );

        const count =
            Math.max(
                1,
                Math.ceil(
                    step.records.length /
                    BLOCK_FACTOR
                )
            );

        for (
            let block = 0;
            block < count;
            block += 1
        ) {
            const card =
                element(
                    "article",
                    "file-block" +
                        (
                            block ===
                            step.activeBlock
                                ? " is-active"
                                : ""
                        )
                );

            const header =
                element(
                    "div",
                    "file-block-header"
                );

            header.appendChild(
                element(
                    "strong",
                    "",
                    "Block " + block
                )
            );

            header.appendChild(
                element(
                    "span",
                    "",
                    "bfr = " +
                        BLOCK_FACTOR
                )
            );

            card.appendChild(header);

            const start =
                block *
                BLOCK_FACTOR;

            const records =
                step.records.slice(
                    start,
                    start +
                        BLOCK_FACTOR
                );

            if (!records.length) {
                card.appendChild(
                    element(
                        "div",
                        "file-empty-block",
                        "EMPTY"
                    )
                );
            } else {
                records.forEach(
                    function (record) {
                        card.appendChild(
                            renderRecord(
                                record,
                                record.key ===
                                    step.activeKey
                            )
                        );
                    }
                );
            }

            blocks.appendChild(card);
        }

        container.appendChild(blocks);
    }

    function renderStorage(
        container,
        step
    ) {
        container.innerHTML = "";

        if (
            step.organization ===
            "direct"
        ) {
            renderDirectStorage(
                container,
                step
            );
        } else {
            renderBlockedStorage(
                container,
                step
            );
        }
    }

    function updateOperationInputs(
        operation,
        targetLabel,
        targetInput,
        valueLabel,
        valueInput
    ) {
        const usesTarget =
            operation !== "build" &&
            operation !== "traverse";

        const usesValue =
            operation === "insert" ||
            operation === "update";

        targetInput.disabled =
            !usesTarget;

        valueInput.disabled =
            !usesValue;

        if (!usesTarget) {
            targetLabel.firstChild.textContent =
                "Target Key (not used)";
        } else if (
            operation === "delete"
        ) {
            targetLabel.firstChild.textContent =
                "Delete Key";
        } else if (
            operation === "update"
        ) {
            targetLabel.firstChild.textContent =
                "Update Key";
        } else if (
            operation === "insert"
        ) {
            targetLabel.firstChild.textContent =
                "New Key";
        } else {
            targetLabel.firstChild.textContent =
                "Search Key";
        }

        if (!usesValue) {
            valueLabel.firstChild.textContent =
                "Name / Marks (not used)";
        } else if (
            operation === "update"
        ) {
            valueLabel.firstChild.textContent =
                "New Name / Marks";
        } else {
            valueLabel.firstChild.textContent =
                "Record Name / Marks";
        }
    }

    const visualizer = {
        data:
            document.getElementById(
                "fileDataInput"
            ),

        targetLabel:
            document.getElementById(
                "fileTargetLabel"
            ),

        target:
            document.getElementById(
                "fileTargetInput"
            ),

        valueLabel:
            document.getElementById(
                "fileValueLabel"
            ),

        value:
            document.getElementById(
                "fileValueInput"
            ),

        organization:
            document.getElementById(
                "fileOrganization"
            ),

        operation:
            document.getElementById(
                "fileOperation"
            ),

        load:
            document.getElementById(
                "loadFileVisualizer"
            ),

        prompt:
            document.getElementById(
                "filePrompt"
            ),

        result:
            document.getElementById(
                "fileResult"
            ),

        storage:
            document.getElementById(
                "fileStorageView"
            ),

        message:
            document.getElementById(
                "fileMessage"
            ),

        progress:
            document.getElementById(
                "fileProgress"
            ),

        organizationValue:
            document.getElementById(
                "fileOrganizationValue"
            ),

        operationValue:
            document.getElementById(
                "fileOperationValue"
            ),

        phase:
            document.getElementById(
                "filePhase"
            ),

        block:
            document.getElementById(
                "fileBlockValue"
            ),

        comparisons:
            document.getElementById(
                "fileComparisonValue"
            ),

        reads:
            document.getElementById(
                "fileReadValue"
            ),

        count:
            document.getElementById(
                "fileCountValue"
            ),

        resultValue:
            document.getElementById(
                "fileResultValue"
            ),

        previous:
            document.getElementById(
                "filePrevious"
            ),

        next:
            document.getElementById(
                "fileNext"
            ),

        auto:
            document.getElementById(
                "fileAuto"
            ),

        pause:
            document.getElementById(
                "filePause"
            ),

        reset:
            document.getElementById(
                "fileReset"
            ),

        status:
            document.getElementById(
                "fileStatus"
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

        const location =
            step.organization ===
            "direct"
                ? step.activeSlot
                : step.activeBlock;

        renderStorage(
            visualizer.storage,
            step
        );

        visualizer.message.textContent =
            step.message;

        visualizer
            .organizationValue
            .textContent =
                definitions[
                    step.organization
                ].label;

        visualizer
            .operationValue
            .textContent =
                operationLabels[
                    visualizer.operation.value
                ];

        visualizer.phase.textContent =
            step.phase;

        visualizer.block.textContent =
            location >= 0
                ? String(location)
                : "—";

        visualizer
            .comparisons
            .textContent =
                String(
                    step.comparisons
                );

        visualizer.reads.textContent =
            String(step.reads);

        visualizer.count.textContent =
            String(step.count);

        visualizer
            .resultValue
            .textContent =
                step.result;

        visualizer
            .progress
            .style
            .width =
                (
                    visualIndex /
                    Math.max(
                        1,
                        visualSteps.length -
                            1
                    ) *
                    100
                ) +
                "%";

        visualizer.previous.disabled =
            visualIndex === 0;

        visualizer.next.disabled =
            visualIndex ===
            visualSteps.length - 1;

        visualizer.status.textContent =
            "Step " +
            visualIndex +
            " of " +
            (
                visualSteps.length -
                1
            );
    }

    function loadVisual() {
        let parsed;

        try {
            parsed =
                parseInputs(
                    visualizer.data,
                    visualizer.target,
                    visualizer.value,
                    visualizer
                        .organization
                        .value,
                    visualizer
                        .operation
                        .value
                );

            visualSteps =
                buildSteps(
                    parsed.records,
                    visualizer
                        .organization
                        .value,
                    visualizer
                        .operation
                        .value,
                    parsed.target,
                    parsed.value
                );
        } catch (error) {
            window.alert(
                error.message
            );

            return;
        }

        stopVisual();

        visualIndex = 0;
        visualizer.prompt.hidden = true;
        visualizer.result.hidden = false;

        renderVisual();
    }

    function setVisualExample(
        organization
    ) {
        const example =
            examples[organization];

        visualizer.organization.value =
            organization;

        visualizer.data.value =
            example.data;

        visualizer.target.value =
            example.target;

        visualizer.value.value =
            example.value;

        invalidateVisual();
    }

    if (visualizer.load) {
        populateOperations(
            visualizer.operation
        );

        updateOperationInputs(
            visualizer.operation.value,
            visualizer.targetLabel,
            visualizer.target,
            visualizer.valueLabel,
            visualizer.value
        );

        visualizer.load.addEventListener(
            "click",
            loadVisual
        );

        [
            visualizer.data,
            visualizer.target,
            visualizer.value,
            visualizer.organization
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

        visualizer
            .operation
            .addEventListener(
                "change",
                function () {
                    updateOperationInputs(
                        visualizer
                            .operation
                            .value,
                        visualizer
                            .targetLabel,
                        visualizer.target,
                        visualizer
                            .valueLabel,
                        visualizer.value
                    );

                    invalidateVisual();
                }
            );

        document
            .querySelectorAll(
                "[data-file-example]"
            )
            .forEach(function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        setVisualExample(
                            button
                                .dataset
                                .fileExample
                        );
                    }
                );
            });

        visualizer
            .previous
            .addEventListener(
                "click",
                function () {
                    stopVisual();

                    visualIndex =
                        Math.max(
                            0,
                            visualIndex -
                                1
                        );

                    renderVisual();
                }
            );

        visualizer
            .next
            .addEventListener(
                "click",
                function () {
                    stopVisual();

                    visualIndex =
                        Math.min(
                            visualSteps.length -
                                1,
                            visualIndex +
                                1
                        );

                    renderVisual();
                }
            );

        visualizer
            .auto
            .addEventListener(
                "click",
                function () {
                    stopVisual();

                    if (
                        visualIndex ===
                        visualSteps.length -
                            1
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
                            800
                        );
                }
            );

        visualizer
            .pause
            .addEventListener(
                "click",
                stopVisual
            );

        visualizer
            .reset
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
        data:
            document.getElementById(
                "fileTraceData"
            ),

        targetLabel:
            document.getElementById(
                "fileTraceTargetLabel"
            ),

        target:
            document.getElementById(
                "fileTraceTarget"
            ),

        valueLabel:
            document.getElementById(
                "fileTraceValueLabel"
            ),

        value:
            document.getElementById(
                "fileTraceValue"
            ),

        organization:
            document.getElementById(
                "fileTraceOrganization"
            ),

        operation:
            document.getElementById(
                "fileTraceOperation"
            ),

        load:
            document.getElementById(
                "loadFileTracer"
            ),

        prompt:
            document.getElementById(
                "fileTracePrompt"
            ),

        result:
            document.getElementById(
                "fileTraceResult"
            ),

        title:
            document.getElementById(
                "fileTraceTitle"
            ),

        codeWindow:
            document.getElementById(
                "fileTraceCodeWindow"
            ),

        code:
            document.getElementById(
                "fileTraceCode"
            ),

        message:
            document.getElementById(
                "fileTraceMessage"
            ),

        variables:
            document.getElementById(
                "fileTraceVariables"
            ),

        storage:
            document.getElementById(
                "fileTraceStorage"
            ),

        output:
            document.getElementById(
                "fileTraceOutput"
            ),

        previous:
            document.getElementById(
                "fileTracePrevious"
            ),

        next:
            document.getElementById(
                "fileTraceNext"
            ),

        auto:
            document.getElementById(
                "fileTraceAuto"
            ),

        pause:
            document.getElementById(
                "fileTracePause"
            ),

        reset:
            document.getElementById(
                "fileTraceReset"
            ),

        status:
            document.getElementById(
                "fileTraceStatus"
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

        const text =
            source.textContent
                .replace(/\r/g, "")
                .replace(
                    /^\n+|\n+$/g,
                    ""
                );

        traceLookupLines =
            text.split("\n");

        tracer.code.innerHTML = "";

        traceLookupLines.forEach(
            function (line, index) {
                const visible =
                    line
                        .replace(
                            /\s*\/\*\s*(?:sequential|indexed|direct)[^*]*\*\//g,
                            ""
                        )
                        .replace(
                            /\s+$/g,
                            ""
                        );

                const row =
                    document.createElement(
                        "span"
                    );

                row.dataset.fileTraceLine =
                    String(index + 1);

                row.textContent =
                    String(index + 1)
                        .padStart(
                            3,
                            "0"
                        ) +
                    " │ " +
                    (visible || " ");

                tracer.code.appendChild(
                    row
                );
            }
        );

        tracer.codeWindow.scrollTop = 0;
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
                    .indexOf(needle) !==
                -1
            ) {
                return index + 1;
            }
        }

        return -1;
    }

    function decorate(steps) {
        let previous = 1;

        return steps.map(
            function (step) {
                const line =
                    findLine(
                        step.needle
                    );

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
            }
        );
    }

    function appendVariable(
        label,
        value
    ) {
        const card =
            document.createElement(
                "div"
            );

        const name =
            document.createElement(
                "span"
            );

        const data =
            document.createElement(
                "strong"
            );

        name.textContent = label;
        data.textContent =
            String(value);

        card.appendChild(name);
        card.appendChild(data);

        tracer.variables.appendChild(
            card
        );
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
                "[data-file-trace-line]"
            )
            .forEach(function (line) {
                const active =
                    Number(
                        line.dataset
                            .fileTraceLine
                    ) ===
                    step.line;

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
            "Organization",
            activeTraceDefinition.label
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
            step.organization ===
                "direct"
                ? "Slot"
                : "Block",
            step.organization ===
                "direct"
                ? (
                    step.activeSlot >= 0
                        ? step.activeSlot
                        : "—"
                )
                : (
                    step.activeBlock >= 0
                        ? step.activeBlock
                        : "—"
                )
        );

        appendVariable(
            "Current Key",
            step.activeKey === null
                ? "—"
                : step.activeKey
        );

        appendVariable(
            "Comparisons",
            step.comparisons
        );

        appendVariable(
            "Block Reads",
            step.reads
        );

        appendVariable(
            "Records",
            step.count
        );

        renderStorage(
            tracer.storage,
            step
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
            (
                traceSteps.length -
                1
            );

        if (activeLine) {
            const top =
                activeLine.offsetTop -
                tracer.codeWindow
                    .clientHeight /
                    2 +
                activeLine.offsetHeight /
                    2;

       tracer.codeWindow.scrollTo({
    top: Math.max(0, top),
    behavior:
        traceIndex === 0
            ? "auto"
            : "smooth"
});
        }
    }

    function loadTrace() {
        const definition =
            definitions[
                tracer.organization.value
            ];

        let parsed;

        try {
            parsed =
                parseInputs(
                    tracer.data,
                    tracer.target,
                    tracer.value,
                    tracer
                        .organization
                        .value,
                    tracer
                        .operation
                        .value
                );

            loadCode(definition);

            traceSteps =
                decorate(
                    buildSteps(
                        parsed.records,
                        tracer
                            .organization
                            .value,
                        tracer
                            .operation
                            .value,
                        parsed.target,
                        parsed.value
                    )
                );
        } catch (error) {
            window.alert(
                error.message
            );

            return;
        }

        stopTrace();

        activeTraceDefinition =
            definition;

        traceIndex = 0;

        tracer.title.textContent =
            "PROGRAM TRACING — " +
            definition.label.toUpperCase() +
            " — " +
            operationLabels[
                tracer.operation.value
            ].toUpperCase();

        tracer.prompt.hidden = true;
        tracer.result.hidden = false;

        renderTrace();
    }

    function setTraceExample(
        organization
    ) {
        const example =
            examples[organization];

        tracer.data.value =
            example.data;

        tracer.target.value =
            example.target;

        tracer.value.value =
            example.value;

        invalidateTrace();
    }

    if (tracer.load) {
        populateOperations(
            tracer.operation
        );

        updateOperationInputs(
            tracer.operation.value,
            tracer.targetLabel,
            tracer.target,
            tracer.valueLabel,
            tracer.value
        );

        tracer.load.addEventListener(
            "click",
            loadTrace
        );

        tracer
            .organization
            .addEventListener(
                "change",
                function () {
                    setTraceExample(
                        tracer
                            .organization
                            .value
                    );
                }
            );

        [
            tracer.data,
            tracer.target,
            tracer.value
        ].forEach(function (control) {
            control.addEventListener(
                "input",
                invalidateTrace
            );
        });

        tracer
            .operation
            .addEventListener(
                "change",
                function () {
                    updateOperationInputs(
                        tracer
                            .operation
                            .value,
                        tracer.targetLabel,
                        tracer.target,
                        tracer.valueLabel,
                        tracer.value
                    );

                    invalidateTrace();
                }
            );

        tracer
            .previous
            .addEventListener(
                "click",
                function () {
                    stopTrace();

                    traceIndex =
                        Math.max(
                            0,
                            traceIndex - 1
                        );

                    renderTrace();
                }
            );

        tracer
            .next
            .addEventListener(
                "click",
                function () {
                    stopTrace();

                    traceIndex =
                        Math.min(
                            traceSteps.length -
                                1,
                            traceIndex + 1
                        );

                    renderTrace();
                }
            );

        tracer
            .auto
            .addEventListener(
                "click",
                function () {
                    stopTrace();

                    if (
                        traceIndex ===
                        traceSteps.length -
                            1
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
                            820
                        );
                }
            );

        tracer
            .pause
            .addEventListener(
                "click",
                stopTrace
            );

        tracer
            .reset
            .addEventListener(
                "click",
                function () {
                    stopTrace();
                    traceIndex = 0;
                    renderTrace();
                }
            );
    }
}());
