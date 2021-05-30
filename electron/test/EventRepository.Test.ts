import { all, save } from "../backend/repositories/EventRepository";

describe("EventRepository", () => {
    it("save", () => {
        const content = "An event's content";
        save(content);
        const allEvents = all();
        expect(allEvents).toBeDefined();
        expect(allEvents.length).toBe(1);
        
        const event = allEvents[0];
        expect(event).toBeDefined();
        expect(event.content).toBe(content);
    })
})