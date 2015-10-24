/// <reference path="../typings/jquery.keyframes.d.ts/typings/jquery.keyframes.d.ts"/>


/**
 * @namspaec MainControllerクラスのサブファンクションを配下に置きます
 */
namespace Module {
	/**
	 * 画像の全体描画時間が指定され、
	 * フェード(イン|アウト)を行うミリ秒と表示のみを行うミリ秒に分割します。
	 */
	export function splitFadeAndViewMillis(wholeMillis: number) : [number, number] {
		let fadeMillis = wholeMillis / 4.0;
		let viewMillis = wholeMillis - fadeMillis * 2.0;
		return [fadeMillis, viewMillis];
	}

	/**
	 * $.keyframeにスクロール用のアニメーションを定義します。
	 * @param {string} animationName cssのkeyframes名 (@keyframes animationName { ... })
	 * @param {number} childNum 定義されたkeyframesを使うタグの子要素の数
	 */
	export function defineMarqueeAnimation(animationName: string, childNum: number) : void {
		let heightAsPercent: number = childNum * 100;
		$.keyframe.define([{
			"name" : animationName,
			"from" : { transform: "translate(0%,0%);" },
			"to"   : { transform: "translate(0%,-" + heightAsPercent + "%);" }
		}]);
	}
}
