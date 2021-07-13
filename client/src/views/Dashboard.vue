<template>
  <div class="window-height">
    <div class="q-pt-xl row q-gutter-md justify-center">
      <q-card
        @click="$router.push({ path: '/websites' })"
        class="my-card text-white cursor-pointer"
        style="
          background: linear-gradient(90deg, #f00b51 0%, #7366ff 100%);
          min-width: 19rem;
        "
      >
        <q-card-section>
          <div class="text-h2 text-center text-bold text-capitalize">
            {{ topSite.title }}
          </div>
          <div class="text-subtitle1 text-center text-bold">Top Website</div>
        </q-card-section>

        <q-card-section class="q-pt-none text-center text-bold">
          Number of Accounts {{ topSite.length }}
        </q-card-section>
      </q-card>
    </div>
    <div class="q-pa-md row q-gutter-md justify-center">
      <q-card
        class="my-card text-white"
        style="background: linear-gradient(90deg, #f00b51 0%, #7366ff 100%)"
      >
        <q-card-section>
          <div class="text-h2 text-center text-bold">
            <vue3-autocounter
              ref="counter"
              :startAmount="0"
              :endAmount="totalSites"
              :duration="0.3"
            />
          </div>
          <div class="text-subtitle1 text-center text-bold">Total Websites</div>
        </q-card-section>
      </q-card>
      <q-card
        class="my-card text-white"
        style="background: linear-gradient(90deg, #f00b51 0%, #7366ff 100%)"
      >
        <q-card-section>
          <div class="text-h2 text-center text-bold">
            <vue3-autocounter
              ref="counter"
              :startAmount="0"
              :endAmount="totalAccounts"
              :duration="0.3"
            />
          </div>
          <div class="text-subtitle1 text-center text-bold">Total Accounts</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, onBeforeMount } from 'vue';
import { useQuasar } from 'quasar';
import Vue3autocounter from 'vue3-autocounter';

import _ from 'lodash';
import API from '@/api-models/Connector';
export default defineComponent({
  components: {
    'vue3-autocounter': Vue3autocounter,
  },
  setup() {
    const $q = useQuasar();

    let totalSites = ref(0);
    let totalAccounts = ref(0);
    let topSite = ref({});

    onBeforeMount(async () => {
      $q.loading.show();
      ({
        totalSites: totalSites.value,
        totalAccounts: totalAccounts.value,
        topSite: topSite.value,
      } = await API.getMetrics());
      $q.loading.hide();
    });

    return {
      totalSites,
      totalAccounts,
      topSite,
    };
  },
});
</script>
<style scoped></style>
