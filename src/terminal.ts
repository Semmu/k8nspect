import { execSync as exec } from "child_process"
import { CanvasWidget } from "./canvaswidget"
import { Output } from "./output"

import { Pixel } from "./pixel"
import { BackgroundColor, Special, TextColor } from "./terminal_specials"
import { e } from "./util"
import { Widget } from "./widget"

export class Terminal extends CanvasWidget {
  private stdin: NodeJS.ReadStream
  private stdout: NodeJS.WriteStream

  private _nullOutput: Output = new Output(0, 0)
  // private _previousOutput: Output = this._nullOutput
  private _currentOutput: Output = this._nullOutput

  private x = 0
  private y = 0
  private color: TextColor = TextColor.Default
  private background: BackgroundColor = BackgroundColor.Default

  get terminalWidth() {
    return this.stdout.columns
  }

  get terminalHeight() {
    return this.stdout.rows
  }

  constructor(stdin: NodeJS.ReadStream, stdout: NodeJS.WriteStream) {
    super(stdout.columns, stdout.rows, new Pixel("-"))

    // empty log at startup
    e({})

    // setup in&out streams
    this.stdin = stdin
    this.stdout = stdout

    // setup onresize trigger
    this.stdout.on("resize", () => {
      this.onResize()
    })

    // we need to force an initial resize,
    // which causes the initial render.
    this.onResize()

    this.stdin.on("data", (input: Buffer) => {
      this.onKeyPress(input)
    })

    this.enableTTYraw()
    // this.hideCursor();
  }

  enableTTYraw() {
    exec("stty raw -echo", {
      stdio: "inherit"
    })
  }

  disableTTYraw() {
    exec("stty -raw echo", {
      stdio: "inherit"
    })
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
    this.printSpecial(Special.Reset)
    this.printSpecial("\x1b[2J")
  }

  showCursor() {
    this.printSpecial("\u001B[?25h")
  }

  hideCursor() {
    this.printSpecial("\u001B[?25l")
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

  displayOutput() {
    e({
      msg: 'terminal displayOutput',
      w: this.output.width,
      h: this.output.height,
      d: this.isDirty
    })

    this.output.pixels.forEach((row: Pixel[], y: number) => {
      row.forEach((pixel, x) => {

        // WTF THIS IS A BUG, WHY DO I NEED +1
        this.goto(x+1, y+1)

        this.resetStyling()
        this.printSpecial(Special.Reset)
        this.setColor(pixel.color)
        this.setBackground(pixel.background)
        // if (pixel.isDim) {
        //   this.printSpecial(Special.Dim)
        // }
        // if (pixel.isUnderlined) {
        //   this.printSpecial(Special.Underscore)
        // }
        this.print(pixel.char)

        // if (x == 2 && y == 2) {
        //   e({
        //     msg: "at 2:2",
        //     c: pixel.char
        //   })
        //   this.goto(x, y)
        //   this.print("2")
        // }
      })
    })

    // this.goto(0, 0)
    // this.print('W')
  }

  markDirty() {
    super.markDirty()
    e({
      msg: 'i should update'
    })

    this.displayOutput()
  }

  onResize() {
    e({
      msg: "resizing -> clear"
    })

    this.clear();
    this.resize(this.terminalWidth, this.terminalHeight)
    this.markDirty();
  }

  onKeyPress(input: Buffer) {
    e({
      msg: 'keypress',
      hex: input.toString('hex')
    })

    if (input.toString() == "\x03") { // ctrl-c
      e({
        msg: 'goodbye world!'
      })
      process.exit()
    }
  }

  printExitMessage() {
    this.goto(-1, -1)
    this.printSpecial(Special.Reset)
    this.printSpecial("\n\rsee you soon!\n\r")
  }

  onExit() {
    this.printExitMessage()
    this.showCursor()
    this.disableTTYraw()
  }
}
