selected={'A':8,'B':6}
total={'A':10,'B':10}
rates={group:selected[group]/total[group] for group in selected}
print(rates,abs(rates['A']-rates['B']))
