# 1. 设置 Matplotlib 后端（解决部分环境下的显示问题）
import matplotlib
matplotlib.use('Agg')

# 2. 导入必要的库
import matplotlib.pyplot as plt
from sklearn.datasets import make_regression
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

# ---------- 设置中文字体（解决中文乱码） ----------
plt.rcParams['font.sans-serif'] = ['Noto Sans CJK SC', 'SimHei']
plt.rcParams['axes.unicode_minus'] = False
# -------------------------------------------------

# 3. 生成数据集（100个样本，1个特征，带噪声）
X, y = make_regression(n_samples=100, n_features=1, noise=10, random_state=42)

# 4. 划分训练集和测试集（80% 训练，20% 测试）
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5. 创建并训练线性回归模型
model = LinearRegression()
model.fit(X_train, y_train)

# 6. 在测试集上进行预测
y_pred = model.predict(X_test)

# 7. 评估模型性能
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"模型系数 (斜率): {model.coef_[0]:.2f}")
print(f"模型截距: {model.intercept_:.2f}")
print(f"均方误差 (MSE): {mse:.2f}")
print(f"决定系数 (R²): {r2:.2f}")

# 8. 可视化结果
plt.scatter(X_test, y_test, color='black', label='实际值')
plt.plot(X_test, y_pred, color='blue', linewidth=3, label='预测值')
plt.legend()
plt.xlabel('特征 X')
plt.ylabel('目标 y')
plt.title('线性回归模型预测结果')

plt.savefig('results/project_two.png')
print("图表已保存为 results/project_two.png")
    