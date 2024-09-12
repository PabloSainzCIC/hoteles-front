<template>
  <div class="container" style="margin-top: 90px;">
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
              <th>Hotel</th>
              <th>Planta</th>
              <th>Número</th>
              <th>Pasillo</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Precio/Noche</th>
              <th>Superficie</th>
              <th>Capacidad Máxima</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="habitacion in habitaciones" 
              :key="habitacion.id"
              :class="{ selected: selectedHabitacion && selectedHabitacion.id === habitacion.id }"
              @click="selectHabitacion(habitacion)"
            >
              <td>{{ habitacion.hotel }}</td>
              <td>{{ habitacion.planta }}</td>
              <td>{{ habitacion.numHabitacion }}</td>
              <td>{{ habitacion.pasillo }}</td>
              <td>{{ habitacion.tipoHabitacion.nombreTipo }}</td>
              <td class="nowrap" :title="habitacion.descripcion">{{ habitacion.descripcion.length > 20 ? habitacion.descripcion.substring(0, 20) + '...' : habitacion.descripcion }}</td>
              <td>{{ habitacion.precioNoche }} €</td>
              <td>{{ habitacion.metrosCuadrados }} m²</td>
              <td>{{ habitacion.capacidadMaxima }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Nueva sección para detalles -->
      <div class="details-container" style="margin-top: 50px; margin-bottom: 100px;margin-left: 50px">
        <h2>{{ isCreating ? 'Nuevo' : 'Modificación' }}</h2>
        <div class="form-group">
          <label for="hotel">Hotel:</label>
          <input id="hotel" v-model="selectedHabitacion.hotel" type="text" :disabled="!isDetailsEnabled" />
          <span v-if="!selectedHabitacion.hotel && isDetailsEnabled" class="error-message">El nombre del hotel es obligatorio</span>
        </div>
        <div class="form-group">
          <label for="planta">Planta:</label>
          <input id="planta" v-model="selectedHabitacion.planta" type="number" class="small-input right-align" :disabled="!isDetailsEnabled" />
          <span v-if="selectedHabitacion.planta <= 0 && isDetailsEnabled" class="error-message">La planta debe ser mayor que 0</span>
        </div>
        <div class="form-group">
          <label for="numHabitacion">Número:</label>
          <input id="numHabitacion" v-model="selectedHabitacion.numHabitacion" type="number" class="small-input right-align" :disabled="!isDetailsEnabled" />
          <span v-if="selectedHabitacion.numHabitacion <= 0 && isDetailsEnabled" class="error-message">El número de habitación debe ser mayor que 0</span>
        </div>
        <div class="form-group">
          <label for="pasillo">Pasillo:</label>
          <input id="pasillo" v-model="selectedHabitacion.pasillo" type="number" class="small-input right-align" :disabled="!isDetailsEnabled" />
          <span v-if="selectedHabitacion.pasillo <= 0 && isDetailsEnabled" class="error-message">El número de pasillo debe ser mayor que 0</span>
        </div>
        <div class="form-group">
          <label for="tipoHabitacion">Tipo:</label>
          <select id="tipoHabitacion" v-model="selectedHabitacion.tipoHabitacion.id" :disabled="!isDetailsEnabled">
            <option value="" disabled>Seleccione un tipo</option>
            <option v-for="tipo in tiposHabitacion" :key="tipo.id" :value="tipo.id">{{ tipo.nombreTipo }}</option>
          </select>
          <span v-if="!selectedHabitacion.tipoHabitacion.id && isDetailsEnabled" class="error-message">El tipo de habitación es obligatorio</span>
        </div>
        <div class="form-group">
          <label for="descripcion">Descripción:</label>
          <input id="descripcion" v-model="selectedHabitacion.descripcion" type="text" :disabled="!isDetailsEnabled" />
        </div>
        <div class="form-group">
          <label for="disponible">Disponible:
            <input id="disponible" v-model="selectedHabitacion.disponible" type="checkbox" :disabled="!isDetailsEnabled" class="checkbox-left" />
          </label>
        </div>
        <div class="form-group">
          <label for="precioNoche">Precio/Noche:</label>
          <input id="precioNoche" v-model="selectedHabitacion.precioNoche" type="number" class="small-input right-align" :disabled="!isDetailsEnabled" />
          <span v-if="selectedHabitacion.precioNoche <= 0 && isDetailsEnabled" class="error-message">El precio por noche debe ser mayor que 0</span>
        </div>
        <div class="form-group">
          <label for="calefaccion">Calefacción:
            <input id="calefaccion" v-model="selectedHabitacion.calefaccion" type="checkbox" :disabled="!isDetailsEnabled" class="checkbox-left" />
          </label>
        </div>
        <div class="form-group">
          <label for="aireAcondicionado">Aire Acondicionado:
            <input id="aireAcondicionado" v-model="selectedHabitacion.aireAcondicionado" type="checkbox" :disabled="!isDetailsEnabled" class="checkbox-left" />
          </label>
        </div>
        <div class="form-group">
          <label for="nevera">Nevera:
            <input id="nevera" v-model="selectedHabitacion.nevera" type="checkbox" :disabled="!isDetailsEnabled" class="checkbox-left" />
          </label>
        </div>
        <div class="form-group">
          <label for="metrosCuadrados">Superficie:</label>
          <div class="input-with-unit small-input">
            <input id="metrosCuadrados" v-model="selectedHabitacion.metrosCuadrados" type="number" class="right-align" :disabled="!isDetailsEnabled" />
            <span>m²</span>
          </div>
          <span v-if="selectedHabitacion.metrosCuadrados <= 0 && isDetailsEnabled" class="error-message">La superficie debe ser mayor que 0</span>
        </div>
        <div class="form-group">
          <label for="capacidadMaxima">Capacidad Máxima:</label>
          <input id="capacidadMaxima" v-model="selectedHabitacion.capacidadMaxima" type="number" class="small-input right-align" :disabled="!isDetailsEnabled" />
          <span v-if="selectedHabitacion.capacidadMaxima <= 0 && isDetailsEnabled" class="error-message">La capacidad máxima debe ser mayor que 0</span>
        </div>
        <div class="button-container">
          <button class="btn btn-apply" @click="isCreating ? saveNewHabitacion() : applyChanges()" :disabled="!isFormValid">
            {{ isCreating ? 'Guardar' : 'Guardar' }}
          </button>
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
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

export default {
  name: 'HabitacionesList',
  setup() {
    const habitaciones = ref([]);
    const tiposHabitacion = ref([]);
    const defaultHabitacion = {
      hotel: '',
      planta: 0,
      numHabitacion: 0,
      pasillo: 0,
      tipoHabitacion: { id: '', nombreTipo: '' },
      descripcion: '',
      disponible: false,
      precioNoche: 0,
      calefaccion: false,
      aireAcondicionado: false,
      nevera: false,
      metrosCuadrados: 0,
      capacidadMaxima: 0,
    };
    const selectedHabitacion = ref({ ...defaultHabitacion });
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
        const responseHabitaciones = await axios.get('/api/habitaciones');
        habitaciones.value = responseHabitaciones.data;

        const responseTipos = await axios.get('/api/tipo-habitaciones');
        tiposHabitacion.value = responseTipos.data;
      } catch (error) {
        console.error('Error al obtener los datos:', error);
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
      selectedHabitacion.value = { ...defaultHabitacion };
      isCreating.value = true;
      isDetailsEnabled.value = true;
      isDeleteEnabled.value = false;
    };

    const applyChanges = async () => {
      if (selectedHabitacion.value) {
        try {
          await axios.put(`/api/habitaciones/${selectedHabitacion.value.id}`, selectedHabitacion.value);
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

    const deleteHabitacion = async () => {
      if (selectedHabitacion.value && selectedHabitacion.value.id) {
        try {
          await axios.delete(`/api/habitaciones/${selectedHabitacion.value.id}`);
          const response = await axios.get('/api/habitaciones');
          habitaciones.value = response.data;
          toastMessage.value = 'Registro eliminado exitosamente';
          showToast();
          closeDeleteModal();
          cancelChanges();
        } catch (error) {
          console.error('Error al eliminar la habitación:', error);
          isErrorModalOpen.value = true;
        }
      }
    };

    const cancelChanges = () => {
      selectedHabitacion.value = { ...defaultHabitacion };
      originalHabitacion.value = null;
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

    const openDeleteModal = () => {
      isModalOpen.value = true;
    };

    const closeDeleteModal = () => {
      isModalOpen.value = false;
    };

    const closeErrorModal = () => {
      isErrorModalOpen.value = false;
    };

    const isFormValid = computed(() => {
      return selectedHabitacion.value.hotel &&
        selectedHabitacion.value.planta > 0 &&
        selectedHabitacion.value.numHabitacion > 0 &&
        selectedHabitacion.value.pasillo >= 0 &&
        selectedHabitacion.value.tipoHabitacion.id &&
        selectedHabitacion.value.precioNoche > 0 &&
        selectedHabitacion.value.metrosCuadrados > 0 &&
        selectedHabitacion.value.capacidadMaxima > 0;
    });

    return {
      habitaciones,
      tiposHabitacion,
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
      applyChanges,
      saveNewHabitacion,
      deleteHabitacion,
      cancelChanges,
      showToast,
      openDeleteModal,
      closeDeleteModal,
      closeErrorModal,
      isFormValid
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
.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
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
.input-with-unit {
  display: flex;
  align-items: center;
}
.input-with-unit.small-input input {
  width: 80px; /* Ajusta el ancho según sea necesario */
}

.button-container {
  display: flex;
  gap: 0.5rem;
  margin-top: 0px;
}
.small-input {
  width: 80px; /* Ajusta el ancho según sea necesario */
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
.right-align {
  text-align: right;
}

.checkbox-container {
  display: flex;
  align-items: center;
}

.checkbox-left {
  margin-left: 0;
  margin-top: 0.5rem;
}
.btn-cancel:hover {
  background-color: #5a6268;
}

/* Estilo para el Toast */
.toast {
  position: fixed;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  background-color: #28a745;
  color: white;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 9999; /* Asegura que el toast esté por encima de otros elementos */
}
</style>