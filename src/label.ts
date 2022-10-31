import { Widget } from "./widget";
import { TextColor, BackgroundColor } from "./terminal_specials";
import { Pixel } from "./pixel";
import { Output } from "./output";

export class Label extends Widget {
  text: string;
  color: TextColor;
  background: BackgroundColor;
  isDim: boolean;
  isUnderlined: boolean;

  constructor(text: string,
              color: TextColor = TextColor.Default,
              background: BackgroundColor = BackgroundColor.Default,
              isDim: boolean = false,
              isUnderlined: boolean = false) {
    super();
    this.text = text;
    this.color = color;
    this.background = background;
    this.isDim = isDim;
    this.isUnderlined = isUnderlined;
  }

  doRender(): Output {
    // console.error('label rendering')
    const pixels = [this.text.split('').map((char) => (
      new Pixel(char, this.color, this.background, this.isDim, this.isUnderlined)
    ))];
    // console.error(pixels);
    return Output.fromPixels(pixels);
  }
}
