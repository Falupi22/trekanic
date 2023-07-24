import { BrakeLogo, FlatTireLogo, FrameLogo } from "../assets/icons";
import Welcome from "./general/Welcome";

function UserMain() {
    const appointments = [{
        title: "Broken frame",
        mechanicName: "Israel Israeli",
        time: new Date(Date.now()).toDateString(),
        iconPath: <FrameLogo/>
    },{
        title: "Puncture",
        mechanicName: "Israela Israeli",
        time: new Date(Date.now()).toDateString(),
        iconPath: <FlatTireLogo/>
    },{
        title: "Malfunctioned front brake",
        mechanicName: "Palestinia Palestine",
        time: new Date(Date.now()).toDateString(),
        iconPath: <BrakeLogo/>
    }]

    return <div>
        <Welcome userName="Tal"/>
        <div style={{ display: "flex", 
                                                                     justifyContent: "center",
                                                                     alignContent: "center",
                                                                     flexDirection: "column",
                                                                     gap:"10px"}}>
        {appointments.map((appointment) => <div class="card" style={{ width: "60%", alignSelf: "center"}}> 
    <div class="card-header">
      <strong>{appointment.title}</strong>
    </div>
    <div class="card-body">
      <p class="card-title" style={{ display: "flex", width: "100%", flexDirection: "row", justifyContent: "space-between"}}>
        <em>{appointment.mechanicName}</em>
        <div style={{width: "3em", height: "3em"}}>
            {appointment.iconPath}
        </div>
        </p>
      <p class="card-text">{appointment.time}</p>
      </div>
    </div>)}
    </div>
  </div>
}

export default UserMain;