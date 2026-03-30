# Test Plan
**Fecha:** 2026-03-29  
**App:** Leasy Mini App  
**Tiempo total:** ~3 h

---

## 1. Objetivo
Cubrir los riesgos más altos (permisos, estados de facturas, cupones y unicidad de clientes), documentar los defectos y dejar automatizado lo crítico en Cypress.

## 2. Alcance
**Dentro:** facturas (sincronía, cupones, permisos, estados), clientes (unicidad email), login de 3 roles.  
**Fuera:** diseño UI, performance, cross-browser.

## 3. Riesgos clave
- R1 Sincronía de lista tras acciones (cambio 22 Mar).
- R2 Cupones por monto fijo (validaciones total=0/negativo).
- R3 Matriz de permisos (ops/viewer no deben cancelar/editar/pagar).
- R4 Estados: CANCELLED no editable, FROZEN no pagable.
- R5 Unicidad de email (case-insensitive).

## 4. Estrategia rápida
- Lectura docs: 10 min.
- Exploración manual: 90 min (roles, permisos, cupones, estados, sincronía, clientes).
- Documentar bugs: 30 min.
- Automatizar: 120 min en los flujos críticos.

Orden de exploración: login → permisos cancelación → cupones (0/neg) → sincronía sin refrescar → estados CANCELLED/FROZEN → clientes (email duplicado, campos vacíos).

## 5. Qué automatizo (por qué)
- Login 3 roles (base).
- Ops cancela → debe ser 403/409 (permiso crítico).
- Admin cancela → debe ser 200 (funcional esperado).
- Viewer solo lectura en facturas (guardar/pagar/cancelar deben ser 403/409).
- Cupón total=0 y total<0 → guardar/pagar deben fallar.
- Estados: freeze (200), frozen no paga (403/409), cancelled no edita (403/409), y un check de sincronía lista/detalle sin refresh.
- Email duplicado  → 201 luego 409.

## 6. Qué dejo manual
- Campos obligatorios de clientes.
- Mensajes de error/redacción.
- Filtros combinados en facturas.

