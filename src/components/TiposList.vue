<template>
  <div class="container">
    <h1>Tipos de Habitación</h1>
    <div class="main-content">
      <div class="table-container">
        <div class="button-container">
          <button class="btn" @click="startCreating">Crear</button>
          <button class="btn" :disabled="!isDeleteEnabled" @click="openDeleteModal">Eliminar</button>
        </div>
        <table class="tipos-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>M² Mínimos</th>
              <th>Precio Mínimo</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="tipo in tipos" 
              :key="tipo.id"
              :class="{ selected: selectedTipo && selectedTipo.id === tipo.id }"
              @click="selectTipo(tipo)"
            >
              <td>{{ tipo.nombreTipo }}</td>
              <td>{{ tipo.descripcion }}</td>
              <td>{{ tipo.minimoMetrosCuadrados }} m²</td>
              <td>{{ tipo.minimoPrecio }} €</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Nueva sección para detalles, siempre visible -->
      <div class="details-container">
        <h2>{{ isCreating ? 'Nuevo Registro' : 'Detalles del Tipo de Habitación' }}</h2>
        <div class="form-group">
          <label for="nombreTipo">Nombre:</label>
          <input id="nombreTipo" v-model="selectedTipo.nombreTipo" type="text" :disabled="!isDetailsEnabled" />
        </div>
        <div class="form-group">
          <label for="descripcion">Descripción:</label>
          <input id="descripcion" v-model="selectedTipo.descripcion" type="text" :disabled="!isDetailsEnabled" />
        </div>
        <div class="form-group">
  <label for="minimoMetrosCuadrados">M² Mínimos:</label>
  <div class="input-with-unit small-input">
    <input id="minimoMetrosCuadrados" v-model="selectedTipo.minimoMetrosCuadrados" type="number" :disabled="!isDetailsEnabled" />
    <span>m²</span>
  </div>
</div>
<div class="form-group">
  <label for="minimoPrecio">Precio Mínimo:</label>
  <div class="input-with-unit small-input">
    <input id="minimoPrecio" v-model="selectedTipo.minimoPrecio" type="number" :disabled="!isDetailsEnabled" />
    <span>€</span>
  </div>
</div>
        <div class="button-container">
          <button class="btn btn-apply" @click="isCreating ? saveNewTipo() : applyChanges()" :disabled="!isDetailsEnabled">{{ isCreating ? 'Guardar' : 'Guardar' }}</button>
          <button class="btn btn-cancel" @click="cancelChanges" :disabled="!isDetailsEnabled">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h2>Confirmar Eliminación</h2>
        <p>¿Está seguro de que desea eliminar el tipo de habitación "{{ selectedTipo?.nombreTipo }}"?</p>
        <button class="btn btn-confirm" @click="deleteTipo">Eliminar</button>
        <button class="btn btn-cancel" @click="closeDeleteModal">Cancelar</button>
      </div>
    </div>

    <!-- Modal de error -->
    <div v-if="isErrorModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h2>Error</h2>
        <p>Este tipo de habitación no se puede eliminar porque tiene registros de habitaciones asociadas.</p>
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
  setup() {
    const tipos = ref([]);
    const selectedTipo = ref({ nombreTipo: '', descripcion: '', minimoMetrosCuadrados: 0, minimoPrecio: 0 });
    const originalTipo = ref(null);
    const isModalOpen = ref(false);
    const isErrorModalOpen = ref(false);
    const isCreating = ref(false);
    const isToastVisible = ref(false);
    const isDetailsEnabled = ref(false);
    const isDeleteEnabled = ref(false);
    const toastMessage = ref('');

    onMounted(async () => {
      try {
        const response = await axios.get('/api/tipo-habitaciones');
        tipos.value = response.data;
      } catch (error) {
        console.error('Error fetching tipos:', error);
      }
    });

    const selectTipo = (tipo) => {
      selectedTipo.value = { ...tipo };
      originalTipo.value = { ...tipo };
      isCreating.value = false;
      isDetailsEnabled.value = true;
      isDeleteEnabled.value = true;
    };

    const startCreating = () => {
      selectedTipo.value = { nombreTipo: '', descripcion: '', minimoMetrosCuadrados: 0, minimoPrecio: 0 };
      isCreating.value = true;
      isDetailsEnabled.value = true;
      isDeleteEnabled.value = false;
    };

    const openDeleteModal = () => {
      if (selectedTipo.value) {
        isModalOpen.value = true;
      }
    };

    const closeDeleteModal = () => {
      isModalOpen.value = false;
    };

    const closeErrorModal = () => {
      isErrorModalOpen.value = false;
    };

    const deleteTipo = async () => {
      if (selectedTipo.value) {
        try {
          await axios.delete(`/api/tipo-habitaciones/${selectedTipo.value.id}`);
          tipos.value = tipos.value.filter(tipo => tipo.id !== selectedTipo.value.id);
          selectedTipo.value = { nombreTipo: '', descripcion: '', minimoMetrosCuadrados: 0, minimoPrecio: 0 };
          closeDeleteModal();
          isDetailsEnabled.value = false;
          isDeleteEnabled.value = false;
        } catch (error) {
          if (error.response && error.response.status === 409) {
            isErrorModalOpen.value = true;
          } else {
            console.error('Error deleting tipo:', error);
          }
        }
      }
    };

    const applyChanges = async () => {
      if (selectedTipo.value) {
        try {
          await axios.put(`/api/tipo-habitaciones/${selectedTipo.value.id}`, selectedTipo.value);
          // Refresh the list of tipos
          const response = await axios.get('/api/tipo-habitaciones');
          tipos.value = response.data;
          originalTipo.value = { ...selectedTipo.value };
          toastMessage.value = 'Registro modificado exitosamente';
          showToast();
        } catch (error) {
          console.error('Error updating tipo:', error);
        }
      }
    };

    const saveNewTipo = async () => {
      try {
        await axios.post('/api/tipo-habitaciones', selectedTipo.value);
        const response = await axios.get('/api/tipo-habitaciones');
        tipos.value = response.data;
        toastMessage.value = 'Nuevo registro creado exitosamente';
        showToast();
        cancelChanges();
      } catch (error) {
        console.error('Error creating new tipo:', error);
      }
    };

    const cancelChanges = () => {
      selectedTipo.value = { nombreTipo: '', descripcion: '', minimoMetrosCuadrados: 0, minimoPrecio: 0 };
      originalTipo.value = null;
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
      tipos,
      selectedTipo,
      originalTipo,
      isModalOpen,
      isErrorModalOpen,
      isCreating,
      isToastVisible,
      isDetailsEnabled,
      isDeleteEnabled,
      toastMessage,
      selectTipo,
      startCreating,
      openDeleteModal,
      closeDeleteModal,
      closeErrorModal,
      deleteTipo,
      applyChanges,
      saveNewTipo,
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

.tipos-table {
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

.input-with-unit {
  display: flex;
  align-items: center;
}

.input-with-unit input {
  text-align: right;
}
.input-with-unit.small-input input {
  width: 80px; /* Ajusta el ancho según sea necesario */
}
.input-with-unit span {
  margin-left: 0.5rem;
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