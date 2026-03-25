# Contexto del producto

Esta mini app representa un recorte del trabajo habitual de Leasy:

- registro y validacion de clientes
- gestion operativa de facturas
- reglas por rol
- cambios recientes que afectan estados y filtros

## Modulos visibles

### Clientes

Permite crear clientes y revisar la base ya registrada.

### Facturas

Permite revisar una cartera de facturas, editar datos operativos, aplicar cupones y mover estados.

## Roles demo

- `admin`: puede operar el modulo completo
- `ops`: opera clientes y facturas, pero no deberia poder cancelar
- `viewer`: rol de auditoria

## Enfoque esperado del QA

No buscamos volumen de casos. Buscamos:

- criterio para identificar el riesgo
- prioridad de negocio
- buena documentacion de evidencia
- automatizacion util, no cosmetica
