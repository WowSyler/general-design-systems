import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

import { PHONE, setWindowSize } from "./utils";

// Varsayılan: telefon penceresi (jsdom'da 0×0 yerine gerçekçi boyut).
setWindowSize(PHONE.width, PHONE.height);

afterEach(() => {
  cleanup();
  setWindowSize(PHONE.width, PHONE.height);
});
