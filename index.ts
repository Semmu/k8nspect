import { BorderWidget } from "./src/borderwidget"
import { Position } from "./src/canvaswidget"
import { Clock } from "./src/clock"
import { ColorsTester } from "./src/colorstester"
import { Label } from "./src/label"
import { ModalWidget } from "./src/modalwidget"
import { MultiLine, TextAlignment } from "./src/multiline"
import { PaddingWidget } from "./src/paddingwidget"
import { Pixel } from "./src/pixel"
import { RandomColorLabel } from "./src/randomcolorlabel"
import { ShadowWidget } from "./src/shadowwidget"
import { Terminal } from "./src/terminal"
import { BackgroundColor, BackgroundColors, TextColor, TextColors } from "./src/terminal_specials"

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
const clock2 = new Clock(TextColor.Yellow)
const damn = new MultiLine("i should be working on more important things\nalso write proper tests for these classes", TextAlignment.Left, TextColor.Yellow, BackgroundColor.Default, true, false, new Pixel(""))


const modal_colors = new ModalWidget(
  new ColorsTester(),
  new Label('Normal'))

const modal_colors_dim = new ModalWidget(
  new ColorsTester(true),
  new Label("Dim"))

const modal_colors_inverted = new ModalWidget(
  new ColorsTester(false, false, true),
  new Label("Inverted"))

const modal_colors_dim_inverted = new ModalWidget(
  new ColorsTester(true, false, true),
  new Label('Dim + Inverted'))

// let multiline = new MultiLine('goddamn\nmothafuckin12345\nmulti line',TextAlignment.Right, TextColor.Red, BackgroundColor.Black);

// terminal.addWidget(border, new Position(Math.floor(terminal.width / 2), Math.floor(terminal.height / 2)), CanvasAlignment.Middle)
// terminal.addWidget(hellothere)
// terminal.addWidget(shadow, new Position(terminal.width, terminal.height), CanvasAlignment.BottomRight)
// terminal.addWidget(clock, new Position(terminal.width, 0), CanvasAlignment.TopRight)
// terminal.addWidget(clock2, new Position(terminal.width, 1), CanvasAlignment.TopRight)
// terminal.addWidget(damn, new Position(0, terminal.height), CanvasAlignment.BottomLeft)

terminal.addWidget(modal_colors, new Position(6, 3))
terminal.addWidget(modal_colors_dim, new Position(6+TextColors().length*2+6, 3))
terminal.addWidget(modal_colors_inverted, new Position(6, 3+BackgroundColors().length+3))
terminal.addWidget(modal_colors_dim_inverted, new Position(6+TextColors().length*2+6, 3+BackgroundColors().length+3))

process.on("exit", () => {
  terminal.onExit()
})
