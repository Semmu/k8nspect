import Terminal from './src/terminal';

let terminal: Terminal = new Terminal(process.stdin, process.stdout);

process.on('exit', () => {
  terminal.onExit()
});
