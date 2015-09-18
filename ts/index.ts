/// <reference path="./typings/angularjs/angular.d.ts"/>
/// <reference path="./MainController.ts"/>
/// <reference path="./MainScope.ts"/>

let appEndrollMate = angular.module("appEndrollMate", ["ngFileUpload"]);
appEndrollMate.controller("MainController", ["$scope", "$interval", "$timeout", "$q", MainController]);
