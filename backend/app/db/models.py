from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    trips = relationship("SavedTrip", back_populates="owner")

class SavedTrip(Base):
    __tablename__ = "saved_trips"
    id = Column(Integer, primary_key=True, index=True)
    destination = Column(String, index=True)
    data = Column(JSON)  # Stores the full itinerary object
    user_id = Column(Integer, ForeignKey("users.id"))
    
    owner = relationship("User", back_populates="trips")