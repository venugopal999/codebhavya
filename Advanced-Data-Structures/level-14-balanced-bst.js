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

        const target = document.getElementById(button.dataset.toggleTarget);
        if (!target) { return; }

        const open = target.hidden;
        target.hidden = !open;
        button.setAttribute("aria-expanded", String(open));
        button.textContent = open
            ? (target.classList.contains("ads-hint-box")
                ? "Hide Hint"
                : "Hide Answer")
            : button.dataset.originalLabel;
    });

    function height(node) {
        return node ? node.height || 1 : 0;
    }

    function updateHeight(node) {
        if (node) {
            node.height = 1 + Math.max(height(node.left), height(node.right));
        }
    }

    function snapshot(node) {
        if (!node) { return null; }

        return {
            key: node.key,
            height: node.height || 1,
            color: node.color || "BLUE",
            left: snapshot(node.left),
            right: snapshot(node.right)
        };
    }

    function treeHeight(node) {
        return node
            ? 1 + Math.max(treeHeight(node.left), treeHeight(node.right))
            : 0;
    }

    function makeStep(
        root,
        active,
        phase,
        message,
        rotations,
        current,
        inserted,
        needle,
        complete
    ) {
        return {
            tree: snapshot(root),
            active: (active || []).slice(),
            phase: phase,
            message: message,
            rotations: rotations,
            current: typeof current === "number" ? current : null,
            inserted: typeof inserted === "number" ? inserted : null,
            needle: needle,
            complete: Boolean(complete)
        };
    }

    function buildAVLSteps(values) {
        let root = null;
        let rotations = 0;
        const steps = [];

        function node(key) {
            return {
                key: key,
                height: 1,
                color: "BLUE",
                left: null,
                right: null
            };
        }

        function rotateRight(oldRoot) {
            const newRoot = oldRoot.left;
            oldRoot.left = newRoot.right;
            newRoot.right = oldRoot;

            updateHeight(oldRoot);
            updateHeight(newRoot);

            rotations += 1;
            return newRoot;
        }

        function rotateLeft(oldRoot) {
            const newRoot = oldRoot.right;
            oldRoot.right = newRoot.left;
            newRoot.left = oldRoot;

            updateHeight(oldRoot);
            updateHeight(newRoot);

            rotations += 1;
            return newRoot;
        }

        function locateParent(target) {
            let result = null;

            function visit(current) {
                if (!current || result) { return; }

                if (current.left === target) {
                    result = { node: current, side: "left" };
                    return;
                }

                if (current.right === target) {
                    result = { node: current, side: "right" };
                    return;
                }

                visit(current.left);
                visit(current.right);
            }

            if (root !== target) {
                visit(root);
            }

            return result;
        }

        function attachRotation(oldRoot, newRoot, parentInfo) {
            if (!parentInfo) {
                root = newRoot;
            } else {
                parentInfo.node[parentInfo.side] = newRoot;
            }

            return newRoot;
        }

        function insert(currentRoot, key) {
            if (!currentRoot) {
                const created = node(key);

                steps.push(makeStep(
                    root || created,
                    [key],
                    "Create Node",
                    "Create leaf node " + key + " with height 1.",
                    rotations,
                    key,
                    key,
                    "/* avl create */"
                ));

                return created;
            }

            if (key < currentRoot.key) {
                steps.push(makeStep(
                    root,
                    [currentRoot.key],
                    "Compare",
                    key + " < " + currentRoot.key +
                        ", so continue in the left subtree.",
                    rotations,
                    currentRoot.key,
                    key,
                    "/* avl go left */"
                ));

                currentRoot.left = insert(currentRoot.left, key);
            } else {
                steps.push(makeStep(
                    root,
                    [currentRoot.key],
                    "Compare",
                    key + " > " + currentRoot.key +
                        ", so continue in the right subtree.",
                    rotations,
                    currentRoot.key,
                    key,
                    "/* avl go right */"
                ));

                currentRoot.right = insert(currentRoot.right, key);
            }

            updateHeight(currentRoot);

            steps.push(makeStep(
                root || currentRoot,
                [currentRoot.key],
                "Update Height",
                "Update height of " + currentRoot.key +
                    " to " + currentRoot.height + ".",
                rotations,
                currentRoot.key,
                key,
                "/* avl update height */"
            ));

            const balance =
                height(currentRoot.left) - height(currentRoot.right);

            steps.push(makeStep(
                root || currentRoot,
                [currentRoot.key],
                "Check Balance",
                "Balance factor of " + currentRoot.key +
                    " is " + balance + ".",
                rotations,
                currentRoot.key,
                key,
                "/* avl balance */"
            ));

            if (balance > 1 && key < currentRoot.left.key) {
                const parentInfo = locateParent(currentRoot);
                const result = attachRotation(
                    currentRoot,
                    rotateRight(currentRoot),
                    parentInfo
                );

                steps.push(makeStep(
                    root,
                    [result.key],
                    "LL Rotation",
                    "LL imbalance: perform one right rotation. " +
                        "New subtree root is " + result.key + ".",
                    rotations,
                    result.key,
                    key,
                    "/* avl LL */"
                ));

                return result;
            }

            if (balance < -1 && key > currentRoot.right.key) {
                const parentInfo = locateParent(currentRoot);
                const result = attachRotation(
                    currentRoot,
                    rotateLeft(currentRoot),
                    parentInfo
                );

                steps.push(makeStep(
                    root,
                    [result.key],
                    "RR Rotation",
                    "RR imbalance: perform one left rotation. " +
                        "New subtree root is " + result.key + ".",
                    rotations,
                    result.key,
                    key,
                    "/* avl RR */"
                ));

                return result;
            }

            if (balance > 1 && key > currentRoot.left.key) {
                const parentInfo = locateParent(currentRoot);

                currentRoot.left = rotateLeft(currentRoot.left);

                const result = attachRotation(
                    currentRoot,
                    rotateRight(currentRoot),
                    parentInfo
                );

                steps.push(makeStep(
                    root,
                    [result.key],
                    "LR Rotation",
                    "LR imbalance: rotate the child left, " +
                        "then rotate the node right.",
                    rotations,
                    result.key,
                    key,
                    "/* avl LR */"
                ));

                return result;
            }

            if (balance < -1 && key < currentRoot.right.key) {
                const parentInfo = locateParent(currentRoot);

                currentRoot.right = rotateRight(currentRoot.right);

                const result = attachRotation(
                    currentRoot,
                    rotateLeft(currentRoot),
                    parentInfo
                );

                steps.push(makeStep(
                    root,
                    [result.key],
                    "RL Rotation",
                    "RL imbalance: rotate the child right, " +
                        "then rotate the node left.",
                    rotations,
                    result.key,
                    key,
                    "/* avl RL */"
                ));

                return result;
            }

            return currentRoot;
        }

        values.forEach(function (key) {
            steps.push(makeStep(
                root,
                [],
                "Insert",
                "Insert " + key +
                    " using BST order, then restore AVL balance.",
                rotations,
                null,
                key,
                "/* avl insert call */"
            ));

            root = insert(root, key);

            steps.push(makeStep(
                root,
                [key],
                "Insertion Complete",
                key + " is inserted; control returns to the " +
                    "for-loop condition before the next key.",
                rotations,
                key,
                key,
                "for (int i = 0; i < n; i++)"
            ));
        });

        steps.push(makeStep(
            root,
            root ? [root.key] : [],
            "Complete",
            "AVL construction complete. Every node has balance " +
                "factor −1, 0 or 1.",
            rotations,
            root ? root.key : null,
            null,
            "preorder(root);",
            true
        ));

        return steps;
    }

    function rbNode(key) {
        return {
            key: key,
            color: "RED",
            height: 1,
            left: null,
            right: null,
            parent: null
        };
    }

    function rbRotateLeft(state, pivot) {
        const child = pivot.right;

        pivot.right = child.left;

        if (child.left) {
            child.left.parent = pivot;
        }

        child.parent = pivot.parent;

        if (!pivot.parent) {
            state.root = child;
        } else if (pivot === pivot.parent.left) {
            pivot.parent.left = child;
        } else {
            pivot.parent.right = child;
        }

        child.left = pivot;
        pivot.parent = child;
        state.rotations += 1;
    }

    function rbRotateRight(state, pivot) {
        const child = pivot.left;

        pivot.left = child.right;

        if (child.right) {
            child.right.parent = pivot;
        }

        child.parent = pivot.parent;

        if (!pivot.parent) {
            state.root = child;
        } else if (pivot === pivot.parent.left) {
            pivot.parent.left = child;
        } else {
            pivot.parent.right = child;
        }

        child.right = pivot;
        pivot.parent = child;
        state.rotations += 1;
    }

    function buildRedBlackSteps(values) {
        const state = {
            root: null,
            rotations: 0
        };

        const steps = [];

        values.forEach(function (key) {
            steps.push(makeStep(
                state.root,
                [],
                "Insert",
                "Insert " + key + " as a red BST node.",
                state.rotations,
                null,
                key,
                "/* rb insert call */"
            ));

            let parent = null;
            let current = state.root;

            while (current) {
                parent = current;

                steps.push(makeStep(
                    state.root,
                    [current.key],
                    "BST Compare",
                    key + (key < current.key ? " < " : " > ") +
                        current.key + ".",
                    state.rotations,
                    current.key,
                    key,
                    "/* rb compare */"
                ));

                current = key < current.key
                    ? current.left
                    : current.right;
            }

            const inserted = rbNode(key);
            inserted.parent = parent;

            if (!parent) {
                state.root = inserted;
            } else if (key < parent.key) {
                parent.left = inserted;
            } else {
                parent.right = inserted;
            }

            steps.push(makeStep(
                state.root,
                [key],
                "Create Red Node",
                "Attach " + key + " as red. Red avoids changing " +
                    "every black-height immediately.",
                state.rotations,
                key,
                key,
                "/* rb new red */"
            ));

            let node = inserted;

            while (
                node !== state.root &&
                node.parent.color === "RED"
            ) {
                const parentNode = node.parent;
                const grand = parentNode.parent;

                steps.push(makeStep(
                    state.root,
                    [node.key, parentNode.key, grand.key],
                    "Fix Red–Red",
                    "Node " + node.key + " and parent " +
                        parentNode.key + " are both red.",
                    state.rotations,
                    node.key,
                    key,
                    "/* rb fix loop */"
                ));

                if (parentNode === grand.left) {
                    const uncle = grand.right;

                    if (uncle && uncle.color === "RED") {
                        parentNode.color = "BLACK";
                        uncle.color = "BLACK";
                        grand.color = "RED";
                        node = grand;

                        steps.push(makeStep(
                            state.root,
                            [parentNode.key, uncle.key, grand.key],
                            "Recolour",
                            "Parent and uncle become black; " +
                                "grandparent becomes red.",
                            state.rotations,
                            grand.key,
                            key,
                            "/* rb recolor left */"
                        ));
                    } else {
                        if (node === parentNode.right) {
                            node = parentNode;
                            rbRotateLeft(state, node);

                            steps.push(makeStep(
                                state.root,
                                [node.key],
                                "Inner Rotation",
                                "Convert the LR shape to an LL shape " +
                                    "with a left rotation.",
                                state.rotations,
                                node.key,
                                key,
                                "/* rb inner left */"
                            ));
                        }

                        const newParent = node.parent;
                        const newGrand = newParent.parent;

                        newParent.color = "BLACK";
                        newGrand.color = "RED";
                        rbRotateRight(state, newGrand);

                        steps.push(makeStep(
                            state.root,
                            [newParent.key],
                            "Outer Rotation",
                            "Recolour and rotate right around " +
                                "the grandparent.",
                            state.rotations,
                            newParent.key,
                            key,
                            "/* rb outer left */"
                        ));
                    }
                } else {
                    const uncle = grand.left;

                    if (uncle && uncle.color === "RED") {
                        parentNode.color = "BLACK";
                        uncle.color = "BLACK";
                        grand.color = "RED";
                        node = grand;

                        steps.push(makeStep(
                            state.root,
                            [parentNode.key, uncle.key, grand.key],
                            "Recolour",
                            "Parent and uncle become black; " +
                                "grandparent becomes red.",
                            state.rotations,
                            grand.key,
                            key,
                            "/* rb recolor right */"
                        ));
                    } else {
                        if (node === parentNode.left) {
                            node = parentNode;
                            rbRotateRight(state, node);

                            steps.push(makeStep(
                                state.root,
                                [node.key],
                                "Inner Rotation",
                                "Convert the RL shape to an RR shape " +
                                    "with a right rotation.",
                                state.rotations,
                                node.key,
                                key,
                                "/* rb inner right */"
                            ));
                        }

                        const newParent = node.parent;
                        const newGrand = newParent.parent;

                        newParent.color = "BLACK";
                        newGrand.color = "RED";
                        rbRotateLeft(state, newGrand);

                        steps.push(makeStep(
                            state.root,
                            [newParent.key],
                            "Outer Rotation",
                            "Recolour and rotate left around " +
                                "the grandparent.",
                            state.rotations,
                            newParent.key,
                            key,
                            "/* rb outer right */"
                        ));
                    }
                }
            }

            state.root.color = "BLACK";

            steps.push(makeStep(
                state.root,
                [state.root.key],
                "Root Black",
                "Ensure the root is black after inserting " + key + ".",
                state.rotations,
                state.root.key,
                key,
                "/* rb root black */"
            ));
        });

        steps.push(makeStep(
            state.root,
            state.root ? [state.root.key] : [],
            "Complete",
            "Red–Black construction complete. No red node has a " +
                "red child and every root-to-null path has equal " +
                "black-height.",
            state.rotations,
            state.root ? state.root.key : null,
            null,
            "preorder(root);",
            true
        ));

        return steps;
    }

    function splayRotateLeft(state, pivot) {
        const child = pivot.right;

        pivot.right = child.left;

        if (child.left) {
            child.left.parent = pivot;
        }

        child.parent = pivot.parent;

        if (!pivot.parent) {
            state.root = child;
        } else if (pivot === pivot.parent.left) {
            pivot.parent.left = child;
        } else {
            pivot.parent.right = child;
        }

        child.left = pivot;
        pivot.parent = child;
        state.rotations += 1;
    }

    function splayRotateRight(state, pivot) {
        const child = pivot.left;

        pivot.left = child.right;

        if (child.right) {
            child.right.parent = pivot;
        }

        child.parent = pivot.parent;

        if (!pivot.parent) {
            state.root = child;
        } else if (pivot === pivot.parent.left) {
            pivot.parent.left = child;
        } else {
            pivot.parent.right = child;
        }

        child.right = pivot;
        pivot.parent = child;
        state.rotations += 1;
    }

    function buildSplaySteps(values) {
        const state = {
            root: null,
            rotations: 0
        };

        const steps = [];

        values.forEach(function (key) {
            steps.push(makeStep(
                state.root,
                [],
                "Insert",
                "Insert " + key +
                    " by BST order, then splay it to the root.",
                state.rotations,
                null,
                key,
                "/* splay insert call */"
            ));

            let parent = null;
            let current = state.root;

            while (current) {
                parent = current;

                steps.push(makeStep(
                    state.root,
                    [current.key],
                    "BST Compare",
                    key + (key < current.key ? " < " : " > ") +
                        current.key + ".",
                    state.rotations,
                    current.key,
                    key,
                    "/* splay compare */"
                ));

                current = key < current.key
                    ? current.left
                    : current.right;
            }

            const inserted = {
                key: key,
                color: "PURPLE",
                height: 1,
                left: null,
                right: null,
                parent: parent
            };

            if (!parent) {
                state.root = inserted;
            } else if (key < parent.key) {
                parent.left = inserted;
            } else {
                parent.right = inserted;
            }

            steps.push(makeStep(
                state.root,
                [key],
                "Attach Node",
                "Attach " + key + " and begin splaying it upward.",
                state.rotations,
                key,
                key,
                "/* splay attach */"
            ));

            while (inserted.parent) {
                const parentNode = inserted.parent;
                const grand = parentNode.parent;

                if (!grand) {
                    if (inserted === parentNode.left) {
                        splayRotateRight(state, parentNode);

                        steps.push(makeStep(
                            state.root,
                            [inserted.key],
                            "Zig",
                            "One right rotation moves " +
                                inserted.key + " to the root.",
                            state.rotations,
                            inserted.key,
                            key,
                            "/* splay zig right */"
                        ));
                    } else {
                        splayRotateLeft(state, parentNode);

                        steps.push(makeStep(
                            state.root,
                            [inserted.key],
                            "Zig",
                            "One left rotation moves " +
                                inserted.key + " to the root.",
                            state.rotations,
                            inserted.key,
                            key,
                            "/* splay zig left */"
                        ));
                    }
                } else if (
                    inserted === parentNode.left &&
                    parentNode === grand.left
                ) {
                    splayRotateRight(state, grand);
                    splayRotateRight(state, parentNode);

                    steps.push(makeStep(
                        state.root,
                        [inserted.key],
                        "Zig–Zig",
                        "Two right rotations handle the left-left shape.",
                        state.rotations,
                        inserted.key,
                        key,
                        "/* splay zig-zig right */"
                    ));
                } else if (
                    inserted === parentNode.right &&
                    parentNode === grand.right
                ) {
                    splayRotateLeft(state, grand);
                    splayRotateLeft(state, parentNode);

                    steps.push(makeStep(
                        state.root,
                        [inserted.key],
                        "Zig–Zig",
                        "Two left rotations handle the right-right shape.",
                        state.rotations,
                        inserted.key,
                        key,
                        "/* splay zig-zig left */"
                    ));
                } else if (
                    inserted === parentNode.right &&
                    parentNode === grand.left
                ) {
                    splayRotateLeft(state, parentNode);
                    splayRotateRight(state, grand);

                    steps.push(makeStep(
                        state.root,
                        [inserted.key],
                        "Zig–Zag",
                        "Left then right rotation handles " +
                            "the left-right shape.",
                        state.rotations,
                        inserted.key,
                        key,
                        "/* splay zig-zag LR */"
                    ));
                } else {
                    splayRotateRight(state, parentNode);
                    splayRotateLeft(state, grand);

                    steps.push(makeStep(
                        state.root,
                        [inserted.key],
                        "Zig–Zag",
                        "Right then left rotation handles " +
                            "the right-left shape.",
                        state.rotations,
                        inserted.key,
                        key,
                        "/* splay zig-zag RL */"
                    ));
                }
            }

            steps.push(makeStep(
                state.root,
                [key],
                "Splay Complete",
                key + " is now the root; control returns to the " +
                    "for-loop condition before the next key.",
                state.rotations,
                key,
                key,
                "for (int i = 0; i < n; i++)"
            ));
        });

        steps.push(makeStep(
            state.root,
            state.root ? [state.root.key] : [],
            "Complete",
            "Splay construction complete. The most recently " +
                "inserted key is at the root.",
            state.rotations,
            state.root ? state.root.key : null,
            null,
            "preorder(root);",
            true
        ));

        return steps;
    }

    function buildBalancedSteps(values, algorithm) {
        if (algorithm === "avl") {
            return buildAVLSteps(values);
        }

        if (algorithm === "redblack") {
            return buildRedBlackSteps(values);
        }

        return buildSplaySteps(values);
    }

    function cloneTree(node, parent) {
        if (!node) { return null; }

        const copy = {
            key: node.key,
            height: node.height || 1,
            color: node.color || "BLUE",
            left: null,
            right: null,
            parent: parent || null
        };

        copy.left = cloneTree(node.left, copy);
        copy.right = cloneTree(node.right, copy);

        return copy;
    }

    function builtState(values, algorithm) {
        const construction = buildBalancedSteps(values, algorithm);
        const last = construction[construction.length - 1];

        return {
            root: cloneTree(last.tree, null),
            rotations: last.rotations || 0
        };
    }

    function operationStep(
        state,
        active,
        phase,
        message,
        target,
        needle,
        result,
        complete
    ) {
        const step = makeStep(
            state.root,
            active,
            phase,
            message,
            state.rotations,
            active && active.length ? active[0] : null,
            target,
            needle,
            complete
        );

        step.result = result || "—";
        return step;
    }

    function buildPlainSearchSteps(values, algorithm, target) {
        const state = builtState(values, algorithm);
        const steps = [];
        let current = state.root;

        steps.push(operationStep(
            state,
            current ? [current.key] : [],
            "Start Search",
            "Set current to the root.",
            target,
            "Node *current = root;"
        ));

        while (true) {
            steps.push(operationStep(
                state,
                current ? [current.key] : [],
                "Loop Condition",
                current
                    ? "current is not NULL, so execute another search iteration."
                    : "current is NULL, so the search loop stops.",
                target,
                "while (current != NULL)"
            ));

            if (!current) { break; }

            steps.push(operationStep(
                state,
                [current.key],
                "Equality Check",
                "Compare target " + target +
                    " with current key " + current.key + ".",
                target,
                "if (key == current->key)"
            ));

            if (target === current.key) {
                steps.push(operationStep(
                    state,
                    [current.key],
                    "Found",
                    target +
                        " equals the current key; return this node.",
                    target,
                    "return current;",
                    "Found",
                    true
                ));

                return steps;
            }

            steps.push(operationStep(
                state,
                [current.key],
                "Direction Check",
                "Test whether " + target +
                    " is smaller than " + current.key + ".",
                target,
                "if (key < current->key)"
            ));

            if (target < current.key) {
                current = current.left;

                steps.push(operationStep(
                    state,
                    current ? [current.key] : [],
                    "Move Left",
                    "Move to the left child.",
                    target,
                    "current = current->left;"
                ));
            } else {
                current = current.right;

                steps.push(operationStep(
                    state,
                    current ? [current.key] : [],
                    "Move Right",
                    "Move to the right child.",
                    target,
                    "current = current->right;"
                ));
            }
        }

        steps.push(operationStep(
            state,
            [],
            "Not Found",
            "The loop ended at NULL; the key is absent.",
            target,
            "return NULL;",
            "Not found",
            true
        ));

        return steps;
    }

    function buildAVLDeleteSteps(values, target) {
        const state = builtState(values, "avl");
        const steps = [];

        function rotateRightLocal(oldRoot) {
            const newRoot = oldRoot.left;

            oldRoot.left = newRoot.right;
            newRoot.right = oldRoot;

            updateHeight(oldRoot);
            updateHeight(newRoot);

            state.rotations += 1;
            return newRoot;
        }

        function rotateLeftLocal(oldRoot) {
            const newRoot = oldRoot.right;

            oldRoot.right = newRoot.left;
            newRoot.left = oldRoot;

            updateHeight(oldRoot);
            updateHeight(newRoot);

            state.rotations += 1;
            return newRoot;
        }

        function minimum(node) {
            let current = node;

            while (current && current.left) {
                steps.push(operationStep(
                    state,
                    [current.key],
                    "Successor Loop",
                    "The current successor candidate has a left " +
                        "child, so continue left.",
                    target,
                    "while (current->left != NULL)"
                ));

                current = current.left;

                steps.push(operationStep(
                    state,
                    [current.key],
                    "Move to Successor",
                    "Move one step left toward the inorder successor.",
                    target,
                    "current = current->left;"
                ));
            }

            steps.push(operationStep(
                state,
                current ? [current.key] : [],
                "Successor Loop",
                "No further left child exists; the loop stops.",
                target,
                "while (current->left != NULL)"
            ));

            return current;
        }

        function remove(root, key) {
            steps.push(operationStep(
                state,
                root ? [root.key] : [],
                "Null Check",
                root
                    ? "The recursive subtree is non-empty."
                    : "The recursive subtree is empty; return NULL.",
                target,
                "if (root == NULL) return root;"
            ));

            if (!root) { return null; }

            steps.push(operationStep(
                state,
                [root.key],
                "Compare",
                "Compare " + key + " with " + root.key + ".",
                target,
                "if (key < root->key)"
            ));

            if (key < root.key) {
                root.left = remove(root.left, key);

                steps.push(operationStep(
                    state,
                    [root.key],
                    "Return from Left",
                    "Reconnect the updated left subtree of " +
                        root.key + ".",
                    target,
                    "root->left = deleteAVL(root->left, key);"
                ));
            } else if (key > root.key) {
                steps.push(operationStep(
                    state,
                    [root.key],
                    "Compare",
                    key + " is larger, so recurse right.",
                    target,
                    "else if (key > root->key)"
                ));

                root.right = remove(root.right, key);

                steps.push(operationStep(
                    state,
                    [root.key],
                    "Return from Right",
                    "Reconnect the updated right subtree of " +
                        root.key + ".",
                    target,
                    "root->right = deleteAVL(root->right, key);"
                ));
            } else {
                steps.push(operationStep(
                    state,
                    [root.key],
                    "Delete Match",
                    "The target node " + root.key + " is found.",
                    target,
                    "else {"
                ));

                if (!root.left || !root.right) {
                    const replacement = root.left || root.right;

                    steps.push(operationStep(
                        state,
                        [root.key],
                        "Zero/One Child",
                        replacement
                            ? "Replace the node with its only child " +
                                replacement.key + "."
                            : "The node is a leaf, so replace it with NULL.",
                        target,
                        "Node *replacement = root->left ? " +
                            "root->left : root->right;"
                    ));

                    root = replacement;
                } else {
                    const successor = minimum(root.right);

                    steps.push(operationStep(
                        state,
                        [root.key, successor.key],
                        "Copy Successor",
                        "Copy inorder successor " + successor.key +
                            " into the target node.",
                        target,
                        "root->key = successor->key;"
                    ));

                    root.key = successor.key;
                    root.right = remove(root.right, successor.key);
                }
            }

            steps.push(operationStep(
                state,
                root ? [root.key] : [],
                "Post-delete Null Check",
                root
                    ? "The subtree still has a root; update and rebalance it."
                    : "The subtree became empty; return NULL.",
                target,
                "if (root == NULL) return root;"
            ));

            if (!root) { return null; }

            updateHeight(root);

            steps.push(operationStep(
                state,
                [root.key],
                "Update Height",
                "Update height of " + root.key +
                    " to " + root.height + ".",
                target,
                "updateHeight(root);"
            ));

            const balance =
                height(root.left) - height(root.right);

            steps.push(operationStep(
                state,
                [root.key],
                "Check Balance",
                "Balance factor of " + root.key +
                    " is " + balance + ".",
                target,
                "int balance = balanceFactor(root);"
            ));

            if (
                balance > 1 &&
                height(root.left.left) >= height(root.left.right)
            ) {
                root = rotateRightLocal(root);

                steps.push(operationStep(
                    state,
                    [root.key],
                    "LL Rebalance",
                    "A right rotation restores AVL balance.",
                    target,
                    "return rotateRight(root);"
                ));
            } else if (balance > 1) {
                root.left = rotateLeftLocal(root.left);
                root = rotateRightLocal(root);

                steps.push(operationStep(
                    state,
                    [root.key],
                    "LR Rebalance",
                    "Rotate the child left and the node right.",
                    target,
                    "root->left = rotateLeft(root->left);"
                ));
            } else if (
                balance < -1 &&
                height(root.right.right) >= height(root.right.left)
            ) {
                root = rotateLeftLocal(root);

                steps.push(operationStep(
                    state,
                    [root.key],
                    "RR Rebalance",
                    "A left rotation restores AVL balance.",
                    target,
                    "return rotateLeft(root);"
                ));
            } else if (balance < -1) {
                root.right = rotateRightLocal(root.right);
                root = rotateLeftLocal(root);

                steps.push(operationStep(
                    state,
                    [root.key],
                    "RL Rebalance",
                    "Rotate the child right and the node left.",
                    target,
                    "root->right = rotateRight(root->right);"
                ));
            }

            return root;
        }

        state.root = remove(state.root, target);

        steps.push(operationStep(
            state,
            state.root ? [state.root.key] : [],
            "Deletion Complete",
            values.indexOf(target) === -1
                ? target + " was not present; the tree is unchanged."
                : target +
                    " is deleted and every affected ancestor is balanced.",
            target,
            "return root;",
            values.indexOf(target) === -1
                ? "Key not found"
                : "Deleted",
            true
        ));

        return steps;
    }

    function buildRedBlackDeleteSteps(values, target) {
        const state = builtState(values, "redblack");
        const steps = [];

        function color(node) {
            return node ? node.color : "BLACK";
        }

        function left(node) {
            return node ? node.left : null;
        }

        function right(node) {
            return node ? node.right : null;
        }

        function transplant(oldNode, newNode) {
            if (!oldNode.parent) {
                state.root = newNode;
            } else if (oldNode === oldNode.parent.left) {
                oldNode.parent.left = newNode;
            } else {
                oldNode.parent.right = newNode;
            }

            if (newNode) {
                newNode.parent = oldNode.parent;
            }
        }

        let z = state.root;

        while (true) {
            steps.push(operationStep(
                state,
                z ? [z.key] : [],
                "Search Loop",
                z
                    ? "The search pointer is non-NULL; compare again."
                    : "The search pointer is NULL; stop looking for the key.",
                target,
                "while (z != NULL && z->key != key)"
            ));

            if (!z || z.key === target) { break; }

            steps.push(operationStep(
                state,
                [z.key],
                "Search Direction",
                "Choose the " +
                    (target < z.key ? "left" : "right") +
                    " subtree of " + z.key + ".",
                target,
                "z = key < z->key ? z->left : z->right;"
            ));

            z = target < z.key ? z.left : z.right;
        }

        if (!z) {
            steps.push(operationStep(
                state,
                [],
                "Not Found",
                "Deletion stops because the key is absent.",
                target,
                "if (z == NULL) return root;",
                "Key not found",
                true
            ));

            return steps;
        }

        let y = z;
        let removedColor = y.color;
        let x = null;
        let xParent = null;

        steps.push(operationStep(
            state,
            [z.key],
            "Delete Match",
            "Found " + z.key +
                "; remember that its colour is " + removedColor + ".",
            target,
            "Color removedColor = y->color;"
        ));

        if (!z.left) {
            x = z.right;
            xParent = z.parent;
            transplant(z, z.right);

            steps.push(operationStep(
                state,
                x ? [x.key] : [],
                "Transplant Right",
                "Replace the node with its right child.",
                target,
                "transplant(&root, z, z->right);"
            ));
        } else if (!z.right) {
            x = z.left;
            xParent = z.parent;
            transplant(z, z.left);

            steps.push(operationStep(
                state,
                x ? [x.key] : [],
                "Transplant Left",
                "Replace the node with its left child.",
                target,
                "transplant(&root, z, z->left);"
            ));
        } else {
            y = z.right;

            while (true) {
                steps.push(operationStep(
                    state,
                    [y.key],
                    "Successor Loop",
                    y.left
                        ? "A smaller node exists in the right " +
                            "subtree; continue left."
                        : "The successor has no left child; stop the loop.",
                    target,
                    "while (y->left != NULL)"
                ));

                if (!y.left) { break; }

                y = y.left;

                steps.push(operationStep(
                    state,
                    [y.key],
                    "Move to Successor",
                    "Move to the next left child.",
                    target,
                    "y = y->left;"
                ));
            }

            removedColor = y.color;
            x = y.right;

            if (y.parent === z) {
                xParent = y;
            } else {
                xParent = y.parent;
                transplant(y, y.right);

                y.right = z.right;
                y.right.parent = y;
            }

            transplant(z, y);

            y.left = z.left;
            y.left.parent = y;
            y.color = z.color;

            steps.push(operationStep(
                state,
                [y.key],
                "Move Successor",
                "Move successor " + y.key +
                    " into the deleted node's position and " +
                    "preserve its original colour.",
                target,
                "y->color = z->color;"
            ));
        }

        if (removedColor === "BLACK") {
            while (
                x !== state.root &&
                color(x) === "BLACK"
            ) {
                steps.push(operationStep(
                    state,
                    x
                        ? [x.key]
                        : xParent
                            ? [xParent.key]
                            : [],
                    "Double-black Loop",
                    "A black node was removed, so inspect the " +
                        "sibling and repair black-height.",
                    target,
                    "while (x != root && colorOf(x) == BLACK)"
                ));

                if (!xParent) { break; }

                if (x === xParent.left) {
                    let sibling = xParent.right;

                    if (color(sibling) === "RED") {
                        sibling.color = "BLACK";
                        xParent.color = "RED";
                        rbRotateLeft(state, xParent);
                        sibling = xParent.right;

                        steps.push(operationStep(
                            state,
                            sibling ? [sibling.key] : [],
                            "Red Sibling",
                            "Recolour the red sibling and rotate " +
                                "left to obtain a black sibling.",
                            target,
                            "rotateLeft(&root, xParent);"
                        ));
                    }

                    if (
                        color(left(sibling)) === "BLACK" &&
                        color(right(sibling)) === "BLACK"
                    ) {
                        if (sibling) {
                            sibling.color = "RED";
                        }

                        x = xParent;
                        xParent = x.parent;

                        steps.push(operationStep(
                            state,
                            x ? [x.key] : [],
                            "Push Double Black",
                            "Both nephews are black; colour the sibling " +
                                "red and move the extra black upward.",
                            target,
                            "x = xParent;"
                        ));
                    } else {
                        if (color(right(sibling)) === "BLACK") {
                            if (left(sibling)) {
                                sibling.left.color = "BLACK";
                            }

                            if (sibling) {
                                sibling.color = "RED";
                                rbRotateRight(state, sibling);
                            }

                            sibling = xParent.right;

                            steps.push(operationStep(
                                state,
                                sibling ? [sibling.key] : [],
                                "Near-nephew Rotation",
                                "Rotate the sibling right so the far " +
                                    "nephew becomes red.",
                                target,
                                "rotateRight(&root, sibling);"
                            ));
                        }

                        if (sibling) {
                            sibling.color = xParent.color;
                        }

                        xParent.color = "BLACK";

                        if (right(sibling)) {
                            sibling.right.color = "BLACK";
                        }

                        rbRotateLeft(state, xParent);

                        x = state.root;
                        xParent = null;

                        steps.push(operationStep(
                            state,
                            state.root ? [state.root.key] : [],
                            "Final Left Fix",
                            "Transfer the parent colour, blacken the " +
                                "far nephew and rotate left.",
                            target,
                            "rotateLeft(&root, xParent);"
                        ));
                    }
                } else {
                    let sibling = xParent.left;

                    if (color(sibling) === "RED") {
                        sibling.color = "BLACK";
                        xParent.color = "RED";
                        rbRotateRight(state, xParent);
                        sibling = xParent.left;

                        steps.push(operationStep(
                            state,
                            sibling ? [sibling.key] : [],
                            "Red Sibling",
                            "Recolour the red sibling and rotate " +
                                "right to obtain a black sibling.",
                            target,
                            "rotateRight(&root, xParent);"
                        ));
                    }

                    if (
                        color(right(sibling)) === "BLACK" &&
                        color(left(sibling)) === "BLACK"
                    ) {
                        if (sibling) {
                            sibling.color = "RED";
                        }

                        x = xParent;
                        xParent = x.parent;

                        steps.push(operationStep(
                            state,
                            x ? [x.key] : [],
                            "Push Double Black",
                            "Both nephews are black; move the extra " +
                                "black upward.",
                            target,
                            "x = xParent;"
                        ));
                    } else {
                        if (color(left(sibling)) === "BLACK") {
                            if (right(sibling)) {
                                sibling.right.color = "BLACK";
                            }

                            if (sibling) {
                                sibling.color = "RED";
                                rbRotateLeft(state, sibling);
                            }

                            sibling = xParent.left;

                            steps.push(operationStep(
                                state,
                                sibling ? [sibling.key] : [],
                                "Near-nephew Rotation",
                                "Rotate the sibling left so the far " +
                                    "nephew becomes red.",
                                target,
                                "rotateLeft(&root, sibling);"
                            ));
                        }

                        if (sibling) {
                            sibling.color = xParent.color;
                        }

                        xParent.color = "BLACK";

                        if (left(sibling)) {
                            sibling.left.color = "BLACK";
                        }

                        rbRotateRight(state, xParent);

                        x = state.root;
                        xParent = null;

                        steps.push(operationStep(
                            state,
                            state.root ? [state.root.key] : [],
                            "Final Right Fix",
                            "Transfer the parent colour, blacken the " +
                                "far nephew and rotate right.",
                            target,
                            "rotateRight(&root, xParent);"
                        ));
                    }
                }
            }

            steps.push(operationStep(
                state,
                x
                    ? [x.key]
                    : state.root
                        ? [state.root.key]
                        : [],
                "Loop Condition",
                "The double-black loop condition is now false.",
                target,
                "while (x != root && colorOf(x) == BLACK)"
            ));

            if (x) {
                x.color = "BLACK";
            }

            steps.push(operationStep(
                state,
                x ? [x.key] : [],
                "Finish Fix",
                "Colour the replacement black to complete the repair.",
                target,
                "if (x != NULL) x->color = BLACK;"
            ));
        }

        steps.push(operationStep(
            state,
            state.root ? [state.root.key] : [],
            "Deletion Complete",
            target +
                " is deleted and all Red–Black properties are restored.",
            target,
            "return root;",
            "Deleted",
            true
        ));

        return steps;
    }

    function splayNode(state, node, target, steps) {
        while (true) {
            steps.push(operationStep(
                state,
                node ? [node.key] : [],
                "Splay Loop",
                node && node.parent
                    ? node.key +
                        " still has a parent, so another splay " +
                        "iteration is required."
                    : "The node is root; the splay loop stops.",
                target,
                "while (node->parent != NULL)"
            ));

            if (!node || !node.parent) { break; }

            const parent = node.parent;
            const grand = parent.parent;

            steps.push(operationStep(
                state,
                [node.key, parent.key],
                "Choose Case",
                grand
                    ? "A grandparent exists; choose zig–zig or zig–zag."
                    : "The parent is root; use one zig rotation.",
                target,
                "if (grand == NULL)"
            ));

            if (!grand) {
                if (node === parent.left) {
                    splayRotateRight(state, parent);

                    steps.push(operationStep(
                        state,
                        [node.key],
                        "Zig Right",
                        "Rotate right at the parent.",
                        target,
                        "rotateRight(root, parent);"
                    ));
                } else {
                    splayRotateLeft(state, parent);

                    steps.push(operationStep(
                        state,
                        [node.key],
                        "Zig Left",
                        "Rotate left at the parent.",
                        target,
                        "rotateLeft(root, parent);"
                    ));
                }
            } else if (
                node === parent.left &&
                parent === grand.left
            ) {
                splayRotateRight(state, grand);
                splayRotateRight(state, parent);

                steps.push(operationStep(
                    state,
                    [node.key],
                    "Zig–Zig Right",
                    "Two right rotations move the node upward.",
                    target,
                    "rotateRight(root, grand);"
                ));
            } else if (
                node === parent.right &&
                parent === grand.right
            ) {
                splayRotateLeft(state, grand);
                splayRotateLeft(state, parent);

                steps.push(operationStep(
                    state,
                    [node.key],
                    "Zig–Zig Left",
                    "Two left rotations move the node upward.",
                    target,
                    "rotateLeft(root, grand);"
                ));
            } else if (node === parent.right) {
                splayRotateLeft(state, parent);
                splayRotateRight(state, grand);

                steps.push(operationStep(
                    state,
                    [node.key],
                    "Zig–Zag",
                    "Rotate left, then right.",
                    target,
                    "rotateLeft(root, parent);"
                ));
            } else {
                splayRotateRight(state, parent);
                splayRotateLeft(state, grand);

                steps.push(operationStep(
                    state,
                    [node.key],
                    "Zig–Zag",
                    "Rotate right, then left.",
                    target,
                    "rotateRight(root, parent);"
                ));
            }
        }
    }

    function buildSplayOperationSteps(values, operation, target) {
        const state = builtState(values, "splay");
        const steps = [];

        let current = state.root;
        let last = null;

        while (true) {
            steps.push(operationStep(
                state,
                current ? [current.key] : [],
                "Search Loop",
                current
                    ? "The current pointer is non-NULL; execute " +
                        "another comparison."
                    : "The current pointer is NULL; the loop stops.",
                target,
                "while (current != NULL)"
            ));

            if (!current) { break; }

            last = current;

            steps.push(operationStep(
                state,
                [current.key],
                "Equality Check",
                "Compare " + target + " with " + current.key + ".",
                target,
                "if (key == current->key) break;"
            ));

            if (current.key === target) { break; }

            if (target < current.key) {
                current = current.left;

                steps.push(operationStep(
                    state,
                    current ? [current.key] : [],
                    "Move Left",
                    "Move to the left child.",
                    target,
                    "current = current->left;"
                ));
            } else {
                current = current.right;

                steps.push(operationStep(
                    state,
                    current ? [current.key] : [],
                    "Move Right",
                    "Move to the right child.",
                    target,
                    "current = current->right;"
                ));
            }
        }

        const selected = current || last;

        if (selected) {
            splayNode(state, selected, target, steps);
        }

        if (operation === "search") {
            const found = Boolean(
                current && current.key === target
            );

            steps.push(operationStep(
                state,
                state.root ? [state.root.key] : [],
                found ? "Search Complete" : "Search Miss",
                found
                    ? target + " is found and splayed to the root."
                    : target + " is absent; the last visited node " +
                        "is splayed to the root.",
                target,
                "return current;",
                found ? "Found" : "Not found",
                true
            ));

            return steps;
        }

        if (
            !current ||
            !state.root ||
            state.root.key !== target
        ) {
            steps.push(operationStep(
                state,
                state.root ? [state.root.key] : [],
                "Not Found",
                target + " is absent, so no node is deleted.",
                target,
                "if (root == NULL || root->key != key) return root;",
                "Key not found",
                true
            ));

            return steps;
        }

        const leftTree = state.root.left;
        const rightTree = state.root.right;

        if (leftTree) {
            leftTree.parent = null;
        }

        if (rightTree) {
            rightTree.parent = null;
        }

        steps.push(operationStep(
            state,
            [target],
            "Detach Subtrees",
            "Detach the left and right subtrees from the root " +
                "being deleted.",
            target,
            "Node *leftTree = root->left;"
        ));

        if (!leftTree) {
            state.root = rightTree;

            steps.push(operationStep(
                state,
                state.root ? [state.root.key] : [],
                "Join",
                "No left subtree exists; the right subtree " +
                    "becomes the tree.",
                target,
                "return rightTree;",
                "Deleted",
                true
            ));

            return steps;
        }

        state.root = leftTree;

        let maximum = leftTree;

        while (true) {
            steps.push(operationStep(
                state,
                [maximum.key],
                "Maximum Loop",
                maximum.right
                    ? "A larger key exists; continue right."
                    : "No right child exists; this is the maximum.",
                target,
                "while (maximum->right != NULL)"
            ));

            if (!maximum.right) { break; }

            maximum = maximum.right;

            steps.push(operationStep(
                state,
                [maximum.key],
                "Move Right",
                "Move toward the maximum node.",
                target,
                "maximum = maximum->right;"
            ));
        }

        splayNode(state, maximum, target, steps);

        state.root.right = rightTree;

        if (rightTree) {
            rightTree.parent = state.root;
        }

        steps.push(operationStep(
            state,
            [state.root.key],
            "Join",
            "Attach the original right subtree to the maximum " +
                "of the left subtree.",
            target,
            "root->right = rightTree;",
            "Deleted",
            true
        ));

        return steps;
    }

    function parseTarget(input) {
        const value = Number(input.value);

        if (!Number.isInteger(value)) {
            throw new Error("Enter a valid integer target key.");
        }

        return value;
    }

    function buildOperationSteps(
        values,
        algorithm,
        operation,
        target
    ) {
        if (operation === "insert") {
            if (values.indexOf(target) !== -1) {
                throw new Error(
                    "For insertion, use a target key that is not " +
                    "already in Initial Keys."
                );
            }

            return buildBalancedSteps(
                values.concat([target]),
                algorithm
            );
        }

        if (operation === "search") {
            return algorithm === "splay"
                ? buildSplayOperationSteps(
                    values,
                    operation,
                    target
                )
                : buildPlainSearchSteps(
                    values,
                    algorithm,
                    target
                );
        }

        if (algorithm === "avl") {
            return buildAVLDeleteSteps(values, target);
        }

        if (algorithm === "redblack") {
            return buildRedBlackDeleteSteps(values, target);
        }

        return buildSplayOperationSteps(
            values,
            operation,
            target
        );
    }

    function parseSequence(input) {
        const values = input.value
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
            throw new Error(
                "Enter 2 to 12 valid integer keys separated " +
                "by commas or spaces."
            );
        }

        if (new Set(values).size !== values.length) {
            throw new Error(
                "Use distinct keys so every insertion has one " +
                "clear tree position."
            );
        }

        input.value = values.join(", ");
        return values;
    }

    function svgElement(name, attributes) {
        const element = document.createElementNS(
            SVG_NS,
            name
        );

        Object.keys(attributes || {}).forEach(function (key) {
            element.setAttribute(key, attributes[key]);
        });

        return element;
    }

    function renderTree(svg, root, active, algorithm) {
        svg.innerHTML = "";

        if (!root) {
            const empty = svgElement("text", {
                x: "450",
                y: "75",
                class: "balanced-tree-empty",
                "text-anchor": "middle"
            });

            empty.textContent =
                "The tree is empty. Press Next to begin.";

            svg.appendChild(empty);
            svg.setAttribute("viewBox", "0 0 900 150");
            return;
        }

        const nodes = [];
        const edges = [];
        let order = 0;

        function walk(node, depth, parent) {
            if (!node) { return; }

            walk(node.left, depth + 1, node);

            const item = {
                node: node,
                depth: depth,
                order: order,
                parent: parent
            };

            order += 1;
            nodes.push(item);

            walk(node.right, depth + 1, node);
        }

        walk(root, 0, null);

        const byKey = {};
        const canvasHeight = Math.max(
            190,
            100 + treeHeight(root) * 82
        );

        nodes.forEach(function (item) {
            item.x = nodes.length === 1
                ? 450
                : 55 + item.order *
                    (790 / (nodes.length - 1));

            item.y = 48 + item.depth * 82;
            byKey[item.node.key] = item;
        });

        nodes.forEach(function (item) {
            if (item.parent) {
                edges.push([
                    byKey[item.parent.key],
                    item
                ]);
            }
        });

        edges.forEach(function (edge) {
            svg.appendChild(svgElement("line", {
                x1: edge[0].x,
                y1: edge[0].y,
                x2: edge[1].x,
                y2: edge[1].y,
                class: "balanced-tree-edge"
            }));
        });

        nodes.forEach(function (item) {
            const algorithmClass =
                algorithm === "redblack"
                    ? item.node.color === "RED"
                        ? "is-red"
                        : "is-black"
                    : algorithm === "splay"
                        ? "is-splay"
                        : "is-avl";

            const activeClass =
                active.indexOf(item.node.key) !== -1
                    ? " is-active"
                    : "";

            const group = svgElement("g", {
                class: "balanced-tree-node " +
                    algorithmClass + activeClass
            });

            const circle = svgElement("circle", {
                cx: item.x,
                cy: item.y,
                r: "25"
            });

            const keyText = svgElement("text", {
                x: item.x,
                y: item.y + 5,
                "text-anchor": "middle",
                class: "balanced-tree-key"
            });

            keyText.textContent = String(item.node.key);

            const meta = svgElement("text", {
                x: item.x,
                y: item.y + 40,
                "text-anchor": "middle",
                class: "balanced-tree-meta"
            });

            meta.textContent =
                algorithm === "avl"
                    ? "h=" + item.node.height
                    : algorithm === "redblack"
                        ? item.node.color
                        : "";

            group.appendChild(circle);
            group.appendChild(keyText);
            group.appendChild(meta);
            svg.appendChild(group);
        });

        svg.setAttribute(
            "viewBox",
            "0 0 900 " + canvasHeight
        );

        svg.style.height =
            Math.min(390, canvasHeight) + "px";
    }

    const labels = {
        avl: "AVL Tree",
        redblack: "Red–Black Tree",
        splay: "Splay Tree"
    };

    const operationLabels = {
        insert: "Insertion",
        search: "Search",
        delete: "Deletion"
    };

    const visualizer = {
        input: document.getElementById("balancedInput"),
        target: document.getElementById("balancedTarget"),
        algorithm: document.getElementById("balancedAlgorithm"),
        operation: document.getElementById("balancedOperation"),
        load: document.getElementById("loadBalancedVisualizer"),
        prompt: document.getElementById("balancedPrompt"),
        result: document.getElementById("balancedResult"),
        svg: document.getElementById("balancedTreeSvg"),
        message: document.getElementById("balancedMessage"),
        phase: document.getElementById("balancedPhase"),
        rotations: document.getElementById("balancedRotations"),
        root: document.getElementById("balancedRoot"),
        height: document.getElementById("balancedHeight"),
        progress: document.getElementById("balancedProgress"),
        status: document.getElementById("balancedStatus"),
        previous: document.getElementById("balancedPrevious"),
        next: document.getElementById("balancedNext"),
        auto: document.getElementById("balancedAuto"),
        pause: document.getElementById("balancedPause"),
        reset: document.getElementById("balancedReset")
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

        if (visualizer.result) {
            visualizer.result.hidden = true;
            visualizer.prompt.hidden = false;
        }
    }

    function renderVisual() {
        if (!visualSteps.length) { return; }

        const step = visualSteps[visualIndex];

        renderTree(
            visualizer.svg,
            step.tree,
            step.active,
            visualizer.algorithm.value
        );

        visualizer.message.textContent = step.message;
        visualizer.phase.textContent = step.phase;
        visualizer.rotations.textContent =
            String(step.rotations);
        visualizer.root.textContent =
            step.tree ? step.tree.key : "—";
        visualizer.height.textContent =
            String(treeHeight(step.tree));

        visualizer.progress.style.width =
            (
                visualIndex /
                Math.max(1, visualSteps.length - 1) *
                100
            ) + "%";

        visualizer.status.textContent =
            "Step " + visualIndex +
            " of " + (visualSteps.length - 1);

        visualizer.previous.disabled =
            visualIndex === 0;

        visualizer.next.disabled =
            visualIndex === visualSteps.length - 1;
    }

    function loadVisual() {
        try {
            visualSteps = buildOperationSteps(
                parseSequence(visualizer.input),
                visualizer.algorithm.value,
                visualizer.operation.value,
                parseTarget(visualizer.target)
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
            visualizer.input,
            visualizer.target,
            visualizer.algorithm,
            visualizer.operation
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

        document
            .querySelectorAll("[data-balanced-example]")
            .forEach(function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        const examples = {
                            ll: [
                                "30, 20, 10",
                                "avl"
                            ],
                            mixed: [
                                "30, 15, 45, 10, 20, 40, 50, 5",
                                "redblack"
                            ],
                            splay: [
                                "40, 20, 60, 10, 30, 50",
                                "splay"
                            ]
                        };

                        const example =
                            examples[
                                button.dataset.balancedExample
                            ];

                        if (!example) { return; }

                        visualizer.input.value = example[0];
                        visualizer.algorithm.value = example[1];
                        visualizer.operation.value = "insert";

                        visualizer.target.value =
                            button.dataset.balancedExample === "ll"
                                ? "5"
                                : button.dataset.balancedExample === "mixed"
                                    ? "55"
                                    : "70";

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

                visualTimer = window.setInterval(
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

    const traceDefinitions = {
        avl: {
            label: "AVL Tree",
            codeKey: "avl-tree",
            example: "30, 20, 10, 28, 40, 50"
        },
        redblack: {
            label: "Red–Black Tree",
            codeKey: "red-black-tree",
            example: "30, 15, 45, 10, 20, 40, 50, 5"
        },
        splay: {
            label: "Splay Tree",
            codeKey: "splay-tree",
            example: "40, 20, 60, 10, 30, 50"
        }
    };

    const plainSearchSource =
`Node *searchNode(Node *root, int key) {
    Node *current = root;
    while (current != NULL) {
        if (key == current->key)
            return current;
        if (key < current->key)
            current = current->left;
        else
            current = current->right;
    }
    return NULL;
}`;

    const avlDeleteSource =
`Node *minimumNode(Node *root) {
    Node *current = root;
    while (current->left != NULL)
        current = current->left;
    return current;
}

Node *deleteAVL(Node *root, int key) {
    if (root == NULL) return root;
    if (key < root->key)
        root->left = deleteAVL(root->left, key);
    else if (key > root->key)
        root->right = deleteAVL(root->right, key);
    else {
        if (root->left == NULL || root->right == NULL) {
            Node *replacement = root->left ? root->left : root->right;
            free(root);
            root = replacement;
        } else {
            Node *successor = minimumNode(root->right);
            root->key = successor->key;
            root->right = deleteAVL(root->right, successor->key);
        }
    }
    if (root == NULL) return root;
    updateHeight(root);
    int balance = balanceFactor(root);
    if (balance > 1 && balanceFactor(root->left) >= 0)
        return rotateRight(root);
    if (balance > 1 && balanceFactor(root->left) < 0) {
        root->left = rotateLeft(root->left);
        return rotateRight(root);
    }
    if (balance < -1 && balanceFactor(root->right) <= 0)
        return rotateLeft(root);
    if (balance < -1 && balanceFactor(root->right) > 0) {
        root->right = rotateRight(root->right);
        return rotateLeft(root);
    }
    return root;
}`;

    const redBlackDeleteSource =
`Node *deleteRedBlack(Node *root, int key) {
    Node *z = root;
    while (z != NULL && z->key != key)
        z = key < z->key ? z->left : z->right;
    if (z == NULL) return root;
    Node *y = z;
    Color removedColor = y->color;
    Node *x = NULL;
    Node *xParent = NULL;
    if (z->left == NULL) {
        x = z->right;
        xParent = z->parent;
        transplant(&root, z, z->right);
    } else if (z->right == NULL) {
        x = z->left;
        xParent = z->parent;
        transplant(&root, z, z->left);
    } else {
        y = z->right;
        while (y->left != NULL)
            y = y->left;
        removedColor = y->color;
        x = y->right;
        if (y->parent != z) {
            transplant(&root, y, y->right);
            y->right = z->right;
        }
        transplant(&root, z, y);
        y->left = z->left;
        y->color = z->color;
    }
    if (removedColor == BLACK) {
        while (x != root && colorOf(x) == BLACK) {
            Node *sibling = x == xParent->left ?
                xParent->right : xParent->left;
            if (colorOf(sibling) == RED) {
                sibling->color = BLACK;
                xParent->color = RED;
                if (x == xParent->left)
                    rotateLeft(&root, xParent);
                else
                    rotateRight(&root, xParent);
            }
            if (colorOf(sibling->left) == BLACK &&
                colorOf(sibling->right) == BLACK) {
                sibling->color = RED;
                x = xParent;
                xParent = x->parent;
            } else if (x == xParent->left) {
                if (colorOf(sibling->right) == BLACK)
                    rotateRight(&root, sibling);
                rotateLeft(&root, xParent);
                x = root;
            } else {
                if (colorOf(sibling->left) == BLACK)
                    rotateLeft(&root, sibling);
                rotateRight(&root, xParent);
                x = root;
            }
        }
        if (x != NULL) x->color = BLACK;
    }
    return root;
}`;

    const splayOperationSource =
`Node *searchAndSplay(Node **root, int key) {
    Node *current = *root;
    Node *last = NULL;
    while (current != NULL) {
        last = current;
        if (key == current->key) break;
        if (key < current->key)
            current = current->left;
        else
            current = current->right;
    }
    Node *node = current != NULL ? current : last;
    while (node->parent != NULL) {
        Node *parent = node->parent;
        Node *grand = parent->parent;
        if (grand == NULL) {
            if (node == parent->left)
                rotateRight(root, parent);
            else
                rotateLeft(root, parent);
        } else if (node == parent->left &&
                   parent == grand->left) {
            rotateRight(root, grand);
            rotateRight(root, parent);
        } else if (node == parent->right &&
                   parent == grand->right) {
            rotateLeft(root, grand);
            rotateLeft(root, parent);
        } else if (node == parent->right) {
            rotateLeft(root, parent);
            rotateRight(root, grand);
        } else {
            rotateRight(root, parent);
            rotateLeft(root, grand);
        }
    }
    return current;
}

Node *deleteSplay(Node *root, int key) {
    Node *found = searchAndSplay(&root, key);
    if (root == NULL || root->key != key)
        return root;
    Node *leftTree = root->left;
    Node *rightTree = root->right;
    if (leftTree == NULL)
        return rightTree;
    root = leftTree;
    Node *maximum = root;
    while (maximum->right != NULL)
        maximum = maximum->right;
    searchAndSplay(&root, maximum->key);
    root->right = rightTree;
    return root;
}`;

    const operationSources = {
        avl: {
            search: plainSearchSource,
            delete: avlDeleteSource
        },
        redblack: {
            search: plainSearchSource,
            delete: redBlackDeleteSource
        },
        splay: {
            search: splayOperationSource,
            delete: splayOperationSource
        }
    };

    const tracer = {
        input: document.getElementById("balancedTraceInput"),
        target: document.getElementById("balancedTraceTarget"),
        algorithm: document.getElementById("balancedTraceAlgorithm"),
        operation: document.getElementById("balancedTraceOperation"),
        load: document.getElementById("loadBalancedTracer"),
        prompt: document.getElementById("balancedTracePrompt"),
        result: document.getElementById("balancedTraceResult"),
        title: document.getElementById("balancedTraceTitle"),
        codeWindow: document.getElementById("balancedTraceCodeWindow"),
        code: document.getElementById("balancedTraceCode"),
        message: document.getElementById("balancedTraceMessage"),
        variables: document.getElementById("balancedTraceVariables"),
        svg: document.getElementById("balancedTraceSvg"),
        output: document.getElementById("balancedTraceOutput"),
        status: document.getElementById("balancedTraceStatus"),
        previous: document.getElementById("balancedTracePrevious"),
        next: document.getElementById("balancedTraceNext"),
        auto: document.getElementById("balancedTraceAuto"),
        pause: document.getElementById("balancedTracePause"),
        reset: document.getElementById("balancedTraceReset")
    };

    let traceSteps = [];
    let traceIndex = 0;
    let traceTimer = null;
    let traceLines = [];
    let traceLookupLines = [];
    let activeDefinition = null;

    function stopTrace() {
        if (traceTimer !== null) {
            window.clearInterval(traceTimer);
            traceTimer = null;
        }
    }

    function invalidateTrace() {
        stopTrace();

        traceSteps = [];
        traceIndex = 0;

        if (tracer.result) {
            tracer.result.hidden = true;
            tracer.prompt.hidden = false;
        }
    }

    function findLine(needle) {
        if (!needle) { return -1; }

        for (
            let index = 0;
            index < traceLookupLines.length;
            index += 1
        ) {
            if (
                traceLookupLines[index].indexOf(needle) !== -1
            ) {
                return index + 1;
            }
        }

        return -1;
    }

    function loadCode(definition, algorithm, operation) {
        let text;

        if (operation === "insert") {
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

            text = source.textContent;
        } else {
            text = operationSources[algorithm][operation];
        }

        text = text
            .replace(/\r/g, "")
            .replace(/^\n+|\n+$/g, "");

        traceLookupLines = text.split("\n");

        traceLines = traceLookupLines.map(function (line) {
            return line
                .replace(
                    /\s*\/\*\s*(?:avl|rb|splay)[^*]*\*\//g,
                    ""
                )
                .replace(/\s+$/g, "");
        });

        tracer.code.innerHTML = "";

        traceLines.forEach(function (line, index) {
            const row = document.createElement("span");

            row.dataset.balancedTraceLine =
                String(index + 1);

            row.textContent =
                String(index + 1).padStart(2, "0") +
                " │ " +
                (line || " ");

            tracer.code.appendChild(row);
        });

        tracer.codeWindow.scrollTop = 0;
    }

    function decorate(steps) {
        let previous = 1;

        return steps.map(function (step) {
            const line = findLine(step.needle);

            if (line > 0) {
                previous = line;
            }

            return Object.assign({}, step, {
                line: line > 0 ? line : previous
            });
        });
    }

    function appendVariable(label, value) {
        const card = document.createElement("div");
        const name = document.createElement("span");
        const data = document.createElement("strong");

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
            .querySelectorAll("[data-balanced-trace-line]")
            .forEach(function (line) {
                const active =
                    Number(line.dataset.balancedTraceLine) ===
                    step.line;

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

        appendVariable(
            "Algorithm",
            activeDefinition.label
        );

        appendVariable(
            "Operation",
            operationLabels[tracer.operation.value]
        );

        appendVariable("Phase", step.phase);

        appendVariable(
            "Target Key",
            step.inserted === null
                ? "—"
                : step.inserted
        );

        appendVariable(
            "Current Node",
            step.current === null
                ? "—"
                : step.current
        );

        appendVariable("Rotations", step.rotations);

        appendVariable(
            "Root",
            step.tree ? step.tree.key : "—"
        );

        renderTree(
            tracer.svg,
            step.tree,
            step.active,
            tracer.algorithm.value
        );

        tracer.output.textContent = step.complete
            ? (
                step.result && step.result !== "—"
                    ? step.result
                    : operationLabels[tracer.operation.value] +
                        " complete. Root = " +
                        (step.tree ? step.tree.key : "—") +
                        "."
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
            traceDefinitions[tracer.algorithm.value];

        try {
            const values =
                parseSequence(tracer.input);

            const target =
                parseTarget(tracer.target);

            loadCode(
                definition,
                tracer.algorithm.value,
                tracer.operation.value
            );

            traceSteps = decorate(
                buildOperationSteps(
                    values,
                    tracer.algorithm.value,
                    tracer.operation.value,
                    target
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
        tracer.load.addEventListener(
            "click",
            loadTrace
        );

        [
            tracer.input,
            tracer.target,
            tracer.operation
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

        tracer.algorithm.addEventListener(
            "change",
            function () {
                const definition =
                    traceDefinitions[
                        tracer.algorithm.value
                    ];

                tracer.input.value =
                    definition.example;

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

                traceTimer = window.setInterval(
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
