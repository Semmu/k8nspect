function rand(max: number = 20) {
  return Math.floor(Math.random() * max);
}

function randOf<T extends {}>(en: T) : T[keyof T] {
  const l = Object.keys(en).length;
  const i = rand(l);
  const ks = Object.keys(en);
  const k = ks[i];
  // @ts-ignore
  const val = en[k];

  return val;
}

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

  constructor(char: string = '',
              color: TextColor = TextColor.Default,
              background: BackgroundColor = BackgroundColor.Default,
              isDim: boolean = false,
              isUnderlined: boolean = false) {
    this.char = char;
    this.color = color;
    this.color = color;
    this.background = background;
    this.isDim = isDim;
    this.isUnderlined = isUnderlined;
  }
}

function clone<T>(instance: T): T {
  // this also copies class methods
  // from: https://stackoverflow.com/a/42737273

  // @ts-ignore
  const copy = new (instance.constructor as { new (): T })();
  // @ts-ignore
  Object.assign(copy, instance);
  // @ts-ignore
  return copy;
}

export class Output {
  pixels: Pixel[][];

  get width() {
    return this.pixels[0].length;
  }

  get height() {
    return this.pixels.length;
  }

  constructor(width: number, height: number, defaultPixel: Pixel = new Pixel()) {
    // this.pixels = Array(height).fill(Array(width).fill(Object.assign({}, defaultPixel)))
    // ^ goddamn this shit does not work because multiple pixels are referencing the same object

    this.pixels = new Array();
    for (let y = 0 ; y < height ; y++) {
      this.pixels[y] = new Array();
      for (let x = 0 ; x < width ; x++) {
        this.pixels[y][x] = clone(defaultPixel);
      }
    }
  }

  static fromPixels(pixels: Pixel[][]): Output {
    const newOutput = new Output(0, 0);
    newOutput.pixels = pixels;
    return newOutput;
  }
}

export abstract class Widget {
  _parent: Widget | null = null;

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

  set parent(widget: Widget) {
    if (!this._parent) {
      this._parent = widget;
    } else {
      console.error('cannot set parent, it is already set');
    }
  }

