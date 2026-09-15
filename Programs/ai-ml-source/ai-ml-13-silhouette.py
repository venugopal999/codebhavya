within_distance, nearest_cluster_distance = 2, 6
score = (nearest_cluster_distance-within_distance)/max(within_distance,nearest_cluster_distance)
print(round(score,3))
