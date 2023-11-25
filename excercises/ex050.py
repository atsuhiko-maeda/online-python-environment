import numpy as np

import matplotlib
matplotlib.use("module://matplotlib_pyodide.html5_canvas_backend")

from matplotlib import pyplot as plt

# データセット: 東京の平均気温
x = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
y1 = [7.1, 8.3, 10.7, 12.8, 19.5, 23.2, 24.3, 29.1, 24.2, 17.5, 14.0, 7.7]  # 2020年
y2 = [5.6, 7.2, 10.6, 13.6, 20.0, 21.8, 24.1, 28.4, 25.1, 19.4, 13.1, 8.5]  # 2019年
y3 = [4.7, 5.4, 11.5, 17.0, 19.8, 22.4, 28.3, 28.1, 22.9, 19.1, 14.0, 8.3]  # 2018年

# 折れ線グラフを作成
flg = plt.figure()
ax = flg.add_subplot()
ax.plot(x, y1)
ax.plot(x, y2)
ax.plot(x, y3)
ax.set_title('東京の平均気温')  # グラフタイトル追加
ax.set_xlabel('月')             # X軸のラベル
ax.set_ylabel('気温')           # Y軸のラベル
# 画像ファイルに出力
plt.show()
