import { BorderWidget } from "./src/borderwidget"
import { CanvasAlignment, CanvasWidget, Position } from "./src/canvaswidget"
import { Clock } from "./src/clock"
import { ModalWidget } from "./src/modalwidget"
import { MultiLine, TextAlignment } from "./src/multiline"
import { PaddingWidget } from "./src/paddingwidget"
import { Pixel } from "./src/pixel"
import { RandomColorLabel } from "./src/randomcolorlabel"
import { ShadowWidget } from "./src/shadowwidget"
import { Terminal } from "./src/terminal"
import { BackgroundColor, TextColor } from "./src/terminal_specials"

const terminal: Terminal = new Terminal(process.stdin, process.stdout)

// let randomcolor = new RandomColorLabel('random color');
// let padding = new PaddingWidget(randomcolor, 2, 1, new Pixel('P', TextColor.Black, BackgroundColor.Cyan));
// let border = new BorderWidget(padding, TextColor.Green, BackgroundColor.Red);
// let modal = new ModalWidget(border, new Label('Modal title1234567890'));
// let shadow = new ShadowWidget(modal, BackgroundColor.Black);
// let override = new StyleOverrider(shadow, TextColor.Blue, BackgroundColor.Yellow);

const char = new RandomColorLabel("why am i working on this")
const padding = new PaddingWidget(char, 12, 3, new Pixel("/"))
const border = new BorderWidget(padding, TextColor.Red)

const hellothere = new RandomColorLabel("hello there")
const modaltitle = new RandomColorLabel("funky title")
const modalcontents = new MultiLine("this\nis\nsome multiline\ntext hellyeah\nit also has shadow", TextAlignment.Right, TextColor.Blue)
const modal = new ModalWidget(modalcontents, modaltitle, TextColor.Green)
const shadow = new ShadowWidget(modal)
const clock = new Clock(TextColor.Blue)
// let multiline = new MultiLine('goddamn\nmothafuckin12345\nmulti line',TextAlignment.Right, TextColor.Red, BackgroundColor.Black);
const canvas = new CanvasWidget(71, 17, new Pixel("."))
canvas.addWidget(border, new Position(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2)), CanvasAlignment.Middle)
canvas.addWidget(hellothere)
canvas.addWidget(shadow, new Position(canvas.width, canvas.height), CanvasAlignment.BottomRight)
canvas.addWidget(clock, new Position(canvas.width, 0), CanvasAlignment.TopRight)

const damn = new MultiLine("i should be working on more important things\nalso write proper tests for these classes", TextAlignment.Left, TextColor.Yellow, BackgroundColor.Default, true, false, new Pixel(""))
canvas.addWidget(damn, new Position(0, canvas.height), CanvasAlignment.BottomLeft)

terminal.widget = canvas
terminal.onResize()

process.on("exit", () => {
  terminal.onExit()
})
