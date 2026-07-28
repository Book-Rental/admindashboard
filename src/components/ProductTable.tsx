import { Rb_Image } from "@rentbook/rentbook-ui-lib";
import { Book } from "../types/book";

interface Props {
    books: Book[];
}

export default function ProductTable({ books }: Props) {
    return (
        <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full min-w-[760px]">
                <thead>
                    <tr className="border-b text-gray-500 text-sm">
                        <th className="p-4 text-left">ID</th>
                        <th className="p-4 text-left">PRODUCT</th>
                        <th className="p-4 text-left">CATEGORY</th>
                        <th className="p-4 text-left">PRICE</th>
                        <th className="p-4 text-left">STOCK</th>
                        <th className="p-4 text-left">TYPE</th>
                        <th className="p-4 text-left">STATUS</th>
                    </tr>
                </thead>

                <tbody>
                    {books.map((book, index) => (
                        <tr key={book._id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                                {String(index + 1).padStart(4, "0")}
                            </td>

                            <td className="p-4">
                                <div className="flex gap-3 items-center">
                                    <Rb_Image
                                        src={book.coverImage ?? book.images?.[0]?.url}
                                        fallbackSrc="https://via.placeholder.com/50"
                                        alt={book.name}
                                        width={48}
                                        height={64}
                                        shape="rounded"
                                    />

                                    <div>
                                        <p className="font-medium">{book.name}</p>
                                        <p className="text-xs text-gray-500">{book.author}</p>
                                    </div>
                                </div>
                            </td>

                            <td className="p-4">{book.category?.name ?? "-"}</td>

                            <td className="p-4">
                                <div>
                                    <p>Day : ₹{book.rentalPricePerDay}</p>
                                    <p className="text-xs text-gray-500">
                                        Month : ₹{book.rentalPricePerMonth}
                                    </p>
                                </div>
                            </td>

                            <td className="p-4">{book.quantity}</td>

                            <td className="p-4">
                                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs">
                                    {book.listingType}
                                </span>
                            </td>

                            <td className="p-4">
                                <span
                                    className={`px-3 py-1 rounded-md text-xs ${book.availabilityStatus === "available"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {book.availabilityStatus}
                                </span>
                            </td>
                        </tr>
                    ))}

                    {books.length === 0 && (
                        <tr>
                            <td colSpan={7} className="p-8 text-center text-gray-400">
                                No products to show.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}