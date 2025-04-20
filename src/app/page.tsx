import React from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
    return (
        <div className="w-full h-full p-4 text-center flex flex-col justify-between">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                미리내를 잇는 코드
            </h1>
            <h2 className="text-3xl text-accent-foreground">
                SeHi&apos;s Tech Blog
            </h2>

            <div className="mt-4 flex-1 space-y-8 text-gray-400 flex flex-col justify-between gap-4">
                {/* 최근 포스트 섹션 */}
                <Card className="border-2 border-foreground m-0">
                    <CardTitle className="text-start px-4">
                        최근 포스트
                    </CardTitle>
                    <CardContent>
                        <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 min-h-50">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className="h-full min-h-40 w-full rounded-md"
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 최근 작업 로그 섹션 */}
                <Card className="border-2 border-foreground flex-1 m-0">
                    <CardTitle className="text-start px-4">
                        최근 작업 기록
                    </CardTitle>
                    <CardContent className="h-full">
                        <div className="h-full flex flex-col justify-between gap-2">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className="w-full flex-1 min-h-6 rounded-md m-0"
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
