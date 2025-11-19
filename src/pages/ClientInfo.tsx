import React, { useState } from "react";
import { View, Text, Button, Modal, StyleSheet } from "react-native";
import { useNavigationApp } from "@features/model/useNavigationApp";
import EditClientWidget from "@/widgets/EditClientWiget";

export const ClientInfo = () => {
    return(
        <EditClientWidget/>
    )
}
export default ClientInfo;