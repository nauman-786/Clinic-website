# We import a tool called Pydantic to check our data
from pydantic import BaseModel

# This is the exact "form" a patient must fill out
class AppointmentBooking(BaseModel):
    patient_name: str     # 'str' means it must be text
    phone_number: str
    service_type: str     # e.g., "Dental" or "Dermatology"
    doctor_name: str
    appointment_date: str
    