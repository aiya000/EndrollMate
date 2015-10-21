/// <reference path="./typings/jquery/jquery.d.ts"/>
/// <reference path="./typings/ng-file-upload/ng-file-upload.d.ts"/>
/// <reference path="./jquery.keyframes.d.ts/typings/jquery.keyframes.d.ts" />
/// <reference path="./Control/CSS/Keyframes.ts"/>
/// <reference path="./Data/Maybe/Maybe.ts"/>
/// <reference path="./Data/CSS/FontColorCSS.ts" />
/// <reference path="./MainScope.ts"/>
/// <reference path="./Util.ts" />

import IPromise     = ng.IPromise;
import IDeferred    = ng.IDeferred;
import Maybe        = Data.Maybe.Maybe;
import FontColorCSS = Data.CSS.FontColorCSS;


/**
 * @classdesc DocumentRoot/index.html <body>配下のコントロール
 */
class MainController {
	/* --- --- --- private const field --- --- --- */
	//FIXME: why happened parse error ?
	//private const SCROLL_ANIMATION_NAME: string = "marquee";
	private SCROLL_ANIMATION_NAME: string = "marquee";

	/* --- --- --- private field --- --- --- */
	/**
	 * index.htmlとの双方向データバインディングに使用されます。
	 */
	private $scope: MainScope;

	/**
	 * エンドロールピクチャの描画に使用されます。
	 */
	private $interval: ng.IIntervalService;

	/**
	 * エンドロールピクチャの描画終了通知に使用されます。
	 */
	private $timeout: ng.ITimeoutService;

	/**
	 * エンドロールテキストの描画終了通知に使用されます。
	 */
	private $q: ng.IQService;

	/**
	 * TODO: 書く
	 */
	private bgImage: File;

	/**
	 * input_formのngf-selectにて
	 * エンドロールピクチャが格納されます。
	 */
	private portraits: FileList;


	/* --- --- --- public constructor --- --- --- */
	/**
	 * 使用するAngularJSのオブジェクトを受け取ります
	 * @constructor
	 */
	constructor($scope: MainScope, $interval: ng.IIntervalService, $timeout: ng.ITimeoutService, $q: ng.IQService) {
		this.$scope    = $scope;
		this.$interval = $interval;
		this.$timeout  = $timeout;
		this.$q        = $q;
	}


	/* --- --- --- public method --- --- --- */
	/**
	 * フォームで指定された画像をインスタンスに格納します
	 * @param {FileList} $files 唯一の要素のあるファイルリスト(選択した1つの画像ファイルのあるリスト)
	 */
	public setBackgroundImage($files: FileList) : void {
		this.bgImage = $files[0];  //NOTE: TypeError ｲﾐﾜｶﾝﾅｲ!!
	}

	/**
	 * エンドロールに使用するテキストファイルを設定します
	 * @param {FileList} $files エンドロールに使用する1つのテキストファイル
	 */
	public setCreditText($files: FileList) : void {
		let file: File = $files[0];  //NOTE: TypeError ｲﾐﾜｶﾝﾅｲ!!
		let fileReader = new FileReader();
		let setRollLines: EventListener = e => {
			//TODO: if x is null, cannot reflect an item. fix to pretty method
			this.$scope.creditLines = fileReader.result.split("\n").map((x,i) => x + "　");
		};
		fileReader.addEventListener("load", setRollLines);
		fileReader.readAsText(file);
	}

	/**
	 * エンドロール中に描画される画像のリストを設定します
	 * @param {FileList} $files エンドロール中に描画される画像のリスト
	 */
	public setPortraits($files: FileList) : void {
		this.portraits = $files;
	}

	/**
	 * フォームで設定した項目を元にエンドロールを開始します。
	 * フォームで未設定な項目がある場合はアラートを出力し、終了します。
	 */
	public startEndRoll() : void {
		let invalidState: Maybe.Data<string> = this.findInvalidStatus();
		if (invalidState.hasValue()) {
			alert(invalidState.getValue());
			return;
		}
		this.$scope.endrollStarted = true;
		this.implantBackgroundImage();
		this.$scope.creditsCSSStyle = new FontColorCSS({ color: this.$scope.creditsFontColor });

		let endrollPicturePromise: IPromise<void> = this.startDrawingPortraits();
		let endrollCreditsPromise: IPromise<void> = this.startRisingCreditLines();
		this.$q.all([endrollPicturePromise, endrollCreditsPromise]).then(() => {
			let [fadeMillis, viewMillis]: [number, number] = Util.splitFadeAndViewMillis(this.$scope.endMessageViewSec * 1000.0);
			this.$scope.endrollFinished = true;
			$("#end_message").css({
				"font-size" : this.$scope.endMessageFontSize + "px",
				"color"     : this.$scope.endMessageFontColor
			});
			$("#end_message").delay(2.0).fadeIn(fadeMillis, () => {
				$("#end_message").delay(viewMillis).fadeOut(fadeMillis);
			});
		});
	}


