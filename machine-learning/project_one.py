import random
import math

# ---------- 1. 生成合成数据 ----------
random.seed(42)                     
n = 100                             
true_w = 2.0
true_b = 3.0

X = [random.uniform(0, 10) for _ in range(n)]
# 加入高斯噪声（标准差 0.5）
Y = [true_w * x + true_b + random.gauss(0, 8.5) for x in X]

# ---------- 2. 定义损失函数 ----------
def mse_loss(w, b, X, Y):
    total = 0.0
    n = len(X)
    for x, y in zip(X, Y):
        pred = w * x + b
        total += (pred - y) ** 2
    return total / n

# ---------- 3. 计算梯度 ----------
def compute_gradients(w, b, X, Y):
    n = len(X)
    grad_w = 0.0
    grad_b = 0.0
    for x, y in zip(X, Y):
        pred = w * x + b
        error = pred - y
        grad_w += error * x
        grad_b += error
    grad_w = 2 * grad_w / n
    grad_b = 2 * grad_b / n
    return grad_w, grad_b

# ---------- 4. 梯度下降迭代 ----------
def gradient_descent(X, Y, lr=0.01, epochs=1000):
    w = 0.0
    b = 0.0
    history = []                    

    for epoch in range(epochs):
        grad_w, grad_b = compute_gradients(w, b, X, Y)
        w -= lr * grad_w
        b -= lr * grad_b

        if epoch % 100 == 0:        
            loss = mse_loss(w, b, X, Y)
            history.append((epoch, loss))
            print(f"Epoch {epoch:4d} | loss = {loss:.6f} | w = {w:.4f} | b = {b:.4f}")

    return w, b, history

# ---------- 5. 执行训练 ----------
print("开始梯度下降...")
final_w, final_b, _ = gradient_descent(X, Y, lr=0.01, epochs=1000)

print("\n最终结果：")
print(f"真实参数: w = {true_w}, b = {true_b}")
print(f"估计参数: w = {final_w:.4f}, b = {final_b:.4f}")
print(f"最终MSE: {mse_loss(final_w, final_b, X, Y):.6f}")
