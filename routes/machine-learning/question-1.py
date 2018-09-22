import numpy as np
import sys
import json

data = np.array(json.loads(sys.argv[1]))
output = np.array(json.loads(sys.argv[2]))
question = np.array(json.loads(sys.argv[3]))

# to find hidden by least square
guess, _, _, _ = np.linalg.lstsq(data, output, rcond=None)
print(question.T.dot(guess))


sys.stdout.flush()