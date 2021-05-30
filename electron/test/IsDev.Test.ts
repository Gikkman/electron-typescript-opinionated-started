import { IsDev } from "../shared/IsDev";

describe("IsDev", () => {
    it("is dev", () => {
        expect(IsDev).toBe(true);
    })
})