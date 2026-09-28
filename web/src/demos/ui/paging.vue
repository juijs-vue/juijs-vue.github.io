<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const page1 = ref(2)
const page2 = ref(2)
</script>

<template>
﻿<section>
	<h2>Default</h2>
	<p>
		The basic horizontal size of paging is 100%.
		So, if you want to limit the horizontal size, you need to specify it as follows.
		</p><Paging v-model="page1" :count="50" :page-count="10" :screen-count="5" style="width: 500px;" />
	<p></p>
	<br/><br/>

	<p>
		Paging provides the <strong>large</strong> option for a bigger size.
		</p><Paging v-model="page2" :count="1000" :page-count="10" :screen-count="7" size="large" style="width: 100%;" />
	<p></p>
</section>
</template>
