import { BrakeLogo, EllipsisLogo, FlatTireLogo, FrameLogo, PencilLogo, BinLogo } from "../assets/icons";
import "../styles/style.css"
import Welcome from "./general/Welcome";

const colors = {
    "Pending": "black",
    "Done": "green", 
    "Canceled": "var(--red)"
}

function UserMain() {
    const appointments = [{
        title: "Broken frame",
        mechanicName: "Israel Israeli",
        time: new Date(Date.now()).toDateString(),
        iconPath: <FrameLogo />,
        status: "Pending"
    }, {
        title: "Puncture",
        mechanicName: "Israela Israeli",
        time: new Date(Date.now()).toDateString(),
        iconPath: <FlatTireLogo />,
        status: "Pending"
    }, {
        title: "Malfunctioned front brake",
        mechanicName: "Palestinia Palestine",
        time: new Date(Date.now()).toDateString(),
        iconPath: <BrakeLogo />,
        status: "Pending"
    }, {
        title: "Malfunctioned front brake",
        mechanicName: "Palestinia Palestine",
        time: new Date(Date.now()).toDateString(),
        iconPath: <BrakeLogo />,
        status: "Done"
    }, {
        title: "Malfunctioned front brake",
        mechanicName: "Palestinia Palestine",
        time: new Date(Date.now()).toDateString(),
        iconPath: <BrakeLogo />,
        status: "Canceled"
    }]

    return <div className="flex_component">
        <Welcome userName="Tal" style="header"/>
        <h1 className="mt-5 mb-5">Your appointments</h1>
        <div className="flex_card_list">
            {appointments.map((appointment) => <div class="card flex_card">
                <div className="card-header flex_card_row">
                    <strong>{appointment.title}</strong>
                    <div>
                    <div className="flex_card_row_reversed">
                    <button className="tiny_button transparent ellipsis-button">
                        <EllipsisLogo/>
                    </button>
                    <div className="hover_toggleable">
                    <button className="tiny_button transparent">
                        <BinLogo/>
                    </button>
                    <button className="tiny_button transparent">
                        <PencilLogo/>
                    </button>
                    </div>
                    </div>
                    </div>
                </div>
                <div class="card-body">
                    <p class="card-title flex_card_row">
                        <em>{appointment.mechanicName}</em>
                        <div className="small_icon">
                            {appointment.iconPath}
                        </div>
                    </p>
                    <p class="card-text flex_card_row">{appointment.time}<strong style={{color: colors[appointment.status]}}>{appointment.status}</strong></p>
                </div>
            </div>)}
        </div>
    </div>
}

export default UserMain;