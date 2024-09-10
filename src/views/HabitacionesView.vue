<template>
    <div>
       <HabitacionesList />
    </div>
  </template>
  
  <script>
  import HabitacionesList from '@/components/HabitacionesList.vue'; // Asegúrate de tener un componente que maneje esto.
  
  export default {
    components: {
      HabitacionesList
    }
  }
  </script>
  
  <style scoped>
  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 2rem;
  }
  </style>
  