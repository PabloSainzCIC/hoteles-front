<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>

    <nav class="nav">
      <RouterLink to="/tipos" class="nav-link">TIPOS</RouterLink>
      <RouterLink to="/habitaciones" class="nav-link">HABITACIONES</RouterLink>
    </nav>
  


  <main>
    <RouterView />
  </main>
</template>

<style scoped>


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



/* Responsividad para pantallas grandes */
@media (min-width: 1024px) {
  .nav {
    gap: 2rem;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
  }
}
</style>
