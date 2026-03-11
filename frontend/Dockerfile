# Sử dụng Node.js bản alpine cho nhẹ
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json trước
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Next.js thu thập dữ liệu ẩn danh, tắt nó đi để bảo mật
ENV NEXT_TELEMETRY_DISABLED 1

# Chạy ở chế độ phát triển
CMD ["npm", "run", "dev"]
