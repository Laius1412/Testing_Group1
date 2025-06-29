import StartToastifyInstance from "/js/Toast/toastify-es.js";
class ToastMsg {
    constructor() {
        //Bus
        this.fetchBusMsg = StartToastifyInstance({
            text: "Đang lấy dữ liệu các xe",
            duration: 1000,
            position: "right"
        });
        this.createBusMsg = StartToastifyInstance({
            text: "Đang tạo một xe mới",
            duration: 1000,
            position: "right"
        });
        this.updateBusMsg = StartToastifyInstance({
            text: "Đang sửa dữ liệu xe",
            duration: 1000,
            position: "right"
        });
        //Ticket
        this.fetchTicketmsg = StartToastifyInstance({
            text: "Đang láy dữ liệu các vé",
            duration: 1000,
            position: "right"
        });
        this.updateTicketmsg = StartToastifyInstance({
            text: "Đang sửa dữ liệu vé",
            duration: 1000,
            position: "right"
        });
        //House
        this.fetchHouseMsg = StartToastifyInstance({
            text: "Đang lấy dữ liệu các nhà xe",
            duration: 1000,
            position: "right"
        });
        this.createHouseMsg = StartToastifyInstance({
            text: "Đang tạo một nhà xe mới",
            duration: 1000,
            position: "right"
        });
        this.updateHouseMsg = StartToastifyInstance({
            text: "Đang sửa dữ liệu nhà xe",
            duration: 1000,
            position: "right"
        });
        //Detail
        this.fetchDetailMsg = StartToastifyInstance({
            text: "Đang lấy dữ liệu các chuyến xe",
            duration: 1000,
            position: "right"
        });
        this.createDetailMsg = StartToastifyInstance({
            text: "Đang tạo một chuyến xe mới",
            duration: 1000,
            position: "right"
        });
        this.updateDetailMsg = StartToastifyInstance({
            text: "Đang sửa dữ liệu chuyến xe",
            duration: 1000,
            position: "right"
        });
        this.successMsg = StartToastifyInstance({
            text: "Thành công",
            duration: 1000,
            position: "right"
        });
        this.failedMsg = StartToastifyInstance({
            text: "Thất bại",
            duration: 1000,
            position: "right"
        });
    }
}
const toastMsg = new ToastMsg();
export default toastMsg;
