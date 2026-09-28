<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const dd1 = ref(true)
const dd2 = ref(true)
const dd3 = ref(true)
const dd4 = ref(true)
</script>

<template>
﻿<section>
	<h2>Default</h2>
	<p>
		Dropdown provides 2 colors and 2 sizes. In addition, it is possible to add a speech balloon like the third dropdown below.
		An option to change the rounded shape of a speech balloon in a rectangular shape is also provided.
	</p>

	<Dropdown v-model="dd1" size="normal" :width="150">
		<li><i class="icon-refresh"></i> Combo Box1</li>
		<li class="divider"></li>
		<li>Combo Box2</li>
		<li>Combo Box3</li>
		<li>Combo Box4</li>
	</Dropdown>

	<Dropdown v-model="dd2" size="large" :width="150" anchor style="left: 330px;">
		<li><i class="icon-refresh"></i> Combo Box1</li>
		<li class="divider"></li>
		<li>Combo Box2</li>
		<li>Combo Box3</li>
		<li>Combo Box4</li>
	</Dropdown>

	<div style="height: 150px;"></div>
</section>

<section>
	<h2>Sub-Dropdown</h2>
	<p>
		Dropdown supports a sub-dropdown, and the location where a dropdown is shown can be changed.
	</p>

	<Dropdown v-model="dd3" size="normal" :width="150">
		<li><a href="#">Today</a></li>
		<li class="divider"></li>
		<li><a href="#">Yesterday</a></li>
		<li class="divider"></li>
		<li><a href="#">Last 7 day</a></li>
		<li class="divider"></li>
		<li><a href="#">Calendar</a></li>
		<li class="divider"></li>
		<li class="submenu">
            <a href="#">More options</a>
            <ul style="width: 150px">
				<li>Second level link</li>
				<li>Second level link</li>
				<li>Second level link</li>
				<li>Second level link</li>
				<li>Second level link</li>
            </ul>
		</li>
	</Dropdown>

	<Dropdown v-model="dd4" size="large" :width="150" dropup style="left: 330px;">
		<li><a href="#">Today</a></li>
		<li class="divider"></li>
		<li><a href="#">Yesterday</a></li>
		<li class="divider"></li>
		<li><a href="#">Last 7 day</a></li>
		<li class="divider"></li>
		<li><a href="#">Calendar</a></li>
		<li class="divider"></li>
		<li class="submenu left">
            <a href="#">More options</a>
            <ul style="width: 150px">
				<li>Second level link</li>
				<li>Second level link</li>
				<li>Second level link</li>
				<li>Second level link</li>
				<li>Second level link</li>
            </ul>
		</li>
	</Dropdown>
</section>
</template>
