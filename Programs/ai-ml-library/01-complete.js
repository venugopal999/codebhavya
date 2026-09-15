"use strict";

const { makeAiMl } = require("./helpers");
const e = (level, slug, title, topic, source, sampleOutput, concepts, extra = {}) => makeAiMl({
  slug: `ai-ml-${String(level).padStart(2, "0")}-${slug}`,
  title: `${title} with Python`,
  topic: `Level ${String(level).padStart(2, "0")} — ${topic}`,
  source,
  sampleOutput,
  concepts,
  ...extra
});

const programs = [
  // Level 01 — AI & ML Foundations
  e(1,"rule-classifier","Build a Rule-based Classifier","AI & ML Foundations","temperature = 38.2\nprediction = 'Fever' if temperature >= 38 else 'Normal'\nprint(prediction)","Fever",["AI rule","Classification"],{featured:true}),
  e(1,"feature-target","Separate Features and Target","AI & ML Foundations","rows = [[2, 4, 6], [3, 6, 9]]\nfeatures = [row[:-1] for row in rows]\ntarget = [row[-1] for row in rows]\nprint(features, target)","[[2, 4], [3, 6]] [6, 9]",["Features","Target"]),
  e(1,"train-test-split","Create a Train-test Split","AI & ML Foundations","data = list(range(10))\nsplit = int(len(data) * 0.8)\nprint(data[:split], data[split:])","[0, 1, 2, 3, 4, 5, 6, 7] [8, 9]",["Training data","Testing data"]),
  e(1,"absolute-loss","Calculate Prediction Loss","AI & ML Foundations","actual = [3, 5, 8]\npredicted = [2, 5, 10]\nloss = sum(abs(a - p) for a, p in zip(actual, predicted)) / len(actual)\nprint(round(loss, 2))","1.0",["Loss","Prediction error"]),
  e(1,"model-inference","Run Simple Model Inference","AI & ML Foundations","weights = [0.5, 1.5]\nfeatures = [4, 2]\nbias = 1\nprediction = sum(w * x for w, x in zip(weights, features)) + bias\nprint(prediction)","6.0",["Model","Inference","Weights"]),

  // Level 02 — Python, NumPy & Data
  e(2,"vector-addition","Add Two Feature Vectors","Python, NumPy & Data","a = [1, 2, 3]\nb = [4, 5, 6]\nprint([x + y for x, y in zip(a, b)])","[5, 7, 9]",["Vector","Element-wise operation"]),
  e(2,"dot-product","Calculate a Dot Product","Python, NumPy & Data","a = [1, 2, 3]\nb = [4, 5, 6]\nprint(sum(x * y for x, y in zip(a, b)))","32",["Dot product","Vector"]),
  e(2,"reshape-flat-data","Reshape Flat Data","Python, NumPy & Data","values = list(range(1, 7))\nrows = [values[index:index + 3] for index in range(0, len(values), 3)]\nprint(rows)","[[1, 2, 3], [4, 5, 6]]",["Reshape","Matrix"]),
  e(2,"column-means","Calculate Column Means","Python, NumPy & Data","matrix = [[1, 2], [3, 4], [5, 6]]\nmeans = [sum(column) / len(column) for column in zip(*matrix)]\nprint(means)","[3.0, 4.0]",["Axis","Mean","Data matrix"]),
  e(2,"l2-normalize","Normalize a Vector","Python, NumPy & Data","from math import sqrt\nvector = [3, 4]\nnorm = sqrt(sum(value ** 2 for value in vector))\nprint([value / norm for value in vector])","[0.6, 0.8]",["Normalization","L2 norm"]),

  // Level 03 — Linear Algebra
  e(3,"vector-magnitude","Find Vector Magnitude","Linear Algebra","from math import sqrt\nvector = [2, 3, 6]\nprint(sqrt(sum(value ** 2 for value in vector)))","7.0",["Vector magnitude","Norm"]),
  e(3,"matrix-addition","Add Matrices","Linear Algebra","a = [[1, 2], [3, 4]]\nb = [[5, 6], [7, 8]]\nresult = [[a[i][j] + b[i][j] for j in range(2)] for i in range(2)]\nprint(result)","[[6, 8], [10, 12]]",["Matrix addition"]),
  e(3,"matrix-multiplication","Multiply Matrices","Linear Algebra","a = [[1, 2], [3, 4]]\nb = [[2, 0], [1, 2]]\nresult = [[sum(a[i][k] * b[k][j] for k in range(2)) for j in range(2)] for i in range(2)]\nprint(result)","[[4, 4], [10, 8]]",["Matrix multiplication"]),
  e(3,"matrix-transpose","Transpose a Matrix","Linear Algebra","matrix = [[1, 2, 3], [4, 5, 6]]\nprint([list(column) for column in zip(*matrix)])","[[1, 4], [2, 5], [3, 6]]",["Transpose","Matrix"]),
  e(3,"determinant-2x2","Find a 2 by 2 Determinant","Linear Algebra","matrix = [[4, 6], [3, 8]]\ndeterminant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]\nprint(determinant)","14",["Determinant","Matrix"]),

  // Level 04 — Probability & Statistics
  e(4,"mean","Calculate the Mean","Probability & Statistics","values = [2, 4, 6, 8]\nprint(sum(values) / len(values))","5.0",["Mean","Statistics"]),
  e(4,"variance","Calculate Population Variance","Probability & Statistics","values = [2, 4, 6, 8]\nmean = sum(values) / len(values)\nvariance = sum((value - mean) ** 2 for value in values) / len(values)\nprint(variance)","5.0",["Variance","Mean"]),
  e(4,"standard-deviation","Calculate Standard Deviation","Probability & Statistics","from math import sqrt\nvalues = [2, 4, 6, 8]\nmean = sum(values) / len(values)\nprint(round(sqrt(sum((x - mean) ** 2 for x in values) / len(values)), 3))","2.236",["Standard deviation"]),
  e(4,"bayes-theorem","Apply Bayes Theorem","Probability & Statistics","prior = 0.01\nsensitivity = 0.90\nfalse_positive = 0.05\nposterior = sensitivity * prior / (sensitivity * prior + false_positive * (1 - prior))\nprint(round(posterior, 4))","0.1538",["Bayes theorem","Posterior"]),
  e(4,"z-score","Calculate a Z-score","Probability & Statistics","value, mean, standard_deviation = 85, 70, 10\nprint((value - mean) / standard_deviation)","1.5",["Z-score","Standardization"]),

  // Level 05 — Data Preparation
  e(5,"mean-imputation","Impute a Missing Value","Data Preparation","values = [10, None, 20, 30]\nknown = [value for value in values if value is not None]\nmean = sum(known) / len(known)\nprint([mean if value is None else value for value in values])","[10, 20.0, 20, 30]",["Missing values","Mean imputation"]),
  e(5,"min-max-scaling","Apply Min-max Scaling","Data Preparation","values = [10, 20, 30]\nlow, high = min(values), max(values)\nprint([(value - low) / (high - low) for value in values])","[0.0, 0.5, 1.0]",["Min-max scaling"]),
  e(5,"standard-scaling","Apply Standard Scaling","Data Preparation","values = [10, 20, 30]\nmean = sum(values) / len(values)\nstd = (sum((x - mean) ** 2 for x in values) / len(values)) ** 0.5\nprint([round((x - mean) / std, 3) for x in values])","[-1.225, 0.0, 1.225]",["StandardScaler","Z-score"]),
  e(5,"one-hot-encoding","One-hot Encode Categories","Data Preparation","categories = ['red', 'blue', 'red']\nlabels = sorted(set(categories))\nencoded = [[int(value == label) for label in labels] for value in categories]\nprint(labels, encoded)","['blue', 'red'] [[0, 1], [1, 0], [0, 1]]",["One-hot encoding","Categorical data"]),
  e(5,"remove-duplicates","Remove Duplicate Records","Data Preparation","rows = [(1, 'A'), (2, 'B'), (1, 'A')]\nunique = list(dict.fromkeys(rows))\nprint(unique)","[(1, 'A'), (2, 'B')]",["Duplicates","Data cleaning"]),

  // Level 06 — Linear Regression
  e(6,"prediction","Make a Linear Regression Prediction","Linear Regression","slope, intercept, x = 2.5, 10, 8\nprint(slope * x + intercept)","30.0",["Linear regression","Prediction"],{featured:true}),
  e(6,"mse","Calculate Mean Squared Error","Linear Regression","actual = [3, 5, 7]\npredicted = [2, 5, 8]\nmse = sum((a - p) ** 2 for a, p in zip(actual, predicted)) / len(actual)\nprint(round(mse, 3))","0.667",["MSE","Regression metric"]),
  e(6,"fit-line","Fit a Simple Regression Line","Linear Regression","x = [1, 2, 3]\ny = [2, 4, 6]\nx_mean, y_mean = sum(x)/len(x), sum(y)/len(y)\nslope = sum((a-x_mean)*(b-y_mean) for a,b in zip(x,y)) / sum((a-x_mean)**2 for a in x)\nintercept = y_mean - slope*x_mean\nprint(slope, intercept)","2.0 0.0",["Least squares","Slope","Intercept"]),
  e(6,"gradient-step","Perform a Gradient Descent Step","Linear Regression","x, y = 2, 5\nweight, learning_rate = 1.0, 0.1\nprediction = weight * x\ngradient = 2 * x * (prediction - y)\nweight -= learning_rate * gradient\nprint(round(weight, 2))","2.2",["Gradient descent","Learning rate"]),
  e(6,"r2-score","Calculate R-squared","Linear Regression","actual = [2, 4, 6]\npredicted = [2, 5, 5]\nmean = sum(actual)/len(actual)\nr2 = 1 - sum((a-p)**2 for a,p in zip(actual,predicted)) / sum((a-mean)**2 for a in actual)\nprint(round(r2, 3))","0.75",["R-squared","Regression metric"]),

  // Level 07 — Logistic Classification
  e(7,"sigmoid","Calculate the Sigmoid Function","Logistic Classification","from math import exp\nvalue = 2\nprint(round(1 / (1 + exp(-value)), 4))","0.8808",["Sigmoid","Probability"]),
  e(7,"binary-prediction","Make a Binary Prediction","Logistic Classification","from math import exp\nscore = -0.4 + 0.8 * 2\nprobability = 1 / (1 + exp(-score))\nprint(round(probability, 3), int(probability >= 0.5))","0.769 1",["Logistic regression","Threshold"]),
  e(7,"binary-cross-entropy","Calculate Binary Cross-entropy","Logistic Classification","from math import log\ny, probability = 1, 0.8\nloss = -(y*log(probability) + (1-y)*log(1-probability))\nprint(round(loss, 4))","0.2231",["Binary cross-entropy","Loss"]),
  e(7,"threshold-effect","Compare Classification Thresholds","Logistic Classification","probabilities = [0.3, 0.55, 0.8]\nfor threshold in [0.5, 0.7]:\n    print(threshold, [int(p >= threshold) for p in probabilities])","0.5 [0, 1, 1]\n0.7 [0, 0, 1]",["Threshold","Classification"]),
  e(7,"odds","Convert Probability to Odds","Logistic Classification","probability = 0.75\nprint(probability / (1 - probability))","3.0",["Odds","Probability"]),

  // Level 08 — KNN & Naive Bayes
  e(8,"euclidean-distance","Calculate Euclidean Distance","KNN & Naive Bayes","from math import dist\nprint(round(dist([1, 2], [4, 6]), 2))","5.0",["Euclidean distance","KNN"]),
  e(8,"knn-classification","Classify with K-nearest Neighbours","KNN & Naive Bayes","from math import dist\npoints = [([1,1],'A'),([2,1],'A'),([5,5],'B')]\nquery = [2,2]\nnearest = sorted(points, key=lambda item: dist(item[0], query))[:2]\nprint(max(set(label for _,label in nearest), key=lambda label: sum(x[1]==label for x in nearest)))","A",["KNN","Nearest neighbours"]),
  e(8,"gaussian-likelihood","Calculate Gaussian Likelihood","KNN & Naive Bayes","from math import exp, pi, sqrt\nx, mean, variance = 1, 0, 1\nlikelihood = exp(-((x-mean)**2)/(2*variance)) / sqrt(2*pi*variance)\nprint(round(likelihood, 4))","0.242",["Gaussian Naive Bayes","Likelihood"]),
  e(8,"posterior-score","Compare Naive Bayes Scores","KNN & Naive Bayes","priors = {'spam':0.4, 'ham':0.6}\nlikelihood = {'spam':0.8, 'ham':0.2}\nscores = {label: priors[label]*likelihood[label] for label in priors}\nprint(max(scores, key=scores.get), scores)","spam {'spam': 0.32000000000000006, 'ham': 0.12}",["Naive Bayes","Posterior score"]),
  e(8,"categorical-nb","Classify a Categorical Feature","KNN & Naive Bayes","counts = {'yes': {'sunny': 3}, 'no': {'sunny': 1}}\npriors = {'yes': 0.6, 'no': 0.4}\nscores = {label: priors[label] * counts[label]['sunny']/4 for label in priors}\nprint(max(scores, key=scores.get))","yes",["Categorical Naive Bayes"]),

  // Level 09 — Trees & Forests
  e(9,"gini-impurity","Calculate Gini Impurity","Trees & Forests","counts = [3, 2]\ntotal = sum(counts)\ngini = 1 - sum((count/total)**2 for count in counts)\nprint(round(gini, 2))","0.48",["Gini impurity","Decision tree"]),
  e(9,"entropy","Calculate Node Entropy","Trees & Forests","from math import log2\nprobabilities = [0.5, 0.5]\nprint(-sum(p*log2(p) for p in probabilities))","1.0",["Entropy","Information"]),
  e(9,"decision-stump","Predict with a Decision Stump","Trees & Forests","feature = 7\nthreshold = 5\nprint('High' if feature > threshold else 'Low')","High",["Decision stump","Threshold"]),
  e(9,"information-gain","Calculate Information Gain","Trees & Forests","parent_entropy = 1.0\nweighted_child_entropy = 0.4\nprint(parent_entropy - weighted_child_entropy)","0.6",["Information gain","Split"]),
  e(9,"random-forest-vote","Combine Tree Predictions","Trees & Forests","predictions = ['A', 'B', 'A', 'A', 'B']\nprint(max(set(predictions), key=predictions.count))","A",["Random forest","Majority vote"]),

  // Level 10 — SVM & Kernels
  e(10,"linear-decision","Calculate an SVM Decision Score","SVM & Kernels","weights = [0.5, -1]\nfeatures = [4, 1]\nbias = 0.2\nscore = sum(w*x for w,x in zip(weights,features)) + bias\nprint(round(score, 2), 1 if score >= 0 else -1)","1.2 1",["SVM","Hyperplane"]),
  e(10,"margin","Calculate Geometric Margin","SVM & Kernels","from math import sqrt\nscore = 3\nweights = [2, 1]\nprint(round(abs(score)/sqrt(sum(w*w for w in weights)), 3))","1.342",["Margin","SVM"]),
  e(10,"hinge-loss","Calculate Hinge Loss","SVM & Kernels","label, score = 1, 0.6\nprint(max(0, 1 - label*score))","0.4",["Hinge loss","SVM"]),
  e(10,"polynomial-kernel","Calculate a Polynomial Kernel","SVM & Kernels","x, y = [1,2], [3,4]\ndegree, constant = 2, 1\ndot = sum(a*b for a,b in zip(x,y))\nprint((dot+constant)**degree)","144",["Polynomial kernel","Kernel trick"]),
  e(10,"rbf-kernel","Calculate an RBF Kernel","SVM & Kernels","from math import exp\nx, y, gamma = [1,2], [2,4], 0.5\nsquared_distance = sum((a-b)**2 for a,b in zip(x,y))\nprint(round(exp(-gamma*squared_distance), 4))","0.0821",["RBF kernel","Similarity"]),

  // Level 11 — Ensemble Learning
  e(11,"hard-voting","Combine Models with Hard Voting","Ensemble Learning","predictions = [1, 0, 1]\nprint(max(set(predictions), key=predictions.count))","1",["Hard voting","Ensemble"]),
  e(11,"soft-voting","Combine Model Probabilities","Ensemble Learning","probabilities = [0.8, 0.6, 0.7]\naverage = sum(probabilities)/len(probabilities)\nprint(round(average, 2), int(average >= 0.5))","0.7 1",["Soft voting","Probability"]),
  e(11,"weighted-voting","Use Weighted Model Voting","Ensemble Learning","predictions = [0.9, 0.6, 0.4]\nweights = [0.5, 0.3, 0.2]\nprint(round(sum(p*w for p,w in zip(predictions,weights)), 2))","0.71",["Weighted voting"]),
  e(11,"bootstrap-sample","Create a Bootstrap Sample","Ensemble Learning","import random\nrandom.seed(3)\ndata = [1,2,3,4]\nprint(random.choices(data, k=len(data)))","[1, 3, 2, 3]",["Bagging","Bootstrap"]),
  e(11,"adaboost-weight","Update an AdaBoost Sample Weight","Ensemble Learning","from math import exp\nweight, alpha, label, prediction = 0.25, 0.7, 1, -1\nupdated = weight * exp(-alpha*label*prediction)\nprint(round(updated, 4))","0.5034",["AdaBoost","Sample weight"]),

  // Level 12 — Evaluation & Tuning
  e(12,"accuracy","Calculate Accuracy","Evaluation & Tuning","actual = [1,0,1,1]\npredicted = [1,0,0,1]\nprint(sum(a==p for a,p in zip(actual,predicted))/len(actual))","0.75",["Accuracy","Metric"]),
  e(12,"precision-recall","Calculate Precision and Recall","Evaluation & Tuning","tp, fp, fn = 8, 2, 4\nprint(round(tp/(tp+fp),2), round(tp/(tp+fn),2))","0.8 0.67",["Precision","Recall"]),
  e(12,"f1-score","Calculate F1-score","Evaluation & Tuning","precision, recall = 0.8, 0.5\nf1 = 2*precision*recall/(precision+recall)\nprint(round(f1,3))","0.615",["F1-score","Imbalanced data"]),
  e(12,"specificity","Calculate Specificity","Evaluation & Tuning","true_negative, false_positive = 90, 10\nprint(true_negative/(true_negative+false_positive))","0.9",["Specificity","Confusion matrix"]),
  e(12,"grid-search","Select the Best Hyperparameter","Evaluation & Tuning","scores = {1:0.72, 3:0.81, 5:0.78}\nbest = max(scores, key=scores.get)\nprint(best, scores[best])","3 0.81",["Grid search","Hyperparameter tuning"]),

  // Level 13 — Clustering
  e(13,"manhattan-distance","Calculate Manhattan Distance","Clustering","a, b = [1,2], [4,6]\nprint(sum(abs(x-y) for x,y in zip(a,b)))","7",["Manhattan distance","Clustering"]),
  e(13,"nearest-centroid","Assign a Point to a Centroid","Clustering","from math import dist\npoint = [2,2]\ncentroids = [[0,0],[5,5]]\nprint(min(range(len(centroids)), key=lambda i: dist(point,centroids[i])))","0",["K-means","Cluster assignment"]),
  e(13,"update-centroid","Update a Cluster Centroid","Clustering","points = [[1,2],[3,4],[5,6]]\ncentroid = [sum(column)/len(points) for column in zip(*points)]\nprint(centroid)","[3.0, 4.0]",["Centroid","Mean"]),
  e(13,"kmeans-iteration","Run One K-means Iteration","Clustering","from math import dist\npoints = [[1,1],[2,1],[8,8],[9,8]]\ncentroids = [[1,1],[9,8]]\nlabels = [min(range(2), key=lambda i: dist(p,centroids[i])) for p in points]\nprint(labels)","[0, 0, 1, 1]",["K-means","Iteration"]),
  e(13,"silhouette","Calculate a Silhouette Value","Clustering","within_distance, nearest_cluster_distance = 2, 6\nscore = (nearest_cluster_distance-within_distance)/max(within_distance,nearest_cluster_distance)\nprint(round(score,3))","0.667",["Silhouette score","Cluster quality"]),

  // Level 14 — Dimensionality Reduction
  e(14,"center-data","Center Feature Data","Dimensionality Reduction","values = [2,4,6]\nmean = sum(values)/len(values)\nprint([value-mean for value in values])","[-2.0, 0.0, 2.0]",["Centering","PCA"]),
  e(14,"covariance","Calculate Covariance","Dimensionality Reduction","x, y = [1,2,3], [2,4,6]\nmx, my = sum(x)/len(x), sum(y)/len(y)\ncov = sum((a-mx)*(b-my) for a,b in zip(x,y))/(len(x)-1)\nprint(cov)","2.0",["Covariance","PCA"]),
  e(14,"project-vector","Project onto a Principal Direction","Dimensionality Reduction","vector = [3,4]\ndirection = [0.6,0.8]\nprint(sum(a*b for a,b in zip(vector,direction)))","5.0",["Projection","Principal component"]),
  e(14,"explained-variance","Calculate Explained Variance Ratio","Dimensionality Reduction","eigenvalues = [6,3,1]\nprint([value/sum(eigenvalues) for value in eigenvalues])","[0.6, 0.3, 0.1]",["Explained variance","Eigenvalue"]),
  e(14,"low-rank-reconstruction","Build a Rank-one Reconstruction","Dimensionality Reduction","left = [1,2]\nright = [3,4]\nprint([[a*b for b in right] for a in left])","[[3, 4], [6, 8]]",["SVD","Low rank"]),

  // Level 15 — Anomaly Detection
  e(15,"zscore-anomaly","Detect an Anomaly with Z-score","Anomaly Detection","value, mean, std = 130, 100, 8\nz = abs(value-mean)/std\nprint(round(z,2), z>3)","3.75 True",["Z-score","Anomaly"]),
  e(15,"iqr-bounds","Calculate IQR Outlier Bounds","Anomaly Detection","q1, q3 = 10, 20\niqr = q3-q1\nprint(q1-1.5*iqr, q3+1.5*iqr)","-5.0 35.0",["IQR","Outlier"]),
  e(15,"reconstruction-error","Calculate Reconstruction Error","Anomaly Detection","original = [1,4,7]\nreconstructed = [1,3,8]\nerror = sum((a-b)**2 for a,b in zip(original,reconstructed))/len(original)\nprint(round(error,3))","0.667",["Autoencoder","Reconstruction error"]),
  e(15,"isolation-split","Measure an Isolation Split","Anomaly Detection","values = [1,2,3,100]\nthreshold = 50\nleft = [x for x in values if x<threshold]\nright = [x for x in values if x>=threshold]\nprint(left, right)","[1, 2, 3] [100]",["Isolation forest","Split"]),
  e(15,"threshold-alert","Flag Scores above a Threshold","Anomaly Detection","scores = [0.1,0.2,0.85,0.3]\nprint([index for index,score in enumerate(scores) if score>0.7])","[2]",["Anomaly score","Threshold"]),

  // Level 16 — Recommendation Systems
  e(16,"cosine-similarity","Calculate User Similarity","Recommendation Systems","from math import sqrt\na,b=[5,3,0],[4,3,1]\ndot=sum(x*y for x,y in zip(a,b))\ncosine=dot/(sqrt(sum(x*x for x in a))*sqrt(sum(y*y for y in b)))\nprint(round(cosine,3))","0.975",["Cosine similarity","Collaborative filtering"]),
  e(16,"popularity-recommendation","Recommend the Most Popular Item","Recommendation Systems","ratings={'A':[5,4,5],'B':[3,4,3]}\naverages={item:sum(values)/len(values) for item,values in ratings.items()}\nprint(max(averages,key=averages.get))","A",["Popularity model","Average rating"]),
  e(16,"user-mean","Calculate a User Mean Rating","Recommendation Systems","ratings=[5,None,3,4]\nknown=[value for value in ratings if value is not None]\nprint(sum(known)/len(known))","4.0",["Missing rating","User mean"]),
  e(16,"weighted-rating","Predict a Collaborative Rating","Recommendation Systems","similarities=[0.9,0.6]\nratings=[5,3]\nprediction=sum(s*r for s,r in zip(similarities,ratings))/sum(similarities)\nprint(round(prediction,2))","4.2",["Collaborative filtering","Weighted average"]),
  e(16,"precision-at-k","Calculate Precision at K","Recommendation Systems","recommended=['A','B','C']\nrelevant={'A','C','D'}\nprint(sum(item in relevant for item in recommended)/len(recommended))","0.6666666666666666",["Precision@K","Ranking metric"]),

  // Level 17 — Neural Networks
  e(17,"artificial-neuron","Calculate an Artificial Neuron","Neural Networks","inputs=[2,3]\nweights=[0.5,-1]\nbias=1\nprint(sum(x*w for x,w in zip(inputs,weights))+bias)","-1.0",["Neuron","Weights","Bias"]),
  e(17,"relu","Apply ReLU Activation","Neural Networks","values=[-2,0,3]\nprint([max(0,value) for value in values])","[0, 0, 3]",["ReLU","Activation"]),
  e(17,"tanh","Apply Tanh Activation","Neural Networks","from math import tanh\nprint([round(tanh(value),3) for value in [-1,0,1]])","[-0.762, 0.0, 0.762]",["tanh","Activation"]),
  e(17,"softmax","Calculate Softmax Probabilities","Neural Networks","from math import exp\nlogits=[1,2,3]\nvalues=[exp(x) for x in logits]\nprint([round(x/sum(values),3) for x in values])","[0.09, 0.245, 0.665]",["Softmax","Probability"]),
  e(17,"dense-layer","Run a Dense Layer","Neural Networks","inputs=[1,2]\nweights=[[0.5,1.0],[-1.0,0.5]]\nbias=[0.1,0.2]\noutputs=[sum(x*w for x,w in zip(inputs,row))+b for row,b in zip(weights,bias)]\nprint(outputs)","[2.6, 0.2]",["Dense layer","Forward pass"]),

  // Level 18 — Computer Vision
  e(18,"grayscale","Convert RGB to Grayscale","Computer Vision","red,green,blue=100,150,200\ngray=0.299*red+0.587*green+0.114*blue\nprint(round(gray,2))","140.75",["Grayscale","Pixel"]),
  e(18,"binary-threshold","Threshold an Image Row","Computer Vision","pixels=[20,130,250,80]\nprint([255 if pixel>=128 else 0 for pixel in pixels])","[0, 255, 255, 0]",["Thresholding","Image"]),
  e(18,"convolution-1d","Apply a Convolution Filter","Computer Vision","signal=[1,2,3,4,5]\nkernel=[1,0,-1]\noutput=[sum(signal[i+j]*kernel[j] for j in range(3)) for i in range(3)]\nprint(output)","[-2, -2, -2]",["Convolution","Kernel"]),
  e(18,"max-pooling","Apply Max Pooling","Computer Vision","pixels=[[1,4,2,3],[5,2,8,1],[0,6,3,7],[4,2,9,5]]\npooled=[[max(pixels[r+i][c+j] for i in range(2) for j in range(2)) for c in (0,2)] for r in (0,2)]\nprint(pooled)","[[5, 8], [6, 9]]",["Max pooling","Feature map"]),
  e(18,"iou","Calculate Intersection over Union","Computer Vision","intersection,area_a,area_b=20,50,40\nunion=area_a+area_b-intersection\nprint(round(intersection/union,3))","0.286",["IoU","Object detection"]),

  // Level 19 — Sequences & Time Series
  e(19,"moving-average","Calculate a Moving Average","Sequences & Time Series","values=[2,4,6,8,10]\nwindow=3\nprint([sum(values[i:i+window])/window for i in range(len(values)-window+1)])","[4.0, 6.0, 8.0]",["Moving average","Window"]),
  e(19,"lag-feature","Create a Lag Feature","Sequences & Time Series","values=[10,12,15,14]\nprint(list(zip(values[1:],values[:-1])))","[(12, 10), (15, 12), (14, 15)]",["Lag","Time series"]),
  e(19,"differencing","Difference a Time Series","Sequences & Time Series","values=[10,13,18,20]\nprint([current-previous for previous,current in zip(values,values[1:])])","[3, 5, 2]",["Differencing","Stationarity"]),
  e(19,"exponential-smoothing","Apply Exponential Smoothing","Sequences & Time Series","values=[10,14,13]\nalpha=0.5\nsmoothed=[values[0]]\nfor value in values[1:]:\n    smoothed.append(alpha*value+(1-alpha)*smoothed[-1])\nprint(smoothed)","[10, 12.0, 12.5]",["Exponential smoothing","Forecast"]),
  e(19,"sequence-windows","Create Sequence Windows","Sequences & Time Series","values=[1,2,3,4,5]\nsize=3\nprint([values[i:i+size] for i in range(len(values)-size+1)])","[[1, 2, 3], [2, 3, 4], [3, 4, 5]]",["Sliding window","Sequence"]),

  // Level 20 — Natural Language Processing
  e(20,"tokenize","Tokenize a Sentence","Natural Language Processing","text='AI helps students learn'\nprint(text.lower().split())","['ai', 'helps', 'students', 'learn']",["Tokenization","NLP"]),
  e(20,"remove-stopwords","Remove Stop Words","Natural Language Processing","words='this is a useful ai course'.split()\nstop={'this','is','a'}\nprint([word for word in words if word not in stop])","['useful', 'ai', 'course']",["Stop words","Text cleaning"]),
  e(20,"bag-of-words","Create a Bag of Words","Natural Language Processing","from collections import Counter\ntext='ai learns ai predicts'\nprint(dict(Counter(text.split())))","{'ai': 2, 'learns': 1, 'predicts': 1}",["Bag of words","Counter"]),
  e(20,"term-frequency","Calculate Term Frequency","Natural Language Processing","words='ai learns ai predicts'.split()\nterm='ai'\nprint(words.count(term)/len(words))","0.5",["Term frequency","TF-IDF"]),
  e(20,"text-cosine","Compare Text Vectors","Natural Language Processing","from math import sqrt\na,b=[1,1,0],[1,0,1]\nscore=sum(x*y for x,y in zip(a,b))/(sqrt(sum(x*x for x in a))*sqrt(sum(y*y for y in b)))\nprint(round(score,3))","0.5",["Cosine similarity","Text vector"]),

  // Level 21 — Transformers & LLMs
  e(21,"positional-encoding","Calculate Positional Encoding","Transformers & LLMs","from math import sin,cos\nposition=2\nprint(round(sin(position),3),round(cos(position),3))","0.909 -0.416",["Positional encoding","Transformer"]),
  e(21,"scaled-dot-attention","Calculate a Scaled Attention Score","Transformers & LLMs","from math import sqrt\nquery=[1,2]\nkey=[2,1]\nprint(round(sum(q*k for q,k in zip(query,key))/sqrt(len(query)),3))","2.828",["Attention","Scaled dot product"]),
  e(21,"attention-weights","Normalize Attention Scores","Transformers & LLMs","from math import exp\nscores=[1,2]\nvalues=[exp(score) for score in scores]\nprint([round(value/sum(values),3) for value in values])","[0.269, 0.731]",["Softmax","Attention weight"]),
  e(21,"attention-output","Compute an Attention Output","Transformers & LLMs","weights=[0.25,0.75]\nvalues=[[2,4],[6,8]]\noutput=[sum(weights[i]*values[i][j] for i in range(2)) for j in range(2)]\nprint(output)","[5.0, 7.0]",["Self-attention","Weighted sum"]),
  e(21,"greedy-decoding","Choose the Next Token Greedily","Transformers & LLMs","tokens=['AI','helps','learn']\nprobabilities=[0.2,0.6,0.2]\nprint(tokens[max(range(len(tokens)),key=lambda i:probabilities[i])])","helps",["Greedy decoding","Token probability"]),

  // Level 22 — Generative AI, RAG & Agents
  e(22,"text-chunking","Chunk a Document","Generative AI, RAG & Agents","words='AI makes learning interactive and accessible'.split()\nsize=3\nprint([' '.join(words[i:i+size]) for i in range(0,len(words),size)])","['AI makes learning', 'interactive and accessible']",["Chunking","RAG"]),
  e(22,"keyword-retrieval","Retrieve a Relevant Chunk","Generative AI, RAG & Agents","chunks=['Python basics','Machine learning models','Database systems']\nquery={'learning','models'}\nscore=lambda text:len(query & set(text.lower().split()))\nprint(max(chunks,key=score))","Machine learning models",["Retrieval","RAG"]),
  e(22,"rag-prompt","Build a Grounded RAG Prompt","Generative AI, RAG & Agents","context='CGPA is updated semester-wise.'\nquestion='How is CGPA updated?'\nprint(f'Context: {context} Question: {question}')","Context: CGPA is updated semester-wise. Question: How is CGPA updated?",["Prompt","Grounding","RAG"]),
  e(22,"tool-routing","Route an Agent Tool","Generative AI, RAG & Agents","request='calculate 12 * 8'\ntool='calculator' if 'calculate' in request else 'search'\nprint(tool)","calculator",["Agent","Tool routing"]),
  e(22,"agent-loop","Run a Simple Agent Loop","Generative AI, RAG & Agents","steps=['plan','retrieve','answer']\nstate=[]\nfor step in steps:\n    state.append(step)\nprint(' -> '.join(state))","plan -> retrieve -> answer",["Agent loop","Planning"]),

  // Level 23 — Classical AI Search
  e(23,"bfs","Search a Graph with BFS","Classical AI Search","from collections import deque\ngraph={'A':['B','C'],'B':['D'],'C':[],'D':[]}\nqueue,visited=deque(['A']),[]\nwhile queue:\n    node=queue.popleft()\n    if node not in visited:\n        visited.append(node); queue.extend(graph[node])\nprint(visited)","['A', 'B', 'C', 'D']",["BFS","Graph search"]),
  e(23,"dfs","Search a Graph with DFS","Classical AI Search","graph={'A':['B','C'],'B':['D'],'C':[],'D':[]}\nstack,visited=['A'],[]\nwhile stack:\n    node=stack.pop()\n    if node not in visited:\n        visited.append(node); stack.extend(reversed(graph[node]))\nprint(visited)","['A', 'B', 'D', 'C']",["DFS","Graph search"]),
  e(23,"uniform-cost","Select a Uniform-cost Frontier Node","Classical AI Search","frontier=[('A',5),('B',2),('C',7)]\nprint(min(frontier,key=lambda item:item[1]))","('B', 2)",["Uniform-cost search","Path cost"]),
  e(23,"greedy-best-first","Select by Heuristic Value","Classical AI Search","heuristic={'A':6,'B':2,'C':4}\nprint(min(heuristic,key=heuristic.get))","B",["Greedy best-first","Heuristic"]),
  e(23,"a-star","Calculate an A-star Priority","Classical AI Search","nodes={'A':(3,5),'B':(4,2),'C':(2,6)}\npriority={node:g+h for node,(g,h) in nodes.items()}\nprint(min(priority,key=priority.get),priority)","B {'A': 8, 'B': 6, 'C': 8}",["A*","Cost","Heuristic"]),

  // Level 24 — Reinforcement Learning
  e(24,"reward-total","Calculate Total Reward","Reinforcement Learning","rewards=[1,1,-1,5]\nprint(sum(rewards))","6",["Reward","Episode"]),
  e(24,"discounted-return","Calculate Discounted Return","Reinforcement Learning","rewards=[1,2,3]\ngamma=0.5\nresult=sum(reward*(gamma**step) for step,reward in enumerate(rewards))\nprint(result)","2.75",["Discount factor","Return"]),
  e(24,"q-learning-update","Perform a Q-learning Update","Reinforcement Learning","q=2.0\nreward=3\nnext_max=4\nalpha,gamma=0.5,0.9\nq += alpha*(reward+gamma*next_max-q)\nprint(round(q,2))","4.3",["Q-learning","Bellman update"]),
  e(24,"epsilon-greedy","Choose an Epsilon-greedy Action","Reinforcement Learning","import random\nrandom.seed(1)\nactions=['left','right']\nq=[1,3]\nepsilon=0.2\nchoice=random.choice(actions) if random.random()<epsilon else actions[q.index(max(q))]\nprint(choice)","left",["Epsilon greedy","Exploration"]),
  e(24,"value-update","Update a State Value","Reinforcement Learning","reward,next_value,gamma=2,5,0.9\nprint(reward+gamma*next_value)","6.5",["Value iteration","Bellman equation"]),

  // Level 25 — MLOps & Responsible AI
  e(25,"model-metadata","Create Model Version Metadata","MLOps & Responsible AI","model={'name':'marks-predictor','version':'1.0','metric':0.92}\nprint(f\"{model['name']} v{model['version']} accuracy={model['metric']}\")","marks-predictor v1.0 accuracy=0.92",["Model registry","Versioning"]),
  e(25,"data-drift","Measure Mean Data Drift","MLOps & Responsible AI","training=[10,12,14]\nproduction=[15,17,19]\ndrift=sum(production)/len(production)-sum(training)/len(training)\nprint(drift)","5.0",["Data drift","Monitoring"]),
  e(25,"demographic-parity","Compare Selection Rates","MLOps & Responsible AI","selected={'A':8,'B':6}\ntotal={'A':10,'B':10}\nrates={group:selected[group]/total[group] for group in selected}\nprint(rates,abs(rates['A']-rates['B']))","{'A': 0.8, 'B': 0.6} 0.20000000000000007",["Fairness","Demographic parity"]),
  e(25,"monitoring-alert","Trigger a Model Monitoring Alert","MLOps & Responsible AI","baseline_accuracy=0.9\ncurrent_accuracy=0.78\nprint('Retrain' if baseline_accuracy-current_accuracy>0.1 else 'Healthy')","Retrain",["Monitoring","Retraining"]),
  e(25,"explain-linear-model","Explain a Linear Prediction","MLOps & Responsible AI","features={'hours':4,'attendance':0.8}\nweights={'hours':5,'attendance':10}\ncontributions={name:features[name]*weights[name] for name in features}\nprint(contributions,sum(contributions.values()))","{'hours': 20, 'attendance': 8.0} 28.0",["Explainability","Feature contribution"]),

  // Level 26 — Projects & Placement
  e(26,"prediction-pipeline","Build a Small Prediction Pipeline","Projects & Placement","def preprocess(hours):\n    return hours/10\ndef predict(value):\n    return round(40+value*50,1)\nprint(predict(preprocess(6)))","70.0",["Pipeline","Preprocessing","Prediction"]),
  e(26,"batch-prediction","Run Batch Predictions","Projects & Placement","def predict(hours):\n    return min(100,40+hours*6)\nprint([predict(value) for value in [2,5,10]])","[52, 70, 100]",["Batch inference","Project"]),
  e(26,"api-response","Create a Prediction API Response","Projects & Placement","import json\nresponse={'prediction':'placed','confidence':0.87}\nprint(json.dumps(response,sort_keys=True))","{\"confidence\": 0.87, \"prediction\": \"placed\"}",["API","JSON","Deployment"]),
  e(26,"model-card","Create a Compact Model Card","Projects & Placement","model_card={'task':'classification','metric':'F1','score':0.84,'limitation':'small dataset'}\nfor key,value in model_card.items():\n    print(f'{key}: {value}')","task: classification\nmetric: F1\nscore: 0.84\nlimitation: small dataset",["Model card","Documentation"]),
  e(26,"placement-metric-answer","Compute an Interview Confusion Metric","Projects & Placement","tp,fp,fn=42,8,10\nprecision=tp/(tp+fp)\nrecall=tp/(tp+fn)\nf1=2*precision*recall/(precision+recall)\nprint(round(precision,3),round(recall,3),round(f1,3))","0.84 0.808 0.824",["Placement","Precision","Recall","F1-score"],{featured:true})
];

if (programs.length !== 130) throw new Error(`Expected 130 AI/ML programs, received ${programs.length}.`);
module.exports = programs;
