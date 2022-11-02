import { BorderWidget } from "./borderwidget"
import { Label } from "./label"
import { Output } from "./output"
import { BackgroundColor, TextColor } from "./terminal_specials"
import { clone } from "./util"
import { Widget } from "./widget"

export class ModalWidget extends BorderWidget {
  label: Label

  constructor(child: Widget,
    label: Label,
    borderColor: TextColor = TextColor.Default,
    backgroundColor: BackgroundColor = BackgroundColor.Default) {
    super(child, borderColor, backgroundColor)
    this.label = label
    this.label.parent = this
  }

  render(): Output {
    const output = super.render()
    const renderedLabel = clone(this.label)

    if (renderedLabel.text.length > output.width - 2) {
      renderedLabel.text = renderedLabel.text.substring(0, output.width - 5) + "..."
    }

    for(let x = 0 ; x < renderedLabel.output.width ; x++) {
      output.pixels[0][x+1] = renderedLabel.output.pixels[0][x]
    }

    return output
  }
}
