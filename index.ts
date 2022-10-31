import { Terminal } from './src/terminal';
import { BackgroundColor, Label, TextColor, StyleOverrider, PaddingWidget, Pixel, BorderWidget, ShadowWidget } from './src/widget';

let terminal: Terminal = new Terminal(process.stdin, process.stdout);
// let label: Label = new Label('hello there', TextColor.Red, BackgroundColor.Black);
// let override = new StyleOverrider(label, TextColor.Blue, BackgroundColor.Yellow);
// let border = new BorderWidget(padding, TextColor.Red, BackgroundColor.Green);

let label = new Label('goddamn', TextColor.Red, BackgroundColor.Black);
let padding = new PaddingWidget(label, 2, 1, new Pixel('P', TextColor.Black, BackgroundColor.Cyan));
let border = new BorderWidget(padding, TextColor.Green, BackgroundColor.Red);
let shadow = new ShadowWidget(border, BackgroundColor.Black);

terminal.widget = shadow;
terminal.onResize();

process.on('exit', () => {
  terminal.onExit()
});
