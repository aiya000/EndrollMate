/**
 * 単機能を持つメソッド群を提供します。
 * @namespace
 */
namespace Util {
	/**
	 * TODO* 書く
	 */
	export function splitFadeAndViewMillis(wholeMillis: number) : [number, number] {
		let fadeMillis = wholeMillis / 4.0;
		let viewMillis = wholeMillis - fadeMillis * 2.0;
		return [fadeMillis, viewMillis];
	}
}
