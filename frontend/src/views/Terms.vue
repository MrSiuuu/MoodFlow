<template>
  <div class="min-h-screen bg-base-100">
    <!-- Hero Section -->
    <section class="hero py-20 bg-gradient-to-r from-primary to-secondary text-primary-content">
      <div class="hero-content text-center">
        <div class="max-w-4xl">
          <h1 class="text-4xl sm:text-5xl font-bold mb-6">
            Conditions d'utilisation
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
          <h2>1. Acceptation des conditions</h2>
          <p>
            En utilisant MoodFlow, vous acceptez d'être lié par ces conditions d'utilisation. 
            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
          </p>

          <h2>2. Description du service</h2>
          <p>
            MoodFlow est une application web gratuite qui permet aux utilisateurs de :
          </p>
          <ul>
            <li>Enregistrer et suivre leur humeur quotidienne</li>
            <li>Analyser leurs tendances d'humeur</li>
            <li>Recevoir des conseils personnalisés via l'IA</li>
            <li>Visualiser leurs données sous forme de graphiques</li>
          </ul>

          <h2>3. Utilisation acceptable</h2>
          <h3>3.1 Utilisations autorisées</h3>
          <ul>
            <li>Utilisation personnelle et non commerciale</li>
            <li>Respect des droits d'autrui</li>
            <li>Conformité aux lois applicables</li>
          </ul>

          <h3>3.2 Utilisations interdites</h3>
          <ul>
            <li>Utilisation à des fins illégales ou nuisibles</li>
            <li>Tentative de contourner les mesures de sécurité</li>
            <li>Transmission de contenu offensant ou inapproprié</li>
            <li>Utilisation automatisée non autorisée</li>
          </ul>

          <h2>4. Compte utilisateur</h2>
          <p>
            Pour utiliser MoodFlow, vous devez créer un compte en fournissant des informations 
            exactes et à jour. Vous êtes responsable de la sécurité de votre compte et de 
            toutes les activités qui s'y déroulent.
          </p>

          <h2>5. Propriété intellectuelle</h2>
          <p>
            MoodFlow et son contenu sont protégés par les droits d'auteur et autres lois 
            sur la propriété intellectuelle. Vous ne pouvez pas copier, modifier ou 
            distribuer notre contenu sans autorisation.
          </p>

          <h2>6. Données et confidentialité</h2>
          <p>
            Vos données personnelles sont traitées conformément à notre 
            <RouterLink to="/privacy" class="link link-primary">Politique de confidentialité</RouterLink>. 
            Vous conservez la propriété de vos données d'humeur.
          </p>

          <h2>7. Disponibilité du service</h2>
          <p>
            Nous nous efforçons de maintenir MoodFlow disponible 24h/24, 7j/7, mais nous ne 
            pouvons garantir une disponibilité ininterrompue. Des interruptions peuvent 
            survenir pour maintenance ou raisons techniques.
          </p>

          <h2>8. Limitation de responsabilité</h2>
          <p>
            MoodFlow est fourni "en l'état". Nous ne garantissons pas que le service 
            répondra à vos besoins ou sera exempt d'erreurs. Nous ne sommes pas responsables 
            des dommages indirects ou consécutifs.
          </p>

          <h2>9. Modifications du service</h2>
          <p>
            Nous nous réservons le droit de modifier, suspendre ou interrompre tout ou 
            partie du service à tout moment, avec ou sans préavis.
          </p>

          <h2>10. Résiliation</h2>
          <p>
            Vous pouvez supprimer votre compte à tout moment. Nous pouvons suspendre ou 
            résilier votre accès en cas de violation de ces conditions.
          </p>

          <h2>11. Droit applicable</h2>
          <p>
            Ces conditions sont régies par le droit français. Tout litige sera soumis 
            à la juridiction des tribunaux français.
          </p>

          <h2>12. Contact</h2>
          <p>
            Pour toute question concernant ces conditions d'utilisation, 
            contactez-nous à : <a href="mailto:legal@moodflow.app" class="link link-primary">legal@moodflow.app</a>
          </p>

          <div class="alert alert-warning mt-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <div>
              <h3 class="font-bold">Avertissement médical</h3>
              <div class="text-xs">
                MoodFlow est un outil de suivi personnel et ne remplace pas un avis médical professionnel. 
                En cas de préoccupations concernant votre santé mentale, consultez un professionnel qualifié.
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
