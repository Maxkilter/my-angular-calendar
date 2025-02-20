import { Routes } from "@angular/router";
import { CalendarComponent } from "./calendar/calendar.component";

export const routes: Routes = [
  { path: "", redirectTo: "/month", pathMatch: "full" },
  {
    path: "",
    component: CalendarComponent,
    children: [
      {
        path: "month",
        loadComponent: () =>
          import("./calendar/month-view/month-view.component").then(
            (m) => m.MonthViewComponent,
          ),
      },
      {
        path: "week",
        loadComponent: () =>
          import("./calendar/week-view/week-view.component").then(
            (m) => m.WeekViewComponent,
          ),
      },
      {
        path: "day",
        loadComponent: () =>
          import("./calendar/day-view/day-view.component").then(
            (m) => m.DayViewComponent,
          ),
      },
    ],
  },
  { path: "**", redirectTo: "/month" },
];
