import { Label } from "./label"
import { BackgroundColor, TextColor } from "./terminal_specials"
import { randInt, randOf } from "./util"

export class RandomColorLabel extends Label {
  constructor(text: string) {
    super(text)
    this.doColorize()
  }

  doColorize() {
    this.color = randOf(TextColor)
    this.background = randOf(BackgroundColor)

    this.markDirty()

    setTimeout(() => {
      this.doColorize()
    }, randInt(1000) + 100)
  }
}
