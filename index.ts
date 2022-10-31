import { Terminal } from './src/terminal';
import { BackgroundColor, Label, TextColor, StyleOverrider, PaddingWidget, Pixel, BorderWidget, ShadowWidget, ModalWidget, MultiLine, TextAlignment, RandomColorLabel, CanvasWidget, Position, CanvasAlignment } from './src/widget';

let terminal: Terminal = new Terminal(process.stdin, process.stdout);

// let randomcolor = new RandomColorLabel('random color');
// let padding = new PaddingWidget(randomcolor, 2, 1, new Pixel('P', TextColor.Black, BackgroundColor.Cyan));
// let border = new BorderWidget(padding, TextColor.Green, BackgroundColor.Red);
// let modal = new ModalWidget(border, new Label('Modal title1234567890'));
// let shadow = new ShadowWidget(modal, BackgroundColor.Black);
// let override = new StyleOverrider(shadow, TextColor.Blue, BackgroundColor.Yellow);

let char = new RandomColorLabel('X');
let padding = new PaddingWidget(char, 16, 2, new Pixel('/'));
let border = new BorderWidget(padding, TextColor.Red);

let hellothere = new RandomColorLabel('hello there');
let modaltitle = new RandomColorLabel('funky title')
let modalcontents = new MultiLine('this\nis\nsome multiline\ntext hellyeah', TextAlignment.Right, TextColor.Blue)
let modal = new ModalWidget(modalcontents, modaltitle, TextColor.Green);
// let multiline = new MultiLine('goddamn\nmothafuckin12345\nmulti line',TextAlignment.Right, TextColor.Red, BackgroundColor.Black);
let canvas = new CanvasWidget(51, 17, new Pixel('.'));
canvas.addWidget(border, new Position(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2)), CanvasAlignment.Middle);
canvas.addWidget(hellothere)
canvas.addWidget(modal, new Position(canvas.width, canvas.height), CanvasAlignment.BottomRight);

terminal.widget = canvas;
terminal.onResize();

process.on('exit', () => {
  terminal.onExit()
});
