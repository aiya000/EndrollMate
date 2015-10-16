interface FontColorCSSType {
	color: string;
}

/**
 * NOTE: If you want to create other class extended CSS interface
 *      you should abstract part of this class
 */
class FontColorCSS implements CSS {
	/* --- --- --- public field --- --- --- */
	public color: string;

	/* --- --- --- public constructor --- --- --- */
	constructor(css: FontColorCSSType) {
		this.color = css.color;
	}

	/* --- --- --- public method --- --- --- */
	public supports(property: string, value?: string): boolean {
		const supportedAttributes: string[] = ["color"];

		let propertyExists: boolean = this.attrContains(supportedAttributes, property);
		let valueEquals:    boolean = value == undefined || this.color == value;
		return propertyExists && valueEquals;
	}

	/* --- --- --- private method --- --- --- */
	private attrContains(cssAttrs: string[], cssAttr: string) {
		return cssAttrs.indexOf(cssAttr) != -1;
	}
}
