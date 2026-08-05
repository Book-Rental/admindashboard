interface Address {
  name: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

interface SenderReceiverProps {
  sender: Address;
  receiver: Address;
}

const AddressCard = ({
  title,
  person,
}: {
  title: string;
  person: Address;
}) => {
  const fullAddress = [
    person.addressLine1,
    person.addressLine2,
    person.city,
    person.state,
    person.pincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
      <h3 className="text-base font-semibold text-slate-700 mb-5">
        {title}
      </h3>

      <div className="grid grid-cols-2 gap-x-8 gap-y-5">
        {/* Name */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Name
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {person.name}
          </p>
        </div>

        {/* Phone */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Phone
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {person.phone}
          </p>
        </div>

        {/* Email */}
        {person.email && (
          <div className="col-span-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Email
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-700 break-all">
              {person.email}
            </p>
          </div>
        )}

        {/* Address */}
        <div className="col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Address
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700 leading-6">
            {fullAddress}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function SenderReceiver({
  sender,
  receiver,
}: SenderReceiverProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <h2 className="text-base font-semibold text-slate-800 mb-6">
        Sender & Receiver
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AddressCard
          title="Sender Details"
          person={sender}
        />

        <AddressCard
          title="Receiver Details"
          person={receiver}
        />
      </div>
    </div>
  );
}