import sys
import json

n = sys.argv[1]

#input = [4, 7, 5, 1, 12, 13, 9, 2, 6, 3, 21]

console.log(n)

n.sort()

min = max(n)
for i in range(0,len(n)-1):
    if (n[i+1] - n[i]) < min: 
        min = (n[i+1] - n[i])

print(min)
sys.stdout.flush()
