<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute();
</script>

<template>
  <nav class="nav">
    <RouterLink to="/tipos" class="nav-link">TIPOS</RouterLink>
    <RouterLink to="/habitaciones" class="nav-link">HABITACIONES</RouterLink>
  </nav>

  <main>
    <!-- Mostrar la imagen solo en la ruta / -->
    <img v-if="route.path === '/'" src="/DALL·E 2024-09-12 17.35.29 - A luxury modern hotel with a sleek glass facade, located by the ocean with palm trees and a sunset in the background. The hotel has a stylish entrance.webp" alt="Imagen de Inicio" class="full-screen-image" />
    <RouterView />
  </main>

  <footer class="footer">
    <a href="#" class="footer-link">Política de privacidad</a>
    <a href="#" class="footer-link">Términos de servicio</a>
    <a href="#" class="footer-link">Contacto</a>
    <a href="#" class="footer-link">Acerca de</a>
  </footer>
</template>

<style scoped>
/* Estilo de la imagen de inicio para ocupar toda la pantalla */
.full-screen-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Asegura que la imagen cubra toda la pantalla sin distorsionarse */
  z-index: -1; /* Coloca la imagen detrás de otros elementos */
}

/* Estilo de la barra de navegación */
.nav {
  display: flex;
  justify-content: center;
  background-color: #007bff; /* Color de fondo de la tira de navegación */
  padding: 0.5rem 0;
  position: fixed; /* Fija la tira de navegación en la parte superior */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* Asegura que la tira de navegación esté sobre otros elementos */
}

/* Estilo de los enlaces de navegación */
.nav-link {
  text-decoration: none;
  color: #ffffff;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.nav-link:hover, .nav-link.router-link-exact-active {
  color: #ffffff;
  background-color: #0056b3; /* Color de fondo al pasar el ratón o cuando está activo */
}

/* Estilo del pie de página */
.footer {
  display: flex;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 1rem 0;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* Asegura que el pie de página esté sobre otros elementos */
}

/* Estilo de los enlaces del pie de página */
.footer-link {
  text-decoration: none;
  color: #007bff;
  font-weight: 500;
  padding: 0.5rem 1rem;
  transition: color 0.3s;
}
</style>