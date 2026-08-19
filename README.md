# terra-frontend — Onboarding + Dashboard EUDR

Segundo proyecto de la suite TERRA LINK. Empieza justo después del login del
proyecto `terra-link` (landing): un **onboarding tipo Platzi** (una pregunta
por pantalla, con barra de progreso) que recolecta el perfil del usuario, y
un **dashboard/CRM** donde ese perfil se ve como tarjeta y se pueden agregar
nuevas tarjetas de **certificación EUDR** mediante un formulario dinámico
independiente.

Este proyecto es **solo frontend**. No tiene backend propio: todo se guarda
en `localStorage` del navegador y se puede **exportar como un archivo JSON**
para que lo consuma el proyecto de backend por separado.

## Requisitos

- Node.js 20+
- npm 10+

## Arranque

```bash
npm install
npm run dev       # http://localhost:5173
```

```bash
npm run build      # genera dist/, verificado sin errores de TypeScript
```

## Flujo de la app

1. `/` decide a dónde ir: si no hay perfil guardado, manda a `/onboarding`;
   si ya existe, manda directo a `/dashboard`.
2. `/onboarding` — asistente de bienvenida estilo Platzi: pantalla completa,
   una pregunta central por paso, barra de progreso arriba, tarjetas grandes
   para elegir opciones, botón "Continuar" deshabilitado hasta llenar lo
   obligatorio. Al terminar, el perfil se guarda y se navega a `/dashboard`.
3. `/dashboard` — tarjeta de perfil a la izquierda (generada dinámicamente a
   partir de las respuestas del onboarding) y, a la derecha, una grilla de
   tarjetas de certificación EUDR. El botón **"+ Nueva certificación"** abre
   un modal con un formulario dinámico distinto, enfocado en los datos que
   pide la Regulación EUDR (producto, coordenadas GPS, parcela, área,
   proveedor, estado, etc.).
4. El botón **"⬇ Exportar JSON"** del dashboard descarga un archivo
   `terra-link-export-*.json` con el perfil y todas las certificaciones, listo
   para enviarse o importarse en el proyecto de backend.

## Cómo agregar un campo nuevo (sin tocar componentes)

Todo el sistema de formularios —onboarding y certificaciones EUDR— se arma a
partir de listas de configuración en `src/config/`. Los componentes
(`OnboardingWizard`, `DynamicForm`, `DynamicField`, `ProfileCard`,
`CertificationCard`) leen esas listas y ya saben renderizar, validar y
mostrar cualquier tipo de campo soportado.

**Agregar un campo al onboarding** — edita `src/config/onboardingSteps.ts`:

```ts
{
  id: 'certificacionPrevia',
  label: '¿Ya cuentas con alguna certificación previa?',
  type: 'select',
  options: [
    { value: 'si', label: 'Sí' },
    { value: 'no', label: 'No' },
  ],
}
```

Puedes agregarlo a un paso existente o crear un paso nuevo con su propio
`titulo`, `subtitulo` e `icono`.

**Agregar un campo a las certificaciones EUDR** — edita
`src/config/eudrFields.ts` de la misma forma. El campo nuevo aparece
automáticamente en el modal "Nueva certificación" y, si tiene valor, en las
tarjetas del dashboard (`CertificationCard` itera sobre `EUDR_FIELDS`
dinámicamente).

### Tipos de campo soportados (`FieldType`)

| type            | Uso                                                           |
| --------------- | -------------------------------------------------------------- |
| `text`          | Texto libre corto                                               |
| `email` / `tel` | Igual que `text`, con teclado/validación del navegador          |
| `number`        | Numérico, admite `unit`, `min`, `max`                           |
| `date`          | Selector de fecha nativo                                        |
| `textarea`      | Texto largo                                                     |
| `select`        | Lista desplegable (`options`)                                   |
| `choice-cards`  | Tarjetas grandes de selección única, estilo Platzi (`options`)  |
| `multi-choice`  | Tarjetas de selección múltiple (`options`)                      |

## Contrato de exportación (`ExportacionTerra`)

```ts
{
  version: 1,
  exportadoEn: "2026-08-18T12:00:00.000Z",
  perfil: { nombreCompleto: "...", perfilProductivo: "...", ... } | null,
  certificaciones: [
    { id: "...", creadaEn: "...", nombreLote: "...", producto: "cacao", ... }
  ]
}
```

Como los campos nuevos simplemente aparecen como llaves adicionales dentro de
`perfil` o de cada certificación, el backend puede tratarlos como un objeto
semi-estructurado (o mapear explícitamente las llaves que le interesen) sin
que este frontend tenga que cambiar su forma de exportar.

## Estructura

```
src/
├── config/
│   ├── onboardingSteps.ts    # pasos y campos del wizard
│   └── eudrFields.ts         # campos del formulario de certificación
├── components/
│   ├── OnboardingWizard.tsx  # asistente paso a paso
│   ├── DynamicField.tsx      # un campo, según su FieldType
│   ├── DynamicForm.tsx       # formulario completo a partir de FieldDef[]
│   ├── ProfileCard.tsx       # tarjeta de perfil (dashboard)
│   ├── CertificationCard.tsx # tarjeta de certificación (dashboard)
│   └── Modal.tsx
├── pages/
│   ├── Onboarding.tsx
│   └── Dashboard.tsx
└── lib/
    ├── types.ts     # FieldDef, FieldType, OnboardingStep, etc.
    ├── storage.ts   # persistencia localStorage + export JSON
    └── format.ts    # formateo de valores para mostrar en tarjetas
```

## Diseño

Misma identidad visual que `terra-link` (verde `#2F5D3A`, tierra `#6B4F2A`,
dorado `#D4A13C`, crema `#F7F3EA`, Fraunces + IBM Plex Sans/Mono), adaptada a
un onboarding de pantalla completa con tarjetas de opción grandes y
transiciones suaves entre pasos, y a un dashboard de dos columnas con
tarjetas compactas para el trabajo diario de certificación.
