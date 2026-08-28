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

    function createNode(leaf) {
        nodeCounter += 1;

        return {
            id: "multiway-node-" + nodeCounter,
            keys: [],
            children: [],
            leaf: leaf !== false
        };
    }

    function cloneTree(node) {
        if (!node) { return null; }

        return {
            id: node.id,
            keys: node.keys.slice(),
            children: node.children.map(cloneTree),
            leaf: node.leaf
        };
    }

    function nodeCount(node) {
        if (!node) { return 0; }

        return 1 + node.children.reduce(
            function (total, child) {
                return total + nodeCount(child);
            },
            0
        );
    }

    function treeHeight(node) {
        if (!node) { return 0; }

        return node.leaf || !node.children.length
            ? 1
            : 1 + treeHeight(node.children[0]);
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
            key: typeof data.key === "number"
                ? data.key
                : "—",
            childIndex:
                typeof data.childIndex === "number"
                    ? data.childIndex
                    : "—",
            nodes: nodeCount(root),
            height: treeHeight(root),
            result: data.result || "—",
            complete: Boolean(data.complete)
        };
    }

    function pushComplete(
        steps,
        root,
        structure,
        operation,
        result
    ) {
        steps.push(makeStep(
            root,
            [root.id],
            "Complete",
            structure + " — " + operation + " is complete.",
            "/* multiway complete */",
            {
                current: "root",
                result: result,
                complete: true
            }
        ));

        return steps;
    }

    function sortedInsert(array, value) {
        let index = array.length;

        while (
            index > 0 &&
            value < array[index - 1]
        ) {
            index -= 1;
        }

        array.splice(index, 0, value);

        return index;
    }

    function containsKey(root, key) {
        let node = root;

        while (node) {
            let index = 0;

            while (
                index < node.keys.length &&
                key > node.keys[index]
            ) {
                index += 1;
            }

            if (
                index < node.keys.length &&
                node.keys[index] === key
            ) {
                return true;
            }

            if (node.leaf) {
                return false;
            }

            node = node.children[index];
        }

        return false;
    }

    function splitBTreeChild(
        holder,
        parent,
        index,
        minimumDegree,
        steps,
        markerPrefix
    ) {
        const full = parent.children[index];
        const right = createNode(full.leaf);
        const median = full.keys[minimumDegree - 1];

        right.keys = full.keys.slice(minimumDegree);
        full.keys = full.keys.slice(0, minimumDegree - 1);

        if (!full.leaf) {
            right.children =
                full.children.slice(minimumDegree);

            full.children =
                full.children.slice(0, minimumDegree);
        }

        parent.keys.splice(index, 0, median);
        parent.children.splice(index + 1, 0, right);

        steps.push(makeStep(
            holder.root,
            [parent.id, full.id, right.id],
            "Split Child",
            "Split the full node and promote median " +
                median +
                " into its parent.",
            "/* " + markerPrefix + " split child */",
            {
                current:
                    "[" + parent.keys.join(", ") + "]",
                key: median,
                childIndex: index
            }
        ));
    }

    function insertBTreeNonFull(
        holder,
        node,
        key,
        minimumDegree,
        steps,
        markerPrefix
    ) {
        if (node.leaf) {
            const index = sortedInsert(node.keys, key);

            steps.push(makeStep(
                holder.root,
                [node.id],
                "Insert in Leaf",
                "Insert " +
                    key +
                    " into the leaf in sorted position " +
                    index +
                    ".",
                "/* " + markerPrefix + " insert leaf */",
                {
                    current:
                        "[" + node.keys.join(", ") + "]",
                    key: key,
                    childIndex: index
                }
            ));

            return;
        }

        let index = node.keys.length - 1;

        while (
            index >= 0 &&
            key < node.keys[index]
        ) {
            index -= 1;
        }

        index += 1;

        steps.push(makeStep(
            holder.root,
            [node.id, node.children[index].id],
            "Choose Child",
            "Key " +
                key +
                " belongs in child interval " +
                index +
                ".",
            "/* " + markerPrefix + " choose child */",
            {
                current:
                    "[" + node.keys.join(", ") + "]",
                key: key,
                childIndex: index
            }
        ));

        if (
            node.children[index].keys.length ===
            2 * minimumDegree - 1
        ) {
            splitBTreeChild(
                holder,
                node,
                index,
                minimumDegree,
                steps,
                markerPrefix
            );

            if (key > node.keys[index]) {
                index += 1;
            }
        }

        insertBTreeNonFull(
            holder,
            node.children[index],
            key,
            minimumDegree,
            steps,
            markerPrefix
        );
    }

    function insertBTree(
        holder,
        key,
        minimumDegree,
        steps,
        markerPrefix
    ) {
        if (containsKey(holder.root, key)) {
            steps.push(makeStep(
                holder.root,
                [holder.root.id],
                "Duplicate Ignored",
                "Key " + key + " is already stored.",
                "/* " + markerPrefix + " insert call */",
                {
                    key: key,
                    result: "Already stored"
                }
            ));

            return;
        }

        steps.push(makeStep(
            holder.root,
            [holder.root.id],
            "Insert Key",
            "Insert " +
                key +
                " using top-down splitting.",
            "/* " + markerPrefix + " insert call */",
            {
                key: key
            }
        ));

        if (
            holder.root.keys.length ===
            2 * minimumDegree - 1
        ) {
            const oldRoot = holder.root;
            const newRoot = createNode(false);

            newRoot.children.push(oldRoot);
            holder.root = newRoot;

            steps.push(makeStep(
                holder.root,
                [newRoot.id, oldRoot.id],
                "Split Root",
                "The root is full, so create a new root before descending.",
                "/* " + markerPrefix + " split root */",
                {
                    key: key
                }
            ));

            splitBTreeChild(
                holder,
                newRoot,
                0,
                minimumDegree,
                steps,
                markerPrefix
            );
        }

        insertBTreeNonFull(
            holder,
            holder.root,
            key,
            minimumDegree,
            steps,
            markerPrefix
        );
    }

    function searchBTreeSteps(
        root,
        key,
        steps,
        markerPrefix
    ) {
        let node = root;

        while (node) {
            let index = 0;

            steps.push(makeStep(
                root,
                [node.id],
                "Scan Node",
                "Scan the sorted keys in [" +
                    node.keys.join(", ") +
                    "].",
                "/* " + markerPrefix + " search loop */",
                {
                    current:
                        "[" + node.keys.join(", ") + "]",
                    key: key
                }
            ));

            while (
                index < node.keys.length &&
                key > node.keys[index]
            ) {
                index += 1;
            }

            if (
                index < node.keys.length &&
                node.keys[index] === key
            ) {
                steps.push(makeStep(
                    root,
                    [node.id],
                    "Key Found",
                    "Key " +
                        key +
                        " is stored at position " +
                        index +
                        ".",
                    "/* " + markerPrefix + " search result */",
                    {
                        current:
                            "[" + node.keys.join(", ") + "]",
                        key: key,
                        childIndex: index,
                        result: "Found"
                    }
                ));

                return true;
            }

            if (node.leaf) {
                steps.push(makeStep(
                    root,
                    [node.id],
                    "Not Found",
                    "The search reached a leaf without finding " +
                        key +
                        ".",
                    "/* " + markerPrefix + " search result */",
                    {
                        current:
                            "[" + node.keys.join(", ") + "]",
                        key: key,
                        result: "Not found"
                    }
                ));

                return false;
            }

            steps.push(makeStep(
                root,
                [node.id, node.children[index].id],
                "Descend",
                "Continue through child interval " +
                    index +
                    ".",
                "/* " + markerPrefix + " choose child */",
                {
                    current:
                        "[" + node.keys.join(", ") + "]",
                    key: key,
                    childIndex: index
                }
            ));

            node = node.children[index];
        }

        return false;
    }

    function predecessorValue(node) {
        let current = node;

        while (!current.leaf) {
            current =
                current.children[
                    current.children.length - 1
                ];
        }

        return current.keys[current.keys.length - 1];
    }

    function successorValue(node) {
        let current = node;

        while (!current.leaf) {
            current = current.children[0];
        }

        return current.keys[0];
    }

    function mergeBTreeChildren(
        holder,
        parent,
        index,
        steps,
        markerPrefix
    ) {
        const left = parent.children[index];
        const right = parent.children[index + 1];
        const separator = parent.keys[index];

        left.keys.push(separator);
        Array.prototype.push.apply(left.keys, right.keys);

        if (!left.leaf) {
            Array.prototype.push.apply(
                left.children,
                right.children
            );
        }

        parent.keys.splice(index, 1);
        parent.children.splice(index + 1, 1);

        steps.push(makeStep(
            holder.root,
            [parent.id, left.id],
            "Merge Children",
            "Merge two minimum children with parent separator " +
                separator +
                ".",
            "/* " + markerPrefix + " merge children */",
            {
                current:
                    "[" + left.keys.join(", ") + "]",
                key: separator,
                childIndex: index
            }
        ));

        return left;
    }

    function borrowBTreeLeft(
        holder,
        parent,
        index,
        steps,
        markerPrefix
    ) {
        const child = parent.children[index];
        const sibling = parent.children[index - 1];

        child.keys.unshift(parent.keys[index - 1]);
        parent.keys[index - 1] = sibling.keys.pop();

        if (!child.leaf) {
            child.children.unshift(
                sibling.children.pop()
            );
        }

        steps.push(makeStep(
            holder.root,
            [parent.id, sibling.id, child.id],
            "Borrow from Left",
            "Rotate a key through the parent from the left sibling.",
            "/* " + markerPrefix + " borrow left */",
            {
                childIndex: index
            }
        ));
    }

    function borrowBTreeRight(
        holder,
        parent,
        index,
        steps,
        markerPrefix
    ) {
        const child = parent.children[index];
        const sibling = parent.children[index + 1];

        child.keys.push(parent.keys[index]);
        parent.keys[index] = sibling.keys.shift();

        if (!child.leaf) {
            child.children.push(
                sibling.children.shift()
            );
        }

        steps.push(makeStep(
            holder.root,
            [parent.id, sibling.id, child.id],
            "Borrow from Right",
            "Rotate a key through the parent from the right sibling.",
            "/* " + markerPrefix + " borrow right */",
            {
                childIndex: index
            }
        ));
    }

    function deleteBTreeNode(
        holder,
        node,
        key,
        minimumDegree,
        steps,
        markerPrefix
    ) {
        let index = 0;

        while (
            index < node.keys.length &&
            node.keys[index] < key
        ) {
            index += 1;
        }

        steps.push(makeStep(
            holder.root,
            [node.id],
            "Locate Key",
            "Locate " +
                key +
                " inside node [" +
                node.keys.join(", ") +
                "].",
            "/* " + markerPrefix + " delete locate */",
            {
                current:
                    "[" + node.keys.join(", ") + "]",
                key: key,
                childIndex: index
            }
        ));

        if (
            index < node.keys.length &&
            node.keys[index] === key
        ) {
            if (node.leaf) {
                node.keys.splice(index, 1);

                steps.push(makeStep(
                    holder.root,
                    [node.id],
                    "Delete from Leaf",
                    "Remove " +
                        key +
                        " directly from the leaf.",
                    "/* " + markerPrefix + " delete leaf */",
                    {
                        current:
                            "[" + node.keys.join(", ") + "]",
                        key: key,
                        result: "Deleted"
                    }
                ));

                return;
            }

            if (
                node.children[index].keys.length >=
                minimumDegree
            ) {
                const predecessor =
                    predecessorValue(
                        node.children[index]
                    );

                node.keys[index] = predecessor;

                steps.push(makeStep(
                    holder.root,
                    [node.id, node.children[index].id],
                    "Use Predecessor",
                    "Replace " +
                        key +
                        " with predecessor " +
                        predecessor +
                        ".",
                    "/* " +
                        markerPrefix +
                        " delete predecessor */",
                    {
                        key: predecessor,
                        childIndex: index
                    }
                ));

                deleteBTreeNode(
                    holder,
                    node.children[index],
                    predecessor,
                    minimumDegree,
                    steps,
                    markerPrefix
                );
            } else if (
                node.children[index + 1].keys.length >=
                minimumDegree
            ) {
                const successor =
                    successorValue(
                        node.children[index + 1]
                    );

                node.keys[index] = successor;

                steps.push(makeStep(
                    holder.root,
                    [
                        node.id,
                        node.children[index + 1].id
                    ],
                    "Use Successor",
                    "Replace " +
                        key +
                        " with successor " +
                        successor +
                        ".",
                    "/* " +
                        markerPrefix +
                        " delete successor */",
                    {
                        key: successor,
                        childIndex: index + 1
                    }
                ));

                deleteBTreeNode(
                    holder,
                    node.children[index + 1],
                    successor,
                    minimumDegree,
                    steps,
                    markerPrefix
                );
            } else {
                const merged = mergeBTreeChildren(
                    holder,
                    node,
                    index,
                    steps,
                    markerPrefix
                );

                deleteBTreeNode(
                    holder,
                    merged,
                    key,
                    minimumDegree,
                    steps,
                    markerPrefix
                );
            }

            return;
        }

        if (node.leaf) {
            steps.push(makeStep(
                holder.root,
                [node.id],
                "Key Missing",
                "The key is absent; no deletion is performed.",
                "/* " + markerPrefix + " delete leaf */",
                {
                    key: key,
                    result: "Not found"
                }
            ));

            return;
        }

        let childIndex = index;

        if (
            node.children[childIndex].keys.length ===
            minimumDegree - 1
        ) {
            if (
                childIndex > 0 &&
                node.children[childIndex - 1]
                    .keys.length >= minimumDegree
            ) {
                borrowBTreeLeft(
                    holder,
                    node,
                    childIndex,
                    steps,
                    markerPrefix
                );
            } else if (
                childIndex < node.keys.length &&
                node.children[childIndex + 1]
                    .keys.length >= minimumDegree
            ) {
                borrowBTreeRight(
                    holder,
                    node,
                    childIndex,
                    steps,
                    markerPrefix
                );
            } else if (
                childIndex < node.keys.length
            ) {
                mergeBTreeChildren(
                    holder,
                    node,
                    childIndex,
                    steps,
                    markerPrefix
                );
            } else {
                mergeBTreeChildren(
                    holder,
                    node,
                    childIndex - 1,
                    steps,
                    markerPrefix
                );

                childIndex -= 1;
            }
        }

        deleteBTreeNode(
            holder,
            node.children[childIndex],
            key,
            minimumDegree,
            steps,
            markerPrefix
        );
    }

    function deleteBTree(
        holder,
        key,
        minimumDegree,
        steps,
        markerPrefix
    ) {
        if (!containsKey(holder.root, key)) {
            steps.push(makeStep(
                holder.root,
                [holder.root.id],
                "Key Missing",
                "Key " +
                    key +
                    " is not stored, so the tree is unchanged.",
                "/* " + markerPrefix + " delete call */",
                {
                    key: key,
                    result: "Not found"
                }
            ));

            return false;
        }

        steps.push(makeStep(
            holder.root,
            [holder.root.id],
            "Delete Key",
            "Delete " +
                key +
                " using top-down underflow repair.",
            "/* " + markerPrefix + " delete call */",
            {
                key: key
            }
        ));

        deleteBTreeNode(
            holder,
            holder.root,
            key,
            minimumDegree,
            steps,
            markerPrefix
        );

        if (
            !holder.root.leaf &&
            holder.root.keys.length === 0
        ) {
            const oldRoot = holder.root;
            holder.root = oldRoot.children[0];

            steps.push(makeStep(
                holder.root,
                [holder.root.id],
                "Contract Root",
                "The old root is empty; its only child becomes the new root.",
                "/* " + markerPrefix + " contract root */",
                {
                    key: key
                }
            ));
        }

        return true;
    }

    function traverseBTreeSteps(
        root,
        steps,
        markerPrefix
    ) {
        const output = [];

        function visit(node) {
            for (
                let index = 0;
                index < node.keys.length;
                index += 1
            ) {
                if (!node.leaf) {
                    visit(node.children[index]);
                }

                output.push(node.keys[index]);

                steps.push(makeStep(
                    root,
                    [node.id],
                    "Output Key",
                    "Visit key " +
                        node.keys[index] +
                        " in sorted order.",
                    "/* " + markerPrefix + " traverse */",
                    {
                        current:
                            "[" + node.keys.join(", ") + "]",
                        key: node.keys[index],
                        childIndex: index,
                        result: output.join(", ")
                    }
                ));
            }

            if (!node.leaf) {
                visit(node.children[node.keys.length]);
            }
        }

        visit(root);

        return output;
    }

    function buildBTreeOperationSteps(
        values,
        query,
        operation,
        structure
    ) {
        nodeCounter = 0;

        const markerPrefix = "btree";

        const name =
            structure === "two-three-four"
                ? "2–3–4 Tree"
                : "B-Tree";

        const holder = {
            root: createNode(true)
        };

        const steps = [
            makeStep(
                holder.root,
                [holder.root.id],
                "Create Root",
                "Create an empty leaf root.",
                "/* " + markerPrefix + " create root */",
                {
                    current: "root"
                }
            )
        ];

        values.forEach(function (value) {
            insertBTree(
                holder,
                value,
                2,
                steps,
                markerPrefix
            );
        });

        if (operation === "build") {
            return pushComplete(
                steps,
                holder.root,
                name,
                "Build",
                values.length + " keys stored"
            );
        }

        if (operation === "insert") {
            const existed =
                containsKey(holder.root, query);

            insertBTree(
                holder,
                query,
                2,
                steps,
                markerPrefix
            );

            return pushComplete(
                steps,
                holder.root,
                name,
                "Insertion",
                existed
                    ? "Already stored"
                    : "Inserted " + query
            );
        }

        if (operation === "search") {
            const found = searchBTreeSteps(
                holder.root,
                query,
                steps,
                markerPrefix
            );

            return pushComplete(
                steps,
                holder.root,
                name,
                "Search",
                found ? "Found" : "Not found"
            );
        }

        if (operation === "delete") {
            const deleted = deleteBTree(
                holder,
                query,
                2,
                steps,
                markerPrefix
            );

            return pushComplete(
                steps,
                holder.root,
                name,
                "Deletion",
                deleted
                    ? "Deleted " + query
                    : "Not found"
            );
        }

        const output = traverseBTreeSteps(
            holder.root,
            steps,
            markerPrefix
        );

        return pushComplete(
            steps,
            holder.root,
            name,
            "Sorted Traversal",
            output.join(", ")
        );
    }

    function insertTwoThree(holder, key, steps) {
        if (containsKey(holder.root, key)) {
            steps.push(makeStep(
                holder.root,
                [holder.root.id],
                "Duplicate Ignored",
                "Key " + key + " is already stored.",
                "/* tt insert call */",
                {
                    key: key,
                    result: "Already stored"
                }
            ));

            return;
        }

        let node = holder.root;
        const path = [];

        steps.push(makeStep(
            holder.root,
            [node.id],
            "Insert Key",
            "Search for the leaf that must receive " +
                key +
                ".",
            "/* tt insert call */",
            {
                key: key
            }
        ));

        while (!node.leaf) {
            let index = 0;

            while (
                index < node.keys.length &&
                key > node.keys[index]
            ) {
                index += 1;
            }

            path.push({
                parent: node,
                index: index
            });

            steps.push(makeStep(
                holder.root,
                [node.id, node.children[index].id],
                "Choose Child",
                "Key " +
                    key +
                    " belongs in child interval " +
                    index +
                    ".",
                "/* tt choose child */",
                {
                    current:
                        "[" + node.keys.join(", ") + "]",
                    key: key,
                    childIndex: index
                }
            ));

            node = node.children[index];
        }

        sortedInsert(node.keys, key);

        steps.push(makeStep(
            holder.root,
            [node.id],
            "Insert in Leaf",
            "Insert " +
                key +
                " into leaf [" +
                node.keys.join(", ") +
                "].",
            "/* tt insert leaf */",
            {
                current:
                    "[" + node.keys.join(", ") + "]",
                key: key
            }
        ));

        while (node.keys.length === 3) {
            const promoted = node.keys[1];
            const right = createNode(node.leaf);

            right.keys = [node.keys[2]];
            node.keys = [node.keys[0]];

            if (!node.leaf) {
                right.children =
                    node.children.slice(2);

                node.children =
                    node.children.slice(0, 2);
            }

            if (!path.length) {
                const newRoot = createNode(false);

                newRoot.keys = [promoted];
                newRoot.children = [node, right];

                holder.root = newRoot;

                steps.push(makeStep(
                    holder.root,
                    [newRoot.id, node.id, right.id],
                    "Create New Root",
                    "Split the overflowing root and promote " +
                        promoted +
                        ".",
                    "/* tt new root */",
                    {
                        key: promoted
                    }
                ));

                break;
            }

            const entry = path.pop();
            const parent = entry.parent;

            parent.keys.splice(
                entry.index,
                0,
                promoted
            );

            parent.children.splice(
                entry.index + 1,
                0,
                right
            );

            steps.push(makeStep(
                holder.root,
                [parent.id, node.id, right.id],
                "Promote Middle",
                "Promote " +
                    promoted +
                    " and split the overflowing node.",
                "/* tt promote middle */",
                {
                    current:
                        "[" + parent.keys.join(", ") + "]",
                    key: promoted,
                    childIndex: entry.index
                }
            ));

            node = parent;
        }
    }

    function buildTwoThreeOperationSteps(
        values,
        query,
        operation
    ) {
        nodeCounter = 0;

        const holder = {
            root: createNode(true)
        };

        const steps = [
            makeStep(
                holder.root,
                [holder.root.id],
                "Create Root",
                "Create an empty 2–3 Tree root.",
                "/* tt create root */",
                {
                    current: "root"
                }
            )
        ];

        values.forEach(function (value) {
            insertTwoThree(holder, value, steps);
        });

        if (operation === "build") {
            return pushComplete(
                steps,
                holder.root,
                "2–3 Tree",
                "Build",
                values.length + " keys stored"
            );
        }

        if (operation === "insert") {
            const existed =
                containsKey(holder.root, query);

            insertTwoThree(
                holder,
                query,
                steps
            );

            return pushComplete(
                steps,
                holder.root,
                "2–3 Tree",
                "Insertion",
                existed
                    ? "Already stored"
                    : "Inserted " + query
            );
        }

        if (operation === "search") {
            const found = searchBTreeSteps(
                holder.root,
                query,
                steps,
                "tt"
            );

            return pushComplete(
                steps,
                holder.root,
                "2–3 Tree",
                "Search",
                found ? "Found" : "Not found"
            );
        }

        const output = traverseBTreeSteps(
            holder.root,
            steps,
            "tt"
        );

        return pushComplete(
            steps,
            holder.root,
            "2–3 Tree",
            "Sorted Traversal",
            output.join(", ")
        );
    }

    function insertBPlusRecursive(
        holder,
        node,
        key,
        steps
    ) {
        if (node.leaf) {
            const index =
                sortedInsert(node.keys, key);

            steps.push(makeStep(
                holder.root,
                [node.id],
                "Insert in Leaf",
                "Insert " +
                    key +
                    " into B+ leaf position " +
                    index +
                    ".",
                "/* bplus insert leaf */",
                {
                    current:
                        "[" + node.keys.join(", ") + "]",
                    key: key,
                    childIndex: index
                }
            ));

            if (node.keys.length <= 3) {
                return null;
            }

            const right = createNode(true);

            right.keys = node.keys.splice(2);

            const separator = right.keys[0];

            steps.push(makeStep(
                holder.root,
                [node.id, right.id],
                "Split Leaf",
                "Split the leaf and copy separator " +
                    separator +
                    " to the parent.",
                "/* bplus split leaf */",
                {
                    key: separator
                }
            ));

            return {
                separator: separator,
                right: right
            };
        }

        let index = 0;

        while (
            index < node.keys.length &&
            key >= node.keys[index]
        ) {
            index += 1;
        }

        steps.push(makeStep(
            holder.root,
            [node.id, node.children[index].id],
            "Choose Child",
            "Separator search selects child " +
                index +
                ".",
            "/* bplus choose child */",
            {
                current:
                    "[" + node.keys.join(", ") + "]",
                key: key,
                childIndex: index
            }
        ));

        const split = insertBPlusRecursive(
            holder,
            node.children[index],
            key,
            steps
        );

        if (!split) {
            return null;
        }

        node.keys.splice(
            index,
            0,
            split.separator
        );

        node.children.splice(
            index + 1,
            0,
            split.right
        );

        if (node.keys.length <= 3) {
            return null;
        }

        const middle = 2;
        const promoted = node.keys[middle];
        const right = createNode(false);

        right.keys =
            node.keys.slice(middle + 1);

        right.children =
            node.children.slice(middle + 1);

        node.keys =
            node.keys.slice(0, middle);

        node.children =
            node.children.slice(0, middle + 1);

        steps.push(makeStep(
            holder.root,
            [node.id, right.id],
            "Split Internal Node",
            "Promote internal separator " +
                promoted +
                ".",
            "/* bplus split internal */",
            {
                key: promoted
            }
        ));

        return {
            separator: promoted,
            right: right
        };
    }

    function insertBPlus(holder, key, steps) {
        if (containsBPlus(holder.root, key)) {
            steps.push(makeStep(
                holder.root,
                [holder.root.id],
                "Duplicate Ignored",
                "Key " +
                    key +
                    " is already stored in a leaf.",
                "/* bplus insert call */",
                {
                    key: key,
                    result: "Already stored"
                }
            ));

            return;
        }

        steps.push(makeStep(
            holder.root,
            [holder.root.id],
            "Insert Key",
            "Insert " +
                key +
                " into the B+ Tree.",
            "/* bplus insert call */",
            {
                key: key
            }
        ));

        const split = insertBPlusRecursive(
            holder,
            holder.root,
            key,
            steps
        );

        if (split) {
            const oldRoot = holder.root;
            const newRoot = createNode(false);

            newRoot.keys = [split.separator];
            newRoot.children = [
                oldRoot,
                split.right
            ];

            holder.root = newRoot;

            steps.push(makeStep(
                holder.root,
                [
                    newRoot.id,
                    oldRoot.id,
                    split.right.id
                ],
                "Create New Root",
                "Create a new B+ root containing separator " +
                    split.separator +
                    ".",
                "/* bplus new root */",
                {
                    key: split.separator
                }
            ));
        }
    }

    function findBPlusLeaf(root, key, steps) {
        let node = root;

        while (!node.leaf) {
            let index = 0;

            steps.push(makeStep(
                root,
                [node.id],
                "Scan Separators",
                "Use routing keys [" +
                    node.keys.join(", ") +
                    "].",
                "/* bplus search loop */",
                {
                    current:
                        "[" + node.keys.join(", ") + "]",
                    key: key
                }
            ));

            while (
                index < node.keys.length &&
                key >= node.keys[index]
            ) {
                index += 1;
            }

            steps.push(makeStep(
                root,
                [node.id, node.children[index].id],
                "Descend",
                "Follow B+ child interval " +
                    index +
                    ".",
                "/* bplus choose child */",
                {
                    key: key,
                    childIndex: index
                }
            ));

            node = node.children[index];
        }

        return node;
    }

    function leafNodes(root) {
        const leaves = [];

        function visit(node) {
            if (node.leaf) {
                leaves.push(node);
                return;
            }

            node.children.forEach(visit);
        }

        visit(root);

        return leaves;
    }

    function containsBPlus(root, key) {
        let node = root;

        while (!node.leaf) {
            let index = 0;

            while (
                index < node.keys.length &&
                key >= node.keys[index]
            ) {
                index += 1;
            }

            node = node.children[index];
        }

        return node.keys.indexOf(key) !== -1;
    }

    function searchBPlusSteps(root, key, steps) {
        const leaf =
            findBPlusLeaf(root, key, steps);

        const found =
            leaf.keys.indexOf(key) !== -1;

        steps.push(makeStep(
            root,
            [leaf.id],
            found
                ? "Record Found"
                : "Not Found",
            found
                ? "Confirm key " +
                    key +
                    " in the leaf."
                : "The target leaf does not contain " +
                    key +
                    ".",
            "/* bplus search result */",
            {
                current:
                    "[" + leaf.keys.join(", ") + "]",
                key: key,
                result: found
                    ? "Found"
                    : "Not found"
            }
        ));

        return found;
    }

    function rangeBPlusSteps(
        root,
        low,
        high,
        steps
    ) {
        const startLeaf =
            findBPlusLeaf(root, low, steps);

        const leaves = leafNodes(root);

        let leafIndex =
            leaves.indexOf(startLeaf);

        const output = [];

        steps.push(makeStep(
            root,
            [startLeaf.id],
            "Begin Range",
            "Begin scanning leaves for [" +
                low +
                ", " +
                high +
                "].",
            "/* bplus range call */",
            {
                key: low
            }
        ));

        while (leafIndex < leaves.length) {
            const leaf = leaves[leafIndex];

            steps.push(makeStep(
                root,
                [leaf.id],
                "Scan Leaf",
                "Scan linked leaf [" +
                    leaf.keys.join(", ") +
                    "].",
                "/* bplus range output */",
                {
                    current:
                        "[" + leaf.keys.join(", ") + "]",
                    result:
                        output.length
                            ? output.join(", ")
                            : "—"
                }
            ));

            for (
                let index = 0;
                index < leaf.keys.length;
                index += 1
            ) {
                const value = leaf.keys[index];

                if (value > high) {
                    return output;
                }

                if (value >= low) {
                    output.push(value);

                    steps.push(makeStep(
                        root,
                        [leaf.id],
                        "Output Record",
                        "Output " +
                            value +
                            " from the range.",
                        "/* bplus range output */",
                        {
                            key: value,
                            childIndex: index,
                            result: output.join(", ")
                        }
                    ));
                }
            }

            leafIndex += 1;
        }

        return output;
    }

    function buildBPlusOperationSteps(
        values,
        query,
        operation
    ) {
        nodeCounter = 0;

        const holder = {
            root: createNode(true)
        };

        const steps = [
            makeStep(
                holder.root,
                [holder.root.id],
                "Create Root",
                "Create an empty B+ leaf root.",
                "/* bplus create root */",
                {
                    current: "root"
                }
            )
        ];

        values.forEach(function (value) {
            insertBPlus(holder, value, steps);
        });

        if (operation === "build") {
            return pushComplete(
                steps,
                holder.root,
                "B+ Tree",
                "Build",
                values.length + " records stored"
            );
        }

        if (operation === "insert") {
            const existed =
                containsBPlus(holder.root, query);

            insertBPlus(holder, query, steps);

            return pushComplete(
                steps,
                holder.root,
                "B+ Tree",
                "Insertion",
                existed
                    ? "Already stored"
                    : "Inserted " + query
            );
        }

        if (operation === "search") {
            const found = searchBPlusSteps(
                holder.root,
                query,
                steps
            );

            return pushComplete(
                steps,
                holder.root,
                "B+ Tree",
                "Search",
                found ? "Found" : "Not found"
            );
        }

        if (operation === "range") {
            const output = rangeBPlusSteps(
                holder.root,
                query.low,
                query.high,
                steps
            );

            return pushComplete(
                steps,
                holder.root,
                "B+ Tree",
                "Range Search",
                output.length
                    ? output.join(", ")
                    : "No keys in range"
            );
        }

        const leaves = leafNodes(holder.root);
        const output = [];

        leaves.forEach(function (leaf) {
            Array.prototype.push.apply(
                output,
                leaf.keys
            );

            steps.push(makeStep(
                holder.root,
                [leaf.id],
                "Scan Linked Leaf",
                "Read leaf [" +
                    leaf.keys.join(", ") +
                    "] and continue right.",
                "/* bplus range output */",
                {
                    current:
                        "[" + leaf.keys.join(", ") + "]",
                    result: output.join(", ")
                }
            ));
        });

        return pushComplete(
            steps,
            holder.root,
            "B+ Tree",
            "Leaf Scan",
            output.join(", ")
        );
    }

    const definitions = {
        btree: {
            label: "B-Tree (t = 2)",
            codeKey: "btree",
            exampleData:
                "10, 20, 5, 6, 12, 30, 7, 17",
            defaultOperation: "search",
            exampleQuery: "17"
        },
        bplus: {
            label: "B+ Tree (order 4)",
            codeKey: "bplus",
            exampleData:
                "5, 10, 15, 20, 25, 30, 35, 40",
            defaultOperation: "search",
            exampleQuery: "25"
        },
        "two-three": {
            label: "2–3 Tree",
            codeKey: "two-three",
            exampleData:
                "20, 10, 30, 5, 15, 25, 35, 12",
            defaultOperation: "search",
            exampleQuery: "25"
        },
        "two-three-four": {
            label: "2–3–4 Tree",
            codeKey: "btree",
            exampleData:
                "40, 20, 60, 10, 30, 50, 70, 25",
            defaultOperation: "search",
            exampleQuery: "50"
        }
    };

    const operationDefinitions = {
        btree: [
            {
                value: "build",
                label: "Build Tree",
                queryLabel: "No key required",
                example: "",
                queryRequired: false
            },
            {
                value: "insert",
                label: "Insert Key",
                queryLabel: "Key to Insert",
                example: "25",
                queryRequired: true
            },
            {
                value: "search",
                label: "Search Key",
                queryLabel: "Search Key",
                example: "17",
                queryRequired: true
            },
            {
                value: "delete",
                label: "Delete Key",
                queryLabel: "Key to Delete",
                example: "6",
                queryRequired: true
            },
            {
                value: "traverse",
                label: "Sorted Traversal",
                queryLabel: "No key required",
                example: "",
                queryRequired: false
            }
        ],
        bplus: [
            {
                value: "build",
                label: "Build Tree",
                queryLabel: "No key required",
                example: "",
                queryRequired: false
            },
            {
                value: "insert",
                label: "Insert Key",
                queryLabel: "Key to Insert",
                example: "22",
                queryRequired: true
            },
            {
                value: "search",
                label: "Search Key",
                queryLabel: "Search Key",
                example: "25",
                queryRequired: true
            },
            {
                value: "range",
                label: "Range Search",
                queryLabel: "Low, High",
                example: "12, 32",
                queryRequired: true
            },
            {
                value: "leaf-scan",
                label: "Linked Leaf Scan",
                queryLabel: "No key required",
                example: "",
                queryRequired: false
            }
        ],
        "two-three": [
            {
                value: "build",
                label: "Build Tree",
                queryLabel: "No key required",
                example: "",
                queryRequired: false
            },
            {
                value: "insert",
                label: "Insert Key",
                queryLabel: "Key to Insert",
                example: "18",
                queryRequired: true
            },
            {
                value: "search",
                label: "Search Key",
                queryLabel: "Search Key",
                example: "25",
                queryRequired: true
            },
            {
                value: "traverse",
                label: "Sorted Traversal",
                queryLabel: "No key required",
                example: "",
                queryRequired: false
            }
        ],
        "two-three-four": [
            {
                value: "build",
                label: "Build Tree",
                queryLabel: "No key required",
                example: "",
                queryRequired: false
            },
            {
                value: "insert",
                label: "Insert Key",
                queryLabel: "Key to Insert",
                example: "65",
                queryRequired: true
            },
            {
                value: "search",
                label: "Search Key",
                queryLabel: "Search Key",
                example: "50",
                queryRequired: true
            },
            {
                value: "delete",
                label: "Delete Key",
                queryLabel: "Key to Delete",
                example: "20",
                queryRequired: true
            },
            {
                value: "traverse",
                label: "Sorted Traversal",
                queryLabel: "No key required",
                example: "",
                queryRequired: false
            }
        ]
    };

    function getOperation(structure, operation) {
        const options =
            operationDefinitions[structure];

        return options.find(function (item) {
            return item.value === operation;
        }) || options[0];
    }

    function populateOperations(
        select,
        structure,
        selected
    ) {
        select.innerHTML = "";

        operationDefinitions[structure].forEach(
            function (item) {
                const option =
                    document.createElement("option");

                option.value = item.value;
                option.textContent = item.label;

                select.appendChild(option);
            }
        );

        select.value =
            selected ||
            definitions[structure].defaultOperation;
    }

    function parseInputs(
        structure,
        dataInput,
        queryInput,
        operation
    ) {
        const values = dataInput.value
            .trim()
            .split(/[\s,]+/)
            .filter(Boolean)
            .map(Number);

        if (
            values.length < 3 ||
            values.length > 12 ||
            values.some(function (value) {
                return (
                    !Number.isInteger(value) ||
                    value < -99 ||
                    value > 999
                );
            })
        ) {
            throw new Error(
                "Enter 3 to 12 distinct integers from -99 to 999."
            );
        }

        if (
            new Set(values).size !== values.length
        ) {
            throw new Error("Use distinct keys.");
        }

        dataInput.value = values.join(", ");

        const item =
            getOperation(structure, operation);

        if (!item.queryRequired) {
            return {
                data: values,
                query: null
            };
        }

        if (operation === "range") {
            const bounds = queryInput.value
                .trim()
                .split(/[\s,]+/)
                .filter(Boolean)
                .map(Number);

            if (
                bounds.length !== 2 ||
                bounds.some(function (value) {
                    return !Number.isInteger(value);
                }) ||
                bounds[0] > bounds[1]
            ) {
                throw new Error(
                    "Enter the range as two integers: low, high."
                );
            }

            queryInput.value =
                bounds[0] + ", " + bounds[1];

            return {
                data: values,
                query: {
                    low: bounds[0],
                    high: bounds[1]
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
        if (structure === "bplus") {
            return buildBPlusOperationSteps(
                data,
                query,
                operation
            );
        }

        if (structure === "two-three") {
            return buildTwoThreeOperationSteps(
                data,
                query,
                operation
            );
        }

        return buildBTreeOperationSteps(
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

    function renderMultiwayTree(
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
            const childItems =
                node.children.map(function (child) {
                    const item =
                        layout(child, depth + 1);

                    edges.push({
                        parent: null,
                        child: item,
                        parentNode: node
                    });

                    return item;
                });

            let slot;

            if (!childItems.length) {
                slot = leafSlot;
                leafSlot += 1;
            } else {
                slot = childItems.reduce(
                    function (sum, item) {
                        return sum + item.slot;
                    },
                    0
                ) / childItems.length;
            }

            const item = {
                node: node,
                depth: depth,
                slot: slot,
                children: childItems
            };

            items.push(item);

            childItems.forEach(function (childItem) {
                const edge = edges.find(
                    function (candidate) {
                        return (
                            candidate.parent === null &&
                            candidate.child === childItem &&
                            candidate.parentNode === node
                        );
                    }
                );

                if (edge) {
                    edge.parent = item;
                }
            });

            return item;
        }

        layout(root, 0);

        const width = Math.max(
            900,
            Math.max(1, leafSlot) * 145
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
            220,
            100 + maxDepth * 105
        );

        items.forEach(function (item) {
            item.x = leafSlot <= 1
                ? width / 2
                : 70 +
                    item.slot *
                    (
                        (width - 140) /
                        (leafSlot - 1)
                    );

            item.y = 45 + item.depth * 105;

            item.width = Math.max(
                58,
                item.node.keys.length * 46 + 12
            );
        });

        edges.forEach(function (edge) {
            if (!edge.parent) { return; }

            svg.appendChild(svgElement("line", {
                x1: edge.parent.x,
                y1: edge.parent.y + 25,
                x2: edge.child.x,
                y2: edge.child.y - 25,
                stroke: "#94a3b8",
                "stroke-width": "2.5"
            }));
        });

        const colors = {
            btree: {
                fill: "#1d4ed8",
                light: "#dbeafe",
                stroke: "#93c5fd"
            },
            bplus: {
                fill: "#0f766e",
                light: "#ccfbf1",
                stroke: "#5eead4"
            },
            "two-three": {
                fill: "#7c3aed",
                light: "#ede9fe",
                stroke: "#c4b5fd"
            },
            "two-three-four": {
                fill: "#c2410c",
                light: "#ffedd5",
                stroke: "#fdba74"
            }
        };

        const palette = colors[structure];

        items.forEach(function (item) {
            const selected =
                active.indexOf(item.node.id) !== -1;

            const group = svgElement("g", {});

            group.appendChild(svgElement("rect", {
                x: item.x - item.width / 2,
                y: item.y - 25,
                width: item.width,
                height: "50",
                rx: "10",
                fill: selected
                    ? "#f59e0b"
                    : palette.fill,
                stroke: selected
                    ? "#fde68a"
                    : palette.stroke,
                "stroke-width": selected
                    ? "4"
                    : "2.5"
            }));

            if (!item.node.keys.length) {
                const empty = svgElement("text", {
                    x: item.x,
                    y: item.y + 6,
                    fill: "#ffffff",
                    "text-anchor": "middle",
                    "font-size": "18",
                    "font-weight": "800"
                });

                empty.textContent = "∅";
                group.appendChild(empty);
            } else {
                const start =
                    item.x -
                    (
                        item.node.keys.length *
                        46
                    ) / 2;

                item.node.keys.forEach(
                    function (key, index) {
                        if (index > 0) {
                            group.appendChild(
                                svgElement("line", {
                                    x1:
                                        start +
                                        index * 46,
                                    y1: item.y - 22 -,
                                    x2:
                                        start +
                                        index * 46,
                                    y2: item.y + 22,
                                    stroke:
                                        "rgba(255,255,255,0.55)",
                                    "stroke-width":
                                        "1.5"
                                })
                            );
                        }

                        const text = svgElement(
                            "text",
                            {
                                x:
                                    start +
                                    index * 46 +
                                    23,
                                y: item.y + 6,
                                fill: "#ffffff",
                                "text-anchor":
                                    "middle",
                                "font-size": "15",
                                "font-weight": "850"
                            }
                        );

                        text.textContent =
                            String(key);

                        group.appendChild(text);
                    }
                );
            }

            if (
                structure === "bplus" &&
                item.node.leaf
            ) {
                const badge = svgElement("text", {
                    x: item.x,
                    y: item.y + 42,
                    fill: "#0f766e",
                    "text-anchor": "middle",
                    "font-size": "12",
                    "font-weight": "800"
                });

                badge.textContent = "LEAF";
                group.appendChild(badge);
            }

            svg.appendChild(group);
        });

        if (structure === "bplus") {
            const leaves = items
                .filter(function (item) {
                    return item.node.leaf;
                })
                .sort(function (first, second) {
                    return first.x - second.x;
                });

            for (
                let index = 0;
                index < leaves.length - 1;
                index += 1
            ) {
                svg.appendChild(svgElement("line", {
                    x1:
                        leaves[index].x +
                        leaves[index].width / 2,
                    y1: leaves[index].y + 32,
                    x2:
                        leaves[index + 1].x -
                        leaves[index + 1].width / 2,
                    y2:
                        leaves[index + 1].y + 32,
                    stroke: "#0f766e",
                    "stroke-width": "2",
                    "stroke-dasharray": "6 5"
                }));
            }
        }

        svg.setAttribute(
            "viewBox",
            "0 0 " + width + " " + height
        );

        svg.style.height =
            Math.min(410, height) + "px";
    }

    const visualizer = {
        structure:
            document.getElementById(
                "multiwayStructure"
            ),
        operation:
            document.getElementById(
                "multiwayOperation"
            ),
        data:
            document.getElementById(
                "multiwayDataInput"
            ),
        query:
            document.getElementById(
                "multiwayQueryInput"
            ),
        queryLabel:
            document.getElementById(
                "multiwayQueryLabel"
            ),
        load:
            document.getElementById(
                "loadMultiwayVisualizer"
            ),
        prompt:
            document.getElementById(
                "multiwayPrompt"
            ),
        result:
            document.getElementById(
                "multiwayResult"
            ),
        svg:
            document.getElementById(
                "multiwayTreeSvg"
            ),
        message:
            document.getElementById(
                "multiwayMessage"
            ),
        structureValue:
            document.getElementById(
                "multiwayStructureValue"
            ),
        operationValue:
            document.getElementById(
                "multiwayOperationValue"
            ),
        phase:
            document.getElementById(
                "multiwayPhase"
            ),
        height:
            document.getElementById(
                "multiwayHeight"
            ),
        nodes:
            document.getElementById(
                "multiwayNodes"
            ),
        resultValue:
            document.getElementById(
                "multiwayResultValue"
            ),
        progress:
            document.getElementById(
                "multiwayProgress"
            ),
        status:
            document.getElementById(
                "multiwayStatus"
            ),
        previous:
            document.getElementById(
                "multiwayPrevious"
            ),
        next:
            document.getElementById(
                "multiwayNext"
            ),
        auto:
            document.getElementById(
                "multiwayAuto"
            ),
        pause:
            document.getElementById(
                "multiwayPause"
            ),
        reset:
            document.getElementById(
                "multiwayReset"
            )
    };

    let visualSteps = [];
    let visualIndex = 0;
    let visualTimer = null;

    function stopVisual() {
        if (visualTimer !== null) {
            window.clearInterval(visualTimer);
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
        if (!visualSteps.length) { return; }

        const step = visualSteps[visualIndex];

        renderMultiwayTree(
            visualizer.svg,
            step.tree,
            step.active,
            visualizer.structure.value
        );

        visualizer.message.textContent =
            step.message;

        visualizer.structureValue.textContent =
            definitions[
                visualizer.structure.value
            ].label;

        visualizer.operationValue.textContent =
            getOperation(
                visualizer.structure.value,
                visualizer.operation.value
            ).label;

        visualizer.phase.textContent =
            step.phase;

        visualizer.height.textContent =
            String(step.height);

        visualizer.nodes.textContent =
            String(step.nodes);

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

    function changeVisualOperation(useExample) {
        const item = getOperation(
            visualizer.structure.value,
            visualizer.operation.value
        );

        if (useExample !== false) {
            visualizer.query.value =
                item.example;
        }

        visualizer.query.disabled =
            !item.queryRequired;

        visualizer.queryLabel.firstChild.textContent =
            item.queryLabel;

        invalidateVisual();
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
            definition.defaultOperation
        );

        changeVisualOperation(true);
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

    if (visualizer.load) {
        populateOperations(
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

        visualizer.structure.addEventListener(
            "change",
            changeVisualStructure
        );

        visualizer.operation.addEventListener(
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
                "[data-multiway-example]"
            )
            .forEach(function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        visualizer.structure.value =
                            button.dataset
                                .multiwayExample;

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
                "multiwayTraceStructure"
            ),
        data:
            document.getElementById(
                "multiwayTraceData"
            ),
        query:
            document.getElementById(
                "multiwayTraceQuery"
            ),
        queryLabel:
            document.getElementById(
                "multiwayTraceQueryLabel"
            ),
        load:
            document.getElementById(
                "loadMultiwayTracer"
            ),
        prompt:
            document.getElementById(
                "multiwayTracePrompt"
            ),
        result:
            document.getElementById(
                "multiwayTraceResult"
            ),
        title:
            document.getElementById(
                "multiwayTraceTitle"
            ),
        codeWindow:
            document.getElementById(
                "multiwayTraceCodeWindow"
            ),
        code:
            document.getElementById(
                "multiwayTraceCode"
            ),
        message:
            document.getElementById(
                "multiwayTraceMessage"
            ),
        variables:
            document.getElementById(
                "multiwayTraceVariables"
            ),
        svg:
            document.getElementById(
                "multiwayTraceSvg"
            ),
        output:
            document.getElementById(
                "multiwayTraceOutput"
            ),
        status:
            document.getElementById(
                "multiwayTraceStatus"
            ),
        previous:
            document.getElementById(
                "multiwayTracePrevious"
            ),
        next:
            document.getElementById(
                "multiwayTraceNext"
            ),
        auto:
            document.getElementById(
                "multiwayTraceAuto"
            ),
        pause:
            document.getElementById(
                "multiwayTracePause"
            ),
        reset:
            document.getElementById(
                "multiwayTraceReset"
            )
    };

    let traceSteps = [];
    let traceIndex = 0;
    let traceTimer = null;
    let traceLookupLines = [];
    let activeTraceDefinition = null;

    function stopTrace() {
        if (traceTimer !== null) {
            window.clearInterval(traceTimer);
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
                "The selected C program could not be found."
            );
        }

        const text = source.textContent
            .replace(/\r/g, "")
            .replace(/^\n+|\n+$/g, "");

        traceLookupLines = text.split("\n");
        tracer.code.innerHTML = "";

        traceLookupLines.forEach(
            function (sourceLine, index) {
                const line = sourceLine
                    .replace(
                        /\s*\/\*\s*(?:btree|bplus|tt|multiway)[^*]*\*\//g,
                        ""
                    )
                    .replace(/\s+$/g, "");

                const row =
                    document.createElement("span");

                row.dataset.multiwayTraceLine =
                    String(index + 1);

                row.textContent =
                    String(index + 1).padStart(
                        3,
                        "0"
                    ) +
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

            return Object.assign({}, step, {
                line:
                    line > 0
                        ? line
                        : previous
            });
        });
    }

    function appendVariable(label, value) {
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
        if (!traceSteps.length) { return; }

        const step = traceSteps[traceIndex];
        let activeLine = null;

        tracer.code
            .querySelectorAll(
                "[data-multiway-trace-line]"
            )
            .forEach(function (line) {
                const active =
                    Number(
                        line.dataset
                            .multiwayTraceLine
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
            activeTraceDefinition.label
        );

        appendVariable("Phase", step.phase);

        appendVariable(
            "Current Node",
            step.current
        );

        appendVariable(
            "Target Key",
            step.key
        );

        appendVariable(
            "Child / Position",
            step.childIndex
        );

        appendVariable(
            "Height",
            step.height
        );

        appendVariable(
            "Nodes",
            step.nodes
        );

        renderMultiwayTree(
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
                tracer.codeWindow.clientHeight / 2 +
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
                tracer.query,
                definition.defaultOperation
            );

            loadCode(definition);

            traceSteps = decorate(
                buildSteps(
                    tracer.structure.value,
                    parsed.data,
                    parsed.query,
                    definition.defaultOperation
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

        tracer.query.disabled = false;

        tracer.queryLabel.firstChild.textContent =
            "Search Key";

        invalidateTrace();
    }

    if (tracer.load) {
        tracer.load.addEventListener(
            "click",
            loadTrace
        );

        tracer.structure.addEventListener(
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
