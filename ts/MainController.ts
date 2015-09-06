/// <reference path="./typings/jquery/jquery.d.ts"/>
/// <reference path="./typings/ng-file-upload/ng-file-upload.d.ts"/>
/// <reference path="./MainScope.ts"/>
/// <reference path="./Maybe.ts"/>

/**
 * @classdesc DocumentRoot/index.html <body>配下のコントロール
 */
class MainController {
	/* --- --- --- private const field --- --- --- */
	/**
	 * エンドロール中の1つの画像の描画にかけるミリ秒。
	 * これはフェードインとフェードアウトにかける時間を含みます。
	 */
	private DRAW_MILLI_SEC: number = 4000;

	/* --- --- --- private field --- --- --- */
	/**
	 * エンドロールで下から上へ流れる行のリスト
	 */
	private rollLines: string[];

	/**
	 * エンドロール中にフェードインアウトを
	 * 繰り返して描画される画像のリスト
	 */
	private portraits: FileList;

	/**
	 * TODO: 書く
	 */
	private endrollStarted: boolean = false;

	/* --- --- --- public constructor --- --- --- */
	/**
	 * 使用するAngularJSのオブジェクトを受け取ります
	 * @constructor
	 */
	constructor( private $scope: MainScope
	           , private $interval: ng.IIntervalService) {}

	/* --- --- --- public method --- --- --- */
	/**
	 * フォームで指定された画像をbodyの背景に設定します
	 * @param {FileList} $files 選択した1つの画像ファイル
	 */
	public setBackgroundImage($files: FileList) : void {
		let file: File = $files[0];
		let fileReader = new FileReader();
		let setBgImage: EventListener = e => $("body").css("background-image", "url(" + fileReader.result + ")");
		fileReader.addEventListener("load", setBgImage);
		fileReader.readAsDataURL(file);
	}


	/**
	 * エンドロールに使用するテキストファイルを設定します
	 * @param {FileList} $files エンドロールに使用する1つのテキストファイル
	 */
	public setRollText($files: FileList) : void {
		let file: File = $files[0];
		let fileReader = new FileReader();
		let setRollLines: EventListener = e => {
			this.rollLines = fileReader.result.split("\n");
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
		} else if (this.endrollStarted) {
			alert("endroll has already started");
			return;
		}
		this.startDrawingPortraits();
	}


	/* --- --- --- private method --- --- --- */
	/**
	 * エンドロールの開始条件が整っているかを検査します。
	 * 各inputフォームが検査されます。
	 * @return {Maybe.Data<string>} 無効な状態があればMaybeで包まれたエラーメッセージ,もしくはnothing
	 */
	private findInvalidStatus() : Maybe.Data<string> {
		//TODO: check image of body background
		if (this.rollLines == null) {
			return Maybe.just("the text was not selected");
		} else if (this.portraits == null) {
			return Maybe.just("the portraits were not selected");
		}
		return Maybe.nothing;
	}

	/**
	 * setPortraits(FileList)で選択した全ての画像を描画します。
	 * 画像の描画には強調効果としてフェードイン, フェードアウトが使用されます。
	 */
	private startDrawingPortraits() : void {
		//TODO: assert this.portraits == null
		//TODO: drawPortraitsを thisを保持しつつsubroutineにしたい

		// portraitsのうちdrawnPortraitNum番目の画像をDRAW_MILLI_SECミリ秒描画します。
		let fadeMillis: number       = this.DRAW_MILLI_SEC / 4.0;
		let viewMillis: number       = this.DRAW_MILLI_SEC - fadeMillis * 2.0;
		let drawnPortraitNum: number = 0;
		let drawPortraits = () => {
			let portrait: File  = this.portraits[drawnPortraitNum++];
			this.drawAPortrait(portrait, fadeMillis, viewMillis);
			let endrollFinished = drawnPortraitNum == this.portraits.length;
			if (endrollFinished) {
				this.$interval.cancel(undefined);
				this.$scope.endMessage = "Endroll Finished";
			}
		}
		this.$scope.portraitAlt = "endroll-portrait";
		this.$interval(drawPortraits, this.DRAW_MILLI_SEC, this.portraits.length);
	}

	/**
	 * TODO: 書く
	 * @param {File} foo
	 * @param {number} bar
	 * @param {number} baz
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
}