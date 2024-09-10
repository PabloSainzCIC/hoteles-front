<template>
  <div class="container">
    <h1>Tipos de Habitación</h1>
    <div class="table-container">
      <div class="button-container">
        <button class="btn" @click="openDeleteModal" :disabled="!selectedTipo">Crear</button>
        <button class="btn" :disabled="!selectedTipo" @click="openDeleteModal">Eliminar</button>
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
            :class="{ selected: selectedTipo === tipo }"
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
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const tipos = ref([]);
    const selectedTipo = ref(null);
    const isModalOpen = ref(false);
    const isErrorModalOpen = ref(false);

    onMounted(async () => {
      try {
        const response = await axios.get('/api/tipo-habitaciones');
        tipos.value = response.data;
      } catch (error) {
        console.error('Error fetching tipos:', error);
      }
    });

    const selectTipo = (tipo) => {
      selectedTipo.value = tipo;
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
          selectedTipo.value = null;
          closeDeleteModal();
        } catch (error) {
          if (error.response && error.response.status === 409) {
            isErrorModalOpen.value = true;
          } else {
            console.error('Error deleting tipo:', error);
          }
        }
      }
    };

    return {
      tipos,
      selectedTipo,
      isModalOpen,
      isErrorModalOpen,
      selectTipo,
      openDeleteModal,
      closeDeleteModal,
      closeErrorModal,
      deleteTipo
    };
  }
}
</script>

<style scoped>
.container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.table-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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
</style>
