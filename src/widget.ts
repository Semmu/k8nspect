import { Output } from "./output";

export abstract class Widget {
  private _parent: Widget | null = null
  private _isDirty: boolean = true
  private _output: Output = new Output(0, 0)

  get output(): Output {
    if (this._isDirty) {
      this._output = this.render()
      this._isDirty = false
    }

    return this._output
  }

  get isDirty() {
    return this._isDirty;
  }

  abstract render(): Output

  set parent(widget: Widget) {
    if (!this._parent) {
      this._parent = widget;
    } else {
      throw new Error(`cannot set parent of widget, as it is already set`)
    }
  }

  markDirty() {
    this._isDirty = true;
    if (this._parent) {
      this._parent.markDirty();
    }
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
