TV Credits
=========

TV Credits is a jQuery plugin that works as a vertical and horizontal scroll. Vertical for a TV Credits like scroll and also works as a horizontal ticker.

# Download
<a href="https://github.com/rosantoz/tvcredits" target="_blank">https://github.com/rosantoz/tvcredits</a>

# Usage

Just include the plugin in our site:

```
<script src="tvcredits.jquery.js"></script>
``` 
or 
```
<script src="tvcredits.jquery.min.js"</script>
```

**Your HTML code:**
```
<div id="credits">
	<ul>
		<li>Lorene Nichols</li>
		<li>Ed Figueroa</li>
		<li>Sue Klein</li>
		<li>Sharon Warren</li>
		<li>Marta Maldonado</li>
		<li>Manuel Flowers</li>
		<li>Lila Chambers</li>
		<li>Yolanda Haynes</li>
		<li>Alfonso Lynch</li>
		<li>Janie Reese</li>
	</ul>
</div> 
```
**And then:**
```
$("#credits").tvCredits();
```

# Options

```
$("#credtis").tvCredits({
    direction: 'up', // 'up' or 'left'. Default: 'up'
    complete : function () {}, // Callback function called at the end of each loop
    speed    : 25000, // Animation speed in miliseconds. Default: 25000
    height   : 350, // Container height. Default: 350px
});
```
# Demo
<a href="http://jsfiddle.net/rosantoz/h57G2/1/" target="_blank">http://jsfiddle.net/rosantoz/h57G2/1/</a> 
