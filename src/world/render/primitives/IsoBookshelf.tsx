import { useCallback } from "react";
import type { Graphics } from "pixi.js";
import { iso } from "@/world/lib/iso";
import { IsoBox } from "./IsoBox";

const BOOK_PALETTE = [
  0x7a3e18, 0x9d4f22, 0xb85c38, 0xc16a1f, 0x1f4f7a, 0x2e6da4, 0x5a8fbb, 0x60a5fa, 0x2c6e4c,
  0x34d399, 0x5eead4, 0xa7e6d6, 0xa66a2a, 0xc18643, 0xe8b96b, 0xfbbf24, 0x4a2b4f, 0x6b3e74,
  0xa78bfa, 0xc4b5fd, 0x6b1b1b, 0x9d2828, 0xc94343, 0xf87171,
];

const SHELVES = 4;
const SHELF_HEIGHT = 0.45;
const SHELF_START_Z = 0.25;
const SHELF_HALF_WIDTH = 1.42 * 14;

export function IsoBookshelf({ x, y }: { x: number; y: number }) {
  const drawBooks = useCallback(
    (g: Graphics) => {
      g.clear();
      for (let row = 0; row < SHELVES; row += 1) {
        const center = iso(x + 0.5, y + 0.22, SHELF_START_Z + row * SHELF_HEIGHT);
        const shelfLeft = center.x - SHELF_HALF_WIDTH;
        const shelfRight = center.x + SHELF_HALF_WIDTH;
        const baseY = center.y + 12;

        g.rect(shelfLeft - 2, baseY, shelfRight - shelfLeft + 4, 2.5);
        g.fill({ color: 0x3a2415, alpha: 0.95 });

        // Deterministic pseudo-random spines so every render draws the same shelf.
        const seed = row * 31 + 7;
        let cursor = shelfLeft + 1;
        for (let i = 0; i <= 14 && cursor < shelfRight - 4; i += 1) {
          const bookW = 3 + (((seed + i * 13) % 7) % 4);
          const bookH = 14 + ((seed + i * 19) % 5) * 1.2;
          const color = BOOK_PALETTE[(seed + i * 11) % BOOK_PALETTE.length];
          const leaning = (seed + i * 7) % 5 === 0;

          if (leaning) {
            g.poly([
              cursor,
              baseY - bookH + 4,
              cursor + bookW + 2,
              baseY - bookH,
              cursor + bookW + 2,
              baseY,
              cursor,
              baseY,
            ]);
            g.fill({ color, alpha: 0.95 });
            const bandY = baseY - bookH * 0.5;
            g.poly([
              cursor + 0.5,
              bandY,
              cursor + bookW + 1.5,
              bandY - 1,
              cursor + bookW + 1.5,
              bandY + 2,
              cursor + 0.5,
              bandY + 3,
            ]);
            g.fill({ color: 0xe8b96b, alpha: 0.6 });
            cursor += bookW + 2.5;
          } else {
            g.rect(cursor, baseY - bookH, bookW, bookH);
            g.fill({ color, alpha: 0.95 });
            g.rect(cursor, baseY - bookH, 0.6, bookH);
            g.fill({ color: 0x000000, alpha: 0.35 });
            if (bookW >= 4) {
              g.rect(cursor + 0.5, baseY - bookH * 0.65, bookW - 1, 1.4);
              g.fill({ color: 0xf7f3ea, alpha: 0.55 });
            }
            cursor += bookW + 0.6;
          }
        }
      }
    },
    [x, y],
  );

  return (
    <pixiContainer>
      <IsoBox
        x={x}
        y={y}
        w={1}
        d={0.45}
        h={2.4}
        topColor="#3a2415"
        leftColor="#23170D"
        rightColor="#160E07"
      />
      <IsoBox
        x={x + 0.04}
        y={y + 0.04}
        z={0.05}
        w={0.92}
        d={0.05}
        h={2.3}
        topColor="#0B0805"
        leftColor="#0B0805"
        rightColor="#0B0805"
        outline={false}
      />
      <pixiGraphics draw={drawBooks} />
    </pixiContainer>
  );
}
