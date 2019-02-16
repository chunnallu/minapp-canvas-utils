//index.js
import CanvasUtils from "../../libs/canvas-utils"

//获取应用实例
const app = getApp()

Page({
  onLoad: function() {
    let data = {
      title: "这是标题这是标题这是标题这是标题这是标题",
      cover: "https://cloud-minapp-16269.cloud.ifanrusercontent.com/1fdnJAWmAIAzltdQ.jpg",
      gifImage: "https://cloud-minapp-20355.cloud.ifanrusercontent.com/1gMlCzXV9gNENXiB.gif",
      description: `这里是关于文章的介绍，这里是关于文章的介绍。这里是关于文章的介绍，这里是关于文章的介绍，这里是关于文章的介绍。
      这里这里这里`,
    }
    const canvasUtils = new CanvasUtils("canvas-test")
    canvasUtils.loadImages([data.cover, data.gifImage]).then(images => {
      const [cover, gifImage] = images;
      // 测试图像处理
      let coverRect = canvasUtils.drawImage(cover, 0, 0 , { width:375, height: 100, mode:"widthFix", borderRadius: 0, borderWidth: 0, borderColor: "#ff0000"})
      const icon1Rect = canvasUtils.drawImage(cover, 50, 50 , { width:50, height: 50, mode:"top", borderRadius: 5, borderWidth: 3, borderColor: "#00ff00"})
      const icon2Rect = canvasUtils.drawImage(cover, 150, 100 , { width:50, height: 50, mode:"bottom", borderRadius: 5, borderWidth: 1, borderColor: "#0000ff"})
      const icon3Rect = canvasUtils.drawImage(cover, 250, 50 , { width:50, height: 50, mode:"left", borderRadius: 25, borderWidth: 2, borderColor: "#923de2"})
      const icon4Rect = canvasUtils.drawImage(cover, 300, 0 , { width:50, height: 50, mode:"right", borderRadius: 5, borderWidth: 3, borderColor: "#e44823"})
      /** gif 图片在安卓下有 bug , 不支持裁剪 */
      const icon5Rect = canvasUtils.drawImage(gifImage, 300, 100 , { width:50, height: 50, borderRadius: 5, borderWidth: 3, borderColor: "#e44823"})
      
      // 测试文本处理
      const titleRect = canvasUtils.setText(data.title, 20, coverRect.y+ coverRect.height, {fontSize: 20, lineHeight: 28, bold: true, maxWidth: 335, textIndent: 20})
      const descriptionRect = canvasUtils.setText(data.description, 24, titleRect.y+ titleRect.height + 20, {fontSize: 14,  lineHeight: 18, color:"#C5C5C5", bold: false, maxWidth: 327, textAlign: 'left'})
      const descriptionRect2 = canvasUtils.setText(data.description, 375-24, titleRect.y+ titleRect.height + 120, {fontSize: 14,  lineHeight: 18, color:"#C5C5C5", bold: false, maxWidth: 327, textAlign: 'right',lineLimit: 2})
      
      // 测试基本图形绘制
      const padding = 4;
      canvasUtils.strokeRect(descriptionRect.x-padding, descriptionRect.y-padding, descriptionRect.width+2*padding, descriptionRect.height+2*padding, 5, 1, "#ff0000")

      // 渐变绘制
      canvasUtils.fillRect(0, 750, 375, 400, 0, "linear-gradient(180deg, #FFFFFF 0%, #D7EAFF 100%)")
      canvasUtils.fillRect(0, 1200, 375, 400, 0, "circular-gradient(#D7EAFF 0%, #FFFFFF 100%)")
      
      // 测试参考线
      canvasUtils.drawCoordinate({
        gear: 50,
        lineWidth: 1,
        dashWidth: 1,
        gapWidth: 5,
      })

      // 绘制
      canvasUtils.draw().then(() => {
        // 测试像素操作
        canvasUtils.copy(coverRect).then(({ data }) => {
          coverRect.y += 500
          return canvasUtils.paste(data, coverRect).then(res => console.log(res)).catch(err => console.log(err))
        }).catch(err => console.log(err))
      })
      
    })

    
    
  }
})
