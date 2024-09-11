<template>
    <div>
         <TiposList />
    </div>
  </template>
  
  <script>
  import TiposList from '@/components/TiposList.vue'; 
  import axios from 'axios';
  
  export default {
    components: {
      TiposList
    }
  }
  </script>
  
  <style scoped>
  h1 {
    font-size: 2rem;
    margin-bottom: 0px;
  }
  
  p {
    margin-bottom: 0px;
  }
  </style>