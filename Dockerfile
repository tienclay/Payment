# src/Dockerfile (Project B)

FROM node:18-alpine

WORKDIR /app

# Copy package.json và yarn.lock để cài đặt dependencies
COPY package.json yarn.lock ./

# Cài đặt dependencies chỉ cần thiết cho production
RUN yarn install --production

# Copy toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng NestJS
RUN yarn build

# Expose port 3001
EXPOSE 3001

# Chạy ứng dụng ở chế độ production
CMD ["yarn", "start:prod"]
