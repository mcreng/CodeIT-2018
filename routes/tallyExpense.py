import json
import sys

n = sys.argv[1]

dict_input = json.loads(n)

persons = dict_input["persons"]
n_total = len(persons)
balance = {}
for person in persons:
    balance[person] = 0

trans = dict_input['expenses']
for tran in trans:
    paidBy = tran["paidBy"]
    amount = tran["amount"]
    exclude_persons = [paidBy]
    if "exclude" in tran:
        exclude = tran["exclude"]
        n_div = n_total - len(exclude)
        acc = amount / n_div
        exclude_persons += exclude
    else: acc = amount / n_total
    
    split_persons = [p for p in persons if p not in exclude_persons]

    for p in split_persons:
        balance[p] -= acc

    balance[paidBy] += amount - acc

balance = sorted(balance.items(), key=lambda x: x[1])

out_trans = {"transactions": []}

neg_ptr = n_total-1
for i in range(n_total):
    balance[i] = list(balance[i])
    while balance[i][1] < 0:
        balance[neg_ptr] = list(balance[neg_ptr])    
        tmp_tran = {"from": balance[i][0], "to": balance[neg_ptr][0], "amount": 0}
        if abs(balance[i][1]) >= abs(balance[neg_ptr][1]):
            balance[i][1] += abs(balance[neg_ptr][1])
            tmp_tran["amount"] = round(abs(balance[neg_ptr][1]),2)
            balance[neg_ptr][1] = 0
            neg_ptr -= 1
        else:
            balance[neg_ptr][1] -= abs(balance[i][1])
            tmp_tran["amount"] = round(abs(balance[i][1]),2)
            balance[i][1] = 0
        out_trans['transactions'].append(tmp_tran)

print(json.dumps(out_trans))
sys.stdout.flush()
