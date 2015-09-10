/// <reference path="../jquery/jquery.d.ts" />

interface ITvCreditsOptions {
	direction?: string;
	complete?: Function;
	speed?: number;
	height?: number;
}

interface JQuery {
	tvCredits(options: ITvCreditsOptions): any;
}
