import { useState } from "react";
import Icon from "@/components/ui/icon";
import InstallBanner from "@/components/InstallBanner";

const FRIENDS = [
  { id: 1, name: "Алиса М.", avatar: "А", online: true, lastSeen: "онлайн", unread: 3 },
  { id: 2, name: "Максим Д.", avatar: "М", online: false, lastSeen: "10 мин назад", unread: 0 },
  { id: 3, name: "Соня К.", avatar: "С", online: true, lastSeen: "онлайн", unread: 1 },
  { id: 4, name: "Рома Т.", avatar: "Р", online: false, lastSeen: "вчера", unread: 0 },
  { id: 5, name: "Катя Л.", avatar: "К", online: true, lastSeen: "онлайн", unread: 0 },
];

const INIT_MESSAGES: Record<number, { id: number; text: string; own: boolean; time: string }[]> = {
  1: [
    { id: 1, text: "Привет! Как дела?", own: false, time: "11:30" },
    { id: 2, text: "Всё отлично! Ты на выходных свободна?", own: true, time: "11:31" },
    { id: 3, text: "Да, давай придумаем что-нибудь 🙌", own: false, time: "11:32" },
    { id: 4, text: "Может шашлыки на даче?", own: false, time: "11:32" },
    { id: 5, text: "Отличная идея! Я за!", own: true, time: "11:35" },
  ],
  2: [
    { id: 1, text: "Макс, скинь плейлист с вечеринки", own: true, time: "вчера" },
    { id: 2, text: "Держи! Там около 40 треков", own: false, time: "вчера" },
  ],
  3: [
    { id: 1, text: "Соня, ты уже смотрела новый сериал?", own: true, time: "сегодня" },
    { id: 2, text: "Ещё нет, только начала первую серию!", own: false, time: "сегодня" },
    { id: 3, text: "Не спойлери!! 😄", own: false, time: "сейчас" },
  ],
  4: [
    { id: 1, text: "Рома, когда встречаемся?", own: true, time: "пн" },
    { id: 2, text: "Давай в эту пятницу?", own: false, time: "пн" },
  ],
  5: [
    { id: 1, text: "Катя, спасибо за помощь вчера!", own: true, time: "вт" },
    { id: 2, text: "Всегда пожалуйста 🤗", own: false, time: "вт" },
  ],
};

const GALLERY_PHOTOS = [
  { id: 1, author: "Алиса М.", emoji: "🌅", color: "from-orange-100 to-rose-100", caption: "Закат на озере" },
  { id: 2, author: "Соня К.", emoji: "🏖️", color: "from-sky-100 to-blue-100", caption: "Море в выходной" },
  { id: 3, author: "Максим Д.", emoji: "🍕", color: "from-yellow-100 to-amber-100", caption: "Пицца-пятница" },
  { id: 4, author: "Катя Л.", emoji: "🌿", color: "from-green-100 to-emerald-100", caption: "Дача в цвету" },
  { id: 5, author: "Рома Т.", emoji: "🎸", color: "from-violet-100 to-purple-100", caption: "Репетиция" },
  { id: 6, author: "Алиса М.", emoji: "☕", color: "from-stone-100 to-amber-50", caption: "Утро в кофейне" },
];

const NOTIFICATIONS = [
  { id: 1, text: "Алиса оставила 3 новых сообщения", time: "только что", icon: "MessageCircle" },
  { id: 2, text: "Соня добавила фото в галерею", time: "5 мин назад", icon: "Image" },
  { id: 3, text: "Максим вышел онлайн", time: "10 мин назад", icon: "Circle" },
  { id: 4, text: "Катя написала тебе", time: "час назад", icon: "MessageCircle" },
];

type Section = "chats" | "profile" | "settings" | "gallery" | "install";

