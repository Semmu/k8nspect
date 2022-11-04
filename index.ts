import { BorderWidget } from "./src/borderwidget"
import { CanvasAlignment, Position } from "./src/canvaswidget"
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
const padding = new PaddingWidget(char, 6, 1, new Pixel("/"))
const border = new BorderWidget(padding, TextColor.Red)

const hellothere = new RandomColorLabel("hello there")
const modaltitle = new Label("Colorful title", TextColor.Blue, BackgroundColor.Black)
const modalcontents = new MultiLine("this\nis some\nmultiline text.\n\nhellyeah.\n\nit also has shadow!!!", TextAlignment.Right, TextColor.Magenta)

const modal = new ModalWidget(modaltitle, modalcontents, TextColor.Green)
const shadow = new ShadowWidget(modal)
const clock = new Clock(TextColor.Blue)
const damn = new MultiLine("i should be working on more important things\nalso write proper tests for these classes", TextAlignment.Left, TextColor.Yellow, BackgroundColor.Default, true, false, new Pixel(""))


const modal_colors = new ModalWidget(
  new Label('Normal'),
  new ColorsTester())

const modal_colors_dim = new ModalWidget(
  new Label("Dim"),
  new ColorsTester(true))

const modal_colors_inverted = new ModalWidget(
  new Label("Inverted"),
  new ColorsTester(false, false, true))

const modal_colors_dim_inverted = new ModalWidget(
  new Label('Dim + Inverted'),
  new ColorsTester(true, false, true))

let multiline = new MultiLine('goddamn\nmothafuckin12345\nmulti line',TextAlignment.Right, TextColor.Red, BackgroundColor.Black);

terminal.addWidget(border, new Position(terminal.width - 5, Math.floor(terminal.height / 2)), CanvasAlignment.CenterRight)
terminal.addWidget(hellothere, new Position(1, 1))
terminal.addWidget(shadow, new Position(terminal.width-1, terminal.height-1), CanvasAlignment.BottomRight)
terminal.addWidget(clock, new Position(terminal.width-1, 1), CanvasAlignment.TopRight)
terminal.addWidget(damn, new Position(1, terminal.height-1), CanvasAlignment.BottomLeft)

terminal.addWidget(modal_colors, new Position(6, 3))
terminal.addWidget(modal_colors_dim, new Position(6+TextColors().length*2+6, 3))
terminal.addWidget(modal_colors_inverted, new Position(6, 3+BackgroundColors().length+3))
terminal.addWidget(modal_colors_dim_inverted, new Position(6+TextColors().length*2+6, 3+BackgroundColors().length+3))

process.on("exit", () => {
  terminal.onExit()
})
