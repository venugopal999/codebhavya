import csv
with open('marks.csv', 'w', newline='', encoding='utf-8') as file:
    csv.writer(file).writerows([['name', 'mark'], ['Asha', 90]])
with open('marks.csv', newline='', encoding='utf-8') as file:
    print(list(csv.reader(file)))
