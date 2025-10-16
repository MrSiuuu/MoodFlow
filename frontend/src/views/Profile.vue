<template>
  <div class="space-y-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gradient mb-2">Profil</h1>
      <p class="text-lg text-base-content/70">Gère ton compte</p>
    </div>
    
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title mb-6">Informations du compte</h2>
        <div class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input type="email" :value="authStore.user?.email" class="input input-bordered" disabled />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Membre depuis</span>
            </label>
            <input type="text" :value="formatDate(authStore.user?.created_at)" class="input input-bordered" disabled />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { formatDate } from '@/lib/utils'

const authStore = useAuthStore()
</script>
