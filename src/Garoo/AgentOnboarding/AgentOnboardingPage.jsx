import { useRef } from "react";
import { PHASES } from "./config";
import { useOnboarding } from "./hooks/useOnboarding";
import PhaseNavSidebar from "./components/PhaseNavSidebar";
import Phase1Form from "./components/phases/Phase1Form";
import Phase2Form from "./components/phases/Phase2Form";
import Phase3Form from "./components/phases/Phase3Form";
import Phase4Form from "./components/phases/Phase4Form";
import Phase5Form from "./components/phases/Phase5Form";
import SubmittedScreen from "./SubmittedScreen";
import styles from "./AgentOnboardingPage.module.css";

const PHASE_FORMS = {
    1: Phase1Form,
    2: Phase2Form,
    3: Phase3Form,
    4: Phase4Form,
    5: Phase5Form,
};

export default function AgentOnboardingPage() {
    const {
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
    } = useOnboarding();

    if (submitted) return <SubmittedScreen />;

    const phaseConfig = PHASES.find(p => p.id === currentPhase);
    const PhaseForm = PHASE_FORMS[currentPhase];
    const phaseKey = phaseConfig.key;
    const allCompleted = completedPhases.size === PHASES.length;

    return (
        <div className={styles.wrapper}>
            {/* Toast */}
            {toast && (
                <div className={`${styles.toast} ${toast.type === "ok" ? styles.toastOk : styles.toastWarn}`}>
                    {toast.msg}
                </div>
            )}

            <div className={styles.layout}>
                {/* ── Left sidebar ── */}
                <PhaseNavSidebar
                    clientId={clientId}
                    currentPhase={currentPhase}
                    completedPhases={completedPhases}
                    onSelectPhase={setCurrentPhase}
                />

                {/* ── Right content ── */}
                <main className={styles.content}>
                    <div className={styles.contentInner} ref={topRef}>

                        {/* Phase header */}
                        <div className={styles.phaseHeader}>
                            <div className={styles.phaseMeta}>
                                <div
                                    className={styles.phaseBadge}
                                    style={{
                                        background: `${phaseConfig.color}18`,
                                        color: phaseConfig.color,
                                        border: `1px solid ${phaseConfig.color}30`,
                                    }}
                                >
                                    {phaseConfig.num} — {phaseConfig.label.toUpperCase()}
                                </div>
                                {completedPhases.has(currentPhase) && (
                                    <span className={styles.savedTag}>✓ Guardado</span>
                                )}
                            </div>
                            <h1 className={styles.phaseTitle}>{phaseConfig.label}</h1>
                            <p className={styles.phaseDesc}>{phaseConfig.desc}</p>
                        </div>

                        {/* Form card */}
                        <div className={styles.formCard} key={currentPhase}>
                            <PhaseForm
                                data={formData[phaseKey]}
                                onChange={(data) => updatePhaseData(phaseKey, data)}
                            />
                        </div>

                        {/* Actions */}
                        <div className={styles.actions}>
                            <button
                                className={styles.btnPrev}
                                onClick={() => setCurrentPhase(p => p - 1)}
                                disabled={currentPhase === 1}
                            >
                                ← Anterior
                            </button>
                            <button
                                className={styles.btnSave}
                                onClick={() => handleSavePhase(currentPhase)}
                                disabled={sending}
                                style={{
                                    background: phaseConfig.color,
                                }}
                            >
                                {sending
                                    ? "Guardando..."
                                    : currentPhase < 5
                                        ? "Guardar y continuar →"
                                        : "Guardar fase final"
                                }
                            </button>
                        </div>

                        {/* Final submit — visible when all phases are done */}
                        {allCompleted && (
                            <div className={styles.finalSubmit}>
                                <div className={styles.finalTitle}>¡Todo listo!</div>
                                <p className={styles.finalDesc}>
                                    Completaste las {PHASES.length} fases. Envía la configuración
                                    para activar el agente de tu negocio.
                                </p>
                                <button
                                    className={styles.btnFinal}
                                    onClick={handleFinalSubmit}
                                    disabled={sending}
                                >
                                    {sending ? "Enviando..." : "Activar agente →"}
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
