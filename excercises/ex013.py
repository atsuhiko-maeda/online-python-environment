# 下記で指定された要件を満たすプログラムを作成せよ．
# コード断片が与えられている場合は，必要なコードのみをアンコメントし，
# 適切に並べ替え，必要ならばインデントも加えて作成すること．

print("-------------------------------------------------")
print("問題1")

# 1から10までの数字を順に表示する．
# その際，表示する数字が偶数のときには「偶数です」，　
# 奇数のときは「奇数です」と付け加える．

### <!---- shuffle, commentout, noindent
for n in range(1,11):
#for n in range(1,10):
    # if n//2==0:
    # if n/2==0:
    if n%2==0:
        print(n,"-->偶数です")
    else:
        print(n,"-->奇数です")
### --->

print("-------------------------------------------------")
print("問題2")
# num_listの数字を順に表示する．
# その際，表示する数字が偶数のときには「偶数です」，　
# 奇数のときは「奇数です」と付け加える．
        
### <!---- shuffle, commentout, noindent
num_list = [3,5,7,10,12,43,87]
for n in num_list:
    # if n%2=0:
    if n%2==0:
        print(n,"-->偶数です")
    else:
        print(n,"-->奇数です")
### --->

print("-------------------------------------------------")
print("問題3")
# 1から10までの数字を順に表示する．
# その際，表示する数字が2で割り切れるときには「2で割り切れます」，
# 3で割り切れるときは「3で割り切れます」，
# 2と3の両方で割り切れるときには「2と3で割り切れます」と
# 付け加える．


