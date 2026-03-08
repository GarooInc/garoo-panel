import { PHASES } from "../config";
import styles from "./PhaseNavSidebar.module.css";

export default function PhaseNavSidebar({ clientId, currentPhase, completedPhases, onSelectPhase }) {
    const progress = Math.round((completedPhases.size / PHASES.length) * 100);

    return (
        <aside className={styles.sidebar}>
            {/* Brand */}
            <div className={styles.brand}>
                <div className={styles.brandRow}>
                    <div className={styles.brandLogo}>
                        <div className={styles.brandLogoInner} />
                    </div>
                    <div>
                        <div className={styles.brandName}>Garoo</div>
                        <div className={styles.brandSub}>Agent Onboarding</div>
                    </div>
                </div>
                <div className={styles.clientId} title={clientId}>
                    ID: {clientId}
                </div>
            </div>

            {/* Phase navigation */}
            <nav className={styles.nav}>
                <div className={styles.navTitle}>Fases de configuración</div>
                <div className={styles.navList}>
                    {PHASES.map(p => {
                        const isActive = currentPhase === p.id;
                        const isDone = completedPhases.has(p.id);
                        return (
                            <button
                                key={p.id}
                                onClick={() => onSelectPhase(p.id)}
                                className={styles.navItem}
                                style={{
                                    background: isActive ? `${p.color}12` : "transparent",
                                    borderColor: isActive ? `${p.color}30` : "transparent",
                                }}
                            >
                                <div
                                    className={styles.navIcon}
                                    style={{
                                        background: isDone ? `${p.color}25`
                                            : isActive ? `${p.color}18`
                                                : "#0E0E14",
                                        color: isDone || isActive ? p.color : "#333",
                                    }}
                                >
                                    {isDone ? "✓" : p.num}
                                </div>
                                <div>
                                    <div
                                        className={styles.navLabel}
                                        style={{ color: isActive ? "#E0E0D8" : isDone ? "#888" : "#444" }}
                                    >
                                        {p.label}
                                    </div>
                                    <div className={styles.navSublabel}>
                                        {isDone ? "Completado" : isActive ? "En progreso" : "Pendiente"}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Progress */}
            <div className={styles.progress}>
                <div className={styles.progressRow}>
                    <span className={styles.progressLabel}>Progreso general</span>
                    <span className={styles.progressCount}>{completedPhases.size}/{PHASES.length}</span>
                </div>
                <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                </div>
            </div>
        </aside>
    );
}
