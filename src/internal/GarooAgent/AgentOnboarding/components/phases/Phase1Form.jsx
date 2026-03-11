import { Input, Textarea, Select, SectionTitle } from "../fields/FormFields";

export default function Phase1Form({ data, onChange }) {
    const set = (k) => (v) => onChange({ ...data, [k]: v });

    return (
        <div>
            <SectionTitle>Datos del negocio</SectionTitle>
            <Input
                label="Nombre del negocio"
                value={data.nombre_negocio}
                onChange={set("nombre_negocio")}
                placeholder="Ej: Clínica Dental Sonrisa"
            />
            <Input
                label="Rubro / Industria"
                value={data.rubro}
                onChange={set("rubro")}
                placeholder="Ej: Salud, E-commerce, Restaurante..."
            />
            <Textarea
                label="Descripción del negocio"
                value={data.descripcion}
                onChange={set("descripcion")}
                placeholder="Qué hace tu empresa, a quién sirve y qué la hace única..."
                rows={3}
            />
            <Input
                label="Sitio web"
                value={data.sitio_web}
                onChange={set("sitio_web")}
                placeholder="https://tunegocio.com"
                hint="Opcional — lo usaremos para extraer información automáticamente"
            />

            <SectionTitle top>Personalidad del agente</SectionTitle>
            <Input
                label="Nombre del agente"
                value={data.nombre_agente}
                onChange={set("nombre_agente")}
                placeholder="Ej: Sara, Alex, Asistente Virtual..."
            />
            <Select
                label="Tono de comunicación"
                value={data.tono}
                onChange={set("tono")}
                options={[
                    { value: "formal", label: "Formal — profesional y distante" },
                    { value: "amigable", label: "Amigable — cercano y cálido" },
                    { value: "tecnico", label: "Técnico — preciso y directo" },
                    { value: "casual", label: "Casual — relajado e informal" },
                ]}
            />
            <Select
                label="Idioma principal"
                value={data.idioma}
                onChange={set("idioma")}
                options={[
                    { value: "es", label: "Español" },
                    { value: "en", label: "Inglés" },
                    { value: "pt", label: "Portugués" },
                    { value: "es-en", label: "Español + Inglés (bilingüe)" },
                ]}
            />
        </div>
    );
}
