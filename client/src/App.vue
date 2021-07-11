<template>
  <div id="nav">
    <!-- <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <router-view /> -->
    <h3>Text Cow. Moo</h3>
    <code>{{ cow }}}</code>
    <label>Custom Cow Text:</label>
    <input v-model="text" />
    <button @click="customCow">Show me a talking cow!</button>
  </div>
</template>
<script>
import { defineComponent, ref, onBeforeMount } from 'vue';

export default defineComponent({
  setup() {
    const cow = ref('');
    const text = ref('');
    onBeforeMount(() => {
      fetchCow();
    });
    const fetchCow = async () => {
      const response = await fetch(`/api/cow`, {
        headers: {
          accepts: 'application/json',
        },
      });
      const initialCow = await response.json();
      cow.value = initialCow.moo;
    };
    const customCow = async () => {
      // console.log('>>>>>>', text);
      // const text = text.value;
      const response = await fetch(`/api/cow/${text.value}`);
      const custom = await response.json();
      cow.value = custom.moo;
      text.value = '';
    };
    return { customCow, cow, text };
  },
});
</script>

import {defineComponent } from 'vue';

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
