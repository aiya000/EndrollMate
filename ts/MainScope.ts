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
	 * エンドロールクレジットのフォントカラーを指定します。
	 */
	creditsFontColor: string;

	/**
	 * エンドロールが既に始まっているか否かを示します。
	 * ( 「開始」ボタンを押すとエンドロールが始まります )
	 */
	endrollStarted: boolean;

	/**
	 * エンドロールを終える予定時間(秒)です。
	 * ( またはエンドロールにかける総時間です。 )
	 */
	endrollFinishTime: number;

	/**
	 * エンドロールピクチャを
	 * 実際の<img>タグのsrc属性に紐付けます。
	 */
	portraitSrc: string;

	/**
	 * 実際の<img>タグのalt属性に紐付けます
	 */
	portraitAlt: string;

	//TODO: まだ使ってない
	/**
	 * エンドロールが終了した後に強調表示する文字列を指定します。
	 */
	endMessage: string;
}
