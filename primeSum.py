n = 95

prime = [True for i in range(n+1)]
for p in range(2, int(round(n**0.5))):
    if (prime[p] == True):
        for i in range(p * 2, n+1, p):
            prime[i] = False

if prime[n]: print(n)
elif n%2:
    for i in range(1, n//2+1):
        j = n - 2*i
        if (prime[i] and prime[j]): 
            for k in range(2,i*2):
                if (prime[k] and prime[i*2-k] and k != (i*2-k) and k != j and (i*2-k) != j and (i*2-k) > 1):
                    print(j, k,(i*2-k))
                    exit(0)
else:
    for i in range(2,n//2+1):
        if (prime[i] and prime[n-i] and i != (n-i)):
            print(i,(n-i))
            break
