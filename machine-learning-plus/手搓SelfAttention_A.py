# =========================== 1. 导入必要的库 ===========================
import matplotlib
matplotlib.use('Agg')

import torch
import numpy as np
import pandas as pd
import torch.nn as nn
import torch.optim as optim
import matplotlib.pyplot as plt
from sklearn.datasets import fetch_openml
from sklearn.preprocessing import StandardScaler


# =========================== 2. 自定义自注意力单元 ===========================
class SelfAttentionCell(nn.Module):
    """
    单头自注意力（Scaled Dot-Product Attention）单元。

    公式：
        Q_t = W_q @ x_t
        K_t = W_k @ x_t
        V_t = W_v @ x_t
        score_{ij} = Q_i^T K_j / sqrt(d_k)
        alpha_{ij} = softmax(score_{ij})  对 j 求和为 1
        context_i = sum_j alpha_{ij} V_j

    为了处理时序预测任务，这里采用“因果掩码”：
    预测第 t 个时刻时，只能看到第 t 及之前时刻的信息，
    因此 attention 矩阵中上三角部分被置为 -inf。

    实现上使用向量化矩阵运算，避免逐个时刻循环，效率更高。
    """
    def __init__(self, input_size, hidden_size):
        """
        Args:
            input_size : 输入特征维度
            hidden_size: 查询/键/值的投影维度
        """
        super(SelfAttentionCell, self).__init__()
        self.hidden_size = hidden_size
        scale = np.sqrt(2.0 / (input_size + hidden_size))

        # 线性投影：输入 -> Q/K/V
        self.W_q = nn.Parameter(torch.randn(hidden_size, input_size) * scale)
        self.W_k = nn.Parameter(torch.randn(hidden_size, input_size) * scale)
        self.W_v = nn.Parameter(torch.randn(hidden_size, input_size) * scale)

        self.b_q = nn.Parameter(torch.zeros(hidden_size))
        self.b_k = nn.Parameter(torch.zeros(hidden_size))
        self.b_v = nn.Parameter(torch.zeros(hidden_size))

        # 缩放因子，避免点积过大导致 softmax 饱和
        self.scale = np.sqrt(hidden_size)

    def forward(self, X_seq):
        """
        Args:
            X_seq: 输入序列，形状 (seq_length, input_size, 1)

        Returns:
            context: 每个时刻对应的上下文向量，形状 (seq_length, hidden_size, 1)
        """
        seq_length = X_seq.shape[0]

        # 将输入从 (seq_length, input_size, 1) 展平为 (seq_length, input_size)
        X_flat = X_seq.squeeze(-1)  # (seq_length, input_size)

        # 向量化计算 Q/K/V: (seq_length, hidden_size)
        Q = X_flat @ self.W_q.T + self.b_q
        K = X_flat @ self.W_k.T + self.b_k
        V = X_flat @ self.W_v.T + self.b_v

        # scores: (seq_length, seq_length)
        scores = Q @ K.T / self.scale

        # 因果掩码：时刻 i 只能关注 j <= i
        mask = torch.triu(torch.ones(seq_length, seq_length), diagonal=1).bool()
        scores = scores.masked_fill(mask, float('-inf'))

        # 对每一行做 softmax，得到注意力权重
        attn_weights = torch.softmax(scores, dim=-1)  # (seq_length, seq_length)

        # context = sum_j alpha_{ij} V_j
        context = attn_weights @ V  # (seq_length, hidden_size)

        return context.unsqueeze(-1)  # (seq_length, hidden_size, 1)


