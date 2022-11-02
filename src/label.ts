import { Output } from "./output"
import { Pixel } from "./pixel"
import { BackgroundColor, TextColor } from "./terminal_specials"
import { Widget } from "./widget"

export class Label extends Widget {
  text: string
  color: TextColor
  background: BackgroundColor
  isDim: boolean
  isUnderlined: boolean

  constructor(text: string,
    color: TextColor = TextColor.Default,
    background: BackgroundColor = BackgroundColor.Default,
    isDim = false,
    isUnderlined = false) {
    super()
    this.text = text
    this.color = color
    this.background = background
    this.isDim = isDim
    this.isUnderlined = isUnderlined
  }

  render(): Output {
    const pixels = [this.text.split("").map((char) => (
      new Pixel(char, this.color, this.background, this.isDim, this.isUnderlined)
    ))]

    return Output.fromPixels(pixels)
  }
}
