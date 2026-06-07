<template>
  <span class="kicker"><slot /></span>
</template>

<style scoped>
.kicker {
  display: inline-block;
  font-family: 'Hack', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #06b6d4;
}

.kicker::before {
  content: '[ ';
  opacity: 0.5;
}

.kicker::after {
  content: ' ]';
  opacity: 0.5;
}
</style>
