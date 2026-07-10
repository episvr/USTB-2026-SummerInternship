import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib import font_manager

# 查找系统中支持中文的字体
font_path = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'

prop = font_manager.FontProperties(fname=font_path)
plt.rcParams['font.family'] = prop.get_name()
plt.rcParams['axes.unicode_minus'] = False


import numpy as np
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import (
    RBF, Matern, RationalQuadratic, WhiteKernel, ConstantKernel
)

# =========================== 1. 生成合成数据 ===========================
# 在 [-5, 5] 区间内生成 30 个训练点，目标函数为 sin(x) + 噪声
np.random.seed(42)
X_train = np.random.uniform(-5, 5, 30).reshape(-1, 1)
y_train = np.sin(X_train).ravel() + 0.2 * np.random.randn(30)

# 测试点（密集网格，用于绘制光滑曲线）
X_test = np.linspace(-6, 6, 200).reshape(-1, 1)

# =========================== 2. 定义 GPR 模型 ===========================
# 核函数：常数核 × RBF + 白噪声核（用于模拟观测噪声）
# - ConstantKernel: 信号振幅（控制 y 的尺度）
# - RBF: 径向基函数核，长度尺度 l 控制函数变化的平滑度
# - WhiteKernel: 观测噪声方差
kernel = ConstantKernel(1.0, (0.1, 10.0)) * RBF(1.0, (0.1, 10.0)) + WhiteKernel(0.1, (0.01, 1.0))
gpr = GaussianProcessRegressor(
    kernel=kernel,
    alpha=1e-6,           # 额外正则项（通常设很小）
    n_restarts_optimizer=5,
    random_state=42
)

# 训练模型（拟合超参数）
gpr.fit(X_train, y_train)

# 预测（返回均值和标准差）
y_pred, y_std = gpr.predict(X_test, return_std=True)

# =========================== 3. 可视化拟合结果 ===========================
plt.figure(figsize=(12, 6))

# 子图1：拟合曲线 + 置信区间
plt.subplot(2, 2, 1)
plt.plot(X_test, y_pred, 'b-', label='预测均值')
plt.fill_between(X_test.ravel(),
                 y_pred - 1.96 * y_std,
                 y_pred + 1.96 * y_std,
                 alpha=0.2, color='blue', label='95% 置信区间')
plt.scatter(X_train, y_train, c='red', s=30, label='训练点')
plt.xlabel('x')
plt.ylabel('y')
plt.title('GPR 拟合结果 (RBF 核)')
plt.legend()
plt.grid(alpha=0.3)

# 子图2：不同核函数对比
# 创建三个 GPR 实例，分别使用不同核
kernels = {
    'RBF': RBF(1.0),
    'Matern (ν=1.5)': Matern(length_scale=1.0, nu=1.5),
    'RationalQuadratic': RationalQuadratic(alpha=1.0, length_scale=1.0)
}
plt.subplot(2, 2, 2)
for name, kernel in kernels.items():
    gpr_temp = GaussianProcessRegressor(
        kernel=kernel + WhiteKernel(0.1),
        alpha=1e-6,
        random_state=42
    )
    gpr_temp.fit(X_train, y_train)
    y_pred_temp, y_std_temp = gpr_temp.predict(X_test, return_std=True)
    plt.plot(X_test, y_pred_temp, label=name)
plt.scatter(X_train, y_train, c='red', s=20, alpha=0.6)
plt.xlabel('x')
plt.ylabel('y')
plt.title('不同核函数对比')
plt.legend()
plt.grid(alpha=0.3)

# 子图3：超参数影响——长度尺度变化
plt.subplot(2, 2, 3)
length_scales = [0.3, 1.0, 3.0]
for l in length_scales:
    kernel = RBF(length_scale=l) + WhiteKernel(0.1)
    gpr_temp = GaussianProcessRegressor(kernel=kernel, alpha=1e-6)
    gpr_temp.fit(X_train, y_train)
    y_pred_temp, _ = gpr_temp.predict(X_test, return_std=True)
    plt.plot(X_test, y_pred_temp, label=f'l = {l}')
plt.scatter(X_train, y_train, c='red', s=20, alpha=0.6)
plt.xlabel('x')
plt.ylabel('y')
plt.title('长度尺度 l 对拟合的影响')
plt.legend()
plt.grid(alpha=0.3)

# 子图4：数据量增加对不确定性的影响
plt.subplot(2, 2, 4)
# 分别使用 5, 15, 30 个训练点
for n in [5, 15, 30]:
    X_sub = X_train[:n]
    y_sub = y_train[:n]
    gpr_temp = GaussianProcessRegressor(
        kernel=RBF(1.0) + WhiteKernel(0.1),
        alpha=1e-6,
        random_state=42
    )
    gpr_temp.fit(X_sub, y_sub)
    y_pred_temp, y_std_temp = gpr_temp.predict(X_test, return_std=True)
    plt.fill_between(X_test.ravel(),
                     y_pred_temp - 1.96 * y_std_temp,
                     y_pred_temp + 1.96 * y_std_temp,
                     alpha=0.2, label=f'n={n}')
    plt.plot(X_test, y_pred_temp, linestyle='--')
plt.xlabel('x')
plt.ylabel('y')
plt.title('数据量增加 → 不确定性降低')
plt.legend()
plt.grid(alpha=0.3)

plt.tight_layout()
plt.savefig('results/project_three_part_3.png')
print("图表已保存为 results/project_three_part_3.png")

# =========================== 4. 打印优化后的核参数 ===========================
print("优化后的核参数:")
print(gpr.kernel_)
print(f"对数边际似然: {gpr.log_marginal_likelihood():.2f}")