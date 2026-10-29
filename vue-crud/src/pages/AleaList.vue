<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { apiClient } from '../api/client';
import { parseCsv } from '../utils/csv';

type Row = Record<string, unknown>;
type ImportedMember = {
  name?: string;
  firstname?: string;
  dateOfBirth?: string;
  email?: string;
  phone?: string;
};

const rows = ref<Row[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const importing = ref(false);
const importMessage = ref<string | null>(null);

const load = () => {
  loading.value = true;
  error.value = null;
  apiClient
    .list<Row>('member')
    .then((data) => { rows.value = data; })
    .catch((e) => { error.value = e instanceof Error ? e.message : 'Erreur de chargement'; })
    .finally(() => { loading.value = false; });
};

onMounted(load);

const handleDelete = async (id: unknown) => {
  if (!window.confirm('Supprimer cet élément ?')) return;
  await apiClient.remove('member', id as string);
  load();
};

const handleImport = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  importing.value = true;
  importMessage.value = null;
  error.value = null;
  try {
    const rows = parseCsv<ImportedMember>(await file.text(), {
      columns: [
        { header: 'name', field: 'name' },
        { header: 'firstname', field: 'firstname' },
        { header: 'dateOfBirth', field: 'dateOfBirth' },
        { header: 'email', field: 'email' },
        { header: 'phone', field: 'phone' },
      ],
    });
    if (rows.length === 0) throw new Error('Le CSV ne contient aucune donnée');
    const result = await apiClient.importMembers(rows);
    importMessage.value = `${result.imported} membre(s) importé(s).`;
    load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : "Erreur lors de l'import CSV";
  } finally {
    importing.value = false;
    input.value = '';
  }
};

</script>

<template>
  <div>
    <div class="page-header">
      <h1>Member</h1>
      <div>
        <label class="btn secondary" for="member-csv">{{ importing ? 'Import...' : 'Importer CSV' }}</label>
        <input id="member-csv" type="file" accept=".csv,text/csv" hidden :disabled="importing" @change="handleImport" />
        <RouterLink class="btn" to="/member/new">+ Nouveau</RouterLink>
      </div>
    </div>
    <p v-if="loading">Chargement...</p>
    <p v-else-if="error" class="empty-state">{{ error }}</p>
    <p v-else-if="rows.length === 0" class="empty-state">Aucun élément pour le moment.</p>
    <div v-else class="card">
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>firstname</th>
          <th>dateOfBirth</th>
          <th>email</th>
          <th>phone</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in rows" :key="String(row.id ?? i)">
          <td>{{ (row as any).id ?? '' }}</td>
          <td>{{ (row as any).name ?? '' }}</td>
          <td>{{ (row as any).firstname ?? '' }}</td>
          <td>{{ (row as any).dateOfBirth ?? '' }}</td>
          <td>{{ (row as any).email ?? '' }}</td>
          <td>{{ (row as any).phone ?? '' }}</td>
          <td>
            <RouterLink :to="`/member/${row.id}/edit`">Modifier</RouterLink>
            <button type="button" class="btn danger" @click="handleDelete(row.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>
