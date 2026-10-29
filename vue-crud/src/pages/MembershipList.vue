<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { apiClient } from '../api/client';
import { parseCsv } from '../utils/csv';

type Row = Record<string, unknown>;
type ImportedMembershipCsv = {
  territoryId: string;
  memberId?: string;
  roleDetail?: string;
  status: string;
  membershipFeeId?: string;
  membershipPaymentId?: string;
};

type ImportedMembership = Omit<ImportedMembershipCsv, 'status'> & {
  status: number;
};

const rows = ref<Row[]>([]);
const territoryOptions = ref<Row[]>([]);
const memberOptions = ref<Row[]>([]);
const membershipFeeOptions = ref<Row[]>([]);
const membershipPaymentOptions = ref<Row[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const importing = ref(false);
const importMessage = ref<string | null>(null);

const load = () => {
  loading.value = true;
  error.value = null;
  apiClient
    .list<Row>('membership')
    .then((data) => { rows.value = data; })
    .catch((e) => { error.value = e instanceof Error ? e.message : 'Erreur de chargement'; })
    .finally(() => { loading.value = false; });
};

onMounted(load);

onMounted(() => {
  apiClient.list<Row>('territory').then((data) => { territoryOptions.value = data; }).catch(() => {});
  apiClient.list<Row>('member').then((data) => { memberOptions.value = data; }).catch(() => {});
  apiClient.list<Row>('membership-fee').then((data) => { membershipFeeOptions.value = data; }).catch(() => {});
  apiClient.list<Row>('membership-payment').then((data) => { membershipPaymentOptions.value = data; }).catch(() => {});
});

const labelOf = (options: Row[], id: unknown) => {
  if (id === null || id === undefined || id === '') return '';
  const found = options.find((o) => String(o.id) === String(id));
  return found ? String((found as any).label ?? (found as any).name ?? id ?? '') : String(id);
};
const territoryLabel = (id: unknown) => labelOf(territoryOptions.value, id);
const memberLabel = (id: unknown) => labelOf(memberOptions.value, id);
const membershipFeeLabel = (id: unknown) => labelOf(membershipFeeOptions.value, id);
const membershipPaymentLabel = (id: unknown) => labelOf(membershipPaymentOptions.value, id);

const handleDelete = async (id: unknown) => {
  if (!window.confirm('Supprimer cet élément ?')) return;
  await apiClient.remove('membership', id as string);
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
    const csvRows = parseCsv<ImportedMembershipCsv>(await file.text(), {
      columns: [
        { header: 'territoryId', field: 'territoryId' },
        { header: 'memberId', field: 'memberId' },
        { header: 'roleDetail', field: 'roleDetail' },
        { header: 'status', field: 'status' },
        { header: 'membershipFeeId', field: 'membershipFeeId' },
        { header: 'membershipPaymentId', field: 'membershipPaymentId' },
      ],
    });
    const rows: ImportedMembership[] = csvRows.map((row, index) => {
      const status = Number(row.status);
      if (!Number.isFinite(status)) {
        throw new Error(`Le status de la ligne ${index + 2} doit être numérique`);
      }
      return { ...row, status };
    });
    const result = await apiClient.importRows<ImportedMembership, { imported: number }>('membership', rows);
    importMessage.value = `${result.imported} membership(s) importé(s).`;
    await load();
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
      <h1>Membership</h1>
      <div>
        <label class="btn secondary" for="membership-csv">{{ importing ? 'Import...' : 'Importer CSV' }}</label>
        <input id="membership-csv" type="file" accept=".csv,text/csv" hidden :disabled="importing" @change="handleImport" />
        <RouterLink class="btn" to="/membership/new">+ Nouveau</RouterLink>
      </div>
    </div>
    <p v-if="importMessage" class="empty-state">{{ importMessage }}</p>
    <p v-if="loading">Chargement...</p>
    <p v-else-if="error" class="empty-state">{{ error }}</p>
    <p v-else-if="rows.length === 0" class="empty-state">Aucun élément pour le moment.</p>
    <div v-else class="card">
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>roleDetail</th>
          <th>status</th>
          <th>territoryId</th>
          <th>memberId</th>
          <th>membershipFeeId</th>
          <th>membershipPaymentId</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in rows" :key="String(row.id ?? i)">
          <td>{{ (row as any).id ?? '' }}</td>
          <td>{{ (row as any).roleDetail ?? '' }}</td>
          <td>{{ (row as any).status ?? '' }}</td>
          <td>{{ territoryLabel((row as any).territoryId) }}</td>
          <td>{{ memberLabel((row as any).memberId) }}</td>
          <td>{{ membershipFeeLabel((row as any).membershipFeeId) }}</td>
          <td>{{ membershipPaymentLabel((row as any).membershipPaymentId) }}</td>
          <td>
            <RouterLink :to="`/membership/${row.id}/edit`">Modifier</RouterLink>
            <button type="button" class="btn danger" @click="handleDelete(row.id)">Supprimer</button>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>