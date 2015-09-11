/// <reference path="./typings/angularjs/angular.d.ts"/>
interface MainScope extends ng.IScope {
	// TODO: "エンドロールテキスト" についての説明
	// TODO: "エンドロールピクチャ" についての説明

	/**
	 * エンドロールテキストの流れのスピードです。
	 */
	creditsRiseSpeed: number;

	/**
	 * エンドロールピクチャ1つの描画にかけるミリ秒。
	 * これはフェードインとフェードアウトにかける時間を含みます。
	 */
	aPortraitDrawSpeed: number;

	/**
	 * エンドロールが既に始まっているか否かを示します。
	 * ( 「開始」ボタンを押すとエンドロールが始まります )
	 */
	endrollStarted: boolean;

	/**
	 * エンドロールテキストの内容を格納します。
	 */
	creditLines: string[];

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