	/* --- --- --- private method --- --- --- */
	/**
	 * bodyの背景にsetBackgroundImage()で指定された画像を設定します
	 */
	private implantBackgroundImage() : void {
		let fileReader = new FileReader();
		let setBgImage: EventListener = e => {
			$("body").css("background-image", "url(" + fileReader.result + ")");
		};
		fileReader.addEventListener("load", setBgImage);
		fileReader.readAsDataURL(this.bgImage);
	}

	/**
	 * エンドロールの開始条件が整っているかを検査します。
	 * 各inputフォームが検査されます。
	 * @return {Maybe.Data<string>} 無効な状態があればMaybeで包まれたエラーメッセージ,もしくはnothing
	 */
	private findInvalidStatus() : Maybe.Data<string> {
		if (this.bgImage == null) {
			return Maybe.just("The background image was not selected");
		} else if (this.$scope.creditLines == null) {
			return Maybe.just("The text was not selected");
		} else if (this.portraits == null) {
			return Maybe.just("The portraits were not selected");
		}
		return Maybe.nothing;
	}

	/**
	 * setPortraits(FileList)で選択した全ての画像を描画します。
	 * 画像の描画には強調効果としてフェードイン, フェードアウトが使用されます。
	 * @return エンドロールピクチャの描画終了通知
	 */
	private startDrawingPortraits() : IPromise<void> {
		//TODO: assert this.portraits != null
		// 実際this.$scope.aPortraitDrawSpeedは
		// 「エンドロールピクチャのうちの1つのピクチャ(=portrait)を描画するための時間」だ
		// portraitsのうちdrawnPortraitNum番目の画像をthis.$scope.aPortraitDrawSpeedミリ秒描画します
		let [fadeMillis, viewMillis]: [number, number] = Util.splitFadeAndViewMillis(this.$scope.aPortraitDrawSpeed);
		let drawnPortraitNum: number = 0;  // 描画済みの画像の数
		let drawPortraits: Function  = () => this.drawAPortrait(this.portraits[drawnPortraitNum++], fadeMillis, viewMillis);
		this.$scope.portraitAlt      = "endroll-portrait";
		this.$interval(drawPortraits, this.$scope.aPortraitDrawSpeed, this.portraits.length);
		return this.$timeout(this.$scope.aPortraitDrawSpeed * (this.portraits.length + 2));  //NOTE: 2 <- ??
	}

	/**
	 * 1枚の画像をフェードインとフェードアウトで強調しながら描画します。
	 * @param {File}   portrait   このメソッドで描画を行う対象の画像ファイル
	 * @param {number} fadeMillis フェードインに扱うミリ秒 = フェードアウトに扱うミリ秒
	 * @param {number} viewMillis フェードインが終わった後にportraitを表示しておくミリ秒
	 */
	private drawAPortrait(portrait: File, fadeMillis: number, viewMillis: number) : void {
		let fileReader = new FileReader();
		let drawPortraits: EventListener = e => {
			this.$scope.portraitSrc = fileReader.result;
			$("#portrait").fadeIn(fadeMillis, () => {
				$("#portrait").delay(viewMillis).fadeOut(fadeMillis);
			});
		}
		fileReader.addEventListener("load", drawPortraits);
		fileReader.readAsDataURL(portrait);
	}

	/**
	 * エンドロールクレジットを流す処理を開始します。
	 * @return エンドロールテキストの描画終了通知
	 */
	private startRisingCreditLines() : IPromise<void> {
		//TODO: notify completion
		let defer: IDeferred<any> = this.$q.defer();  // :: IDeferred<void>
		this.startScrollCredits();
		return defer.promise;
	}

	/**
	 * エンドロールテキストのスクロールを開始します。
	 * スクロールは下から上へ行われます。
	 */
	private startScrollCredits() {
		Control.CSS.defineMarqueeAnimation(this.SCROLL_ANIMATION_NAME, $("#credits").children().length);
		// エンドロールテキストのスクロールにかける時間
		// (scrollFullTime秒後にテキストは流れきります)
		let scrollFullTime: number = this.$scope.creditsRiseSpeed;
		let creditsNum:     number = $("#credits").children().length;
		$("#credits").css({
			"animation-name"            : this.SCROLL_ANIMATION_NAME,
			"animation-timing-function" : "linear",
			"animation-duration"        : scrollFullTime * creditsNum + "s",
			"animation-iteration-count" : 1
		});
	}

}
