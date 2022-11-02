import { TextColor, BackgroundColor } from "./terminal_specials";

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

  clone(): Pixel {
    // im not sure if this is a "deep enough" clone,
    // not referencing anything same by both instances...
    return new Pixel(this.char, this.color, this.background, this.isDim, this.isUnderlined)
  }
}