  markDirty() {
    this.isDirty = true;
    if (this._parent) {
      this._parent.markDirty();
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

export abstract class DecoratorWidget extends Widget {
  child: Widget;

  constructor(child: Widget) {
    super();
    this.child = child;
    child.parent = this;
  }
}

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

  doRender(): Output {
    this.child.render();

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

export class ShadowWidget extends DecoratorWidget {
  shadowColor: BackgroundColor;

  constructor(child: Widget, shadowColor: BackgroundColor = BackgroundColor.Black) {
    super(child);
    this.shadowColor = shadowColor;
  }

  doRender(): Output {
    this.child.render();
    const output = new Output(this.child.output.width + 1, this.child.output.height + 1);

    for (let y = 0 ; y < this.child.output.height ; y++) {
      for (let x = 0 ; x < this.child.output.width ; x++) {
        output.pixels[y][x] = clone(this.child.output.pixels[y][x])
      }
    }

    const shadowCharacter = new Pixel(' ', TextColor.White, this.shadowColor)

    for (let y = 0 ; y < this.child.output.height ; y++) {
      output.pixels[y+1][this.child.output.width] = shadowCharacter
    }

    for (let x = 0 ; x < this.child.output.width ; x++) {
      output.pixels[this.child.output.height][x+1] = shadowCharacter
    }

    return output;
  }
}

export class ModalWidget extends BorderWidget {
  label: Label;

  constructor(child: Widget,
              label: Label,
              borderColor: TextColor = TextColor.Default,
              backgroundColor: BackgroundColor = BackgroundColor.Default) {
    super(child, borderColor, backgroundColor);
    this.label = label;
    this.label.parent = this;
  }

  doRender(): Output {
      const output = super.doRender();
      const renderedLabel = clone(this.label)

      if (renderedLabel.text.length > output.width - 2) {
        renderedLabel.text = renderedLabel.text.substring(0, output.width - 5) + '...'
      }

      renderedLabel.render();
      for(let x = 0 ; x < renderedLabel.output.width ; x++) {
        output.pixels[0][x+1] = renderedLabel.output.pixels[0][x];
      }

      return output;
  }
}

export enum TextAlignment {
  Left,
  Center,
  Right
}

export class MultiLine extends Label {
  alignment: TextAlignment;
  paddingPixel: Pixel;

  constructor(text: string,
              alignment: TextAlignment = TextAlignment.Left,
              color: TextColor = TextColor.Default,
              background: BackgroundColor = BackgroundColor.Default,
              isDim: boolean = false,
              isUnderlined: boolean = false,
              paddingPixel: Pixel = new Pixel(' ')) {
    super(text, color, background, isDim, isUnderlined);
    this.alignment = alignment;
    this.paddingPixel = paddingPixel;
  }

  doRender(): Output {
    const lines = this.text.split('\n');
    const longestWidth = lines.map((line) => (line.length)).reduce((a, b) => Math.max(a, b));
    const output = new Output(longestWidth, lines.length, this.paddingPixel);

    for (let y = 0 ; y < lines.length ; y++) {
      const padding = this.alignment == TextAlignment.Left ? 0 : (
        this.alignment == TextAlignment.Center ?
          Math.floor((longestWidth - lines[y].length) / 2) :
          longestWidth - lines[y].length
      )

      for (let x = 0 ; x < lines[y].length ; x++) {
        output.pixels[y][x+padding] = new Pixel(lines[y][x], this.color, this.background, this.isDim, this.isUnderlined)
      }
    }
    // console.error('multiline render', {w: output.width, h: output.height})

    return output;
  }
}

// the values here sound really bad.
export enum CanvasAlignment {
  TopLeft,
  CenterLeft,
  BottomLeft,
  BottomCenter,
  BottomRight,
  CenterRight,
  TopRight,
  TopCenter,
  Middle
}

export class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

class CanvasWidgetChild {
  widget: Widget;
  position: Position;
  alignment: CanvasAlignment;

  constructor(widget: Widget, position: Position, alignment: CanvasAlignment) {
    this.widget = widget;
    this.position = position;
    this.alignment = alignment;
  }
}

function halfOf(num: number) {
  return Math.floor(num / 2);
}

export class CanvasWidget extends Widget {
  width: number;
  height: number;
  defaultPixel: Pixel;
  children: CanvasWidgetChild[];

  constructor(width: number, height: number, defaultPixel: Pixel = new Pixel()) {
    super();
    this.width = width;
    this.height = height;
    this.defaultPixel = defaultPixel;
    this.children = [];
  }

  addWidget(widget: Widget, position: Position = new Position(0, 0), alignment: CanvasAlignment = CanvasAlignment.TopLeft) {
    this.children.push(new CanvasWidgetChild(widget, position, alignment));
    // console.error('widget added');
    widget.parent = this;
    this.markDirty();
  }

  doRender(): Output {
    const output = new Output(this.width, this.height, this.defaultPixel);

    this.children.forEach((child) => {
      // console.error('child render')
      child.widget.render();
      let posX = child.position.x;
      let posY = child.position.y;
      switch(child.alignment) {
        case CanvasAlignment.TopLeft:
        break;

        case CanvasAlignment.CenterLeft:
          posY -= halfOf(child.widget.output.height);
        break;

        case CanvasAlignment.BottomLeft:
          posY -= child.widget.output.height;
        break;

        case CanvasAlignment.TopCenter:
          posX -= halfOf(child.widget.output.width);
        break;

        case CanvasAlignment.Middle:
          posX -= halfOf(child.widget.output.width);
          posY -= halfOf(child.widget.output.height);
        break;

        case CanvasAlignment.BottomCenter:
          posX -= halfOf(child.widget.output.width);
          posY -= child.widget.output.height;
        break;

        case CanvasAlignment.TopRight:
          posX -= child.widget.output.width;
        break;

        case CanvasAlignment.CenterRight:
          posX -= child.widget.output.width;
          posY -= halfOf(child.widget.output.height);
        break;

        case CanvasAlignment.BottomRight:
          posX -= child.widget.output.width;
          posY -= child.widget.output.height;
        break;
      }
      // console.error({
      //   posX, posY,
      //   child: {
      //     w: child.widget.output.width,
      //     h: child.widget.output.height
      //   }
      // })

      for (let y = 0 ; y < child.widget.output.height ; y++) {
        for (let x = 0 ; x < child.widget.output.width ; x++) {
          const destX = x + posX;
          const destY = y + posY;

          if (destX >= 0 && destX < this.width &&
              destY >= 0 && destY < this.height) {
            // console.error(`${x}:${y}->${destX}:${destY}`)
            if (child.widget.output.pixels[y][x].char.length > 0) {
              output.pixels[destY][destX] = clone(child.widget.output.pixels[y][x]);
            }
          }
        }
      }

    });

    return output;
  }
}

// color and bg
class InvertWidget {}

// crop to certain size from certain point
class CropWidget {}

// invert color and bg periodically
class BlinkWidget {}

// show and hide text periodically
class PeekabooWidget {}

// for creating copies of the same
class DeepCopyWidget {}
// or should we have proper clone methods everywhere?
