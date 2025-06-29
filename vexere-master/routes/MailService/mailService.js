
"use strict";
import nodemailer from 'nodemailer';


const myTransport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'phuhanld@gmail.com', 
    pass: 'flvttwcljjaogkqr',
  }
});

const mailOptions = {
  from: 'GROUP09 VEXERE<phuhanld@gmail.com>', 
  to: 'hanphu2325@gmail.com, ttmq38@gmail.com',
  subject: 'Cảm ơn bạn đã tin tưởng sử dụng VEXERE để phục vụ chuyến đi', 
  html: `<h1 style="font-size: 20px;color: #1861c5;text-align:center;">Xin chân thành cảm ơn quý khách ABCXYZ đã sử dụng dịch vụ của chúng tôi!</h1>
          <p style="color: black;"><b><i>Sau đây là thông tin vé của bạn:</i></b></p>
          <p style="color: black; margin-left: 30px;">Khách hàng: <b> @123 </b></p>
          <p style="color: black; margin-left: 30px;">Nhà xe: <b> ABC </b></p>
          <p style="color: black; margin-left: 30px;">Loại xe: <b> DÉP LÀO XE BUS </b></p>
          <p style="color: black; margin-left: 30px;">Biển kiểm soát xe: <b> OIWJDUIAHIUDNIW </b></p>
          <p style="color: black; margin-left: 30px;">Tuyến đi: <b> DDD - EEE </b></p>
          <p style="color: black; margin-left: 30px;">Ngày đi: <b> XXX </b></p>
          <p style="color: black; margin-left: 30px;">Giờ đi: <b> YYY </b></p>
          <p style="color: black; margin-left: 30px;">Thời gian chuyến đi (dự tính): <b> n tiếng </b></p>
          <p style="color: black; margin-left: 30px;">Số lượng vé: <b> n </b></p>
          <p style="color: black; text-align:center;">Sẽ rất tuyệt vời nếu chúng tôi được phục vụ bạn thêm nhiều lần nữa ☆*: .｡. o(≧▽≦)o .｡.:*☆</p>
          <p style="color: black; text-align:center;">Chúc bạn có một chuyến đi  <span style="color: #1861c5;">thượng lộ, bình an!</span></p>
          <p color: black;>Trân trọng,</p>
          <p color: black;>GROUP09-VEXERE</p>`,
}

// sending the email
myTransport.sendMail(mailOptions, (err) => {
  if (err) {
    console.log(`Email is failed to send!`);
    console.error(err);
  } else {
    console.log(`Email is successfully sent!`);
  }
})