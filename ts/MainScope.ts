// エンドロール中にフェードインアウトを
// 繰り返して描画される画像群を「エンドロールピクチャ」と呼称します。

// エンドロール中に下から上へ流れていく
// クレジットを「エンドロールクレジット」と呼称します。

/// <reference path="./typings/angularjs/angular.d.ts"/>

interface MainScope extends ng.IScope {

	/**
	 * エンドロールクレジットの流れのスピードです。
	 */
	creditsRiseSpeed: number;

	/**
	 * エンドロールクレジットの内容を格納します。
	 */
	creditLines: string[];

	/**
	 * TODO: 書く
	 */
	creditsFontSize: number;

	/**
	 * エンドロールピクチャ1つの描画にかけるミリ秒。
	 * これはフェードインとフェードアウトにかける時間を含みます。
	 */
	aPortraitDrawSpeed: number;

	/**
	 * エンドロールクレジットのフォントカラーを指定します。
	 */
	creditsFontColor: string;

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
	 * エンドロールが終了した後に強調表示する文字列を指定します。
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
	 * TODO: 書く
	 */
	endMessageFontSize: number;

	/**
	 * TODO: 書く
	 */
	endMessageFontColor: string;
}
