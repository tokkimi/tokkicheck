"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, SunMoon } from "lucide-react";

type ThemeMode = "system" | "light" | "dark";

const STORAGE_KEY = "tokkicheck-theme";
const MODES: ThemeMode[] = ["system", "light", "dark"];
const MODE_ICON = { system: SunMoon, light: Sun, dark: Moon };
const MODE_LABEL = { system: "시스템 모드", light: "라이트 모드", dark: "다크 모드" };

function applyTheme(mode: ThemeMode) {
  if (mode === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", mode);
  }
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "system";
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 서버 렌더링과 하이드레이션 시점의 아이콘 불일치(mismatch)를 막기 위해
    // 클라이언트에 마운트된 이후에만 실제 아이콘을 표시합니다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const cycle = () => {
    const next = MODES[(MODES.indexOf(mode) + 1) % MODES.length];
    setMode(next);
    applyTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const Icon = MODE_ICON[mode];

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`화면 테마: ${MODE_LABEL[mode]} (탭하여 변경)`}
      title={MODE_LABEL[mode]}
      className={`flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-black/5 ${className}`}
    >
      {mounted ? <Icon size={20} /> : <span className="block h-5 w-5" />}
    </button>
  );
}

export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var mode = window.localStorage.getItem("${STORAGE_KEY}");
    if (mode === "light" || mode === "dark") {
      document.documentElement.setAttribute("data-theme", mode);
    }
  } catch (e) {}
})();
`;
