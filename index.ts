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
let padding = new PaddingWidget(char, 6, 2, new Pixel('-'));
let border = new BorderWidget(padding, TextColor.Red);

// let multiline = new MultiLine('goddamn\nmothafuckin12345\nmulti line',TextAlignment.Right, TextColor.Red, BackgroundColor.Black);
let canvas = new CanvasWidget(31, 21, new Pixel('C'));
canvas.addWidget(border, new Position(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2)), CanvasAlignment.Middle);

terminal.widget = canvas;
terminal.onResize();

process.on('exit', () => {
  terminal.onExit()
});