export default function Index() {
  const [section, setSection] = useState<Section>("chats");
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [showNotif, setShowNotif] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(true);

  const totalUnread = FRIENDS.reduce((acc, f) => acc + f.unread, 0);
  const activeFriend = FRIENDS.find((f) => f.id === activeChat);

  const sendMessage = () => {
    if (!inputValue.trim() || !activeChat) return;
    setMessages((prev) => ({
      ...prev,
      [activeChat]: [
        ...(prev[activeChat] || []),
        { id: Date.now(), text: inputValue, own: true, time: "сейчас" },
      ],
    }));
    setInputValue("");
  };

  const goToChat = (id: number) => {
    setSection("chats");
    setActiveChat(id);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: "'Golos Text', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-60 flex flex-col border-r border-border bg-card h-full shrink-0">
        <div className="px-5 py-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-foreground flex items-center justify-center">
              <span className="text-background text-sm font-bold">К</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Круг</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          <button className={`nav-item ${section === "chats" ? "active" : ""}`} onClick={() => { setSection("chats"); setActiveChat(null); }}>
            <Icon name="MessageCircle" size={17} />
            <span>Чаты</span>
            {totalUnread > 0 && (
              <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${section === "chats" ? "bg-white/20 text-white" : "bg-foreground text-background"}`}>
                {totalUnread}
              </span>
            )}
          </button>
          <button className={`nav-item ${section === "gallery" ? "active" : ""}`} onClick={() => { setSection("gallery"); setActiveChat(null); }}>
            <Icon name="Images" size={17} />
            <span>Галерея</span>
          </button>
          <button className={`nav-item ${section === "profile" ? "active" : ""}`} onClick={() => { setSection("profile"); setActiveChat(null); }}>
            <Icon name="User" size={17} />
            <span>Профиль</span>
          </button>
          <button className={`nav-item ${section === "settings" ? "active" : ""}`} onClick={() => { setSection("settings"); setActiveChat(null); }}>
            <Icon name="Settings" size={17} />
            <span>Настройки</span>
          </button>

          <div className="mt-auto pt-2 border-t border-border">
            <button className={`nav-item w-full ${section === "install" ? "active" : ""}`} onClick={() => { setSection("install"); setActiveChat(null); }}>
              <Icon name="Smartphone" size={17} />
              <span>Установить</span>
            </button>
          </div>
        </nav>

        <div className="px-3 py-3 border-t border-border">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-accent cursor-pointer transition-colors">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background text-sm font-semibold">Я</div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-card" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-none truncate">Вы</p>
              <p className="text-xs text-muted-foreground mt-0.5">онлайн</p>
            </div>
            <button
              className="relative text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowNotif(!showNotif)}
            >
              <Icon name="Bell" size={16} />
              {totalUnread > 0 && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-foreground rounded-full" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {showNotif && (
          <div className="absolute top-4 right-4 z-50 w-80 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-scale-in">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <span className="font-semibold text-sm">Уведомления</span>
              <button onClick={() => setShowNotif(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="X" size={15} />
              </button>
            </div>
            <div className="divide-y divide-border">
              {NOTIFICATIONS.map((n) => (
                <div key={n.id} className="px-4 py-3 flex items-start gap-3 hover:bg-accent transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name={n.icon as "MessageCircle"} size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">{n.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHATS LIST */}
        {section === "chats" && !activeChat && (
          <div className="flex-1 overflow-hidden flex flex-col animate-fade-in">
            <div className="px-6 py-5 border-b border-border">
              <h1 className="text-xl font-bold">Чаты</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{FRIENDS.filter(f => f.online).length} друзей онлайн</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {FRIENDS.map((friend) => {
                const lastMsg = messages[friend.id]?.slice(-1)[0];
                return (
                  <button key={friend.id} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-accent transition-colors border-b border-border/50 text-left" onClick={() => setActiveChat(friend.id)}>
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full bg-secondary flex items-center justify-center font-semibold text-sm">{friend.avatar}</div>
                      {friend.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{friend.name}</span>
                        <span className="text-xs text-muted-foreground">{lastMsg?.time}</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-sm text-muted-foreground truncate pr-2">{lastMsg?.text}</p>
                        {friend.unread > 0 && (
                          <span className="shrink-0 w-5 h-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center font-medium">{friend.unread}</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* CHAT WINDOW */}
        {section === "chats" && activeChat && activeFriend && (
          <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
            <div className="px-5 py-4 border-b border-border flex items-center gap-4 bg-card">
              <button className="text-muted-foreground hover:text-foreground transition-colors" onClick={() => setActiveChat(null)}>
                <Icon name="ArrowLeft" size={20} />
              </button>
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center font-semibold text-sm">{activeFriend.avatar}</div>
                {activeFriend.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-card" />}
              </div>
              <div>
                <p className="font-semibold text-sm leading-none">{activeFriend.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{activeFriend.lastSeen}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3 bg-background">
              {(messages[activeChat] || []).map((msg) => (
                <div key={msg.id} className={`flex ${msg.own ? "justify-end" : "justify-start"} animate-fade-in`}>
                  <div className={`max-w-xs px-4 py-2.5 text-sm leading-relaxed ${msg.own ? "bubble-own" : "bubble-other"}`}>
                    {msg.text}
                    <span className={`block text-right text-[10px] mt-1 ${msg.own ? "opacity-50" : "text-muted-foreground"}`}>{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-border bg-card">
              <div className="flex items-center gap-3 bg-secondary rounded-2xl px-4 py-2">
                <input
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  placeholder="Написать сообщение..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-80 transition-opacity shrink-0 disabled:opacity-30" onClick={sendMessage} disabled={!inputValue.trim()}>
                  <Icon name="ArrowUp" size={15} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* GALLERY */}
        {section === "gallery" && (
          <div className="flex-1 overflow-y-auto animate-fade-in">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">Галерея</h1>
                <p className="text-sm text-muted-foreground mt-0.5">Фото от друзей</p>
              </div>
              <button className="flex items-center gap-2 text-sm font-medium bg-foreground text-background px-4 py-2 rounded-xl hover:opacity-80 transition-opacity">
                <Icon name="Plus" size={15} />
                Добавить
              </button>
            </div>
            <div className="p-6 grid grid-cols-3 gap-4">
              {GALLERY_PHOTOS.map((photo, i) => (
                <div key={photo.id} className="group cursor-pointer animate-scale-in" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className={`aspect-square rounded-2xl bg-gradient-to-br ${photo.color} flex items-center justify-center relative overflow-hidden border border-border`}>
                    <span className="text-5xl">{photo.emoji}</span>
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors" />
                  </div>
                  <div className="mt-2 px-1">
                    <p className="text-sm font-medium leading-none">{photo.caption}</p>
                    <p className="text-xs text-muted-foreground mt-1">{photo.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE */}
        {section === "profile" && (
          <div className="flex-1 overflow-y-auto animate-fade-in">
            <div className="px-6 py-5 border-b border-border">
              <h1 className="text-xl font-bold">Профиль</h1>
            </div>
            <div className="max-w-lg mx-auto px-6 py-10">
              <div className="flex flex-col items-center gap-4 mb-10">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-foreground flex items-center justify-center text-background text-3xl font-bold">Я</div>
                  <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold">Ваше Имя</h2>
                  <p className="text-muted-foreground mt-1 text-sm">онлайн · участник с марта 2026</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[{ label: "Друзей", value: FRIENDS.length }, { label: "Сообщений", value: 48 }, { label: "Фото", value: GALLERY_PHOTOS.length }].map((s) => (
                  <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <span className="font-semibold text-sm">Друзья</span>
                  <span className="text-xs text-muted-foreground">{FRIENDS.filter(f => f.online).length} онлайн</span>
                </div>
                <div className="divide-y divide-border">
                  {FRIENDS.map((f) => (
                    <div key={f.id} className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors cursor-pointer">
                      <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold">{f.avatar}</div>
                        {f.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-card" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none">{f.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{f.lastSeen}</p>
                      </div>
                      <button className="ml-auto text-muted-foreground hover:text-foreground transition-colors" onClick={() => goToChat(f.id)}>
                        <Icon name="MessageCircle" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {section === "settings" && (
          <div className="flex-1 overflow-y-auto animate-fade-in">
            <div className="px-6 py-5 border-b border-border">
              <h1 className="text-xl font-bold">Настройки</h1>
            </div>
            <div className="max-w-lg mx-auto px-6 py-8 flex flex-col gap-6">
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Аккаунт</h3>
                <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
                  {[
                    { label: "Имя пользователя", value: "Ваше Имя", icon: "User" },
                    { label: "Статус", value: "онлайн", icon: "Circle" },
                    { label: "Номер телефона", value: "+7 (___) ___-__-__", icon: "Phone" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 px-4 py-3.5 hover:bg-accent transition-colors cursor-pointer">
                      <Icon name={item.icon as "User"} size={17} className="text-muted-foreground shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.value}</p>
                      </div>
                      <Icon name="ChevronRight" size={15} className="text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Уведомления и вид</h3>
                <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
                  <div className="flex items-center gap-3 px-4 py-3.5">
                    <Icon name="Bell" size={17} className="text-muted-foreground shrink-0" />
                    <p className="text-sm font-medium flex-1">Уведомления о сообщениях</p>
                    <button onClick={() => setNotificationsOn(!notificationsOn)} className={`w-10 h-5 rounded-full transition-colors relative ${notificationsOn ? "bg-foreground" : "bg-border"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${notificationsOn ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                  </div>
                </div>
              </section>
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-border text-sm font-medium text-muted-foreground hover:text-destructive hover:border-destructive transition-colors">
                <Icon name="LogOut" size={16} />
                Выйти из аккаунта
              </button>
            </div>
          </div>
        )}

        {/* INSTALL GUIDE */}
        {section === "install" && (
          <div className="flex-1 overflow-y-auto animate-fade-in">
            <div className="px-6 py-5 border-b border-border">
              <h1 className="text-xl font-bold">Установить приложение</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Два способа добавить Круг на телефон</p>
            </div>
            <div className="max-w-lg mx-auto px-6 py-8 flex flex-col gap-6">

              {/* PWA */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center shrink-0">
                    <Icon name="Smartphone" size={18} className="text-background" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm leading-none">Способ 1 — Добавить на экран</p>
                    <p className="text-xs text-muted-foreground mt-1">Бесплатно · iOS и Android · Без магазина</p>
                  </div>
                </div>
                <div className="px-5 py-4 flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Android / Chrome</p>
                    <div className="flex flex-col gap-2">
                      {["Открой сайт в Chrome", "Нажми ⋮ (меню) → «Добавить на главный экран»", "Нажми «Установить» — готово!"].map((s, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">iPhone / Safari</p>
                    <div className="flex flex-col gap-2">
                      {["Открой сайт в Safari (не Chrome!)", "Нажми кнопку «Поделиться» (квадрат со стрелкой)", "Выбери «На экран «Домой»»", "Нажми «Добавить» — готово!"].map((s, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-start gap-2.5">
                    <Icon name="CheckCircle" size={16} className="text-green-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">Приложение появится на главном экране и будет работать как обычное — даже без интернета</p>
                  </div>
                </div>
              </div>

              {/* APK */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <Icon name="Package" size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm leading-none">Способ 2 — APK-файл для Android</p>
                    <p className="text-xs text-muted-foreground mt-1">Сложнее · Только Android</p>
                  </div>
                </div>
                <div className="px-5 py-4 flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground">APK создаётся через сервис PWABuilder — он бесплатно упаковывает любой сайт в файл Android-приложения.</p>
                  <div className="flex flex-col gap-2">
                    {[
                      "Перейди на pwabuilder.com",
                      "Вставь адрес своего сайта",
                      "Нажми «Package for stores» → Android",
                      "Скачай APK-файл",
                      "Перенеси файл на телефон и установи",
                    ].map((s, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <span className="w-5 h-5 rounded-full bg-secondary text-foreground text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        {s}
                      </div>
                    ))}
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 flex items-start gap-2.5">
                    <Icon name="AlertTriangle" size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">На телефоне нужно разрешить установку из неизвестных источников: Настройки → Безопасность</p>
                  </div>
                  <a
                    href="https://www.pwabuilder.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-foreground text-background text-sm font-semibold hover:opacity-80 transition-opacity"
                  >
                    <Icon name="ExternalLink" size={15} />
                    Открыть PWABuilder
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* PWA Install Banner */}
      <InstallBanner />
    </div>
  );
}
