<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <SideBar :leftDrawerOpen="leftDrawerOpen"> </SideBar>
      <Header @toggle-side-bar="toggleSideBar"> </Header>
      <router-view class="bg-grey-3"/>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import SideBar from "@/components/SideBar.vue";
import Header from "@/components/Header.vue";
export default defineComponent({
  name: "App",
  components: {
    SideBar,
    Header,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    let leftDrawerOpen = ref(true);
    const toggleSideBar = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };
    return {
      leftDrawerOpen,
      toggleSideBar,
    };
  },
});
</script>
