"""CodeBhavya mathematics case study: shuttle timetable and capacity."""

from dataclasses import dataclass
from math import ceil


@dataclass(frozen=True)
class RouteLeg:
    name: str
    distance_km: float
    speed_kmph: float

    def __post_init__(self) -> None:
        if self.distance_km <= 0 or self.speed_kmph <= 0:
            raise ValueError("distance and speed must be positive")

    @property
    def travel_minutes(self) -> float:
        return self.distance_km / self.speed_kmph * 60


def route_summary(legs: list[RouteLeg], dwell_minutes: float) -> dict[str, float]:
    if not legs or dwell_minutes < 0:
        raise ValueError("route requires legs and non-negative dwell time")
    distance = sum(leg.distance_km for leg in legs)
    moving_minutes = sum(leg.travel_minutes for leg in legs)
    elapsed_minutes = moving_minutes + dwell_minutes
    return {
        "distance": distance,
        "moving_minutes": moving_minutes,
        "elapsed_minutes": elapsed_minutes,
        "moving_average_speed": distance / (moving_minutes / 60),
        "overall_average_speed": distance / (elapsed_minutes / 60),
    }


def format_clock(total_minutes: int) -> str:
    total_minutes %= 24 * 60
    hours, minutes = divmod(total_minutes, 60)
    return f"{hours:02d}:{minutes:02d}"


def departure_times(start_minutes: int, interval: int,
                    number_of_trips: int) -> list[str]:
    if interval <= 0 or number_of_trips <= 0:
        raise ValueError("interval and trip count must be positive")
    return [
        format_clock(start_minutes + trip * interval)
        for trip in range(number_of_trips)
    ]


def distribute_by_ratio(total: int, ratio: list[int]) -> list[int]:
    if total < 0 or not ratio or any(part <= 0 for part in ratio):
        raise ValueError("total and ratio parts must be valid")
    exact = [total * part / sum(ratio) for part in ratio]
    result = [int(value) for value in exact]
    remainder = total - sum(result)
    order = sorted(
        range(len(ratio)),
        key=lambda index: exact[index] - result[index],
        reverse=True,
    )
    for index in order[:remainder]:
        result[index] += 1
    return result


def main() -> None:
    route = [
        RouteLeg("Main Gate → Library", 2.4, 24),
        RouteLeg("Library → CSE Block", 1.5, 18),
        RouteLeg("CSE Block → Hostel", 3.0, 30),
    ]
    summary = route_summary(route, dwell_minutes=8)
    departures = departure_times(8 * 60, interval=20, number_of_trips=10)

    expected_passengers = 420
    seats_per_trip = 48
    required_trips = ceil(expected_passengers / seats_per_trip)
    occupancy = expected_passengers / (len(departures) * seats_per_trip) * 100
    passenger_windows = distribute_by_ratio(expected_passengers, [3, 4, 2, 1])

    print("CodeBhavya Campus Shuttle Timetable & Capacity Planner")
    print("\nRoute legs")
    for leg in route:
        print(
            f"{leg.name:<28} {leg.distance_km:>4.1f} km at "
            f"{leg.speed_kmph:>4.1f} km/h = {leg.travel_minutes:>5.1f} min"
        )
    print(f"\nTotal distance            : {summary['distance']:.1f} km")
    print(f"Moving time               : {summary['moving_minutes']:.1f} min")
    print(f"Elapsed time incl. stops  : {summary['elapsed_minutes']:.1f} min")
    print(f"Moving average speed      : {summary['moving_average_speed']:.2f} km/h")
    print(f"Overall average speed     : {summary['overall_average_speed']:.2f} km/h")
    print(f"\nDepartures (AP, d=20 min) : {', '.join(departures)}")
    print(f"Minimum trips for demand  : {required_trips}")
    print(f"Planned occupancy         : {occupancy:.2f}%")
    print("Passengers by time-window ratio 3:4:2:1:")
    for label, passengers in zip(
        ("08–09", "09–10", "10–11", "11–12"), passenger_windows
    ):
        print(f"  {label}: {passengers}")


if __name__ == "__main__":
    main()
