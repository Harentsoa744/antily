<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiClient } from '../api/client';

const route = useRoute();
const router = useRouter();
const id = route.params.id as string | undefined;
const isEdit = Boolean(id);
const loading = ref(isEdit);
const error = ref<string | null>(null);
type OptionRow = Record<string, unknown>;
const territoryLevelOptions = ref<OptionRow[]>([]);
const territoryOptions = ref<OptionRow[]>([]);
const values = reactive<Record<string, unknown>>({
  name: '' as unknown,
  number: '' as unknown,
  territoryLevelId: '' as unknown,
  territoryDependanceId: '' as unknown,
});

onMounted(() => {
  apiClient.list<OptionRow>('territory-level').then((data) => { territoryLevelOptions.value = data; }).catch(() => {});
  apiClient.list<OptionRow>('territory').then((data) => { territoryOptions.value = data; }).catch(() => {});
});

onMounted(() => {
  if (!isEdit || !id) return;
  apiClient
    .get('territory', id)
    .then((data) => {
      values.name = (data as any).name ?? '';
      values.number = (data as any).number ?? '';
      values.territoryLevelId = (data as any).territoryLevelId ?? '';
      values.territoryDependanceId = (data as any).territoryDependanceId ?? '';
    })
    .catch((e) => { error.value = e instanceof Error ? e.message : 'Erreur de chargement'; })
    .finally(() => { loading.value = false; });
});

const handleSubmit = async () => {
  error.value = null;
  const payload = {
    name: values.name === '' ? undefined : values.name,
    number: values.number === '' ? undefined : Number(values.number),
    territoryLevelId: values.territoryLevelId === '' ? undefined : values.territoryLevelId,
    territoryDependanceId: values.territoryDependanceId === '' ? undefined : values.territoryDependanceId,
  };
  try {
    if (isEdit && id) await apiClient.update('territory', id, payload);
    else await apiClient.create('territory', payload);
    router.push('/territory');
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Erreur lors de l'enregistrement";
  }
};
</script>

<template>
  <div>
    <p v-if="loading">Chargement...</p>
    <div v-else>
      <h1>{{ isEdit ? 'Modifier' : 'Nouveau' }} : Territory</h1>
      <p v-if="error" class="empty-state">{{ error }}</p>
      <form @submit.prevent="handleSubmit">
      <label :for="'name'">
        name
        <input type="text" id="name" name="name" v-model="values.name" />
      </label>
      <label :for="'number'">
        number
        <input type="number" step="any" id="number" name="number" v-model="values.number" />
      </label>
      <label :for="'territoryLevelId'">
        territory_level_id
        <select id="territoryLevelId" name="territoryLevelId" v-model="values.territoryLevelId">
          <option value="">-- Sélectionner --</option>
          <option v-for="opt in territoryLevelOptions" :key="String(opt.id)" :value="String(opt.id)">{{ (opt as any).name ?? (opt as any).label ?? opt.id }}</option>
        </select>
      </label>
      <label :for="'territoryDependanceId'">
        territory_dependance_id
        <select id="territoryDependanceId" name="territoryDependanceId" v-model="values.territoryDependanceId">
          <option value="">-- Sélectionner --</option>
          <option v-for="opt in territoryOptions" :key="String(opt.id)" :value="String(opt.id)">{{ (opt as any).name ?? (opt as any).label ?? opt.id }}</option>
        </select>
      </label>
        <div class="form-actions">
          <button type="submit" class="btn">Enregistrer</button>
          <button type="button" class="btn secondary" @click="router.push('/territory')">Annuler</button>
        </div>
      </form>
    </div>
  </div>
</template>