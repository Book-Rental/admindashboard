import {
    FaMotorcycle,
    FaTruck,
    FaCar,
} from "react-icons/fa";
import { GiScooter } from "react-icons/gi";

interface VehicleIconProps {
    type: string;
}

const VehicleIcon = ({ type }: VehicleIconProps) => {
    switch (type) {
        case "Bike":
            return <FaMotorcycle className="text-blue-600" />;

        case "Scooter":
            return <GiScooter className="text-green-600" />;

        case "Truck":
            return <FaTruck className="text-orange-600" />;

        case "Car":
            return <FaCar className="text-purple-600" />;

        default:
            return <FaCar className="text-gray-500" />;
    }
};

export default VehicleIcon;