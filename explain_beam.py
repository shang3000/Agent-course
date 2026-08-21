from gradio_client import Client
import re

def parse_beam_html(html):
    """解析 beam search 的 HTML 输出，提取搜索树"""
    # 提取所有表格行 (是否选中, token, step得分, total得分)
    pattern = r'<tr class=([^>]*)>\s*<td>(.*?)</td>\s*<td>(.*?)</td>\s*<td>(.*?)</td>'
    rows = re.findall(pattern, html)

    # 按缩进层级组织成树
    tree = []
    for cls, token, step, total in rows:
        is_chosen = 'chosen-token' in cls
        tree.append({
            'token': token,
            'step_score': float(step),
            'total_score': float(total),
            'chosen': is_chosen
        })

    return tree

def format_tree(tree):
    """格式化输出搜索树"""
    print("┌─────────────────────────────────────────┐")
    print("│         Beam Search 搜索过程            │")
    print("└─────────────────────────────────────────┘\n")

    # 找出被选中的路径
    path = [item for item in tree if item['chosen']]

    # 按层级分组（每4个一组，代表一步的候选）
    step_size = 4
    steps = [tree[i:i+step_size] for i in range(0, len(tree), step_size)]

    for step_idx, step_candidates in enumerate(steps):
        if step_idx == 0:
            print("第1步: 从 'The Capital of France is' 预测")
        else:
            # 用前一步选中的 token 来显示上下文
            prev_chosen = [t for t in path if t in steps[step_idx-1]]
            if prev_chosen:
                print(f"第{step_idx+1}步: 从 '...{prev_chosen[0]['token']}' 预测")
            else:
                print(f"第{step_idx+1}步:")

        print("  ┌──────────┬──────────┬──────────┬──────┐")
        print("  │  Token   │ 步骤得分 │ 总分     │ 选中 │")
        print("  ├──────────┼──────────┼──────────┼──────┤")

        for item in step_candidates:
            marker = "  ✅ " if item['chosen'] else "     "
            print(f"  │ {item['token']:<8} │ {item['step_score']:>8.2f} │ {item['total_score']:>8.2f} │{marker}│")

        print("  └──────────┴──────────┴──────────┴──────┘")

        if step_idx < len(steps) - 1:
            print()
            print("  ↓")
            print()

    # 最终结果
    final_token = path[-1]['token'] if path else "?"
    final_score = path[-1]['total_score'] if path else 0

    print("┌─────────────────────────────────────────┐")
    print("│            🎯 最终结果                  │")
    print("├─────────────────────────────────────────┤")

    # 构建最终序列
    sequence = "The Capital of France is " + " ".join(t['token'] for t in path)
    print(f"│  生成序列: {sequence}")
    print(f"│  最终得分: {final_score:.2f}")
    print("└─────────────────────────────────────────┘")

# ---- 主程序 ----
client = Client("agents-course/decoding_visualizer")

sentence = input("输入句子（回车默认）: ") or "The Capital of France is"

print(f"\n⏳ 正在调用 Beam Search API...")
result = client.predict(input_text=sentence, api_name="/get_beam_search_html")

html_output = result[0]

tree = parse_beam_html(html_output)
format_tree(tree)
