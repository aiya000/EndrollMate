namespace Control.CSS {
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
