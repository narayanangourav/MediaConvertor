from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from databases.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    # Relationship to media files
    media_files = relationship("MediaFile", back_populates="owner", cascade="all, delete-orphan")

class MediaFile(Base):
    __tablename__ = "media_files"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    original_name = Column(String)  # For video files, store original filename
    file_type = Column(String)  # 'text_to_audio' or 'video_to_audio'
    file_size = Column(Integer)  # Size in bytes
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationship back to user
    owner = relationship("User", back_populates="media_files")
