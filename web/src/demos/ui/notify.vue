<script setup lang="ts">
// @ts-nocheck
import { ref } from "vue"

const notifyRef = ref(null)

function addNotification(color) {
    if (notifyRef.value) {
        notifyRef.value.add({
            title: "Notification message!!!",
            message: "Feb 15, 2013-12-24 02:24:19",
            color: color
        })
    }
}
</script>

<template>
﻿<section>
    <h2>Default</h2>
    <p>
        Notify is comprised of a title and message icon. A close button can be optionally added.
    </p>
    <div class="notify">
        <div class="title">Notification message!!!</div>
        <div class="message">Feb 15, 2013-12-24 02:24:19</div>
    </div>
    <p></p>
</section>

<section>
    <h2>Colors</h2>
    <p>
        For Notify, 4 colors are available.
    </p>
    <div class="row">
        <div class="col col-6">
            <div class="notify success">
                <div class="message">Feb 15, 2013-12-24 02:24:19</div>
            </div>
        </div>
        <div class="col col-6">
            <div class="notify info">
                <div class="message">Feb 15, 2013-12-24 02:24:19</div>
            </div>
        </div>
    </div>
    <div class="row" style="margin-top: 3px;">
        <div class="col col-6">
            <div class="notify warning">
                <div class="message">Feb 15, 2013-12-24 02:24:19</div>
            </div>
        </div>
        <div class="col col-6">
            <div class="notify danger">
                <div class="message">Feb 15, 2013-12-24 02:24:19</div>
            </div>
        </div>
    </div>
    <p></p>
</section>

<section>
    <h2>Close &amp; Icon</h2>
    <p>
        Notify can optionally use a close button and icon(s).
    </p>
    <div class="row">
        <div class="col col-6">
            <div class="notify success">
                <div class="title">Notification message!!!</div>
                <div class="message">Feb 15, 2013-12-24 02:24:19</div>
                <a href="#" class="close"><i class="icon-exit"></i></a>
            </div>
        </div>
        <div class="col col-6">
            <div class="notify info">
                <div class="image"><i class="icon-caution" style="font-size: 18px;"></i></div>
                <div class="title">Notification message!!!</div>
                <div class="message">Feb 15, 2013-12-24 02:24:19</div>
                <a href="#" class="close"><i class="icon-exit"></i></a>
            </div>
        </div>
    </div>
    <p></p>
</section>
</template>
