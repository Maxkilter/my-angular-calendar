import { TestBed } from "@angular/core/testing";
import { AppointmentsService } from "./appointments.service";
import { Appointment } from "../models/appointment.model";
import { DUMMY_APPOINTMENTS } from "../mocks/dummy-appointments";

describe("AppointmentsService", () => {
  let service: AppointmentsService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [AppointmentsService],
    });
    service = TestBed.inject(AppointmentsService);
  });

  it("should be created and initialize with dummy appointments if no stored events exist", () => {
    const events = service.events();
    expect(events).toEqual(DUMMY_APPOINTMENTS);
  });

  describe("addEvent", () => {
    it("should add a new event and persist it to localStorage", () => {
      spyOn(localStorage, "setItem");

      const initialLength = service.events().length;
      const newEventData = {
        title: "Test Event",
        start: "2025-02-18T09:00:00.000Z",
        end: "2025-02-18T10:00:00.000Z",
        description: "Test description",
      };

      service.addEvent(newEventData);
      const events = service.events();
      expect(events.length).toBe(initialLength + 1);

      const addedEvent = events.find((e) => e.title === "Test Event");
      expect(addedEvent).toBeDefined();
      expect(addedEvent!.uuid).toBeDefined();
      expect(addedEvent!.color).toMatch(/rgba\(\d+,\d+,\d+,\d*\.?\d+\)/);

      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe("updateEvent", () => {
    it("should update an existing event and persist changes", () => {
      const eventToUpdate = service.events()[0];
      const updatedData: Appointment = {
        uuid: eventToUpdate.uuid,
        title: "Updated Title",
        start: eventToUpdate.start,
        end: eventToUpdate.end,
        description: "Updated Description",
        color: eventToUpdate.color,
      };

      spyOn(localStorage, "setItem");
      service.updateEvent(updatedData);

      const updatedEvent = service
        .events()
        .find((e) => e.uuid === eventToUpdate.uuid);
      expect(updatedEvent).toBeDefined();
      expect(updatedEvent!.title).toBe("Updated Title");
      expect(updatedEvent!.description).toBe("Updated Description");
      expect(updatedEvent!.color).toBe(eventToUpdate.color);

      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe("removeEvent", () => {
    it("should remove an event by uuid and persist the changes", () => {
      spyOn(localStorage, "setItem");
      const initialLength = service.events().length;
      const eventToRemove = service.events()[0];

      service.removeEvent(eventToRemove.uuid);
      const events = service.events();
      expect(events.length).toBe(initialLength - 1);
      expect(events.find((e) => e.uuid === eventToRemove.uuid)).toBeUndefined();

      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });

  describe("localStorage initialization", () => {
    it("should load events from localStorage if available", () => {
      localStorage.setItem(
        "appointments",
        JSON.stringify([DUMMY_APPOINTMENTS[0]]),
      );

      // Reset and reinitialize the testing module to simulate a new app instance.
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [AppointmentsService],
      });
      const newService = TestBed.inject(AppointmentsService);

      expect(newService.events()).toEqual([DUMMY_APPOINTMENTS[0]]);
    });
  });
});
