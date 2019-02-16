# minapp-canvas-utils 微信小程序绘图实用工具

封装了微信小程序绘图常用的功能，如图像裁剪、文本绘制

## 安装

```
npm i minapp-canvas-utils
```

## 示例

用微信开发工具打开 `static` 目录即可看到示例

## API

### 创建

```
new CanvasUtils(id, component)
```

### getContext

获取 ctx。要用到小程序原有的 API 时可以使用这个接口

```
const ctx = canvasUtils.getContext()
```

### drawCoordinate

绘制参考线。在调试时可以将参考线绘制出来，帮助确认位置是否正确

```
canvasUtils.drawCoordinate({
        gear: 50,
        lineWidth: 1,
        dashWidth: 1,
        gapWidth: 5,
      })
```

参数：
- gear: 格子大小
- lineWidth: 参考线的粗细
- dashWidth: 参考线虚线的线段长度 
- gapWidth: 参考线虚线的空格长度 


### calcBoundingRect

计算包围正方形 calcBoundingRect(rect)

通过 x, y, width, height 计算出 left, top, right, bottom

参数：
- rect, 形如 {x, y, width, height} 的对象

返回结果：
- boundingRect, 形如 {x, y, width, height, left, top, right, bottom} 的对象

> 下文用 BoundingRect 来指代  {x, y, width, height, left, top, right, bottom} 

### setText

绘制文本 setText(text, x, y , options)

参数：
- text: 要绘制的文本
- x: 横坐标
- y: 纵坐标
- options: 形如 {fontSize: 14,  lineHeight: 18, color:"#C5C5C5", bold: false, maxWidth: 327, textAlign: 'right',lineLimit: 2，textIndent: 20, draw: true} 的对象，其中：
  - fontSize: 字号
  - lineHeight: 行高
  - color: 颜色
  - bold: 加粗，暂不支持
  - maxWidth: 最大宽度，超出自动换行 
  - textAlign: 文本水平对齐方式，可以是left, center, right
  - lineLimit: 文本的行数限制，超出自动隐藏
  - textIndent: 首行缩进
  - draw: 是否绘制出来

返回值：

BoundingRect

### calcTextBoundingRect

测量文本的BoundingRect calcTextBoundingRect(text, x, y , options)

参数:

同 setText, 不过 options.draw 恒为 false

返回值：

BoundingRect

### loadImages

加载图片 loadImages(srcs)

参数:
- srcs: 图片地址列表

返回值:

BoundingRect

### drawImage

绘制图片 drawImage(image, x, y, {mode:"scaleToFill",width:100, height: 100, borderRadius: 1, borderWidth: 1, borderColor:"#000", draw:true})

参数:
- image: 图片对象，通过 wx.getImageInfo 得到
- x: 横坐标
- y: 纵坐标
- options: 选项
  - mode: 裁剪模式
    - scaleToFill: 不保持纵横比缩放图片，使图片的宽高完全拉伸至填满空间
    - aspectFit: 保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
    - aspectFill: 保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
    - widthFix: 宽度不变，高度自动变化，保持原图宽高比不变
    - center
    - top
    - bottom
    - left
    - right
    - none: 不裁剪，安卓下会出现裁剪 gif 失败， 图片完全显示白色背景的现象，此时应使用该模式
  - width: 画布上绘制区域的宽度
  - height: 画布上绘制区域的高度
  - borderRadius: 圆角
  - borderWidth: 边框
  - borderColor: 边框颜色
  - draw: 是否绘制出来

返回值：

BoundingRect


### fillRect

填充一个矩形区域 fillRect(x, y, width, height, borderRadius, color)

