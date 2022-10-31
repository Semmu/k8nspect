import { Label } from "./label";
import { randOf } from "./util";
import { TextColor, BackgroundColor } from "./terminal_specials";

export class RandomColorLabel extends Label {
  constructor(text: string) {
    super(text);
    this.doColorize();

    setInterval(() => {
      this.doColorize()
    }, 1000);
  }

  doColorize() {
    // console.error('RandomColorLabel')
    this.color = randOf(TextColor)
    this.background = randOf(BackgroundColor)

    this.markDirty();
  }
}
