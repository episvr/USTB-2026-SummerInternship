import warnings
import matplotlib
matplotlib.use('Agg')
import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
warnings.filterwarnings('ignore')

import joblib
import lightgbm as lgb
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, GridSearchCV, cross_val_score
from sklearn.metrics import (accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_auc_score, roc_curve)

# ----------------------------- 1. 加载数据 -----------------------------
print("="*60)
print("1. 加载乳腺癌数据集")
data = load_breast_cancer()
X = pd.DataFrame(data.data, columns=data.feature_names)
y = pd.Series(data.target, name='target')   # 0: 恶性, 1: 良性

print(f"数据集形状: {X.shape}")
print(f"类别分布:\n{y.value_counts()}")

# ----------------------------- 2. 划分训练/测试集 -----------------------------
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print(f"训练集: {X_train.shape[0]} 样本, 测试集: {X_test.shape[0]} 样本")

# ----------------------------- 3. 特征标准化 -----------------------------
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 保存标准化器供后续使用
joblib.dump(scaler, 'scaler_lgb.pkl')

# ----------------------------- 4. 构建 LightGBM 基础模型 -----------------------------
base_lgb = lgb.LGBMClassifier(
    objective='binary',
    metric='auc',
    boosting_type='gbdt',
    random_state=42,
    n_jobs=-1,
    verbose=-1
)

# ----------------------------- 5. 超参数调优（GridSearchCV）-----------------------------
print("\n2. 开始超参数调优 (GridSearchCV)...")
param_grid = {
    'n_estimators': [50, 100, 200],
    'learning_rate': [0.01, 0.05, 0.1],
    'num_leaves': [15, 31, 63],
    'max_depth': [-1, 8, 12],
    'min_child_samples': [10, 20, 30]
}

grid_search = GridSearchCV(
    estimator=base_lgb,
    param_grid=param_grid,
    cv=5,
    scoring='accuracy',
    n_jobs=-1,
    verbose=1
)
grid_search.fit(X_train_scaled, y_train)

print(f"最佳参数组合: {grid_search.best_params_}")
print(f"最佳交叉验证准确率: {grid_search.best_score_:.4f}")

best_lgb = grid_search.best_estimator_

# 在测试集上评估
y_pred = best_lgb.predict(X_test_scaled)
y_pred_proba = best_lgb.predict_proba(X_test_scaled)[:, 1]

test_acc = accuracy_score(y_test, y_pred)
test_auc = roc_auc_score(y_test, y_pred_proba)

print(f"测试集准确率: {test_acc:.4f}")
print(f"测试集 AUC: {test_auc:.4f}")

# 详细分类报告
from sklearn.metrics import classification_report
print("\n分类报告:")
print(classification_report(y_test, y_pred, target_names=['Malignant', 'Benign']))

# ----------------------------- 6. 交叉验证（最终模型）-----------------------------
cv_scores = cross_val_score(best_lgb, X_train_scaled, y_train, cv=5, scoring='accuracy')
print(f"\n5折交叉验证平均准确率: {cv_scores.mean():.4f} (+/- {cv_scores.std()*2:.4f})")

# ----------------------------- 7. 混淆矩阵可视化 -----------------------------
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(5,4))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['Malignant', 'Benign'],
            yticklabels=['Malignant', 'Benign'])
plt.title('Confusion Matrix - LightGBM')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.tight_layout()
plt.savefig('results/confusion_matrix_lgb.png', dpi=300)
print("混淆矩阵图已保存为 results/confusion_matrix_lgb.png")

# ----------------------------- 8. 特征重要性分析（内置）-----------------------------
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# 8.1 split 重要性
imp_split = pd.DataFrame({
    'Feature': X.columns,
    'Importance': best_lgb.feature_importances_   # 默认是 'split'
}).sort_values('Importance', ascending=False).head(15)

sns.barplot(x='Importance', y='Feature', data=imp_split, ax=axes[0])
axes[0].set_title('Feature Importance (Split) - Top 15')

# 8.2 gain 重要性
gain_importance = best_lgb.booster_.feature_importance(importance_type='gain')
imp_gain = pd.DataFrame({
    'Feature': X.columns,
    'Importance': gain_importance
}).sort_values('Importance', ascending=False).head(15)

sns.barplot(x='Importance', y='Feature', data=imp_gain, ax=axes[1])
axes[1].set_title('Feature Importance (Gain) - Top 15')

plt.tight_layout()
plt.savefig('results/feature_importance_lgb.png', dpi=300)
print("特征重要性图已保存为 results/feature_importance_lgb.png")

# ----------------------------- 10. 保存最终模型 -----------------------------
joblib.dump(best_lgb, 'best_lgb_model.pkl')
print("\n模型已保存为 'best_lgb_model.pkl'")
