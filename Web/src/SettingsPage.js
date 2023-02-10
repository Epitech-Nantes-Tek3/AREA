import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom"

export default function SettingsPage(props) {
    const navigate = useNavigate();

    useEffect(() => {
        if (props.userInformation.mail === "") {
            navigate('/auth');
        }
    }, [props.userInformation])

    return (
        <div>
            <h1>Settings</h1>
            <p>Mail: {props.userInformation.mail}</p>
        </div>
    )
}