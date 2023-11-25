# ex013.py
print("-------------------------------------------------")
print("問題1")
# 下方のコードを並べ替え，適切にインデントを加え，
# 以下の条件を満たすプログラムを作成せよ．

# ・1から10までの数字を順に表示する．
# ・表示する数字が偶数のときには「偶数です」，
# 　奇数のときは「奇数です」と付け加えて表示する．

#<START>
for n in range(1,11):
    if n%2==0:
        print(n,"-->偶数です")
    else:
        print(n,"-->奇数です")
#<END>

print("-------------------------------------------------")
print("問題2")
# 下方のコードを並べ替え，適切にインデントを加え，
# 以下の条件を満たすプログラムを作成せよ．

# ・num_listの数字を順に表示する．
# ・表示する数字が偶数のときには「偶数です」，
# 　奇数のときは「奇数です」と付け加えて表示する．
        
#<START>
num_list = [3,5,7,10,12,43,87]
for n in num_list:
    if n%2==0:
        print(n,"-->偶数です")
    else:
        print(n,"-->奇数です")
#<END>

print("-------------------------------------------------")
print("問題3")
# 下方のコードを並べ替え，適切にインデントを加え，
# 以下の条件を満たすプログラムを作成せよ．

# ・1から10までの数字を順に表示する．
# ・表示する数字が2で割り切れるときには「2で割り切れます」，
# 　3で割り切れるときは「3で割り切れます」と付け加えて表示する．
# ・2と3の両方で割り切れるときには「2と3で割り切れます」と
# 　付け加えて表示する．

#<START>
for n in range(1,11):
    if n%2==0 and n%3==0:
        print(n,"-->2と3で割り切れます")
    elif n%2==0:
        print(n,"-->2で割り切れます")
    elif n%3==0:
        print(n,"-->3で割り切れます")
    else:
        print(n)
#<END>

