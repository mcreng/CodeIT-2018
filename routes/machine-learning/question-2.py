import numpy as np
import sys
import json

question = np.array(json.loads(sys.argv[1])) / 255

from TwoLayerNet import TwoLayerNet
local_net = TwoLayerNet(28*28, 256, 10)
local_net.params = dict(np.load('./routes/machine-learning/model.npy')[0])
eva = local_net.predict(question)

print(json.dumps(eva.tolist()))

sys.stdout.flush()