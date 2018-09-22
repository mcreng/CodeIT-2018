import tensorflow as tf
import numpy as np
import time

tf.keras.backend.clear_session()
mnist = tf.keras.datasets.mnist

(x_train, y_train),(x_test, y_test) = mnist.load_data()
x_train, x_test = x_train / 255.0, x_test / 255.0

x_train = x_train.reshape([x_train.shape[0], -1])
x_val = x_train[:1000]
y_val = y_train[:1000]
x_train = x_train[1000:]
y_train = y_train[1000:]
x_test = x_test.reshape([x_test.shape[0], -1])

start = time.time()
# get a classification accuracy of over 0.35 on the validation set.
from TwoLayerNet import TwoLayerNet
result = {}
best_val = -1
best_softmax = None
learning_rates = [1e-1]
learning_rate_decays = [.94]
regularization_strengths = [1e-2]

for lr in learning_rates:
    for reg in regularization_strengths:
        for lr_decay in learning_rate_decays:
            # Train the network
            print(lr, reg, lr_decay)
            local_net = TwoLayerNet(28*28, 256, 10)
            local_stat = local_net.train(x_train, y_train, x_val, y_val,
                        num_iters=1500, batch_size=500,
                        learning_rate=lr, learning_rate_decay=lr_decay,
                        reg=reg, verbose=True)
            acc = np.max(local_stat['val_acc_history'])
            result[(lr, reg, lr_decay)] = acc
            if acc > best_val:
                best_val = acc

# Print out results.
for lr, reg, decay in result:
    print('lr: %f; reg: %f; decay: %f: %f' % (lr, reg, decay, result[(lr, reg, decay)]) )

print('best validation accuracy achieved during cross-validation: %f' % best_val)

#model.load_weights('./checkpoint/')



end = time.time()
print('loaded', end-start)
start = time.time()
eva = local_net.predict(x_test)
end = time.time()
print('eva', end-start)
