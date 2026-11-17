/**
 * 🚂 Indian Railway PNR Status System
 *
 * IRCTC ka PNR status system bana! PNR data milega with train info,
 * passengers, aur current statuses. Tujhe ek complete status report
 * generate karna hai with formatted output aur analytics.
 *
 * pnrData object:
 *   {
 *     pnr: "1234567890",
 *     train: { number: "12301", name: "Rajdhani Express", from: "NDLS", to: "HWH" },
 *     classBooked: "3A",
 *     passengers: [
 *       { name: "Rahul Kumar", age: 28, gender: "M", booking: "B1", current: "B1" },
 *       { name: "Priya Sharma", age: 25, gender: "F", booking: "WL5", current: "B3" },
 *       { name: "Amit Singh", age: 60, gender: "M", booking: "WL12", current: "WL8" }
 *     ]
 *   }
 *
 * Status rules (based on current field):
 *   - Starts with "B" or "S" (berth/seat) => status = "CONFIRMED"
 *   - Starts with "WL" => status = "WAITING"
 *   - Equals "CAN" => status = "CANCELLED"
 *   - Starts with "RAC" => status = "RAC"
 *
 * For each passenger generate:
 *   - formattedName: name.padEnd(20) + "(" + age + "/" + gender + ")"
 *   - bookingStatus: booking field value
 *   - currentStatus: current field value
 *   - statusLabel: one of "CONFIRMED", "WAITING", "CANCELLED", "RAC"
 *   - isConfirmed: boolean (true only if statusLabel === "CONFIRMED")
 *
 * Summary (use array methods on processed passengers):
 *   - totalPassengers: count of passengers
 *   - confirmed: count of CONFIRMED
 *   - waiting: count of WAITING
 *   - cancelled: count of CANCELLED
 *   - rac: count of RAC
 *   - allConfirmed: boolean - every passenger confirmed? (use every)
 *   - anyWaiting: boolean - some passenger waiting? (use some)
 *
 * Other fields:
 *   - chartPrepared: true if every NON-CANCELLED passenger is confirmed
 *   - pnrFormatted: "123-456-7890" (3-3-4 dash pattern, use slice + join or concatenation)
 *   - trainInfo: template literal =>
 *     "Train: {number} - {name} | {from} → {to} | Class: {classBooked}"
 *
 * Hint: Use padEnd(), slice(), join(), map(), filter(), every(), some(),
 *   startsWith(), template literals, typeof, Array.isArray()
 *
 * Validation:
 *   - Agar pnrData object nahi hai ya null hai, return null
 *   - Agar pnr string nahi hai ya exactly 10 digits nahi hai, return null
 *   - Agar train object missing hai, return null
 *   - Agar passengers array nahi hai ya empty hai, return null
 *
 * @param {object} pnrData - PNR data object
 * @returns {{ pnrFormatted: string, trainInfo: string, passengers: Array<{ formattedName: string, bookingStatus: string, currentStatus: string, statusLabel: string, isConfirmed: boolean }>, summary: { totalPassengers: number, confirmed: number, waiting: number, cancelled: number, rac: number, allConfirmed: boolean, anyWaiting: boolean }, chartPrepared: boolean } | null}
 * 
 * @example
 *   processRailwayPNR({
 *     pnr: "1234567890",
 *     train: { number: "12301", name: "Rajdhani Express", from: "NDLS", to: "HWH" },
 *     classBooked: "3A",
 *     passengers: [
 *       { name: "Rahul", age: 28, gender: "M", booking: "B1", current: "B1" }
 *     ]
 *   })
 *   // => { pnrFormatted: "123-456-7890",
 *   //      trainInfo: "Train: 12301 - Rajdhani Express | NDLS → HWH | Class: 3A",
 *   //      passengers: [...], summary: { ..., allConfirmed: true }, chartPrepared: true }
 */
export function processRailwayPNR(pnrData) {
    if (pnrData === null || Array.isArray(pnrData) || typeof pnrData !== "object") return null;
    if (
        typeof pnrData.pnr !== "string" ||
        pnrData.pnr.trim() === "" ||
        pnrData.pnr.trim().length !== 10 ||
        !/^\d+$/.test(pnrData.pnr)
    )
        return null;

    if (pnrData.train === null || Array.isArray(pnrData.train) || typeof pnrData.train !== "object")
        return null;

    if (!Array.isArray(pnrData.passengers) || pnrData.passengers.length === 0) return null;
    const validPassengers = pnrData.passengers.filter(
        (passenger) =>
            passenger.name?.trim() !== "" &&
            Number.isFinite(passenger.age) &&
            passenger.age > 0 &&
            passenger.age < 100 &&
            (passenger.gender?.trim().toUpperCase() === "M" ||
                passenger.gender?.trim().toUpperCase() === "F") &&
            passenger.booking?.trim() !== "" &&
            passenger.current?.trim() !== "",
    );

    const pnrNumber = pnrData["pnr"].trim();
    const partOne = pnrNumber.slice(0, 3);
    const partTwo = pnrNumber.slice(3, 6);
    const partThree = pnrNumber.slice(6);

    const pnrFormatted = `${partOne}-${partTwo}-${partThree}`;

    const trainInfo = `Train: ${pnrData.train.number} - ${pnrData.train.name?.trim()} | ${pnrData.train?.from} → ${pnrData.train?.to} | Class: ${pnrData.classBooked}`;

    const passengers = validPassengers.map((passenger) => {
        const formattedName =
            passenger.name
                .trim()
                .replace(/\s+/g, " ")
                .toLowerCase()
                .replace(/(^|\s)\p{L}/gu, (char) => char.toUpperCase())
                .padEnd(20) +
            "(" +
            passenger.age +
            "/" +
            passenger.gender +
            ")";

        let statusLabel = "";

        if (passenger.current.startsWith("B") || passenger.current.startsWith("S")) {
            statusLabel = "CONFIRMED";
        } else if (passenger.current.startsWith("WL")) {
            statusLabel = "WAITING";
        } else if (passenger.current.startsWith("CAN")) {
            statusLabel = "CANCELLED";
        } else if (passenger.current.startsWith("RAC")) {
            statusLabel = "RAC";
        }

        return {
            formattedName,
            bookingStatus: passenger.booking,
            currentStatus: passenger.current,
            statusLabel: statusLabel,
            isConfirmed: statusLabel === "CONFIRMED",
        };
    });

    const bookingStatus = passengers.reduce((obj, passenger) => {
        if (passenger.statusLabel !== undefined) {
            obj[passenger.statusLabel.toLowerCase()] =
                (obj[passenger.statusLabel.toLowerCase()] || 0) + 1;
        }
        return obj;
    }, {});

    const summary = {
        totalPassengers: passengers.length,
        confirmed: bookingStatus.confirmed || 0,
        waiting: bookingStatus.waiting || 0,
        cancelled: bookingStatus.cancelled || 0,
        rac: bookingStatus.rac || 0,
        allConfirmed: passengers.every((passenger) => passenger.isConfirmed),
        anyWaiting: passengers.some((passenger) => passenger.statusLabel === "WAITING"),
    };

    const chartPrepared = passengers
        .filter((passenger) => passenger.statusLabel !== "CANCELLED")
        .every((passenger) => passenger.statusLabel === "CONFIRMED");

    return {
        pnrFormatted,
        trainInfo,
        passengers,
        summary,
        chartPrepared,
    };
}
