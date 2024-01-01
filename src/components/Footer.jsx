import React from "react";


export default function Footer(){

    let yr=new Date().getFullYear();
    return(<div id="footer">
        <p>Copyright Innovative Trucking LLC © {yr}</p>
    </div>);
}