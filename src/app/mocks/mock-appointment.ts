import { Appointment } from "../models/appointment.model";

export const mockAppointment: Appointment = {
  uuid: "test-uuid",
  title: "Test Event",
  start: "2025-02-18T09:00:00.000Z",
  end: "2025-02-18T11:00:00.000Z",
  description: "desc",
  color: "rgba(0,0,0,0.4)",
};
