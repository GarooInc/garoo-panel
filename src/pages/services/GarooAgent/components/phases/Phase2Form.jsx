import { Input, Textarea, SectionTitle, AddButton, Card, TwoCol } from "../fields/FormFields";

export default function Phase2Form({ data, onChange }) {
    const set = (k) => (v) => onChange({ ...data, [k]: v });

    const updateFaq = (i, field, val) => {
        const updated = data.faqs.map((f, idx) => idx === i ? { ...f, [field]: val } : f);
        onChange({ ...data, faqs: updated });
    };
    const addFaq = () => onChange({ ...data, faqs: [...data.faqs, { pregunta: "", respuesta: "" }] });
    const removeFaq = (i) => onChange({ ...data, faqs: data.faqs.filter((_, idx) => idx !== i) });

    const updateProducto = (i, field, val) => {
        const updated = data.productos.map((p, idx) => idx === i ? { ...p, [field]: val } : p);
        onChange({ ...data, productos: updated });
    };
    const addProducto = () => onChange({ ...data, productos: [...data.productos, { nombre: "", descripcion: "", precio: "" }] });
    const removeProducto = (i) => onChange({ ...data, productos: data.productos.filter((_, idx) => idx !== i) });

    const setPolitic = (k) => (v) => onChange({ ...data, politicas: { ...data.politicas, [k]: v } });

    return (
        <div>
            <SectionTitle>Preguntas frecuentes</SectionTitle>
            {data.faqs.map((faq, i) => (
                <Card key={i} index={i} label="FAQ" canRemove={data.faqs.length > 1} onRemove={() => removeFaq(i)}>
                    <Input label="Pregunta" value={faq.pregunta} onChange={v => updateFaq(i, "pregunta", v)} placeholder="¿Cuáles son sus horarios?" />
                    <Textarea label="Respuesta" value={faq.respuesta} onChange={v => updateFaq(i, "respuesta", v)} placeholder="Atendemos de lunes a viernes de 8am a 6pm..." rows={2} />
                </Card>
            ))}
            <AddButton onClick={addFaq} label="+ Agregar pregunta" />

            <SectionTitle top>Productos / Servicios</SectionTitle>
            {data.productos.map((p, i) => (
                <Card key={i} index={i} label="Producto" canRemove={data.productos.length > 1} onRemove={() => removeProducto(i)}>
                    <TwoCol>
                        <Input label="Nombre" value={p.nombre} onChange={v => updateProducto(i, "nombre", v)} placeholder="Plan Premium" />
                        <Input label="Precio" value={p.precio} onChange={v => updateProducto(i, "precio", v)} placeholder="$99/mes" />
                    </TwoCol>
                    <Textarea label="Descripción" value={p.descripcion} onChange={v => updateProducto(i, "descripcion", v)} placeholder="Incluye..." rows={2} />
                </Card>
            ))}
            <AddButton onClick={addProducto} label="+ Agregar producto/servicio" />

            <SectionTitle top>Políticas</SectionTitle>
            <Textarea label="Política de devoluciones" value={data.politicas.devoluciones} onChange={setPolitic("devoluciones")} placeholder="Aceptamos devoluciones en los primeros 30 días..." rows={2} />
            <Textarea label="Política de envíos" value={data.politicas.envios} onChange={setPolitic("envios")} placeholder="Envíos en 3-5 días hábiles..." rows={2} />
            <Input label="Horario de atención" value={data.politicas.horarios} onChange={setPolitic("horarios")} placeholder="Lunes a Viernes 8am–6pm, Sábados 9am–1pm" />
            <Textarea label="Garantías" value={data.politicas.garantias} onChange={setPolitic("garantias")} placeholder="Garantía de 12 meses en todos los productos..." rows={2} />

            <SectionTitle top>Documentos adicionales</SectionTitle>
            <Textarea
                label="URLs de documentos o recursos"
                value={data.documentos_urls}
                onChange={set("documentos_urls")}
                placeholder="https://drive.google.com/file/...(uno por línea)"
                rows={3}
                hint="Google Docs, PDFs públicos, páginas web con información relevante"
            />
        </div>
    );
}
