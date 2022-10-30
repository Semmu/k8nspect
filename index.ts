import { Terminal } from './src/terminal';
import { BackgroundColor, Label, TextColor } from './src/widget';

let terminal: Terminal = new Terminal(process.stdin, process.stdout);
let label: Label = new Label('hello there', TextColor.Green, BackgroundColor.Red);

terminal.widget = label;

process.on('exit', () => {
  terminal.onExit()
});
