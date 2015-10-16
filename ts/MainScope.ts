// エンドロール中にフェードインアウトを
// 繰り返して描画される画像群を「エンドロールピクチャ」と呼称します。

// エンドロール中に下から上へ流れていく
// クレジットを「エンドロールクレジット」と呼称します。

/// <reference path="./typings/angularjs/angular.d.ts"/>
/// <reference path="./FontColorCSS.ts"/>

interface MainScope extends ng.IScope {

	/**
	 * フォームによって入力される
	 * エンドロールクレジットの描画スピードを格納します。
	 */
	creditsRiseSpeed: number;

	/**
	 * エンドロールクレジットの内容を格納します。
	 */
	creditLines: string[];

	/**
	 * フォームによって入力される
	 * エンドロールテキストのフォントサイズを格納します。
	 */
	creditsFontSize: number;

	/**
	 * エンドロールピクチャ1つの描画にかけるミリ秒。
	 * これはフェードインとフェードアウトにかける時間を含みます。
	 */
	aPortraitDrawSpeed: number;

	/**
	 * フォームによって入力される
	 * エンドロールクレジットのフォントカラーを指定します。
	 */
	creditsFontColor: string;

	/**
	 * エンドロールテキストのCSSを表します。
	 */
	creditsCSSStyle: FontColorCSS;

	/**
	 * エンドロールが既に始まっているか否かを示します。
	 * ( 「開始」ボタンを押すとエンドロールが始まります )
	 */
	endrollStarted: boolean;

	/**
	 * エンドロールピクチャを
	 * 実際の<img>タグのsrc属性に紐付けます。
	 */
	portraitSrc: string;

	/**
	 * 実際の<img>タグのalt属性に紐付けます。
	 */
	portraitAlt: string;

	/**
	 * エンドロールが終了したか否か意を示します。
	 */
	endrollFinished: boolean;

	/**
	 * フォームによって入力される
	 * エンドロールが終了した後に強調表示される文字列を格納します。
	 */
	endMessage: string;

	/**
	 * エンドロールが終了した直後に
	 * フェードアウトとフェードインで強調表示する文字列を
	 * 描画する時間を秒指定します。
	 * ただしその秒はフェードインとフェードアウトを行う時間を含みます。
	 */
	endMessageViewSec: number;

	/**
	 * フォームによって入力される、
	 * エンドロール終了後に表示されるテキストのフォントサイズを格納します。
	 */
	endMessageFontSize: number;

	/**
	 * フォームによって入力される、
	 * エンドロール終了後に表示されるテキストのフォントカラーを格納します。
	 */
	endMessageFontColor: string;
}
