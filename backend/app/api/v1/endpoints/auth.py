from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
import os
import uuid

from app.core.security import verify_password, get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.schemas.auth import Token
from app.db.database import get_db
from app.db.models import User

router = APIRouter()

# Ensure the upload directory exists
os.makedirs("static/profiles", exist_ok=True)

@router.post("/signup", response_model=Token)
async def sign_up(
    username: str = Form(...),
    password: str = Form(...),
    full_name: str = Form(None),
    email: str = Form(None),
    mobile_number: str = Form(None),
    profile_picture: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(User.username == username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = get_password_hash(password)
    
    # Handle image upload if provided
    profile_picture_url = None
    if profile_picture and profile_picture.filename:
        ext = profile_picture.filename.split('.')[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        filepath = f"static/profiles/{filename}"
        with open(filepath, "wb") as f:
            f.write(await profile_picture.read())
        profile_picture_url = f"/static/profiles/{filename}"
    
    # Create the user with all fields
    new_user = User(
        username=username, 
        hashed_password=hashed_password,
        full_name=full_name,
        email=email,
        mobile_number=mobile_number,
        profile_picture_url=profile_picture_url
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = create_access_token(
        data={"sub": new_user.username}, 
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer", "username": new_user.username}

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == form_data.username).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    if not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
        
    access_token = create_access_token(
        data={"sub": db_user.username}, 
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer", "username": db_user.username}