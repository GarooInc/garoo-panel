import { Textarea, Select, SectionTitle } from "../fields/FormFields";

export default function Phase3Form({ data, onChange }) {
    const set = (k) => (v) => onChange({ ...data, [k]: v });

    return (
        <div>
            <SectionTitle>Mensajes del agente</SectionTitle>
            <Textarea
                label="Mensaje de bienvenida"
                value={data.mensaje_bienvenida}
                onChange={set("mensaje_bienvenida")}
                placeholder="¡Hola! Soy {nombre_agente}, el asistente virtual de {nombre_negocio}. ¿En qué puedo ayudarte hoy?"
                rows={3}
                hint="Puedes usar {nombre_agente} y {nombre_negocio} como variables"
            />
            <Textarea
                label="Respuesta cuando no sabe algo"
                value={data.mensaje_fallback}
                onChange={set("mensaje_fallback")}
                placeholder="No tengo esa información, pero puedo conectarte con un especialista..."
                rows={2}
            />
            <Textarea
                label="Mensaje de cierre"
                value={data.mensaje_cierre}
                onChange={set("mensaje_cierre")}
                placeholder="¿Hay algo más en lo que pueda ayudarte? ¡Que tengas un excelente día!"
                rows={2}
            />

            <SectionTitle top>Escalamiento a humano</SectionTitle>
            <Textarea
                label="Palabras o situaciones que activan el escalamiento"
                value={data.escalamiento_triggers}
                onChange={set("escalamiento_triggers")}
                placeholder="hablar con persona, quiero un humano, urgente, reclamo, problema grave..."
                rows={3}
                hint="Separadas por coma. El agente transferirá la conversación cuando detecte estas palabras"
            />
            <Select
                label="Canal de escalamiento"
                value={data.escalamiento_canal}
                onChange={set("escalamiento_canal")}
                options={[
                    { value: "whatsapp", label: "WhatsApp del equipo" },
                    { value: "email", label: "Email interno" },
                    { value: "ticket", label: "Sistema de tickets" },
                    { value: "ninguno", label: "Sin escalamiento (solo notificación)" },
                ]}
            />
            <Textarea
                label="Mensaje antes de transferir"
                value={data.mensaje_handoff}
                onChange={set("mensaje_handoff")}
                placeholder="Un momento, voy a conectarte con uno de nuestros asesores..."
                rows={2}
            />

            <SectionTitle top>Restricciones</SectionTitle>
            <Textarea
                label="Temas que el agente NUNCA debe tocar"
                value={data.temas_prohibidos}
                onChange={set("temas_prohibidos")}
                placeholder="política, religión, competidores, precios de la competencia..."
                rows={2}
                hint="Separados por coma"
            />
            <Textarea
                label="Información que NUNCA debe revelar"
                value={data.informacion_restringida}
                onChange={set("informacion_restringida")}
                placeholder="datos internos de empleados, márgenes de ganancia, proveedores..."
                rows={2}
            />
        </div>
    );
}
