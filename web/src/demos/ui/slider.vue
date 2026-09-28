<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const from = ref(5)
</script>

<template>
﻿<section>
	<h2>Single</h2>
	<p>
		Single controls a slider style.
	</p>
	<Slider v-model:from="from" :min="0" :max="10" :step="1" :tooltip="false" />
</section>

<section>
	<h2>Double</h2>
	<p>
		Double controls a slider style.
	</p>
	<Slider type="double" :from="5" :to="7" :min="0" :max="10" :step="1" :tooltip="false" />
</section>

<section>
	<h2>Vertical</h2>
	<p>
		The vertical slider style. The controls are the same as above.
	</p>
	<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0;">
		<div style="height: 200px;">
			<Slider orient="vertical" :from="5" :min="0" :max="10" :step="1" :tooltip="false" />
		</div>
		<div style="height: 200px;">
			<Slider type="double" orient="vertical" :from="5" :to="7" :min="0" :max="10" :step="1" :tooltip="false" />
		</div>
	</div>
</section>
</template>
