/**
 * @module Loading
 */
import "./Loading.css";
import LogoImage from "../Assets/logo.png";

export function Loading() {
    return (
        <div id="loading" style={styles.loading}>
            <img id="loadinglogo" src={LogoImage} style={styles.loading.logo} alt="logo" />
        </div>
    )
}
