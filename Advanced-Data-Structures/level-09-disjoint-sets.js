(function () {
    "use strict";

    const countInput = document.getElementById("dsuElementCount");
    const initializeButton = document.getElementById("initializeDsuButton");
    const prompt = document.getElementById("dsuExplorerPrompt");
    const workspace = document.getElementById("dsuExplorerWorkspace");
    const elementA = document.getElementById("dsuElementA");
    const elementB = document.getElementById("dsuElementB");
    const unionButton = document.getElementById("unionDsuButton");
    const findButton = document.getElementById("findDsuButton");
    const connectedButton = document.getElementById("connectedDsuButton");
    const resetButton = document.getElementById("resetDsuButton");
    const message = document.getElementById("dsuActionMessage");
    const setGroups = document.getElementById("dsuSetGroups");
    const arrayView = document.getElementById("dsuArrayView");
    const forestView = document.getElementById("dsuForestView");
    const historyList = document.getElementById("dsuHistory");

    let parent = [];
    let rank = [];
    let elementCount = 0;
    let history = [];

    function clampCount(value) {
        const parsed = Number(value);

        if (!Number.isFinite(parsed)) {
            return 8;
        }

        return Math.min(10, Math.max(4, Math.floor(parsed)));
    }

    function peekRoot(value) {
        let current = value;

        while (parent[current] !== current) {
            current = parent[current];
        }

        return current;
    }

    function findWithCompression(value) {
        const path = [];
        let current = value;

        while (parent[current] !== current) {
            path.push(current);
            current = parent[current];
        }

        const root = current;

        path.forEach(function (node) {
            parent[node] = root;
        });

        return {
            root: root,
            path: path
        };
    }

    function createOption(value) {
        const option = document.createElement("option");

        option.value = String(value);
        option.textContent = String(value);

        return option;
    }

    function populateSelectors() {
        elementA.innerHTML = "";
        elementB.innerHTML = "";

        for (let i = 0; i < elementCount; i += 1) {
            elementA.appendChild(createOption(i));
            elementB.appendChild(createOption(i));
        }

        elementA.value = "0";
        elementB.value = elementCount > 1 ? "1" : "0";
    }

    function addHistory(text) {
        history.unshift(text);
        history = history.slice(0, 10);
    }

    function renderHistory() {
        historyList.innerHTML = "";

        history.forEach(function (entry) {
            const item = document.createElement("li");

            item.textContent = entry;
            historyList.appendChild(item);
        });
    }

    function buildGroups() {
        const groups = new Map();

        for (let i = 0; i < elementCount; i += 1) {
            const root = peekRoot(i);

            if (!groups.has(root)) {
                groups.set(root, []);
            }

            groups.get(root).push(i);
        }

        return groups;
    }

    function renderGroups(groups) {
        setGroups.innerHTML = "";

        groups.forEach(function (members, root) {
            const card = document.createElement("article");
            card.className = "dsu-set-card";

            const label = document.createElement("span");
            label.textContent = "Representative " + root;

            const values = document.createElement("strong");
            values.textContent = "{" + members.join(", ") + "}";

            card.appendChild(label);
            card.appendChild(values);
            setGroups.appendChild(card);
        });
    }

    function renderArrays() {
        arrayView.innerHTML = "";

        for (let i = 0; i < elementCount; i += 1) {
            const cell = document.createElement("div");
            cell.className = "dsu-array-cell";

            if (parent[i] === i) {
                cell.classList.add("root-cell");
            }

            const index = document.createElement("span");
            index.textContent = "Element " + i;

            const details = document.createElement("strong");
            details.textContent =
                "Parent: " + parent[i] + " | Rank: " + rank[i];

            cell.appendChild(index);
            cell.appendChild(details);
            arrayView.appendChild(cell);
        }
    }

    function renderForest(groups) {
        forestView.innerHTML = "";

        groups.forEach(function (members, root) {
            const tree = document.createElement("article");
            tree.className = "dsu-visual-tree";

            const rootNode = document.createElement("div");
            rootNode.className = "dsu-visual-root";
            rootNode.textContent = String(root);

            tree.appendChild(rootNode);

            const links = document.createElement("div");
            links.className = "dsu-visual-links";

            members.forEach(function (member) {
                if (member === root) {
                    return;
                }

                const node = document.createElement("span");

                node.textContent =
                    member + " → " + parent[member];

                links.appendChild(node);
            });

            if (members.length === 1) {
                const singleton = document.createElement("span");

                singleton.className = "singleton-label";
                singleton.textContent = "Singleton";

                links.appendChild(singleton);
            }

            tree.appendChild(links);
            forestView.appendChild(tree);
        });
    }

    function renderState() {
        const groups = buildGroups();

        renderGroups(groups);
        renderArrays();
        renderForest(groups);
        renderHistory();
    }

    function setMessage(text, type) {
        message.textContent = text;
        message.className = "dsu-action-message";

        if (type) {
            message.classList.add(type);
        }
    }

    function initializeSets() {
        elementCount = clampCount(countInput.value);
        countInput.value = String(elementCount);

        parent = [];
        rank = [];

        for (let i = 0; i < elementCount; i += 1) {
            parent[i] = i;
            rank[i] = 0;
        }

        history = [
            "Initialized " +
            elementCount +
            " singleton sets."
        ];

        populateSelectors();
        renderState();

        setMessage(
            "Each element is now its own representative.",
            "success-message"
        );

        prompt.hidden = true;
        workspace.hidden = false;
    }

    function selectedValues() {
        return {
            a: Number(elementA.value),
            b: Number(elementB.value)
        };
    }

    function unionSelected() {
        const values = selectedValues();

        const resultA =
            findWithCompression(values.a);

        const resultB =
            findWithCompression(values.b);

        const rootA = resultA.root;
        const rootB = resultB.root;

        if (rootA === rootB) {
            const text =
                "Union(" +
                values.a +
                ", " +
                values.b +
                "): already connected through root " +
                rootA +
                ".";

            addHistory(text);
            setMessage(text, "neutral-message");
            renderState();

            return;
        }

        let newRoot;

        if (rank[rootA] < rank[rootB]) {
            parent[rootA] = rootB;
            newRoot = rootB;
        } else if (rank[rootA] > rank[rootB]) {
            parent[rootB] = rootA;
            newRoot = rootA;
        } else {
            parent[rootB] = rootA;
            rank[rootA] += 1;
            newRoot = rootA;
        }

        const text =
            "Union(" +
            values.a +
            ", " +
            values.b +
            ") merged roots " +
            rootA +
            " and " +
            rootB +
            "; new representative: " +
            newRoot +
            ".";

        addHistory(text);
        setMessage(text, "success-message");
        renderState();
    }

    function findSelected() {
        const value = Number(elementA.value);
        const before = [];

        let current = value;

        before.push(current);

        while (parent[current] !== current) {
            current = parent[current];
            before.push(current);
        }

        const result =
            findWithCompression(value);

        const pathText =
            before.join(" → ");

        const text =
            "Find(" +
            value +
            ") = " +
            result.root +
            ". Traversed path: " +
            pathText +
            ". Path compressed.";

        addHistory(text);
        setMessage(text, "find-message");
        renderState();
    }

    function checkConnected() {
        const values = selectedValues();

        const rootA =
            findWithCompression(values.a).root;

        const rootB =
            findWithCompression(values.b).root;

        const connected =
            rootA === rootB;

        const text = connected
            ? values.a +
              " and " +
              values.b +
              " are connected through representative " +
              rootA +
              "."
            : values.a +
              " and " +
              values.b +
              " are not connected (roots " +
              rootA +
              " and " +
              rootB +
              ").";

        addHistory(text);

        setMessage(
            text,
            connected
                ? "success-message"
                : "warning-message"
        );

        renderState();
    }

    if (initializeButton) {
        initializeButton.addEventListener(
            "click",
            initializeSets
        );
    }

    if (unionButton) {
        unionButton.addEventListener(
            "click",
            unionSelected
        );
    }

    if (findButton) {
        findButton.addEventListener(
            "click",
            findSelected
        );
    }

    if (connectedButton) {
        connectedButton.addEventListener(
            "click",
            checkConnected
        );
    }

    if (resetButton) {
        resetButton.addEventListener(
            "click",
            initializeSets
        );
    }

    if (countInput) {
        countInput.addEventListener(
            "input",
            function () {
                if (workspace) {
                    workspace.hidden = true;
                }

                if (prompt) {
                    prompt.hidden = false;

                    prompt.innerHTML =
                        "Element count changed. Click " +
                        "<strong>Initialize Sets</strong> " +
                        "to rebuild the structure.";
                }
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
                    const willOpen = target.hidden;

                    target.hidden = !willOpen;

                    button.setAttribute(
                        "aria-expanded",
                        String(willOpen)
                    );

                    if (willOpen) {
                        button.textContent =
                            target.classList.contains(
                                "ads-hint-box"
                            )
                                ? "Hide Hint"
                                : "Hide Answer";
                    } else {
                        button.textContent =
                            button.dataset.originalLabel;
                    }
                }
            );
        });

    if (workspace) {
        workspace.hidden = true;
    }

    if (prompt) {
        prompt.hidden = false;
    }
}());
