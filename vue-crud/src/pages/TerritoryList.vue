<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { apiClient } from '../api/client';

type Row = Record<string, unknown>;

const rows = ref<Row[]>([]);
const territoryLevelOptions = ref<Row[]>([]);
const territoryOptions = ref<Row[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const load = () => {
  loading.value = true;
  error.value = null;
  apiClient
    .list<Row>('territory')
    .then((data) => { rows.value = data; })
    .catch((e) => { error.value = e instanceof Error ? e.message : 'Erreur de chargement'; })
    .finally(() => { loading.value = false; });
};

onMounted(load);

onMounted(() => {
  apiClient.list<Row>('territory-level').then((data) => { territoryLevelOptions.value = data; }).catch(() => {});
  apiClient.list<Row>('territory').then((data) => { territoryOptions.value = data; }).catch(() => {});
});

const territoryLevelLabel = (id: unknown) => {
  if (id === null || id === undefined || id === '') return '';
  const found = territoryLevelOptions.value.find((o) => String(o.id) === String(id));
  return found ? String((found as any).label ?? (found as any).name ?? id ?? '') : String(id);
};
const territoryLabel = (id: unknown) => {
  if (id === null || id === undefined || id === '') return '';
  const found = territoryOptions.value.find((o) => String(o.id) === String(id));
  return found ? String((found as any).label ?? (found as any).name ?? id ?? '') : String(id);
};

const handleDelete = async (id: unknown) => {
  if (!window.confirm('Supprimer cet élément ?')) return;
  await apiClient.remove('territory', id as string);
  load();
};
</script>

<template>
  <div>
    <div class="page-header">
      <h1>Territory</h1>
      <RouterLink class="btn" to="/territory/new">+ Nouveau</RouterLink>
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
          <th>number</th>
          <th>territoryLevelId</th>
          <th>territoryDependanceId</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in rows" :key="String(row.id ?? i)">
          <td>{{ (row as any).id ?? '' }}</td>
          <td>{{ (row as any).name ?? '' }}</td>
          <td>{{ (row as any).number ?? '' }}</td>
          <td>{{ territoryLevelLabel((row as any).territoryLevelId) }}</td>
          <td>{{ territoryLabel((row as any).territoryDependanceId) }}</td>
          <td>
            <RouterLink :to="`/territory/${row.id}/edit`">Modifier</RouterLink>
            <button type="button" class="btn danger" @click="handleDelete(row.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>