# =========================== 3. 加入位置编码的预测网络 ===========================
class SelfAttentionNetwork(nn.Module):
    """
    基于自注意力机制的时间序列预测网络。
    结构：
        1) 输入位置编码
        2) 自注意力提取序列表示
        3) 取最后时刻的上下文向量，经全连接层输出预测值
    """
    def __init__(self, input_size, hidden_size, output_size, seq_length):
        """
        Args:
            input_size : 每个时间步输入特征数
            hidden_size: 注意力投影维度
            output_size: 输出维度
            seq_length : 输入序列长度
        """
        super(SelfAttentionNetwork, self).__init__()
        self.seq_length = seq_length
        self.hidden_size = hidden_size

        # 可学习的位置编码
        self.pos_encoding = nn.Parameter(torch.randn(seq_length, input_size, 1) * 0.01)

        # 自注意力单元
        self.attention = SelfAttentionCell(input_size, hidden_size)

        # 输出层
        scale = np.sqrt(2.0 / hidden_size)
        self.W_out = nn.Parameter(torch.randn(output_size, hidden_size) * scale)
        self.b_out = nn.Parameter(torch.zeros(output_size, 1))

    def forward(self, X):
        """
        Args:
            X: 输入序列，形状 (seq_length, input_size, 1)

        Returns:
            y_pred: 预测值，形状 (output_size, 1)
        """
        # 加入位置编码
        X_with_pos = X + self.pos_encoding

        # 自注意力前向传播
        context = self.attention(X_with_pos)  # (seq_length, hidden_size, 1)

        # 取最后一个时刻的上下文向量进行预测
        last_context = context[-1]  # (hidden_size, 1)
        y_pred = self.W_out @ last_context + self.b_out
        return y_pred


# =========================== 4. 辅助函数：构造时间序列样本 ===========================
def create_sequences(data, target, seq_length):
    """
    将一维时间序列转换为监督学习样本。
    用过去 seq_length 个点预测下一个点。
    """
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:i+seq_length])
        y.append(target[i+seq_length])
    X = np.array(X)
    y = np.array(y)
    X = X[..., np.newaxis]           # (n, seq_len, n_features, 1)
    y = y.reshape(-1, 1, 1)          # (n, 1, 1)
    return X, y


