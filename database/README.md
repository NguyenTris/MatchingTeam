# Database Directory

Thư mục này quản lý toàn bộ các tài nguyên liên quan đến Database của dự án:

## Cấu trúc thư mục

- `init/`: Chứa các script SQL khởi tạo schema tự động khi container PostgreSQL chạy lần đầu (`01-init.sql`).
- `seeds/`: Chứa dữ liệu mẫu (mock data, master data) để test tính năng trong môi trường dev.
- `migrations/`: Quản lý lịch sử thay đổi schema theo phiên bản (dùng với TypeORM, Prisma, Flyway, Knex,...).

## Hướng dẫn thao tác

### Truy cập psql terminal:
```bash
make db-shell
# Hoặc:
docker compose exec postgres psql -U postgres -d matching_team_db
```

### Chạy seed dữ liệu thủ công:
```bash
docker compose exec -T postgres psql -U postgres -d matching_team_db < database/seeds/01-seed-sample-data.sql
```
