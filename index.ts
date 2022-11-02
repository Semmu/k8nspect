import { Terminal } from './src/terminal';
import { RandomColorLabel } from './src/randomcolorlabel';
import { PaddingWidget } from './src/paddingwidget';
import { Pixel } from './src/pixel';
import { BorderWidget } from './src/borderwidget';
import { ModalWidget } from './src/modalwidget';
import { ShadowWidget } from './src/shadowwidget';
import { MultiLine, TextAlignment } from './src/multiline';
import { CanvasWidget, CanvasAlignment, Position } from './src/canvaswidget';
import { BackgroundColor, TextColor } from './src/terminal_specials';
import { Clock } from './src/clock';

let terminal: Terminal = new Terminal(process.stdin, process.stdout);

// let randomcolor = new RandomColorLabel('random color');
// let padding = new PaddingWidget(randomcolor, 2, 1, new Pixel('P', TextColor.Black, BackgroundColor.Cyan));
// let border = new BorderWidget(padding, TextColor.Green, BackgroundColor.Red);
// let modal = new ModalWidget(border, new Label('Modal title1234567890'));
// let shadow = new ShadowWidget(modal, BackgroundColor.Black);
// let override = new StyleOverrider(shadow, TextColor.Blue, BackgroundColor.Yellow);

let char = new RandomColorLabel('why am i working on this');
let padding = new PaddingWidget(char, 12, 3, new Pixel('/'));
let border = new BorderWidget(padding, TextColor.Red);

let hellothere = new RandomColorLabel('hello there');
let modaltitle = new RandomColorLabel('funky title')
let modalcontents = new MultiLine('this\nis\nsome multiline\ntext hellyeah\nit also has shadow', TextAlignment.Right, TextColor.Blue)
let modal = new ModalWidget(modalcontents, modaltitle, TextColor.Green);
let shadow = new ShadowWidget(modal)
let clock = new Clock(TextColor.Blue)
// let multiline = new MultiLine('goddamn\nmothafuckin12345\nmulti line',TextAlignment.Right, TextColor.Red, BackgroundColor.Black);
let canvas = new CanvasWidget(71, 17, new Pixel('.'));
canvas.addWidget(border, new Position(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2)), CanvasAlignment.Middle);
canvas.addWidget(hellothere)
canvas.addWidget(shadow, new Position(canvas.width, canvas.height), CanvasAlignment.BottomRight);
canvas.addWidget(clock, new Position(canvas.width, 0), CanvasAlignment.TopRight)

let damn = new MultiLine('i should be working on more important things\nalso write proper tests for these classes', TextAlignment.Left, TextColor.Yellow, BackgroundColor.Default, true, false, new Pixel(''));
canvas.addWidget(damn, new Position(0, canvas.height), CanvasAlignment.BottomLeft)

terminal.widget = canvas;
terminal.onResize();

process.on('exit', () => {
  terminal.onExit()
});
