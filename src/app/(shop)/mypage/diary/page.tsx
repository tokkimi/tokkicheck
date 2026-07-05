import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getDiaryEntries } from "@/lib/queries";
import { DiaryClient } from "@/components/DiaryClient";
import { requireUser } from "@/lib/authz";

export const dynamic = "force-dynamic";

function todayKst(): string {
  // KST(UTC+9) 기준 오늘 날짜
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return now.toISOString().slice(0, 10);
}

export default async function DiaryPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const session = await requireUser("/mypage/diary");

  const { date } = await searchParams;
  const activeDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : todayKst();

  const [entries, user] = await Promise.all([
    getDiaryEntries(session.user.id, activeDate),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { calorieGoal: true } }),
  ]);

  return (
    <div className="px-4 py-4 md:mx-auto md:max-w-2xl">
      <div className="mb-1 flex items-center gap-2">
        <Link
          href="/mypage"
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5"
          aria-label="뒤로 가기"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-lg font-extrabold text-gray-900">식단 다이어리</h1>
      </div>

      <DiaryClient
        date={activeDate}
        initialEntries={entries.map((e) => ({
          id: e.id,
          quantity: e.quantity,
          calories: e.calories,
          loggedAt: e.loggedAt.toISOString(),
          product: e.product,
        }))}
        calorieGoal={user?.calorieGoal ?? 2000}
      />
    </div>
  );
}
