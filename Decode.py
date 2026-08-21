from gradio_client import Client
import re

# 连接到 Hugging Face Space
client = Client("agents-course/decoding_visualizer")

# 可以修改这里来测试不同的句子
sentence = input("请输入要解码的句子（直接回车使用默认）: ") or "The Capital of France is"

print(f"\n{'='*50}")
print(f"  输入句子: {sentence}")
print(f"{'='*50}\n")

# 调用 beam search API
result = client.predict(
        input_text=sentence,
        api_name="/get_beam_search_html"
)

html_output = result[0]
summary_output = result[1]

# ---- 解析 HTML，提取搜索树 ----
def parse_beam_tree(html):
    """从 HTML 中提取 beam search 的搜索树结构"""
    tree_lines = []

    # 提取所有 <li> 块中的 token 表格数据
    # 用正则找所有表格行
    rows = re.findall(r'<tr class=(.*?)>\s*<td>(.*?)</td>\s*<td>(.*?)</td>\s*<td>(.*?)</td>', html)

    # 提取当前路径（chosen-token）
    chosen = []
    for cls, token, step, total in rows:
        if 'chosen-token' in cls:
            chosen.append((token, step, total))

    return chosen, rows

# ---- 解析总结文本 ----
def parse_summary(text):
    """提取输出序列"""
    sequences = []
    lines = text.split('\n')
    for line in lines:
        line = line.strip()
        if line.startswith('- `') or line.startswith('- '):
            seq = line.lstrip('- ').strip('`')
            sequences.append(seq)
    return sequences

chosen, all_rows = parse_beam_tree(html_output)
sequences = parse_summary(summary_output)

# ---- 打印搜索过程 ----
print("  Beam Search 搜索路径:")
print(f"  {'─'*40}")

for i, (token, step, total) in enumerate(chosen):
    prefix = "  " + "    " * i + "├── " if i > 0 else "  "
    print(f"{prefix}{token}  (step: {step}, total: {total})")

print(f"\n  {'─'*40}")

# ---- 打印最终结果 ----
print(f"\n  生成结果:")
for seq in sequences:
    # 高亮显示关键部分
    clean = seq
    print(f"  {clean}")

print(f"\n{'='*50}")
