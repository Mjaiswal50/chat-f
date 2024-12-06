import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeOnly'
})
export class TimeOnlyPipe implements PipeTransform {
  transform(value: string | Date | null): string {
    if (!value) return '';

    // Convert input to a Date object
    const date = value instanceof Date ? value : new Date(value);

    // Validate if the conversion to Date was successful
    if (isNaN(date.getTime())) return '';

    // Extract and return the time portion with AM/PM
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }
}
