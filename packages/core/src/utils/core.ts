import { AnyNonArrayObject, AnyObject, Primitive } from '../types/index';

/** Returns whether the value is any kind of object. */
const isAnyObject = (value: Primitive | AnyObject | unknown): value is AnyObject => value === Object(value);

/** Returns whether the value is any kind of object that is not an array. */
const isAnyNonArrayObject = (value: Primitive | AnyNonArrayObject | unknown): value is AnyNonArrayObject =>
	value === Object(value) && !Array.isArray(value);

export { isAnyObject, isAnyNonArrayObject };
