function rand(max: number = 20) {
  return Math.floor(Math.random() * max);
}

function goto(x: number, y: number) {
    process.stdout.write(`\x1b[${y};${x}H`);
}

function print(txt: string) {
    process.stdout.write(txt);
}

function clr() {
  goto(0,0);
  process.stdout.write("\x1b[2J"); // clear screen
}

function hide() {
  print('\u001B[?25l'); // hides cursor
}

function show() {
  print('\u001B[?25h'); // show cursor
}

let shown: boolean = false;

const exec = require('child_process').execSync;

exec('stty raw -echo', {
    stdio: 'inherit' // this is important!
});

process.stdin.on('data', input => {

  goto(rand(30) + 5, rand() + 5);
  print(`got ${input.toString('hex')}`);

  if (input.toString() == '\x73') {
    shown = !shown;

    shown ? show() : hide();
  }

    // console.log(`${input.toString('hex')}\r`);
    // note: We add \r because in raw mode the terminal won't
    //       do it automatically for us.

    // Example of how to handle key presses:
    // Since we are in raw mode the terminal won't send the
    // kill signal to our process when we press ctrl-c so
    // we need to handle ctrl-c manually:
    if (input.toString() == '\x03') { // ctrl-c
        process.exit();
    }
});

process.stdout.on('resize', () => {console.log(process.stdout.columns, process.stdout.rows)})


process.on('exit', () => {
    show();
    // remember to restore normal terminal behavior:
    exec('stty -raw echo',{
        stdio: 'inherit' // this is important!
    });

  const x = process.stdout.columns;
  const y = process.stdout.rows;
  goto(x, y);
  print('\n');

});

function start() {

  hide();

  const x = process.stdout.columns;
  const y = process.stdout.rows;

  goto(0, 0);
  clr();
  print('/');
  goto(x, y);
  print('/');
}


start();
