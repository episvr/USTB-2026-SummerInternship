import matplotlib
matplotlib.use('Agg')

import numpy as np
import matplotlib.pyplot as plt
from sklearn.svm import SVC
from sklearn.datasets import make_moons
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

plt.rcParams['font.sans-serif'] = ['Noto Sans CJK SC', 'SimHei']
plt.rcParams['axes.unicode_minus'] = False

X, y = make_moons(n_samples=200, noise=0.15, random_state=42)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.3, random_state=42
)

degrees = range(1, 10)
models = {}
accuracies = {}

for d in degrees:
    model = SVC(kernel='poly', degree=d, gamma='scale', C=1.0, coef0=1)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    models[d] = model
    accuracies[d] = acc
    print(f"多项式核 degree={d}: 准确率 = {acc:.4f}")

fig, axes = plt.subplots(3, 3, figsize=(15, 12))
axes = axes.ravel()

x_min, x_max = X_scaled[:, 0].min() - 0.5, X_scaled[:, 0].max() + 0.5
y_min, y_max = X_scaled[:, 1].min() - 0.5, X_scaled[:, 1].max() + 0.5
xx, yy = np.meshgrid(np.linspace(x_min, x_max, 300),
                     np.linspace(y_min, y_max, 300))

for idx, d in enumerate(degrees):
    ax = axes[idx]
    model = models[d]

    Z = model.predict(np.c_[xx.ravel(), yy.ravel()])
    Z = Z.reshape(xx.shape)

    ax.contourf(xx, yy, Z, alpha=0.3, cmap=plt.cm.RdYlBu)
    ax.scatter(X_scaled[:, 0], X_scaled[:, 1], c=y, cmap=plt.cm.RdYlBu,
               edgecolors='k', s=40)

    sv = model.support_vectors_
    ax.scatter(sv[:, 0], sv[:, 1], s=80, facecolors='none',
               edgecolors='k', linewidths=1.2, label='支持向量')

    ax.set_xlim(x_min, x_max)
    ax.set_ylim(y_min, y_max)
    ax.set_title(f"多项式核 degree={d}\n准确率: {accuracies[d]:.3f}")
    ax.set_xlabel("特征 X1")
    ax.set_ylabel("特征 X2")
    ax.legend(fontsize=8)

plt.tight_layout()
plt.savefig('results/project_poly_kernels_decision.png', dpi=150)
print("\n决策边界图已保存为 results/project_poly_kernels_decision.png")

# ========== 图2: 多项式核函数 K(x, y) 的镜像形状 ==========
fig2, axes2 = plt.subplots(3, 3, figsize=(15, 12))
axes2 = axes2.ravel()

x_vals = np.linspace(-3, 3, 400)
y_fixed = 1.0

for idx, d in enumerate(degrees):
    ax = axes2[idx]
    # K(x, y) = (x*y + coef0)^d
    kernel_vals = (x_vals * y_fixed + 1) ** d
    ax.plot(x_vals, kernel_vals, linewidth=2)
    ax.axvline(x=y_fixed, color='gray', linestyle='--', alpha=0.5, label=f'参考点 y={y_fixed}')
    ax.set_title(f"K(x) = (x·{y_fixed:.0f} + 1)^{{{d}}}")
    ax.set_xlabel("x")
    ax.set_ylabel("K(x, y)")
    ax.legend(fontsize=8)
    ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('results/project_poly_kernels_functions.png', dpi=150)
print("核函数曲线图已保存为 results/project_poly_kernels_functions.png")

print(f"\n最高准确率: degree={max(accuracies, key=accuracies.get)}, "
      f"准确率={max(accuracies.values()):.4f}")
