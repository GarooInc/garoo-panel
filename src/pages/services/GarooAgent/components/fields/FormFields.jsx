import styles from "./FormFields.module.css";

// ─── INPUT ────────────────────────────────────────────────────────────────────
export const Input = ({ label, value, onChange, placeholder, type = "text", hint }) => (
    <div className={styles.field}>
        <label className={styles.label}>{label}</label>
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className={styles.input}
        />
        {hint && <div className={styles.hint}>{hint}</div>}
    </div>
);

// ─── TEXTAREA ─────────────────────────────────────────────────────────────────
export const Textarea = ({ label, value, onChange, placeholder, rows = 3, hint }) => (
    <div className={styles.field}>
        <label className={styles.label}>{label}</label>
        <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={styles.textarea}
        />
        {hint && <div className={styles.hint}>{hint}</div>}
    </div>
);

// ─── SELECT ───────────────────────────────────────────────────────────────────
export const Select = ({ label, value, onChange, options, hint }) => (
    <div className={styles.field}>
        <label className={styles.label}>{label}</label>
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className={styles.select}
        >
            {options.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
            ))}
        </select>
        {hint && <div className={styles.hint}>{hint}</div>}
    </div>
);

// ─── TOGGLE ───────────────────────────────────────────────────────────────────
export const Toggle = ({ label, value, onChange, hint }) => {
    const isOn = value === "si";
    return (
        <div className={styles.toggle}>
            <div className={styles.toggleInfo}>
                <div className={styles.toggleLabel}>{label}</div>
                {hint && <div className={styles.toggleHint}>{hint}</div>}
            </div>
            <button
                onClick={() => onChange(isOn ? "no" : "si")}
                className={styles.toggleBtn}
                style={{ background: isOn ? "#F0E040" : "#1A1A20" }}
            >
                <div
                    className={styles.toggleKnob}
                    style={{
                        background: isOn ? "#0A0A0C" : "#444",
                        left: isOn ? "23px" : "3px",
                    }}
                />
            </button>
        </div>
    );
};

// ─── SECTION TITLE ────────────────────────────────────────────────────────────
export const SectionTitle = ({ children, top }) => (
    <div className={`${styles.sectionTitle} ${top ? styles.sectionTitleTop : ""}`}>
        {children}
    </div>
);

// ─── ADD BUTTON ───────────────────────────────────────────────────────────────
export const AddButton = ({ onClick, label }) => (
    <button onClick={onClick} className={styles.addButton}>
        {label}
    </button>
);

// ─── CARD (wrapper for FAQ / Product items) ───────────────────────────────────
export const Card = ({ index, label, onRemove, canRemove, children }) => (
    <div className={styles.card}>
        <div className={styles.cardHeader}>
            <span className={styles.cardIndex}>{label} {String(index + 1).padStart(2, "0")}</span>
            {canRemove && (
                <button onClick={onRemove} className={styles.cardRemove}>×</button>
            )}
        </div>
        {children}
    </div>
);

// ─── TWO COLUMN GRID ──────────────────────────────────────────────────────────
export const TwoCol = ({ children }) => (
    <div className={styles.twoCol}>{children}</div>
);
