# Bug Reports

## Bug 1 - Unicidad de email no es case-insensitive
- Ambiente: Entorno local, rol ops.
- Severidad: Alta | Prioridad: Alta
- Qué pasa: Si ya existe `angeltrabajo@gmai.com`, puedo registrar otro cliente con `ANGELTRABAJO@GMAI.COM` y lo acepta.
- Cómo reproducir:
  1) Crear un cliente con email `angeltrabajo@gmai.com`.
  2) Crear otro cliente con el mismo correo en mayúsculas.
- Debería pasar: Bloquear alta por email duplicado sin importar mayúsculas/minúsculas.
- Evidencia: Alta exitosa con correo en mayúsculas.

## Bug 2 - Documento de identidad no es único
- Ambiente: Entorno local, rol ops.
- Severidad: Media | Prioridad: Media
- Qué pasa: Puedo crear un cliente reutilizando el mismo número de documento de otro cliente.
- Cómo reproducir:
  1) Identificar un cliente con documento X (ej. Ángel Ariel Pardo Zenteno).
  2) Crear nuevo cliente usando el mismo documento.
- Debería pasar: Rechazar por documento duplicado.
- Evidencia: Alta aceptada con documento ya existente.

## Bug 3 - Cupón permite total 0 o negativo y aun así pagar
- Ambiente: Entorno local, rol admin u ops.
- Severidad: Alta | Prioridad: Alta
- Qué pasa: Con cupón que deja total en 0 o negativo, la app guarda y deja pagar.
- Cómo reproducir:
  1) Abrir factura de total 1250.
  2) Aplicar cupón de 1250 (o mayor).
  3) Guardar y marcar pagada.
- Debería pasar: Bloquear guardar/pagar si el total queda 0 o negativo.
- Evidencia: Factura pagada con cupón 1250; otra queda negativa con cupón mayor.

## Bug 4 - Guardar cambios en factura no persiste sin refrescar
- Ambiente: Entorno local, rol admin u ops.
- Severidad: Alta | Prioridad: Alta
- Qué pasa: Tras editar y guardar, los cambios no se ven hasta presionar Refresh.
- Cómo reproducir:
  1) Editar factura (monto de cupón) y guardar.
  2) Abrir otra factura y volver sin refrescar.
- Debería pasar: Ver cambios al instante, sin refrescar.
- Evidencia: Edición en factura de Ana Torres solo aparece tras usar Refresh.

## Bug 5 - Lista de facturas no se actualiza tras marcar pagada
- Ambiente: Entorno local, rol admin u ops.
- Severidad: Media | Prioridad: Alta
- Qué pasa: Marco pagada y la lista sigue igual; cambia solo con Refresh.
- Cómo reproducir:
  1) Marcar una factura como pagada.
  2) Volver a la lista sin refrescar.
- Debería pasar: Lista y totales se actualizan automáticamente.
- Evidencia: Estado no cambia en la lista hasta usar Refresh.

## Bug 6 - El input de monto deja un 0 pegado y duplica el valor
- Ambiente: Entorno local, rol admin u ops.
- Severidad: Baja | Prioridad: Media
- Qué pasa: El campo “Monto del cupón” inicia con 0 que no se borra; al escribir 1300 queda 13000.
- Cómo reproducir:
  1) Abrir CT-PE-3101.
  2) Borrar y escribir 1300.
  3) El valor final queda 13000; total esperado se va a -S/ 11,750.00.
- Debería pasar: Campo vacío y aceptar exactamente lo tecleado.
- Evidencia: Total muestra -S/ 11,750.00 al intentar 1300; se corrige solo si se hace select-all y reemplazo.

## Bug 7 - Rol ops puede cancelar facturas
- Ambiente: Entorno local, rol ops.
- Severidad: Alta | Prioridad: Alta
- Qué pasa: Ops puede cancelar una factura pendiente; la API responde 200.
- Cómo reproducir:
  1) Login como `ops@leasy.pe`.
  2) Ir a Facturas, abrir CT-PE-3101 (PENDING).
  3) Click en "Cancelar factura".
- Debería pasar: Solo admin debería cancelar; ops debería recibir error y mantener PENDING.
- Evidencia: `POST /api/invoices/inv-001/cancel` devuelve 200 con rol ops.

## Bug 8 - Viewer puede crear clientes
- Ambiente: Entorno local, rol viewer.
- Severidad: Alta | Prioridad: Alta
- Qué pasa: Viewer (solo lectura) puede crear clientes con respuesta 201.
- Cómo reproducir:
  1) Login como `audit@leasy.pe`.
  2) Ir a Clientes.
  3) Completar formulario y enviar.
- Debería pasar: Viewer no debería poder crear; acción bloqueada o error.
- Evidencia: Alta de cliente exitosa con rol viewer.

## Bug 9 - Viewer puede editar/pagar/cancelar facturas
- Ambiente: Entorno local, rol viewer.
- Severidad: Alta | Prioridad: Alta
- Qué pasa: En facturas, viewer tiene habilitados guardar/pagar/cancelar y la API responde 200.
- Cómo reproducir:
  1) Login como `audit@leasy.pe`.
  2) Ir a Facturas y abrir una factura (ej. CT-PE-3101).
  3) Intentar guardar, pagar o cancelar.
- Debería pasar: Viewer solo debería ver; acciones deshabilitadas o error de permisos.
- Evidencia: Botones activos y respuestas 200 con rol viewer.

## Bug 10 - CANCELLED se puede seguir editando
- Ambiente: Entorno local, rol admin.
- Severidad: Alta | Prioridad: Alta
- Qué pasa: Tras cancelar una factura, puedo cambiar cupón/notas y guardar; la API responde 200 y aplica cambios.
- Cómo reproducir:
  1) Login como admin, abrir CT-PE-3101.
  2) Cancelar la factura (200).
  3) Editar monto de cupón y guardar.
- Debería pasar: Una CANCELLED no debería aceptar ediciones (403/409 o inputs bloqueados).
- Evidencia: la app responde satisfactoriamente después de editar una factura cancelada.

## Bug 11 - El formulario se limpia aunque crear cliente falle
- Ambiente: Entorno local, rol ops.
- Severidad: Media | Prioridad: Media
- Que pasa: Cuando intento crear un cliente con error (por ejemplo email duplicado), el sistema muestra el error pero borra todo el formulario.
- Como reproducir:
  1) Ir al modulo Clientes.
  2) Llenar el formulario con un email ya registrado.
  3) Enviar el formulario.
- Deberia pasar: Si falla la creacion, el formulario deberia mantener los datos para corregir solo el campo con error.
- Evidencia: Despues del error de duplicado, los campos se vacian y hay que volver a escribir todo.

## Bug 12 - El rol activo se maneja de forma global en la API
- Ambiente: Entorno local, dos sesiones/navegadores en paralelo.
- Severidad: Baja | Prioridad: Baja
- Que pasa: La API guarda el rol activo en una variable global. Si inicias sesion con distintos roles en sesiones separadas, el ultimo login puede afectar autorizaciones de la otra sesion.
- Como reproducir:
  1) Abrir dos navegadores o dos perfiles.
  2) En uno iniciar sesion como viewer; en el otro como admin.
  3) Volver al primero e intentar una accion sensible en facturas.
- Deberia pasar: Cada sesion deberia mantener su propio contexto de permisos, sin pisarse entre usuarios.
- Nota: Se reporta como hallazgo tecnico, pero no se considera grave para esta prueba porque el entorno es mock y no multiusuario real.
