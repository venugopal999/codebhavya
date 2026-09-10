from collections import ChainMap
defaults = {'theme': 'light', 'size': 12}
user = {'theme': 'dark'}
settings = ChainMap(user, defaults)
print(settings['theme'], settings['size'])
