export enum Special {
  Reset      = "\x1b[0m",
  Bright     = "\x1b[1m", // default color
  Dim        = "\x1b[2m", // darker color, could be useful for secondary text
  Underscore = "\x1b[4m", // it is actually underscore, could be useful for hotkeys
  Blink      = "\x1b[5m", // did not blink for me, may be too distracting anyways
  Reverse    = "\x1b[7m", // text-background swap, could be useful for highlights
  Hidden     = "\x1b[8m", // text is essentially just blank space
}

export enum TextColor {
  Default = "",
  Black   = "\x1b[30m",
  Red     = "\x1b[31m",
  Green   = "\x1b[32m",
  Yellow  = "\x1b[33m",
  Blue    = "\x1b[34m",
  Magenta = "\x1b[35m",
  Cyan    = "\x1b[36m",
  White   = "\x1b[37m",
}

export enum BackgroundColor {
  Default = "",
  Black   = "\x1b[40m",
  Red     = "\x1b[41m",
  Green   = "\x1b[42m",
  Yellow  = "\x1b[43m",
  Blue    = "\x1b[44m",
  Magenta = "\x1b[45m",
  Cyan    = "\x1b[46m",
  White   = "\x1b[47m"
}
