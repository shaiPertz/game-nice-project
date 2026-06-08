# תוכנית: דף בית + מצב נגד מחשב (AI)

## רקע (Context)
משחק האיקס-עיגול עובד במלואו: PvP מקומי, הזנת שמות, זיהוי ניצחון/תיקו, טיימר לכל
מהלך עם 3 רמות קושי, בדיקות Jest + Playwright.

**שינוי תפיסה לעומת היום:** רמת הקושי והשמות נקבעים **אך ורק בדף הבית** ולא ניתנים
לשינוי תוך כדי משחק. מסך המשחק מציג **רק** את הטיימר, הסטטוס עם השמות, והלוח.

**הדרישה החדשה:** דף בית (landing) שבו השחקן בוחר לפני המשחק:
- **מצב משחק:** נגד מחשב (PvC) או נגד שחקן (PvP).
- **רמת קושי**.
- **שמות שחקנים**.
- כפתור **"התחל משחק"** שמעביר למסך המשחק.

**החלטות שאושרו:**
- **AI לפי רמת קושי:** קל = אקראי · בינוני = נצח-אם-אפשר ⇐ חסום-יריב ⇐ אקראי ·
  קשה = **minimax** (בלתי מנוצח).
- **טיימר רץ רק בתור השחקן האנושי** ב-PvC; המחשב מגיב מיד (השהיה קצרה לתחושה טבעית).
  ב-PvP הטיימר רץ לשני השחקנים.
- **ניווט:** state פנימי (`screen: 'home' | 'game'`), ללא router.
- **שמות ב-PvC:** שדה אחד לשחקן, היריב מוצג כ"מחשב".
- ב-PvC השחקן האנושי הוא **X (ראשון)**, המחשב הוא **O**.

## עקרון מנחה
הפרדה נקייה: לוגיקת ה-AI כ**פונקציה טהורה** (`ai.ts`, נבדקת ב-Jest), הגדרות במסך נפרד
(`HomeScreen`), והמשחק ב-`GameScreen`. `App` הופך ל"נתב" דק (screen + GameConfig).

## קבצים חדשים
- **`src/game/gameMode.ts`** — `GameMode` ('pvp' | 'pvc'), `GAME_MODES`, קבועים
  (`HUMAN_MARK='X'`, `COMPUTER_MARK='O'`, `COMPUTER_NAME='מחשב'`).
- **`src/game/ai.ts`** — `getAiMove(squares, aiMark, difficulty)`:
  - `easy` → אקראי · `medium` → ניצחון ⇐ חסימה ⇐ אקראי · `hard` → `minimax`.
  - עזרים: `availableMoves`, `findWinningMove` (מ-`WINNING_LINES`), `minimax`
    (משתמש ב-`calculateWinner` כתנאי עצירה).
- **`src/components/ModeSelector.tsx`** — שני כפתורים (נגד שחקן / נגד מחשב), בסגנון
  `DifficultySelector`, `aria-pressed`.
- **`src/components/HomeScreen.tsx`** — `ModeSelector` + `DifficultySelector` + שדות שמות
  (`PlayerSetup`) + כפתור "התחל משחק". בונה `GameConfig` וקורא `onStart`. `initialConfig`
  לשחזור בחירות בחזרה מהמשחק.
- **`src/components/GameScreen.tsx`** — מקבל `config` ו-`onExit`. מחזיק את state המשחק
  (`squares`, `xIsNext`, `turnId`), טיימר (`isRunning` רק בתור האדם ב-PvC), effect שמפעיל
  את ה-AI בתור המחשב (`setTimeout` + cleanup). מרנדר **רק** סטטוס/טיימר/לוח + כפתורי
  "משחק חדש" ו"חזרה לדף הבית".

## שינויים
- **`src/components/PlayerSetup.tsx`** — מקבל `mode`: PvP שני שדות, PvC שדה אחד ("השם שלך").
- **`src/App.tsx`** — נתב דק: `home` ⇄ `game`, מחזיק `GameConfig`. כל לוגיקת המשחק עוברת
  ל-`GameScreen`.

## בדיקות
- **`src/game/ai.test.ts`**: בינוני לוקח ניצחון; בינוני חוסם; קשה (minimax) ניצחון/חסימה/
  לא-מפסיד; קל מחזיר משבצת פנויה תקפה.
- **`GameScreen.test.tsx`**: בדיקות ה-gameplay/timer (מרונדר עם `config`) + PvC: המחשב מגיב.
- **`HomeScreen.test.tsx`**: בחירת מצב/קושי/שם, PvC שדה אחד, "התחל משחק" קורא `onStart`.
- **`App.test.tsx`** (מצומצם): ניווט דף בית → משחק → חזרה.
- **`e2e/game.spec.ts`**: כל התרחישים דרך דף הבית + תרחיש PvC (המחשב מגיב) + ניווט חזרה.

## אימות
1. `npm run dev` — דף בית → בחירות → "התחל משחק"; מול מחשב המחשב מגיב; "חזרה לדף הבית" עובד.
2. `npm test` · `npm run e2e` · `npm run build` + `npm run lint` — הכל נקי.
