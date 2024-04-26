/**
 * Retrieve object's (`TValue`) keys if they extend the given `TTest` type.
 *
 * @example
 * type X = KeysBy<{ foo: 'bar', bar: 'foo', foobar: 2 }, string>
 * // 'foo' | 'bar'
 *
 * type Base = { x: 'foo' | 'bar' };
 * type Obj = { foo: { x: 'foo' }, bar: { x: 'bar' }, other: { x: '42' } };
 * type X = KeysBy<Obj, Base>
 * // 'foo' | 'bar'
 */
export type KeysBy<TValue, TTest, TExtract extends keyof any = keyof any> = {
  [key in keyof TValue & TExtract]: TValue[key] extends TTest ? key : never;
}[keyof TValue & TExtract];

/**
 * Retrieve object's (`TValue`) keys if they don't extend the given `TTest` type.
 *
 * @example
 * type X = KeysExcept<{ foo: 'bar', bar: 'foo', foobar: 2 }, string>
 * // foobar
 *
 * type Base = { x: 'foo' | 'bar' };
 * type Obj = { foo: { x: 'foo' }, bar: { x: 'bar' }, other: { x: '42' } };
 * type X = KeysBy<Obj, Base>
 * // 'other'
 */
export type KeysExcept<TValue, TTest, TExtract extends keyof any = keyof any> = {
  [key in keyof TValue & TExtract]: TValue[key] extends TTest ? never : key;
}[keyof TValue & TExtract];

/**
 * Retrieve object's (`TValue`) properties if their value extends the given `TTest` type.
 *
 * @example
 * type X = KeysBy<{ foo: 'bar', bar: 'foo', foobar: 2 }, string>
 * // { foo: 'bar', bar: 'foo' }
 *
 * type Base = { x: 'foo' | 'bar' };
 * type Obj = { foo: { x: 'foo' }, bar: { x: 'bar' }, other: { x: '42' } };
 * type X = KeysBy<Obj, Base>
 * // { foo: { x: 'foo' }, bar: { x: 'bar' } }
 */
export type PickBy<TValue, TTest> = Pick<TValue, KeysBy<TValue, TTest>>;

export type PartialBy<TValue, TKeys extends keyof TValue> = Omit<TValue, TKeys> &
  Partial<Pick<TValue, TKeys>>;

/**
 * Retrieve object's (`TObject`) values
 *
 * @example
 * type X = Values<{ foo: 'bar', bar: 'foo', foobar: 2 }>
 * // 'bar' | 'foo' | 2
 *
 * type Y = Values<{ foo: { x: 'foo' }, bar: { x: 'bar' }, other: { x: '42' } }>
 * // { x: 'foo' } | { x: 'bar' } | { x: '42' }
 */
export type Values<TObject extends object> = TObject[keyof TObject];

export type DeepPartial<TObject> = TObject extends object
  ? {
      [TKey in keyof TObject]?: DeepPartial<TObject[TKey]>;
    }
  : TObject;

/**
 * Replace the keys of an object with the keys of another object
 *
 * @example
 * type X = Replace<{ foo: number, bar: number}, { foo: string }>
 *  // { foo: string, bar: number }
 */
export type Replace<
  TObject extends object,
  TNew extends Partial<{ [key in keyof TObject]: unknown }>
> = Omit<TObject, keyof TNew> & TNew;
