import { Label } from "./label";
import { Output } from "./output";
import { BackgroundColor, TextColor } from "./terminal_specials";

export class Clock extends Label {
  constructor(color: TextColor = TextColor.Default,
              background: BackgroundColor = BackgroundColor.Default,
              isDim: boolean = false,
              isUnderlined: boolean = false) {
    super('', color, background, isDim, isUnderlined)

    this.updateClock()

    setInterval(() => {this.updateClock()}, 1000)
  }

  updateClock() {
    this.text = new Date().toLocaleTimeString()
    this.markDirty()
  }
}
