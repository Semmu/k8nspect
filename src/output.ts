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

  constructor(width: number, height: number, fill: Pixel = new Pixel()) {
    this.pixels = new Array(height).fill(undefined).map((y, yi) => (
      new Array(width).fill(undefined).map((x, xi) => (
        clone(fill)
      ))
    ));
  }

  static fromPixels(pixels: Pixel[][]): Output {
    const newOutput = new Output(0, 0);
    newOutput.pixels = pixels;
    return newOutput;
  }
}
