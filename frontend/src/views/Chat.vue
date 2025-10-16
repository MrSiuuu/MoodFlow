<template>
  <div class="space-y-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gradient mb-2">Chat IA</h1>
      <p class="text-lg text-base-content/70">Discute avec ton assistant personnel</p>
    </div>
    
    <div class="card bg-base-100 shadow-xl h-96">
      <div class="card-body flex flex-col">
        <div class="flex-1 overflow-y-auto space-y-4">
          <div v-for="message in aiStore.messages" :key="message.id" class="chat" :class="message.role === 'user' ? 'chat-end' : 'chat-start'">
            <div class="chat-bubble" :class="message.role === 'user' ? 'chat-bubble-primary' : 'chat-bubble-secondary'">
              {{ message.content }}
            </div>
          </div>
        </div>
        
        <div class="flex gap-2">
          <input 
            v-model="messageInput"
            @keyup.enter="sendMessage"
            type="text" 
            placeholder="Pose ta question..."
            class="input input-bordered flex-1"
            :disabled="aiStore.loading"
          />
          <button 
            @click="sendMessage"
            class="btn btn-primary"
            :disabled="aiStore.loading || !messageInput.trim()"
            :class="{ 'loading': aiStore.loading }"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAiStore } from '@/stores/ai'

const aiStore = useAiStore()
const messageInput = ref('')

onMounted(async () => {
  await aiStore.loadSessions()
})

const sendMessage = async () => {
  if (!messageInput.value.trim()) return
  
  const message = messageInput.value
  messageInput.value = ''
  
  await aiStore.sendMessage(message)
}
</script>
