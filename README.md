# Testing_Group1

## Thành viên:

- Cao Mậu Thành Đạt - 22010338
- Nguyễn Trần Việt Anh - 22010341
- Võ Quang Giáp - 22010343
- Trần Mạnh Tuấn Anh - 22010371

## Mục lục:

* [1. Giới thiệu dự án](#1-giới-thiệu-dự-án)
    * [1.1. Tên dự án](#11-tên-dự-án)
    * [1.2. Mô tả](#12-mô-tả)
    * [1.3. Mục tiêu kiểm thử](#13-mục-tiêu-kiểm-thử)
* [2. Yêu cầu hệ thống](#2-yêu-cầu-hệ-thống)
    * [2.1. Yêu cầu chức năng](#21-yêu-cầu-chức-năng)
    * [2.2. Yêu cầu phi chức năng](#22-yêu-cầu-phi-chức-năng)
* [3. Cài đặt và thiết lập](#3-cài-đặt-và-thiết-lập)
    * [3.1. Cài đặt](#31-cài-đặt)
    * [3.2. Thiết lập môi trường kiểm thử](#32-thiết-lập-môi-trường-kiểm-thử)
* [4. Cấu trúc dự án](#4-cấu-trúc-dự-án)
* [5. Báo cáo kiểm thử](#5-báo-cáo-kiểm-thử)
* [6. Liên hệ](#6-liên-hệ)

## 1. Giới thiệu dự án:

### 1.1. Tên dự án: 

- Tên dự án: Đánh giá và kiểm định chất lượng trang web đặt vé xe vexere.com

### 1.2. Mô tả

- Dự án này tập trung vào việc kiểm thử chất lượng và đánh giá trải nghiệm người dùng của trang web đặt vé xe (vexere.com). Chúng tôi sẽ thực hiện các quy trình kiểm thử toàn diện để phát hiện lỗi, đảm bảo tính năng hoạt động chính xác và cải thiện độ ổn định, hiệu suất của trang web. Mục tiêu cuối cùng là giúp vexere.com cung cấp một nền tảng đặt vé trực tuyến liền mạch và đáng tin cậy cho khách hàng.

### 1.3. Mục tiêu kiểm thử

Các mục tiêu chính của quá trình kiểm thử này bao gồm:

- Xác minh tính năng: Đảm bảo tất cả các chức năng cốt lõi như tìm kiếm chuyến đi, chọn ghế, đặt vé, thanh toán và quản lý đặt chỗ hoạt động đúng như mong đợi.
- Kiểm tra hiệu suất: Đánh giá thời gian tải trang, phản hồi của hệ thống dưới các tải trọng khác nhau, và đảm bảo trang web hoạt động mượt mà ngay cả khi có nhiều người dùng truy cập đồng thời.
- Đảm bảo khả năng sử dụng (Usability): Đánh giá giao diện người dùng, quy trình đặt vé có dễ dàng và trực quan hay không, nhằm nâng cao trải nghiệm người dùng.
- Kiểm tra tính tương thích: Đảm bảo trang web hiển thị và hoạt động tốt trên các trình duyệt web và thiết bị khác nhau (máy tính để bàn, điện thoại di động, máy tính bảng).
- Phát hiện lỗi: Tìm kiếm và báo cáo các lỗi, sự cố, hoặc hành vi không mong muốn trong quá trình sử dụng trang web.
- Đảm bảo bảo mật (Security - cơ bản): Kiểm tra các lỗ hổng bảo mật cơ bản như quá trình đăng nhập/đăng ký.

## 2. Yêu cầu hệ thống

### 2.1. Yêu cầu chức năng

Dự án kiểm thử này sẽ tập trung vào các chức năng sau của trang web vexere.com:

- Tìm kiếm chuyến đi: Khả năng tìm kiếm chuyến đi theo điểm đi, điểm đến, ngày khởi hành.
- Hiển thị kết quả tìm kiếm: Liệt kê các chuyến đi phù hợp với thông tin chi tiết (giờ khởi hành, giá vé, loại xe, số ghế trống).
- Chọn ghế: Cho phép người dùng chọn ghế trên sơ đồ xe.
- Nhập thông tin hành khách: Thu thập thông tin cá nhân của người đặt vé và hành khách.
- Thanh toán: Hỗ trợ các phương thức thanh toán hiện có trên trang web (ví dụ: chuyển khoản ngân hàng, ví điện tử).
- Xác nhận đặt vé: Gửi xác nhận đặt vé qua email hoặc SMS.
- Đăng nhập/Đăng ký tài khoản: Chức năng tạo và quản lý tài khoản người dùng.

### 2.2. Yêu cầu phi chức năng

Chúng tôi cũng sẽ xem xét các yêu cầu phi chức năng sau:

- Hiệu suất:
  + Thời gian tải trang dưới 3 giây.
  + Khả năng xử lý ít nhất 100 người dùng đồng thời mà không giảm hiệu suất đáng kể.
- Khả năng sử dụng (Usability):
  + Giao diện thân thiện, dễ điều hướng.
  + Quy trình đặt vé rõ ràng, đơn giản.
- Tính tương thích:
  + Tương thích với các trình duyệt phổ biến: Chrome, Firefox, Edge, Safari (phiên bản mới nhất).
  + Hiển thị tốt trên các thiết bị di động (responsive design).
- Độ tin cậy:
  + Tỷ lệ lỗi (bugs) dưới 1% trên các chức năng chính.
  + Khả năng khôi phục sau sự cố (ví dụ: mất kết nối internet tạm thời trong quá trình thanh toán).
- Bảo mật (cơ bản):
  + Mã hóa dữ liệu nhạy cảm (ví dụ: thông tin đăng nhập, thanh toán).
  + Ngăn chặn các lỗ hổng bảo mật phổ biến (ví dụ: XSS, SQL Injection - nếu có thể kiểm thử ở cấp độ bề mặt).

## 3. Cài đặt và thiết lập

### 3.1. Cài đặt

### 3.2. Thiết lập môi trường kiểm thử

## 4. Cấu trúc dự án

## 5. Báo cáo kiểm thử

## 6. Liên hệ

Mọi thông tin liên hệ qua địa chỉ email: 22010338@st.phenikaa-uni.edu.vn
