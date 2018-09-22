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

bills = balance

out_trans = []


while sorted(bills.items(), key=lambda x: x[1],reverse=True)[0][1]>0.001:
    sorted_bills = sorted(bills.items(), key=lambda x: x[1],reverse=True)

    diff_highest_lowest = sorted_bills[0][1]+sorted_bills[-1][1]
    if diff_highest_lowest > 0:
        tmp_tran = {"from": sorted_bills[-1][0], "to": sorted_bills[0][0], "amount": round(abs(sorted_bills[-1][1]),2)}
        bills[sorted_bills[-1][0]]=0 
        bills[sorted_bills[0][0]] = diff_highest_lowest
    else:  
        tmp_tran = {"from": sorted_bills[-1][0], "to": sorted_bills[0][0], "amount": round(abs(sorted_bills[0][1]),2)}
        bills[sorted_bills[-1][0]]=diff_highest_lowest
        bills[sorted_bills[0][0]]=0 
    out_trans.append(tmp_tran)

print(out_trans)
sys.stdout.flush()
