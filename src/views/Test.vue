<template>
  <a-space>
  <a-qrcode ref="qrcodeCanvasRef" value="http://www.antdv.com" />
  <a-button type="primary" @click="dowloadChange()">Downlaod</a-button>
  </a-space>
</template>
<script setup>
import { ref } from 'vue';
const qrcodeCanvasRef = ref();
const dowloadChange = async () => {
  const url = await qrcodeCanvasRef.value.toDataURL();
  const a = document.createElement('a');
  a.download = 'QRCode.png';
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
</script>