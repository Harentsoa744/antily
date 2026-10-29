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
const territoryOptions = ref<OptionRow[]>([]);
const memberOptions = ref<OptionRow[]>([]);
const membershipFeeOptions = ref<OptionRow[]>([]);
const membershipPaymentOptions = ref<OptionRow[]>([]);

const values = reactive<Record<string, unknown>>({
  roleDetail: '' as unknown,
  status: '' as unknown,
  territoryId: '' as unknown,
  memberId: '' as unknown,
  membershipFeeId: '' as unknown,
  membershipPaymentId: '' as unknown,
});

onMounted(() => {
  apiClient.list<OptionRow>('territory').then((data) => { territoryOptions.value = data; }).catch(() => {});
  apiClient.list<OptionRow>('member').then((data) => { memberOptions.value = data; }).catch(() => {});
  apiClient.list<OptionRow>('membership-fee').then((data) => { membershipFeeOptions.value = data; }).catch(() => {});
  apiClient.list<OptionRow>('membership-payment').then((data) => { membershipPaymentOptions.value = data; }).catch(() => {});
});

onMounted(() => {
  if (!isEdit || !id) return;
  apiClient
    .get('membership', id)
    .then((data) => {
      values.roleDetail = (data as any).roleDetail ?? '';
      values.status = (data as any).status ?? '';
      values.territoryId = (data as any).territoryId ?? '';
      values.memberId = (data as any).memberId ?? '';
      values.membershipFeeId = (data as any).membershipFeeId ?? '';
      values.membershipPaymentId = (data as any).membershipPaymentId ?? '';
    })
    .catch((e) => { error.value = e instanceof Error ? e.message : 'Erreur de chargement'; })
    .finally(() => { loading.value = false; });
});

const handleSubmit = async () => {
  error.value = null;
  const payload = {
    roleDetail: values.roleDetail === '' ? undefined : values.roleDetail,
    status: values.status === '' ? undefined : Number(values.status),
    territoryId: values.territoryId === '' ? undefined : values.territoryId,
    memberId: values.memberId === '' ? undefined : values.memberId,
    membershipFeeId: values.membershipFeeId === '' ? undefined : values.membershipFeeId,
    membershipPaymentId: values.membershipPaymentId === '' ? undefined : values.membershipPaymentId,
  };
  try {
    if (isEdit && id) await apiClient.update('membership', id, payload);
    else await apiClient.create('membership', payload);
    router.push('/membership');
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Erreur lors de l'enregistrement";
  }
};
</script>

<template>
  <div>
    <p v-if="loading">Chargement...</p>
    <div v-else>
      <h1>{{ isEdit ? 'Modifier' : 'Nouveau' }} : Membership</h1>
      <p v-if="error" class="empty-state">{{ error }}</p>
      <form @submit.prevent="handleSubmit">
      <label :for="'roleDetail'">
        roleDetail
        <input type="text" id="roleDetail" name="roleDetail" v-model="values.roleDetail" />
      </label>
      <label :for="'status'">
        status *
        <input type="number" step="any" id="status" name="status" v-model="values.status" />
      </label>
      <label :for="'territoryId'">
        territory_id *
        <select id="territoryId" name="territoryId" v-model="values.territoryId">
          <option value="">-- Sélectionner --</option>
          <option v-for="opt in territoryOptions" :key="String(opt.id)" :value="String(opt.id)">{{ (opt as any).name ?? (opt as any).label ?? opt.id }}</option>
        </select>
      </label>
      <label :for="'memberId'">
        member_id
        <select id="memberId" name="memberId" v-model="values.memberId">
          <option value="">-- Sélectionner --</option>
          <option v-for="opt in memberOptions" :key="String(opt.id)" :value="String(opt.id)">{{ (opt as any).name ?? (opt as any).label ?? opt.id }}</option>
        </select>
      </label>
      <label :for="'membershipFeeId'">
        membership_fee_id
        <select id="membershipFeeId" name="membershipFeeId" v-model="values.membershipFeeId">
          <option value="">-- Sélectionner --</option>
          <option v-for="opt in membershipFeeOptions" :key="String(opt.id)" :value="String(opt.id)">{{ (opt as any).fee ?? (opt as any).label ?? opt.id }}</option>
        </select>
      </label>
      <label :for="'membershipPaymentId'">
        membership_payment_id
        <select id="membershipPaymentId" name="membershipPaymentId" v-model="values.membershipPaymentId">
          <option value="">-- Sélectionner --</option>
          <option v-for="opt in membershipPaymentOptions" :key="String(opt.id)" :value="String(opt.id)">{{ (opt as any).label ?? (opt as any).reference ?? opt.id }}</option>
        </select>
      </label>
        <div class="form-actions">
          <button type="submit" class="btn">Enregistrer</button>
          <button type="button" class="btn secondary" @click="router.push('/membership')">Annuler</button>
        </div>
      </form>
    </div>
  </div>
</template>