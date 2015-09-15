/// <reference path="./typings/jquery/jquery.d.ts"/>
/// <reference path="./typings/jquery.tvcredits/jquery.tvcredits.d.ts"/>
/// <reference path="./typings/ng-file-upload/ng-file-upload.d.ts"/>
/// <reference path="./MainScope.ts"/>
/// <reference path="./Maybe.ts"/>

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
	 * エンドロールクレジットのパラメータ設定に使用されます。
	 */
	private $window: ng.IWindowService;

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
	constructor($scope: MainScope, $interval: ng.IIntervalService, $window: ng.IWindowService) {
		// モジュールの設定
		this.$scope    = $scope;
		this.$interval = $interval;
		this.$window   = $window;
		// 初期値の設定
		this.$scope.endrollFinishTime = 20;
		this.$scope.creditsRiseSpeed   = 20000;
		this.$scope.aPortraitDrawSpeed = 4000;
		this.$scope.creditsTextColor   = "Black";
		this.$scope.endrollStarted     = false;
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
		this.startDrawingPortraits();
		this.startRisingCreditLines();
		//TODO: when endroll finished, do notify by some method
		//this.$scope.endMessage = "Endroll Finished";
	}


	/* --- --- --- private method --- --- --- */
	/**
	 * エンドロールの開始条件が整っているかを検査します。
	 * 各inputフォームが検査されます。
	 * @return {Maybe.Data<string>} 無効な状態があればMaybeで包まれたエラーメッセージ,もしくはnothing
	 */
	private findInvalidStatus() : Maybe.Data<string> {
		//TODO: check image of body background
		if ($("body").css("background-image") == "none") {
			return Maybe.just("The background image was not selected");
		}if (this.$scope.creditLines == null) {
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
	private startDrawingPortraits() : void {
		//TODO: assert this.portraits != null
		//NOTE: drawPortraitsを thisを保持しつつsub methodにしたい

		// portraitsのうちdrawnPortraitNum番目の画像をthis.$scope.aPortraitDrawSpeedミリ秒描画します。
		let fadeMillis: number       = this.$scope.aPortraitDrawSpeed / 4.0;
		let viewMillis: number       = this.$scope.aPortraitDrawSpeed - fadeMillis * 2.0;
		let drawnPortraitNum: number = 0;  // 描画済みの画像の数
		let drawPortraits: Function  = () => this.drawAPortrait(this.portraits[drawnPortraitNum++], fadeMillis, viewMillis);
		this.$scope.portraitAlt      = "endroll-portrait";
		this.$interval(drawPortraits, this.$scope.aPortraitDrawSpeed, this.portraits.length);
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
	private startRisingCreditLines() {
		$("#credits").css({
			  "margin-top" : -this.$window.innerHeight * 2.0
			, "color"      :  this.$scope.creditsTextColor
		});
		$("#credits").tvCredits({
			  height   : this.$window.innerHeight * 4.0
			, speed    : this.$scope.creditsRiseSpeed
			, complete : () => $("#credits").text("")
		});
	}
}
