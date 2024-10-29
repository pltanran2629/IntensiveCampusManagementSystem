import json
result = []
with open(r'../list_ave_p.txt' ,'r') as f:
    for line in f:
     result.append(line.split(' '))  #a.append(b)：是将b原封不动的追加到a的末尾上，会改变a的值
        #strip()用于移除字符串头尾指定的字符（默认为空格或者换行符）或字符序列
    print(result)
# print(result)
with open('../list_ave_p.json','w') as f:
   json.dump(result,f)