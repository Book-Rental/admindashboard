import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Rb_Button,
  Dropdown,
} from "@rentbook/rentbook-ui-lib";

import { useBags } from "../../hooks/useBags";
import { useHubs } from "../../hooks/useHubs";
import { useHubById } from "../../hooks/useHubById";
import {
  useAddShipmentsToBag,
  useCreateBag,
} from "../../hooks/useBagActions";
import { showToast } from "../../utils/showToaster";
import { getErrorMessage } from "../../utils/getErrorMessage";

const NEW_BAG = "__new__";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // Parcels to put in the bag. Pass [] to only create an empty bag.
  shipmentIds: string[];
  onDone?: (bagId: string) => void;
}

export default function AddToBagModal({
  isOpen,
  onClose,
  shipmentIds,
  onDone,
}: Props) {
  const hubMongoId = window.HOST_USER_INFO?.referenceId ?? "";
  const { data: myHubData } = useHubById(hubMongoId);
  const myHub = myHubData?.data;

  const { data: bagsData } = useBags();
  const { data: hubsData } = useHubs();

  const createBag = useCreateBag();
  const addShipments = useAddShipmentsToBag();

  const hasShipments = shipmentIds.length > 0;
  const [bagChoice, setBagChoice] = useState(NEW_BAG);
  const [toHubId, setToHubId] = useState("");
  const [fromHubId, setFromHubId] = useState("");

  useEffect(() => {
    if (myHub?.hubId) setFromHubId(myHub.hubId);
  }, [myHub?.hubId]);

  useEffect(() => {
    if (isOpen) {
      setBagChoice(NEW_BAG);
      setToHubId("");
    }
  }, [isOpen]);

  const hubs = hubsData?.data ?? [];

  // Only bags still in CREATED status accept more parcels.
  const openBags = useMemo(
    () =>
      (bagsData?.data ?? []).filter(
        (b) =>
          b.status === "CREATED" &&
          (!fromHubId || b.fromHubId === fromHubId)
      ),
    [bagsData, fromHubId]
  );

  const hubName = (hubId: string) =>
    hubs.find((h) => h.hubId === hubId)?.hubName ?? hubId;

  const bagOptions = [
    ...(hasShipments
      ? openBags.map((b) => ({
          label: `${b.bagId} → ${hubName(b.toHubId)} (${b.shipmentIds.length} parcels)`,
          value: b.bagId,
        }))
      : []),
    { label: "+ Create new bag", value: NEW_BAG },
  ];

  const hubOptions = hubs
    .filter((h) => h.hubId !== fromHubId)
    .map((h) => ({
      label: `${h.hubName} (${h.hubCode})`,
      value: h.hubId,
    }));

  const fromOptions = hubs.map((h) => ({
    label: `${h.hubName} (${h.hubCode})`,
    value: h.hubId,
  }));

  const creatingNew = bagChoice === NEW_BAG;
  const isBusy = createBag.isPending || addShipments.isPending;
  const canSubmit = creatingNew
    ? Boolean(fromHubId && toHubId)
    : Boolean(bagChoice);

  const handleSubmit = async () => {
    try {
      let bagId = bagChoice;

      if (creatingNew) {
        const created = await createBag.mutateAsync({
          fromHubId,
          toHubId,
        });
        bagId = created.bag.bagId;
      }

      if (hasShipments) {
        await addShipments.mutateAsync({ bagId, shipmentIds });
      }

      showToast(
        hasShipments
          ? `${shipmentIds.length} parcel(s) added to ${bagId}`
          : `Bag ${bagId} created`,
        "success"
      );
      onDone?.(bagId);
      onClose();
    } catch (error) {
      showToast(getErrorMessage(error, "Failed to update bag"), "error");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader onClose={onClose}>
        {hasShipments ? "Add to Bag" : "Create Bag"}
      </ModalHeader>

      <ModalBody>
        <div className="space-y-4">
          {hasShipments && (
            <p className="text-sm text-gray-600">
              {shipmentIds.length} parcel(s) selected
            </p>
          )}

          {hasShipments && (
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">
                Bag
              </p>
              <Dropdown
                value={bagChoice}
                onChange={setBagChoice}
                options={bagOptions}
                placeholder="Select bag"
              />
            </div>
          )}

          {creatingNew && (
            <>
              <div>
                <p className="mb-1 text-xs font-medium text-gray-500">
                  From hub
                </p>
                {myHub?.hubId ? (
                  <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                    {myHub.hubName} ({myHub.hubCode})
                  </p>
                ) : (
                  <Dropdown
                    value={fromHubId}
                    onChange={setFromHubId}
                    options={fromOptions}
                    placeholder="Select source hub"
                  />
                )}
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-gray-500">
                  To hub
                </p>
                <Dropdown
                  value={toHubId}
                  onChange={setToHubId}
                  options={hubOptions}
                  placeholder="Select destination hub"
                />
              </div>
            </>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Rb_Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isBusy}
        >
          Cancel
        </Rb_Button>
        <Rb_Button
          type="button"
          onClick={handleSubmit}
          isLoading={isBusy}
          disabled={!canSubmit || isBusy}
        >
          {hasShipments ? "Add to Bag" : "Create Bag"}
        </Rb_Button>
      </ModalFooter>
    </Modal>
  );
}
