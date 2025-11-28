from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import shutil
import os
import uuid
from gtts import gTTS
from moviepy import VideoFileClip
from dotenv import load_dotenv

# Load env vars immediately
load_dotenv()

import models.models as models
import schemas.schemas as schemas
from databases.database import engine, get_db

app = FastAPI()

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-keep-it-secret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
os.makedirs("uploads", exist_ok=True)
os.makedirs("outputs", exist_ok=True)

# --- File Cleanup ---
def cleanup_old_files(db: Session):
    """Delete files older than 72 hours"""
    from datetime import datetime, timedelta
    cutoff_time = datetime.utcnow() - timedelta(hours=72)
    
    # Find old files in database
    old_files = db.query(models.MediaFile).filter(models.MediaFile.created_at < cutoff_time).all()
    
    for file_record in old_files:
        # Delete physical file
        file_path = os.path.join("outputs", file_record.filename)
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
                print(f"Deleted old file: {file_record.filename}")
            except Exception as e:
                print(f"Error deleting {file_record.filename}: {e}")
        
        # Delete database record
        db.delete(file_record)
    
    db.commit()
    print(f"Cleanup complete: Removed {len(old_files)} old files")

@app.on_event("startup")
async def startup_event():
    """Create tables and run cleanup on startup"""
    try:
        # Create tables if they don't exist
        models.Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"⚠️ Warning: Could not create database tables: {e}")
        print("This is expected if the database is not available during testing.")
    
    # Run cleanup
    db = next(get_db())
    try:
        cleanup_old_files(db)
    finally:
        db.close()

# --- Auth Helpers ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

# --- Routes ---

@app.get("/")
def read_root():
    return {"message": "Media Converter API is running"}

@app.post("/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/my-files")
async def get_my_files(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get list of all files owned by current user"""
    files = db.query(models.MediaFile).filter(
        models.MediaFile.user_id == current_user.id
    ).order_by(models.MediaFile.created_at.desc()).all()
    
    return {
        "total": len(files),
        "files": [
            {
                "filename": f.filename,
                "original_name": f.original_name,
                "file_type": f.file_type,
                "file_size": f.file_size,
                "created_at": f.created_at.isoformat(),
                "download_url": f"http://localhost:8000/download/{f.filename}"
            }
            for f in files
        ]
    }

@app.post("/convert/text-to-audio")
async def convert_text_to_audio(
    request: schemas.TextRequest, 
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        tts = gTTS(text=request.text, lang=request.language)
        filename = f"{uuid.uuid4()}.mp3"
        filepath = os.path.join("outputs", filename)
        tts.save(filepath)
        
        # Get file size
        file_size = os.path.getsize(filepath)
        
        # Create database record
        media_file = models.MediaFile(
            filename=filename,
            original_name="text_conversion",
            file_type="text_to_audio",
            file_size=file_size,
            user_id=current_user.id
        )
        db.add(media_file)
        db.commit()
        
        return {"url": f"http://localhost:8000/download/{filename}", "filename": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/convert/video-to-audio")
async def convert_video_to_audio(
    file: UploadFile = File(...), 
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        input_filename = f"{uuid.uuid4()}_{file.filename}"
        input_path = os.path.join("uploads", input_filename)
        
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        output_filename = f"{uuid.uuid4()}.mp3"
        output_path = os.path.join("outputs", output_filename)
        
        # Convert
        video = VideoFileClip(input_path)
        if video.audio is None:
             raise HTTPException(status_code=400, detail="Video has no audio track")
        
        video.audio.write_audiofile(output_path)
        video.close()
        
        # Cleanup input
        os.remove(input_path)
        
        # Get file size
        file_size = os.path.getsize(output_path)
        
        # Create database record
        media_file = models.MediaFile(
            filename=output_filename,
            original_name=file.filename,
            file_type="video_to_audio",
            file_size=file_size,
            user_id=current_user.id
        )
        db.add(media_file)
        db.commit()
        
        return {"url": f"http://localhost:8000/download/{output_filename}", "filename": output_filename}
    except Exception as e:
        # Cleanup if failed
        if 'input_path' in locals() and os.path.exists(input_path):
            os.remove(input_path)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download/{filename}")
async def download_file(
    filename: str,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Check if file exists in database and belongs to current user
    media_file = db.query(models.MediaFile).filter(
        models.MediaFile.filename == filename,
        models.MediaFile.user_id == current_user.id
    ).first()
    
    if not media_file:
        raise HTTPException(status_code=404, detail="File not found or access denied")
    
    file_path = os.path.join("outputs", filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="audio/mpeg", filename=filename)
    else:
        # File missing from disk but exists in DB - clean up DB record
        db.delete(media_file)
        db.commit()
        raise HTTPException(status_code=404, detail="File not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
