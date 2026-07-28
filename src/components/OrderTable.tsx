import { Rb_Image } from "@rentbook/rentbook-ui-lib";
import { Order } from "../types/order";

interface Props {
    orders: Order[];
}

const paymentBadge = (status: Order["paymentStatus"]) =>
    status === "success"
        ? "bg-green-100 text-green-600"
        : "bg-yellow-100 text-yellow-600";

const orderBadge = (status: Order["orderStatus"]) => {
    switch (status) {
        case "confirmed":
        case "delivered":
            return "bg-green-100 text-green-700";

        case "cancelled":
        case "returned":
            return "bg-red-100 text-red-700";

        case "shipped":
            return "bg-blue-100 text-blue-700";

        case "return_requested":
            return "bg-orange-100 text-orange-700";

        default:
            return "bg-purple-100 text-purple-700";
    }
};
const formatOrderNumber = (orderNumber: string) => {
    if (orderNumber.length <= 6) {
        return `#${orderNumber}`;
    }

    return `#${orderNumber.slice(0, 3)}...${orderNumber.slice(-3)}`;
};
export default function OrderTable({ orders }: Props) {
    return (
        <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full min-w-[720px] text-sm">
                <thead>
                    <tr className="border-b text-gray-500">
                        <th className="p-4 text-left">ID</th>
                        <th className="p-4 text-left">BOOK</th>
                        <th className="p-4 text-left">DATE</th>
                        <th className="p-4 text-left">AMOUNT</th>
                        <th className="p-4 text-left">PAYMENT</th>
                        <th className="p-4 text-left">STATUS</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((order) => (
                        <tr key={order.orderId} className="border-b hover:bg-gray-50">
                            <td className="p-4 text-gray-700 font-medium">
                                {formatOrderNumber(order.orderNumber)}
                            </td>

                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    {order.items[0] && (
                                        <Rb_Image
                                            src={order.items[0].coverImage}
                                            alt={order.items[0].bookName}
                                            width={40}
                                            height={48}
                                            shape="rounded"
                                        />
                                    )}

                                    <div>
                                        <p className="font-medium">
                                            {order.items[0]?.bookName}
                                        </p>

                                        {order.items.length > 1 && (
                                            <p className="text-xs text-gray-500">
                                                +{order.items.length - 1} more
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </td>

                            <td className="p-4">
                                {new Date(order.orderDate).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </td>

                            <td className="p-4 font-medium">
                                ₹{order.totalAmount.toFixed(2)}
                            </td>

                            <td className="p-4">
                                <span className={`px-3 py-1 rounded-full text-xs ${paymentBadge(order.paymentStatus)}`}>
                                    {order.paymentStatus}
                                </span>
                            </td>

                            <td className="p-4">
                                <span className={`px-4 py-1 rounded-md text-xs font-medium ${orderBadge(order.orderStatus)}`}>
                                    {order.orderStatus}
                                </span>
                            </td>
                        </tr>
                    ))}

                    {orders.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-8 text-center text-gray-400">
                                No orders to show.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}