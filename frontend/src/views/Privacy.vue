<template>
  <div class="min-h-screen bg-base-100">
    <!-- Hero Section -->
    <section class="hero py-20 bg-gradient-to-r from-primary to-secondary text-primary-content">
      <div class="hero-content text-center">
        <div class="max-w-4xl">
          <h1 class="text-4xl sm:text-5xl font-bold mb-6">
            Politique de confidentialité
          </h1>
          <p class="text-xl opacity-90">
            Dernière mise à jour : {{ lastUpdated }}
          </p>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto prose prose-lg">
          <h2>1. Introduction</h2>
          <p>
            MoodFlow s'engage à protéger votre vie privée et vos données personnelles. 
            Cette politique de confidentialité explique comment nous collectons, utilisons 
            et protégeons vos informations lorsque vous utilisez notre application.
          </p>

          <h2>2. Données collectées</h2>
          <h3>2.1 Données d'authentification</h3>
          <ul>
            <li>Adresse email</li>
            <li>Nom d'affichage (optionnel)</li>
            <li>Mot de passe (chiffré)</li>
          </ul>

          <h3>2.2 Données d'humeur</h3>
          <ul>
            <li>Scores d'humeur (1-5)</li>
            <li>Notes personnelles</li>
            <li>Tags et catégories</li>
            <li>Métadonnées (météo, activités, etc.)</li>
          </ul>

          <h3>2.3 Données techniques</h3>
          <ul>
            <li>Adresse IP (anonymisée)</li>
            <li>Type de navigateur</li>
            <li>Données d'utilisation (anonymisées)</li>
          </ul>

          <h2>3. Utilisation des données</h2>
          <p>Nous utilisons vos données pour :</p>
          <ul>
            <li>Fournir les fonctionnalités de l'application</li>
            <li>Générer des analyses et insights personnalisés</li>
            <li>Améliorer l'expérience utilisateur</li>
            <li>Assurer la sécurité de l'application</li>
            <li>Respecter nos obligations légales</li>
          </ul>

          <h2>4. Partage des données</h2>
          <p>
            <strong>Nous ne vendons jamais vos données personnelles.</strong> 
            Nous ne partageons vos informations qu'avec :
          </p>
          <ul>
            <li>Nos prestataires de services (Supabase, OpenAI) sous contrat strict</li>
            <li>Les autorités compétentes si requis par la loi</li>
          </ul>

          <h2>5. Sécurité</h2>
          <p>Nous mettons en place des mesures de sécurité robustes :</p>
          <ul>
            <li>Chiffrement de bout en bout</li>
            <li>Row Level Security (RLS) sur la base de données</li>
            <li>Authentification sécurisée</li>
            <li>Audits de sécurité réguliers</li>
            <li>Accès restreint aux données</li>
          </ul>

          <h2>6. Vos droits (RGPD)</h2>
          <p>Conformément au RGPD, vous avez le droit de :</p>
          <ul>
            <li><strong>Accès :</strong> Consulter vos données</li>
            <li><strong>Rectification :</strong> Corriger vos données</li>
            <li><strong>Effacement :</strong> Supprimer vos données</li>
            <li><strong>Portabilité :</strong> Exporter vos données</li>
            <li><strong>Limitation :</strong> Limiter le traitement</li>
            <li><strong>Opposition :</strong> Vous opposer au traitement</li>
          </ul>

          <h2>7. Conservation des données</h2>
          <p>
            Nous conservons vos données tant que votre compte est actif. 
            Vous pouvez supprimer votre compte à tout moment, ce qui entraînera 
            la suppression de toutes vos données personnelles dans un délai de 30 jours.
          </p>

          <h2>8. Cookies</h2>
          <p>
            Nous utilisons des cookies essentiels pour le fonctionnement de l'application. 
            Aucun cookie de tracking ou de publicité n'est utilisé.
          </p>

          <h2>9. Modifications</h2>
          <p>
            Nous pouvons modifier cette politique de confidentialité. 
            Les modifications importantes vous seront notifiées par email 
            ou via l'application.
          </p>

          <h2>10. Contact</h2>
          <p>
            Pour toute question concernant cette politique de confidentialité, 
            contactez-nous à : <a href="mailto:privacy@moodflow.app" class="link link-primary">privacy@moodflow.app</a>
          </p>

          <div class="alert alert-info mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="font-bold">Note importante</h3>
              <div class="text-xs">
                Cette politique de confidentialité est conforme au RGPD et aux standards 
                de sécurité les plus élevés. Votre bien-être et votre vie privée sont 
                notre priorité absolue.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const lastUpdated = '16 Janvier 2024'
</script>
