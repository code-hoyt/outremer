# Hand-placed pixel maps for native Renaud. Legend -> palette index.
from PIL import Image
PAL={'O':'#1e141c','W':'#f4efe0','w':'#c9c3c8','v':'#8e85a0','R':'#e0453a','r':'#a02a35','d':'#5c1834',
     'L':'#b06a3c','l':'#743c2c','k':'#45222c','S':'#b8aeab','s':'#7a6d7c','t':'#45384c','F':'#f2b88e','f':'#c27462'}
def rgb(c): return tuple(int(c[i:i+2],16) for i in (1,3,5))
def parse(txt):
  rows=[r.split(' ',1)[1] if r[:2].isdigit() else r for r in txt.strip('\n').split('\n')]
  rows=[r.rstrip() for r in rows]
  return rows
def to_img(rows,W=None):
  W=W or max(len(r) for r in rows); im=Image.new('RGBA',(W,len(rows)),(0,0,0,0))
  for y,r in enumerate(rows):
    for x,ch in enumerate(r):
      if ch in PAL: im.putpixel((x,y),rgb(PAL[ch])+(255,))
      elif ch not in '. ': raise ValueError(f'bad char {ch!r} at {x},{y}')
  return im
