import { useEffect, useRef, useState } from "react";
import {
  Html5Qrcode,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Rb_Button,
} from "@rentbook/rentbook-ui-lib";

const SCANNER_ELEMENT_ID = "bag-awb-scanner";

// The label has two codes:
//  - Code128 barcode holding the plain AWB
//  - QR code holding a URL ending in /scan/<AWB>
// Both are turned into the plain AWB here.
export const parseAwb = (decodedText: string): string => {
  const text = decodedText.trim();
  if (!text.includes("/")) return text;
  const withoutQuery = text.split(/[?#]/)[0].replace(/\/+$/, "");
  return withoutQuery.split("/").pop() ?? text;
};

interface ScanResult {
  ok: boolean;
  message: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // Called for every parcel scanned; return the outcome to show on screen.
  onScan: (awbNumber: string) => Promise<ScanResult>;
  verified: number;
  total: number;
}

function ScannerView({
  onScan,
}: {
  onScan: Props["onScan"];
}) {
  const [cameraError, setCameraError] = useState("");
  const [lastResult, setLastResult] = useState<
    (ScanResult & { awb: string }) | null
  >(null);

  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  const busyRef = useRef(false);
  const lastScanRef = useRef({ awb: "", at: 0 });

  useEffect(() => {
    let cancelled = false;
    let started = false;
    let scanner: Html5Qrcode | null = null;

    const handleDecoded = async (decodedText: string) => {
      const awb = parseAwb(decodedText);
      const now = Date.now();

      // The camera reads the same code many times a second:
      // ignore it while a check is running or just after the same code.
      if (busyRef.current) return;
      if (
        awb === lastScanRef.current.awb &&
        now - lastScanRef.current.at < 3000
      ) {
        return;
      }

      busyRef.current = true;
      lastScanRef.current = { awb, at: now };
      try {
        const result = await onScanRef.current(awb);
        setLastResult({ ...result, awb });
      } finally {
        lastScanRef.current = { awb, at: Date.now() };
        busyRef.current = false;
      }
    };

    const start = async () => {
      try {
        scanner = new Html5Qrcode(SCANNER_ELEMENT_ID, {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
          ],
          verbose: false,
        });

        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 300, height: 160 } },
          handleDecoded,
          () => {}
        );
        started = true;

        if (cancelled) {
          await scanner.stop();
          scanner.clear();
        }
      } catch {
        if (!cancelled) {
          setCameraError(
            "Could not open the camera. Allow camera permission in the browser. Camera only works on https or localhost."
          );
        }
      }
    };

    start();

    return () => {
      cancelled = true;
      if (scanner && started) {
        scanner
          .stop()
          .then(() => scanner?.clear())
          .catch(() => {});
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div
        id={SCANNER_ELEMENT_ID}
        className="mx-auto w-full max-w-md overflow-hidden rounded-lg bg-black"
      />

      {cameraError && (
        <p className="text-sm text-red-600">{cameraError}</p>
      )}

      {!cameraError && (
        <p className="text-center text-xs text-gray-500">
          Point the camera at the QR code or barcode on the parcel label.
        </p>
      )}

      {lastResult && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            lastResult.ok
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          <span className="font-semibold">{lastResult.awb}</span>
          {": "}
          {lastResult.message}
        </div>
      )}
    </div>
  );
}

export default function ScanAwbModal({
  isOpen,
  onClose,
  onScan,
  verified,
  total,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader onClose={onClose}>
        Scan Parcels ({verified} of {total} verified)
      </ModalHeader>

      <ModalBody>
        {/* Mounted only while open, so the camera is released on close */}
        {isOpen && <ScannerView onScan={onScan} />}
      </ModalBody>

      <ModalFooter>
        <Rb_Button type="button" onClick={onClose}>
          Done
        </Rb_Button>
      </ModalFooter>
    </Modal>
  );
}
