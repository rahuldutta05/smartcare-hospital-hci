# State Transition Network – Appointment Booking
```
Appointments --select patient/doctor/date--> Slot selection --choose slot--> Ready to book
Ready to book --Book--> Success (toast) --> Appointments list
Success --Undo--> Appointments list (booking removed)
Slot selection / Ready to book --change doctor--> Slot selection (slot reset)
Any state --leave page--> Previous page
Book with no slot --> Error feedback ("Select a time slot first.") --> Slot selection
Cancel flow: Row --Cancel--> Confirm dialog --Cancel--> Row (no change) | --Confirm--> Cancelled (Undo)
```
