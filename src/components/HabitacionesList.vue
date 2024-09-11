<template>
  <div class="container">
    <h1>Habitaciones</h1>
    <div class="main-content">
      <div class="table-container">
        <div class="button-container" style="margin-top: 10px;">
          <button class="btn" @click="startCreating">Crear</button>
          <button class="btn" :disabled="!isDeleteEnabled" @click="openDeleteModal">Eliminar</button>
        </div>
        <table class="habitaciones-table">
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
            <tr v-for="habitacion in habitaciones" :key="habitacion.id" @click="selectHabitacion(habitacion)">
              <td class="nowrap">{{ habitacion.hotel }}</td>
              <td class="right-align nowrap">{{ habitacion.planta }}</td>
              <td class="right-align nowrap">{{ habitacion.numHabitacion }}</td>
              <td class="nowrap">{{ habitacion.pasillo }}</td>
              <td class="nowrap">{{ habitacion.tipoHabitacion.nombreTipo }}</td>
              <td class="nowrap" :title="habitacion.descripcion">{{ habitacion.descripcion.length > 20 ? habitacion.descripcion.substring(0, 20) + '...' : habitacion.descripcion }}</td>
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
      <!-- Nueva sección para detalles -->
      <div class="details-container" style="margin-top: 10px;">
        <h2>{{ isCreating ? 'Nueva Habitación' : 'Detalles de la Habitación' }}</h2>
        <div class="form-group">
          <label for="hotel">Hotel:</label>
          <input id="hotel" v-model="selectedHabitacion.hotel" type="text" :disabled="!isDetailsEnabled" />
        </div>
        <div class="form-group">
          <label for="planta">Planta:</label>
          <input id="planta" v-model="selectedHabitacion.planta" type="number" :disabled="!isDetailsEnabled" />
        </div>
        <div class="form-group">
          <label for="numHabitacion">Número:</label>
          <input id="numHabitacion" v-model="selectedHabitacion.numHabitacion" type="number" :disabled="!isDetailsEnabled" />
        </div>
        <div class="form-group">
          <label for="pasillo">Pasillo:</label>
          <input id="pasillo" v-model="selectedHabitacion.pasillo" type="text" :disabled="!isDetailsEnabled" />
        </div>
        <div class="form-group">
          <label for="tipoHabitacion">Tipo:</label>
          <input id="tipoHabitacion" v-model="selectedHabitacion.tipoHabitacion.nombreTipo" type="text" :disabled="!isDetailsEnabled" />
        </div>
        <div class="form-group">
          <label for="descripcion">Descripción:</label>
          <input id="descripcion" v-model="selectedHabitacion.descripcion" type="text" :disabled="!isDetailsEnabled" />
        </div>
        <div class="form-group">
          <label for="disponible">Disponible:</label>
          <input id="disponible" v-model="selectedHabitacion.disponible" type="checkbox" :disabled="!isDetailsEnabled" />
        </div>
        <div class="form-group">
          <label for="precioNoche">€/Noche:</label>
          <input id="precioNoche" v-model="selectedHabitacion.precioNoche" type="number" :disabled="!isDetailsEnabled" />
        </div>
        <div class="form-group">
          <label for="calefaccion">Calefacción:</label>
          <input id="calefaccion" v-model="selectedHabitacion.calefaccion" type="checkbox" :disabled="!isDetailsEnabled" />
        </div>
        <div class="form-group">
          <label for="aireAcondicionado">Aire Acondicionado:</label>
          <input id="aireAcondicionado" v-model="selectedHabitacion.aireAcondicionado" type="checkbox" :disabled="!isDetailsEnabled" />
        </div>
        <div class="form-group">
          <label for="nevera">Nevera:</label>
          <input id="nevera" v-model="selectedHabitacion.nevera" type="checkbox" :disabled="!isDetailsEnabled" />
        </div>
        <div class="form-group">
          <label for="metrosCuadrados">m²:</label>
          <div class="input-with-unit small-input">
            <input id="metrosCuadrados" v-model="selectedHabitacion.metrosCuadrados" type="number" :disabled="!isDetailsEnabled" />
            <span>m²</span>
          </div>
        </div>
        <div class="form-group">
          <label for="capacidadMaxima">Capacidad Máxima:</label>
          <input id="capacidadMaxima" v-model="selectedHabitacion.capacidadMaxima" type="number" :disabled="!isDetailsEnabled" />
        </div>
        <div class="button-container">
          <button class="btn btn-apply" @click="isCreating ? saveNewHabitacion() : applyChanges()" :disabled="!isDetailsEnabled">{{ isCreating ? 'Guardar' : 'Guardar' }}</button>
          <button class="btn btn-cancel" @click="cancelChanges" :disabled="!isDetailsEnabled">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h2>Confirmar Eliminación</h2>
        <p>¿Está seguro de que desea eliminar la habitación "{{ selectedHabitacion?.numHabitacion }}"?</p>
        <button class="btn btn-confirm" @click="deleteHabitacion">Eliminar</button>
        <button class="btn btn-cancel" @click="closeDeleteModal">Cancelar</button>
      </div>
    </div>

    <!-- Modal de error -->
    <div v-if="isErrorModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h2>Error</h2>
        <p>Esta habitación no se puede eliminar porque tiene registros asociados.</p>
        <button class="btn btn-confirm" @click="closeErrorModal">Aceptar</button>
      </div>
    </div>

    <!-- Toast de notificación -->
    <div v-if="isToastVisible" class="toast">
      <p>{{ toastMessage }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'HabitacionesList',
  setup() {
    const habitaciones = ref([]);
    const selectedHabitacion = ref({
      hotel: '',
      planta: 0,
      numHabitacion: 0,
      pasillo: '',
      tipoHabitacion: { nombreTipo: '' },
      descripcion: '',
      disponible: false,
      precioNoche: 0,
      calefaccion: false,
      aireAcondicionado: false,
      nevera: false,
      metrosCuadrados: 0,
      capacidadMaxima: 0,
    });
    const originalHabitacion = ref(null);
    const isModalOpen = ref(false);
    const isErrorModalOpen = ref(false);
    const isCreating = ref(false);
    const isToastVisible = ref(false);
    const isDetailsEnabled = ref(false);
    const isDeleteEnabled = ref(false);
    const toastMessage = ref('');

    onMounted(async () => {
      try {
        const response = await axios.get('/api/habitaciones');
        habitaciones.value = response.data;
      } catch (error) {
        console.error('Error al obtener las habitaciones:', error);
      }
    });

    const selectHabitacion = (habitacion) => {
      selectedHabitacion.value = { ...habitacion };
      originalHabitacion.value = { ...habitacion };
      isCreating.value = false;
      isDetailsEnabled.value = true;
      isDeleteEnabled.value = true;
    };

    const startCreating = () => {
      selectedHabitacion.value = {
        hotel: '',
        planta: 0,
        numHabitacion: 0,
        pasillo: '',
        tipoHabitacion: { nombreTipo: '' },
        descripcion: '',
        disponible: false,
        precioNoche: 0,
        calefaccion: false,
        aireAcondicionado: false,
        nevera: false,
        metrosCuadrados: 0,
        capacidadMaxima: 0,
      };
      isCreating.value = true;
      isDetailsEnabled.value = true;
      isDeleteEnabled.value = false;
    };

    const openDeleteModal = () => {
      if (selectedHabitacion.value) {
        isModalOpen.value = true;
      }
    };

    const closeDeleteModal = () => {
      isModalOpen.value = false;
    };

    const closeErrorModal = () => {
      isErrorModalOpen.value = false;
    };

    const deleteHabitacion = async () => {
      if (selectedHabitacion.value) {
        try {
          await axios.delete(`/api/habitaciones/${selectedHabitacion.value.id}`);
          habitaciones.value = habitaciones.value.filter(habitacion => habitacion.id !== selectedHabitacion.value.id);
          selectedHabitacion.value = {
            hotel: '',
            planta: 0,
            numHabitacion: 0,
            pasillo: '',
            tipoHabitacion: { nombreTipo: '' },
            descripcion: '',
            disponible: false,
            precioNoche: 0,
            calefaccion: false,
            aireAcondicionado: false,
            nevera: false,
            metrosCuadrados: 0,
            capacidadMaxima: 0,
          };
          closeDeleteModal();
          isDetailsEnabled.value = false;
          isDeleteEnabled.value = false;
        } catch (error) {
          if (error.response && error.response.status === 409) {
            isErrorModalOpen.value = true;
          } else {
            console.error('Error al eliminar la habitación:', error);
          }
        }
      }
    };

    const applyChanges = async () => {
      if (selectedHabitacion.value) {
        try {
          await axios.put(`/api/habitaciones/${selectedHabitacion.value.id}`, selectedHabitacion.value);
          // Refresh the list of habitaciones
          const response = await axios.get('/api/habitaciones');
          habitaciones.value = response.data;
          originalHabitacion.value = { ...selectedHabitacion.value };
          toastMessage.value = 'Registro modificado exitosamente';
          showToast();
        } catch (error) {
          console.error('Error al actualizar la habitación:', error);
        }
      }
    };

    const saveNewHabitacion = async () => {
      try {
        await axios.post('/api/habitaciones', selectedHabitacion.value);
        const response = await axios.get('/api/habitaciones');
        habitaciones.value = response.data;
        toastMessage.value = 'Nuevo registro creado exitosamente';
        showToast();
        cancelChanges();
      } catch (error) {
        console.error('Error al crear la nueva habitación:', error);
      }
    };

    const cancelChanges = () => {
      if (originalHabitacion.value) {
        selectedHabitacion.value = { ...originalHabitacion.value };
      } else {
        selectedHabitacion.value = {
          hotel: '',
          planta: 0,
          numHabitacion: 0,
          pasillo: '',
          tipoHabitacion: { nombreTipo: '' },
          descripcion: '',
          disponible: false,
          precioNoche: 0,
          calefaccion: false,
          aireAcondicionado: false,
          nevera: false,
          metrosCuadrados: 0,
          capacidadMaxima: 0,
        };
      }
      isCreating.value = false;
      isDetailsEnabled.value = false;
      isDeleteEnabled.value = false;
    };

    const showToast = () => {
      isToastVisible.value = true;
      setTimeout(() => {
        isToastVisible.value = false;
      }, 3000);
    };

    return {
      habitaciones,
      selectedHabitacion,
      originalHabitacion,
      isModalOpen,
      isErrorModalOpen,
      isCreating,
      isToastVisible,
      isDetailsEnabled,
      isDeleteEnabled,
      toastMessage,
      selectHabitacion,
      startCreating,
      openDeleteModal,
      closeDeleteModal,
      closeErrorModal,
      deleteHabitacion,
      applyChanges,
      saveNewHabitacion,
      cancelChanges,
      showToast
    };
  }
}
</script>

