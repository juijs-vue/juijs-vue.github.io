<template>
﻿<section>
	<h2>Default</h2>
	<p>
		Button provides a total of 3 styles including the basic type.
		The user can designate the button style when the button is pressed.
	</p>
	<!-- raw HTML gets an implicit <tbody> inserted around bare <tr> rows by the browser's parser;
	     Vue's template compiler doesn't do that correction (same class of issue as the <p><table>
	     nesting above), so it's made explicit here to match what production actually renders. -->
	<table>
		<tbody>
		<tr>
			<td width="150px">Button</td>
			<td width="300px">Class</td>
			<td width="350px">Description</td>
		</tr>
		<tr>
			<td>
				<a class="btn">Default</a>
			</td>
			<td>
				btn
			</td>
			<td>Default button</td>
		</tr>
		<tr>
			<td>
				<a class="btn focus">Focus</a>
			</td>
			<td>
				btn focus
			</td>
			<td>Focusing button</td>
		</tr>
		<tr>
			<td>
				<a class="btn" disabled>Disabled</a>
			</td>
			<td>
				btn disabled
			</td>
			<td>Disabled button</td>
		</tr>
		</tbody>
	</table>
</section>

<section>
	<h2>Size</h2>
	<p>
		4 sizes of buttons are available.
	</p>
	<!-- a <table> can't legally nest inside <p> (HTML5); raw HTML silently gets this auto-corrected
	     by the browser (the open <p> is implicitly closed before <table>), but Vue's template
	     compiler doesn't do that correction, so the source here is written pre-split to match
	     what the browser actually produces from the original markup. -->
	<table><tbody><tr><td>
		<!-- the two <a> tags are kept on one line, single space between (rather than newline-
		     separated), so Vue's compiler preserves that space as a real text node instead of
		     stripping it - matching the gap raw HTML renders from the original's newline-separated
		     markup (see the AutoComplete prefix-slot / input.html fix for the same pattern). -->
		<p>
			<a class="btn large focus">Large button</a> <a class="btn large">Large button</a>
		</p>
		<p>
			<a class="btn normal focus">Default button</a> <a class="btn normal">Default button</a>
		</p>
		<p>
			<a class="btn small focus">Small button</a> <a class="btn small">Small button</a>
		</p>
		<p>
			<a class="btn mini focus">Mini button</a> <a class="btn mini">Mini button</a>
		</p>
	</td></tr></tbody></table>
	<p></p>
</section>
</template>
