describe('Hotel Management Application', () => {
  beforeEach(() => {
    // Visitar la página principal antes de cada test
    cy.visit('/');
  });

  it('Debería navegar a la página de Tipos de Habitación y verificar el contenido', () => {
    // Navegar a la página de Tipos de Habitación
    cy.get('.nav-link').contains('TIPOS').click();

    // Verificar que la URL incluye /tipos
    cy.url().should('include', '/tipos');

    // Verificar que la página de Tipos de Habitación se carga correctamente
    cy.get('h1').contains('Tipos de Habitación').should('be.visible');
  });

  it('Debería navegar a la página de Habitaciones y verificar el contenido', () => {
    // Navegar a la página de Habitaciones
    cy.get('.nav-link').contains('HABITACIONES').click();

    // Verificar que la URL incluye /habitaciones
    cy.url().should('include', '/habitaciones');

    // Verificar que la página de Habitaciones se carga correctamente
    cy.get('h1').contains('Habitaciones').should('be.visible');
  });

  it('Debería mostrar los enlaces del pie de página', () => {
    // Verificar que los enlaces del pie de página se muestran correctamente
    cy.get('.footer-link').contains('Política de privacidad').should('be.visible');
    cy.get('.footer-link').contains('Términos de servicio').should('be.visible');
    cy.get('.footer-link').contains('Contacto').should('be.visible');
    cy.get('.footer-link').contains('Acerca de').should('be.visible');
  });
  describe('Tipos de Habitación', () => {
    beforeEach(() => {
      // Visitar la página de Tipos de Habitación antes de cada test
      cy.visit('/tipos');
    });
  
    it('Debería mostrar la lista de tipos de habitación', () => {
      // Verificar que la página de Tipos de Habitación se carga correctamente
      cy.get('h1').contains('Tipos de Habitación').should('be.visible');
      cy.get('.tipos-table').should('be.visible');
    });
  
    it('Debería permitir crear un nuevo tipo de habitación', () => {
      // Hacer clic en el botón "Crear"
      cy.get('.btn').contains('Crear').click();
  
      // Verificar que el formulario de creación se muestra
      cy.get('h2').contains('Nuevo Registro').should('be.visible');
  
      // Llenar el formulario
      cy.get('#nombreTipo').type('Suite');
      cy.get('#descripcion').type('Habitación de lujo con vista al mar');
      cy.get('#minimoMetrosCuadrados').type('50');
      cy.get('#minimoPrecio').type('200');
  
      // Hacer clic en el botón "Guardar"
      cy.get('.btn-apply').contains('Guardar').click();
  
      // Verificar que se muestra el toast de notificación
      cy.get('.toast').should('be.visible').contains('Nuevo registro creado exitosamente');
    });
  
    it('Debería permitir seleccionar y editar un tipo de habitación', () => {
      // Seleccionar el primer tipo de habitación en la tabla
      cy.get('.tipos-table tbody tr').first().click();
  
      // Verificar que el formulario de edición se muestra
      cy.get('h2').contains('Visualización').should('be.visible');
  
      // Editar el formulario
      cy.get('#nombreTipo').clear().type('Suite Editada');
      cy.get('#descripcion').clear().type('Habitación de lujo con vista al mar editada');
      cy.get('#minimoMetrosCuadrados').clear().type('55');
      cy.get('#minimoPrecio').clear().type('220');
  
      // Hacer clic en el botón "Guardar"
      cy.get('.btn-apply').contains('Guardar').click();
  
      // Verificar que se muestra el toast de notificación
      cy.get('.toast').should('be.visible').contains('Registro modificado exitosamente');
    });
  
    it('Debería permitir cancelar los cambios', () => {
      // Seleccionar el primer tipo de habitación en la tabla
      cy.get('.tipos-table tbody tr').first().click();
  
      // Verificar que el formulario de edición se muestra
      cy.get('h2').contains('Visualización').should('be.visible');
  
      // Guardar los valores originales
      cy.get('#nombreTipo').invoke('val').then((originalNombreTipo) => {
        cy.get('#descripcion').invoke('val').then((originalDescripcion) => {
  
          // Editar el formulario
          cy.get('#nombreTipo').clear().type('Suite Editada');
          cy.get('#descripcion').clear().type('Habitación de lujo con vista al mar editada');
  
          // Hacer clic en el botón "Cancelar"
          cy.get('.btn-cancel').contains('Cancelar').click();
  
          // Esperar un momento para que el DOM se actualice
          cy.wait(500);
  
          // Verificar que los cambios no se guardaron
          cy.get('.tipos-table tbody tr').first().click();
          cy.get('#nombreTipo').should('have.value', originalNombreTipo);
          cy.get('#descripcion').should('have.value', originalDescripcion);
        });
      });
    });
  
    it('Debería permitir eliminar un tipo de habitación', () => {
      // Aumentar el tiempo de espera para encontrar la tabla
      cy.get('.tipos-table tbody tr', { timeout: 10000 }).should('exist');
  
      // Seleccionar el primer tipo de habitación en la tabla
      cy.get('.tipos-table tbody tr').first().click();
  
      // Hacer clic en el botón "Eliminar"
      cy.get('.btn').contains('Eliminar').click();
  
      // Verificar que el modal de confirmación se muestra
      cy.get('.modal-overlay').should('be.visible');
      cy.get('.modal-content h2').contains('Confirmar Eliminación').should('be.visible');
  
      // Confirmar la eliminación
      cy.get('.btn-confirm').contains('Eliminar').click();
  
      // Esperar un momento para que el DOM se actualice
      cy.wait(1000);
  
      // Verificar que el tipo de habitación fue eliminado
      cy.get('.tipos-table tbody tr').should('not.contain', 'FSuit');
    });
  
  
    it('Debería mostrar el modal de error al intentar eliminar un tipo de habitación con registros asociados', () => {
      // Seleccionar el primer tipo de habitación en la tabla
      cy.get('.tipos-table tbody tr').first().click();
    
      // Interceptar la solicitud de eliminación antes de hacer clic en "Eliminar"
      cy.intercept('DELETE', '/api/tipo-habitaciones/*', {
        statusCode: 409,
        body: { message: 'Este tipo de habitación no se puede eliminar porque tiene registros de habitaciones asociadas.' }
      }).as('deleteRequest');
    
      // Hacer clic en el botón "Eliminar"
      cy.get('.btn').contains('Eliminar').click();
    
      // Verificar que el modal de confirmación se muestra
      cy.get('.modal-overlay').should('be.visible');
      cy.get('.modal-content h2').contains('Confirmar Eliminación').should('be.visible');
    
      // Confirmar la eliminación
      cy.get('.btn-confirm').contains('Eliminar').click();
    
      // Esperar a que la solicitud de eliminación se complete
      cy.wait('@deleteRequest');
    
      // Verificar que se muestra el modal de error
      cy.get('.modal-overlay').should('be.visible');
      cy.get('.modal-content h2').contains('Error').should('be.visible');
      cy.get('.modal-content p').contains('Este tipo de habitación no se puede eliminar porque tiene registros de habitaciones asociadas.').should('be.visible');
    
      // Cerrar el modal de error
      cy.get('.btn-confirm').contains('Aceptar').click();
    
    });
  });
});
describe('Habitaciones', () => {
  beforeEach(() => {
    // Visitar la página de Habitaciones antes de cada test
    cy.visit('/habitaciones');
  });

  it('Debería mostrar la lista de habitaciones', () => {
    // Verificar que la página de Habitaciones se carga correctamente
    cy.get('h1').contains('Habitaciones').should('be.visible');
    cy.get('.habitaciones-table').should('be.visible');
  });
  it('Debería permitir crear una nueva habitación', () => {
    // Hacer clic en el botón "Crear"
    cy.get('.btn').contains('Crear').click();
  
    // Verificar que el formulario de creación se muestra
    cy.get('h2').contains('Nuevo').should('be.visible');
  
    // Llenar el formulario
    cy.get('#hotel').type('Hotel Test', { force: true });
    cy.get('#planta').type('1', { force: true });
    cy.get('#numHabitacion').type('101', { force: true });
    cy.get('#pasillo').type('1', { force: true });
    cy.get('#tipoHabitacion').select('Suite', { force: true });
    cy.get('#descripcion').type('Habitación de prueba', { force: true });
    cy.get('#precioNoche').type('100', { force: true });
    cy.get('#metrosCuadrados').type('30', { force: true });
    cy.get('#capacidadMaxima').type('2', { force: true });
  
    // Hacer clic en el botón "Guardar"
    cy.get('.btn-apply').contains('Guardar').click();
  
    // Verificar que se muestra el toast de notificación
    cy.get('.toast').should('be.visible').contains('Nuevo registro creado exitosamente');
  });
 
  it('Debería permitir cancelar los cambios', () => {
    // Aumentar el tiempo de espera para encontrar la tabla
    cy.get('.habitaciones-table tbody tr', { timeout: 10000 }).should('exist');
  
    // Seleccionar la primera habitación en la tabla
    cy.get('.habitaciones-table tbody tr').first().click();
  
    // Verificar que el formulario de edición se muestra
    cy.get('h2').contains('Modificación').should('be.visible');
  
    // Guardar los valores originales
    cy.get('#hotel').invoke('val').then((originalHotel) => {
      cy.get('#planta').invoke('val').then((originalPlanta) => {
  
        // Editar el formulario
        cy.get('#hotel').clear({ force: true }).type('Hotel Editado', { force: true });
        cy.get('#planta').clear({ force: true }).type('2', { force: true });
  
        // Hacer clic en el botón "Cancelar"
        cy.get('.btn-cancel').contains('Cancelar').click();
  
        // Esperar un momento para que el DOM se actualice
        cy.wait(500);
  
        // Verificar que los cambios no se guardaron
        cy.get('.habitaciones-table tbody tr').first().click();
        cy.get('#hotel').should('have.value', originalHotel);
        cy.get('#planta').should('have.value', originalPlanta);
      });
    });
  });
  
  it('Debería permitir eliminar una habitación', () => {
    // Aumentar el tiempo de espera para encontrar la tabla
    cy.get('.habitaciones-table tbody tr', { timeout: 10000 }).should('exist');
  
    // Seleccionar la primera habitación en la tabla
    cy.get('.habitaciones-table tbody tr').first().as('firstRow');
    cy.get('@firstRow').click();
  
    // Interceptar la solicitud de eliminación
    cy.intercept('DELETE', '/api/habitaciones/*').as('deleteRequest');
  
    // Hacer clic en el botón "Eliminar"
    cy.get('.btn').contains('Eliminar').click();
  
    // Verificar que el modal de confirmación se muestra
    cy.get('.modal-overlay').should('be.visible');
    cy.get('.modal-content h2').contains('Confirmar Eliminación').should('be.visible');
  
    // Confirmar la eliminación
    cy.get('.btn-confirm').contains('Eliminar').click();
  
    // Esperar a que la solicitud de eliminación se complete
    cy.wait('@deleteRequest').its('response.statusCode').should('be.oneOf', [200, 204]);
  
    
  });
  
  it('Debería mostrar el modal de error al intentar eliminar una habitación con registros asociados', () => {
    // Aumentar el tiempo de espera para encontrar la tabla
    cy.get('.habitaciones-table tbody tr', { timeout: 10000 }).should('exist');
  
    // Seleccionar la primera habitación en la tabla
    cy.get('.habitaciones-table tbody tr').first().click();
  
    // Interceptar la solicitud de eliminación antes de hacer clic en "Eliminar"
    cy.intercept('DELETE', '/api/habitaciones/*', {
      statusCode: 409,
      body: { message: 'Esta habitación no se puede eliminar porque tiene registros asociados.' }
    }).as('deleteRequest');
  
    // Hacer clic en el botón "Eliminar"
    cy.get('.btn').contains('Eliminar').click();
  
    // Verificar que el modal de confirmación se muestra
    cy.get('.modal-overlay').should('be.visible');
    cy.get('.modal-content h2').contains('Confirmar Eliminación').should('be.visible');
  
    // Confirmar la eliminación
    cy.get('.btn-confirm').contains('Eliminar').click();
  
    // Esperar a que la solicitud de eliminación se complete
    cy.wait('@deleteRequest');
  
    // Verificar que se muestra el modal de error
    cy.get('.modal-overlay').should('be.visible');
    cy.get('.modal-content h2').contains('Error').should('be.visible');
    cy.get('.modal-content p').contains('Esta habitación no se puede eliminar porque tiene registros asociados.').should('be.visible');
  
    // Cerrar el modal de error
    cy.get('.btn-confirm').contains('Aceptar').click({ force: true });
  
  });
});