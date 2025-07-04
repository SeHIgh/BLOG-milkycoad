// src/pages/about.tsx
import React from "react";

const techStack = [
    {
        category: "💻 프로그래밍 언어",
        items: [
            { name: "Python", color: "bg-[#3776AB]", logo: "python" },
            { name: "C", color: "bg-[#A8B9CC]", logo: "c" },
            { name: "Java", color: "bg-[#ED8B00]", logo: "openjdk" },
        ],
    },
    {
        category: "🖼️ 프론트엔드",
        items: [
            { name: "HTML5", color: "bg-[#E34F26]", logo: "html5" },
            { name: "CSS3", color: "bg-[#1572B6]", logo: "css3" },
            {
                name: "JavaScript",
                color: "bg-[#F7DF1E] text-black",
                logo: "javascript",
            },
            { name: "TypeScript", color: "bg-[#3178C6]", logo: "typescript" },
            { name: "React", color: "bg-[#61DAFB] text-black", logo: "react" },
            { name: "TailwindCSS", color: "bg-[#06B6D4]", logo: "tailwindcss" },
            { name: "Vite", color: "bg-[#646CFF]", logo: "vite" },
        ],
    },
    {
        category: "🛠️ 백엔드",
        items: [{ name: "Node.js", color: "bg-[#339933]", logo: "node.js" }],
    },
    {
        category: "🗄️ 데이터베이스",
        items: [{ name: "MySQL", color: "bg-[#005C84]", logo: "mysql" }],
    },
    {
        category: "🔧 기타 도구",
        items: [
            { name: "Git", color: "bg-[#F05032]", logo: "git" },
            { name: "Excel", color: "bg-[#217346]", logo: "microsoft-excel" },
            {
                name: "PowerPoint",
                color: "bg-[#B7472A]",
                logo: "microsoft-powerpoint",
            },
            { name: "Word", color: "bg-[#2B579A]", logo: "microsoft-word" },
        ],
    },
    {
        category: "📘 학습 중",
        items: [
            { name: "Next.js", color: "bg-black", logo: "next.js" },
            { name: "Spring", color: "bg-[#6DB33F]", logo: "spring" },
            { name: "shadcn/ui", color: "bg-black", logo: "radix-ui" },
            { name: "OpenSearch", color: "bg-[#005EB8]", logo: "opensearch" },
            { name: "Bootstrap", color: "bg-[#7952B3]", logo: "bootstrap" },
        ],
    },
    {
        category: "🗓️ 관심 있는 기술",
        items: [
            { name: "C++", color: "bg-[#00599C]", logo: "c++" },
            { name: "Django", color: "bg-[#092E20]", logo: "django" },
            { name: "MongoDB", color: "bg-[#4EA94B]", logo: "mongodb" },
            { name: "GraphQL", color: "bg-[#E10098]", logo: "graphql" },
        ],
    },
];

const contacts = [
    {
        name: "Naver",
        url: "mailto:sehi0119@naver.com",
        color: "bg-[#03C75A]",
        logo: "naver",
        text: "Naver_mail",
    },
    {
        name: "Gmail",
        url: "mailto:sehigh019@gmail.com",
        color: "bg-[#D14836]",
        logo: "gmail",
        text: "Gmail",
    },
];

export default function AboutPage() {
    return (
        <div className="w-full mx-auto p-4 h-full overflow-y-scroll">
            <img
                className="w-full mb-6 border-2 border-foreground rounded-lg"
                src="/SeHi_Banner_Blue_BG.png"
                alt="SeHi_Banner_Blue_BG"
            />
            <h1 className="text-4xl font-bold text-center mb-2">Se Hi :)</h1>
            <h3 className="text-xl font-semibold text-center mb-4">
                💫 흐르는 정보와 아름다운 인터페이스를 은하수처럼 잇는 개발자
            </h3>

            <div className="flex flex-col md:flex-row justify-center items-center gap-4 my-6">
                <div className="border-2 border-foreground rounded-lg overflow-hidden h-fit w-fit">
                    <img
                        src="https://github-readme-stats.vercel.app/api?username=SeHIgh&show_icons=true&theme=holi&locale=kr&hide_border=true&bg_color=C9D9E7&text_color=5580A1&title_color=6ca2cc&icon_color=6ca2cc"
                        alt="SeHIgh's GitHub Stats"
                        height={180}
                    />
                </div>
                <div className="border-2 border-foreground rounded-lg overflow-hidden h-fit w-fit">
                    <img
                        src="https://github-readme-stats.vercel.app/api/top-langs?username=SeHIgh&layout=compact&langs_count=8&show_icons=true&theme=holi&locale=kr&hide_border=true&bg_color=C9D9E7&text_color=5580A1&title_color=6ca2cc&icon_color=6ca2cc"
                        alt="SeHIgh's Top Langs"
                        height={180}
                    />
                </div>
            </div>
            <hr />
            <section className="my-8">
                <h2 className="text-2xl font-bold mb-2">🎯 목표</h2>
                <div className="text-center mb-2 font-semibold text-lg">
                    &quot;그저 그렇지 않은 사람이 되자&quot;
                </div>
                <div className="text-center mb-4">
                    🚀 <strong>✦풀스택✧</strong> 개발자를 꿈꾸는 컴퓨터공학 전공
                    프론트엔드 개발자 입니다.
                </div>
                <ul className="list-disc list-inside space-y-2">
                    <li>
                        &quot;그저 그렇지 않은 사람&quot; 으로 코드 한 줄,
                        디자인 하나에도 특별함을 담아내며 <br />
                        잊히지 않을 <strong>은하수</strong> 같은 경험을 제공하는
                        개발자로 성장하는 것이 목표입니다.
                    </li>
                    <li>
                        데이터의 흐름과 감각적인 사용자 경험을 연결하며,
                        사람들에게 가치 있는 웹 서비스를 만들고 싶습니다.
                    </li>
                </ul>
            </section>
            <hr />
            <section className="my-8">
                <h2 className="text-2xl font-bold mb-4">🛠️ 기술 스택</h2>
                <div className="space-y-4">
                    {techStack.map((stack) => (
                        <div key={stack.category}>
                            <div className="font-semibold mb-1">
                                {stack.category}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {stack.items.map((item) => (
                                    <span
                                        key={item.name}
                                        className={`inline-flex items-center px-3 py-1 rounded-md text-white font-semibold text-sm ${item.color}`}
                                    >
                                        <span className="mr-1">
                                            {/* <img
                                                src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${item.logo}.svg`}
                                                alt={item.name}
                                                className="w-4 h-4 inline-block"
                                                onError={(e) =>
                                                    (e.currentTarget.style.display =
                                                        "none")
                                                }
                                            /> */}
                                        </span>
                                        {item.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <hr />
            <section className="my-8">
                <h2 className="text-2xl font-bold mb-4">☎️ 연락처</h2>
                <div className="flex gap-3">
                    {contacts.map((contact) => (
                        <a
                            key={contact.name}
                            href={contact.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center px-3 py-1 rounded-md text-white font-semibold ${contact.color} hover:opacity-80 transition`}
                        >
                            {/* <img
                                src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${contact.logo}.svg`}
                                alt={contact.name}
                                className="w-5 h-5 mr-2"
                                onError={(e) =>
                                    (e.currentTarget.style.display = "none")
                                }
                            /> */}
                            {contact.text}
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
}
