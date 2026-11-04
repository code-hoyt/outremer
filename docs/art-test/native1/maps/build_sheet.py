import pix, json
from PIL import Image
CW,CH,OX,OY=24,32,2,1
cols=['stand','stepL','stepR']
sheet=Image.new('RGBA',(CW*3,CH*2),(0,0,0,0))
for r,face in enumerate(['front','back']):
  for c,n in enumerate(cols):
    im=pix.to_img(pix.parse(open(f'maps/{face}-{n}.txt').read()))
    sheet.alpha_composite(im,(c*CW+OX,r*CH+OY))
sheet.save('renaud-native.png')
print(sheet.size, len(set(sheet.getdata())))
