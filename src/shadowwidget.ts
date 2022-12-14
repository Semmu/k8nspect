import { DecoratorWidget } from "./decoratorwidget"
import { Output } from "./output"
import { Pixel } from "./pixel"
import { BackgroundColor, TextColor } from "./terminal_specials"
import { clone } from "./util"
import { Widget } from "./widget"

export class ShadowWidget extends DecoratorWidget {
  shadowColor: BackgroundColor

  constructor(child: Widget, shadowColor: BackgroundColor = BackgroundColor.Black) {
    super(child)
    this.shadowColor = shadowColor
  }

  render(): Output {
    const output = new Output(this.child.output.width + 1, this.child.output.height + 1)

    for (let y = 0 ; y < this.child.output.height ; y++) {
      for (let x = 0 ; x < this.child.output.width ; x++) {
        output.pixels[y][x] = clone(this.child.output.pixels[y][x])
      }
    }

    const shadowCharacter = new Pixel(" ", TextColor.Default, this.shadowColor)

    for (let y = 0 ; y < this.child.output.height ; y++) {
      output.pixels[y+1][this.child.output.width] = shadowCharacter
    }

    for (let x = 0 ; x < this.child.output.width ; x++) {
      output.pixels[this.child.output.height][x+1] = shadowCharacter
    }

    return output
  }
}
