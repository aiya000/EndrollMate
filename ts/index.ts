/// <reference path="./typings/angularjs/angular.d.ts"/>
/// <reference path="./MainController.ts"/>

let appEndrollMate = angular.module("appEndrollMate", ["ngFileUpload"]);
appEndrollMate.controller("MainController", ["$interval", MainController]);
