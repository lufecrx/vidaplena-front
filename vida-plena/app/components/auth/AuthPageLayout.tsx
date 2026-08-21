import React, { ReactNode } from "react";

export function PulseTrace({ id, className }: { id: string; className?: string }) {
    return (
        <svg
            viewBox="0 0 600 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <defs>
                <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8FBFA8" stopOpacity="0" />
                    <stop offset="12%" stopColor="#8FBFA8" stopOpacity="1" />
                    <stop offset="88%" stopColor="#8FBFA8" stopOpacity="1" />
                    <stop offset="100%" stopColor="#8FBFA8" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path
                d="M0,70 L120,70 L145,70 L162,18 L182,118 L200,42 L216,70 L340,70 L362,70 L380,30 L398,104 L414,70 L600,70"
                stroke={`url(#${id}-fade)`}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1000}
                className="vp-ecg-path"
            />
        </svg>
    );
}

export function authInputClass(hasError: boolean, extra = ""): string {
    return `w-full px-4 py-2.5 border rounded-lg transition-shadow focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed ${
        hasError
            ? "border-vp-coral-500 focus:ring-vp-coral-500"
            : "border-gray-300 focus:ring-vp-azul-700"
    } ${extra}`.trim();
}

export function AuthFormError({ message }: { message: string }) {
    return (
        <div
            className="w-full rounded-lg border border-vp-coral-500 bg-red-50 px-4 py-3 text-sm text-vp-coral-700 flex items-start gap-2"
            role="alert"
            aria-live="assertive"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M12 8v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="currentColor" />
            </svg>
            <span>{message}</span>
        </div>
    );
}

export function AuthPageHeader({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <div className="w-full mb-8 flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-11 h-11 mb-4 rounded-full bg-vp-azul-700/10 text-vp-azul-700">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        d="M2 12h4l2-6 4 12 3-8 1.5 2H22"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <span className="vp-mono text-[11px] uppercase tracking-[0.18em] text-vp-azul-700/70 mb-2">
                Vida Plena
            </span>
            <h1 className="vp-display text-3xl font-semibold text-gray-900">{title}</h1>
            {description && <p className="mt-2 text-sm text-gray-600">{description}</p>}
        </div>
    );
}

function AuthSidePanel() {
    return (
        <>
            <div
                className="hidden md:flex relative overflow-hidden w-full md:max-w-5/12 h-24 md:h-3/4 rounded-t-lg md:rounded-t-none md:rounded-r-lg md:shadow-lg flex-col justify-between p-10 bg-brand-primary "
                aria-hidden="true"
            >
                <span className="vp-mono text-[11px] uppercase tracking-[0.18em] text-white">
                    Gestão de saúde
                </span>

                <div className="relative flex flex-col gap-6 justify-center items-center w-full h-full">
                    <div className="vp-chip self-start rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2.5 text-white/90">
                        <p className="vp-mono text-[10px] uppercase tracking-wider animate-vp-draw">Próxima consulta</p>
                        <p className="text-sm mt-0.5">Qui, 27 ago · 14:30</p>
                    </div>

                    <PulseTrace id="vp-desktop" className="w-full h-16 -ml-2" />

                    <div className="vp-chip self-end rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2.5 text-white/90">
                        <p className="vp-mono text-[10px] uppercase tracking-wider">Frequência cardíaca</p>
                        <p className="text-sm mt-0.5">72 bpm · normal</p>
                    </div>
                </div>
            </div>

            <div
                className="md:hidden relative overflow-hidden w-full h-24 rounded-t-lg flex items-center justify-center shadow-lg bg-brand-primary"
                aria-hidden="true"
            >
                <PulseTrace id="vp-mobile" className="w-4/5 h-10" />
            </div>
        </>
    );
}

export function AuthPageLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col-reverse md:flex-row items-center justify-center h-screen w-full p-4 md:p-0 bg-[#F3F6F1]">

            <div className="flex flex-col items-center justify-center w-full md:max-w-5/12 h-auto md:h-3/4 p-6 bg-white rounded-b-lg md:rounded-b-none md:rounded-l-lg shadow-lg">
                <div className="flex flex-col items-center justify-center w-full sm:w-5/6 md:w-2/3 h-full">
                    {children}
                </div>
            </div>

            <AuthSidePanel />

        </div>
    );
}
