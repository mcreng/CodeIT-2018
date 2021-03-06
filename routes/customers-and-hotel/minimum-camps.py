import sys
import json

n = json.loads(sys.argv[1])

# input = [{"pos":4,"distance":3},{"pos":7, "distance":1}, { "pos":5,"distance":1}, { "pos":1, "distance":1}]
ranges = []
for i in n:
    ranges.append((max(i["pos"]-i["distance"],0), i["pos"]+i["distance"]))
    
ranges.sort(key=lambda p:p[1])

cnt = 0
last = None
for r in ranges:
    if last == None or last < r[0]:
        last = r[1]
        cnt += 1

print(cnt)
sys.stdout.flush()
