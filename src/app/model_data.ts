export interface MockData {
    "ErrCode": number,
    "ErrMessage": string,
    "Data": Data[],
}

export interface Data {
    "CIPCircuitID": number,
    "CIPCircuitName": string,
    "EquipmentID": number,
    "EquipmentName": string,
    "CIPProgram": string,
    "CIPResult": string,
    "StartDateTime": string,
    "EndDateTime": string,
    "Duration": number,
    "TimeSinceLastCIP": number
}
