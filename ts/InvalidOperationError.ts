/**
 * 独自定義の例外を格納します。
 * @namespace
 */
module Exceptions {
	/**
	 * @classdesc メソッドの引数以外が原因で処理が無効になった場合に投げられます
	 */
	export class InvalidOperationError implements Error {
		public name:    string;
		public message: string;
		constructor(message: string) {
			this.name = "InvalidOperationError";
		}
	}
}
