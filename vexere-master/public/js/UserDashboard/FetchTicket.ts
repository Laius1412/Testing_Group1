interface TicketData {
  startDate: string,
  busHouse: string,
  route: string,
  busPlate: string,
  status: string,
  id: number
}

type FetchTicketData = {
  RouteDetail: {
      Bus: {
          BusHouse: {
              Name: string;
          };
          plate: string;
      };
      Route: {
          Location_Route_startLocIdToLocation: {
              name: string;
          };
          Location_Route_endLocIdToLocation: {
              name: string;
          };
      };
      startTime: string;
  };
  id: number;
  status: "WAITING" | "PAID" | "CANCELED";
}

const makeTicketElement = ({ startDate, busHouse, route, busPlate, status,id }: TicketData) => {
  const template = `
  <a class="ticket-container" href="/user/ticket?ticketId=${id}">
    <div>
      <h4 class="booked-date">${startDate}</h4>
      <div class="paid-ticket">
        <div class="paid-ticket-information">
          <div>
            <h3 class="paid-ticket-time"></h3>
            <p>${busHouse}</p>
            <p>${route}</p>
            <p>Biển số xe: <span class="license-plate">${busPlate}</span></p>
          </div>
          <span class="paid-span">${status}</span>
        </div>
      </div>
    </div>
  </a>`
  return template;
}

const handleFetchTicket = async (status:("CANCELED" | "FINISHED" | null) = null) => {
  const fetchData = await fetch(`/user/api/tickets${!status ? "" : `?status=${status}`}`);
  try {
    const ticketDatas: HTMLLIElement[] = [];
    const tickets: FetchTicketData[] = await fetchData.json();
    console.log("Tickets",tickets);
    tickets.forEach((tick) => {
      const data: TicketData = {
        startDate: (new Date(tick.RouteDetail.startTime)).toLocaleString(),
        busHouse: tick.RouteDetail.Bus.BusHouse.Name,
        route: `
        ${tick.RouteDetail.Route.Location_Route_startLocIdToLocation.name} - ${tick.RouteDetail.Route.Location_Route_endLocIdToLocation.name}
        `,
        busPlate: tick.RouteDetail.Bus.plate,
        status: tick.status,
        id: tick.id
      }
      const li = document.createElement("li");
      li.innerHTML = makeTicketElement(data);
      ticketDatas.push(li);
    })
    const ul = <HTMLUListElement>document.getElementById("ticket-display-ul");
    ul.replaceChildren(...ticketDatas);
  } catch (error) {
    console.log(error)
  }
}

document.getElementById("ticket-fetch-current")?.addEventListener("click",()=>{handleFetchTicket()});
document.getElementById("ticket-fetch-finished")?.addEventListener("click",()=>{handleFetchTicket("FINISHED")});
document.getElementById("ticket-fetch-canceled")?.addEventListener("click",()=>{handleFetchTicket("CANCELED")});
document.getElementById("ticket-tab-nav")?.addEventListener("click",()=>{handleFetchTicket()});