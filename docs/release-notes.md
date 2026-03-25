# Release notes recientes

## March 20, 2026

Se habilito el uso de cupones por monto fijo en el modulo de facturas.

Impacto esperado:

- recalculo del total
- persistencia del cupon
- validaciones para no dejar el total en cero o negativo

## March 22, 2026

El listado de facturas dejo de recargar toda la tabla despues de cada accion para mejorar performance.

Impacto esperado:

- la tabla debe seguir consistente con el detalle
- los filtros deben reflejar el ultimo estado persistido

## March 24, 2026

Se simplifico la matriz de permisos del modulo de facturas.

Impacto esperado:

- acciones visibles y permitidas deben coincidir con el rol
- cancelacion debe seguir restringida a admin
