/// <reference path="./FontCSSType.ts"/>


namespace Data.CSS {
	/**
	 * NOTE: If you want to create other class extended CSS interface
	 *      you should abstract part of this class
	 */
	export class FontCSS implements CSS {
		/* --- --- --- public field --- --- --- */
		/**
		 * cssのcolor属性を表します。
		 */
		public "color": string;

		/**
		 * cssのfont-size属性を表します。
		 */
		public "font-size": string;

		/* --- --- --- public constructor --- --- --- */
		constructor(css: FontCSSType) {
			this["color"]     = css["color"];
			this["font-size"] = css["font-size"] + "px";
		}

		/* --- --- --- public method --- --- --- */
		public supports(property: string, value?: string): boolean {
			const supportedAttributes: string[] = ["color", "font-size"];
			//TODO: use es6 method
			let propertyExists: boolean = this.attrContains(supportedAttributes, property);
			let valueEquals:    boolean = value == undefined || this[property] == value;
			return propertyExists && valueEquals;
		}

		/* --- --- --- private method --- --- --- */
		private attrContains(cssAttrs: string[], cssAttr: string) {
			return cssAttrs.indexOf(cssAttr) != -1;
		}
	}
}
