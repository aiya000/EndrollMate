/// <reference path="./typings/angularjs/angular.d.ts"/>
/**
 * 独自定義の例外を格納します。
 * @namespace
 */
var Exceptions;
(function (Exceptions) {
    /**
     * @classdesc メソッドの引数以外が原因で処理が無効になった場合に投げられます
     */
    var InvalidOperationError = (function () {
        function InvalidOperationError(message) {
            this.name = "InvalidOperationError";
        }
        return InvalidOperationError;
    })();
    Exceptions.InvalidOperationError = InvalidOperationError;
})(Exceptions || (Exceptions = {}));
// thanks http://d.hatena.ne.jp/m-hiyama/20150325/1427260591
/// <reference path="./InvalidOperationError.ts"/>
var InvalidOperationError = Exceptions.InvalidOperationError;
/**
 * Maybeを表す型と値を格納します。
 * @namespace
 */
var Maybe;
(function (Maybe) {
    /**
     * 「データを持っているかもしれないし持っていないかもしれない」ことを表します。
     *
     * コンストラクタに値を引数として与えた場合は
     * 「データを持っている」とされ、そのインスタンスは「Just値」と表現されます。
     *
     * コンストラクタに値を引数として与えなかった場合は
     * 「データを持っていない」とされ、そのインスタンスは「Nothing値」と表現されます。
     *
     * Memo: このクラスはモナド法則を満たしません。
     * @classdesc MaybeのJust値またはNothing値を表します
     */
    var Data = (function () {
        /**
         * @constructor
         * @param {T} value? Just値としてData<T>インスタンス内部に持たせたい任意の型の値
         */
        function Data(value) {
            this.value = value;
        }
        /**
         * もしインスタンスがJust値であれば(Nothing値でなければ)
         * インスタンスが格納する値を返し、
         * もしインスタンスがNothing値であれば(Just値でなければ)
         * InvalidOperationErrorを投げます。
         * @return Just値が持つ値
         * @throws {InvalidOperationError} thisがJust値ではありません
         */
        Data.prototype.getValue = function () {
            if (this.value == null) {
                throw new InvalidOperationError("thisがJust値ではありません、このメソッドはインスタンスがJust値である時のみ使用することができます。");
            }
            return this.value;
        };
        /**
         * @return {boolean} Maybe.Data<T>がJust値であるかを返します
         */
        Data.prototype.hasValue = function () {
            return this.value != null;
        };
        return Data;
    })();
    Maybe.Data = Data;
    /**
     * Data<T>クラスのNothing値を表します。
     * @example
     * if (foo == null) { return Maybe.nothing; }
     * else { return Maybe.just(foo); }
     */
    Maybe.nothing = new Data();
    /**
     * Data<T>クラスのJust値を生成します。
     * @example
     * if (foo == null) { return Maybe.nothing; }
     * else { return Maybe.just(foo); }
     */
    function just(x) {
        return new Data(x);
    }
    Maybe.just = just;
})(Maybe || (Maybe = {}));
/// <reference path="./typings/jquery/jquery.d.ts"/>
/// <reference path="./typings/jquery.tvcredits/jquery.tvcredits.d.ts"/>
/// <reference path="./typings/ng-file-upload/ng-file-upload.d.ts"/>
/// <reference path="./MainScope.ts"/>
/// <reference path="./Maybe.ts"/>
/**
 * @classdesc DocumentRoot/index.html <body>配下のコントロール
 */
