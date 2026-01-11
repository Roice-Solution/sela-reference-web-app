import { useI18n } from "../i18n/i18n";
import homeBannerImage from "../../assets/home-banner.png";

export function HomePage({ pages, onNavigate, onLogout, userEmail }) {
    const { t, language, setLanguage } = useI18n();

    return (
        <div className="home-shell min-h-screen">
            <div className="mx-auto flex max-w-[1400px] flex-col gap-10 px-6 pb-14 pt-12">
                <section className="home-banner home-reveal">
                    <div className="home-banner-content">
                        <p className="home-eyebrow">{t("home.eyebrow")}</p>
                        <h1 className="home-title">{t("home.bannerTitle")}</h1>
                        <p className="home-subtitle">{t("home.bannerSubtitle")}</p>
                        {userEmail ? (
                            <p className="home-signed-in">{t("home.signedInAs", { email: userEmail })}</p>
                        ) : null}
                    </div>
                    <div className="home-banner-media" aria-hidden="true">
                        <img src={homeBannerImage} alt="" />
                    </div>
                    <div className="home-actions">
                        <div className="home-control">
                            <label htmlFor="home-language-select">{t("language.label")}</label>
                            <select
                                id="home-language-select"
                                value={language}
                                onChange={(event) => setLanguage(event.target.value)}
                            >
                                <option value="en">{t("language.english")}</option>
                                <option value="he">{t("language.hebrew")}</option>
                            </select>
                        </div>
                        <button type="button" className="home-logout" onClick={onLogout}>
                            {t("nav.logout")}
                        </button>
                    </div>
                </section>

                <section className="flex flex-col gap-6">
                    <div className="flex flex-wrap items-end justify-between gap-4 home-reveal" style={{ animationDelay: "120ms" }}>
                        <div>
                            <h2 className="home-grid-title">{t("home.gridTitle")}</h2>
                            <p className="home-grid-subtitle">{t("home.gridSubtitle")}</p>
                        </div>
                    </div>

                    <div
                        className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${pages.length < 3 ? "lg:justify-center" : ""}`}
                        style={pages.length < 3 ? { justifyItems: "center" } : undefined}
                    >
                        {pages.map((page, index) => {
                            const isLast = index === pages.length - 1;
                            const shouldCenterLastOnLg = pages.length % 3 === 1;
                            return (
                            <button
                                key={page.key}
                                type="button"
                                className={`home-card home-reveal text-center ${isLast && shouldCenterLastOnLg ? "lg:col-start-2" : ""}`}
                                style={{ animationDelay: `${180 + index * 80}ms`, "--accent": page.accent }}
                                onClick={() => onNavigate(page.key)}
                            >
                                <div className="home-card-top">
                                    <span className="home-card-dot" />
                                    <span className="home-card-label">{page.label}</span>
                                </div>
                                <p className="home-card-description">{page.description}</p>
                                <span className="home-card-cta">{t("home.openWorkspace")}</span>
                            </button>
                            );
                        })}
                    </div>
                </section>
            </div>
        </div>
    );
}
