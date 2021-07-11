<template>
  <q-header elevated>
    <q-toolbar class="bg-grey-10">
      <q-btn
        flat
        dense
        round
        @click="$emit('toggleSideBar')"
        aria-label="Menu"
        icon="menu"
      />

      <q-toolbar-title> Password Manager </q-toolbar-title>
    </q-toolbar>
    <q-tabs
      v-model="tab"
      :key="tab"
      class="bg-grey-10"
      indicator-color="yellow-6"
      active-color="yellow-4"
    >
      <q-tab
        v-for="page of routeOpts"
        :key="page.path"
        :name="page.name"
        :icon="page.icon"
        :label="page.name"
        @click="changeTab(page.path, page.name)"
      />
    </q-tabs>
  </q-header>
</template>

<script>
import { defineComponent, ref, watch, toRefs } from "vue";
import { useRouter, useRoute } from "vue-router";
import _ from "lodash";
import { routeOpts } from "@/constants/pages";
export default defineComponent({
  name: "Header",
  components: {},
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();
    let tab = ref(routeOpts[0].name);
    const changeTab = (path, name) => {
      router.push({ path });
    };
    watch(route, (val) => {
      tab.value = _.get(
        _.find(routeOpts, { path: route.path }),
        "name",
        routeOpts[0].name
      );
    });
    return {
      routeOpts,
      tab,
      changeTab,
    };
  },
});
</script>

<style></style>
