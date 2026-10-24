# Hướng Dẫn Triển Khai (Deployment Guide)

Dự án được đóng gói hoàn toàn bằng Docker, giúp việc triển khai lên bất kỳ Cloud Provider nào (AWS EC2, DigitalOcean Droplet, Hetzner, Linode, Google Cloud VM,...) trở nên dễ dàng chỉ với vài bước.

---

## 1. Yêu cầu môi trường trên máy chủ (Server Prerequisites)

- Hệ điều hành: Ubuntu 22.04 LTS hoặc mới hơn (khuyên dùng)
- Đã cài đặt **Git**, **Docker** (v24+) và **Docker Compose** (v2+)

---

## 2. Triển khai lần đầu (First-time Deployment)

### Bước 1: Clone mã nguồn
```bash
git clone https://github.com/<your-username>/MatchingTeam.git /opt/matching_team
cd /opt/matching_team
```

### Bước 2: Thiết lập biến môi trường
```bash
cp .env.example .env
nano .env
```
> **Lưu ý quan trọng**: Thay đổi các giá trị bí mật:
> - `DB_PASSWORD`: Mật khẩu database mạnh
> - `JWT_SECRET`: Chuỗi khóa ngẫu nhiên (ít nhất 32 ký tự)
> - `NODE_ENV=production`

### Bước 3: Khởi chạy toàn bộ hệ thống
```bash
make up
# hoặc: docker compose up -d --build
```

Container sẽ tự động:
1. Tạo database PostgreSQL và chạy file `database/init/01-init.sql` khởi tạo bảng
2. Chạy Redis container
3. Build và chạy Backend API
4. Build và đóng gói Frontend SPA qua Nginx
5. Khởi chạy Gateway Nginx điều hướng ở cổng 80/443

---

## 3. Cập nhật phiên bản mới (Updating / Redeployment)

Khi có code mới được merge vào nhánh `main`:

```bash
./deploy/scripts/deploy.sh
```

Hoặc thiết lập tự động hóa thông qua **GitHub Actions CD** (`.github/workflows/deploy.yml`) bằng cách cấu hình Secrets trong repo GitHub:
- `SERVER_HOST`: IP hoặc domain server
- `SERVER_USER`: user SSH (thường là `ubuntu` hoặc `root`)
- `SERVER_SSH_KEY`: Private Key SSH

---

## 4. Cấu hình SSL / HTTPS (Let's Encrypt Certbot)

Để kích hoạt HTTPS miễn phí:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Certbot sẽ tự động gia hạn chứng chỉ trước khi hết hạn.
