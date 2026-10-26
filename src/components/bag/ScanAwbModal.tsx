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
const parseAwb = (decodedText: string): string => {
  const text = decodedText.trim();
  if (!text.includes("/")) return text;
  const withoutQuery = text.split(/[?#]/)[0].replace(/\/+$/, "");
  return withoutQuery.split("/").pop() ?? text;
};

interface ScanResult {
  ok: boolean;
  message: string;
  // true when the parcel was already handled earlier (not a real error)
  alreadyDone?: boolean;
}

type Feedback = {
  awb: string;
  kind: "success" | "info" | "error";
  message: string;
};

// Short beep + vibration so the operator knows a scan worked
// without looking at the screen.
const giveSuccessFeedback = () => {
  try {
    navigator.vibrate?.(80);
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
    setTimeout(() => ctx.close(), 300);
  } catch {
    // feedback is optional
  }
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  // Called for every parcel scanned; return the outcome to show on screen.
  onScan: (awbNumber: string) => Promise<ScanResult>;
  title: string;
  // e.g. "1 of 2 verified" shown next to the title
  progressText?: string;
  // when true, completeMessage is shown as a green banner
  isComplete?: boolean;
  completeMessage?: string;
}

function ScannerView({
  onScan,
  isComplete,
  completeMessage,
}: {
  onScan: Props["onScan"];
  isComplete: boolean;
  completeMessage?: string;
}) {
  const [cameraError, setCameraError] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  const busyRef = useRef(false);
  const lastScanRef = useRef({ awb: "", at: 0 });
  // Parcels already settled in this session. The camera keeps seeing
  // the same label, so these are ignored instead of being sent again.
  const settledRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    let started = false;
    let scanner: Html5Qrcode | null = null;

    const handleDecoded = async (decodedText: string) => {
      const awb = parseAwb(decodedText);
      const now = Date.now();

      // The camera reads the same code many times a second:
      // ignore it while a check is running, after it was settled,
      // or just after the same code was tried.
      if (busyRef.current) return;
      if (settledRef.current.has(awb)) return;
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

        if (result.ok) {
          settledRef.current.add(awb);
          giveSuccessFeedback();
          setFeedback({ awb, kind: "success", message: "Verified" });
        } else if (result.alreadyDone) {
          // Not an error: just tell the operator once, then stay quiet.
          settledRef.current.add(awb);
          setFeedback({
            awb,
            kind: "info",
            message: result.message,
          });
        } else {
          setFeedback({ awb, kind: "error", message: result.message });
        }
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

      {feedback && (
        <div
          className={`rounded-lg px-4 py-3 text-sm ${
            feedback.kind === "success"
              ? "bg-emerald-50 text-emerald-700"
              : feedback.kind === "info"
              ? "bg-amber-50 text-amber-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          <span className="font-semibold">{feedback.awb}</span>
          {": "}
          {feedback.message}
        </div>
      )}

      {isComplete && completeMessage && (
        <div className="rounded-lg bg-emerald-600 px-4 py-3 text-center text-sm font-medium text-white">
          {completeMessage}
        </div>
      )}
    </div>
  );
}

export default function ScanAwbModal({
  isOpen,
  onClose,
  onScan,
  title,
  progressText,
  isComplete = false,
  completeMessage,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader onClose={onClose}>
        {title}
        {progressText ? ` (${progressText})` : ""}
      </ModalHeader>

      <ModalBody>
        {/* Mounted only while open, so the camera is released on close */}
        {isOpen && (
          <ScannerView
            onScan={onScan}
            isComplete={isComplete}
            completeMessage={completeMessage}
          />
        )}
      </ModalBody>

      <ModalFooter>
        <Rb_Button type="button" onClick={onClose}>
          Done
        </Rb_Button>
      </ModalFooter>
    </Modal>
  );
}