参数:
- x: 横坐标
- y: 纵坐标
- width: 画布上绘制区域的宽度
- height: 画布上绘制区域的高度
- borderRadius: 圆角
- color: 填充颜色，支持纯色和渐变（渐变传入一个字符串，例如：linear-gradient(180deg, #FFFFFF 0%, #D7EAFF 100%)，角度不支持负值）

返回值：

BoundingRect

### strokeRect

描边一个矩形区域 strokeRect(x, y, width, height, borderRadius, borderWidth, borderColor)

参数:
- x: 横坐标
- y: 纵坐标
- width: 画布上绘制区域的宽度
- height: 画布上绘制区域的高度
- borderRadius: 圆角
- borderWidth: 
- borderColor
- color: 填充颜色

返回值：

BoundingRect

### createRectPath

创建一个矩形路径 createRectPath(x, y, width, height, radius)

参数：
- x: 横坐标
- y: 纵坐标
- width: 画布上绘制区域的宽度
- height: 画布上绘制区域的高度
- radius: 圆角

返回值：

BoundingRect


### copyPixel

拷贝像素 copyPixel(rect)

参数：
- rect, 形如 {x, y, width, height} 的对象

返回值：

Promise，参考[微信文档](https://developers.weixin.qq.com/miniprogram/dev/api/wx.canvasGetImageData.html)

### pastePixel

粘贴像素 pastePixel (data, rect)

参数：
- data 像素数组，参考[微信文档](https://developers.weixin.qq.com/miniprogram/dev/api/wx.canvasPutImageData.html)
- rect, 形如 {x, y, width, height} 的对象

返回值：

Promise， 参考[微信文档](https://developers.weixin.qq.com/miniprogram/dev/api/wx.canvasPutImageData.html)

### isLinearGradientString

判断一个字符串是否是符合规范的线性渐变字符串

参数：
- gradientString, 例如 `linear-gradient(180deg, #FFFFFF 0%, #D7EAFF 100%)`

返回值：

Boolean

### parseLinearGradientString

将线性渐变字符串转成对象表示

参数：
- gradientString, 例如 `linear-gradient(180deg, #FFFFFF 0%, #D7EAFF 100%)`

返回值：

```
{
  type: 'linear-gradient',
  factors: [1, 1, 0, -1],
  stops: [
    [0, "#FFFFFF"],
    [1, "#D7EAFF"],
  ],
}
```
**factors** 数组用来表述渐变角度，在使用微信小程序原生接口创建渐变时可以这样用 `ctx.createLinearGradient(x*factors[0], y*factors[1], x+Math.abs(width*factors[2]), y+Math.abs(height*factors[3]))`

**stops** 数组每一项都是 `gradient.addColorStop` 方法的参数


### createLinearGradient

创建线性渐变

参数：
- x, 绘制区域的 x 坐标
- y, 绘制区域的 y 坐标
- width, 绘制区域的宽度
- height, 绘制区域的高度
- gradientString, 例如 `linear-gradient(180deg, #FFFFFF 0%, #D7EAFF 100%)`

返回：

[CanvasGradient 对象](https://developers.weixin.qq.com/miniprogram/dev/api/CanvasGradient.html)

### isCircularGradientString

判断一个字符串是否是符合规范的线性径向字符串

参数：
- gradientString, 例如 `circular-gradient(#FFFFFF 0%, #D7EAFF 100%)`

返回值：

Boolean

### parseCircularGradientString

将线性径向字符串转成对象表示

参数：
- gradientString, 例如 `circular-gradient(#FFFFFF 0%, #D7EAFF 100%)`

返回值：

```
{
  type: 'linear-gradient',
  stops: [
    [0, "#FFFFFF"],
    [1, "#D7EAFF"],
  ],
}
```

**stops** 数组每一项都是 `gradient.addColorStop` 方法的参数

### createCircularGradient

创建径向渐变

参数：
- x, 绘制区域的 x 坐标
- y, 绘制区域的 y 坐标
- radius, 绘制区域半径
- gradientString, 例如 `circular-gradient(#FFFFFF 0%, #D7EAFF 100%)`

返回：

[CanvasGradient 对象](https://developers.weixin.qq.com/miniprogram/dev/api/CanvasGradient.html)

### draw

绘制到画布中 draw(reverse)

> 需要注意，不调用 draw 是不会将图形绘制到画布中的

参数：
- reverse 本次绘制是否接着上一次绘制

返回值

Promise