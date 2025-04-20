"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // shadcn/ui 버튼 컴포넌트 import

export default function Error() {
    const router = useRouter();

    return (
        <div className="h-full flex flex-col items-center justify-center min-h-[60vh] py-16">
            <h1 className="text-4xl font-bold text-red-700 mb-2">500</h1>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
                서버 에러
            </h2>
            <p className="mb-8 text-gray-500 text-center">
                서버에 문제가 발생했습니다.
                <br />
                나중에 다시 시도해 주세요.
            </p>
            <Button
                variant="default"
                onClick={() => router.push("/")}
                className="px-6 py-2 text-lg"
            >
                홈으로 돌아가기
            </Button>
        </div>
    );
}
