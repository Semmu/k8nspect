import { CanvasWidget, Position } from "./canvaswidget";
import { Label } from "./label";
import { Output } from "./output";
import { BackgroundColors, TextColor, TextColors } from "./terminal_specials";

export class ColorsTester extends CanvasWidget {
  constructor(isDim: boolean = false,
    isUnderlined: boolean = false,
    isInverted: boolean = false) {
    super(TextColors().length * 2 + 1, BackgroundColors().length)

    TextColors().forEach((color, x) => {
      BackgroundColors().forEach((background, y) => {
        this.addWidget(
          new Label(' @ ',
            color,
            background,
            isDim,
            isUnderlined,
            isInverted),
          new Position(x * 2, y)
        )
      })
    })
  }
}
