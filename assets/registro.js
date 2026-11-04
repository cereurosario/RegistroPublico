/* Registro público de candidaturas · CERE
   Lee datos/candidaturas.json y arma la tabla. Sin dependencias.
   Para cambiar el registro no se toca este archivo: se edita el JSON. */

(function () {
  'use strict';

  // Los catorce Consejos del artículo 50 del Código Electoral.
  var CONSEJOS = {
    CEA: 'Administración',
    CEC: 'Creación',
    CECH: 'Escuela de Ciencias Humanas',
    CECN: 'Ciencias Naturales',
    CEEN: 'Enfermería',
    CEFE: 'Facultad de Economía',
    CEIB: 'Ingeniería Biomédica',
    CEICT: 'Ingeniería, Ciencia y Tecnología',
    CEJ: 'Jurisprudencia',
    CEM: 'Medicina',
    CEP: 'Psicología',
    CER: 'Rehabilitación',
    CERI: 'Relaciones Internacionales',
    CPGDU: 'Ciencia Política y Gobierno y Gestión y Desarrollo Urbanos'
  };

  // Cada estado con la norma que lo sustenta. No se inventan estados nuevos.
  var ESTADOS = {
    radicada: {
      etiqueta: 'Radicada',
      norma: 'Artículo 96',
      glosa: 'La documentación fue recibida por el CERE. La inscripción aún no está perfeccionada.'
    },
    en_verificacion: {
      etiqueta: 'En verificación',
      norma: 'Artículo 97',
      glosa: 'El CERE adelanta la revisión formal y material de la candidatura.'
    },
    en_subsanacion: {
      etiqueta: 'En subsanación',
      norma: 'Artículo 97, parágrafo 1',
      glosa: 'Se notificó un requerimiento. La candidatura tiene un (1) día hábil para corregir o completar.'
    },
    admitida: {
      etiqueta: 'Admitida',
      norma: 'Artículo 97',
      glosa: 'La candidatura fue aceptada mediante decisión motivada.'
    },
    rechazada: {
      etiqueta: 'Rechazada',
      norma: 'Artículo 97',
      glosa: 'La candidatura fue rechazada mediante decisión motivada. Proceden reposición ante el CAE y apelación ante el TAE.'
    },
    sustituida: {
      etiqueta: 'Sustituida',
      norma: 'Artículo 55',
      glosa: 'Se sustituyó uno o varios de sus integrantes por decisión motivada del CERE.'
    },
    retirada: {
      etiqueta: 'Retirada',
      norma: 'Artículos 54, 56 y 57',
      glosa: 'La candidatura o la lista se retiró del proceso, o su renuncia fue aceptada por el CERE.'
    }
  };

  // Etapas del proceso electoral (Título IV del Código). El JSON marca cada
  // candidatura con su etapa y con "etapa_vigente" la que se muestra al abrir.
  var ETAPAS = {
    ordinaria: 'Ordinaria',
    extemporanea: 'Extemporánea'
  };

  var COLUMNAS = ['Consejo', 'Candidatura', 'Modalidad', 'Radicación', 'Integrantes', 'Estado'];

  var $ = function (id) { return document.getElementById(id); };

  function texto(t) { return document.createTextNode(t == null ? '' : String(t)); }

  function elem(tag, clase, contenido) {
    var e = document.createElement(tag);
    if (clase) e.className = clase;
    if (contenido != null) e.appendChild(texto(contenido));
    return e;
  }

  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun',
               'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  // Formato compacto y sin ambigüedad: 3 sep 2026, 10:05 p. m.
  function fecha(iso, conHora) {
    var d = new Date(iso);
    if (isNaN(d)) return String(iso || '');
    var s = d.getDate() + ' ' + MESES[d.getMonth()] + ' ' + d.getFullYear();
    if (!conHora) return s;
    var h = d.getHours();
    var m = d.getMinutes();
    var sufijo = h < 12 ? 'a. m.' : 'p. m.';
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return s + ', ' + h12 + ':' + (m < 10 ? '0' + m : m) + ' ' + sufijo;
  }

  function diasDesde(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return null;
    return Math.floor((Date.now() - d.getTime()) / 86400000);
  }

  function nombreConsejo(sigla) {
    return CONSEJOS[sigla] ? sigla + ' · ' + CONSEJOS[sigla] : String(sigla || '');
  }

  // --- pintado ------------------------------------------------------------

  function pintarActualizado(datos) {
    var caja = $('actualizado');
    caja.textContent = '';
    caja.appendChild(elem('strong', null, 'Última actualización: '));
    caja.appendChild(texto(fecha(datos.actualizado, true)));
    var dias = diasDesde(datos.actualizado);
    if (dias !== null && dias >= 1) {
      caja.appendChild(elem('span', 'desfase',
        dias === 1 ? ' (hace un día)' : ' (hace ' + dias + ' días)'));
    }
  }

  function pintarGlosario() {
    var dl = $('glosario');
    Object.keys(ESTADOS).forEach(function (clave) {
      var e = ESTADOS[clave];
      var fila = document.createElement('div');
      var dt = elem('dt', null, e.etiqueta);
      var dd = document.createElement('dd');
      dd.appendChild(texto(e.glosa + ' '));
      dd.appendChild(elem('span', 'norma', '(' + e.norma + ' del Código Electoral)'));
      fila.appendChild(dt);
      fila.appendChild(dd);
      dl.appendChild(fila);
    });
  }

  // Cada celda es td > .val. Ese envoltorio es el que permite que en teléfono
  // la etiqueta y el valor queden como dos columnas y el texto largo baje solo.
  function celda(columna, clase, contenido) {
    var td = elem('td', clase);
    td.setAttribute('data-col', columna);
    var val = elem('div', 'val');
    if (contenido != null) val.appendChild(texto(contenido));
    td.appendChild(val);
    return td;
  }

  function filaDe(c) {
    var tr = document.createElement('tr');

    tr.appendChild(celda('Consejo', 'consejo', c.consejo));

    var tdNombre = celda('Candidatura', null, c.denominacion);
    if (c.nota) tdNombre.firstChild.appendChild(elem('span', 'programa', c.nota));
    tr.appendChild(tdNombre);

    tr.appendChild(celda('Modalidad', 'modalidad', c.modalidad === 'lista' ? 'Lista' : 'Independiente'));
    var tdFecha = celda('Radicación', 'fecha', fecha(c.radicacion, true));
    if (c.etapa) tdFecha.firstChild.appendChild(elem('span', 'programa', 'Etapa ' + (ETAPAS[c.etapa] || c.etapa)));
    tr.appendChild(tdFecha);
    tr.appendChild(celda('Integrantes', 'num', c.integrantes != null ? c.integrantes : ''));

    var def = ESTADOS[c.estado];
    var tdEstado = celda('Estado', null, null);
    var caja = elem('span', 'estado e-' + c.estado);
    caja.appendChild(elem('span', 'punto'));
    caja.appendChild(texto(def ? def.etiqueta : c.estado));
    tdEstado.firstChild.appendChild(caja);
    if (c.actuacion) tdEstado.firstChild.appendChild(elem('span', 'actuacion', c.actuacion));
    tr.appendChild(tdEstado);

    return tr;
  }

  function pintarTabla(lista, total) {
    var caja = $('tabla');
    caja.textContent = '';

    if (!lista.length) {
      var vacio = elem('div', 'vacio');
      if (!total) {
        vacio.appendChild(elem('strong', null, 'Todavía no se ha radicado ninguna candidatura en esta etapa.'));
        vacio.appendChild(texto('El registro se actualiza durante el periodo de inscripción.'));
      } else {
        vacio.appendChild(elem('strong', null, 'Ninguna candidatura coincide con el filtro.'));
        vacio.appendChild(texto('Cambie el Consejo o el estado seleccionado.'));
      }
      caja.appendChild(vacio);
      return;
    }

    var tabla = document.createElement('table');
    var thead = document.createElement('thead');
    var trh = document.createElement('tr');
    COLUMNAS.forEach(function (t) { trh.appendChild(elem('th', null, t)); });
    thead.appendChild(trh);
    tabla.appendChild(thead);

    var tbody = document.createElement('tbody');
    lista.forEach(function (c) { tbody.appendChild(filaDe(c)); });
    tabla.appendChild(tbody);
    caja.appendChild(tabla);
  }

  // --- filtros ------------------------------------------------------------

  function llenarFiltros(datos) {
    var ft = $('f-etapa');
    var etapas = {};
    datos.candidaturas.forEach(function (c) { if (c.etapa) etapas[c.etapa] = true; });
    if (datos.etapa_vigente) etapas[datos.etapa_vigente] = true;
    Object.keys(ETAPAS).concat(Object.keys(etapas)).forEach(function (clave) {
      if (!etapas[clave]) return;
      etapas[clave] = false;
      var o = elem('option', null, 'Etapa ' + (ETAPAS[clave] || clave));
      o.value = clave;
      ft.appendChild(o);
    });
    // Se abre en la etapa vigente; ?etapa=ordinaria (o =todas) elige otra.
    var pedida = new URLSearchParams(location.search).get('etapa');
    var inicial = pedida === 'todas' ? '' : (pedida || datos.etapa_vigente || '');
    if ([].some.call(ft.options, function (o) { return o.value === inicial; })) ft.value = inicial;

    var fc = $('f-consejo');
    var usados = {};
    datos.candidaturas.forEach(function (c) { usados[c.consejo] = true; });
    Object.keys(CONSEJOS).forEach(function (sigla) {
      if (!usados[sigla]) return;
      var o = elem('option', null, nombreConsejo(sigla));
      o.value = sigla;
      fc.appendChild(o);
    });

    var fe = $('f-estado');
    Object.keys(ESTADOS).forEach(function (clave) {
      var o = elem('option', null, ESTADOS[clave].etiqueta);
      o.value = clave;
      fe.appendChild(o);
    });
  }

  function ordenar(lista) {
    return lista.slice().sort(function (a, b) {
      if (a.consejo !== b.consejo) return a.consejo < b.consejo ? -1 : 1;
      return String(a.radicacion) < String(b.radicacion) ? -1 : 1;
    });
  }

  function aplicar(datos) {
    var etapa = $('f-etapa').value;
    var consejo = $('f-consejo').value;
    var estado = $('f-estado').value;
    var enEtapa = datos.candidaturas.filter(function (c) { return !etapa || c.etapa === etapa; });
    var lista = enEtapa.filter(function (c) {
      return (!consejo || c.consejo === consejo) && (!estado || c.estado === estado);
    });
    pintarTabla(ordenar(lista), enEtapa.length);

    var n = lista.length;
    var total = enEtapa.length;
    $('conteo').textContent = (consejo || estado)
      ? n + ' de ' + total + (total === 1 ? ' candidatura' : ' candidaturas')
      : total + (total === 1 ? ' candidatura radicada' : ' candidaturas radicadas');
  }

  // --- arranque -----------------------------------------------------------

  function error(mensaje) {
    $('actualizado').textContent = mensaje;
    $('tabla').textContent = '';
  }

  fetch('datos/candidaturas.json', { cache: 'no-store' })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (datos) {
      if (!datos || !Array.isArray(datos.candidaturas)) throw new Error('formato');
      pintarActualizado(datos);
      pintarGlosario();
      llenarFiltros(datos);
      $('f-etapa').addEventListener('change', function () {
        var url = new URL(location.href);
        url.searchParams.set('etapa', $('f-etapa').value || 'todas');
        history.replaceState(null, '', url);
        aplicar(datos);
      });
      $('f-consejo').addEventListener('change', function () { aplicar(datos); });
      $('f-estado').addEventListener('change', function () { aplicar(datos); });
      aplicar(datos);
    })
    .catch(function () {
      error('No fue posible cargar el registro. Los datos en bruto están en datos/candidaturas.json');
    });
})();
