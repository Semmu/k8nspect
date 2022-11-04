import { BorderWidget } from "./borderwidget"
import { Label } from "./label"
import { Output } from "./output"
import { BackgroundColor, TextColor } from "./terminal_specials"
import { Widget } from "./widget"

export class ModalWidget extends BorderWidget {
  title: Label

  constructor(title: Label,
    contents: Widget,
    borderColor: TextColor = TextColor.Default,
    backgroundColor: BackgroundColor = BackgroundColor.Default) {
    super(contents, borderColor, backgroundColor)
    this.title = title
    this.title.parent = this
  }

  render(): Output {
    const output = super.render()

    // cloning the original label causes dynamic labels to wreak havoc,
    // as both the original and new one will trigger a refresh on its parent.
    // solving this is actually an interesting question...
    const renderedLabel = this.title
    // but if i dont clone this label, cropping the modal title modifies
    // the original variable.

    if (renderedLabel.text.length > output.width - 2) {
      renderedLabel.text = renderedLabel.text.substring(0, output.width - 5) + "..."
    }

    for(let x = 0 ; x < renderedLabel.output.width ; x++) {
      output.pixels[0][x+1] = renderedLabel.output.pixels[0][x]
    }

    return output
  }
}
