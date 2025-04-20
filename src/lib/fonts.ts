import localFont from "next/font/local";

// 갈무리 9 폰트
export const galmuri9 = localFont({
    src: [
        {
            path: "../../public/fonts/Galmuri9.woff2",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--font-galmuri9",
    display: "swap",
});

// 갈무리 11 폰트
export const galmuri11 = localFont({
    src: [
        { path: "../../public/fonts/Galmuri11.woff2", weight: "400", style: "normal" },
        { path: "../../public/fonts/Galmuri11-Bold.woff2", weight: "700", style: "normal" },
    ],
    variable: "--font-galmuri11",
    display: "swap",
});