import { DecoratorWidget } from "./decoratorwidget";
import { BackgroundColor, TextColor } from "./terminal_specials";
import { Output } from "./output";
import { Widget } from "./widget";
import { Pixel } from "./pixel";

export class StyleOverrider extends DecoratorWidget {
  color: TextColor;
  background: BackgroundColor;
  isDim: boolean;
  isUnderlined: boolean;

  constructor(child: Widget,
              color: TextColor = TextColor.Default,
              background: BackgroundColor = BackgroundColor.Default,
              isDim: boolean = false,
              isUnderlined: boolean = true) {
    super(child);

    this.color = color;
    this.background = background;
    this.isDim = isDim;
    this.isUnderlined = isUnderlined;
  }

  render(): Output {
    return Output.fromPixels(this.child.output.pixels.map((row: Pixel[]) => (
      row.map((pixel) => (
        new Pixel(pixel.char, this.color, this.background, this.isDim, this.isUnderlined)
      ))
    )))
  }
}
