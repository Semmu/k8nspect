import { DecoratorWidget } from "./decoratorwidget";
import { Pixel } from "./pixel";
import { Widget } from "./widget";
import { Output } from "./output";
import { clone } from "./util";

export class PaddingWidget extends DecoratorWidget {
  paddingPixel: Pixel;
  paddingX: number;
  paddingY: number;

  constructor(child: Widget,
              paddingX: number = 1,
              paddingY: number = 1,
              paddingPixel: Pixel = new Pixel(' ')) {
    super(child);
    this.paddingX = paddingX;
    this.paddingY = paddingY;
    this.paddingPixel = paddingPixel;
  }

  doRender(): Output {
    this.child.render();
    const output = new Output(this.child.output.width + 2 * this.paddingX,
                              this.child.output.height + 2 * this.paddingY);

    for (let y = 0 ; y < output.height ; y++) {
      for (let x = 0 ; x < output.width ; x++) {
        if (x < this.paddingX || x >= this.child.output.width + this.paddingX ||
            y < this.paddingY || y >= this.child.output.height + this.paddingY) {
          output.pixels[y][x] = clone(this.paddingPixel);
        } else {
          output.pixels[y][x] = clone(this.child.output.pixels[y-this.paddingY][x-this.paddingX]);
        }
      }
    }

    return output;
  }
}
