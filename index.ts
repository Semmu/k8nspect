import { Terminal } from './src/terminal';
import { BackgroundColor, Label, TextColor, StyleOverrider, PaddingWidget, Pixel, BorderWidget, ShadowWidget, ModalWidget, MultiLine, TextAlignment } from './src/widget';

let terminal: Terminal = new Terminal(process.stdin, process.stdout);
// let label: Label = new Label('hello there', TextColor.Red, BackgroundColor.Black);
// let override = new StyleOverrider(label, TextColor.Blue, BackgroundColor.Yellow);
// let border = new BorderWidget(padding, TextColor.Red, BackgroundColor.Green);

let label = new MultiLine('goddamn\nmothafuckin12345\nmulti line',TextAlignment.Right, TextColor.Red, BackgroundColor.Black);
let padding = new PaddingWidget(label, 2, 1, new Pixel('P', TextColor.Black, BackgroundColor.Cyan));
let border = new BorderWidget(padding, TextColor.Green, BackgroundColor.Red);
let shadow = new ShadowWidget(border, BackgroundColor.Black);
let modal = new ModalWidget(shadow, new Label('Modal title1234'));
// let override = new StyleOverrider(modal, TextColor.Blue, BackgroundColor.Yellow);

terminal.widget = modal;
terminal.onResize();

process.on('exit', () => {
  terminal.onExit()
});
