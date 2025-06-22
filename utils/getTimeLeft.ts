function getTimeLeft(targetDate: Date): [number, number] {
  const today = new Date();
  const targetDateObject = new Date(targetDate);
  const timeDifference = targetDateObject.getTime() - today.getTime();

  // Calculate days left
  const daysLeft = Math.floor(timeDifference / (1000 * 3600 * 24));

  // Calculate months left
  const yearsLeft = targetDateObject.getFullYear() - today.getFullYear();
  const monthsLeft =
    targetDateObject.getMonth() - today.getMonth() + yearsLeft * 12;

  return [daysLeft, monthsLeft];
}

export { getTimeLeft };
