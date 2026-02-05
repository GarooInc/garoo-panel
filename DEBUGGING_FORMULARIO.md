# 🔍 Guía de Debugging - Formulario de Facturas

## Problema Reportado

El formulario funciona correctamente cuando lo usa el desarrollador, pero falla para otros usuarios.

## ✅ Mejoras Implementadas

### 1. **Compatibilidad de Tipos MIME**

- **Problema Original**: Diferentes navegadores reportan tipos MIME diferentes para archivos XML
    - Chrome/Edge: `text/xml`
    - Firefox: `application/xml`
    - Windows Explorer: `text/plain`
    - Algunos navegadores: Sin tipo MIME

- **Solución**:
    - Validación por extensión de archivo (`.xml`) como método principal
    - Acepta múltiples tipos MIME: `text/xml`, `application/xml`, `text/plain`
    - Se fuerza el tipo MIME correcto al enviar usando `Blob`

### 2. **Logging Mejorado**

Se agregaron logs detallados en la consola para identificar problemas:

```javascript
// Al enviar el formulario
console.log("Enviando formulario con:", {...});

// Al cargar archivos XML
console.log('XML cargado correctamente:', {...});

// En caso de error
console.error("Error completo:", {...});
```

### 3. **Manejo de Errores Mejorado**

- Mensajes de error más específicos según el tipo de problema
- Detección de errores de CORS
- Detección de errores de conexión
- Manejo de respuestas no-JSON del servidor

### 4. **Encoding de Caracteres**

- Se especifica UTF-8 al leer archivos XML: `reader.readAsText(file, 'UTF-8')`
- Importante para archivos con caracteres especiales (ñ, tildes, etc.)

## 🐛 Cómo Debugging Cuando Falle

### Paso 1: Abrir la Consola del Navegador

1. Presionar `F12` o clic derecho → "Inspeccionar"
2. Ir a la pestaña "Console"

### Paso 2: Revisar los Logs

Cuando un usuario intente enviar el formulario, verás estos logs:

```
Enviando formulario con: {
  nit: "123456789",
  serie: "ABC123",
  pdfName: "factura.pdf",
  pdfType: "application/pdf",
  pdfSize: 245678,
  xmlName: "factura.xml",
  xmlType: "text/xml",  ← IMPORTANTE: este valor
  xmlSize: 12345
}
```

### Paso 3: Identificar el Problema

#### Error 1: "El archivo debe tener extensión .xml"

**Causa**: El navegador no detectó el tipo MIME y el archivo no tiene extensión .xml
**Solución**: Verificar que el archivo termine en `.xml`

#### Error 2: CORS Error

```
Error de red. El servidor podría estar bloqueado por CORS o un firewall.
```

**Causa**: El servidor webhook no permite solicitudes desde el dominio del usuario
**Solución**: Configurar CORS en el servidor para permitir el origen

#### Error 3: NetworkError / Failed to fetch

**Causa**:

- Sin conexión a internet
- Firewall bloqueando el servidor
- VPN interfiriendo
- Servidor caído

**Solución**:

- Verificar conexión a internet
- Probar desactivar VPN
- Verificar que el servidor esté activo

#### Error 4: Error 400/500 del servidor

```
Error del servidor (400): Bad Request
```

**Causa**: El servidor rechazó los datos enviados
**Solución**: Revisar los logs del servidor para ver qué campo causó el problema

## 🧪 Cómo Probar con Diferentes Navegadores

### Chrome

### Firefox

### Edge

### Safari (Mac)

- Safari puede ser más estricto con tipos MIME
- Verificar en la consola el tipo MIME detectado

## 📋 Checklist para Usuarios con Problemas

Pedir al usuario que verifique:

- [ ] ¿El archivo XML termina en `.xml`?
- [ ] ¿El archivo PDF termina en `.pdf`?
- [ ] ¿Los archivos pesan menos de 5MB cada uno?
- [ ] ¿Hay conexión a internet?
- [ ] ¿Qué navegador está usando? (Chrome, Firefox, Safari, Edge)
- [ ] ¿Está usando VPN?
- [ ] ¿Puede compartir una captura de la consola del navegador?

## 🔧 Soluciones Rápidas

### Para el Usuario:

1. **Intentar con otro navegador** (preferiblemente Chrome o Edge)
2. **Verificar extensiones de archivo**: asegurarse que termine en `.xml` y `.pdf`
3. **Desactivar VPN temporalmente**
4. **Limpiar caché del navegador**
5. **Intentar con archivos más pequeños** (menos de 1MB para probar)

### Para el Desarrollador:

1. **Revisar configuración CORS del servidor**:

    ```javascript
    // El servidor debe incluir estos headers:
    Access-Control-Allow-Origin: *  // o el dominio específico
    Access-Control-Allow-Methods: POST
    Access-Control-Allow-Headers: Content-Type, Accept
    ```

2. **Revisar logs del servidor** para ver qué está recibiendo

3. **Verificar que el endpoint acepta `multipart/form-data`**

## 📊 Datos a Recopilar de Usuarios con Problemas

1. **Navegador y versión**
2. **Sistema operativo**
3. **Mensaje de error exacto**
4. **Screenshot de la consola del navegador (F12)**
5. **Tipo de archivo XML (abrir con notepad, copiar primera línea)**

## 🚀 Mejoras Adicionales Recomendadas

1. **Implementar retry automático** en caso de error de red
2. **Agregar validación de contenido XML** (verificar que sea XML bien formado)
3. **Implementar timeout** para requests que tarden mucho
4. **Agregar indicador de progreso** para archivos grandes
5. **Guardar en localStorage** los datos del formulario como backup

---

**Nota**: Con las mejoras implementadas, el formulario ahora debería funcionar en la mayoría de navegadores modernos. Si persisten los problemas, la causa más probable es CORS o problemas en el servidor backend.
