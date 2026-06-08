# תוכנית: טיימר לכל מהלך + רמות קושי

## רקע (Context)
משחק האיקס-עיגול הבסיסי כבר נבנה ועובד במלואו (React + TS + Vite, הזנת שמות,
זיהוי ניצחון/תיקו, בדיקות Jest + Playwright).

**הדרישה החדשה:** לכל שחקן יש זמן מוגבל לבצע מהלך. אם הזמן נגמר לפני שביצע מהלך —
הוא **מאבד את התור** והמהלך עובר ליריב (בלי שמסומן כלום), והטיימר מתאפס לשחקן הבא.

**החלטות שאושרו:**
- **שלוש רמות קושי** קובעות את משך הזמן לכל מהלך: קל = 15 שניות, בינוני = 10, קשה = 5.
- תצוגת **פס התקדמות (progress bar)** שמתרוקן ככל שהזמן אוזל.
- הטיימר **מתחיל מיד** בכל תור, מתאפס אחרי כל מהלך, ונעצר כשהמשחק מסתיים.
- בורר הקושי = שלושה כפתורים פשוטים (קל / בינוני / קשה), השמות בלבד, הנבחר מודגש.

## עקרון מנחה
הפרדה נקייה: קונפיגורציית הקושי כ**נתון טהור** (`difficulty.ts`), לוגיקת הספירה
לאחור ב**hook ייעודי** (`useCountdown.ts`), והתצוגה בקומפוננטות נפרדות.
`App.tsx` נשאר המקור היחיד ל-state.

## קבצים חדשים

### `src/game/difficulty.ts` (טהור, נבדק ב-Jest)
- `type Difficulty = 'easy' | 'medium' | 'hard'`.
- `DIFFICULTIES`: רשימת `{ id, label, durationMs }` — 15s / 10s / 5s.
- `DEFAULT_DIFFICULTY = 'medium'`.
- `getDuration(difficulty)` → משך ב-ms.

### `src/hooks/useCountdown.ts`
`useCountdown({ durationMs, resetKey, isRunning, onExpire }): number`
- `setInterval` של 100ms שמוריד מהזמן הנותר (פס חלק).
- מאפס את הזמן כש-`resetKey` או `durationMs` משתנים.
- מפעיל `onExpire()` פעם אחת כשהזמן מגיע ל-0 (דגל `useRef`, בטוח גם ב-StrictMode).
- ניקוי ה-interval ב-cleanup; לא רץ כש-`isRunning=false`.

### `src/components/TurnTimer.tsx` + `TurnTimer.module.css`
- props: `remainingMs`, `durationMs`.
- פס התקדמות (`width` יחסי) + מספר שניות (`Math.ceil`). `role="timer"` + `aria-label`.
- הפס הופך אדום כשנשארות ≤ 3 שניות.

### `src/components/DifficultySelector.tsx` + `.module.css`
- שלושה כפתורים בשורה (toggle group), השמות בלבד, הנבחר מודגש (`aria-pressed`).
- props: `value`, `onChange`. תווית "רמת קושי:" מעליהם.

## שינויים ב-`src/App.tsx`
- state: `difficulty` (ברירת מחדל `DEFAULT_DIFFICULTY`), `turnId` (מונה שעולה בכל החלפת תור).
- נגזר: `durationMs = getDuration(difficulty)`, `isTimerRunning = !win && !isDraw`.
- `skipTurn` (`useCallback` + functional updaters): מחליף תור בלי לסמן + מעלה `turnId`.
- `handleSquareClick`: מהלך תקין → גם מעלה `turnId` (איפוס הטיימר).
- `handleReset`: מאפס `turnId` (שמות ורמת קושי נשמרים).
- `useCountdown({ durationMs, resetKey: turnId, isRunning: isTimerRunning, onExpire: skipTurn })`.
- רינדור: `DifficultySelector` ליד `PlayerSetup`, `TurnTimer` מעל הלוח (מוסתר בסיום).

## בדיקות
### Jest
- `difficulty.test.ts`: `getDuration` לכל רמה; 3 פריטים ייחודיים.
- `App.test.tsx` (מעבר ל-fake timers): פג זמן → התור עובר והלוח ריק; מהלך מאפס את הזמן;
  רמת "קשה" מקצרת ל-5s; כשיש מנצח הטיימר נעצר.

### Playwright
- בחירת "קשה" (5s), אי-ביצוע מהלך, המתנה ~5.5s → התור עובר מ-X ל-O והלוח ריק.

### תיעוד
- `docs/TEST_CASES.md` — סעיף "טיימר ורמות קושי".
- `README.md` — תיעוד הפיצ'ר.

## אימות
1. `npm run dev` — צפייה בפס שמתרוקן, פג זמן מעביר תור, מהלך מאפס.
2. `npm test` — כל בדיקות Jest עוברות.
3. `npm run e2e` — כל בדיקות Playwright עוברות.
4. `npm run build` — build נקי.
