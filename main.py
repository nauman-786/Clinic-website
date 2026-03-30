from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Import our local files
import models
import schemas
from database import engine, SessionLocal

# This line officially creates the database and the tables in clinic.db
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# --- CORS Middleware Setup ---
# This acts as the bouncer, allowing your future frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows any frontend address to connect for now
    allow_credentials=True,
    allow_methods=["*"], # Allows GET, POST, etc.
    allow_headers=["*"],
)

# --- Database Helper Function ---
# Opens a temporary session to the database and closes it when we are done
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Routes (The API Endpoints) ---

@app.get("/")
def home():
    return {"message": "Welcome to the Khattak Clinic Server! Database is connected."}

# Route to receive data from the patient and save it
@app.post("/book-appointment")
def create_appointment(appointment: schemas.AppointmentBooking, db: Session = Depends(get_db)):
    
    # 1. Package the incoming patient data into our database format
    new_db_appointment = models.DBAppointment(
        patient_name=appointment.patient_name,
        phone_number=appointment.phone_number,
        service_type=appointment.service_type,
        doctor_name=appointment.doctor_name,
        appointment_date=appointment.appointment_date
    )
    
    # 2. Add it to the database
    db.add(new_db_appointment)
    
    # 3. Save (commit) the changes permanently
    db.commit()
    db.refresh(new_db_appointment) # Refreshes to get the auto-generated ID
    
    return {
        "status": "Success", 
        "message": "Appointment Saved to Database!", 
        "appointment_id": new_db_appointment.id
    }

# Route for the clinic receptionist to see all bookings
@app.get("/appointments")
def get_all_appointments(db: Session = Depends(get_db)):
    
    # Tell the database to look inside the DBAppointment table and grab everything
    all_appointments = db.query(models.DBAppointment).all()
    
    return {"appointments": all_appointments}
# Route to cancel/delete an appointment
@app.delete("/appointments/{appointment_id}")
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    
    # 1. Ask the database to find the specific appointment by its ID
    appointment_to_delete = db.query(models.DBAppointment).filter(models.DBAppointment.id == appointment_id).first()
    
    # 2. If it doesn't exist, tell the frontend there was an error
    if not appointment_to_delete:
        return {"status": "Error", "message": "Appointment not found"}
    
    # 3. If it does exist, delete it and save the changes
    db.delete(appointment_to_delete)
    db.commit()
    
    return {"status": "Success", "message": "Appointment cancelled successfully!"}    