text = 'banana'
print({character: text.count(character) for character in sorted(set(text))})
