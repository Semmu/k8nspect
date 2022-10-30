export enum Special {
  Reset      = "\x1b[0m",
  Bright     = "\x1b[1m", // default color
  Dim        = "\x1b[2m", // darker color, could be useful for secondary text
  Underscore = "\x1b[4m", // it is actually underscore, could be useful for hotkeys
  Blink      = "\x1b[5m", // did not blink for me, may be too distracting anyways
  Reverse    = "\x1b[7m", // text-background swap, could be useful for highlights
  Hidden     = "\x1b[8m", // text is essentially just blank space
}

export enum TextColor {
  Default = "",
  Black   = "\x1b[30m",
  Red     = "\x1b[31m",
  Green   = "\x1b[32m",
  Yellow  = "\x1b[33m",
  Blue    = "\x1b[34m",
  Magenta = "\x1b[35m",
  Cyan    = "\x1b[36m",
  White   = "\x1b[37m",
}

export enum BackgroundColor {
  Default = "",
  Black   = "\x1b[40m",
  Red     = "\x1b[41m",
  Green   = "\x1b[42m",
  Yellow  = "\x1b[43m",
  Blue    = "\x1b[44m",
  Magenta = "\x1b[45m",
  Cyan    = "\x1b[46m",
  White   = "\x1b[47m"
}

export class Pixel {
  char: string;
  color: TextColor;
  background: BackgroundColor;
  isDim: boolean;
  isUnderlined: boolean;

  constructor(char: string = " ",
              color: TextColor = TextColor.Default,
              background: BackgroundColor = BackgroundColor.Default,
              isDim: boolean = false,
              isUnderlined: boolean = false) {
    this.char = char[0];
    this.color = color;
    this.color = color;
    this.background = background;
    this.isDim = isDim;
    this.isUnderlined = isUnderlined;
  }
}

export class Output {
  pixels: Pixel[][];

  get width() {
    return this.pixels[0].length;
  }

  get height() {
    return this.pixels.length;
  }

  constructor(width: number, height: number) {
    this.pixels = Array(height).fill(Array(width).fill(new Pixel()))
  }

  static fromPixels(pixels: Pixel[][]): Output {
    const newOutput = new Output(0, 0);
    newOutput.pixels = pixels;
    return newOutput;
  }
}

export abstract class Widget {
  parent: Widget | null = null;

  isDirty: boolean = true;
  private _output: Output | null = null;

  get output(): Output {
    return this._output ?? new Output(0, 0);
  }

  render() {
    if (this.isDirty) {
      this._output = this.doRender();
      this.isDirty = false;
    }
  }

  markDirty() {
    this.isDirty = true;
    if (this.parent) {
      this.parent.markDirty();
    }
  }

  abstract doRender(): Output;
}

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
              inUnderlined: boolean = false) {
    super();
    this.text = text;
    this.color = color;
    this.background = background;
    this.isDim = isDim;
    this.isUnderlined = inUnderlined;
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

export abstract class DecoratorWidget extends Widget {
  child: Widget;

  constructor(child: Widget) {
    super();
    this.child = child;
  }
}

export class StyleOverrider extends DecoratorWidget {
  color: TextColor;
  background: BackgroundColor;
  isDim: boolean;
  isUnderlined: boolean;

  constructor(child: Widget,
              color: TextColor = TextColor.Red,
              background: BackgroundColor = BackgroundColor.Default,
              isDim: boolean = false,
              inUnderlined: boolean = true) {
    super(child);

    this.color = color;
    this.background = background;
    this.isDim = isDim;
    this.isUnderlined = inUnderlined;
  }

  doRender(): Output {
    this.child.render();
    return Output.fromPixels(this.child.output.pixels.map((row) => (
      row.map((pixel) => (
        new Pixel(pixel.char, this.color, this.background, this.isDim, this.isUnderlined)
      ))
    )))
  }
}

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
    // console.error({
    //   w: this.child.output.width,
    //   h: this.child.output.height
    // });
    const output = new Output(this.child.output.width + 2 * this.paddingX,
                              this.child.output.height + 2 * this.paddingY);

    // for (let y = 0 ; y < output.height ; y++) {
    //   for (let x = 0 ; x < output.width ; x++) {
    //     if (x < this.paddingX || x >= this.child.output.width + this.paddingX ||
    //         y < this.paddingY || y >= this.child.output.height + this.paddingY) {
    //       // output.pixels[y][x] = this.paddingPixel;
    //     } else {
    //       console.error({
    //         msg: `copying [${y-this.paddingY}][${x-this.paddingX}] to [${y}][${x}]`
    //       })
    //       console.error(this.child.output.pixels[y-this.paddingY][x-this.paddingX]);
    //       output.pixels[y][x] = this.child.output.pixels[y-this.paddingY][x-this.paddingX];
    //     }
    //   }
    // }

    // console.error(output.pixels[1]);

    for(let y = 0 ; y < this.paddingY ; y++) {
      output.pixels[y] = Array(this.child.output.width + 2 * this.paddingX).fill(this.paddingPixel)
      output.pixels[y+this.child.output.height+this.paddingY] = Array(this.child.output.width + 2 * this.paddingX).fill(this.paddingPixel)
    }

    for (let y = this.paddingY ; y < this.child.output.height + this.paddingY ; y++) {
      for (let x = 0 ; x < this.paddingX ; x++) {
        output.pixels[y][x] = this.paddingPixel
        output.pixels[y][x+this.child.output.width+this.paddingX] = this.paddingPixel
      }
    }

    for (let y = 0 ; y < this.child.output.height ; y++) {
      for (let x = 0 ; x < this.child.output.width ; x++) {
        output.pixels[y+this.paddingY][x+this.paddingX] = this.child.output.pixels[y][x];
      }
    }

    return output;
  }
}
