import { Terminal } from './src/terminal';
import { BackgroundColor, Label, TextColor, StyleOverrider, PaddingWidget, Pixel, BorderWidget, ShadowWidget, ModalWidget, MultiLine, TextAlignment, RandomColorLabel } from './src/widget';

let terminal: Terminal = new Terminal(process.stdin, process.stdout);
// let label: Label = new Label('hello there', TextColor.Red, BackgroundColor.Black);
// let override = new StyleOverrider(label, TextColor.Blue, BackgroundColor.Yellow);
// let border = new BorderWidget(padding, TextColor.Red, BackgroundColor.Green);

// let label = new MultiLine('goddamn\nmothafuckin12345\nmulti line',TextAlignment.Right, TextColor.Red, BackgroundColor.Black);
let randomcolor = new RandomColorLabel('random color');
let padding = new PaddingWidget(randomcolor, 2, 1, new Pixel('P', TextColor.Black, BackgroundColor.Cyan));
let border = new BorderWidget(padding, TextColor.Green, BackgroundColor.Red);
let modal = new ModalWidget(border, new Label('Modal title1234567890'));
let shadow = new ShadowWidget(modal, BackgroundColor.Black);
// let override = new StyleOverrider(modal, TextColor.Blue, BackgroundColor.Yellow);

terminal.widget = shadow;
terminal.onResize();

process.on('exit', () => {
  terminal.onExit()
});
