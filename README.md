# M_Dalats Boutique Villa

Website đặt phòng cho M_Dalats Boutique Villa Đà Lạt, xây dựng trên **Next.js 15 (App Router)**, **Tailwind CSS 4**, **tRPC**, **Drizzle ORM (PostgreSQL)** và **Better Auth**.

## Chạy dự án

```bash
pnpm install
pnpm db:push      # đồng bộ schema
pnpm dev          # http://localhost:3000
```

Kiểm tra production:

```bash
pnpm typecheck
pnpm build
pnpm start
```

## Biến môi trường

| Biến | Bắt buộc | Mô tả |
| --- | --- | --- |
| `DATABASE_URL` | Có | Chuỗi kết nối PostgreSQL, ví dụ `postgresql://postgres:postgres@localhost:5432/mdalats_villa` |
| `BETTER_AUTH_SECRET` | Production | Secret ký session của Better Auth |
| `BETTER_AUTH_URL` | Nên đặt | Origin công khai của website, ví dụ `https://mdalatsvilla.com` |
| `BETTER_AUTH_GITHUB_CLIENT_ID` / `_SECRET` | Không | Bật đăng nhập GitHub |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Không | Danh sách origin phụ, phân tách bằng dấu phẩy (staging, preview URL) |

`BETTER_AUTH_URL` phải trùng origin thực tế mà trình duyệt truy cập, nếu không Better Auth sẽ từ chối đăng nhập với lỗi `Invalid origin`.

## Xác thực & phân quyền

Chỉ có **một form đăng nhập duy nhất** — `src/components/AuthForm.tsx`:

- Hiển thị trong modal ở trang chủ/phòng (`AuthModal`).
- Hiển thị tại trang `/login` khi middleware yêu cầu đăng nhập.
- `/admin/login` là route cũ, tự chuyển hướng về `/login?callbackUrl=/admin`.

Sau khi đăng nhập, hệ thống đọc `role` của tài khoản và điều hướng:

| Role | Trang mặc định | Quyền |
| --- | --- | --- |
| `admin` | `/admin` | Toàn quyền quản trị, phân quyền, xóa dữ liệu |
| `staff` | `/admin` | Vận hành đặt phòng, phòng, khách, tin nhắn; không phân quyền/xóa cứng |
| `user` | `/` | Đặt phòng, xem lịch sử đặt phòng của mình |

Chính sách route nằm tại `src/lib/roles.ts` và được áp dụng bởi `src/middleware.ts`:

| Route | Quyền truy cập |
| --- | --- |
| `/admin/**` | `admin`, `staff` |
| `/my-bookings` | Người đã đăng nhập; khách vãng lai vẫn tra cứu được bằng link `?code=...` hoặc `?phone=...` |
| Các route còn lại | Công khai |

Ở tầng API, các procedure vận hành dùng `staffProcedure`, các thao tác nhạy cảm (phân quyền, khóa tài khoản, xóa cứng) dùng `adminProcedure` trong `src/server/api/trpc.ts`.

## Quản lý tài khoản

```bash
pnpm admin:list                                  # liệt kê tài khoản
pnpm admin:create <email> <password> <name> [role]
pnpm admin:promote <email> [admin|staff|user]    # đổi vai trò
pnpm admin:reset <email> <newPassword>           # đặt lại mật khẩu
```

## Cấu trúc chính

- `src/app` — các trang (App Router) và API route.
- `src/components` — UI dùng chung (Navbar, AuthForm, AuthModal, các section…).
- `src/server/api/routers` — booking, room, customer, contact.
- `src/server/better-auth` — cấu hình Better Auth.
- `src/server/db` — schema Drizzle và seed dữ liệu.
