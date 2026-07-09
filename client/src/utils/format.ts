import { type Bill } from "../types.js";


export function formatDueDate(event: Bill): string {
  if (event.recurrence === "once" && event.dueDate) {
    const fullDate = new Date(event.dueDate).toDateString();
    const [month, day, year] = fullDate.split(" ").slice(1, 4);
    return `Due on ${month} ${day}, ${year}`;
  }
  if (event.recurrence === "monthly" && event.dueDayOfMonth) {
    const dayNumber = event.dueDayOfMonth;
    let suffix = "th";
    if (dayNumber === 1) suffix = "st";
    if (dayNumber === 2) suffix = "nd";
    if (dayNumber === 3) suffix = "rd";
    return `Due on the ${event.dueDayOfMonth}${suffix}`;
  }
  if (event.recurrence === "yearly" && event.dueDayOfMonth && event.dueMonth) {
    const months = [ "January","February","March","April","May","June",
      "July", "August","September","October", "November","December"];
    return `Due on ${months[event.dueMonth - 1]} ${event.dueDayOfMonth}`;
  }
  return "";
}


const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatCurrency(amount?: string): string {
  if (!amount) return "Unknown";
  return currencyFormatter.format(parseFloat(amount));
}