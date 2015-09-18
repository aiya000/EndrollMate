/**
 * 単機能を持つメソッド群を提供します。
 * @namespace
 */
namespace Util {
	/**
	 * 画像の全体描画時間が指定され、
	 * フェード(イン|アウト)を行うミリ秒と表示のみを行うミリ秒に分割します。
	 */
	export function splitFadeAndViewMillis(wholeMillis: number) : [number, number] {
		let fadeMillis = wholeMillis / 4.0;
		let viewMillis = wholeMillis - fadeMillis * 2.0;
		return [fadeMillis, viewMillis];
	}
}
