from sqlalchemy import Column, Integer, String
from database import Base

# This defines the exact columns our database table will have
class DBAppointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True) # Every patient gets a unique ID
    patient_name = Column(String)
    phone_number = Column(String)
    service_type = Column(String)
    doctor_name = Column(String)
    appointment_date = Column(String)