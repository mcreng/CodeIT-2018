import sys
import json

input = json.loads(sys.argv[1])

# input = [{"pos":4,"distance":3},{"pos":7, "distance":1}, { "pos":5,"distance":1}, { "pos":1, "distance":1}]

# part 2
ranges = []
for i in input:
    ranges.append((i["pos"]-i["distance"], i["pos"]+i["distance"]))

ranges.sort(key=lambda p:p[1])

out=[]
last = None
for r in ranges:
    if last == None or last < r[0]:
        last = r[1]
        out.append(last)

print(out)