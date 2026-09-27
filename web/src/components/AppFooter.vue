<script setup lang="ts">
import { onMounted } from "vue"
import { useLang } from "../composables/useLang"

const { changeLanguage } = useLang()
const base = import.meta.env.BASE_URL

function goAbout() {
    location.href = `${base}?p=about`
}

function openExternal(url: string) {
    window.open(url)
}

// Facebook SDK loader, ported verbatim from doc/footer.html's inline <script>.
onMounted(() => {
    if (document.getElementById("facebook-jssdk")) return
    const js = document.createElement("script")
    js.id = "facebook-jssdk"
    js.src = "//connect.facebook.net/ko_KR/all.js#xfbml=1&appId=672755082759473"
    document.body.appendChild(js)
})
</script>

<template>
    <nav class="navbar fixed top bg-sub">
        <div class="center">
            <div class="bs-social">
                <ul class="bs-social-buttons">
                    <li>
                        <iframe
                            class="github-btn"
                            src="http://ghbtns.com/github-btn.html?user=juijs&repo=jui&type=watch&count=true"
                            width="90"
                            height="20"
                            title="Star on GitHub"
                        ></iframe>
                        <iframe
                            class="github-btn"
                            src="http://ghbtns.com/github-btn.html?user=juijs&repo=jui&type=fork&count=true"
                            width="90"
                            height="20"
                            title="Fork on GitHub"
                        ></iframe>
                    </li>
                    <li>
                        <iframe
                            name="f22d8200d8"
                            width="1000px"
                            height="1000px"
                            frameborder="0"
                            allowtransparency="true"
                            scrolling="no"
                            title="fb:like Facebook Social Plugin"
                            src="http://www.facebook.com/plugins/like.php?action=like&app_id=672755082759473&channel=http%3A%2F%2Fstatic.ak.facebook.com%2Fconnect%2Fxd_arbiter%2FwTH8U0osOYl.js%3Fversion%3D40%23cb%3Df3fcf03b1c%26domain%3Ddoc.youngman.kr%26origin%3Dhttp%253A%252F%252Fdoc.youngman.kr%252Ff2b96437fc%26relation%3Dparent.parent&href=http%3A%2F%2Fseogi1004.github.io%2Fjui%2Fdoc%2Findex.html&layout=button&locale=ko_KR&sdk=joey&share=true&show_faces=true"
                            style="border: none; visibility: visible; width: 124px; height: 20px"
                        ></iframe>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <footer class="navbar fixed bottom" style="position: relative">
        <div class="center row">
            <div class="col col-8 msg">
                JUI Framework is an open source project, anyone can join.<br />
                Designer <a href="mailto:yoha@jennifersoft.com">Yoha</a> and programmer
                <a href="mailto:seogi777@gmail.com">Alvin</a> and <a href="mailto:cyberuls@gmail.com">Jayden</a>
                together developed the UI Framework.
            </div>
            <div class="col col-4 link">
                <span @click="goAbout">ABOUT US</span> |
                <span @click="openExternal('https://github.com/juijs-vue/')">GitHub</span> |
                <span @click="openExternal('http://blog.jui.io')">Blog</span> |
                <span @click="openExternal('http://store.jui.io')">Store</span> |
                <span @click="openExternal('https://www.facebook.com/groups/815675585191885/')">Facebook</span>
            </div>
        </div>

        <div class="center line"></div>

        <div class="center">
            <div class="col col-8 msg">
                Code licensed under MIT License.<br />
                Copyright © 2016 JenniferSoft Inc. All rights reserved.
            </div>
            <div class="col col-4 link">
                <strong>Supported languages:</strong>
                <span @click="changeLanguage('en')">English</span> |
                <span @click="changeLanguage('ko')">Korean</span>
            </div>
        </div>
    </footer>

    <div id="fb-root"></div>
</template>
