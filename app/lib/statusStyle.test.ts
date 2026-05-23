import { getStatusStyle } from "./statusStyle";

test("unterwegs", () => {
    expect(getStatusStyle("unterwegs")).toBe('bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm')
})

test("geplant", () => {
    expect(getStatusStyle("geplant")).toBe('bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm')
})

test("abgeschlossen", () => {
    expect(getStatusStyle("abgeschlossen")).toBe('bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm')
})