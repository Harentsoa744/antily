<script setup lang="ts">
import '../login_1.css';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiClient } from '../api/client';

const name = ref('');
const email = ref('');
const password = ref('');
const router = useRouter();
const error = ref<string | null>(null);
const loading = ref(false);

const handleSubmit = async () => {
  error.value = null;
  loading.value = true;
  try {
    const response = await apiClient.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    router.push('/member');
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Création du compte impossible';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-shell">
    <div class="auth-form-side">
      <div class="auth-card">
        <div class="auth-brand">Gestion de données</div>
        <h1 class="auth-title">Créer un compte</h1>
        <p class="auth-subtitle">Créez votre compte pour accéder à votre espace.</p>
        <p v-if="error" class="empty-state">{{ error }}</p>
        <form @submit.prevent="handleSubmit">
          <label for="name">
            Nom complet
            <input id="name" type="text" v-model="name" required />
          </label>
          <label for="email">
            Adresse email
            <input id="email" type="email" v-model="email" required />
          </label>
          <label for="password">
            Mot de passe
            <input id="password" type="password" v-model="password" minlength="8" required />
          </label>
          <div class="form-actions">
            <button type="submit" class="btn" :disabled="loading">{{ loading ? 'Création...' : 'Créer mon compte' }}</button>
          </div>
        </form>
        <p class="auth-switch">Déjà un compte ? <RouterLink to="/login">Se connecter</RouterLink></p>
      </div>
    </div>
  </div>
</template>
