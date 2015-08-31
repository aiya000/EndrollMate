/// <reference path="./typings/angularjs/angular.d.ts"/>
/// <reference path="./typings/jquery/jquery.d.ts"/>
/// <reference path="./typings/ng-file-upload/ng-file-upload.d.ts"/>
class BackgroundImageController {
	public upload:  ng.angularFileUpload.IFileUploadConfig;
	public bgImage: any;

	/**
	 * @param このクラスで使用するng.IHttpServiceオブジェクトを設定します
	 */
	constructor($upload: ng.angularFileUpload.IFileUploadConfig) {
		this.upload = $upload;
	}

	public fileSelect($files: FileList) : void {
		console.log("foo");
	}
}

let appEndrollMate = angular.module("appEndrollMate", []);
appEndrollMate.controller("BackgroundImageController", [BackgroundImageController]);
