import { Special, TextColor, BackgroundColor, Widget } from "./widget";

const exec = require('child_process').execSync;

function rand(max: number = 20) {
  return Math.floor(Math.random() * max);
}

function err(msg: object) {
  console.error(Special.Reset);
  console.error({
    time: new Date(),
    msg
  });
}

function randOf<T extends {}>(en: T) : T[keyof T] {
  const l = Object.keys(en).length;
  const i = rand(l);
  const ks = Object.keys(en);
  const k = ks[i];
  // @ts-ignore
  const val = en[k];

  return val;
}

export class Terminal {
  private stdin: NodeJS.ReadStream;
  private stdout: any;

  private width: number = 0;
  private height: number = 0;

  private x: number = 0;
  private y: number = 0;

  private color: TextColor = TextColor.Default;
  private background: BackgroundColor = BackgroundColor.Default;

  private _widget: Widget | null = null;

  set widget(widget: Widget) {
    this._widget = widget;
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
    this.setColor(randOf(TextColor));
    this.setBackground(randOf(BackgroundColor));
    this.print(rand(10).toString());
    this.printSpecial(randOf(Special));
    this.printSpecial('B');
  }

  onData(input: Buffer) {
    if (input.toString() == '\x03') { // ctrl-c
      this.goto(0, this.height);
      this.print('byeeeee')
      process.exit();
    }

    this.goto(5,5);
    this.print(`got ${input.toString('hex')}     `);
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
    this.setColor(TextColor.Cyan);
    this.print('X');

    if (this._widget) {
      err({
        msg: 'rendering widget'
      })
      this._widget.render();
      const x = 5;
      const y = 10;
      this._widget.output.pixels.forEach((row, iy) => {
        row.forEach((pixel, ix) => {
          this.goto(x+ix, y+iy);
          this.setColor(pixel.color);
          this.setBackground(pixel.background);
          if (pixel.isDim) {
            this.printSpecial(Special.Dim);
          }
          if (pixel.isUnderlined) {
            this.printSpecial(Special.Underscore);
          }
          this.print(pixel.char);
        })
      })

      this.resetStyling();

    }
  }

  printSpecial(txt: string) {
    this.stdout.write(txt);
  }

  print(txt: string) {
    this.printSpecial(Special.Reset);
    if (this.color != TextColor.Default) {
      this.printSpecial(this.color);
    }
    if (this.background != BackgroundColor.Default) {
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

  setColor(color: TextColor) {
    this.color = color;
  }

  setBackground(background: BackgroundColor) {
    this.background = background;
  }

  resetStyling() {
    this.color = TextColor.Default;
    this.background = BackgroundColor.Default;
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
    this.printSpecial(Special.Reset);
    this.showCursor();
    this.toggleTTYRaw();
  }

}
