import json
import sys
#input = sys.argv[1]


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

bills = balance

out_trans = {"transactions": []}

while sorted(bills.items(), key=lambda x: x[1],reverse=True)[0][1]>0.001:
    sorted_bills = sorted(bills.items(), key=lambda x: x[1],reverse=True)

    diff_highest_lowest = sorted_bills[0][1]+sorted_bills[-1][1] # Note that array[-1] is the last element of an array (for us: lowest value)
    if diff_highest_lowest > 0: # In this case the lowest amount can't fill the highest amount
        
        tmp_tran = {"from": sorted_bills[-1][0], "to": sorted_bills[0][0], "amount": round(abs(sorted_bills[-1][1]),2)}
        bills[sorted_bills[-1][0]]=0 # The lowest bill is done paying!
        bills[sorted_bills[0][0]] = diff_highest_lowest # The person with the most amount of money still needs to receive money
    else: # The highest amount gets completely paid off. 
        
        tmp_tran = {"from": sorted_bills[-1][0], "to": sorted_bills[0][0], "amount": round(abs(sorted_bills[0][1]),2)}
        bills[sorted_bills[-1][0]]=diff_highest_lowest # The lowest person still has to pay
        bills[sorted_bills[0][0]]=0 # The richest person got all of his money

    out_trans['transactions'].append(tmp_tran)

print(json.dumps(out_trans))
sys.stdout.flush()
