import matplotlib
matplotlib.use('Agg')
import numpy as np
import seaborn as sns
from sklearn import datasets
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.gaussian_process import GaussianProcessClassifier
from sklearn.gaussian_process.kernels import RBF, ConstantKernel, WhiteKernel
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

plt.rcParams['font.sans-serif'] = ['Noto Sans CJK SC', 'SimHei', 'Microsoft YaHei', 'PingFang SC']
plt.rcParams['axes.unicode_minus'] = False

# 1. 加载鸢尾花完整数据集（全部4个特征）
iris = datasets.load_iris()
X = iris.data          # 形状 (150, 4)：花萼长度、花萼宽度、花瓣长度、花瓣宽度
y = iris.target        # 三种类别 (0, 1, 2)

# 2. 将数据"分裂"为训练集和测试集 (30% 作为测试集)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y  # stratify保证各类别比例均衡
)

print(f"训练集样本数: {X_train.shape[0]}, 测试集样本数: {X_test.shape[0]}")
print(f"特征维度: {X_train.shape[1]}\n")

# 3. 定义高斯过程的核函数（针对多维特征使用各向异性RBF）
#    各向异性：每个特征赋予独立的长度尺度（length_scale），以自动适应不同特征的贡献
#    加上 WhiteKernel 处理观测噪声，提高数值稳定性
kernel = (
    ConstantKernel(1.0, constant_value_bounds=(1e-2, 1e2))
    * RBF(length_scale=[1.0] * X.shape[1], length_scale_bounds=(1e-2, 1e2))
    + WhiteKernel(noise_level=1e-3, noise_level_bounds=(1e-5, 1e1))
)

# 4. 创建并训练高斯过程分类器
gpc = GaussianProcessClassifier(
    kernel=kernel,
    optimizer='fmin_l_bfgs_b',  # 使用L-BFGS-B优化超参数
    n_restarts_optimizer=5,     # 多次随机重启避免陷入局部最优
    random_state=42
)
gpc.fit(X_train, y_train)

# 5. 在测试集上进行预测
y_pred = gpc.predict(X_test)
y_pred_proba = gpc.predict_proba(X_test)  # 获取每个类别的预测概率

# 6. 输出评估结果
print("="*50)
print("【模型评估结果（全部4个特征）】")
print("="*50)
print(f"测试集准确率 (Accuracy): {accuracy_score(y_test, y_pred):.4f}\n")

print("详细分类报告 (Precision / Recall / F1-score):")
print(classification_report(y_test, y_pred, target_names=iris.target_names))

print("混淆矩阵 (Confusion Matrix):")
cm = confusion_matrix(y_test, y_pred)
print(cm)

# 可选：绘制混淆矩阵热力图
plt.figure(figsize=(6, 4))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=iris.target_names, yticklabels=iris.target_names)
plt.xlabel('预测类别')
plt.ylabel('真实类别')
plt.title('高斯过程分类混淆矩阵 (全部4特征)')
plt.tight_layout()
plt.savefig('results/project_four_2.png')
print("图表已保存为 results/project_four_2.png")

# 7. 查看训练后优化得到的核函数超参数
print("\n【优化后的核函数超参数】")
print(f"对数边际似然 (Log-Marginal Likelihood): {gpc.log_marginal_likelihood(gpc.kernel_.theta):.3f}")
print(f"核函数参数 (theta): {gpc.kernel_.theta}")