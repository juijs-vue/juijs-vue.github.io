<script setup lang="ts">
// @ts-nocheck
import { reactive, ref } from "vue"

const LOREM = "The style components provide various options in addition to the basic functionality. In addition, script components can be added, which facilitate the development of more diverse UI components."

const items = [
    { title: "Group Item #1", value: "a", text: LOREM },
    { title: "Group Item #2", value: "b", text: LOREM },
    { title: "Group Item #3", value: "c", text: LOREM }
]

const open1 = ref(0)
const open2 = ref(0)
const open3 = ref(0)
const open4 = ref(0)

const icons1 = reactive(["icon-arrow3", "icon-arrow1", "icon-arrow1"])
const icons2 = reactive(["icon-arrow3", "icon-arrow1", "icon-arrow1"])

function onOpen1(index) {
    icons1[0] = "icon-arrow1"
    icons1[1] = "icon-arrow1"
    icons1[2] = "icon-arrow1"
    icons1[index] = "icon-arrow3"
}

function onOpen2(index) {
    icons2[0] = "icon-arrow1"
    icons2[1] = "icon-arrow1"
    icons2[2] = "icon-arrow1"
    icons2[index] = "icon-arrow3"
}
</script>

<template>
﻿<section>
    <h2>Classic</h2>
    <p>
        The default style of accordion component.
    </p>

    <div class="row">
        <div class="col col-5">
            <h3>Default Size</h3>

            <p>
                <Accordion v-model="open1" :items="items">
                    <template v-for="item in items" :key="item.value" #[`content-${item.value}`]>
                        {{ item.text }}
                    </template>
                    <template #icon="{ index }"><i :class="icons1[index]"></i></template>
                </Accordion>
            </p>
        </div>
        <div class="col col-1"></div>
        <div class="col col-6">
            <h3>Large Size</h3>

            <p>
                <Accordion v-model="open2" :items="items" size="large" @open="onOpen2">
                    <template v-for="item in items" :key="item.value" #[`content-${item.value}`]>
                        {{ item.text }}
                    </template>
                    <template #icon="{ index }"><i :class="icons2[index]"></i></template>
                </Accordion>
            </p>
        </div>
    </div>
</section>

<section>
    <h2>Simple</h2>
    <p>
        The accordion style that can be easily combined with other components.
    </p>

    <div class="row">
        <div class="col col-5">
            <h3>Default Size</h3>

            <p>
                <Accordion v-model="open3" :items="items" variant="simple">
                    <template v-for="item in items" :key="item.value" #[`content-${item.value}`]>
                        {{ item.text }}
                    </template>
                </Accordion>
            </p>
        </div>
        <div class="col col-1"></div>
        <div class="col col-6">
            <h3>Large Size</h3>

            <p>
                <Accordion v-model="open4" :items="items" variant="simple" size="large">
                    <template v-for="item in items" :key="item.value" #[`content-${item.value}`]>
                        {{ item.text }}
                    </template>
                </Accordion>
            </p>
        </div>
    </div>
</section>
</template>
