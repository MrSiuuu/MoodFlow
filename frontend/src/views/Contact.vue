<template>
  <div class="min-h-screen bg-base-100">
    <!-- Hero Section -->
    <section class="hero py-20 bg-gradient-to-r from-primary to-secondary text-primary-content">
      <div class="hero-content text-center">
        <div class="max-w-4xl">
          <h1 class="text-4xl sm:text-5xl font-bold mb-6">
            Contactez-nous
          </h1>
          <p class="text-xl opacity-90">
            Une question ? Une suggestion ? Nous sommes là pour vous !
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Form -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto">
          <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <h2 class="card-title text-2xl mb-6">Envoyez-nous un message</h2>
              
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text">Prénom</span>
                    </label>
                    <input 
                      type="text" 
                      v-model="form.firstName"
                      class="input input-bordered" 
                      required 
                    />
                  </div>
                  
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text">Nom</span>
                    </label>
                    <input 
                      type="text" 
                      v-model="form.lastName"
                      class="input input-bordered" 
                      required 
                    />
                  </div>
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Email</span>
                  </label>
                  <input 
                    type="email" 
                    v-model="form.email"
                    class="input input-bordered" 
                    required 
                  />
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Sujet</span>
                  </label>
                  <select v-model="form.subject" class="select select-bordered" required>
                    <option value="">Sélectionnez un sujet</option>
                    <option value="support">Support technique</option>
                    <option value="feature">Demande de fonctionnalité</option>
                    <option value="bug">Signaler un bug</option>
                    <option value="partnership">Partenariat</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                
                <div class="form-control">
                  <label class="label">
                    <span class="label-text">Message</span>
                  </label>
                  <textarea 
                    v-model="form.message"
                    class="textarea textarea-bordered h-32" 
                    placeholder="Décrivez votre demande en détail..."
                    required
                  ></textarea>
                </div>
                
                <div class="form-control">
                  <label class="label cursor-pointer">
                    <input 
                      type="checkbox" 
                      v-model="form.newsletter"
                      class="checkbox checkbox-primary" 
                    />
                    <span class="label-text ml-2">
                      Je souhaite recevoir les actualités de MoodFlow
                    </span>
                  </label>
                </div>
                
                <div class="form-control">
                  <button 
                    type="submit" 
                    class="btn btn-primary"
                    :class="{ 'loading': isSubmitting }"
                    :disabled="isSubmitting"
                  >
                    <svg v-if="!isSubmitting" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                    {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer le message' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Info -->
    <section class="py-20 bg-base-200">
      <div class="container mx-auto px-4">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl font-bold text-center mb-12">Autres moyens de nous contacter</h2>
          
          <div class="grid md:grid-cols-3 gap-8">
            <!-- Email -->
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body text-center">
                <div class="text-4xl mb-4">📧</div>
                <h3 class="card-title justify-center">Email</h3>
                <p class="text-base-content/70 mb-4">
                  Pour toute question ou demande de support
                </p>
                <div class="card-actions justify-center">
                  <a href="mailto:contact@moodflow.app" class="btn btn-primary">
                    contact@moodflow.app
                  </a>
                </div>
              </div>
            </div>

            <!-- GitHub -->
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body text-center">
                <div class="text-4xl mb-4">🐙</div>
                <h3 class="card-title justify-center">GitHub</h3>
                <p class="text-base-content/70 mb-4">
                  Code source et contributions
                </p>
                <div class="card-actions justify-center">
                  <a href="https://github.com/moodflow" target="_blank" class="btn btn-outline">
                    Voir le projet
                  </a>
                </div>
              </div>
            </div>

            <!-- Discord -->
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body text-center">
                <div class="text-4xl mb-4">💬</div>
                <h3 class="card-title justify-center">Communauté</h3>
                <p class="text-base-content/70 mb-4">
                  Rejoins notre communauté Discord
                </p>
                <div class="card-actions justify-center">
                  <a href="https://discord.gg/moodflow" target="_blank" class="btn btn-outline">
                    Rejoindre Discord
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Quick Link -->
    <section class="py-20">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">Questions fréquentes</h2>
        <p class="text-lg text-base-content/70 mb-8">
          Trouve rapidement les réponses aux questions les plus courantes
        </p>
        <RouterLink to="/help" class="btn btn-primary btn-lg">
          Voir la FAQ complète
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: '',
  newsletter: false
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    // Simulation d'envoi (à remplacer par un vrai appel API)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Reset du formulaire
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
      newsletter: false
    }
    
    // Notification de succès (à implémenter avec un toast)
    alert('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.')
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error)
    alert('Erreur lors de l\'envoi du message. Veuillez réessayer.')
  } finally {
    isSubmitting.value = false
  }
}
</script>
