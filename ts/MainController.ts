/// <reference path="./typings/jquery/jquery.d.ts"/>
/// <reference path="./typings/jquery.tvcredits/jquery.tvcredits.d.ts"/>
/// <reference path="./typings/ng-file-upload/ng-file-upload.d.ts"/>
/// <reference path="./MainScope.ts"/>
/// <reference path="./Maybe.ts"/>
/// <reference path="./Util.ts" />
import IPromise  = ng.IPromise;
import IDeferred = ng.IDeferred;

/**
 * @classdesc DocumentRoot/index.html <body>配下のコントロール
 */
class MainController {
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
	 * TODO: 書く
	 */
	private $timeout: ng.ITimeoutService;

	/**
	 * TODO: 書く
	 */
	private $q: ng.IQService;

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
		// モジュールの設定
		this.$scope    = $scope;
		this.$interval = $interval;
		this.$timeout  = $timeout;
		this.$q        = $q;
	}


	/* --- --- --- public method --- --- --- */
	/**
	 * フォームで指定された画像をbodyの背景に設定します
	 * @param {FileList} $files 選択した1つの画像ファイル
	 */
	public setBackgroundImage($files: FileList) : void {
		let file: File = $files[0];  //NOTE: TypeError ｲﾐﾜｶﾝﾅｲ!!
		let fileReader = new FileReader();
		let setBgImage: EventListener = e => {
			$("body").css("background-image", "url(" + fileReader.result + ")");
		};
		fileReader.addEventListener("load", setBgImage);
		fileReader.readAsDataURL(file);
	}


	/**
	 * エンドロールに使用するテキストファイルを設定します
	 * @param {FileList} $files エンドロールに使用する1つのテキストファイル
	 */
	public setCreditText($files: FileList) : void {
		let file: File = $files[0];  //NOTE: TypeError ｲﾐﾜｶﾝﾅｲ!!
		let fileReader = new FileReader();
		let setRollLines: EventListener = e => {
			this.$scope.creditLines = fileReader.result.split("\n");
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
		let endrollPicturePromise: IPromise<void> = this.startDrawingPortraits();
		let endrollCreditsPromise: IPromise<void> = this.startRisingCreditLines();
		this.$q.all([endrollPicturePromise, endrollCreditsPromise]).then(() => {
			let [fadeMillis, viewMillis]: [number, number] = Util.splitFadeAndViewMillis(this.$scope.endMessageViewSec * 1000.0);
			this.$scope.endrollFinished = true;
			$("#end_message").css({
				  "font-size" : this.$scope.endMessageFontSize + "px"
				, "color"     : this.$scope.endMessageFontColor
			});
			$("#end_message").fadeIn(fadeMillis, () => {
				$("#end_message").delay(viewMillis).fadeOut(fadeMillis);
			});
		});
	}


	/* --- --- --- private method --- --- --- */
	/**
	 * エンドロールの開始条件が整っているかを検査します。
	 * 各inputフォームが検査されます。
	 * @return {Maybe.Data<string>} 無効な状態があればMaybeで包まれたエラーメッセージ,もしくはnothing
	 */
	private findInvalidStatus() : Maybe.Data<string> {
		if ($("body").css("background-image") == "none") {
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
	 */
	private startDrawingPortraits() : IPromise<void> {
		//TODO: assert this.portraits != null
		//NOTE: drawPortraitsを thisを保持しつつsub methodにしたい

		// this.$scope.aPortraitDrawSpeedは
		// 実際「エンドロールピクチャのうちの1つのピクチャ(=portrait)を描画するための時間」だ
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
	 */
	private startRisingCreditLines() : IPromise<void> {
		let defer: IDeferred<any> = this.$q.defer();
		let creditsHeight: number = this.calcCreditsHeight();
		$("#credits").css(<Object>{
			  "margin-top" : -creditsHeight
			, "margin-bottom" : creditsHeight
			, "font-size"  : this.$scope.creditsFontSize + "px"
			, "color"      : this.$scope.creditsFontColor
		});
		$("#credits").tvCredits(<ITvCreditsOptions>{
			  height   : creditsHeight * 2.0  // credit_linesの高さ + 画面の下に潜らせるためのcredit_linesの高さ
			, speed    : this.$scope.creditsRiseSpeed
			, complete : () => {
				$("#credits").text("");  // suppress automatic infinity loop
				defer.resolve();         // notify complete
			}
		});
		return defer.promise;
	}


	/**
	 * TODO: 書く
	 */
	private calcCreditsHeight() : number {
		let lineNum: number       = $("#credit_lines li").length + 2;  //NOTE: 2 <- ??
		let oneLineMargin: number = parseInt($("#credit_lines li").css("margin-bottom"));  // pixel to number
		let oneLineHeight: number = this.$scope.creditsFontSize + oneLineMargin;
		return oneLineHeight * lineNum;
	}
}
