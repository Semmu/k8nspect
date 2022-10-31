import { Output } from "./output";

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
