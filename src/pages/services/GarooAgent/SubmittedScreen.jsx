import styles from "./SubmittedScreen.module.css";

export default function SubmittedScreen() {
    return (
        <div className={styles.screen}>
            <div className={styles.icon}>✓</div>
            <h1 className={styles.title}>¡Onboarding completado!</h1>
            <p className={styles.desc}>
                Hemos recibido toda la información de tu agente. En las próximas horas
                recibirás acceso a tu agente configurado y listo para usar.
            </p>
            <div className={styles.footer}>
                Revisa tu correo para los próximos pasos · Soporte: hola@garoo.ai
            </div>
        </div>
    );
}