<style scoped>
.container {
  padding: 0px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.main-content {
  display: flex;
  align-items: flex-start; /* Alinea los elementos al principio del contenedor principal */
}

.table-container {
  flex: 1; /* Permite que el contenedor de la tabla ocupe el espacio disponible */
  margin-right: 1rem;
  margin-top: 0; /* Elimina el margen superior */
  min-width: 700px;
}

.habitaciones-table {
  width: 100%;
  border-collapse: collapse;
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

tbody tr.selected {
  background-color: #d1e7dd;
}

.button-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #0056b3;
}

.btn:disabled {
  background-color: #d6d6d6;
  cursor: not-allowed;
}

/* Estilo para el modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}

.btn-confirm {
  background-color: #dc3545;
}

.btn-confirm:hover {
  background-color: #c82333;
}
.btn-cancel {
  background-color: #6c757d;
}

.btn-cancel:hover {
  background-color: #5a6268;
}

/* Estilo para la sección de detalles */
.details-container {
  flex: 1; /* Permite que el contenedor de detalles ocupe el espacio disponible */
  min-width: 400px; /* Ajusta el ancho mínimo si es necesario */
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  margin-left: 1rem; /* Ajustado para mejor alineación */
  margin-top: 0; /* Elimina el margen superior */
  min-width: 700px;
}

.details-container h2 {
  margin-top: 0;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-with-unit.small-input input {
  width: 80px; /* Ajusta el ancho según sea necesario */
}

.button-container {
  display: flex;
  gap: 0.5rem;
  margin-top: 0px;
}

.btn-apply {
  background-color: #28a745;
}

.btn-apply:hover {
  background-color: #218838;
}

.btn-cancel {
  background-color: #6c757d;
}

.btn-cancel:hover {
  background-color: #5a6268;
}

/* Estilo para el Toast */
.toast {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background-color: #28a745;
  color: white;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>