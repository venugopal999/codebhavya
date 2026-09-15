from collections import namedtuple
Point = namedtuple('Point', 'x y')
point = Point(3, 4)
print(point.x, point.y)
