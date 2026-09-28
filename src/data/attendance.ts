/** Classes run Monday–Saturday. Sunday is a free day (neutral in the calendar). */
export const isClassDay = (d: Date) => d.getDay() !== 0
