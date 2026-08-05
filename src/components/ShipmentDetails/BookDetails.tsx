import { OrderItem } from "../../types/shipmentDetails";

interface Props {
  orderItem?: OrderItem;
}

export default function BookDetails({
  orderItem,
}: Props) {

  if (!orderItem) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

        <h2 className="text-lg font-semibold text-blue-600 mb-6">
          Book Details
        </h2>

        <p className="text-sm text-slate-400">
          Book details are not available.
        </p>

      </div>
    );
  }


  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      <h2 className="text-base font-semibold text-slate-800 mb-6">
        Book Details
      </h2>


      <div className="flex gap-5">

        <img
          src={orderItem.coverImage}
          className="w-24 h-32 rounded-lg object-cover border border-slate-200"
        />


        <div>

          <h3 className="text-base font-semibold text-slate-700">
            {orderItem.bookName}
          </h3>


          <p className="text-sm text-slate-500 mt-1">
            Author: <span className="text-slate-600 font-medium">{orderItem.author}</span>
          </p>


          <p className="text-sm text-slate-500 mt-1">
            Quantity: <span className="text-slate-600 font-medium">{orderItem.quantity}</span>
          </p>


        </div>

      </div>

    </div>
  );
}
