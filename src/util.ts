import { Special } from "./terminal_specials";

/**
 * generate random int up to $max
 *
 * @param      {number}  [max=20]  max number, non-inclusive
 * @return     {number}  generated random number
 */
export function randInt(max: number = 20): number {
  return Math.floor(Math.random() * max);
}

/**
 * return an integer (floored) half of a number
 *
 * @param      {number}  num     The number to get the half of
 * @return     {number}  floored half of the $num
 */
export function halfOf(num: number): number {
  return Math.floor(num / 2);
}

/**
 * get random value fro enum
 *
 * @param      {T}           en      an enum to get a random value from
 * @return     {T[keyof T]}  a random value from the $en enum
 */
export function randOf<T extends {}>(en: T) : T[keyof T] {
  const l = Object.keys(en).length;
  const i = randInt(l);
  const ks = Object.keys(en);
  const k = ks[i];
  // @ts-ignore
  const val = en[k];

  return val;
}

/**
 * function to clone class with its methods included
 *
 * @param      {T}   instance  the instance to clone
 * @return     {T}   a deep copy of the instance
 */
export function clone<T>(instance: T): T {
  // this also copies class methods
  // from: https://stackoverflow.com/a/42737273

  // @ts-ignore
  const copy = new (instance.constructor as { new (): T })();
  // @ts-ignore
  Object.assign(copy, instance);
  // @ts-ignore
  return copy;

  // ^ TODO i should probably write a deep-copy
  // clone function for the classes themselves.
}

/**
 * helper to print (error) messages,
 * it is redirected to a file,
 * as we cannot use stdout, since
 * we are using it for the UI.
 *
 * @param      {any}  msg     The (error) message to print
 */
export function e(msg: any) {
  console.error(Special.Reset);
  console.error({
    time: new Date(),
    msg
  });
}
