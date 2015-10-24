namespace Data.CSS {
	/**
	 * {#credits p}のng-styleにインスタンスをバインドしてください。
	 * @classdesc (interface) index.htmlの{#credits p}に対するCSSを表します
	 */
	export interface ACreditCSS {
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
