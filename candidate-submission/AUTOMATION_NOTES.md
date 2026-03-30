# Automation Notes

## Qué automatizé y por qué
- Login de los 3 roles: base de todos los flujos.
- Permisos de cancelación: ops debe ser rechazado (403/409), admin debe obtener 200.
- Acciones de viewer en facturas: debe ser solo lectura; si responde 200 en guardar/pagar/cancelar es bug.
- Cupones: si el cupón deja el total en 0 o negativo, guardar/pagar deberían fallar.
- Estados: freeze (200 y queda FROZEN), frozen no se paga (403/409), cancelled no se edita (403/409) y un caso para confirmar que el estado nuevo se ve en lista y detalle sin refrescar (regresión del cambio de sincronía).
- Unicidad de email (case-insensitive): primera alta 201, segundo intento 409.

## Cómo ejecutar
1) `npm install` (una vez).
2) Levantar app: `npm run dev`.
3) En otra terminal:
   - GUI: `npm run cypress:open`
   - Headless: `npm run cypress:run`

## Casos que dejé manuales
- Campos obligatorios en alta de clientes.
- Mensajes de error/redacción.
- Filtros combinados en facturas.

## Pruebas que hoy fallan (exponen bugs conocidos)
- `clients`: segundo cliente con correo en mayus/minus devuelve 201 (debería 409) — Bug 1.
- `invoices-permissions`: ops puede cancelar (200) — Bug 7.
- `invoices-permissions`: viewer puede guardar/pagar/cancelar (200) — Bugs 8 y 9.
- `coupons`: guardar/pagar con total 0 o negativo devuelve éxito — Bug 3 + Bug 6 (input deja 0 pegado).
- `sync-and-states`:
  - frozen se paga (debería 403/409).
  - cancelled acepta edición (debería 403/409).
  - reflejo en lista/detalle puede quedar desincronizado.

## Notas de implementación (en claro)
- Uso `data-testid` y códigos HTTP; evito depender de textos de UI.
- ¿Por qué intercepto? :
  - Esperar a que carguen login/clientes/facturas.
  - Ver el código HTTP de cada acción (guardar/pagar/cancelar/freezar) y saber si cumplió la regla (200 cuando debe, 403/409 cuando no).
- El input de cupón trae un `0` inicial; lo borro con `{selectAll}{backspace}` antes de tipear para no terminar con 13000.
- La API hoy no valida todos los roles; si veo 200 donde espero 403/409, el test falla a propósito para evidenciarlo.
- Se agregó un `tsconfig` dentro de `cypress/` para que el editor reconozca bien `describe`, `it` y `cy`. Sin eso, VS Code mostraba errores en rojo aunque los tests corrían correctamente.