# =========================== 5. 主程序 ===========================
def main():
    # -------------------- 5.1 加载 Mauna Loa CO₂ 数据集 --------------------
    print("正在加载 Mauna Loa CO₂ 数据...")
    co2 = fetch_openml(data_id=41187, as_frame=True, parser="pandas")
    co2_df = co2.frame
    co2_df["date"] = pd.to_datetime(co2_df[["year", "month", "day"]])
    co2_df = co2_df[["date", "co2"]].set_index("date")
    values = co2_df["co2"].values.astype(np.float32).reshape(-1, 1)
    print(f"数据总量: {len(values)} 个样本")
    print(f"时间范围: {co2_df.index.min()} 到 {co2_df.index.max()}")

    # -------------------- 5.2 数据标准化 --------------------
    scaler = StandardScaler()
    values_scaled = scaler.fit_transform(values)

    # -------------------- 5.3 按时间顺序划分训练集和测试集 --------------------
    train_size = int(len(values_scaled) * 0.8)
    train_data = values_scaled[:train_size]
    test_data = values_scaled[train_size:]

    # -------------------- 5.4 构造序列样本 --------------------
    seq_length = 6
    X_train, y_train = create_sequences(train_data, train_data, seq_length)
    X_test, y_test = create_sequences(test_data, test_data, seq_length)

    X_train = torch.tensor(X_train, dtype=torch.float32)
    y_train = torch.tensor(y_train, dtype=torch.float32)
    X_test = torch.tensor(X_test, dtype=torch.float32)
    y_test = torch.tensor(y_test, dtype=torch.float32)
    print(f"训练样本数: {X_train.shape[0]}, 测试样本数: {X_test.shape[0]}")

    # -------------------- 5.5 初始化模型、优化器和损失函数 --------------------
    input_size = 1
    hidden_size = 96
    output_size = 1
    model = SelfAttentionNetwork(input_size, hidden_size, output_size, seq_length)

    optimizer = optim.Adam(model.parameters(), lr=0.001)
    criterion = nn.MSELoss()

    # -------------------- 5.6 训练循环 --------------------
    epochs = 300
    train_losses = []
    test_losses = []

    print("\n开始训练...")
    for epoch in range(epochs):
        model.train()
        total_loss = 0

        for i in range(X_train.shape[0]):
            x_seq = X_train[i]
            y_true = y_train[i]

            y_pred = model(x_seq)
            loss = criterion(y_pred, y_true)

            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

        avg_train_loss = total_loss / X_train.shape[0]
        train_losses.append(avg_train_loss)

        model.eval()
        test_loss = 0
        with torch.no_grad():
            for i in range(X_test.shape[0]):
                y_pred = model(X_test[i])
                test_loss += criterion(y_pred, y_test[i]).item()
        avg_test_loss = test_loss / X_test.shape[0]
        test_losses.append(avg_test_loss)

        if (epoch + 1) % 10 == 0:
            print(f"Epoch {epoch+1:3d}/{epochs}  Train Loss: {avg_train_loss:.6f}  Test Loss: {avg_test_loss:.6f}")

    # -------------------- 5.7 模型评估 --------------------
    print("\n评估模型在测试集上的表现...")
    model.eval()
    y_pred_list = []
    y_true_list = []
    with torch.no_grad():
        for i in range(X_test.shape[0]):
            y_pred = model(X_test[i])
            y_pred_list.append(y_pred.item())
            y_true_list.append(y_test[i].item())

    y_pred = np.array(y_pred_list).reshape(-1, 1)
    y_true = np.array(y_true_list).reshape(-1, 1)

    y_pred_orig = scaler.inverse_transform(y_pred)
    y_true_orig = scaler.inverse_transform(y_true)
    rmse = np.sqrt(np.mean((y_true_orig - y_pred_orig) ** 2))
    print(f"测试集 RMSE = {rmse:.4f} ppm")

    # -------------------- 5.8 可视化 --------------------
    plt.figure(figsize=(14, 5))

    plt.subplot(1, 2, 1)
    plt.plot(train_losses, label='Train Loss', color='blue')
    plt.plot(test_losses, label='Test Loss', color='orange')
    plt.xlabel('Epoch')
    plt.ylabel('MSE Loss')
    plt.title('Loss Curves during Training (Self-Attention)')
    plt.legend()
    plt.grid(True, alpha=0.3)

    plt.subplot(1, 2, 2)
    plt.scatter(y_true_orig, y_pred_orig, alpha=0.6, edgecolors='k', linewidth=0.5)
    min_val = min(y_true_orig.min(), y_pred_orig.min())
    max_val = max(y_true_orig.max(), y_pred_orig.max())
    plt.plot([min_val, max_val], [min_val, max_val], 'r--', lw=2)
    plt.xlabel('True CO₂ (ppm)')
    plt.ylabel('Predicted CO₂ (ppm)')
    plt.grid(True, alpha=0.3)

    plt.tight_layout()
    plt.savefig('results/self_attention_loss.png', dpi=150)
    plt.close()
    print("损失曲线与散点图已保存: results/self_attention_loss.png")

    plt.figure(figsize=(14, 4))
    n_show = min(100, len(y_true_orig))
    plt.plot(y_true_orig[:n_show], label='True', linewidth=2, color='green')
    plt.plot(y_pred_orig[:n_show], label='Predicted', linewidth=2, linestyle='--', color='red')
    plt.xlabel('Time Step (month)')
    plt.ylabel('CO₂ Concentration (ppm)')
    plt.title('CO₂ Prediction on Test Set (First 100 Months) - Self-Attention')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.savefig('results/self_attention_series.png', dpi=150)
    plt.close()
    print("预测曲线图已保存: results/self_attention_series.png")


# =========================== 6. 程序入口 ===========================
if __name__ == "__main__":
    main()
