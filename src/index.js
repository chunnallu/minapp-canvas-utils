import utils from './utils/index'
import CanvasUtils from './canvas-utils'
import {drawCoordinate} from './helper/coordinate-helper'
import {setText, calcTextBoundingRect} from './text'
import {loadImages, drawImage} from './image'
import {fillRect, strokeRect} from './shape'
import {createRectPath} from './path'
import {
  isLinearGradientString,
  parseLinearGradientString,
  createLinearGradient,
  isCircularGradientString,
  parseCircularGradientString,
  createCircularGradient,
} from './gradient'
import {copyPixel, pastePixel} from './pixel'

CanvasUtils.prototype.drawCoordinate = drawCoordinate
CanvasUtils.prototype.calcBoundingRect = utils.calcBoundingRect
CanvasUtils.prototype.setText = setText
CanvasUtils.prototype.calcTextBoundingRect = calcTextBoundingRect
CanvasUtils.prototype.loadImages = loadImages
CanvasUtils.prototype.drawImage = drawImage
CanvasUtils.prototype.fillRect = fillRect
CanvasUtils.prototype.strokeRect = strokeRect
CanvasUtils.prototype.createRectPath = createRectPath
CanvasUtils.prototype.isLinearGradientString = isLinearGradientString
CanvasUtils.prototype.parseLinearGradientString = parseLinearGradientString
CanvasUtils.prototype.createLinearGradient = createLinearGradient
CanvasUtils.prototype.isCircularGradientString = isCircularGradientString
CanvasUtils.prototype.parseCircularGradientString = parseCircularGradientString
CanvasUtils.prototype.createCircularGradient = createCircularGradient
CanvasUtils.prototype.copyPixel = copyPixel
CanvasUtils.prototype.copy = copyPixel /** 兼容旧版本 */
CanvasUtils.prototype.pastePixel = pastePixel
CanvasUtils.prototype.paste = pastePixel /** 兼容旧版本 */

export default CanvasUtils
