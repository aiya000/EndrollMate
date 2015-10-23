namespace Data.CSS {
	/**
	 * @classdesc (interface) Fontに関するCSSを表します
	 */
	export interface FontCSSType {
		/**
		 * cssのcolor属性を表します。
		 */
		"color": string;
		/**
		 * cssのfont-size属性を表します。
		 * ただしこのプロパティには数値を設定してください。
		 * pxサイズとして表されます。
		 */
		"font-size": number;
	}
}
