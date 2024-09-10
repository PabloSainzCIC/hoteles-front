<template>
    <div>
     <h1>Habitaciones</h1>
      <table>
        <thead>
          <tr>
            <th>Hotel</th>
            <th>Planta</th>
            <th>Número de Habitación</th>
            <th>Pasillo</th>
            <th>Tipo de Habitación</th>
            <th>Descripción</th>
            <th>Disponible</th>
            <th>Precio por Noche</th>
            <th>Calefacción</th>
            <th>Aire Acondicionado</th>
            <th>Nevera</th>
            <th>Metros Cuadrados</th>
            <th>Capacidad Máxima</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="habitacion in habitaciones" :key="habitacion.id">
            <td>{{ habitacion.hotel }}</td>
            <td>{{ habitacion.planta }}</td>
            <td>{{ habitacion.numHabitacion }}</td>
            <td>{{ habitacion.pasillo }}</td>
            <td>{{ habitacion.tipoHabitacion.nombreTipo }}</td>
            <td>{{ habitacion.descripcion }}</td>
            <td>{{ habitacion.disponible ? 'Sí' : 'No' }}</td>
            <td>\${{ habitacion.precioNoche.toFixed(2) }}</td>
            <td>{{ habitacion.calefaccion ? 'Sí' : 'No' }}</td>
            <td>{{ habitacion.aireAcondicionado ? 'Sí' : 'No' }}</td>
            <td>{{ habitacion.nevera ? 'Sí' : 'No' }}</td>
            <td>{{ habitacion.metrosCuadrados }} m²</td>
            <td>{{ habitacion.capacidadMaxima }}</td>
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
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 2rem;
  }
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ccc;
  }
  
  th {
    background-color: #f9f9f9;
  }
  
  tbody tr:hover {
    background-color: #f1f1f1;
  }
  </style>
  