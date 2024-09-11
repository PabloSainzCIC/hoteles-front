<template>
    <div>
      <h1>Habitaciones</h1>
      <table>
        <thead>
          <tr>
            <th class="nowrap">Hotel</th>
            <th class="right-align nowrap">Planta</th>
            <th class="right-align nowrap">Número</th>
            <th class="nowrap">Pasillo</th>
            <th class="nowrap">Tipo</th>
            <th class="nowrap">Descripción</th>
            <th class="nowrap">Disponible</th>
            <th class="right-align nowrap">€/Noche</th>
            <th class="nowrap">Calefacción</th>
            <th class="nowrap">Aire Acondicionado</th>
            <th class="nowrap">Nevera</th>
            <th class="right-align nowrap">m²</th>
            <th class="right-align nowrap">Capacidad Máxima</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="habitacion in habitaciones" :key="habitacion.id">
            <td class="nowrap">{{ habitacion.hotel }}</td>
            <td class="right-align nowrap">{{ habitacion.planta }}</td>
            <td class="right-align nowrap">{{ habitacion.numHabitacion }}</td>
            <td class="nowrap">{{ habitacion.pasillo }}</td>
            <td class="nowrap">{{ habitacion.tipoHabitacion.nombreTipo }}</td>
            <td class="nowrap">{{ habitacion.descripcion }}</td>
            <td class="nowrap">{{ habitacion.disponible ? 'Sí' : 'No' }}</td>
            <td class="right-align nowrap">{{ habitacion.precioNoche.toFixed(2) }} €</td>
            <td class="nowrap">{{ habitacion.calefaccion ? 'Sí' : 'No' }}</td>
            <td class="nowrap">{{ habitacion.aireAcondicionado ? 'Sí' : 'No' }}</td>
            <td class="nowrap">{{ habitacion.nevera ? 'Sí' : 'No' }}</td>
            <td class="right-align nowrap">{{ habitacion.metrosCuadrados }} m²</td>
            <td class="right-align nowrap">{{ habitacion.capacidadMaxima }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'HabitacionesList',
    data() {
      return {
        habitaciones: [], // Inicialmente vacío, se llenará con los datos de la API
      };
    },
    mounted() {
      this.fetchHabitaciones(); // Llamada al método cuando el componente se monta
    },
    methods: {
      async fetchHabitaciones() {
        try {
          const response = await axios.get('/api/habitaciones');
          this.habitaciones = response.data; // Asignar los datos de la respuesta a la variable 'habitaciones'
        } catch (error) {
          console.error("Error al obtener las habitaciones:", error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  /* Asegura que la tabla comience más hacia la izquierda */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 2rem;
    margin-left: 0; /* Eliminar margen izquierdo */
  }
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ccc;
  }
  
  /* Asegura que el contenido no se divida en múltiples líneas */
  .nowrap {
    white-space: nowrap;
  }
  
  th {
    background-color: #f9f9f9;
  }
  
  tbody tr:hover {
    background-color: #f1f1f1;
  }
  
  /* Alineación a la derecha para columnas específicas */
  .right-align {
    text-align: right;
  }
  </style>
  