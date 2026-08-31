# Cómo se actualiza el registro

Solo se edita un archivo: **`datos/candidaturas.json`**. No hace falta instalar nada. Se
hace desde el navegador, con la cuenta de GitHub del CERE.

1. Abrir `datos/candidaturas.json` en el repositorio.
2. Botón del lápiz, arriba a la derecha (*Edit this file*).
3. Cambiar lo que haya que cambiar.
4. **Cambiar también la fecha de `actualizado`.** Es la que ve la comunidad.
5. Abajo, *Commit changes*, con un mensaje corto que diga qué se hizo. Ejemplo:
   `radica CEJ Lista Ejemplo` o `CEM pasa a subsanación`.

El sitio se rehace solo en menos de un minuto.

Si el archivo queda mal escrito, la página muestra un aviso y no borra nada. Se corrige y
listo. Para evitarlo, pegar el contenido en <https://jsonlint.com> antes de guardar.

## Cómo se escribe una candidatura

```json
{
  "consejo": "CEJ",
  "denominacion": "Nombre de la lista",
  "modalidad": "lista",
  "radicacion": "2026-09-01T14:32:00-05:00",
  "integrantes": 12,
  "estado": "en_verificacion"
}
```

| Campo | Qué va | Obligatorio |
|---|---|---|
| `consejo` | Sigla: `CEA` `CEC` `CECH` `CECN` `CEEN` `CEFE` `CEIB` `CEICT` `CEJ` `CEM` `CEP` `CER` `CERI` `CPGDU` | Sí |
| `denominacion` | Nombre de la lista. Para independientes, `"Candidatura independiente"` | Sí |
| `modalidad` | `lista` o `independiente` (artículo 49) | Sí |
| `radicacion` | Fecha y hora en que llegó el correo, formato `AAAA-MM-DDTHH:MM:00-05:00` | Sí |
| `integrantes` | Número de personas de la lista. Se omite en independientes | No |
| `estado` | Uno de los siete de abajo | Sí |
| `actuacion` | Una frase sobre la última decisión: requerimiento, motivo del rechazo, fecha de vencimiento | No |
| `nota` | Aclaración breve, por ejemplo el cargo al que aspira un independiente | No |

Las comas separan candidaturas. La última no lleva coma detrás.

## Los siete estados

Cada uno corresponde a una figura del Código. **No se inventan estados nuevos**: si un caso
no encaja en ninguno, es señal de que hay que revisar qué se está haciendo.

| Estado | Cuándo | Norma |
|---|---|---|
| `radicada` | Llegó el correo con los documentos. La inscripción todavía no está perfeccionada. | Art. 96 |
| `en_verificacion` | El CERE está revisando. | Art. 97 |
| `en_subsanacion` | Se notificó requerimiento. Anotar en `actuacion` la fecha y la hora de vencimiento del día hábil. | Art. 97 par. 1 |
| `admitida` | Aceptada por decisión motivada. | Art. 97 |
| `rechazada` | Rechazada por decisión motivada. Anotar el motivo en `actuacion`. | Art. 97 |
| `sustituida` | Se sustituyó a uno o varios integrantes. | Art. 55 |
| `retirada` | Se retiró la candidatura o la lista completa. | Arts. 56 y 57 |

## Lo que nunca se publica

Cédulas, correos, teléfonos, promedios, sábanas de notas, certificados, declaraciones
juramentadas y cualquier documento de la carpeta. El archivo electoral se rige por
publicidad, reserva y **confidencialidad de datos personales** (artículo 38), y toda
publicación debe garantizar la reserva de datos sensibles (artículo 183, parágrafo 1).

Los nombres de los candidatos no se publican durante la inscripción. Se publican cuando la
candidatura queda admitida y va al tarjetón.

## Con qué frecuencia hay que actualizarlo

El artículo 96, parágrafo 3, dice «periódicamente». La regla práctica que se recomienda:
**una actualización al final de cada día hábil** durante el periodo de inscripción, y
además el mismo día en que se notifique una admisión, un rechazo o un requerimiento.

Esto no es una formalidad. El **artículo 59, parágrafo 3** dispone que el incumplimiento de
la obligación de publicidad «dará lugar a responsabilidad disciplinaria electoral de los
miembros del CERE que hayan omitido o retrasado la publicación». La responsabilidad es
personal. La página muestra hace cuántos días fue la última actualización, precisamente
para que el atraso se vea antes de que lo señale alguien más.
