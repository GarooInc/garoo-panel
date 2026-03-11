import { Input, Select, Toggle, SectionTitle } from "../fields/FormFields";

export default function Phase4Form({ data, onChange }) {
    const set = (k) => (v) => onChange({ ...data, [k]: v });

    return (
        <div>
            <SectionTitle>CRM</SectionTitle>
            <Toggle label="¿Tienen CRM?" value={data.tiene_crm} onChange={set("tiene_crm")} hint="Sistema de gestión de clientes" />
            {data.tiene_crm === "si" && (
                <>
                    <Select
                        label="Plataforma CRM"
                        value={data.crm_tipo}
                        onChange={set("crm_tipo")}
                        options={[
                            { value: "", label: "Seleccionar..." },
                            { value: "hubspot", label: "HubSpot" },
                            { value: "salesforce", label: "Salesforce" },
                            { value: "pipedrive", label: "Pipedrive" },
                            { value: "zoho", label: "Zoho CRM" },
                            { value: "propio", label: "Sistema propio" },
                            { value: "otro", label: "Otro" },
                        ]}
                    />
                    <Input label="API Key del CRM" value={data.crm_api_key} onChange={set("crm_api_key")} placeholder="sk-..." hint="Se encripta antes de almacenarse" type="password" />
                </>
            )}

            <SectionTitle top>Calendario / Citas</SectionTitle>
            <Toggle label="¿El agente necesita agendar citas?" value={data.tiene_calendario} onChange={set("tiene_calendario")} />
            {data.tiene_calendario === "si" && (
                <>
                    <Select
                        label="Sistema de calendario"
                        value={data.calendario_sistema}
                        onChange={set("calendario_sistema")}
                        options={[
                            { value: "", label: "Seleccionar..." },
                            { value: "calendly", label: "Calendly" },
                            { value: "google_calendar", label: "Google Calendar" },
                            { value: "outlook", label: "Outlook Calendar" },
                            { value: "propio", label: "Sistema propio" },
                        ]}
                    />
                    <Input label="API Key / Token de acceso" value={data.calendario_api_key} onChange={set("calendario_api_key")} placeholder="Token de acceso..." type="password" hint="Se encripta antes de almacenarse" />
                </>
            )}

            <SectionTitle top>E-commerce</SectionTitle>
            <Toggle label="¿Venden productos online?" value={data.tiene_ecommerce} onChange={set("tiene_ecommerce")} />
            {data.tiene_ecommerce === "si" && (
                <>
                    <Select
                        label="Plataforma de e-commerce"
                        value={data.ecommerce_plataforma}
                        onChange={set("ecommerce_plataforma")}
                        options={[
                            { value: "", label: "Seleccionar..." },
                            { value: "shopify", label: "Shopify" },
                            { value: "woocommerce", label: "WooCommerce" },
                            { value: "tiendanube", label: "Tienda Nube" },
                            { value: "vtex", label: "VTEX" },
                            { value: "propio", label: "Plataforma propia" },
                        ]}
                    />
                    <Input label="API Key del e-commerce" value={data.ecommerce_api_key} onChange={set("ecommerce_api_key")} placeholder="Token de acceso..." type="password" hint="Se encripta antes de almacenarse" />
                </>
            )}
        </div>
    );
}