var MainController = (function () {
    /* --- --- --- public constructor --- --- --- */
    /**
     * 使用するAngularJSのオブジェクトを受け取ります
     * @constructor
     */
    function MainController($scope, $interval, $window) {
        /* --- --- --- private const field --- --- --- */
        /**
         * エンドロール中の1つの画像の描画にかけるミリ秒。
         * これはフェードインとフェードアウトにかける時間を含みます。
         */
        this.DRAW_MILLI_SEC = 4000;
        /**
         * TODO: 書く
         */
        this.RISE_SPEED = 100000;
        /**
         * TODO: 書く
         */
        this.endrollStarted = false;
        this.$scope = $scope;
        this.$interval = $interval;
        this.$window = $window;
        this.$scope.endrollStarted = true;
    }
    /* --- --- --- public method --- --- --- */
    /**
     * フォームで指定された画像をbodyの背景に設定します
     * @param {FileList} $files 選択した1つの画像ファイル
     */
    MainController.prototype.setBackgroundImage = function ($files) {
        var file = $files[0];
        var fileReader = new FileReader();
        var setBgImage = function (e) { return $("body").css("background-image", "url(" + fileReader.result + ")"); };
        fileReader.addEventListener("load", setBgImage);
        fileReader.readAsDataURL(file);
    };
    /**
     * エンドロールに使用するテキストファイルを設定します
     * @param {FileList} $files エンドロールに使用する1つのテキストファイル
     */
    MainController.prototype.setRollText = function ($files) {
        var _this = this;
        var file = $files[0];
        var fileReader = new FileReader();
        var setRollLines = function (e) {
            _this.creditLines = fileReader.result.split("\n");
        };
        fileReader.addEventListener("load", setRollLines);
        fileReader.readAsText(file);
    };
    /**
     * エンドロール中に描画される画像のリストを設定します
     * @param {FileList} $files エンドロール中に描画される画像のリスト
     */
    MainController.prototype.setPortraits = function ($files) {
        this.portraits = $files;
    };
    /**
     * フォームで設定した項目を元にエンドロールを開始します。
     * フォームで未設定な項目がある場合はアラートを出力し、終了します。
     */
    MainController.prototype.startEndRoll = function () {
        var invalidState = this.findInvalidStatus();
        if (invalidState.hasValue()) {
            alert(invalidState.getValue());
            return;
        }
        else if (this.endrollStarted) {
            alert("endroll has already started");
            return;
        }
        this.startDrawingPortraits();
        this.startRisingCreditLines();
    };
    /* --- --- --- private method --- --- --- */
    /**
     * エンドロールの開始条件が整っているかを検査します。
     * 各inputフォームが検査されます。
     * @return {Maybe.Data<string>} 無効な状態があればMaybeで包まれたエラーメッセージ,もしくはnothing
     */
    MainController.prototype.findInvalidStatus = function () {
        //TODO: check image of body background
        if (this.creditLines == null) {
            return Maybe.just("the text was not selected");
        }
        else if (this.portraits == null) {
            return Maybe.just("the portraits were not selected");
        }
        return Maybe.nothing;
    };
    /**
     * setPortraits(FileList)で選択した全ての画像を描画します。
     * 画像の描画には強調効果としてフェードイン, フェードアウトが使用されます。
     */
    MainController.prototype.startDrawingPortraits = function () {
        //TODO: assert this.portraits == null
        //TODO: drawPortraitsを thisを保持しつつsubroutineにしたい
        var _this = this;
        this.$scope.endrollStarted = false;
        // portraitsのうちdrawnPortraitNum番目の画像をDRAW_MILLI_SECミリ秒描画します。
        var fadeMillis = this.DRAW_MILLI_SEC / 4.0;
        var viewMillis = this.DRAW_MILLI_SEC - fadeMillis * 2.0;
        var drawnPortraitNum = 0;
        var drawPortraits = function () { return _this.drawAPortrait(_this.portraits[drawnPortraitNum++], fadeMillis, viewMillis); };
        this.$scope.portraitAlt = "endroll-portrait";
        //this.$interval(drawPortraits, this.DRAW_MILLI_SEC);
        this.$interval(drawPortraits, this.DRAW_MILLI_SEC, this.portraits.length);
        //TODO: when endroll finished, do notify by some method
        //this.$scope.endMessage = "Endroll Finished";
    };
    /**
     * TODO: 書く
     * @param {File} foo
     * @param {number} bar
     * @param {number} baz
     */
    MainController.prototype.drawAPortrait = function (portrait, fadeMillis, viewMillis) {
        var _this = this;
        var fileReader = new FileReader();
        var drawPortraits = function (e) {
            _this.$scope.portraitSrc = fileReader.result;
            $("#portrait").fadeIn(fadeMillis, function () {
                $("#portrait").delay(viewMillis).fadeOut(fadeMillis);
            });
        };
        fileReader.addEventListener("load", drawPortraits);
        fileReader.readAsDataURL(portrait);
    };
    /**
     * TODO: 書く
     */
    MainController.prototype.startRisingCreditLines = function () {
        //let creditItems = this.creditLines
        //                      .map((x,i) => "<li>" + x + "</li>")
        //                      .join("");
        //this.$scope.creditLines = "<ul>" + creditItems + "</ul>";
        $("#credits").css("margin-top", -this.$window.innerHeight * 2.0);
        $("#credits").tvCredits({
            height: this.$window.innerHeight * 4.0,
            speed: this.RISE_SPEED,
            complete: function () { return $("#credits").text(""); }
        });
    };
    return MainController;
})();
/// <reference path="./typings/angularjs/angular.d.ts"/>
/// <reference path="./MainController.ts"/>
/// <reference path="./MainScope.ts"/>
var appEndrollMate = angular.module("appEndrollMate", ["ngFileUpload"]);
appEndrollMate.controller("MainController", ["$scope", "$interval", "$window", MainController]);
