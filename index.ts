import { Terminal } from './src/terminal';
import { BackgroundColor, Label, TextColor, StyleOverrider, PaddingWidget, Pixel } from './src/widget';

let terminal: Terminal = new Terminal(process.stdin, process.stdout);
let label: Label = new Label('hello there', TextColor.Green, BackgroundColor.Red);
// let barebones = new StyleOverrider(label, TextColor.Red);
let padding = new PaddingWidget(label, 5, 2, new Pixel('x'));

terminal.widget = padding;
terminal.onResize();

process.on('exit', () => {
  terminal.onExit()
});
