<template>
  <q-dialog v-model="active" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
        <span class="q-ml-sm">{{ confirmMsg }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup @click="onCancel" />
        <q-btn flat label="Turn on Wifi" color="primary" v-close-popup @click="onAccept"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['active', 'msg', 'onCancel', 'onAccept'],
  setup() {},
});
</script>
<style lang=""></style>
