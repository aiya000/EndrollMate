/// <reference path="./typings/angularjs/angular.d.ts"/>
/// <reference path="./typings/jquery/jquery.d.ts"/>
/// <reference path="./typings/ng-file-upload/ng-file-upload.d.ts"/>
class BackgroundImageController {
	public bgImage: any;

	/**
	 * フォームで指定された画像をbodyの背景に設定します
	 * @param FileAPI(<input type="file"/>)で選択した1つのファイル
	 */
	public fileSelect($files: FileList) : void {
		var file: Blob = <File>$files[0];
		var fileReader = new FileReader();
		fileReader.addEventListener("load", (e) => {
			var fileUrl: string = "url(" + fileReader.result + ")";
			$("body").css("background-image", fileUrl);
		});
		fileReader.readAsDataURL(file);
	}
}

let appEndrollMate = angular.module("appEndrollMate", ["ngFileUpload"]);
appEndrollMate.controller("BackgroundImageController", [BackgroundImageController]);
