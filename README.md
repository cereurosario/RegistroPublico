# Registro público de candidaturas · CERE

Sitio del **registro público de candidaturas** del Consejo Electoral de la Representación
Estudiantil de la Universidad del Rosario, Etapa Electoral Ordinaria 2026-2.

Existe porque el **artículo 96, parágrafo 3, del Código Electoral** (Acuerdo Estudiantil
002 de 2025) obliga al CERE a llevar «un registro público, actualizado periódicamente
durante el periodo de inscripciones, con la lista de candidaturas que hayan radicado
documentos y su estado de verificación».

Es un sitio estático: no tiene servidor, ni base de datos, ni dependencias. Todo el
contenido cambiante vive en un solo archivo, `datos/candidaturas.json`.

## Cómo se publica (una sola vez)

1. Crear el repositorio en la cuenta de GitHub **del CERE**, no en una personal, para que
   sobreviva al empalme de diciembre. Nombre sugerido: `registro-candidaturas`.
2. Subir el contenido de esta carpeta a la raíz del repositorio. En la web de GitHub:
   **Add file → Upload files**, y arrastrar todo lo que hay aquí adentro (incluidas las
   carpetas `assets` y `datos`).
3. **Settings → Pages → Build and deployment → Deploy from a branch**, rama `main`,
   carpeta `/ (root)`. Guardar.
4. A los pocos minutos el sitio queda en `https://<cuenta>.github.io/registro-candidaturas/`.
   Esa es la dirección que se anuncia.

El archivo `.nojekyll` ya está incluido y evita que GitHub procese el sitio como blog.

## Cómo se actualiza

Ver [COMO_ACTUALIZAR.md](COMO_ACTUALIZAR.md). En resumen: se edita
`datos/candidaturas.json` desde el navegador, se guarda, y el sitio se rehace solo en
menos de un minuto. No hay que instalar nada ni tocar el HTML.

## Qué contiene cada archivo

| Archivo | Para qué |
|---|---|
| `index.html` | La página. Los textos fijos (fundamento, reserva de datos, naturaleza del registro) están aquí. |
| `assets/estilo.css` | Presentación. Rojo institucional, Helvetica, y en teléfono la tabla se convierte en fichas. |
| `assets/registro.js` | Arma la tabla leyendo el JSON. Contiene la lista de los catorce Consejos y el vocabulario de estados con su artículo. |
| `datos/candidaturas.json` | **El único archivo que se edita a diario.** |
| `datos/EJEMPLO.json` | Ejemplos de cada caso. El sitio no lo lee. |

## Por qué en un repositorio y no en una hoja de cálculo

Porque cada actualización queda como un cambio fechado, atribuido a quien lo hizo y
público. El historial no se puede alterar sin que se note. Eso es la trazabilidad que
exigen los artículos 9, 38 y 94-I del Código Electoral, y es la prueba de que el registro
se mantuvo al día si alguna vez se discute.

## Lo que este sitio no es

No es canal oficial de notificación. Los canales oficiales del CERE siguen siendo el correo
**cereurosario@gmail.com** y la cuenta **@cere.ur**. Este sitio da publicidad al estado de
las candidaturas; no perfecciona inscripciones ni reemplaza la constancia formal
(artículo 96) ni las decisiones motivadas de aceptación o rechazo (artículo 97).

Convertirlo en la **Red social del CERE** del artículo 180 (repositorio único de toda la
documentación electoral, clasificado por etapa y con archivo histórico de cinco años)
requiere circular normativa, porque es una decisión operativa de las del artículo 94,
parágrafo 1. El sitio está construido para crecer hacia allá sin rehacerse.
