import json
import sys

#n = sys.argv[1]

n = json.loads(sys.argv[1])#n)

persons = n["persons"]
n_total = len(persons)

balance = {}
for p in persons:
    balance[p] = 0

trans = n["expenses"]

for tran in trans:
    paidBy = tran['paidBy']
    amount = tran['amount']
    if "exclude" in tran:
        exclude_list = tran['exclude']
        exclude_list.append(paidBy)
    else: exclude_list = [paidBy]
    share_list = [p for p in persons if p not in exclude_list]

    acc = amount/(n_total-len(exclude_list)+1)

    for p in share_list:
        balance[p] -= acc

    balance[paidBy] += amount - acc

out_trans = {"transactions": []}

balance = sorted(balance.items(), key=lambda x: x[1])

neg_ptr = n_total-1
for i in range(n_total):
    balance[i] = list(balance[i])
    while balance[i][1] < 0:
        balance[neg_ptr] = list(balance[neg_ptr])
        if (neg_ptr < i):
            break
        if abs(balance[i][1]) >= abs(balance[neg_ptr][1]):
            balance[i][1] += abs(balance[neg_ptr][1])
            tmp_tran = {"from": balance[i][0], "to": balance[neg_ptr][0], "amount": round(abs(balance[neg_ptr][1]),2)}
            balance[neg_ptr][1] = 0
            neg_ptr -= 1
            
        else:
            balance[neg_ptr][1] -= abs(balance[i][1])
            tmp_tran = {"from": balance[i][0], "to": balance[neg_ptr][0], "amount": round(abs(balance[i][1]),2)}
            balance[i][1] = 0
        out_trans["transactions"].append(tmp_tran)

print(json.dumps(out_trans))
sys.stdout.flush()
