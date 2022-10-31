import { Pixel } from "./pixel";
import { clone } from "./util";

export class Output {
  pixels: Pixel[][];

  get width() {
    return this.pixels[0].length;
  }

  get height() {
    return this.pixels.length;
  }

  constructor(width: number, height: number, defaultPixel: Pixel = new Pixel()) {
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
