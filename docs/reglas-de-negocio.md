# Reglas de negocio

Usa estas reglas como fuente de verdad para tus casos y bugs.

## Clientes

- El email del cliente debe ser unico.
- La unicidad de email no depende de mayusculas o minusculas.
- Todos los campos del formulario son obligatorios.

## Facturas

- El total debe ser mayor a `0`.
- Un cupon no puede dejar el total negativo.
- Solo usuarios `admin` pueden cancelar facturas.
- Una factura `CANCELLED` no puede editarse.
- Una factura `FROZEN` no puede pagarse.
- Los cambios de estado deben reflejarse en la lista y en el filtro sin necesidad de recargar manualmente.

## Datos y trazabilidad

- La vista de detalle y la lista deben mantenerse consistentes.
- Las acciones deben responder con mensajes claros cuando una regla se incumple.
