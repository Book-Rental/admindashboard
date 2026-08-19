export interface EmployeeHub {
    _id: string;
    hubCode: string;
}

export interface EmployeeVehicle {
    type: string | null;
    number: string;
}

export interface CurrentLocation {
    type: "Point";
    coordinates: [number, number];
    updatedAt: string | null;
}

export interface Employee {
    _id: string;
    EmployeeId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
    status: string;
    isAvailable: boolean;
    isActive: boolean;

    hub: EmployeeHub;

    vehicle: EmployeeVehicle;

    address: string;
    emergencyContact: string;
    notes: string;
    photo: string | null;

    currentShipmentId: string | null;

    currentLocation: CurrentLocation;

    joinedOn: string;
    createdAt: string;
    updatedAt: string;
}

export interface EmployeeResponse {
    status: string;
    message: string;
    data: Employee;
}