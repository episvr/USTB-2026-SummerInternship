#!/usr/bin/env python3
"""一键运行 machine-learning 实习所有最终答案脚本，并收集结果图片到 results/。"""
import os
import sys
import subprocess
from pathlib import Path

BASE = Path(__file__).resolve().parent
RESULTS = BASE / "results"
RESULTS.mkdir(exist_ok=True)

# 每一步的最终答案脚本（已删除题目版，保留答案版并适配 Linux）
SCRIPTS = [
    "project_one.py",                 # 梯度下降线性回归
    "project_two.py",                 # sklearn 线性回归
    "project_three_part_1.py",        # SVM 乳腺癌分类
    "project_three_part_2.py",        # 四种核函数决策边界
    "project_three_part_3.py",        # 高斯过程回归
    "project_three_part_4.py",        # CO2 高斯过程预测
    "project_four.py",                # 鸢尾花 SVM 核函数对比
    "project_four_2.py",              # 高斯过程分类
    "project_five.py",                # LightGBM 乳腺癌
    "project_five_homework.py",       # LightGBM 鸢尾花
    "project_poly_kernels.py",        # 多项式核 SVM
]

for script in SCRIPTS:
    path = BASE / script
    if not path.exists():
        print(f"[跳过] {script} 不存在")
        continue
    print(f"\n{'='*60}")
    print(f"运行: {script}")
    print(f"{'='*60}")
    subprocess.run([sys.executable, str(path)], cwd=BASE)

print(f"\n全部脚本运行完毕，结果图片保存在: {RESULTS}")
