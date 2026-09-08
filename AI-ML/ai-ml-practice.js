(function () {
    "use strict";

    const JUDGE0_BASE = "https://ce.judge0.com";
    const PYTHON_LANGUAGE_ID = 71;
    const POINTS = 100;
    const get = function (id) { return document.getElementById(id); };

    function html(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
    }

    const LEVELS = [
        { id: 1, stage: "Foundation Practice", stageText: "Build numerical and data confidence before model algorithms.", icon: "🐍", name: "Python Data Foundations", topic: "Data Foundations", desc: "Lists, records, aggregation, cleaning and deterministic splits." },
        { id: 2, stage: "Foundation Practice", stageText: "Build numerical and data confidence before model algorithms.", icon: "📐", name: "Linear Algebra for ML", topic: "Linear Algebra", desc: "Vectors, matrices, distance, similarity and projection." },
        { id: 3, stage: "Foundation Practice", stageText: "Build numerical and data confidence before model algorithms.", icon: "🎲", name: "Probability & Statistics", topic: "Statistics", desc: "Summary statistics, probability, entropy and standard scores." },
        { id: 4, stage: "Data Practice", stageText: "Prepare reliable learning evidence without leakage.", icon: "🧹", name: "Data Preparation", topic: "Data Preparation", desc: "Encoding, scaling, missing values, outliers and group-safe splits." },
        { id: 5, stage: "Core ML Practice", stageText: "Implement supervised learning calculations from first principles.", icon: "🎯", name: "Regression & Classification", topic: "Supervised ML", desc: "Predictions, losses, gradients, probabilities and metrics." },
        { id: 6, stage: "Core ML Practice", stageText: "Implement supervised learning calculations from first principles.", icon: "🌳", name: "Neighbours, Bayes & Trees", topic: "Core Algorithms", desc: "Local voting, likelihoods, impurity and split decisions." },
        { id: 7, stage: "Core ML Practice", stageText: "Implement supervised learning calculations from first principles.", icon: "⚡", name: "SVM, Ensembles & Tuning", topic: "Model Selection", desc: "Margins, voting, folds, grids and stable selection." },
        { id: 8, stage: "Evaluation Practice", stageText: "Measure models honestly and diagnose decision quality.", icon: "🧪", name: "Evaluation & Calibration", topic: "Evaluation", desc: "Confusion evidence, ranking, probability quality and thresholds." },
        { id: 9, stage: "Applied ML Practice", stageText: "Discover structure, compress evidence and detect unusual cases.", icon: "🫧", name: "Unsupervised Learning", topic: "Unsupervised ML", desc: "Clustering, centroids, projection, reconstruction and anomalies." },
        { id: 10, stage: "Applied ML Practice", stageText: "Build ranking and sequential calculations for real applications.", icon: "🎬", name: "Recommendations & Time Series", topic: "Applied ML", desc: "Similarity, ranking, lags, moving windows and forecast error." },
        { id: 11, stage: "Modern AI Practice", stageText: "Trace essential neural, language and retrieval calculations.", icon: "🧠", name: "Neural, NLP & Generative AI", topic: "Modern AI", desc: "Activations, softmax, convolution, text features and retrieval." },
        { id: 12, stage: "Placement Practice", stageText: "Finish with integrated AI engineering and interview problems.", icon: "🏆", name: "AI Systems & Placement", topic: "Placement", desc: "Search, reinforcement learning, monitoring, release gates and project evidence." }
    ];

    function problem(level, title, skill, task, inputFormat, outputFormat, sampleInput, sampleOutput, hint, solution, tests, difficulty) {
        return {
            level: level,
            title: title,
            skill: skill,
            task: task,
            inputFormat: inputFormat,
            outputFormat: outputFormat,
            sampleInput: sampleInput,
            sampleOutput: sampleOutput,
            hint: hint,
            solution: solution,
            tests: tests,
            difficulty: difficulty || (level <= 3 ? "Easy" : (level <= 8 ? "Medium" : "Hard")),
            story: "CodeBhavya AI Lab needs a transparent numerical utility. " + task,
            constraints: "Use only Python's standard library. Follow the exact input and output contract."
        };
    }

    const PROBLEMS = [
        problem(1, "Student Score Mean", "Aggregation", "Read N scores and print their arithmetic mean to two decimal places.", "Line 1: N. Line 2: N space-separated scores.", "Print Mean = value with two decimals.", "5\n72 81 69 90 88", "Mean = 80.00", "Use sum(scores) / N.", "n = int(input())\nscores = list(map(float, input().split()))\nprint(f\"Mean = {sum(scores) / n:.2f}\")", [["3\n10 20 30", "Mean = 20.00"], ["4\n1.5 2.5 3.5 4.5", "Mean = 3.00"]]),
        problem(1, "Feature Range Report", "Minimum and Maximum", "Read a feature vector and print its minimum, maximum and range.", "One line of space-separated integers.", "Print Min, Max and Range on separate lines.", "8 3 11 5 9", "Min = 3\nMax = 11\nRange = 8", "Range is maximum minus minimum.", "values = list(map(int, input().split()))\nlow, high = min(values), max(values)\nprint(f\"Min = {low}\")\nprint(f\"Max = {high}\")\nprint(f\"Range = {high - low}\")", [["4 4 4", "Min = 4\nMax = 4\nRange = 0"], ["-5 2 9 -1", "Min = -5\nMax = 9\nRange = 14"]]),
        problem(1, "Stable Unique Labels", "Order-Preserving Deduplication", "Read labels and print each distinct label once in first-seen order.", "One line of space-separated labels.", "Print unique labels separated by one space.", "cat dog cat bird dog", "cat dog bird", "Maintain a set for membership and a list for order.", "labels = input().split()\nseen, unique = set(), []\nfor label in labels:\n    if label not in seen:\n        seen.add(label)\n        unique.append(label)\nprint(*unique)", [["a a a", "a"], ["high low medium high", "high low medium"]]),
        problem(1, "Column Missing-Value Fill", "Mean Imputation", "Replace every NA token with the mean of the observed values and print two decimals.", "One line containing numbers or NA.", "Print the completed vector with two decimals.", "10 NA 20 30 NA", "10.00 20.00 20.00 30.00 20.00", "Calculate the mean before replacing missing entries.", "tokens = input().split()\nobserved = [float(x) for x in tokens if x != 'NA']\nmean = sum(observed) / len(observed)\nfilled = [mean if x == 'NA' else float(x) for x in tokens]\nprint(*[f\"{x:.2f}\" for x in filled])", [["NA 4 8", "6.00 4.00 8.00"], ["1 2 3", "1.00 2.00 3.00"]]),
        problem(1, "Deterministic Holdout", "Sequential Train-Test Split", "Place the first N−K IDs in training and the last K IDs in test.", "Line 1: IDs separated by spaces. Line 2: K.", "Print Train and Test ID lines.", "s1 s2 s3 s4 s5\n2", "Train: s1 s2 s3\nTest: s4 s5", "Use slicing with split index len(ids) - K.", "ids = input().split()\nk = int(input())\ncut = len(ids) - k\nprint('Train:', *ids[:cut])\nprint('Test:', *ids[cut:])", [["a b c\n1", "Train: a b\nTest: c"], ["u1 u2 u3 u4\n3", "Train: u1\nTest: u2 u3 u4"]]),

        problem(2, "Vector Dot Product", "Dot Product", "Calculate the dot product of two equal-length vectors.", "Two lines of space-separated numbers.", "Print Dot = value to two decimals.", "1 2 3\n4 5 6", "Dot = 32.00", "Multiply corresponding values and sum.", "a = list(map(float, input().split()))\nb = list(map(float, input().split()))\nprint(f\"Dot = {sum(x*y for x, y in zip(a, b)):.2f}\")", [["1 0\n5 8", "Dot = 5.00"], ["-1 2\n3 4", "Dot = 5.00"]]),
        problem(2, "Matrix-Vector Prediction", "Matrix-Vector Multiplication", "Multiply every matrix row by a vector and print the resulting values.", "Line 1: rows R and columns C. Next R lines: matrix. Final line: vector.", "Print the result vector with two decimals.", "2 3\n1 2 3\n4 5 6\n1 0 2", "7.00 16.00", "Take one dot product per matrix row.", "r, c = map(int, input().split())\nmatrix = [list(map(float, input().split())) for _ in range(r)]\nvector = list(map(float, input().split()))\nresult = [sum(row[j]*vector[j] for j in range(c)) for row in matrix]\nprint(*[f\"{x:.2f}\" for x in result])", [["1 2\n3 4\n2 1", "10.00"], ["3 1\n2\n-1\n5\n4", "8.00 -4.00 20.00"]]),
        problem(2, "Feature Matrix Transpose", "Matrix Transpose", "Transpose an R×C integer matrix.", "Line 1: R C. Next R lines: matrix rows.", "Print C rows of the transposed matrix.", "2 3\n1 2 3\n4 5 6", "1 4\n2 5\n3 6", "Output matrix[j][i] for each new row.", "r, c = map(int, input().split())\na = [list(map(int, input().split())) for _ in range(r)]\nfor j in range(c):\n    print(*[a[i][j] for i in range(r)])", [["1 3\n7 8 9", "7\n8\n9"], ["2 2\n1 0\n0 1", "1 0\n0 1"]]),
        problem(2, "Euclidean Feature Distance", "L2 Distance", "Calculate Euclidean distance between two equal-length points.", "Two lines of space-separated numbers.", "Print Distance = value to three decimals.", "1 2\n4 6", "Distance = 5.000", "Square coordinate differences, sum them and take the square root.", "from math import sqrt\na = list(map(float, input().split()))\nb = list(map(float, input().split()))\nd = sqrt(sum((x-y)**2 for x, y in zip(a, b)))\nprint(f\"Distance = {d:.3f}\")", [["0 0\n3 4", "Distance = 5.000"], ["1 1 1\n1 1 1", "Distance = 0.000"]]),
        problem(2, "Cosine Similarity", "Angular Similarity", "Calculate cosine similarity between two non-zero vectors.", "Two lines of space-separated numbers.", "Print Cosine = value to four decimals.", "1 1\n1 0", "Cosine = 0.7071", "Divide the dot product by the product of both L2 norms.", "from math import sqrt\na = list(map(float, input().split()))\nb = list(map(float, input().split()))\ndot = sum(x*y for x, y in zip(a, b))\nna = sqrt(sum(x*x for x in a))\nnb = sqrt(sum(y*y for y in b))\nprint(f\"Cosine = {dot/(na*nb):.4f}\")", [["1 0\n0 1", "Cosine = 0.0000"], ["1 2 3\n2 4 6", "Cosine = 1.0000"]]),

        problem(3, "Population Variance", "Variance", "Calculate the population mean and variance of a numeric sample.", "One line of space-separated numbers.", "Print Mean and Variance to two decimals.", "2 4 6 8", "Mean = 5.00\nVariance = 5.00", "Population variance divides squared deviations by N.", "values = list(map(float, input().split()))\nmean = sum(values) / len(values)\nvariance = sum((x-mean)**2 for x in values) / len(values)\nprint(f\"Mean = {mean:.2f}\")\nprint(f\"Variance = {variance:.2f}\")", [["5 5 5", "Mean = 5.00\nVariance = 0.00"], ["1 3", "Mean = 2.00\nVariance = 1.00"]]),
        problem(3, "Conditional Probability from Counts", "Conditional Probability", "Given joint count A∩B and count B, calculate P(A|B).", "One line: joint_count b_count.", "Print P(A|B) to four decimals.", "18 30", "P(A|B) = 0.6000", "Use joint_count / b_count.", "joint, b_count = map(int, input().split())\nprint(f\"P(A|B) = {joint / b_count:.4f}\")", [["0 20", "P(A|B) = 0.0000"], ["7 7", "P(A|B) = 1.0000"]]),
        problem(3, "Binary Entropy", "Information Entropy", "Calculate binary entropy H(p) in bits; treat p=0 or p=1 as zero.", "One probability p.", "Print Entropy = value to four decimals.", "0.5", "Entropy = 1.0000", "Use −p log2(p) − (1−p) log2(1−p).", "from math import log2\np = float(input())\nif p == 0 or p == 1:\n    h = 0.0\nelse:\n    h = -p*log2(p) - (1-p)*log2(1-p)\nprint(f\"Entropy = {h:.4f}\")", [["0", "Entropy = 0.0000"], ["0.25", "Entropy = 0.8113"]]),
        problem(3, "Standard Score", "Z-Score", "Calculate the z-score of a value from a supplied mean and positive standard deviation.", "One line: value mean standard_deviation.", "Print Z = value to three decimals.", "85 70 10", "Z = 1.500", "Subtract the mean and divide by standard deviation.", "value, mean, std = map(float, input().split())\nprint(f\"Z = {(value-mean)/std:.3f}\")", [["40 50 5", "Z = -2.000"], ["12 12 3", "Z = 0.000"]]),
        problem(3, "Weighted Expected Loss", "Expected Value", "Calculate expected loss from matching probability and cost vectors.", "Line 1: probabilities. Line 2: costs.", "Print Expected Loss to two decimals.", "0.7 0.2 0.1\n0 5 20", "Expected Loss = 3.00", "Take the dot product of probability and cost.", "prob = list(map(float, input().split()))\ncost = list(map(float, input().split()))\nloss = sum(p*c for p, c in zip(prob, cost))\nprint(f\"Expected Loss = {loss:.2f}\")", [["1 0\n4 10", "Expected Loss = 4.00"], ["0.25 0.75\n8 2", "Expected Loss = 3.50"]]),

        problem(4, "Min-Max Feature Scaling", "Normalization", "Scale a vector to [0,1]; output zeros when every value is equal.", "One line of space-separated numbers.", "Print scaled values to three decimals.", "10 20 30", "0.000 0.500 1.000", "Use (x−min)/(max−min) and handle a zero range.", "values = list(map(float, input().split()))\nlow, high = min(values), max(values)\nscaled = [0.0 for _ in values] if high == low else [(x-low)/(high-low) for x in values]\nprint(*[f\"{x:.3f}\" for x in scaled])", [["4 4", "0.000 0.000"], ["-2 0 2", "0.000 0.500 1.000"]]),
        problem(4, "One-Hot Category Matrix", "Categorical Encoding", "Encode labels using sorted unique categories and print category order followed by rows.", "One line of space-separated labels.", "First print Categories, then one binary row per label.", "red blue red", "Categories: blue red\n0 1\n1 0\n0 1", "Sort the set of labels and look up each label's index.", "labels = input().split()\ncategories = sorted(set(labels))\nprint('Categories:', *categories)\nfor label in labels:\n    print(*[1 if label == c else 0 for c in categories])", [["b a", "Categories: a b\n0 1\n1 0"], ["x x", "Categories: x\n1\n1"]]),
        problem(4, "Median Missing-Value Fill", "Robust Imputation", "Replace NA with the median observed value and print one decimal.", "One line containing numbers or NA.", "Print the completed vector with one decimal.", "1 NA 100 3 NA", "1.0 3.0 100.0 3.0 3.0", "Sort observed values and compute the middle or average of two middle values.", "tokens = input().split()\nvalues = sorted(float(x) for x in tokens if x != 'NA')\nn = len(values)\nmedian = values[n//2] if n%2 else (values[n//2-1]+values[n//2])/2\nfilled = [median if x == 'NA' else float(x) for x in tokens]\nprint(*[f\"{x:.1f}\" for x in filled])", [["NA 2 4", "3.0 2.0 4.0"], ["1 2 NA 3", "1.0 2.0 2.0 3.0"]]),
        problem(4, "IQR Outlier Flags", "Robust Outlier Detection", "Using supplied Q1 and Q3, print values outside the 1.5×IQR fences.", "Line 1: Q1 Q3. Line 2: values.", "Print Outliers followed by flagged values, or None.", "10 20\n5 12 15 24 40", "Outliers: 40.0", "Compute lower=Q1−1.5×IQR and upper=Q3+1.5×IQR.", "q1, q3 = map(float, input().split())\nvalues = list(map(float, input().split()))\niqr = q3-q1\nlow, high = q1-1.5*iqr, q3+1.5*iqr\noutliers = [x for x in values if x < low or x > high]\nprint('Outliers:', *outliers) if outliers else print('Outliers: None')", [["0 4\n-7 0 2 4 11", "Outliers: -7.0 11.0"], ["1 3\n0 1 2 3 4", "Outliers: None"]]),
        problem(4, "Group Leakage Detector", "Group-Safe Splitting", "Print sorted entity IDs that occur in both train and validation sets.", "Line 1: train IDs. Line 2: validation IDs.", "Print Leakage followed by IDs, or None.", "u1 u2 u4\nu3 u4 u5", "Leakage: u4", "Take the set intersection.", "train = set(input().split())\nvalid = set(input().split())\nleaked = sorted(train & valid)\nprint('Leakage:', *leaked) if leaked else print('Leakage: None')", [["a b\nc d", "Leakage: None"], ["z a m\nm z", "Leakage: m z"]]),

        problem(5, "Linear Regression Prediction", "Linear Model", "Calculate y=w·x+b for one feature vector.", "Line 1: weights. Line 2: features. Line 3: bias.", "Print Prediction to two decimals.", "2 -1\n3 4\n5", "Prediction = 7.00", "Take the dot product and add the bias.", "weights = list(map(float, input().split()))\nfeatures = list(map(float, input().split()))\nbias = float(input())\ny = sum(w*x for w, x in zip(weights, features)) + bias\nprint(f\"Prediction = {y:.2f}\")", [["1 1\n2 3\n0", "Prediction = 5.00"], ["0.5\n8\n-1", "Prediction = 3.00"]]),
        problem(5, "Mean Squared Error", "Regression Loss", "Calculate mean squared error for actual and predicted vectors.", "Line 1: actual values. Line 2: predicted values.", "Print MSE to four decimals.", "1 2 3\n1 4 2", "MSE = 1.6667", "Average the squared residuals.", "actual = list(map(float, input().split()))\npredicted = list(map(float, input().split()))\nmse = sum((a-p)**2 for a, p in zip(actual, predicted)) / len(actual)\nprint(f\"MSE = {mse:.4f}\")", [["2 2\n2 2", "MSE = 0.0000"], ["0 1\n2 3", "MSE = 4.0000"]]),
        problem(5, "One Gradient-Descent Step", "Gradient Update", "Update one weight for squared loss using w←w−learning_rate×gradient, where gradient is 2(prediction−target)x.", "One line: w x target learning_rate.", "Print Updated Weight to four decimals.", "1 2 5 0.1", "Updated Weight = 2.2000", "Compute prediction=w*x before the gradient.", "w, x, target, lr = map(float, input().split())\nprediction = w*x\ngradient = 2*(prediction-target)*x\nw = w-lr*gradient\nprint(f\"Updated Weight = {w:.4f}\")", [["0 1 1 0.5", "Updated Weight = 1.0000"], ["2 3 6 0.1", "Updated Weight = 2.0000"]]),
        problem(5, "Sigmoid Probability", "Logistic Function", "Convert a logit into a sigmoid probability.", "One real-valued logit.", "Print Probability to four decimals.", "0", "Probability = 0.5000", "Use 1/(1+exp(−z)).", "from math import exp\nz = float(input())\np = 1/(1+exp(-z))\nprint(f\"Probability = {p:.4f}\")", [["2", "Probability = 0.8808"], ["-2", "Probability = 0.1192"]]),
        problem(5, "Precision Recall and F1", "Binary Classification Metrics", "Calculate precision, recall and F1 from TP, FP and FN counts with zero-safe denominators.", "One line: TP FP FN.", "Print Precision, Recall and F1 to four decimals.", "18 6 2", "Precision = 0.7500\nRecall = 0.9000\nF1 = 0.8182", "Precision uses TP+FP; recall uses TP+FN.", "tp, fp, fn = map(int, input().split())\nprecision = tp/(tp+fp) if tp+fp else 0\nrecall = tp/(tp+fn) if tp+fn else 0\nf1 = 2*precision*recall/(precision+recall) if precision+recall else 0\nprint(f\"Precision = {precision:.4f}\")\nprint(f\"Recall = {recall:.4f}\")\nprint(f\"F1 = {f1:.4f}\")", [["0 0 4", "Precision = 0.0000\nRecall = 0.0000\nF1 = 0.0000"], ["5 0 0", "Precision = 1.0000\nRecall = 1.0000\nF1 = 1.0000"]]),

        problem(6, "One-Dimensional k-NN", "Nearest-Neighbour Voting", "Predict a query label using the K closest one-dimensional labelled points; break vote ties alphabetically.", "Line 1: N K query. Next N lines: coordinate label.", "Print Prediction = label.", "5 3 6\n1 A\n4 A\n7 B\n9 B\n12 B", "Prediction = B", "Sort points by absolute distance, count K labels, then sort by negative count and label.", "n, k, query = map(int, input().split())\npoints = []\nfor _ in range(n):\n    x, label = input().split()\n    points.append((abs(float(x)-query), label))\nnearest = sorted(points)[:k]\ncounts = {}\nfor _, label in nearest:\n    counts[label] = counts.get(label, 0)+1\nprediction = sorted(counts, key=lambda label: (-counts[label], label))[0]\nprint('Prediction =', prediction)", [["3 1 5\n1 X\n6 Y\n9 X", "Prediction = Y"], ["4 2 0\n-1 B\n1 A\n5 A\n8 B", "Prediction = A"]]),
        problem(6, "Categorical Naive Bayes Score", "Log-Likelihood", "Add a log prior and feature log-likelihoods for each class, then print the highest-scoring class.", "Line 1: class count C. For each class: label followed by prior and feature probabilities.", "Print Prediction and each class score to four decimals in input order.", "2\nYes 0.6 0.8 0.7\nNo 0.4 0.3 0.2", "Yes = -1.0906\nNo = -3.7297\nPrediction = Yes", "Add logarithms so products become sums.", "from math import log\nc = int(input())\nscores = []\nfor _ in range(c):\n    parts = input().split()\n    label = parts[0]\n    probs = list(map(float, parts[1:]))\n    score = sum(log(p) for p in probs)\n    scores.append((label, score))\n    print(f\"{label} = {score:.4f}\")\nprint('Prediction =', max(scores, key=lambda item: item[1])[0])", [["2\nA 0.5 0.5\nB 0.5 0.25", "A = -1.3863\nB = -2.0794\nPrediction = A"], ["1\nSafe 1 0.8 0.5", "Safe = -0.9163\nPrediction = Safe"]]),
        problem(6, "Binary Gini Impurity", "Decision-Tree Impurity", "Calculate Gini impurity from negative and positive class counts.", "One line: negative_count positive_count.", "Print Gini to four decimals.", "6 4", "Gini = 0.4800", "Gini=1−p0²−p1².", "negative, positive = map(int, input().split())\ntotal = negative+positive\np0, p1 = negative/total, positive/total\nprint(f\"Gini = {1-p0*p0-p1*p1:.4f}\")", [["5 5", "Gini = 0.5000"], ["0 9", "Gini = 0.0000"]]),
        problem(6, "Weighted Split Gini", "Tree Split Evaluation", "Calculate child-weighted Gini for left and right binary class counts.", "One line: left_negative left_positive right_negative right_positive.", "Print Split Gini to four decimals.", "4 1 2 3", "Split Gini = 0.4000", "Weight each child impurity by its sample fraction.", "ln, lp, rn, rp = map(int, input().split())\ndef gini(a, b):\n    total = a+b\n    return 0 if total == 0 else 1-(a/total)**2-(b/total)**2\nleft, right = ln+lp, rn+rp\nscore = (left*gini(ln,lp)+right*gini(rn,rp))/(left+right)\nprint(f\"Split Gini = {score:.4f}\")", [["5 0 0 5", "Split Gini = 0.0000"], ["2 2 3 3", "Split Gini = 0.5000"]]),
        problem(6, "Information Gain", "Entropy Reduction", "Calculate parent entropy minus the sample-weighted child entropies.", "Line 1: parent entropy. Line 2: child sizes. Line 3: child entropies.", "Print Information Gain to four decimals.", "1.0\n4 6\n0.5 0.8", "Information Gain = 0.3200", "Divide each child size by the total before weighting entropy.", "parent = float(input())\nsizes = list(map(int, input().split()))\nentropies = list(map(float, input().split()))\ntotal = sum(sizes)\nweighted = sum(size/total*h for size, h in zip(sizes, entropies))\nprint(f\"Information Gain = {parent-weighted:.4f}\")", [["0.8\n5 5\n0.2 0.4", "Information Gain = 0.5000"], ["0.5\n3 1\n0.5 0.5", "Information Gain = 0.0000"]]),

        problem(7, "Linear SVM Margin", "Geometric Margin", "Calculate |w·x+b|/||w|| for a point and hyperplane.", "Line 1: weights. Line 2: point. Line 3: bias.", "Print Margin to four decimals.", "3 4\n1 2\n-2", "Margin = 1.8000", "Use the absolute decision score divided by the weight norm.", "from math import sqrt\nw = list(map(float, input().split()))\nx = list(map(float, input().split()))\nb = float(input())\nscore = sum(a*v for a, v in zip(w, x))+b\nnorm = sqrt(sum(a*a for a in w))\nprint(f\"Margin = {abs(score)/norm:.4f}\")", [["1 0\n3 9\n0", "Margin = 3.0000"], ["0 2\n5 1\n-2", "Margin = 0.0000"]]),
        problem(7, "Hard-Voting Ensemble", "Majority Vote", "Combine member labels by majority; break ties alphabetically.", "One line of space-separated labels.", "Print Ensemble = label.", "cat dog cat bird", "Ensemble = cat", "Count labels, then rank by descending count and label.", "labels = input().split()\ncounts = {}\nfor label in labels:\n    counts[label] = counts.get(label, 0)+1\nwinner = sorted(counts, key=lambda label: (-counts[label], label))[0]\nprint('Ensemble =', winner)", [["B A", "Ensemble = A"], ["yes yes no", "Ensemble = yes"]]),
        problem(7, "Weighted Probability Ensemble", "Soft Voting", "Calculate the normalized weighted average of member positive-class probabilities.", "Line 1: probabilities. Line 2: non-negative weights.", "Print Probability to four decimals.", "0.8 0.6 0.3\n2 1 1", "Probability = 0.6250", "Divide weighted sum by total weight.", "probabilities = list(map(float, input().split()))\nweights = list(map(float, input().split()))\np = sum(a*w for a, w in zip(probabilities, weights))/sum(weights)\nprint(f\"Probability = {p:.4f}\")", [["0.2 0.8\n1 1", "Probability = 0.5000"], ["0.9 0.1\n3 1", "Probability = 0.7000"]]),
        problem(7, "Round-Robin Fold Assignment", "K-Fold Construction", "Assign row indices 0…N−1 to folds using index modulo K and print one line per fold.", "One line: N K.", "Print Fold i: followed by row indices.", "8 3", "Fold 0: 0 3 6\nFold 1: 1 4 7\nFold 2: 2 5", "Rows with index i belong to fold i%K.", "n, k = map(int, input().split())\nfor fold in range(k):\n    rows = [i for i in range(n) if i%k == fold]\n    print(f\"Fold {fold}:\", *rows)", [["5 2", "Fold 0: 0 2 4\nFold 1: 1 3"], ["3 3", "Fold 0: 0\nFold 1: 1\nFold 2: 2"]]),
        problem(7, "Stable Model Selection", "Mean-Variance Utility", "Choose the model maximizing mean score minus penalty times population standard deviation; break ties by name.", "Line 1: model count and penalty. Each next line: name followed by fold scores.", "Print Selected = model and Utility to four decimals.", "2 1\nlinear 0.80 0.82\ntree 0.86 0.70", "Selected = linear\nUtility = 0.8000", "Compute a utility for each model and sort by negative utility then name.", "from math import sqrt\nm, penalty = input().split(); m, penalty = int(m), float(penalty)\ncandidates = []\nfor _ in range(m):\n    parts = input().split(); name = parts[0]; values = list(map(float, parts[1:]))\n    mean = sum(values)/len(values)\n    std = sqrt(sum((x-mean)**2 for x in values)/len(values))\n    candidates.append((mean-penalty*std, name))\nutility, name = sorted(candidates, key=lambda item: (-item[0], item[1]))[0]\nprint('Selected =', name)\nprint(f\"Utility = {utility:.4f}\")", [["2 0\na 0.7 0.9\nb 0.8 0.8", "Selected = a\nUtility = 0.8000"], ["1 2\nstable 0.5 0.5 0.5", "Selected = stable\nUtility = 0.5000"]]),

        problem(8, "Confusion Matrix Counts", "Decision Evaluation", "From actual and predicted binary labels, calculate TP, TN, FP and FN.", "Line 1: actual labels. Line 2: predicted labels.", "Print TP TN FP FN on one line.", "1 0 1 1 0\n1 1 1 0 0", "TP = 2 TN = 1 FP = 1 FN = 1", "Inspect matching pairs and increment one of four counters.", "actual = list(map(int, input().split()))\npredicted = list(map(int, input().split()))\ntp=tn=fp=fn=0\nfor a,p in zip(actual,predicted):\n    if a==1 and p==1: tp+=1\n    elif a==0 and p==0: tn+=1\n    elif a==0 and p==1: fp+=1\n    else: fn+=1\nprint(f\"TP = {tp} TN = {tn} FP = {fp} FN = {fn}\")", [["0 0\n0 0", "TP = 0 TN = 2 FP = 0 FN = 0"], ["1 1\n0 1", "TP = 1 TN = 0 FP = 0 FN = 1"]]),
        problem(8, "Threshold Predictions", "Operating Threshold", "Convert probabilities into labels using prediction=1 when probability is at least the threshold.", "Line 1: probabilities. Line 2: threshold.", "Print binary labels separated by spaces.", "0.2 0.5 0.8\n0.5", "0 1 1", "Use >= so equality becomes positive.", "probabilities = list(map(float, input().split()))\nthreshold = float(input())\nprint(*[1 if p>=threshold else 0 for p in probabilities])", [["0.1 0.9\n0.7", "0 1"], ["0.4 0.4\n0.4", "1 1"]]),
        problem(8, "Brier Probability Score", "Calibration Loss", "Calculate the mean squared difference between probabilities and binary outcomes.", "Line 1: outcomes. Line 2: probabilities.", "Print Brier to four decimals.", "1 0 1\n0.8 0.3 0.6", "Brier = 0.0967", "Brier score is MSE applied to probabilities.", "outcomes = list(map(int, input().split()))\nprobabilities = list(map(float, input().split()))\nscore = sum((p-y)**2 for y,p in zip(outcomes,probabilities))/len(outcomes)\nprint(f\"Brier = {score:.4f}\")", [["1 0\n1 0", "Brier = 0.0000"], ["1 0\n0.5 0.5", "Brier = 0.2500"]]),
        problem(8, "Precision at K", "Ranking Evaluation", "Calculate the fraction of relevant items in the first K binary relevance labels.", "Line 1: relevance labels in rank order. Line 2: K.", "Print Precision@K to four decimals.", "1 0 1 1 0\n3", "Precision@3 = 0.6667", "Sum the first K labels and divide by K.", "labels = list(map(int, input().split()))\nk = int(input())\nvalue = sum(labels[:k])/k\nprint(f\"Precision@{k} = {value:.4f}\")", [["0 1 1\n1", "Precision@1 = 0.0000"], ["1 1 0 0\n4", "Precision@4 = 0.5000"]]),
        problem(8, "Largest Subgroup Recall Gap", "Slice Evaluation", "From subgroup TP and FN counts, print each recall and the largest recall gap.", "Line 1: group count. Each next line: name TP FN.", "Print recalls in input order, then Recall Gap.", "2\nA 80 20\nB 63 27", "A Recall = 0.8000\nB Recall = 0.7000\nRecall Gap = 0.1000", "Recall is TP/(TP+FN); gap is max minus min.", "g = int(input())\nrates = []\nfor _ in range(g):\n    name,tp,fn = input().split(); tp,fn=int(tp),int(fn)\n    rate = tp/(tp+fn) if tp+fn else 0\n    rates.append(rate)\n    print(f\"{name} Recall = {rate:.4f}\")\nprint(f\"Recall Gap = {max(rates)-min(rates):.4f}\")", [["2\nX 5 0\nY 8 2", "X Recall = 1.0000\nY Recall = 0.8000\nRecall Gap = 0.2000"], ["3\nA 1 1\nB 2 2\nC 3 3", "A Recall = 0.5000\nB Recall = 0.5000\nC Recall = 0.5000\nRecall Gap = 0.0000"]]),

        problem(9, "Nearest Centroid Assignment", "k-Means Assignment", "Assign every one-dimensional point to the nearest centroid; break equal distances by lower centroid index.", "Line 1: points. Line 2: centroids.", "Print zero-based cluster indices.", "1 3 8 10\n2 9", "0 0 1 1", "For each point, minimize (distance, centroid_index).", "points = list(map(float, input().split()))\ncentroids = list(map(float, input().split()))\nlabels = [min(range(len(centroids)), key=lambda i: (abs(x-centroids[i]), i)) for x in points]\nprint(*labels)", [["0 5 10\n0 10", "0 0 1"], ["2 4 6\n3", "0 0 0"]]),
        problem(9, "Centroid Recalculation", "k-Means Update", "Calculate the mean point for each cluster index from 0 to K−1.", "Line 1: points. Line 2: cluster indices. Line 3: K.", "Print K centroids to two decimals; print 0.00 for an empty cluster.", "1 3 8 10\n0 0 1 1\n2", "2.00 9.00", "Collect a sum and count for each cluster.", "points = list(map(float, input().split()))\nlabels = list(map(int, input().split()))\nk = int(input())\nsums, counts = [0.0]*k, [0]*k\nfor x,label in zip(points,labels):\n    sums[label]+=x; counts[label]+=1\ncentroids = [sums[i]/counts[i] if counts[i] else 0 for i in range(k)]\nprint(*[f\"{x:.2f}\" for x in centroids])", [["2 4 6\n0 1 1\n2", "2.00 5.00"], ["5\n1\n3", "0.00 5.00 0.00"]]),
        problem(9, "Projection onto a Direction", "PCA Projection", "Project a point onto a supplied unit direction using the dot product.", "Line 1: point. Line 2: unit direction.", "Print Projection to four decimals.", "3 4\n0.6 0.8", "Projection = 5.0000", "Projection coordinate is point dot direction.", "point = list(map(float, input().split()))\ndirection = list(map(float, input().split()))\nvalue = sum(x*v for x,v in zip(point,direction))\nprint(f\"Projection = {value:.4f}\")", [["1 2\n1 0", "Projection = 1.0000"], ["-2 3\n0 1", "Projection = 3.0000"]]),
        problem(9, "Reconstruction RMSE", "Compression Error", "Calculate root mean squared reconstruction error between original and rebuilt vectors.", "Line 1: original values. Line 2: reconstructed values.", "Print RMSE to four decimals.", "1 2 3\n1 1 4", "RMSE = 0.8165", "Take the square root of mean squared differences.", "from math import sqrt\noriginal = list(map(float, input().split()))\nrebuilt = list(map(float, input().split()))\nrmse = sqrt(sum((a-b)**2 for a,b in zip(original,rebuilt))/len(original))\nprint(f\"RMSE = {rmse:.4f}\")", [["5 5\n5 5", "RMSE = 0.0000"], ["0 0\n3 4", "RMSE = 3.5355"]]),
        problem(9, "Top Anomaly Indices", "Anomaly Ranking", "Return indices of the K largest anomaly scores, breaking score ties by lower index.", "Line 1: scores. Line 2: K.", "Print selected indices in descending anomaly order.", "0.1 0.9 0.4 0.8\n2", "1 3", "Sort indices by negative score and then index.", "scores = list(map(float, input().split()))\nk = int(input())\nindices = sorted(range(len(scores)), key=lambda i: (-scores[i], i))[:k]\nprint(*indices)", [["5 5 1\n2", "0 1"], ["0.2 0.3\n1", "1"]]),

        problem(10, "Popularity Recommendation", "Frequency Ranking", "Rank item IDs by descending interaction count and then ascending item ID.", "One line of interacted item IDs.", "Print unique item IDs in recommendation order.", "B A B C A B", "B A C", "Count each item and sort by negative count then ID.", "items = input().split()\ncounts = {}\nfor item in items:\n    counts[item] = counts.get(item,0)+1\nprint(*sorted(counts, key=lambda item: (-counts[item], item)))", [["x y x y", "x y"], ["c b a", "a b c"]]),
        problem(10, "Unseen Item Filter", "Candidate Generation", "Remove items already seen by a user while preserving candidate order.", "Line 1: candidate IDs. Line 2: seen IDs.", "Print unseen candidates.", "i1 i2 i3 i4\ni2 i4", "i1 i3", "Convert seen items to a set, then filter candidates.", "candidates = input().split()\nseen = set(input().split())\nprint(*[item for item in candidates if item not in seen])", [["a b\nc", "a b"], ["p q\np q", ""]]),
        problem(10, "Trailing Moving Average", "Window Aggregation", "Calculate every complete moving average of window size K.", "Line 1: values. Line 2: K.", "Print moving averages to two decimals.", "2 4 6 8 10\n3", "4.00 6.00 8.00", "For each valid end position, average the preceding K values.", "values = list(map(float, input().split()))\nk = int(input())\naverages = [sum(values[i:i+k])/k for i in range(len(values)-k+1)]\nprint(*[f\"{x:.2f}\" for x in averages])", [["1 2 3\n2", "1.50 2.50"], ["5 7\n2", "6.00"]]),
        problem(10, "Lag-One Feature Pairs", "Time-Series Supervision", "Convert a sequence into lag-one input-target pairs.", "One line of space-separated values.", "Print one x -> y pair per line.", "10 13 12 16", "10 -> 13\n13 -> 12\n12 -> 16", "Pair values[i−1] with values[i].", "values = input().split()\nfor previous,current in zip(values,values[1:]):\n    print(previous, '->', current)", [["1 2", "1 -> 2"], ["a b c", "a -> b\nb -> c"]]),
        problem(10, "Forecast Mean Absolute Error", "Forecast Evaluation", "Calculate mean absolute error for actual and forecast sequences.", "Line 1: actual values. Line 2: forecasts.", "Print MAE to four decimals.", "10 12 15\n9 14 14", "MAE = 1.3333", "Average absolute residuals.", "actual = list(map(float, input().split()))\nforecast = list(map(float, input().split()))\nmae = sum(abs(a-f) for a,f in zip(actual,forecast))/len(actual)\nprint(f\"MAE = {mae:.4f}\")", [["1 2\n1 2", "MAE = 0.0000"], ["0 10\n2 4", "MAE = 4.0000"]]),

        problem(11, "ReLU Activation", "Neural Activation", "Apply ReLU=max(0,x) to every value.", "One line of space-separated numbers.", "Print activated values with one decimal.", "-2 0 3.5 -1", "0.0 0.0 3.5 0.0", "Replace negative values with zero.", "values = list(map(float, input().split()))\nprint(*[f\"{max(0,x):.1f}\" for x in values])", [["1 2", "1.0 2.0"], ["-5 -2", "0.0 0.0"]]),
        problem(11, "Stable Softmax", "Probability Normalization", "Convert logits to softmax probabilities using maximum-logit subtraction.", "One line of logits.", "Print probabilities to four decimals.", "1 2 3", "0.0900 0.2447 0.6652", "Exponentiate logit−max(logits), then divide by the sum.", "from math import exp\nlogits = list(map(float, input().split()))\nm = max(logits)\nvalues = [exp(x-m) for x in logits]\ntotal = sum(values)\nprint(*[f\"{x/total:.4f}\" for x in values])", [["0 0", "0.5000 0.5000"], ["1000 1000", "0.5000 0.5000"]]),
        problem(11, "Valid One-Dimensional Convolution", "Convolution", "Slide a kernel across a signal without padding and print dot products.", "Line 1: signal. Line 2: kernel.", "Print valid convolution outputs to two decimals.", "1 2 3 4\n1 0 -1", "-2.00 -2.00", "For each valid start, multiply the window and kernel elementwise.", "signal = list(map(float, input().split()))\nkernel = list(map(float, input().split()))\nout = [sum(signal[i+j]*kernel[j] for j in range(len(kernel))) for i in range(len(signal)-len(kernel)+1)]\nprint(*[f\"{x:.2f}\" for x in out])", [["1 2 3\n1 1", "3.00 5.00"], ["2 4\n0.5", "1.00 2.00"]]),
        problem(11, "Token Frequency Vocabulary", "Text Vectorization", "Lowercase whitespace tokens and print vocabulary counts alphabetically.", "One line of text.", "Print token:count pairs separated by spaces.", "AI learns and AI helps", "ai:2 and:1 helps:1 learns:1", "Use lower().split(), count with a dictionary, then sort keys.", "tokens = input().lower().split()\ncounts = {}\nfor token in tokens:\n    counts[token] = counts.get(token,0)+1\nprint(*[f\"{token}:{counts[token]}\" for token in sorted(counts)])", [["Cat cat DOG", "cat:2 dog:1"], ["one", "one:1"]]),
        problem(11, "Overlapping Text Chunks", "RAG Chunking", "Split words into chunks of size S with overlap O, keeping the final non-empty chunk.", "Line 1: words. Line 2: S O where 0≤O<S.", "Print one chunk per line joined by spaces.", "a b c d e f g\n4 2", "a b c d\nc d e f\ne f g", "Advance by S−O until the start reaches the word count.", "words = input().split()\nsize, overlap = map(int, input().split())\nstep = size-overlap\nfor start in range(0,len(words),step):\n    chunk = words[start:start+size]\n    if chunk:\n        print(*chunk)\n    if start+size >= len(words):\n        break", [["one two three\n2 1", "one two\ntwo three"], ["a b c d\n3 0", "a b c\nd"]]),

        problem(12, "Breadth-First Search Order", "Graph Search", "Traverse an undirected graph from a start node using BFS; visit neighbours alphabetically.", "Line 1: edge count E. Next E lines: u v. Final line: start.", "Print BFS order.", "4\nA B\nA C\nB D\nC D\nA", "A B C D", "Use a queue and mark nodes when enqueued.", "from collections import deque\ne = int(input())\ngraph = {}\nfor _ in range(e):\n    u,v = input().split()\n    graph.setdefault(u,[]).append(v); graph.setdefault(v,[]).append(u)\nstart = input().strip()\nqueue, seen, order = deque([start]), {start}, []\nwhile queue:\n    node = queue.popleft(); order.append(node)\n    for nxt in sorted(graph.get(node,[])):\n        if nxt not in seen:\n            seen.add(nxt); queue.append(nxt)\nprint(*order)", [["2\n1 2\n2 3\n1", "1 2 3"], ["1\nX Y\nY", "Y X"]]),
        problem(12, "Bellman Q Update", "Reinforcement Learning", "Apply Q←Q+α[r+γ max_next−Q].", "One line: current_q reward gamma max_next alpha.", "Print Updated Q to four decimals.", "2 5 0.9 4 0.1", "Updated Q = 2.6600", "Calculate the TD target first.", "q,reward,gamma,max_next,alpha = map(float,input().split())\ntarget = reward+gamma*max_next\nq = q+alpha*(target-q)\nprint(f\"Updated Q = {q:.4f}\")", [["0 1 0 10 0.5", "Updated Q = 0.5000"], ["5 0 1 5 0.2", "Updated Q = 5.0000"]]),
        problem(12, "Population Stability Index", "Production Drift", "Calculate PSI across expected and actual bins with natural logarithm.", "Line 1: expected proportions. Line 2: actual proportions.", "Print PSI to four decimals.", "0.5 0.5\n0.4 0.6", "PSI = 0.0405", "Sum (actual−expected)×ln(actual/expected).", "from math import log\nexpected = list(map(float,input().split()))\nactual = list(map(float,input().split()))\npsi = sum((a-e)*log(a/e) for e,a in zip(expected,actual))\nprint(f\"PSI = {psi:.4f}\")", [["0.2 0.8\n0.2 0.8", "PSI = 0.0000"], ["0.5 0.5\n0.25 0.75", "PSI = 0.2747"]]),
        problem(12, "Model Promotion Gate", "MLOps Decision", "Print PROMOTE only when gain reaches minimum and latency, error and fairness gap stay within limits.", "Line 1: gain latency error gap. Line 2: min_gain max_latency max_error max_gap.", "Print PROMOTE or BLOCK.", "0.02 80 0.005 0.04\n0.01 100 0.01 0.05", "PROMOTE", "Every required condition is joined by and.", "gain,latency,error,gap = map(float,input().split())\nmin_gain,max_latency,max_error,max_gap = map(float,input().split())\npassed = gain>=min_gain and latency<=max_latency and error<=max_error and gap<=max_gap\nprint('PROMOTE' if passed else 'BLOCK')", [["0 50 0 0\n0.01 100 0.1 0.1", "BLOCK"], ["0.1 100 0.01 0.05\n0.1 100 0.01 0.05", "PROMOTE"]]),
        problem(12, "Placement Project Ranking", "Weighted Evidence", "Rank projects by weighted evidence score; break score ties alphabetically.", "Line 1: criterion weights. Line 2: project count. Each next line: name followed by scores.", "Print project names from strongest to weakest with scores to two decimals.", "0.2 0.3 0.3 0.2\n3\nchurn 8 9 7 8\nvision 7 8 9 6\nrag 9 7 8 9", "rag 8.10\nchurn 8.00\nvision 7.70", "Calculate a dot product for each row, then sort by negative score and name.", "weights = list(map(float,input().split()))\nn = int(input())\nranked = []\nfor _ in range(n):\n    parts = input().split(); name = parts[0]; evidence = list(map(float,parts[1:]))\n    score = sum(value*weight for value,weight in zip(evidence,weights))\n    ranked.append((score,name))\nfor score,name in sorted(ranked,key=lambda item:(-item[0],item[1])):\n    print(name,f\"{score:.2f}\")", [["0.5 0.5\n2\nb 4 6\na 5 5", "a 5.00\nb 5.00"], ["1\n1\nsolo 9", "solo 9.00"]])
    ];

    PROBLEMS.forEach(function (item, index) {
        const number = PROBLEMS.slice(0, index + 1).filter(function (candidate) { return candidate.level === item.level; }).length;
        item.number = number;
        item.key = "aiml-arena-l" + item.level + "-p" + number;
        const definition = item.solution.split("\n").find(function (line) { return line.trim().indexOf("def ") === 0; });
        item.starterCode = definition ? definition + "\n    # Write your code here\n    pass" : "# Read the input and solve the challenge\n# Write your Python code here\n";
        item.concepts = [LEVELS[item.level - 1].topic, item.skill];
        item.allTests = [[item.sampleInput, item.sampleOutput]].concat(item.tests);
    });

    function levelCardsMarkup() {
        const stages = [];
        LEVELS.forEach(function (level) { if (stages.indexOf(level.stage) === -1) stages.push(level.stage); });
        return stages.map(function (stage) {
            const stageLevels = LEVELS.filter(function (level) { return level.stage === stage; });
            return '<section class="cb-stage-block"><div class="cb-stage-heading"><h2>' + html(stage) + '</h2><p>' + html(stageLevels[0].stageText) + '</p></div><div class="cb-level-card-grid">' + stageLevels.map(function (level) {
                const placement = level.id === 12 ? " cb-level-placement" : "";
                return '<a class="cb-level-card' + placement + '" href="#practice-level-' + level.id + '"><div class="cb-level-card-top"><span class="cb-level-number">LEVEL ' + String(level.id).padStart(2, "0") + '</span><span class="cb-level-icon">' + level.icon + '</span></div><h3>' + html(level.name) + '</h3><p>' + html(level.desc) + '</p><div class="cb-level-meta"><span>5 Challenges</span><span>' + html(level.stage.replace(" Practice", "")) + '</span><span>500 Points</span></div><span class="cb-level-start">Open Level →</span></a>';
            }).join("") + '</div></section>';
        }).join("");
    }

    function challengeMarkup(item, level) {
        const difficultyClass = "cb-diff-" + item.difficulty.toLowerCase();
        return '<details class="cb-challenge-card"><summary><div class="cb-challenge-topline"><span class="cb-challenge-number">CHALLENGE ' + String(item.number).padStart(2, "0") + '</span><span><span id="practiceBadge-' + item.key + '" class="cb-practice-badge"></span> <span class="cb-difficulty ' + difficultyClass + '">' + html(item.difficulty) + '</span></span></div><h3>' + html(item.title) + '</h3><p class="cb-core-skill">Core Skill: ' + html(item.skill) + '</p><div class="cb-challenge-summary-meta"><span>' + html(level.topic) + '</span><span>Online Judge</span><span>100 Points</span></div><span class="cb-view-challenge">View Challenge →</span></summary>' +
            '<div class="cb-challenge-body"><div class="cb-challenge-hero"><span class="cb-challenge-label">CODEBHAVYA ORIGINAL CHALLENGE</span><h2>' + html(item.title) + '</h2><p>' + html(item.story) + '</p></div><div class="cb-challenge-spec-grid"><div class="cb-challenge-spec"><h4>🎯 Your Task</h4><p>' + html(item.task) + '</p></div><div class="cb-challenge-spec"><h4>📥 Input Format</h4><p>' + html(item.inputFormat) + '</p></div><div class="cb-challenge-spec"><h4>📤 Output Format</h4><p>' + html(item.outputFormat) + '</p></div><div class="cb-challenge-spec"><h4>📏 Constraints</h4><p>' + html(item.constraints) + '</p></div></div>' +
            '<div class="cb-example-grid"><div class="cb-example-box"><strong>Example Input</strong><pre>' + html(item.sampleInput) + '</pre></div><div class="cb-example-box"><strong>Example Output</strong><pre>' + html(item.sampleOutput) + '</pre></div></div><div class="cb-explanation-box"><strong>Why this matters:</strong> This calculation exposes the underlying ' + html(item.skill.toLowerCase()) + ' used inside larger AI and machine-learning systems.</div><div class="cb-concept-row">' + item.concepts.map(function (concept) { return '<span>' + html(concept) + '</span>'; }).join("") + '<span>' + html(item.difficulty) + '</span><span>100 Points</span></div>' +
            '<div class="cb-challenge-actions"><button type="button" class="cb-practice-start-button" data-action="workspace" data-key="' + item.key + '">💻 Solve It Yourself</button><button type="button" class="cb-practice-hint-button" data-action="hint" data-key="' + item.key + '">Hint</button><button type="button" class="cb-practice-program-button" data-action="solution" data-key="' + item.key + '">Show Program</button></div>' +
            '<div class="cb-c-practice-hint" id="practiceHint-' + item.key + '" hidden>💡 <strong>Hint:</strong> ' + html(item.hint) + '</div><div class="cb-c-practice-workspace" id="practiceWorkspace-' + item.key + '" hidden><div class="cb-c-practice-workspace-title">💻 Solve It Yourself — ' + html(item.title) + '</div><div class="cb-c-practice-grid"><div class="cb-c-practice-panel"><h4>Python Code Editor</h4><textarea id="practiceCode-' + item.key + '" class="cb-c-code-editor" spellcheck="false" aria-label="Python code editor"></textarea><div class="cb-c-practice-actions"><button type="button" id="practiceRun-' + item.key + '" class="cb-c-run-btn" data-action="run" data-key="' + item.key + '">▶ Run Code</button><button type="button" id="practiceCheck-' + item.key + '" class="cb-c-check-btn" data-action="check" data-key="' + item.key + '">✓ Check Answer</button><button type="button" class="cb-c-reset-btn" data-action="reset" data-key="' + item.key + '">↺ Reset</button></div><p class="cb-c-practice-note">Run uses the editable sample input. Check Answer runs the official sample and hidden tests.</p></div>' +
            '<div class="cb-c-practice-panel"><h4>Sample Input</h4><textarea id="practiceInput-' + item.key + '" class="cb-c-practice-input" spellcheck="false" aria-label="Sample input"></textarea><h4 class="cb-c-output-heading">Output</h4><pre id="practiceOutput-' + item.key + '" class="cb-c-practice-output" aria-live="polite">Run your program to see the output.</pre><h4 class="cb-c-tests-heading">Test Cases</h4><div id="practiceTests-' + item.key + '" class="cb-c-test-results"><div class="cb-c-test-row"><span>No tests checked yet.</span><strong>—</strong></div></div><div class="cb-c-practice-score"><div class="cb-c-practice-score-grid"><div class="cb-c-score-item"><strong>Best Score</strong><span id="practiceScore-' + item.key + '">0 / 100</span></div><div class="cb-c-score-item"><strong>Attempts</strong><span id="practiceAttempts-' + item.key + '">0</span></div><div class="cb-c-score-item"><strong>Status</strong><span id="practiceStatus-' + item.key + '">Not Solved</span></div></div><div id="practiceMessage-' + item.key + '" class="cb-c-practice-message">Write your Python program and test it. You can do it! 💪</div></div></div></div></div>' +
            '<div class="cb-c-practice-solution" id="practiceSolution-' + item.key + '" hidden><div class="cb-c-practice-solution-title">Official Python Program</div><pre><code>' + html(item.solution) + '</code></pre></div></div></details>';
    }

    function levelsMarkup() {
        return LEVELS.map(function (level) {
            const items = PROBLEMS.filter(function (item) { return item.level === level.id; });
            return '<details class="cb-level-section" id="practice-level-' + level.id + '"><summary><div class="cb-level-summary-row"><div class="cb-level-summary-main"><span class="cb-level-summary-icon">' + level.icon + '</span><span class="cb-level-summary-text"><strong>Level ' + level.id + ' — ' + html(level.name) + '</strong><span>' + html(level.desc) + ' • 5 original CodeBhavya challenges</span></span></div><span class="cb-level-open-pill">Open 5 Challenges</span></div></summary><div class="cb-level-content"><p class="cb-level-content-intro">Solve from first principles, match the exact output contract and use the explanation only after making your own attempt.</p><div class="cb-challenge-grid">' + items.map(function (item) { return challengeMarkup(item, level); }).join("") + '</div></div></details>';
        }).join("");
    }

    function renderArena() {
        const cardRoot = get("aimlPracticeLevelCards");
        const levelRoot = get("aimlPracticeLevels");
        if (!cardRoot || !levelRoot) return;
        cardRoot.innerHTML = levelCardsMarkup();
        levelRoot.innerHTML = levelsMarkup();
        cardRoot.addEventListener("click", function (event) {
            const link = event.target.closest('a[href^="#practice-level-"]');
            if (!link) return;
            const section = document.querySelector(link.getAttribute("href"));
            if (section) section.open = true;
        });
    }

    const configs = {};
    function element(name, key) { return get(name + "-" + key); }
    function storageGet(key) { try { return JSON.parse(window.localStorage.getItem(key) || "null"); } catch (error) { return null; } }
    function storageSet(key, value) { try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* Storage may be unavailable. */ } }
    function progressKey(key) { return "codebhavya.aimlpractice." + key; }
    function defaultProgress() { return { attempts: 0, bestScore: 0, solved: false, completedWithSolution: false, hintUsed: false, solutionViewed: false }; }
    function getProgress(key) { return Object.assign(defaultProgress(), storageGet(progressKey(key)) || {}); }
    function saveProgress(key, value) { storageSet(progressKey(key), value); }
    function normalizeOutput(value) { return String(value == null ? "" : value).replace(/\r\n/g, "\n").trim().replace(/[ \t]+$/gm, ""); }

    function updateOverallProgress() {
        const keys = Object.keys(configs);
        let solved = 0;
        let completed = 0;
        let score = 0;
        keys.forEach(function (key) {
            const progress = getProgress(key);
            score += Number(progress.bestScore) || 0;
            if (progress.solved) solved += 1;
            else if (progress.completedWithSolution) completed += 1;
        });
        const finished = solved + completed;
        const percent = keys.length ? Math.round(finished / keys.length * 100) : 0;
        get("cbPracticeOverallSolved").textContent = solved + " / " + keys.length;
        get("cbPracticeOverallCompleted").textContent = String(completed);
        get("cbPracticeOverallScore").textContent = score + " / " + (keys.length * POINTS);
        get("cbPracticeOverallPercent").textContent = percent + "%";
        get("cbPracticeOverallBar").style.width = percent + "%";
    }

    function renderProgress(key) {
        const progress = getProgress(key);
        const score = element("practiceScore", key);
        const attempts = element("practiceAttempts", key);
        const status = element("practiceStatus", key);
        const message = element("practiceMessage", key);
        const badge = element("practiceBadge", key);
        if (score) score.textContent = progress.bestScore + " / 100";
        if (attempts) attempts.textContent = String(progress.attempts);
        if (progress.solved) {
            if (status) status.textContent = "Solved Independently";
            if (message) message.textContent = "Excellent — all tests passed independently. ✅";
            if (badge) { badge.textContent = "Solved"; badge.className = "cb-practice-badge solved"; }
        } else if (progress.completedWithSolution) {
            if (status) status.textContent = "Completed with Solution";
            if (message) message.textContent = "All tests passed after reviewing the model program. Keep practising. 👍";
            if (badge) { badge.textContent = "Completed"; badge.className = "cb-practice-badge completed"; }
        } else {
            if (status) status.textContent = "Not Solved";
            if (message) message.textContent = "Write your Python program and test it. You can do it! 💪";
            if (badge) { badge.textContent = ""; badge.className = "cb-practice-badge"; }
        }
    }

    function register(item) {
        configs[item.key] = item;
        const code = element("practiceCode", item.key);
        const input = element("practiceInput", item.key);
        if (code) {
            code.value = item.starterCode;
            code.addEventListener("keydown", function (event) {
                if (event.key !== "Tab") return;
                event.preventDefault();
                const start = code.selectionStart;
                const end = code.selectionEnd;
                code.value = code.value.substring(0, start) + "    " + code.value.substring(end);
                code.selectionStart = code.selectionEnd = start + 4;
            });
        }
        if (input) input.value = item.sampleInput;
        renderProgress(item.key);
    }

    function setBusy(key, busy) {
        const run = element("practiceRun", key);
        const check = element("practiceCheck", key);
        if (run) run.disabled = busy;
        if (check) check.disabled = busy;
    }

    async function executePython(code, stdin) {
        const response = await fetch(JUDGE0_BASE + "/submissions?base64_encoded=false&wait=true", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ language_id: PYTHON_LANGUAGE_ID, source_code: code, stdin: stdin, cpu_time_limit: 3, wall_time_limit: 6, memory_limit: 128000 })
        });
        let result = null;
        try { result = await response.json(); } catch (error) { /* Keep the HTTP error below. */ }
        if (!response.ok) throw new Error((result && (result.message || result.error)) || ("Judge returned HTTP " + response.status + "."));
        const description = String(result && result.status && result.status.description || "").trim();
        const stdout = result && result.stdout != null ? result.stdout : "";
        const stderr = result && result.stderr != null ? result.stderr : "";
        const compileOutput = result && result.compile_output != null ? result.compile_output : "";
        const message = result && result.message != null ? result.message : "";
        if (description === "Accepted") return { ok: true, output: stdout };
        return { ok: false, output: compileOutput || stderr || message || description || "Program execution failed." };
    }

    async function runSample(key) {
        const item = configs[key];
        const code = element("practiceCode", key).value;
        const stdin = element("practiceInput", key).value;
        const output = element("practiceOutput", key);
        if (!code.trim()) { output.textContent = "Please write your Python program first."; return; }
        setBusy(key, true);
        output.textContent = "Running your Python program...";
        try {
            const result = await executePython(code, stdin);
            output.textContent = result.output || "(Program finished with no output)";
        } catch (error) {
            output.textContent = "Unable to run code: " + error.message + "\n\nThe online judge may be temporarily unavailable. Please try again.";
        } finally {
            setBusy(key, false);
        }
    }

    async function checkAnswer(key) {
        const item = configs[key];
        const code = element("practiceCode", key).value;
        const output = element("practiceOutput", key);
        const testsElement = element("practiceTests", key);
        if (!code.trim()) { output.textContent = "Please write your Python program first."; return; }
        const progress = getProgress(key);
        progress.attempts += 1;
        saveProgress(key, progress);
        setBusy(key, true);
        testsElement.innerHTML = "";
        output.textContent = "Checking the official sample and hidden tests...";
        let passed = 0;
        try {
            for (let index = 0; index < item.allTests.length; index += 1) {
                const test = item.allTests[index];
                const result = await executePython(code, test[0]);
                const accepted = result.ok && normalizeOutput(result.output) === normalizeOutput(test[1]);
                const row = document.createElement("div");
                row.className = "cb-c-test-row " + (accepted ? "pass" : "fail");
                row.innerHTML = "<span>" + (index === 0 ? "Sample test" : "Hidden test " + index) + "</span><strong>" + (accepted ? "PASS" : "FAIL") + "</strong>";
                testsElement.appendChild(row);
                if (!accepted) {
                    output.textContent = result.ok ? "Output mismatch.\n\nExpected:\n" + test[1] + "\n\nYour output:\n" + result.output : result.output;
                    break;
                }
                passed += 1;
            }
            if (passed === item.allTests.length) {
                const latest = getProgress(key);
                const earned = latest.solutionViewed ? 60 : 100;
                latest.bestScore = Math.max(latest.bestScore, earned);
                latest.solved = latest.solved || earned === 100;
                latest.completedWithSolution = latest.completedWithSolution || earned === 60;
                saveProgress(key, latest);
                output.textContent = "Accepted — all " + item.allTests.length + " tests passed.";
            }
        } catch (error) {
            output.textContent = "Unable to check code: " + error.message + "\n\nThe online judge may be temporarily unavailable. Please try again.";
        } finally {
            setBusy(key, false);
            renderProgress(key);
            updateOverallProgress();
        }
    }

    function handleAction(button) {
        const key = button.dataset.key;
        const action = button.dataset.action;
        if (!key || !configs[key]) return;
        if (action === "workspace") {
            const workspace = element("practiceWorkspace", key);
            workspace.hidden = !workspace.hidden;
            button.textContent = workspace.hidden ? "💻 Solve It Yourself" : "Close Workspace";
            if (!workspace.hidden) window.setTimeout(function () { element("practiceCode", key).focus(); }, 0);
        } else if (action === "hint") {
            const hint = element("practiceHint", key);
            hint.hidden = !hint.hidden;
            button.textContent = hint.hidden ? "Hint" : "Hide Hint";
            const progress = getProgress(key); progress.hintUsed = true; saveProgress(key, progress);
        } else if (action === "solution") {
            const solution = element("practiceSolution", key);
            solution.hidden = !solution.hidden;
            button.textContent = solution.hidden ? "Show Program" : "Hide Program";
            const progress = getProgress(key); progress.solutionViewed = true; saveProgress(key, progress);
        } else if (action === "reset") {
            element("practiceCode", key).value = configs[key].starterCode;
            element("practiceInput", key).value = configs[key].sampleInput;
            element("practiceOutput", key).textContent = "Run your program to see the output.";
            element("practiceTests", key).innerHTML = '<div class="cb-c-test-row"><span>No tests checked yet.</span><strong>—</strong></div>';
        } else if (action === "run") {
            runSample(key);
        } else if (action === "check") {
            checkAnswer(key);
        }
    }

    renderArena();
    PROBLEMS.forEach(register);
    const levelRoot = get("aimlPracticeLevels");
    if (levelRoot) levelRoot.addEventListener("click", function (event) { const button = event.target.closest("button[data-action]"); if (button) handleAction(button); });
    updateOverallProgress();
}());
