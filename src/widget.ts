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
  output: Output | null = null;

  render() {
    if (this.isDirty) {
      this.doRender();
    }
  }

  markDirty() {
    this.isDirty = true;
    if (this.parent) {
      this.parent.markDirty();
    }
  }

  abstract doRender(): void;
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

  doRender() {
    this.output = Output.fromPixels([this.text.split('').map((char) => (
      new Pixel(char, this.color, this.background, this.isDim, this.isUnderlined)
    ))]);
    this.isDirty = false;
  }
}
