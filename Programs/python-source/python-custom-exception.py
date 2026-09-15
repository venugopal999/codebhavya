class AttendanceError(Exception):
    pass

try:
    raise AttendanceError('Attendance is below 75%')
except AttendanceError as error:
    print(error)
