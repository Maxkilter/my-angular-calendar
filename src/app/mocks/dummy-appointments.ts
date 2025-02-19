import { Appointment } from '../models/appointment.model';

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentDate = new Date().getDate();

export const DUMMY_APPOINTMENTS: Appointment[] = [
  {
    uuid: 'd1f1a1b2-c3d4-4e5f-6a7b-8c9d0e1f2a3b',
    start: new Date(currentYear, currentMonth, currentDate, 9, 0).toISOString(),
    end: new Date(currentYear, currentMonth, currentDate, 10, 0).toISOString(),
    title: 'Strategy Session',
    color: 'rgba(205,147,113,0.4)',
    description:
      'An in-depth discussion with the leadership team to outline company objectives for the next quarter.',
  },
  {
    uuid: 'e2f3a4b5-c6d7-4e8f-9a0b-1c2d3e4f5a6b',
    start: new Date(currentYear, currentMonth, 2, 12, 0).toISOString(),
    end: new Date(currentYear, currentMonth, 2, 13, 0).toISOString(),
    title: 'Client Presentation',
    color: 'rgba(20,164,0,0.4)',
    description:
      'Presenting project proposals and deliverables to prospective clients to secure new business.',
  },
  {
    uuid: 'f3a4b5c6-d7e8-4f9a-0b1c-2d3e4f5a6b7c',
    start: new Date(currentYear, currentMonth, 3, 15, 0).toISOString(),
    end: new Date(currentYear, currentMonth, 3, 16, 0).toISOString(),
    title: 'Development Sprint',
    color: 'rgba(235,47,55,0.4)',
    description:
      'Kick-off meeting for the new sprint cycle to assign tasks and set deadlines with the dev team.',
  },
  {
    uuid: 'a4b5c6d7-e8f9-4a0b-1c2d-3e4f5a6b7c8d',
    start: new Date(
      currentYear,
      currentMonth,
      currentDate,
      10,
      0,
    ).toISOString(),
    end: new Date(currentYear, currentMonth, currentDate, 11, 0).toISOString(),
    title: 'Marketing Review',
    color: 'rgba(89,172,164,0.4)',
    description:
      'Evaluating current marketing campaigns and brainstorming new strategies with the marketing team.',
  },
  {
    uuid: 'b5c6d7e8-f9a0-4b1c-2d3e-4f5a6b7c8d9e',
    start: new Date(
      currentYear,
      currentMonth,
      currentDate + 1,
      14,
      0,
    ).toISOString(),
    end: new Date(
      currentYear,
      currentMonth,
      currentDate + 1,
      15,
      0,
    ).toISOString(),
    title: 'Team Sync',
    color: 'rgba(63,26,113,0.4)',
    description:
      'A general team meeting to align on project statuses and address any blockers.',
  },
  {
    uuid: 'c6d7e8f9-a0b1-4c2d-3e4f-5a6b7c8d9e0f',
    start: new Date(
      currentYear,
      currentMonth,
      currentDate,
      11,
      0,
    ).toISOString(),
    end: new Date(currentYear, currentMonth, currentDate, 12, 0).toISOString(),
    title: 'Product Demo',
    color: 'rgba(166, 113, 7, 0.4)',
    description:
      'Demonstrating the latest product features to stakeholders and gathering feedback.',
  },
  {
    uuid: 'd7e8f9a0-b1c2-4d3e-4f5a-6b7c8d9e0f1a',
    start: new Date(
      currentYear,
      currentMonth,
      currentDate + 4,
      9,
      30,
    ).toISOString(),
    end: new Date(
      currentYear,
      currentMonth,
      currentDate + 4,
      10,
      30,
    ).toISOString(),
    title: 'Sales Call',
    color: 'rgba(64,47,84,0.4)',
    description:
      'Call with potential clients to discuss service offerings and close deals.',
  },
  {
    uuid: 'e8f9a0b1-c2d3-4e4f-5a6b-7c8d9e0f1a2b',
    start: new Date(currentYear, currentMonth, 8, 17, 0).toISOString(),
    end: new Date(currentYear, currentMonth, 8, 18, 0).toISOString(),
    title: 'Fitness Session',
    color: 'rgba(254,187,199,0.4)',
    description: 'An evening workout session to unwind and stay healthy.',
  },
  {
    uuid: 'f9a0b1c2-d3e4-4f5a-6b7c-8d9e0f1a2b3c',
    start: new Date(
      currentYear,
      currentMonth,
      currentDate - 1,
      11,
      0,
    ).toISOString(),
    end: new Date(
      currentYear,
      currentMonth,
      currentDate - 1,
      12,
      0,
    ).toISOString(),
    title: 'Health Checkup',
    color: 'rgba(179,217,31,0.4)',
    description: 'Routine medical appointment for annual health screening.',
  },
  {
    uuid: 'a0b1c2d3-e4f5-4a6b-7c8d-9e0f1a2b3c4d',
    start: new Date(
      currentYear,
      currentMonth,
      currentDate - 2,
      19,
      0,
    ).toISOString(),
    end: new Date(
      currentYear,
      currentMonth,
      currentDate - 2,
      21,
      0,
    ).toISOString(),
    title: 'Celebration Event',
    color: 'rgba(124,60,67,0.4)',
    description: 'Company-wide celebration for reaching the quarterly targets.',
  },
  {
    uuid: 'b1c2d3e4-f5a6-4b7c-8d9e-0f1a2b3c4d5e',
    start: new Date(currentYear, currentMonth, 11, 13, 0).toISOString(),
    end: new Date(currentYear, currentMonth, 11, 14, 0).toISOString(),
    title: 'Industry Conference',
    color: 'rgba(139,39,239,0.4)',
    description:
      'Attending a conference to network and stay updated on industry trends.',
  },
  {
    uuid: 'c2d3e4f5-a6b7-4c8d-9e0f-1a2b3c4d5e6f',
    start: new Date(
      currentYear,
      currentMonth,
      currentDate,
      12,
      0,
    ).toISOString(),
    end: new Date(currentYear, currentMonth, currentDate, 14, 0).toISOString(),
    title: 'Skill Workshop',
    color: 'rgba(153,168,191,0.4)',
    description: 'Participating in a workshop to enhance professional skills.',
  },
  {
    uuid: 'd3e4f5a6-b7c8-4d9e-0f1a-2b3c4d5e6f7g',
    start: new Date(
      currentYear,
      currentMonth,
      currentDate + 1,
      11,
      0,
    ).toISOString(),
    end: new Date(
      currentYear,
      currentMonth,
      currentDate + 1,
      12,
      0,
    ).toISOString(),
    title: 'Brunch Meetup',
    color: 'rgba(69,89,101,0.4)',
    description: 'Casual meetup with colleagues to discuss ideas over brunch.',
  },
  {
    uuid: 'e4f5a6b7-c8d9-4e0f-1a2b-3c4d5e6f7g8h',
    start: new Date(
      currentYear,
      currentMonth,
      currentDate + 2,
      18,
      0,
    ).toISOString(),
    end: new Date(
      currentYear,
      currentMonth,
      currentDate + 2,
      20,
      0,
    ).toISOString(),
    title: 'Networking Mixer',
    color: 'rgba(126,226,220,0.4)',
    description:
      'An evening event to connect with professionals from the industry.',
  },
  {
    uuid: 'f5a6b7c8-d9e0-4f1a-2b3c-4d5e6f7g8h9i',
    start: new Date(currentYear, currentMonth, 16, 7, 0).toISOString(),
    end: new Date(currentYear, currentMonth, 16, 8, 0).toISOString(),
    title: 'Morning Yoga',
    color: 'rgba(64,220,65,0.4)',
    description:
      'Early morning yoga session to promote wellness and mindfulness.',
  },
  {
    uuid: 'a6b7c8d9-e0f1-4a2b-3c4d-5e6f7g8h9i0j',
    start: new Date(currentYear, currentMonth, 16, 10, 30).toISOString(),
    end: new Date(currentYear, currentMonth, 16, 12, 0).toISOString(),
    title: 'Business Strategy',
    color: 'rgba(84,71,190,0.4)',
    description: 'Formulating new business strategies to expand market reach.',
  },
  {
    uuid: 'b7c8d9e0-f1a2-4b3c-4d5e-6f7g8h9i0j1k',
    start: new Date(currentYear, currentMonth, 17, 14, 0).toISOString(),
    end: new Date(currentYear, currentMonth, 17, 15, 0).toISOString(),
    title: 'Investor Call',
    color: 'rgba(27,56,111,0.4)',
    description: 'Updating investors on company performance and future plans.',
  },
  {
    uuid: 'c8d9e0f1-a2b3-4c4d-5e6f-7g8h9i0j1k2l',
    start: new Date(currentYear, currentMonth, 18, 12, 0).toISOString(),
    end: new Date(currentYear, currentMonth, 18, 13, 0).toISOString(),
    title: 'Team Outing',
    color: 'rgba(139,221,227,0.4)',
    description: 'A casual outing to build team cohesion and morale.',
  },
  {
    uuid: 'd9e0f1a2-b3c4-4d5e-6f7g-8h9i0j1k2l3m',
    start: new Date(
      currentYear,
      currentMonth,
      currentDate + 3,
      16,
      0,
    ).toISOString(),
    end: new Date(
      currentYear,
      currentMonth,
      currentDate + 3,
      17,
      0,
    ).toISOString(),
    title: 'HR Discussion',
    color: 'rgba(162,105,128,0.4)',
    description:
      'Meeting with HR to discuss staffing needs and policy updates.',
  },
  {
    uuid: 'e0f1a2b3-c4d5-4e6f-7g8h-9i0j1k2l3m4n',
    start: new Date(currentYear, currentMonth, 21, 11, 0).toISOString(),
    end: new Date(currentYear, currentMonth, 21, 12, 0).toISOString(),
    title: 'Executive Meeting',
    color: 'rgba(41,84,208,0.4)',
    description:
      'High-level meeting with executives to review overall company performance.',
  },
];
