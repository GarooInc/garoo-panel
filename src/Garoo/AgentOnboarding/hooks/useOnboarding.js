import { useState, useRef } from "react";
import {
    generateClientId,
    sendWebhook,
    buildFinalPayload,
    WEBHOOKS,
    PHASES,
    initialData,
} from "../config";

export function useOnboarding() {
    const [clientId] = useState(() => generateClientId());
    const [currentPhase, setCurrentPhase] = useState(1);
    const [formData, setFormData] = useState(initialData);
    const [completedPhases, setCompletedPhases] = useState(new Set());
    const [sending, setSending] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [toast, setToast] = useState(null);
    const topRef = useRef(null);

    const showToast = (msg, type = "ok") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const updatePhaseData = (phaseKey, data) => {
        setFormData(prev => ({ ...prev, [phaseKey]: data }));
    };

    const handleSavePhase = async (phaseId) => {
        const phase = PHASES.find(p => p.id === phaseId);
        setSending(true);
        const payload = {
            event: `agent_phase_${phaseId}_saved`,
            client_id: clientId,
            phase: phaseId,
            phase_name: phase.label,
            saved_at: new Date().toISOString(),
            data: formData[phase.key],
        };
        const ok = await sendWebhook(WEBHOOKS[phase.webhook], payload);
        setSending(false);
        setCompletedPhases(prev => new Set([...prev, phaseId]));
        showToast(
            ok
                ? `Fase ${phase.label} guardada ✓`
                : "Guardado localmente — verificar conexión",
            ok ? "ok" : "warn"
        );
        if (phaseId < 5) setCurrentPhase(phaseId + 1);
        topRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleFinalSubmit = async () => {
        setSending(true);
        const payload = buildFinalPayload(clientId, formData);
        await sendWebhook(WEBHOOKS.final, payload);
        setSending(false);
        setSubmitted(true);
    };

    return {
        clientId,
        currentPhase, setCurrentPhase,
        formData, updatePhaseData,
        completedPhases,
        sending,
        submitted,
        toast,
        topRef,
        handleSavePhase,
        handleFinalSubmit,
    };
}
