import sys
import json

n = sys.argv[1]

# input = [{"pos":4,"distance":3},{"pos":7, "distance":1}, { "pos":5,"distance":1}, { "pos":1, "distance":1}]
print(n)
ranges = []
for i in n:
    #ranges.append((i["pos"]-i["distance"], i["pos"]+i["distance"]))
    pass
    
ranges.sort(key=lambda p:p[1])

cnt = 0
last = None
for r in ranges:
    if last == None or last < r[0]:
        last = r[1]
        cnt += 1

print(cnt)
sys.stdout.flush()
