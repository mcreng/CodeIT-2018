import sys
import json

input = json.loads(sys.argv[1])

#input = [4, 7, 5, 1, 12, 13, 9, 2, 6, 3, 21]

input.sort()

min = max(input)
for i in range(0,len(input)-1):
    if (input[i+1] - input[i]) < min: 
        min = (input[i+1] - input[i])

print(min)
sys.stdout.flush()