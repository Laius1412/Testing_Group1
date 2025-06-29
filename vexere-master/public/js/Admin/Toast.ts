import StartToastifyInstance from "/js/Toast/toastify-es.js";

class ToastMsg{
  //Bus
  public fetchBusMsg = StartToastifyInstance({
    text: "Đang lấy dữ liệu các xe",
    duration: 1000,
    position:"right"
  });
  public createBusMsg = StartToastifyInstance({
    text: "Đang tạo một xe mới",
    duration: 1000,
    position:"right"
  });
  public updateBusMsg = StartToastifyInstance({
    text: "Đang sửa dữ liệu xe",
    duration: 1000,
    position:"right"
  });

  //Ticket
  public fetchTicketmsg = StartToastifyInstance({
    text:"Đang láy dữ liệu các vé",
    duration: 1000,
    position:"right"
  });
  public updateTicketmsg = StartToastifyInstance({
    text:"Đang sửa dữ liệu vé",
    duration: 1000,
    position:"right"
  });

  //House
  public fetchHouseMsg = StartToastifyInstance({
    text: "Đang lấy dữ liệu các nhà xe",
    duration: 1000,
    position:"right"
  });
  public createHouseMsg = StartToastifyInstance({
    text: "Đang tạo một nhà xe mới",
    duration: 1000,
    position:"right"
  });
  public updateHouseMsg = StartToastifyInstance({
    text: "Đang sửa dữ liệu nhà xe",
    duration: 1000,
    position:"right"
  });

  //Detail
  public fetchDetailMsg = StartToastifyInstance({
    text: "Đang lấy dữ liệu các chuyến xe",
    duration: 1000,
    position:"right"
  });
  public createDetailMsg = StartToastifyInstance({
    text: "Đang tạo một chuyến xe mới",
    duration: 1000,
    position:"right"
  });
  public updateDetailMsg = StartToastifyInstance({
    text: "Đang sửa dữ liệu chuyến xe",
    duration: 1000,
    position:"right"
  });

  public successMsg = StartToastifyInstance({
    text:"Thành công",
    duration:1000 ,
    position:"right"
  })
  public failedMsg = StartToastifyInstance({
    text:"Thất bại",
    duration:1000 ,
    position:"right"
  })
}
const toastMsg = new ToastMsg();
export default toastMsg;