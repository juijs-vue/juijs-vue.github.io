<template>
<div class="jui-grid-vue-root theme-classic">
﻿<section>
	<h2>classic</h2>
	<p>
		Basic table style
	</p>
	<table class="table classic hover" style="width: 100%">
		<thead>
			<tr>
				<th>A</th><th>B</th><th>C</th><th>D</th><th>E</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
		</tbody>
	</table>
</section>

<section>
	<h2>simple</h2>
	<p>
		A table style with a simple shape.
	</p>
	<table class="table simple hover" style="width: 100%">
		<thead>
			<tr>
				<th>A</th><th>B</th><th>C</th><th>D</th><th>E</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
		</tbody>
	</table>
</section>

<section>
	<h2>expand</h2>
	<p>
		A table style that provides an extended area.
	</p>
	<table class="table expand hover" style="width: 100%">
		<thead>
			<tr>
				<th style="width: 30px">&nbsp;</th>
				<th>A</th><th>B</th><th>C</th><th>D</th><th>E</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><i class="icon-left"></i></td>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr class="open">
				<td><i class="icon-right"></i></td>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr class="expand">
				<td colspan="6">ABCDE</td>
			</tr>
			<tr>
				<td><i class="icon-left"></i></td>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
		</tbody>
	</table>
</section>

<section>
	<h2>Inner table</h2>
	<p>
		A table style that provides an extended area.
	</p>
	<table class="table expand" style="width: 100%">
		<thead>
			<tr>
				<th style="width: 30px">&nbsp;</th>
				<th>A</th><th>B</th><th>C</th><th>D</th><th>E</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><i class="icon-left"></i></td>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr class="open">
				<td><i class="icon-right"></i></td>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr class="content">
				<td colspan="6">

					<div>
						<table class="table classic border small" style="width: 100%">
							<thead>
								<tr>
									<th>A</th><th>B</th><th>C</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>A</td><td>B</td><td>C</td>
								</tr>
								<tr>
									<td>A</td><td>B</td><td>C</td>
								</tr>
							</tbody>
						</table>
						<br/>

						<table class="table simple small" style="width: 100%">
							<thead>
								<tr>
									<th>A</th><th>B</th><th>C</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>A</td><td>B</td><td>C</td>
								</tr>
								<tr>
									<td>A</td><td>B</td><td>C</td>
								</tr>
							</tbody>
						</table>
						<br/>

						<table class="table expand small" style="width: 100%">
							<thead>
								<tr>
									<th>A</th><th>B</th><th>C</th>
								</tr>
							</thead>
							<tbody>
								<tr class="content">
									<td colspan="3">ABCDE</td>
								</tr>
								<tr>
									<td>A</td><td>B</td><td>C</td>
								</tr>
							</tbody>
						</table>
					</div>

				</td>
			</tr>
			<tr>
				<td><i class="icon-left"></i></td>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
		</tbody>
	</table>
</section>

<section>
	<h2>small</h2>
	<p>
		The smallest size of table.
	</p>
	<table class="table classic small" style="width: 100%">
		<thead>
			<tr>
				<th>A</th><th>B</th><th>C</th><th>D</th><th>E</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
		</tbody>
	</table>
</section>

<section>
	<h2>normal</h2>
	<p>
		The basic table size. The class concerned may be skipped.
	</p>
	<table class="table simple normal" style="width: 100%">
		<thead>
			<tr>
				<th>A</th><th>B</th><th>C</th><th>D</th><th>E</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
		</tbody>
	</table>
</section>

<section>
	<h2>large</h2>
	<p>
		The largest size of table.
	</p>
	<table class="table expand large" style="width: 100%">
		<thead>
			<tr>
				<th>A</th><th>B</th><th>C</th><th>D</th><th>E</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
		</tbody>
	</table>
</section>

<section>
	<h2>border</h2>
	<p>
		Drawsa divider line between columns.
	</p>
	<table class="table classic border" style="width: 100%">
		<thead>
			<tr>
				<th>A</th><th>B</th><th>C</th><th>D</th><th>E</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
		</tbody>
	</table>
</section>

<section>
	<h2>borderless</h2>
	<p>
		Removes the divider line between columns.
	</p>
	<table class="table classic borderless" style="width: 100%">
		<thead>
			<tr>
				<th>A</th><th>B</th><th>C</th><th>D</th><th>E</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
		</tbody>
	</table>

	<h2>stripe</h2>
	<p>
		Gives a background to odd rows.
	</p>
	<table class="table classic stripe" style="width: 100%">
		<thead>
			<tr>
				<th>A</th><th>B</th><th>C</th><th>D</th><th>E</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
		</tbody>
	</table>
</section>

<section>
	<h2>stripeless</h2>
	<p>
		Removes the background from odd rows.
	</p>
	<table class="table classic stripeless" style="width: 100%">
		<thead>
			<tr>
				<th>A</th><th>B</th><th>C</th><th>D</th><th>E</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
			<tr>
				<td>A</td><td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
		</tbody>
	</table>
</section>

<section>
	<h2>Edit cell</h2>
	<p>
		Style that can be used when modifying the value of a specific cell.
	</p>
	<table class="table classic stripeless">
		<thead>
			<tr>
				<th>A</th><th>B</th><th>C</th><th>D</th><th>E</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><input type="text" class="edit" value="A" style="width: 100%;" /></td>
				<td>B</td><td>C</td><td>D</td><td>E</td>
			</tr>
		</tbody>
	</table>
</section>
</div>
</template>
