<script setup lang="ts">
import HomeBanner from "../../components/HomeBanner.vue"
import { useTitle } from "../../composables/useTitle"

useTitle("JUI Vue: A Vue 3 UI framework with rich components, SVG charts and a fast grid.")
</script>

<template>
    <HomeBanner />

    <article>
        <div class="center row">
            <div class="col col-12 home">
                <section>
                    <div class="row">
                        <div class="col col-4">
                            <div class="title">
                                <div class="img img-col-1 icon"></div><br />
                                <div class="img img-col-1-msg"></div>
                            </div>
                            <p>
                                The library is built with Vue 3 and TypeScript for development convenience. LESS
                                is used for styles in order to facilitate the reuse and scalability of code.
                            </p>
                        </div>
                        <div class="col col-4">
                            <div class="title">
                                <div class="img img-col-2 icon"></div><br />
                                <div class="img img-col-2-msg"></div>
                            </div>
                            <p>
                                It provides a rich set of UI components covering both styling and interactive
                                behavior. More components continue to be added as the library evolves.
                            </p>
                        </div>
                        <div class="col col-4">
                            <div class="title">
                                <div class="img img-col-3 icon"></div><br />
                                <div class="img img-col-3-msg"></div>
                            </div>
                            <p>
                                The style components provide various options in addition to the basic functionality.
                                In addition, script components can be added, which facilitate the development of more
                                diverse UI components.
                            </p>
                        </div>
                    </div>
                    <div class="row row-line">&nbsp;</div>
                    <div class="row">
                        <div class="col col-4">
                            <div class="title">
                                <div class="img img-col-6 icon"></div><br />
                                <div class="img img-col-6-msg"></div>
                            </div>
                            <p>
                                It provides a wide range of grids for chart backgrounds, brushes to represent your
                                data and widgets for interactivity. Themes can also be applied to customize the look
                                of your charts.
                            </p>
                        </div>
                        <div class="col col-4">
                            <div class="title">
                                <div class="img img-col-5 icon"></div><br />
                                <div class="img img-col-5-msg"></div>
                            </div>
                            <p>
                                JUI Vue works in all modern evergreen browsers<br />
                                (Chrome, Firefox, Safari and Edge).<br />
                            </p>
                        </div>
                        <div class="col col-4">
                            <div class="title">
                                <div class="img img-col-4 icon"></div><br />
                                <div class="img img-col-4-msg"></div>
                            </div>
                            <p>
                                The library is capable of processing millions of records, and provides a number of
                                different options and functions. It also includes a powerful table component, which
                                can present records in tree form.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </article>
</template>
