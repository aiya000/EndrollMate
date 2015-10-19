// thanks http://d.hatena.ne.jp/m-hiyama/20150325/1427260591

/// <reference path="../Error/InvalidOperationError.ts"/>
import InvalidOperationError = Exception.InvalidOperationError;

/**
 * Maybeを表す型と値を格納します。
 * @namespace
 */
namespace Data.Maybe.Maybe {
	/**
	 * 「データを持っているかもしれないし持っていないかもしれない」ことを表します。
	 *
	 * コンストラクタに値を引数として与えた場合は
	 * 「データを持っている」とされ、そのインスタンスは「Just値」と表現されます。
	 *
	 * コンストラクタに値を引数として与えなかった場合は
	 * 「データを持っていない」とされ、そのインスタンスは「Nothing値」と表現されます。
	 *
	 * Memo: このクラスはモナド法則を満たしません。
	 * @classdesc MaybeのJust値またはNothing値を表します
	 */
	export class Data<T> {
		private value: T;

		/**
		 * @constructor
		 * @param {T} value? Just値としてData<T>インスタンス内部に持たせたい任意の型の値
		 */
		constructor(value?: T) {
			this.value = value;
		}

		/**
		 * もしインスタンスがJust値であれば(Nothing値でなければ)
		 * インスタンスが格納する値を返し、
		 * もしインスタンスがNothing値であれば(Just値でなければ)
		 * InvalidOperationErrorを投げます。
		 * @return Just値が持つ値
		 * @throws {InvalidOperationError} thisがJust値ではありません
		 */
		public getValue() : T {
			if (this.value == null) {
				throw new InvalidOperationError("thisがJust値ではありません、このメソッドはインスタンスがJust値である時のみ使用することができます。");
			}
			return this.value;
		}

		/**
		 * @return {boolean} Maybe.Data<T>がJust値であるかを返します
		 */
		public hasValue() : boolean {
			return this.value != null;
		}
	}

	/**
	 * Data<T>クラスのNothing値を表します。
	 * @example
	 * if (foo == null) { return Maybe.nothing; }
	 * else { return Maybe.just(foo); }
	 */
	export const nothing = new Data<any>();

	/**
	 * Data<T>クラスのJust値を生成します。
	 * @example
	 * if (foo == null) { return Maybe.nothing; }
	 * else { return Maybe.just(foo); }
	 */
	export function just<T>(x: T) : Data<T> {
		return new Data<T>(x);
	}
}
