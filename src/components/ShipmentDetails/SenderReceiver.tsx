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
}) => (
  <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">

    <h3 className="font-semibold text-lg mb-5">
      {title}
    </h3>

    <div className="space-y-3">

      <div>
        <p className="text-xs text-slate-500">
          Name
        </p>

        <p className="font-medium">
          {person.name}
        </p>
      </div>

      <div>
        <p className="text-xs text-slate-500">
          Phone
        </p>

        <p>{person.phone}</p>
      </div>

      {person.email && (
        <div>
          <p className="text-xs text-slate-500">
            Email
          </p>

          <p>{person.email}</p>
        </div>
      )}

      <div>
        <p className="text-xs text-slate-500">
          Address
        </p>

        <p>
          {person.addressLine1}
          {person.addressLine2 &&
            `, ${person.addressLine2}`}
        </p>
      </div>

      <div>
        <p className="text-xs text-slate-500">
          City
        </p>

        <p>{person.city}</p>
      </div>

      <div>
        <p className="text-xs text-slate-500">
          State
        </p>

        <p>{person.state}</p>
      </div>

      <div>
        <p className="text-xs text-slate-500">
          Pincode
        </p>

        <p>{person.pincode}</p>
      </div>

    </div>

  </div>
);

export default function SenderReceiver({
  sender,
  receiver,
}: SenderReceiverProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      <h2 className="text-xl font-semibold mb-6">
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