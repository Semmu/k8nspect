import { Widget } from "./widget";

export abstract class DecoratorWidget extends Widget {
  child: Widget;

  constructor(child: Widget) {
    super();
    this.child = child;
    child.parent = this;
  }
}
