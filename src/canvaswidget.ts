import { Widget } from "./widget"
import { Output } from "./output"
import { Pixel } from "./pixel"
import { halfOf } from "./util"
import { clone } from "./util"

// the values here sound really bad.
export enum CanvasAlignment {
  TopLeft,
  CenterLeft,
  BottomLeft,
  BottomCenter,
  BottomRight,
  CenterRight,
  TopRight,
  TopCenter,
  Middle
}

export class Position {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

class CanvasWidgetChild {
  widget: Widget
  position: Position
  alignment: CanvasAlignment

  constructor(widget: Widget, position: Position, alignment: CanvasAlignment) {
    this.widget = widget
    this.position = position
    this.alignment = alignment
  }
}

export class CanvasWidget extends Widget {
  width: number
  height: number
  fill: Pixel
  children: CanvasWidgetChild[]

  constructor(width: number, height: number, fill: Pixel = new Pixel()) {
    super()
    this.width = width
    this.height = height
    this.fill = fill
    this.children = []
  }

  addWidget(widget: Widget, position: Position = new Position(0, 0), alignment: CanvasAlignment = CanvasAlignment.TopLeft) {
    this.children.push(new CanvasWidgetChild(widget, position, alignment))
    widget.parent = this
    this.markDirty()
  }

  render(): Output {
    const output = new Output(this.width, this.height, this.fill)

    this.children.forEach((child) => {
      let posX = child.position.x
      let posY = child.position.y
      switch(child.alignment) {
      case CanvasAlignment.TopLeft:
        break

      case CanvasAlignment.CenterLeft:
        posY -= halfOf(child.widget.output.height)
        break

      case CanvasAlignment.BottomLeft:
        posY -= child.widget.output.height
        break

      case CanvasAlignment.TopCenter:
        posX -= halfOf(child.widget.output.width)
        break

      case CanvasAlignment.Middle:
        posX -= halfOf(child.widget.output.width)
        posY -= halfOf(child.widget.output.height)
        break

      case CanvasAlignment.BottomCenter:
        posX -= halfOf(child.widget.output.width)
        posY -= child.widget.output.height
        break

      case CanvasAlignment.TopRight:
        posX -= child.widget.output.width
        break

      case CanvasAlignment.CenterRight:
        posX -= child.widget.output.width
        posY -= halfOf(child.widget.output.height)
        break

      case CanvasAlignment.BottomRight:
        posX -= child.widget.output.width
        posY -= child.widget.output.height
        break
      }

      for (let y = 0 ; y < child.widget.output.height ; y++) {
        for (let x = 0 ; x < child.widget.output.width ; x++) {
          const destX = x + posX
          const destY = y + posY

          if (destX >= 0 && destX < this.width &&
              destY >= 0 && destY < this.height) {
            if (child.widget.output.pixels[y][x].char.length > 0) {
              output.pixels[destY][destX] = clone(child.widget.output.pixels[y][x])
            }
          }
        }
      }
    })

    return output
  }
}
