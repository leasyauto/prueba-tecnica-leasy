# Test Cases

Formato resumido enfocado en riesgos altos. Columna `Tipo`: A = plan de automatizar, M = manual.

| ID | Escenario | Precondiciones | Pasos | Resultado esperado | Prioridad | Tipo |
| --- | --- | --- | --- | --- | --- | --- |
| TC-01 | Login por rol | App levantada; credenciales demo | 1) Abrir login<br>2) Ingresar credenciales de `admin`, `ops`, `viewer` | Cada rol accede; la UI muestra solo los modulos permitidos (viewer solo lectura). | Alta | A |
| TC-02 | Ops no puede cancelar factura | Factura activa visible (no CANCELLED) | 1) Login `ops`<br>2) Abrir detalle de la factura<br>3) Intentar cancelar | Accion rechazada (mensaje de permiso); estado igual en detalle y lista. | Alta | A |
| TC-03 | Solo admin cancela | Factura activa; sin cupon aplicado | 1) Login `admin`<br>2) Cancelar la factura<br>3) Volver a la lista sin refrescar manual | Estado pasa a CANCELLED; lista y filtros reflejan el nuevo estado; edicion queda deshabilitada. | Alta | A |
| TC-04 | Cupon igual al total -> rechazado | Factura con total > 0 | 1) Login `admin` u `ops`<br>2) Editar factura<br>3) Aplicar cupon de monto igual al total<br>4) Guardar<br>5) Intentar marcar pagada | Validacion total>0; no permite guardar ni marcar pagada; total se mantiene; lista y detalle consistentes. | Alta | A |
| TC-05 | Cupon mayor al total -> rechazado | Igual que TC-04 pero cupon mayor al total | 1) Aplicar cupon mayor al total<br>2) Guardar<br>3) Intentar marcar pagada | Validacion impide total negativo; no se guarda el cupon ni cambia el total; no permite pago. | Alta | A |
| TC-06 | Sincronia lista-detalle tras cambio de estado | Factura activa | 1) Login `admin`<br>2) Cambiar estado (ej. a FROZEN)<br>3) Volver a la lista sin refrescar<br>4) Revisar filtros por estado | Lista y filtros muestran el nuevo estado sin recarga manual; detalle y lista coinciden. | Alta | A |
| TC-07 | FROZEN no se paga | Factura en estado FROZEN (puede venir de TC-06) | 1) Abrir detalle<br>2) Intentar pagar / marcar pagado | Accion de pago deshabilitada o rechazada; estado no cambia. | Media | A |
| TC-08 | CANCELLED no editable | Factura en CANCELLED (p.ej. de TC-03) | 1) Abrir detalle<br>2) Intentar modificar campos y guardar | Campos bloqueados o guardado rechazado; estado sigue CANCELLED. | Media | A |
| TC-09 | Email duplicado (case-insensitive) | Existe cliente `angeltrabajo@gmai.com` | 1) Login `ops`<br>2) Crear cliente con email `ANGELTRABAJO@GMAI.COM` y datos validos | Sistema bloquea creacion; mensaje claro de unicidad; registro original intacto. | Alta | A |
| TC-10 | Email duplicado todo mayuscula | Existe cliente `angeltrabajo@gmai.com` | 1) Crear cliente con email `ANGELTRABAJO@GMAI.COM` todo en mayusculas | Rechaza por unicidad sin mayus/minus. | Alta | A |
| TC-11 | Campos obligatorios al registrar clientes | Ninguno | 1) Login `ops`<br>2) Abrir alta de cliente<br>3) Enviar formulario vacio o con campos faltantes | Validaciones por campo; el cliente no se crea; mensajes claros. | Media | M |
| TC-12 | Visibilidad de acciones por rol en facturas | Facturas visibles en lista | 1) Login `viewer`<br>2) Abrir lista/detalle<br>3) Revisar botones de editar, cancelar, pagar | Viewer solo ve; no puede editar/cancelar/pagar. Ops ve editar/pagar pero no cancelar. Admin ve todas. | Media | A |
| TC-13 | Pago de factura debe refrescar lista | Factura activa; rol `admin` u `ops` | 1) Marcar como pagada<br>2) Volver a la lista sin refrescar | La fila muestra estado Pagada y totales actualizados sin presionar Refresh. | Alta | M |
| TC-14 | Guardado sin refrescar | Factura activa | 1) Editar factura (monto de cupon)<br>2) Guardar<br>3) Abrir otra factura y volver a la primera sin usar Refresh | Cambios persisten y se muestran en detalle y lista sin necesidad de refrescar manual. | Alta | M |
| TC-15 | Documento de identidad unico | Existe cliente con un numero de documento dado | 1) Login `ops`<br>2) Crear cliente reutilizando el mismo numero de documento | Creacion rechazada por duplicidad de documento; datos previos se mantienen. | Media | M |
