from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# This creates a file named "clinic.db" in your folder to store the data
SQLALCHEMY_DATABASE_URL = "sqlite:///./clinic.db"

# This is the "engine" that connects Python to the database file
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# This creates a "session" (a temporary connection to save or read data)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This is the base class that our database tables will use
Base = declarative_base()