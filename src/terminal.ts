import { execSync as exec } from "child_process"

import { Pixel } from "./pixel"
import { BackgroundColor, Special, TextColor } from "./terminal_specials"
import { e } from "./util"
import { Widget } from "./widget"

export class Terminal {
  private stdin: NodeJS.ReadStream
  private stdout: NodeJS.WriteStream

  private width = 0
  private height = 0

  private x = 0
  private y = 0

  private color: TextColor = TextColor.Default
  private background: BackgroundColor = BackgroundColor.Default

  private _widget: Widget | null = null

  set widget(widget: Widget) {
    this._widget = widget
  }

  constructor(stdin: NodeJS.ReadStream, stdout: NodeJS.WriteStream) {
    this.stdin = stdin
    this.stdout = stdout

    this.goto(0, 0)
    this.clear()

    this.onResize()
    this.stdout.on("resize", () => { this.onResize() })

    this.stdin.on("data", (input: Buffer) => {
      this.onKeyPress(input)
    })

    setInterval(() => {
      if (this._widget && this._widget.isDirty) {
        this.onResize()
      }
    }, 1000)

    this.toggleTTYRaw()
    // this.hideCursor();

    e({
      msg: "new terminal"
    })
  }

  onKeyPress(input: Buffer) {
    if (input.toString() == "\x03") { // ctrl-c
      this.goto(0, this.height)
      this.print("byeeeee")
      process.exit()
    }

    this.goto(5,5)
    this.print(`got ${input.toString("hex")}     `)
  }

  toggleTTYRaw() {
    exec("stty raw -echo", {
      stdio: "inherit"
    })
  }

  onResize() {
    this.width = this.stdout.columns
    this.height = this.stdout.rows

    this.goto(0, 0)
    // this.clear();
    this.print(`/ w=${this.width} h=${this.height}`)
    this.goto(-1, -1)
    this.setColor(TextColor.Cyan)
    this.print("X")

    if (this._widget) {
      // e({
      //   msg: 'rendering widget'
      // })
      // this._widget.render();
      const x = 5
      const y = 10

      // need a cache here, only print changed characters.
      // basically keep a copy of what has been printed on screen
      // and compare.
      //
      // also only print special chars (color, etc.) if they are different
      // from the previous.
      this._widget.output.pixels.forEach((row: Pixel[], iy: number) => {
        row.forEach((pixel, ix) => {
          this.goto(x+ix, y+iy)
          this.setColor(pixel.color)
          this.setBackground(pixel.background)
          if (pixel.isDim) {
            this.printSpecial(Special.Dim)
          }
          if (pixel.isUnderlined) {
            this.printSpecial(Special.Underscore)
          }
          this.print(pixel.char)
        })
      })

      this.resetStyling()

    }
  }

  printSpecial(txt: string) {
    this.stdout.write(txt)
  }

  print(txt: string) {
    this.printSpecial(Special.Reset)
    if (this.color != TextColor.Default) {
      this.printSpecial(this.color)
    }
    if (this.background != BackgroundColor.Default) {
      this.printSpecial(this.background)
    }

    const remainingSpace: number = this.width - this.x + 1
    if (remainingSpace) {
      this.stdout.write(txt)
      this.x += txt.length
    } else {
      e({
        msg: "cannot print",
        remainingSpace: remainingSpace,
        x: this.x,
        y: this.y,
        txt: txt
      })
      this.stdout.write(txt.substring(0, remainingSpace))
      this.x += remainingSpace
    }
  }

  setColor(color: TextColor) {
    this.color = color
  }

  setBackground(background: BackgroundColor) {
    this.background = background
  }

  resetStyling() {
    this.color = TextColor.Default
    this.background = BackgroundColor.Default
  }

  goto(x: number, y: number) {
    if (x < 0) {
      x+= this.width + 1
    }
    if (y < 0) {
      y += this.height + 1
    }

    this.x = x
    this.y = y
    this.printSpecial(`\x1b[${y};${x}H`)
  }

  clear() {
    this.goto(0, 0)
    this.printSpecial("\x1b[2J")
  }

  showCursor() {
    this.printSpecial("\u001B[?25h")
  }

  hideCursor() {
    this.printSpecial("\u001B[?25l")
  }

  onExit() {
    this.goto(-1, -1)
    this.printSpecial(Special.Reset)
    this.showCursor()
    this.toggleTTYRaw()
  }

}
