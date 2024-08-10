import { HeaderProp } from "../types/types";

export function Header(props: HeaderProp){
    return (
        <div className="header-container">
            <i className="bi bi-list list-icon" onClick={props.toggleSidebar}></i>
        </div>
    )
}