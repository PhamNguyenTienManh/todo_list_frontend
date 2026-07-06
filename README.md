# Todo React Frontend

Frontend ReactJS cho ứng dụng Todo, kết nối với backend Spring Boot.

## Yêu Cầu

- Node.js
- npm
- Backend Todo đang chạy tại `http://localhost:8080`

## Cách Chạy Backend

Đọc hướng dẫn chạy backend trong file `README.md` của repo:
[PhamNguyenTienManh/todo_list_backend](https://github.com/PhamNguyenTienManh/todo_list_backend)

## Cách Chạy Frontend

1. Di chuyển vào thư mục frontend:

```bash
cd "C:\Nam 4\Java_SpringBoot\frontend"
```

2. Cài đặt dependencies:

```bash
npm install
```

3. Tạo file `.env` từ file mẫu:

```bash
copy .env.example .env
```

4. Cấu hình API backend trong file `.env`.

```env
VITE_API_BASE_URL=http://localhost:8080
```

5. Chạy frontend ở chế độ development:

```bash
npm run dev
```

6. Mở trình duyệt tại:

```txt
http://localhost:5173
```

Hoặc:

```txt
http://127.0.0.1:5173
```

## Build Production

```bash
npm run build
```

## Xem Bản Build

```bash
npm run preview
```

## Các Route Chính

- `/login`: Đăng nhập
- `/register`: Đăng ký
- `/todos`: Dashboard quản lý công việc
