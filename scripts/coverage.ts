import { getBirthdayData } from '../src/data/birthdays';

const DAYS_IN_MONTHS = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

interface MonthStat {
  month: number;
  totalDays: number;
  coveredDays: number;
  totalPeople: number;
  eventDays: number;
  totalEvents: number;
  emptyDays: number[];
}

function formatRanges(days: number[]): string {
  if (days.length === 0) return '(không có)';
  const ranges: string[] = [];
  let start = days[0];
  let end = days[0];

  for (let i = 1; i < days.length; i++) {
    if (days[i] === end + 1) {
      end = days[i];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = days[i];
      end = days[i];
    }
  }
  ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges.join(', ');
}

function main() {
  const stats: MonthStat[] = [];
  let totalCoveredDays = 0;
  let totalPeople = 0;
  let totalEventDays = 0;
  let totalEvents = 0;
  const totalDaysInYear = 366;

  for (let m = 1; m <= 12; m++) {
    const daysInMonth = DAYS_IN_MONTHS[m - 1];
    let coveredDays = 0;
    let mPeople = 0;
    let eventDays = 0;
    let mEvents = 0;
    const emptyDays: number[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const data = getBirthdayData(m, d);
      const pCount = data.all.length;
      const eCount = data.events.length;

      if (pCount > 0) {
        coveredDays++;
        mPeople += pCount;
      } else {
        emptyDays.push(d);
      }

      if (eCount > 0) {
        eventDays++;
        mEvents += eCount;
      }
    }

    totalCoveredDays += coveredDays;
    totalPeople += mPeople;
    totalEventDays += eventDays;
    totalEvents += mEvents;

    stats.push({
      month: m,
      totalDays: daysInMonth,
      coveredDays,
      totalPeople: mPeople,
      eventDays,
      totalEvents: mEvents,
      emptyDays,
    });
  }

  console.log('========================================================================================');
  console.log('BIRTHDAYVERSE — BÁO CÁO ĐỘ PHỦ DỮ LIỆU (366 NGÀY)');
  console.log('========================================================================================\n');

  console.log('| Tháng    | Ngày có người | Tổng người | Ngày có sự kiện | Tổng sự kiện | Độ phủ (%) |');
  console.log('|----------|---------------|------------|-----------------|--------------|------------|');

  for (const s of stats) {
    const mm = s.month.toString().padStart(2, '0');
    const pDays = `${s.coveredDays}/${s.totalDays}`.padEnd(13, ' ');
    const pCount = s.totalPeople.toString().padEnd(10, ' ');
    const eDays = `${s.eventDays}/${s.totalDays}`.padEnd(15, ' ');
    const eCount = s.totalEvents.toString().padEnd(12, ' ');
    const pct = `${((s.coveredDays / s.totalDays) * 100).toFixed(1)}%`.padEnd(10, ' ');

    console.log(`| Tháng ${mm} | ${pDays} | ${pCount} | ${eDays} | ${eCount} | ${pct} |`);
  }

  console.log('|----------|---------------|------------|-----------------|--------------|------------|');
  const sumDays = `${totalCoveredDays}/${totalDaysInYear}`.padEnd(13, ' ');
  const sumPeople = totalPeople.toString().padEnd(10, ' ');
  const sumEDays = `${totalEventDays}/${totalDaysInYear}`.padEnd(15, ' ');
  const sumEvents = totalEvents.toString().padEnd(12, ' ');
  const sumPct = `${((totalCoveredDays / totalDaysInYear) * 100).toFixed(1)}%`.padEnd(10, ' ');
  console.log(`| TỔNG CỘNG| ${sumDays} | ${sumPeople} | ${sumEDays} | ${sumEvents} | ${sumPct} |`);

  console.log('\n========================================================================================');
  console.log('DANH SÁCH NGÀY TRỐNG THEO THÁNG:');
  console.log('========================================================================================');
  for (const s of stats) {
    const mm = s.month.toString().padStart(2, '0');
    const emptyCount = s.emptyDays.length;
    const ranges = formatRanges(s.emptyDays);
    console.log(`- Tháng ${mm} (${emptyCount}/${s.totalDays} ngày trống): ${ranges}`);
  }
  console.log('========================================================================================\n');
}

main();
