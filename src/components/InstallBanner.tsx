import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const standalone = (window.navigator as Navigator & { standalone?: boolean }).standalone;
    setIsIOS(ios);

    if (ios && !standalone) {
      setShowIOSHint(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => setInstalled(true));

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setDeferredPrompt(null);
  };

  if (installed || dismissed) return null;
  if (!deferredPrompt && !showIOSHint) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-foreground text-background rounded-2xl shadow-2xl overflow-hidden">
        {/* Android / Desktop */}
        {deferredPrompt && (
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0">
              <img
                src="https://cdn.poehali.dev/projects/3474c0f3-d53e-4041-960d-b1fee573f991/files/06c278fc-9d53-4940-8ba6-4b20e3c9d7bd.jpg"
                alt="Круг"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-none">Установить Круг</p>
              <p className="text-xs mt-1 opacity-60">Работает как обычное приложение</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setDismissed(true)}
                className="text-background/50 hover:text-background/80 transition-colors p-1"
              >
                <Icon name="X" size={16} />
              </button>
              <button
                onClick={handleInstall}
                className="bg-background text-foreground text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
              >
                Установить
              </button>
            </div>
          </div>
        )}

        {/* iOS hint */}
        {isIOS && showIOSHint && !deferredPrompt && (
          <div className="px-5 py-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                  <img
                    src="https://cdn.poehali.dev/projects/3474c0f3-d53e-4041-960d-b1fee573f991/files/06c278fc-9d53-4940-8ba6-4b20e3c9d7bd.jpg"
                    alt="Круг"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-none">Установить на iPhone</p>
                  <p className="text-xs mt-1 opacity-60">Добавить на экран «Домой»</p>
                </div>
              </div>
              <button onClick={() => setShowIOSHint(false)} className="text-background/50 hover:text-background/80 transition-colors p-1 shrink-0">
                <Icon name="X" size={16} />
              </button>
            </div>
            <div className="flex flex-col gap-2 text-xs opacity-80">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-background/20 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                <span>Нажми <Icon name="Share" size={12} className="inline mx-0.5" /> «Поделиться» внизу Safari</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-background/20 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                <span>Выбери «На экран "Домой"»</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-background/20 flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                <span>Нажми «Добавить» — готово!</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
