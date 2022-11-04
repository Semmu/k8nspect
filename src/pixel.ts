import { BackgroundColor, TextColor } from "./terminal_specials"

export class Pixel {
  char: string
  color: TextColor
  background: BackgroundColor
  isDim: boolean
  isUnderlined: boolean
  isInverted: boolean

  constructor(char = "",
    color: TextColor = TextColor.Default,
    background: BackgroundColor = BackgroundColor.Default,
    isDim = false,
    isUnderlined = false,
    isInverted = false) {
    this.char = char
    this.color = color
    this.color = color
    this.background = background
    this.isDim = isDim
    this.isUnderlined = isUnderlined
    this.isInverted = isInverted
  }

  clone(): Pixel {
    // im not sure if this is a "deep enough" clone,
    // not referencing anything same by both instances...
    return new Pixel(this.char, this.color, this.background, this.isDim, this.isUnderlined, this.isInverted)
  }
}
