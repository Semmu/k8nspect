const exec = require('child_process').execSync;

function rand(max: number = 20) {
  return Math.floor(Math.random() * max);
}

function err(msg: object) {
  console.error(Terminal.Special.Reset);
  console.error(msg);
}

export default class Terminal {
  private stdin: NodeJS.ReadStream;
  private stdout: any;

  private width: number = 0;
  private height: number = 0;

  private x: number = 0;
  private y: number = 0;

  private color: string = "";
  private background: string = "";

  static readonly Special = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",
  }

  private static readonly Text = {
    Black: "\x1b[30m",
    Red: "\x1b[31m",
    Green: "\x1b[32m",
    Yellow: "\x1b[33m",
    Blue: "\x1b[34m",
    Magenta: "\x1b[35m",
    Cyan: "\x1b[36m",
    White: "\x1b[37m",
  }

  private static readonly Background = {
    Black: "\x1b[40m",
    Red: "\x1b[41m",
    Green: "\x1b[42m",
    Yellow: "\x1b[43m",
    Blue: "\x1b[44m",
    Magenta: "\x1b[45m",
    Cyan: "\x1b[46m",
    White: "\x1b[47m"
  }

  constructor(stdin: NodeJS.ReadStream, stdout: any) {
    this.stdin = stdin;
    this.stdout = stdout;

    this.onResize();
    this.stdout.on('resize', () => { this.onResize(); });

    this.stdin.on('data', (input: Buffer) => { this.onData(input) });

    // setInterval(() => { this.randPut();}, 10);

    this.toggleTTYRaw();
    this.hideCursor();

    err({
      msg: 'new terminal'
    });
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
      this.print('right')
    } else {
      this.print('              ')
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
    this.print(`/ w=${this.width} h=${this.height}`);
    this.goto(-1, -1);
    this.setColor(Terminal.Text.Cyan);
    this.print('X');
  }

  printSpecial(txt: string) {
    this.stdout.write(txt);
  }

  print(txt: string) {
    this.printSpecial(Terminal.Special.Reset);
    if (this.color.length > 0) {
      this.printSpecial(this.color);
    }
    if (this.background.length > 0) {
      this.printSpecial(this.background);
    }

    let remainingSpace: number = this.width - this.x + 1;
    if (remainingSpace >= txt.length) {
      this.stdout.write(txt);
      this.x += txt.length;
    } else {
      err({
        msg: 'cannot print',
        remainingSpace: remainingSpace,
        x: this.x,
        y: this.y,
        txt: txt
      });
      this.stdout.write(txt.substring(0, remainingSpace));
      this.x += remainingSpace;
    }
  }

  setColor(color: string) {
    this.color = color;
  }

  setBackground(background: string) {
    this.background = background;
  }

  resetStyling() {
    this.color = "";
    this.background = "";
  }

  resetColors() {
    this.color = "";
    this.background = "";
  }

  goto(x: number, y: number) {
    if (x < 0) {
      x+= this.width + 1;
    }
    if (y < 0) {
      y += this.height + 1;
    }

    this.x = x;
    this.y = y;
    this.printSpecial(`\x1b[${y};${x}H`);
  }

  clear() {
    this.goto(0, 0);
    this.printSpecial('\x1b[2J');
  }

  showCursor() {
    this.printSpecial('\u001B[?25h');
  }

  hideCursor() {
    this.printSpecial('\u001B[?25l');
  }

  onExit() {
    this.goto(-1, -1);
    this.printSpecial(Terminal.Special.Reset);
    this.showCursor();
    this.toggleTTYRaw();
  }

}
