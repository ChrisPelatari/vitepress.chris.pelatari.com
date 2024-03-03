<template>
  <svg-icon type="mdi" :path="path"></svg-icon>
</template>

<script setup>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiMastodon } from '@mdi/js';

const path = mdiMastodon;
</script>