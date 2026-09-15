text = 'Artificial Intelligence'
count = sum(character.lower() in 'aeiou' for character in text)
print(count)
