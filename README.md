# TemiPay Mobile-First Fintech Wallet (Phase 1)

**TemiPay** is a modern Nigerian mobile money and digital wallet web application inspired by leading payment platforms (OPay/Moniepoint) but built with **100% original branding**, high-contrast emerald & teal aesthetics, and a mobile-first design system.

---

## 🚀 Live Local Preview
The Vite development server is currently live at:
- **Local URL:** [http://localhost:5173/](http://localhost:5173/)
- **Network URL:** Accessible across local network for physical phone testing.

---

## 📱 Architecture & Features (Phase 1 Delivered)

### 1. Viewport & Mobile-First Simulator
- Designed for standard **390px-wide mobile viewport** with native app feel (`viewport-fit=cover`, safe area insets).
- Desktop preview includes an interactive **Phone Frame** with simulated status bar, time display, wifi/battery indicators, dynamic island notch, and a toggle between **Phone Mockup** and **Full Screen** views.

### 2. Complete Screen Implementations
| # | Screen | Path | Key Highlights |
|---|---|---|---|
| 1 | **Splash & Onboarding** | `/onboarding` | 3 swipeable hero intro slides, animated ambient glow, CBN/NDIC compliance notes, "Get Started" & "Log in" buttons |
| 2 | **Sign Up Flow** | `/signup` | 4-step wizard: Nigerian mobile validation (`+234`), 6-box OTP input with 30s countdown resend timer & demo auto-fill, personal info, 4-digit PIN setup |
| 3 | **Login** | `/login` | Phone + password, biometric authentication trigger (Face ID/Fingerprint mock), remember me, forgot password |
| 4 | **Forgot Password** | `/forgot-password` | SMS recovery trigger |
| 5 | **Home Dashboard** | `/` | User greeting + Tier 2 badge, notification bell with unread badge, balance card with show/hide toggle (`₦ ••••••`), quick actions (Add Money, Transfer, Withdraw, History), 8-item services grid, promo banner carousel, recent transactions list |
| 6 | **Transfer Flow** | `/transfer` | Searchable list of Nigerian commercial & microfinance banks, 10-digit NUBAN auto name resolution with loading spinner, quick beneficiaries carousel, amount chips (₦1k - ₦50k), review summary, custom 4-digit PinPad bottom sheet, success receipt with sharing |
| 7 | **Airtime & Data** | `/airtime-data` | Network selector (MTN, Airtel, Glo, 9mobile) with cashback rates, quick phone selector, airtime chips with 3% cashback calculator, categorized data plans (Daily, Weekly, Monthly), PIN authorization |
| 8 | **Bill Payments** | `/bills` | Electricity (Prepaid/Postpaid discos, customer lookup, generated 20-digit meter token with 1-tap copy), Cable TV (DStv, GOtv, StarTimes bouquets), Sports Betting wallet top-ups |
| 9 | **Add Money** | `/add-money` | Dedicated TemiPay MFB account number with copy button, bank transfer guide, USSD code shortcut (`*999*...#`), Debit card top-up form |
| 10 | **Transaction History**| `/history` | Filter tabs (All, Money In, Transfers, Bills), keyword search, grouped by date, tap-to-inspect receipt modal with reference copy & share |
| 11 | **TemiSave Nest (Savings)**| `/savings` | 15.5% annual interest tracker, estimated daily payout counter, target goals with progress bars, deposit & withdrawal bottom sheet |
| 12 | **Cards Management** | `/cards` | Sleek platinum virtual card with chip, CVV/number reveal toggle, card freeze/unfreeze toggle, international payment switch, physical card doorstep delivery request |
| 13 | **Rewards & Gamification**| `/rewards` | 7-day daily check-in streak (+₦50 - ₦500), interactive Lucky Wheel Spin minigame with real wallet prizes, referral code sharing |
| 14 | **Profile ("Me")** | `/profile` | KYC level (Tier 2 verified), limits display (₦2,000,000/day), upgrade to Tier 3 modal (BVN input), change transaction PIN, biometrics switch, 24/7 WhatsApp & helpline support modal, logout |
| 15 | **Notifications** | `/notifications` | Credit alerts, debit alerts, daily savings interest alerts, security sign-in notifications with unread indicators and mark all read |

---

## 🎨 Design System & Colors
- **Brand Primary:** `#00A86B` (TemiPay Mint Green)
- **Brand Rich:** `#00875A` (Nigerian National Green)
- **Accent Teal:** `#0D9488`
- **Gold / Rewards:** `#F59E0B`
- **Typography:** `Plus Jakarta Sans` & `Inter`
- **Reusable UI Components:** `Button`, `Input`, `AmountInput`, `PinPad`, `BottomSheet`, `Modal`, `ToastContainer`, `Skeleton`, `EmptyState`, `Badge`, `BankSelector`, `TransactionItem`, `ServiceTile`, `ReceiptModal`, `PhoneFrame`.

---

## 🔒 Security & State Management
- **State Store:** Powered by Zustand (`src/store/useAppStore.js`) handling real-time balance calculations, transaction logging, savings goals, toast queue, and auth state.
- **Form Validations:** Located in `src/utils/validation.js` enforcing 11-digit Nigerian telco prefixes, 10-digit NUBAN accounts, and 4-digit PIN checks.
- **Protected Routes:** `AuthGuard` ensuring unauthenticated users are guided to the onboarding/login screens.

---

## 🛠️ Ready for Phase 2: Backend Architecture
Once Phase 1 frontend is confirmed, Phase 2 will introduce:
1. **Node.js + Express** REST API with PostgreSQL/Prisma.
2. **Double-entry bookkeeping ledger** (`ledger_entries`) to guarantee zero-loss financial integrity.
3. **Idempotency keys** and database row-locking transactions for all debit/credit operations.
4. **Hashed PINs (bcrypt)**, JWT refresh tokens, and rate limiting.
5. **Sandbox hooks** for Paystack/Monnify/Interswitch/NIBSS integrations.
