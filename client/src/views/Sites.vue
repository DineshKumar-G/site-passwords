<template>
  <div class="q-pa-md row justify-center">
    <q-table
      class="col-9 window-height"
      :rows="rows"
      :columns="primaryCols"
      table-class=""
      row-key="_id"
      table-header-class="text-yellow-4"
      virtual-scroll
      :virtual-scroll-item-size="48"
      :virtual-scroll-sticky-size-start="48"
      :pagination="pagination"
      :rows-per-page-options="[0]"
      :loading="isLoading"
      v-model:expanded="expanded"
      hide-bottom
    >
      <template v-slot:top>
        <q-space></q-space>
        <q-input
          dense
          color="primary"
          placeholder="Search"
          v-model="searchText"
          debounce="500"
        >
          <template v-slot:append>
            <q-icon name="search" color="black"></q-icon>
          </template>
        </q-input>
      </template>
      <template v-slot:header="props">
        <q-tr :props="props" class="bg-grey-10">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            <span
              v-if="col.name !== 'actions'"
              class="text-yellow-4 text-bold text-subtitle1"
            >
              {{ col.label }}
            </span>
            <span v-else class="text-yellow-4 text-bold text-subtitle1">
              Actions
              <q-btn
                v-if="!editingRow._id && !expanded.length"
                round
                color="yellow-4"
                @click="addRow"
                size="sm"
                text-color="grey-10"
                icon="add"
              />
            </span>
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn
              size="sm"
              color="blue-4"
              round
              dense
              v-if="expanded.length === 0 || expanded[0] === props.key"
              v-bind:style="editingRow._id ? { display: 'none' } : {}"
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'expand_less' : 'expand_more'"
            />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <span v-if="col.name !== 'actions'">
              <span v-if="!props.row.isEditing || !col.editable">
                <a :href="col.value" target="_blank" v-if="col.name === 'url'">
                  {{ col.value }}
                </a>
                <span v-else>
                  {{ col.value }}
                </span>
              </span>
              <span v-else-if="col.editable">
                <q-input v-model="editingRow[col.field]" />
              </span>
            </span>
            <span
              v-else-if="
                col.name === 'actions' && !editingRow._id && !expanded.length
              "
              class="q-pa-md q-gutter-sm"
            >
              <q-btn
                round
                color="blue-4"
                @click="editWebSite(props.row)"
                glossy
                size="sm"
                text-color="white"
                icon="edit"
              />

              <q-btn
                round
                color="red"
                @click="deleteWebSite(props.row)"
                glossy
                size="sm"
                text-color="white"
                icon="delete_forever"
              />
            </span>
            <span
              v-else-if="editingRow._id === props.row._id"
              class="q-pa-md q-gutter-sm"
            >
              <q-btn
                round
                color="blue-4"
                @click="saveItem()"
                glossy
                size="sm"
                text-color="white"
                icon="done"
              />

              <q-btn
                round
                color="red"
                @click="cancelEdit(props.row)"
                glossy
                size="sm"
                text-color="white"
                icon="close"
              />
            </span>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">
              <q-table
                :rows="props.row.accounts"
                :columns="flyoutCols"
                row-key="_id"
                class="col-7"
                :rows-per-page-options="[0]"
                :pagination.sync="pagination"
                hide-bottom
              >
                <template v-slot:top>
                  <span class="text-bold text-subtitle1">Linked Accounts</span>
                </template>
                <template v-slot:header="props">
                  <q-tr :props="props" class="bg-grey-10">
                    <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      <span
                        v-if="col.name !== 'actions'"
                        class="text-yellow-4 text-bold text-subtitle2"
                      >
                        {{ col.label }}
                      </span>
                      <span
                        v-else
                        class="text-yellow-4 text-bold text-subtitle2"
                      >
                        Actions
                        <q-btn
                          round
                          color="yellow-4"
                          @click="linkAccount()"
                          size="sm"
                          text-color="grey-10"
                          icon="add"
                        />
                      </span>
                    </q-th>
                  </q-tr>
                </template>

                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                    >
                      <span v-if="col.name !== 'actions'">
                        <span v-if="props.row.newLink">
                          <q-input
                            v-model="newAccLink[props.pageIndex][col.name]"
                          />
                        </span>
                        <span v-else>
                          {{ col.value }}
                        </span>
                      </span>
                      <span v-else class="q-pa-md q-gutter-sm">
                        <q-btn
                          v-if="
                            props.row.newLink &&
                            expanded[0] !== 'newWebSite' &&
                            !editingRow._id
                          "
                          round
                          color="blue-4"
                          @click="confirmLink(props.pageIndex)"
                          glossy
                          size="sm"
                          text-color="white"
                          icon="done"
                        />
                        <q-btn
                          v-else-if="expanded[0] !== 'newWebSite'"
                          round
                          color="red"
                          @click="unLinkAccount(props.key)"
                          glossy
                          size="sm"
                          text-color="white"
                          icon="delete_forever"
                        />
                      </span>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { defineComponent, onBeforeMount, ref, watch } from 'vue';
