import { TextColor, BackgroundColor } from "./terminal_specials"
import { Pixel } from "./pixel"
import { Output } from "./output"
import { Label } from "./label"

export enum TextAlignment {
  Left,
  Center,
  Right
}

export class MultiLine extends Label {
  alignment: TextAlignment
  paddingPixel: Pixel

  constructor(text: string,
    alignment: TextAlignment = TextAlignment.Left,
    color: TextColor = TextColor.Default,
    background: BackgroundColor = BackgroundColor.Default,
    isDim = false,
    isUnderlined = false,
    paddingPixel: Pixel = new Pixel(" ")) {
    super(text, color, background, isDim, isUnderlined)
    this.alignment = alignment
    this.paddingPixel = paddingPixel
  }

  render(): Output {
    const lines = this.text.split("\n")
    const longestWidth = lines.map((line) => (line.length)).reduce((a, b) => Math.max(a, b))
    const output = new Output(longestWidth, lines.length, this.paddingPixel)

    for (let y = 0 ; y < lines.length ; y++) {
      const padding = this.alignment == TextAlignment.Left ? 0 : (
        this.alignment == TextAlignment.Center ?
          Math.floor((longestWidth - lines[y].length) / 2) :
          longestWidth - lines[y].length
      )

      for (let x = 0 ; x < lines[y].length ; x++) {
        output.pixels[y][x+padding] = new Pixel(lines[y][x], this.color, this.background, this.isDim, this.isUnderlined)
      }
    }

    return output
  }
}
