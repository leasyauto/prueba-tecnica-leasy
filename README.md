# Prueba tecnica QA hibrido semisenior

Este repositorio contiene una mini app de operaciones inspirada en el trabajo real de Leasy: registro de clientes, reglas de negocio alrededor de facturas, permisos por rol y cambios recientes que afectan sincronizacion entre UI y datos.

La prueba esta pensada para evaluar:

- criterio de calidad y priorizacion
- capacidad de exploracion funcional
- claridad al documentar bugs
- pensamiento hibrido manual + automation con Cypress

## Tiempo sugerido

3 horas maximo.

## Lo que debes hacer

1. Revisa el contexto del producto en [`docs/contexto.md`](./docs/contexto.md), [`docs/reglas-de-negocio.md`](./docs/reglas-de-negocio.md) y [`docs/release-notes.md`](./docs/release-notes.md).
2. Explora la app manualmente.
3. Completa tus entregables en la carpeta [`candidate-submission`](./candidate-submission/).
4. Agrega automatizacion con Cypress en `cypress/e2e/`.

## Importante

- No se espera que corrijas la app.
- El objetivo es evaluar como piensas, priorizas y reportas.
- Puedes agregar helpers, fixtures y utilidades para Cypress.
- Si decides modificar algo fuera de `cypress/` o `candidate-submission/`, explica por que en [`candidate-submission/AUTOMATION_NOTES.md`](./candidate-submission/AUTOMATION_NOTES.md).
- Si una prueba automatizada falla porque expone un bug, eso es aceptable siempre que lo documentes claramente.

## Credenciales demo

Todos los usuarios usan la misma clave: `Leasy2026!`

- `ops@leasy.pe`
- `admin@leasy.pe`
- `audit@leasy.pe`

## Entregables esperados

- [`candidate-submission/TEST_PLAN.md`](./candidate-submission/TEST_PLAN.md)
- [`candidate-submission/TEST_CASES.md`](./candidate-submission/TEST_CASES.md)
- [`candidate-submission/BUG_REPORTS.md`](./candidate-submission/BUG_REPORTS.md)
- [`candidate-submission/AUTOMATION_NOTES.md`](./candidate-submission/AUTOMATION_NOTES.md)
- Cypress specs en `cypress/e2e/`

## Setup

```bash
npm install
npm run dev
```

Esto levanta:

- frontend en `http://127.0.0.1:4173`
- API mock en `http://127.0.0.1:8787`

## Cypress

Con la app ya levantada:

```bash
npm run cypress:open
```

O en modo headless:

```bash
npm run cypress:run
```

Tambien tienes un helper para correr todo junto:

```bash
npm run test:e2e
```

## Criterio de evaluacion

- Analisis de riesgos y enfoque de prueba
- Calidad y prioridad de casos
- Claridad, severidad y reproducibilidad de bugs
- Seleccion de automatizacion y mantenibilidad de Cypress
- Capacidad para distinguir que conviene probar manualmente y que conviene automatizar