import _ from 'lodash';
import API from '@/api-models/Connector';
import { useQuasar } from 'quasar';

const primaryCols = [
  {
    name: 'url',
    required: true,
    label: 'Links',
    align: 'center',
    field: 'url',
    editable: true,
    // format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'title',
    align: 'center',
    label: 'Title',
    field: 'title',
    editable: true,
    sortable: true,
  },
  {
    name: 'totalAccounts',
    label: 'Total Accounts Linked',
    field: 'totalAccounts',
    align: 'center',
    sortable: true,
    // sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center',
  },
];
const flyoutCols = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'center',
    field: 'name',
    sortable: true,
  },
  {
    name: 'secrets.username',
    align: 'center',
    label: 'User Name',
    field: (row) => row.secrets.username,
    sortable: true,
  },
  {
    name: 'secrets.password',
    label: 'Password',
    field: (row) => row.secrets.password,
    align: 'center',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center',
  },
];
export default defineComponent({
  name: 'WebSites',
  setup() {
    const $q = useQuasar();

    let rows = ref([]);
    let editingRow = ref({});
    let searchText = ref('');
    let isLoading = ref(false);
    let expanded = ref([]);
    let newAccLink = ref([]);
    let defAccount = {
      name: '',
      secrets: {
        username: '',
        password: '',
      },
      newLink: true,
    };

    onBeforeMount(() => {
      loadData();
    });

    // List view populate
    const loadData = async () => {
      isLoading.value = true;
      const { data } = await API.getSites({ search: searchText.value });
      rows.value = data;
      isLoading.value = false;
    };

    // Adding Website
    // Below functions just adds a empty row, saving code is resued from edit operation
    const addRow = () => {
      rows.value.splice(0, 0, {
        _id: 'newWebSite',
        url: '',
        title: '',
        totalAccounts: 0,
        isEditing: true,
        accounts: [defAccount],
      });
      newAccLink.value.push([]);
      expanded.value = ['newWebSite'];
      editingRow.value = rows.value[0];
    };

    // Editing Website
    const editWebSite = (row) => {
      expanded.value = [row._id];
      row.isEditing = true;
      row._beforeEdit = row;
      editingRow.value = {
        _id: row._id,
        url: row.url,
        title: row.title,
      };
    };

    const cancelEdit = async (row) => {
      row.isEditing = false;
      row = row._beforeEdit;
      editingRow.value = {};
      await loadData();
      expanded.value = [];
    };

    const saveItem = async () => {
      isLoading.value = true;
      const newRow = editingRow.value;
      let newAccLength = newRow._id === 'newWebSite' ? 0 : 1;
      const newAccs = [];
      for (let vAcc of Object.values(newAccLink.value)) {
        if (vAcc.name && vAcc['secrets.username'] && vAcc['secrets.password']) {
          newAccLength += 1;
          newAccs.push({
            name: vAcc.name,
            username: vAcc['secrets.username'],
            password: vAcc['secrets.password'],
          });
        }
      }
      if (!_.get(newRow, 'url')) {
        $q.notify({ color: 'negative', message: 'Please add a Link!' });
        return;
      }
      if (!_.get(newRow, 'title')) {
        $q.notify({ color: 'negative', message: 'Please add a title!' });
        return;
      }
      if (newAccLength < 1) {
        $q.notify({
          color: 'negative',
          message:
            'Please add all the information to save your account details!',
        });
        return;
      }
      if (editingRow.value._id === 'newWebSite') {
        await API.addSite({
          ..._.pick(newRow, ['title', 'url']),
          accounts: newAccs,
        });
      } else {
        for (let i = 0; i < newAccs.length; i++)
          await performLink(newAccLink.value[i], newRow._id);
        await API.editSite(editingRow.value);
      }
      resetAfterAdd();
    };

    const resetAfterAdd = async () => {
      isLoading.value = false;
      editingRow.value = {};
      await loadData();
      expanded.value = [];
      $q.notify({
        color: 'green',
        message: 'Added website and account details!',
      });
    };

    const deleteWebSite = async (row) => {
      $q.dialog({
        title: 'Confirm',
        message:
          'Are you sure you want to delete the website? All account details will be lost',
        cancel: true,
        persistent: true,
      })
        .onOk(async () => {
          isLoading.value = true;
          await API.deleteSite({ _id: row._id });
          isLoading.value = false;
          await loadData();
          $q.notify({
            color: 'green',
            message: 'Deleted Website link and all account details',
          });
        })
        .onCancel(() => {});
    };

    // Account linking operations.
    const linkAccount = async () => {
      const openedRow = _.find(rows.value, { _id: expanded.value[0] });
      openedRow.accounts.splice(0, 0, defAccount);
      newAccLink.value.push([]);
    };

    const confirmLink = async (idx) => {
      const webID = expanded.value[0];
      const addingAccount = newAccLink.value[idx];
      await performLink(addingAccount, webID);
      await loadData();
      expanded.value = [webID];
      $q.notify({
        color: 'green',
        message: 'Linked new account successfully!',
      });
    };

    const performLink = async (addingAccount, webID) => {
      if (
        !addingAccount.name ||
        !addingAccount['secrets.password'] ||
        !addingAccount['secrets.username']
      ) {
        $q.notify({
          color: 'negative',
          message:
            'Please add all the information to save your account details!',
        });
        return;
      }
      await API.accountUpdate({
        username: addingAccount.name,
        password: addingAccount['secrets.password'],
        name: addingAccount['secrets.username'],
        _id: webID,
        op: 'link',
      });
    };

    const unLinkAccount = async (accId) => {
      $q.dialog({
        title: 'Confirm',
        message: 'Are you sure you want to delete the account details?',
        cancel: true,
        persistent: true,
      })
        .onOk(async () => {
          const webID = expanded.value[0];
          await API.accountUpdate({
            accId,
            _id: webID,
            op: 'unlink',
          });
          await loadData();
          expanded.value = [webID];
          $q.notify({
            color: 'green',
            message: 'Deleted Account details',
          });
        })
        .onCancel(() => {});
    };

    // watching searchText and then trigger the loadData because quasar input fields has debounce to it's v-model
    watch(searchText, () => {
      loadData();
    });

    watch(expanded, () => {
      newAccLink.value = [[]];
    });

    return {
      unLinkAccount,
      newAccLink,
      confirmLink,
      linkAccount,
      expanded,
      isLoading,
      searchText,
      deleteWebSite,
      primaryCols,
      addRow,
      cancelEdit,
      editingRow,
      rows,
      saveItem,
      flyoutCols,
      loadData,
      editWebSite,
      pagination: {
        page: 1,
        rowsPerPage: 0,
      },
    };
  },
});
</script>

<style scoped>
div >>> .q-table__sort-icon {
  color: white;
}
</style>
