<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const value1 = ref(30)
const value2 = ref(40)
const value3 = ref(50)
const value4 = ref(60)
</script>

<template>
﻿<section>
	<h2>Default</h2>
	<p>
		The basic style of the progress bar.
	</p>
	<Progress v-model="value1" />
</section>

<section>
	<h2>Simple</h2>
	<p>
		The progress bar does not have borders.
	</p>
	<Progress v-model="value2" variant="simple" />
</section>

<section>
	<h2>Simple + Flat</h2>
	<p>
		The progress bar of the rectangular form.
	</p>
	<Progress v-model="value3" variant="simple flat" />
</section>

<section>
	<h2>Striped + Animated</h2>
	<p>
		Add animation effects to stripes style.
	</p>
	<Progress v-model="value4" striped animated />
</section>
</template>
