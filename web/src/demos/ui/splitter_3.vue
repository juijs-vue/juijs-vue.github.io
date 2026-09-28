<script setup lang="ts">
// @ts-nocheck
// The original html also had this exact same CSS as a raw <style> tag
// nested inside its markup, redundant with this script-injected copy -
// dropped it since Vue's template compiler doesn't render a literal
// <style> found inside <template> anyway (see ignoreSideEffectTags in
// @vue/compiler-dom - a "tag with side effect", always stripped from the
// render output, and @vue/repl's in-browser compiler treats that as a
// fatal error rather than Vite's silent tolerance of it).
const style = document.createElement('style');
style.textContent = `
    .splitter-container {
        width: 500px;
        height: 500px;
        position: relative;
        border: 1px solid #ececec;
    }
    .splitter {
        width: 100% !important;
        height: 100% !important;
        left: auto !important;
        top: auto !important;
        bottom: auto !important;
        background-color: transparent !important;
    }
`;
document.head.appendChild(style);
</script>

<template>
<h3>Border Layout (with minSize)</h3>
<div class="splitter-container">
	<Splitter direction="horizontal" :min-size="[50, 200]">
		<template #first>
			<h3>Top</h3>
		</template>
		<template #second>
			<Splitter direction="horizontal" :min-size="[100, 50]">
				<template #first>
					<Splitter :min-size="[50, 100]" fixed>
						<template #first>
							Left
						</template>
						<template #second>
							<Splitter :min-size="50">
								<template #first>
									Center
								</template>
								<template #second>
									Right
								</template>
							</Splitter>
						</template>
					</Splitter>
				</template>
				<template #second>
					<h3>Bottom</h3>
				</template>
			</Splitter>
		</template>
	</Splitter>
</div>
</template>
