import { Label } from "./label"
import { randInt, randOf } from "./util"
import { TextColor, BackgroundColor } from "./terminal_specials"

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
