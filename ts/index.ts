/// <reference path="./typings/angularjs/angular.d.ts"/>
/// <reference path="./typings/jquery/jquery.d.ts"/>
/// <reference path="./typings/ng-file-upload/ng-file-upload.d.ts"/>
class BackgroundImageController {
	public bgImage: any;

	/**
	 * フォームで指定された画像を
	 * {width: 100%, height: 100%}で背景に設定します
	 */
	public fileSelect($files: FileList) : void {
		var file: Blob = <File>$files[0];
		var fileReader = new FileReader();
		fileReader.addEventListener("load", (e) => {
			$("#backgroundImage").attr("src", fileReader.result);
		});
		fileReader.readAsDataURL(file);
	}
}

let appEndrollMate = angular.module("appEndrollMate", ["ngFileUpload"]);
appEndrollMate.controller("BackgroundImageController", [BackgroundImageController]);
