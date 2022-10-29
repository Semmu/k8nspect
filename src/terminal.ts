const exec = require('child_process').execSync;

function rand(max: number = 20) {
  return Math.floor(Math.random() * max);
}

export default class Terminal {
  private stdin: NodeJS.ReadStream;
  private stdout: any;

  private width: number = 0;
  private height: number = 0;

  constructor(stdin: NodeJS.ReadStream, stdout: any) {
    this.stdin = stdin;
    this.stdout = stdout;

    this.onResize();
    this.stdout.on('resize', () => { this.onResize(); });

    this.stdin.on('data', (input: Buffer) => { this.onData(input) });

    setInterval(() => { this.randPut();}, 10);

    this.toggleTTYRaw();
    this.hideCursor();
  }

  randPut() {
    this.goto(rand(this.width) + 1, rand(this.height) + 1);
    this.print(rand(10).toString());
  }

  onData(input: Buffer) {
    if (input.toString() == '\x03') { // ctrl-c
        process.exit();
    }

    this.goto(5,5);
    this.print(`got ${input.toString('hex')}     `);
    if (input.toString('hex') == '1b5b43') {
      this.print('lol works')
    } else {
      this.print('       ')
    }
  }

  toggleTTYRaw() {
    exec('stty raw -echo', {
        stdio: 'inherit'
    });
  }

  onResize() {
    this.width = this.stdout.columns;
    this.height = this.stdout.rows;

    this.goto(0, 0);
    this.clear();
    this.print('/');
    this.goto(-1, -1);
    this.print('x');
  }

  print(txt: string) {
    this.stdout.write(txt);
  }

  goto(x: number, y: number) {
    if (x < 0) {
      x+= this.width + 1;
    }
    if (y < 0) {
      y += this.height + 1;
    }

    this.print(`\x1b[${y};${x}H`);
  }

  clear() {
    this.goto(0, 0);
    this.print('\x1b[2J');
  }

  showCursor() {
    this.print('\u001B[?25h');
  }

  hideCursor() {
    this.print('\u001B[?25l');
  }

  onExit() {
    this.goto(-1, -1);
    this.showCursor();
    this.toggleTTYRaw();
  }

}
