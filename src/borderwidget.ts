import { DecoratorWidget } from "./decoratorwidget";
import { TextColor, BackgroundColor } from "./terminal_specials";
import { Output } from "./output";
import { Widget } from "./widget";
import { Pixel } from "./pixel";
import { clone } from "./util";

export class BorderWidget extends DecoratorWidget {
  borderColor: TextColor;
  backgroundColor: BackgroundColor;

  constructor(child: Widget,
              borderColor: TextColor = TextColor.Default,
              backgroundColor: BackgroundColor = BackgroundColor.Default) {
    super(child);
    this.borderColor = borderColor;
    this.backgroundColor = backgroundColor;
  }

  render(): Output {
    const output = new Output(this.child.output.width + 2,
                              this.child.output.height + 2, new Pixel('', this.borderColor, this.backgroundColor));

    for (let y = 0 ; y < this.child.output.height ; y++) {
      for (let x = 0 ; x < this.child.output.width ; x++) {
        output.pixels[y+1][x+1] = clone(this.child.output.pixels[y][x]);
      }
    }

    for (let y = 1 ; y < this.child.output.height + 1 ; y++) {
      output.pixels[y][0].char = '\x1b(0\x78\x1b(B';
      output.pixels[y][this.child.output.width+1].char = '\x1b(0\x78\x1b(B';
    }

    for (let x = 1 ; x < this.child.output.width + 1 ; x++) {
      output.pixels[0][x].char = '\x1b(0\x71\x1b(B';
      output.pixels[this.child.output.height+1][x].char = '\x1b(0\x71\x1b(B';
    }

    output.pixels[0][0].char = '\x1b(0\x6c\x1b(B'
    output.pixels[0][this.child.output.width+1].char = '\x1b(0\x6b\x1b(B'
    output.pixels[this.child.output.height+1][0].char = '\x1b(0\x6d\x1b(B'
    output.pixels[this.child.output.height+1][this.child.output.width+1].char = '\x1b(0\x6a\x1b(B'

    return output;
  }
}
