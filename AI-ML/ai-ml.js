(function () {
    "use strict";

    const MOBILE_BREAKPOINT = 880;
    const PROGRESS_KEY = "codebhavya-aiml-course-progress-v1";

    function normalizeText(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/[–—&]/g, " ")
            .replace(/[^a-z0-9+# ]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function initializeSidebar() {
        const toggle = document.getElementById("aimlSidebarToggle");
        const sidebar = document.getElementById("aimlSidebar");
        const backdrop = document.getElementById("aimlDrawerBackdrop");

        if (!toggle || !sidebar) {
            return;
        }

        function setOpen(open) {
            const shouldOpen = Boolean(
                open && window.innerWidth <= MOBILE_BREAKPOINT
            );

            sidebar.classList.toggle("is-open", shouldOpen);
            document.body.classList.toggle(
                "aiml-drawer-open",
                shouldOpen
            );

            toggle.setAttribute(
                "aria-expanded",
                String(shouldOpen)
            );

            toggle.textContent = shouldOpen
                ? "✕ Close AI & ML Topics"
                : "☰ AI & ML Topics";

            if (backdrop) {
                backdrop.tabIndex = shouldOpen ? 0 : -1;
                backdrop.setAttribute(
                    "aria-hidden",
                    String(!shouldOpen)
                );
            }
        }

        toggle.addEventListener("click", function () {
            setOpen(!sidebar.classList.contains("is-open"));
        });

        if (backdrop) {
            backdrop.addEventListener("click", function () {
                setOpen(false);
                toggle.focus();
            });
        }

        sidebar.addEventListener("click", function (event) {
            if (
                event.target.closest("a") &&
                window.innerWidth <= MOBILE_BREAKPOINT
            ) {
                setOpen(false);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (
                event.key === "Escape" &&
                sidebar.classList.contains("is-open")
            ) {
                setOpen(false);
                toggle.focus();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > MOBILE_BREAKPOINT) {
                setOpen(false);
            }
        });
    }

    function initializeSearch() {
        const input = document.getElementById("topicSearch");

        const cards = Array.from(
            document.querySelectorAll(".aiml-topic-card")
        );

        const allSidebarLinks = Array.from(
            document.querySelectorAll(".aiml-topic-link")
        );

        const links = allSidebarLinks.filter(function (link) {
            return Boolean(link.dataset.level);
        });

        const sidebarGroups = Array.from(
            document.querySelectorAll(".aiml-sidebar-group")
        );

        const sections = Array.from(
            document.querySelectorAll(".aiml-level-section")
        );

        const sidebarEmpty =
            document.getElementById("aimlSidebarEmpty");

        const mainEmpty =
            document.getElementById("aimlNoResults");

        if (!input) {
            return;
        }

        function filterTopics() {
            const query = normalizeText(input.value);

            let visibleCount = 0;
            let visibleSidebarCount = 0;

            cards.forEach(function (card) {
                const searchable = normalizeText(
                    (card.dataset.topic || "") +
                    " " +
                    card.textContent
                );

                const matches =
                    !query || searchable.includes(query);

                card.classList.toggle(
                    "is-search-hidden",
                    !matches
                );

                card.classList.toggle(
                    "is-search-match",
                    Boolean(query && matches)
                );

                if (matches) {
                    visibleCount += 1;
                }
            });

            links.forEach(function (link) {
                const level = link.dataset.level;

                const card = document.querySelector(
                    '.aiml-topic-card[data-level="' +
                    level +
                    '"]'
                );

                const hidden = Boolean(
                    card &&
                    card.classList.contains(
                        "is-search-hidden"
                    )
                );

                link.classList.toggle(
                    "is-search-hidden",
                    hidden
                );
            });

            allSidebarLinks
                .filter(function (link) {
                    return !link.dataset.level;
                })
                .forEach(function (link) {
                    const matches =
                        !query ||
                        normalizeText(
                            link.textContent
                        ).includes(query);

                    link.classList.toggle(
                        "is-search-hidden",
                        !matches
                    );
                });

            visibleSidebarCount =
                allSidebarLinks.filter(function (link) {
                    return !link.classList.contains(
                        "is-search-hidden"
                    );
                }).length;

            sidebarGroups.forEach(function (group) {
                let sibling = group.nextElementSibling;
                let hasVisibleLink = false;

                while (
                    sibling &&
                    !sibling.classList.contains(
                        "aiml-sidebar-group"
                    )
                ) {
                    if (
                        sibling.classList.contains(
                            "aiml-topic-link"
                        ) &&
                        !sibling.classList.contains(
                            "is-search-hidden"
                        )
                    ) {
                        hasVisibleLink = true;
                    }

                    sibling = sibling.nextElementSibling;
                }

                group.classList.toggle(
                    "is-search-hidden",
                    Boolean(query && !hasVisibleLink)
                );
            });

            sections.forEach(function (section) {
                const hasMatch = Boolean(
                    section.querySelector(
                        ".aiml-topic-card:not(.is-search-hidden)"
                    )
                );

                section.classList.toggle(
                    "is-search-hidden",
                    Boolean(query && !hasMatch)
                );
            });

            if (sidebarEmpty) {
                sidebarEmpty.hidden =
                    !query || visibleSidebarCount > 0;
            }

            if (mainEmpty) {
                mainEmpty.hidden =
                    !query || visibleCount > 0;
            }
        }

        input.addEventListener("input", filterTopics);
        input.addEventListener("search", filterTopics);
    }

    function loadProgress() {
        try {
            const saved = JSON.parse(
                window.localStorage.getItem(
                    PROGRESS_KEY
                ) || "[]"
            );

            if (!Array.isArray(saved)) {
                return [];
            }

            return saved
                .map(Number)
                .filter(function (level) {
                    return (
                        Number.isInteger(level) &&
                        level >= 1 &&
                        level <= 26
                    );
                })
                .filter(function (
                    level,
                    index,
                    values
                ) {
                    return (
                        values.indexOf(level) ===
                        index
                    );
                })
                .sort(function (first, second) {
                    return first - second;
                });
        } catch (error) {
            return [];
        }
    }

    function saveProgress(levels) {
        try {
            window.localStorage.setItem(
                PROGRESS_KEY,
                JSON.stringify(levels)
            );
        } catch (error) {
            /*
             * Progress remains available for the
             * current page session.
             */
        }
    }

    function initializeProgress() {
        const buttons = Array.from(
            document.querySelectorAll(
                "[data-complete-level]"
            )
        );

        const cards = Array.from(
            document.querySelectorAll(
                ".aiml-topic-card[data-level]"
            )
        );

        const count =
            document.getElementById(
                "aimlCompletedCount"
            );

        const bar =
            document.getElementById(
                "aimlProgressBar"
            );

        const track =
            document.getElementById(
                "aimlProgressTrack"
            );

        let completed = loadProgress();

        function renderProgress() {
            const completedSet =
                new Set(completed);

            const percentage = Math.round(
                (completed.length / 26) * 100
            );

            buttons.forEach(function (button) {
                const level = Number(
                    button.dataset.completeLevel
                );

                const isComplete =
                    completedSet.has(level);

                button.setAttribute(
                    "aria-pressed",
                    String(isComplete)
                );

                button.textContent = isComplete
                    ? "✓ Completed"
                    : "Mark Complete";
            });

            cards.forEach(function (card) {
                card.classList.toggle(
                    "is-complete",
                    completedSet.has(
                        Number(card.dataset.level)
                    )
                );
            });

            if (count) {
                count.textContent =
                    String(completed.length);
            }

            if (bar) {
                bar.style.width =
                    percentage + "%";
            }

            if (track) {
                track.setAttribute(
                    "aria-valuenow",
                    String(percentage)
                );

                track.setAttribute(
                    "aria-label",
                    completed.length +
                    " of 26 AI and ML levels completed"
                );
            }
        }

        buttons.forEach(function (button) {
            button.addEventListener(
                "click",
                function () {
                    const level = Number(
                        button.dataset.completeLevel
                    );

                    const position =
                        completed.indexOf(level);

                    if (position === -1) {
                        completed.push(level);

                        completed.sort(
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
                    } else {
                        completed.splice(
                            position,
                            1
                        );
                    }

                    saveProgress(completed);
                    renderProgress();
                }
            );
        });

        renderProgress();
    }

    const atlasContent = {
        supervised: {
            eyebrow: "SUPERVISED LEARNING",
            title: "Learn from labelled examples",

            description:
                "Predict continuous values or known classes, then measure how well the model generalizes to unseen data.",

            algorithms: [
                "Linear Regression",
                "Logistic Regression",
                "k-NN",
                "Naive Bayes",
                "Decision Trees",
                "Random Forest",
                "SVM",
                "Boosting"
            ],

            question:
                "Is the target continuous or categorical, and what trade-off is required between accuracy, speed and interpretability?"
        },

        unsupervised: {
            eyebrow:
                "UNSUPERVISED & REPRESENTATION LEARNING",

            title:
                "Discover structure without labels",

            description:
                "Group similar observations, compress features, expose latent structure and identify unusual behaviour.",

            algorithms: [
                "K-Means",
                "Hierarchical Clustering",
                "DBSCAN",
                "Gaussian Mixtures",
                "PCA",
                "SVD",
                "Isolation Forest",
                "One-Class SVM"
            ],

            question:
                "Are you looking for groups, a compact representation, an anomaly score or a useful visualization?"
        },

        deep: {
            eyebrow: "DEEP LEARNING",

            title:
                "Learn representations through layers",

            description:
                "Use differentiable networks to learn complex patterns in images, sequences, language and multimodal data.",

            algorithms: [
                "Perceptron",
                "MLP",
                "Backpropagation",
                "CNN",
                "RNN",
                "LSTM",
                "GRU",
                "Transfer Learning"
            ],

            question:
                "What structure exists in the input—spatial, sequential or general—and how much labelled data and compute are available?"
        },

        language: {
            eyebrow:
                "LANGUAGE & GENERATIVE AI",

            title:
                "Represent, retrieve and generate knowledge",

            description:
                "Progress from statistical text features to attention, transformers, large language models and grounded AI applications.",

            algorithms: [
                "TF-IDF",
                "Word2Vec",
                "Self-Attention",
                "Transformers",
                "Fine-Tuning",
                "Vector Search",
                "RAG",
                "Agent Loops"
            ],

            question:
                "Does the task require classification, semantic retrieval, controlled generation or multi-step tool use?"
        },

        decision: {
            eyebrow:
                "SEARCH, REASONING & REINFORCEMENT LEARNING",

            title:
                "Choose actions to reach better outcomes",

            description:
                "Search state spaces, reason under constraints and learn policies from rewards and interaction.",

            algorithms: [
                "Uniform-Cost Search",
                "Greedy Search",
                "A*",
                "Minimax",
                "Alpha–Beta",
                "Value Iteration",
                "Q-Learning",
                "DQN"
            ],

            question:
                "Is the environment known, adversarial or uncertain, and can the agent learn safely through interaction?"
        }
    };

    function initializeAtlas() {
        const tabs = Array.from(
            document.querySelectorAll(
                "[data-atlas]"
            )
        );

        const eyebrow =
            document.getElementById(
                "aimlAtlasEyebrow"
            );

        const title =
            document.getElementById(
                "aimlAtlasTitle"
            );

        const description =
            document.getElementById(
                "aimlAtlasDescription"
            );

        const algorithms =
            document.getElementById(
                "aimlAtlasAlgorithms"
            );

        const question =
            document.getElementById(
                "aimlAtlasQuestion"
            );

        if (!tabs.length || !algorithms) {
            return;
        }

        function selectAtlas(name) {
            const selected =
                atlasContent[name] ||
                atlasContent.supervised;

            tabs.forEach(function (tab) {
                const isActive =
                    tab.dataset.atlas === name;

                tab.classList.toggle(
                    "is-active",
                    isActive
                );

                tab.setAttribute(
                    "aria-selected",
                    String(isActive)
                );

                tab.tabIndex =
                    isActive ? 0 : -1;
            });

            if (eyebrow) {
                eyebrow.textContent =
                    selected.eyebrow;
            }

            if (title) {
                title.textContent =
                    selected.title;
            }

            if (description) {
                description.textContent =
                    selected.description;
            }

            if (question) {
                question.textContent =
                    selected.question;
            }

            algorithms.replaceChildren();

            selected.algorithms.forEach(
                function (algorithm) {
                    const chip =
                        document.createElement(
                            "span"
                        );

                    chip.textContent = algorithm;
                    algorithms.appendChild(chip);
                }
            );
        }

        tabs.forEach(function (tab, index) {
            tab.addEventListener(
                "click",
                function () {
                    selectAtlas(
                        tab.dataset.atlas
                    );
                }
            );

            tab.addEventListener(
                "keydown",
                function (event) {
                    if (
                        event.key !==
                            "ArrowRight" &&
                        event.key !==
                            "ArrowLeft"
                    ) {
                        return;
                    }

                    event.preventDefault();

                    const direction =
                        event.key ===
                        "ArrowRight"
                            ? 1
                            : -1;

                    const nextIndex =
                        (
                            index +
                            direction +
                            tabs.length
                        ) %
                        tabs.length;

                    tabs[nextIndex].focus();

                    selectAtlas(
                        tabs[nextIndex]
                            .dataset.atlas
                    );
                }
            );
        });
    }

    const trainingPoints = [
        { x: 1, y: 21 },
        { x: 2, y: 33 },
        { x: 3, y: 42 },
        { x: 4, y: 57 },
        { x: 5, y: 67 },
        { x: 6, y: 81 },
        { x: 7, y: 92 }
    ];

    const trainingStates = [
        {
            slope: 0,
            bias: 10,
            caption: "Initial model",
            status: "Ready",

            explanation:
                "The model begins with a poor line. Gradient descent will measure the error and update the slope and bias."
        },
        {
            slope: 2.2,
            bias: 11,
            caption: "Large underfit",
            status: "Loss measured",

            explanation:
                "Predictions are far below most points. The positive gradient tells the model to increase the slope."
        },
        {
            slope: 4.8,
            bias: 11.2,
            caption: "Slope increasing",
            status: "Parameters updated",

            explanation:
                "A parameter update rotates the line upward. The error falls because predictions move closer to the observations."
        },
        {
            slope: 7.2,
            bias: 10.8,
            caption: "Learning the trend",
            status: "Training",

            explanation:
                "The model has discovered the direction of the relationship, but its predictions are still too low for larger inputs."
        },
        {
            slope: 9.1,
            bias: 10.1,
            caption: "Error shrinking",
            status: "Training",

            explanation:
                "Repeated prediction, loss and gradient steps continue reducing the average squared error."
        },
        {
            slope: 10.5,
            bias: 9.5,
            caption: "Near the data",
            status: "Converging",

            explanation:
                "The line now follows the data closely. Smaller updates are needed as the model approaches a minimum."
        },
        {
            slope: 11.4,
            bias: 8.9,
            caption: "Fine adjustment",
            status: "Converging",

            explanation:
                "Gradient descent fine-tunes both parameters. The remaining errors come partly from natural variation in the observations."
        },
        {
            slope: 11.9,
            bias: 8.3,
            caption: "Almost converged",
            status: "Final update",

            explanation:
                "The gradient is now small. One final update produces a stable line with a low training loss."
        },
        {
            slope: 12.1,
            bias: 7.8,
            caption: "Model fitted",
            status: "Complete",

            explanation:
                "Training is complete. The learned equation can now estimate a score for a new number of study hours."
        }
    ];

    function initializeRegressionVisualizer() {
        const chart =
            document.getElementById(
                "aimlRegressionChart"
            );

        const pointsGroup =
            document.getElementById(
                "aimlDataPoints"
            );

        const line =
            document.getElementById(
                "aimlRegressionLine"
            );

        const caption =
            document.getElementById(
                "aimlChartCaption"
            );

        const status =
            document.getElementById(
                "aimlTrainingStatus"
            );

        const stepValue =
            document.getElementById(
                "aimlStepValue"
            );

        const slopeValue =
            document.getElementById(
                "aimlSlopeValue"
            );

        const biasValue =
            document.getElementById(
                "aimlBiasValue"
            );

        const lossValue =
            document.getElementById(
                "aimlLossValue"
            );

        const explanation =
            document.getElementById(
                "aimlTrainingExplanation"
            );

        const previous =
            document.getElementById(
                "aimlPreviousStep"
            );

        const next =
            document.getElementById(
                "aimlNextStep"
            );

        const auto =
            document.getElementById(
                "aimlAutoRun"
            );

        const pause =
            document.getElementById(
                "aimlPauseRun"
            );

        const reset =
            document.getElementById(
                "aimlResetLab"
            );

        const progressText =
            document.getElementById(
                "aimlLabProgressText"
            );

        let currentStep = 0;
        let timer = null;

        if (
            !chart ||
            !pointsGroup ||
            !line ||
            !next ||
            !auto
        ) {
            return;
        }

        function scaleX(value) {
            return (
                70 +
                (value / 7) * 595
            );
        }

        function scaleY(value) {
            const bounded = Math.max(
                0,
                Math.min(100, value)
            );

            return (
                350 -
                (bounded / 100) * 300
            );
        }

        function calculateLoss(state) {
            const total =
                trainingPoints.reduce(
                    function (sum, point) {
                        const prediction =
                            state.slope *
                                point.x +
                            state.bias;

                        const error =
                            point.y -
                            prediction;

                        return (
                            sum +
                            error * error
                        );
                    },
                    0
                );

            return (
                total /
                trainingPoints.length
            );
        }

        function drawPoints() {
            const svgNamespace =
                "http://www.w3.org/2000/svg";

            pointsGroup.replaceChildren();

            trainingPoints.forEach(
                function (point) {
                    const circle =
                        document.createElementNS(
                            svgNamespace,
                            "circle"
                        );

                    circle.setAttribute(
                        "cx",
                        String(scaleX(point.x))
                    );

                    circle.setAttribute(
                        "cy",
                        String(scaleY(point.y))
                    );

                    circle.setAttribute(
                        "r",
                        "7"
                    );

                    circle.setAttribute(
                        "tabindex",
                        "0"
                    );

                    circle.setAttribute(
                        "aria-label",
                        point.x +
                        " study hours, score " +
                        point.y
                    );

                    pointsGroup.appendChild(
                        circle
                    );
                }
            );
        }

        function stopAutoRun() {
            if (timer !== null) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        function renderStep() {
            const state =
                trainingStates[currentStep];

            const finalStep =
                trainingStates.length - 1;

            const predictionAtStart =
                state.bias;

            const predictionAtEnd =
                state.slope * 7 +
                state.bias;

            line.setAttribute(
                "x1",
                String(scaleX(0))
            );

            line.setAttribute(
                "y1",
                String(
                    scaleY(
                        predictionAtStart
                    )
                )
            );

            line.setAttribute(
                "x2",
                String(scaleX(7))
            );

            line.setAttribute(
                "y2",
                String(
                    scaleY(
                        predictionAtEnd
                    )
                )
            );

            if (caption) {
                caption.textContent =
                    state.caption;
            }

            if (status) {
                status.textContent =
                    state.status;
            }

            if (stepValue) {
                stepValue.textContent =
                    currentStep +
                    " / " +
                    finalStep;
            }

            if (slopeValue) {
                slopeValue.textContent =
                    state.slope.toFixed(2);
            }

            if (biasValue) {
                biasValue.textContent =
                    state.bias.toFixed(2);
            }

            if (lossValue) {
                lossValue.textContent =
                    calculateLoss(
                        state
                    ).toFixed(2);
            }

            if (explanation) {
                explanation.textContent =
                    state.explanation;
            }

            if (progressText) {
                progressText.textContent =
                    "Step " +
                    currentStep +
                    " of " +
                    finalStep;
            }

            previous.disabled =
                currentStep === 0;

            next.disabled =
                currentStep === finalStep;

            auto.disabled =
                currentStep === finalStep ||
                timer !== null;

            pause.disabled =
                timer === null;

            if (
                currentStep === finalStep
            ) {
                stopAutoRun();
                auto.disabled = true;
                pause.disabled = true;
            }
        }

        function moveNext() {
            if (
                currentStep <
                trainingStates.length - 1
            ) {
                currentStep += 1;
                renderStep();
            }
        }

        function startAutoRun() {
            if (
                timer !== null ||
                currentStep >=
                    trainingStates.length - 1
            ) {
                return;
            }

            timer = window.setInterval(
                function () {
                    moveNext();

                    if (
                        currentStep >=
                        trainingStates.length - 1
                    ) {
                        stopAutoRun();
                        renderStep();
                    }
                },
                850
            );

            renderStep();
        }

        previous.addEventListener(
            "click",
            function () {
                stopAutoRun();

                if (currentStep > 0) {
                    currentStep -= 1;
                    renderStep();
                }
            }
        );

        next.addEventListener(
            "click",
            function () {
                stopAutoRun();
                moveNext();
            }
        );

        auto.addEventListener(
            "click",
            startAutoRun
        );

        pause.addEventListener(
            "click",
            function () {
                stopAutoRun();
                renderStep();
            }
        );

        reset.addEventListener(
            "click",
            function () {
                stopAutoRun();
                currentStep = 0;
                renderStep();
            }
        );

        drawPoints();
        renderStep();
    }

    function initializeSmoothNavigation() {
        document
            .querySelectorAll(
                'a[href^="#"]'
            )
            .forEach(function (link) {
                link.addEventListener(
                    "click",
                    function (event) {
                        const selector =
                            link.getAttribute(
                                "href"
                            );

                        if (
                            !selector ||
                            selector === "#"
                        ) {
                            return;
                        }

                        const target =
                            document.querySelector(
                                selector
                            );

                        if (!target) {
                            return;
                        }

                        event.preventDefault();

                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }
                );
            });
    }

    initializeSidebar();
    initializeSearch();
    initializeProgress();
    initializeAtlas();
    initializeRegressionVisualizer();
    initializeSmoothNavigation();
}());
