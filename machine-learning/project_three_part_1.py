# ========== SVM + 乳腺癌数据集 ==========
import matplotlib
matplotlib.use('Agg')

# 2. 导入库
import numpy as np
import seaborn as sns
from sklearn.svm import SVC
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# ---------- 设置中文字体 ----------
plt.rcParams['font.sans-serif'] = ['Noto Sans CJK SC', 'SimHei']      
plt.rcParams['axes.unicode_minus'] = False
# ---------------------------------

# 3. 加载乳腺癌数据集
cancer = load_breast_cancer()
X, y = cancer.data, cancer.target
print(f"数据集形状: {X.shape}")
print(f"特征数量: {X.shape[1]}")
print(f"目标类别: {cancer.target_names}")  # ['malignant' 'benign']

# 4. 数据标准化（SVM对特征尺度敏感，必须做）
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 5. 划分训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# 6. 创建并训练SVM模型
model = SVC(kernel='rbf', random_state=42)  # rbf核函数，适合非线性数据
model.fit(X_train, y_train)

# 7. 预测与评估
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\n模型准确率: {accuracy:.4f}")
print("\n分类报告:\n", classification_report(y_test, y_pred, target_names=cancer.target_names))

# 8. 混淆矩阵可视化
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(6, 5))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=cancer.target_names,
            yticklabels=cancer.target_names)
plt.xlabel("预测值")
plt.ylabel("真实值")
plt.title("乳腺癌数据集 - SVM混淆矩阵")
plt.savefig('results/project_three_part_1.png')
print("图表已保存为 results/project_three_part_1.png")
