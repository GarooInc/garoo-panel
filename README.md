# Garoo Services Portal 🚀

### Plataforma Integral de Gestión y Soluciones Digitales

**Garoo** es una plataforma centralizada diseñada para optimizar procesos operativos a través de diversas unidades de negocio. Ofrece un ecosistema de herramientas digitales que van desde la gestión de talento humano hasta el monitoreo de contactos en tiempo real.

---

## 🌟 Características Principales

- **Interfaz Premium:** Diseño moderno basado en _Glassmorphism_, con transiciones suaves y una experiencia de usuario fluida.
- **Multi-Servicio:** Acceso centralizado a diferentes verticales de negocio (RocknRolla, Mundo Verde, Ficohsa, Spectrum).
- **Totalmente en Español:** Interfaz 100% localizada para el mercado hispanohablante.
- **Arquitectura Robusta:** Construido sobre React y Vite para un rendimiento ultrarrápido.
- **Responsive Design:** Optimizado para dispositivos móviles, tablets y escritorio.

---

## 🛠️ Unidades de Servicio

### 👨‍💼 RocknRolla: Gestión de Talento

Un completo gestor de aplicaciones para selección de personal.

- Visualización detallada de perfiles de candidatos.
- Generación automática de currículums en PDF.
- Filtros avanzados por puesto, nacionalidad y pretensión salarial.

### 📄 Mundo Verde: Gestión Documental

Herramienta de procesamiento eficiente de documentos y facturación.

- Carga y validación de archivos PDF y XML.
- Integración con webhooks para procesamiento en la nube.

### 📞 Ficohsa: Centro de Llamadas

Interfaz optimizada para el registro y gestión de llamadas outbound.

- Formularios dinámicos para captura de datos de clientes potenciales.
- Validación en tiempo real y confirmación de envío.

### 📊 Spectrum Hub: Panel de Leads

Dashboard dinámico para el monitoreo de leads en tiempo real.

- Conexión directa vía webhooks con agentes de IA.
- Visualización de estados, sentimientos (emoción) y canales de contacto.

---

## 🚀 Tecnologías Utilizadas

- **Core:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Estilos:** Bootstrap 5, Vanilla CSS (Glassmorphism), CSS Modules.
- **Navegación:** React Router 6.
- **Gestión de Datos:** Axios, Webhooks API.
- **Utilidades:** [jsPDF](https://github.com/parallax/jsPDF) (Generación de documentos), React Hook Form.

---

## ⚙️ Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente:

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/jcalderon90/garoo-frontend.git
   cd garoo-frontend
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**

   ```bash
   npm run dev
   ```

4. **Construir para producción:**
   ```bash
   npm run build
   ```

---

## 🌐 Despliegue

El proyecto está configurado para despliegue automático en **Netlify**. Cada push a la rama principal (`main`) dispara una nueva versión en producción aprovechando las capacidades de CI/CD de GitHub.

---

## 📝 Notas de Versión (v2.0)

- Migración completa a una estética premium y oscura.
- Unificación de todos los servicios bajo un mismo portal operativo.
- Implementación de redirecciones inteligentes de API para entornos de producción.
- Corrección de conflictos de dependencias (ESLint/React Hooks).

---

Desarrollado con ❤️ para **Garoo Servicios**.
