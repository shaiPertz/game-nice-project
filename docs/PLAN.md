# תוכנית הפרויקט — משחק איקס-עיגול (Tic-Tac-Toe)

## רקע (Context)
משחק איקס-עיגול בדפדפן, צד-לקוח בלבד, 2 שחקנים באותו דפדפן.
דרישות חובה: React, זיהוי מצב ניצחון, UI נקי, קוד נקי.
דרישות נוספות: unit tests עם **Jest**, e2e עם **Playwright**, ומקרי בדיקת UI (בונוס).

**תוספת:** כל שחקן יכול להזין את שמו, והשם מופיע במשחק (בתצוגת התור ובהודעת הניצחון).

החלטות: **TypeScript**, **CSS Modules**, פיצ'רים "בסיסי + תוספות חכמות", עומק בדיקות "מאוזן".

## עקרון מנחה
הלוגיקה של המשחק (זיהוי ניצחון/תיקו) נכתבת כפונקציות **טהורות** ב-`gameLogic.ts`,
מנותקות מ-React → unit tests פשוטים והפרדת דאגות נקייה.

## Stack
- Vite + React 18 + TypeScript (תבנית `react-ts`)
- CSS Modules (מובנה ב-Vite)
- Jest + ts-jest + @testing-library/react + jsdom (unit/component)
- Playwright (e2e)

## מבנה קבצים
```
game-nice-project/
  index.html
  package.json
  tsconfig*.json
  vite.config.ts
  jest.config.cjs           # cjs כדי להימנע מבעיות ESM
  jest.setup.ts             # מייבא @testing-library/jest-dom
  playwright.config.ts
  docs/
    PLAN.md                 # המסמך הזה
    TEST_CASES.md           # מקרי בדיקת UI ידניים (בונוס)
  src/
    main.tsx
    App.tsx                 # מחזיק state, מרכיב את המשחק
    App.module.css
    game/
      gameLogic.ts          # לוגיקה טהורה: טיפוסים, WINNING_LINES, calculateWinner, isBoardFull
      gameLogic.test.ts     # Jest unit tests ללוגיקה
    components/
      Board.tsx / Board.module.css
      Square.tsx / Square.module.css
      GameStatus.tsx / GameStatus.module.css
      PlayerSetup.tsx / PlayerSetup.module.css
    components/__tests__/
      App.test.tsx          # Jest component/integration test
  e2e/
    game.spec.ts            # Playwright e2e
```

## פירוט המימוש

### לוגיקת המשחק — `src/game/gameLogic.ts` (טהור, ללא React)
- `type Player = 'X' | 'O'`, `type SquareValue = Player | null`.
- `WINNING_LINES` — 8 הקווים המנצחים (3 שורות, 3 עמודות, 2 אלכסונים).
- `calculateWinner(squares)` → `{ winner, line } | null` (מחזיר גם את השורה להדגשה).
- `isBoardFull(squares)` → `boolean`.

### קומפוננטות
- **Square** — כפתור בודד (`value`, `onClick`, `isWinning`, `disabled`, aria-label).
- **Board** — grid 3x3, מרנדר 9 Square.
- **PlayerSetup** — שני שדות קלט לשמות; שדה ריק נופל לברירת מחדל ("שחקן X"/"שחקן O").
- **GameStatus** — "תור: <שם>" / "המנצח: <שם> 🎉" / "תיקו!".
- **App** — state: `squares`, `xIsNext`, `playerXName`, `playerOName`.
  נגזרים: `winner`, `isDraw`. `handleClick(i)` חוסם משבצת תפוסה/מצב סיום.
  כפתור **Reset** מאפס את הלוח בלבד (שומר שמות).

### עיצוב (CSS Modules)
לוח grid עם משבצות ריבועיות (`aspect-ratio:1`), הדגשת שורה מנצחת, hover על משבצות פנויות,
סטטוס ברור, מרכוז ומראה נקי.

## בדיקות

### Jest (unit + component)
- `gameLogic.test.ts`: ניצחון בשורה/עמודה/אלכסון, אין מנצח, תיקו, לוח ריק.
- `App.test.tsx`: החלפת תור, ניצחון חוסם לחיצות, Reset מנקה, הזנת שם משנה את הטקסט.

### Playwright (e2e)
1. הזנת שמות → השם מופיע בתור; משחק עד ניצחון X → הודעת מנצח עם השם.
2. רצף שמסתיים בתיקו → הודעת תיקו.
3. Reset מנקה את הלוח וחוזר לתור הראשון (שמות נשמרים).

## אימות
1. `npm run dev` → משחק ידני (ניצחון/תיקו/reset).
2. `npm test` → כל בדיקות Jest עוברות.
3. `npm run e2e` → כל בדיקות Playwright עוברות.
4. `npm run build` → build נקי ללא שגיאות TypeScript.
