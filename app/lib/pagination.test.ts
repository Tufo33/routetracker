import { calculateOffset } from "./pagination";

test("Seite 1 gibt Offset 0", () => {
    expect(calculateOffset(1)).toBe(0)
})

test("Seite 2 gibt Offset 10", () => {
    expect(calculateOffset(2)).toBe(10)
})

test("Seite 3 gibt Offset 20", () => {
    expect(calculateOffset(3)).toBe(20)
})