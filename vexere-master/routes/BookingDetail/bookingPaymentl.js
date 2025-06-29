import { prisma, sessionManager } from "../../server";
import { getUserFromDB } from "../db/checkUser";
import { singleIntQueryHandler } from "../db/queryHandler";
import { createHmac, randomUUID } from "crypto";
import fetch from "node-fetch";
import nodemailer from 'nodemailer';
const bookingPaymentHandler = async (req, res) => {
    console.log("Ready to pay");
    if (!req.oidc.isAuthenticated() || !req.oidc.user || !req.oidc.user.sub) {
        res.redirect("/login");
        return;
    }
    if (!req.query.ticketId) {
        res.redirect("/");
        console.log(" Can't find ticket id ");
        return;
    }
    const userData = sessionManager.users[req.oidc.user.sid] || (await getUserFromDB(req.oidc.user.sub, req.oidc.user.email));
    if (!userData.id) {
        console.log(" Cant find user id");
        res.redirect("/");
        return;
    }
    const ticketId = singleIntQueryHandler(req.query.ticketId);
    const ticket = await prisma.ticket.findFirst({
        where: {
            AND: [{ id: ticketId }, { userId: userData.id }]
        },
        include: {
            RouteDetail: {
                select: {
                    price: true
                }
            }
        }
    });
    console.log(ticket);
    if (!ticket) {
        res.redirect("/");
        return;
    }
    // Get status
    const ticketStatus = ticket.status;
    const MOMO_PARTNER_CODE = process.env.MOMO_PARTNER_CODE;
    const MOMO_ACCESS_KEY = process.env.MOMO_ACCESS_KEY;
    const MOMO_SECRET_KEY = process.env.MOMO_SECRET_KEY;
    const REAL_URL = process.env.RENDER_EXTERNAL_URL;
    console.log("MOMO DATA", MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, MOMO_SECRET_KEY);
    let transactionStatus = ticketStatus === "WAITING" ? "Chưa thanh toán" : "Đã thanh toán";
    if (MOMO_ACCESS_KEY && MOMO_PARTNER_CODE && MOMO_SECRET_KEY) {
        const id = `${ticket.id}-${ticket.userId}` + randomUUID();
        if (transactionStatus == "Đã thanh toán") {
            res.locals.title = "Thông tin thanh toán";
            // res.render("ticket", {
            //   ticket: ticket,
            //   detail: routeDetail,
            //   route: route,
            //   transactionStatus: transactionStatus,
            // });
            console.log("Đã thanh toán");
            res.status(303).redirect(`/user/ticket?ticketId=${ticket.id}`);
            return;
        }
        console.log("Chưa thanh toán", ticket.RouteDetail.price);
        let payUrl = "";
        const newPayment = {
            amount: (ticket.RouteDetail.price != 0) ? (ticket.RouteDetail.price * ticket.amount) : 300000,
            payment_info: `Thanh toán vé xe`
        };
        const data = {
            partnerCode: MOMO_PARTNER_CODE,
            requestId: id,
            amount: newPayment.amount,
            orderId: id,
            orderInfo: newPayment.payment_info,
            redirectUrl: `${REAL_URL ? REAL_URL : "http://localhost:8000"}/user/ticket/callback`,
            ipnUrl: `${REAL_URL ? REAL_URL : "http://localhost:8000"}/user/ticket/pay?ticketId=${ticket.id}`,
            requestType: "captureWallet",
            extraData: ticket.id,
            lang: "vi",
            signature: "",
        };
        let message = `accessKey=${MOMO_ACCESS_KEY}&orderId=${data.orderId}&partnerCode=${data.partnerCode}&requestId=${data.requestId}`;
        data.signature = createHmac("sha256", MOMO_SECRET_KEY).update(message).digest("hex");
        if (transactionStatus === "Chưa thanh toán") {
            let message = `accessKey=${MOMO_ACCESS_KEY}&amount=${data.amount}&extraData=${data.extraData}&ipnUrl=${data.ipnUrl}&orderId=${data.orderId}&orderInfo=${data.orderInfo}&partnerCode=${data.partnerCode}&redirectUrl=${data.redirectUrl}&requestId=${data.requestId}&requestType=${data.requestType}`;
            data.signature = createHmac("sha256", MOMO_SECRET_KEY).update(message).digest("hex");
            const fetchResult = await fetch("https://test-payment.momo.vn/v2/gateway/api/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const json = await fetchResult.json();
            payUrl = json.payUrl;
            res.locals.title = "Thông tin thanh toán";
            // res.render("ticket", {
            //   ticket: ticket,
            //   detail: routeDetail,
            //   route: route,
            //   transactionStatus: transactionStatus,
            //   payUrl: payUrl,
            // });
            console.log("Redirecting", payUrl);
            if (payUrl) {
                res.redirect(payUrl);
            }
            else {
                res.redirect("/user/ticket/callback");
                console.log(json);
            }
            return;
        }
    }
    console.log("Skip payment");
    res.redirect(`/user/ticket?ticketId=${ticket.id}`);
    return;
};
export const bookingDetailCallbackHandler = async (req, res) => {
    const ticketId = singleIntQueryHandler(req.query.extraData, -1);
    const result = singleIntQueryHandler(req.query.resultCode, -1);
    if (ticketId < 0 || result != 0 || !req.oidc.user) {
        const transactionStatus = "Thanh toán thất bại! Hãy thử lại.";
        res.locals.title = "Thông tin thanh toán";
        res.render("paymentStatus", {
            transactionStatus: transactionStatus,
            ticketId: ticketId,
        });
        return;
    }
    if (result == 0) {
        console.log(req.query, req.body);
        // cập nhật trong database
        let transactionStatus = "Thanh toán thành công!";
        const updateTicket = await prisma.ticket.update({
            where: {
                id: ticketId,
            },
            data: {
                status: "PAID",
            },
        });
        const userData = sessionManager.users[req.oidc.user.sid] || await getUserFromDB(req.oidc.user.sub, req.oidc.user.email);
        const detail = await prisma.routeDetail.findFirst({
            where: { id: updateTicket.routeDetailId }
        });
        if (!detail || !updateTicket) {
            const transactionStatus = "Thanh toán thất bại! Hãy thử lại.";
            res.locals.title = "Thông tin thanh toán";
            res.render("paymentStatus", {
                transactionStatus: transactionStatus,
                ticketId: ticketId,
            });
            return;
        }
        const updatedRouteDetail = await prisma.routeDetail.update({
            where: { id: detail.id },
            data: {
                remainSeat: detail.remainSeat - updateTicket.amount
            }
        });
        sendPaymentEmail(userData, updatedRouteDetail, updateTicket);
        res.locals.title = "Thông tin thanh toán";
        // Render lại trong trang thanh toán thành công
        res.render("paymentStatus", {
            transactionStatus: transactionStatus,
            ticketId: ticketId,
        });
        return;
    }
    // Render lại trong trang thanh toán thất bại
};
async function sendPaymentEmail(user, detail, ticket) {
    const myTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'phuhanld@gmail.com',
            pass: 'flvttwcljjaogkqr',
        }
    });
    const bus = await prisma.bus.findUnique({
        where: {
            id: detail.busId
        },
        include: {
            BusHouse: { select: { Name: true } }
        }
    });
    const detailData = await prisma.route.findUnique({
        where: {
            id: detail.routeId
        },
        include: {
            Location_Route_startLocIdToLocation: { select: { name: true } },
            Location_Route_endLocIdToLocation: { select: { name: true } }
        }
    });
    if (!bus || !detailData) {
        return;
    }
    const busType = (() => {
        switch (bus.type) {
            case 1: {
                return "Xe ghế ngồi";
            }
            case 2: {
                return "Xe giường nằm";
            }
            case 3: {
                return "Xe limousine";
            }
        }
        return "Xe buýt";
    })();
    const mailOptions = {
        from: 'GROUP09 VEXERE<phuhanld@gmail.com>',
        to: user.email ? user.email : "lamhoangdien113@gmail.com,hanphu2325@gmail.com",
        subject: 'Cảm ơn bạn đã tin tưởng sử dụng VEXERE để phục vụ chuyến đi',
        html: `
    <h1 style="font-size: 20px;color: #1861c5;text-align:center;">Xin chân thành cảm ơn quý khách ${user.Name} đã sử dụng dịch vụ của chúng tôi!</h1>
    <p style="color: black;"><b><i>Sau đây là thông tin vé của bạn:</i></b></p>
    <p style="color: black; margin-left: 30px;">Khách hàng: <b> ${user.Name} </b></p>
    <p style="color: black; margin-left: 30px;">Nhà xe: <b> ${bus.BusHouse.Name} </b></p>
    <p style="color: black; margin-left: 30px;">Loại xe: <b> ${busType} </b></p>
    <p style="color: black; margin-left: 30px;">Biển kiểm soát xe: <b> ${bus.plate} </b></p>
    <p style="color: black; margin-left: 30px;">Tuyến đi: <b> ${detailData.Location_Route_startLocIdToLocation.name} - ${detailData.Location_Route_endLocIdToLocation.name} </b></p>
    <p style="color: black; margin-left: 30px;">Ngày đi: <b> ${detail.startTime.toLocaleDateString()} </b></p>
    <p style="color: black; margin-left: 30px;">Giờ đi: <b> ${detail.startTime.toLocaleTimeString()} </b></p>
    <p style="color: black; margin-left: 30px;">Thời gian chuyến đi (dự tính): <b> ${Math.ceil(Math.abs(detail.endTime.getTime() - detail.startTime.getTime()) / (1000 * 60 * 60))} tiếng </b></p>
    <p style="color: black; margin-left: 30px;">Số lượng vé: <b> ${ticket.amount} </b></p>
    <p style="color: black; margin-left: 30px;">Tổng tiền: <b> ${(ticket.amount * detail.price).toLocaleString("en-US", { style: "currency", currency: "VND" })} </b></p>
    <p style="color: black; text-align:center;">Sẽ rất tuyệt vời nếu chúng tôi được phục vụ bạn thêm nhiều lần nữa ☆*: .｡. o(≧▽≦)o .｡.:*☆</p>
    <p style="color: black; text-align:center;">Chúc bạn có một chuyến đi  <span style="color: #1861c5;">thượng lộ, bình an!</span></p>
    <p color: black;>Trân trọng,</p>
    <p color: black;><i>GROUP09-VEXERE</i></p>`,
    };
    // sending the email
    myTransport.sendMail(mailOptions, (err) => {
        if (err) {
            console.log(`Email is failed to send!`);
            console.error(err);
        }
        else {
            console.log(`Email is successfully sent!`);
        }
    });
}
export default bookingPaymentHandler;
