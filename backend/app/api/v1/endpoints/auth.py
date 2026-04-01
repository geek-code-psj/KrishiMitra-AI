"""
KrishiMitra AI - Authentication Endpoints
Farmer authentication using OTP
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter()


class LoginRequest(BaseModel):
    phone: str = Field(..., pattern=r"^\d{10}$", description="10-digit phone number")


class VerifyOTPRequest(BaseModel):
    phone: str = Field(..., pattern=r"^\d{10}$")
    otp: str = Field(..., pattern=r"^\d{6}$", description="6-digit OTP")


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 86400


@router.post("/login")
async def login(request: LoginRequest):
    """
    Send OTP to farmer's phone number.
    """
    # Mock implementation - in production, integrate with SMS gateway
    return {
        "message": "OTP sent successfully",
        "phone": request.phone,
        "otp_expiry": 300,  # 5 minutes
    }


@router.post("/verify")
async def verify_otp(request: VerifyOTPRequest):
    """
    Verify OTP and return access token.
    """
    # Mock implementation
    if request.otp == "123456":  # Demo OTP
        return {
            "access_token": "mock_jwt_token_" + request.phone,
            "token_type": "bearer",
            "expires_in": 86400,
            "farmer_id": f"farmer_{request.phone}",
        }
    raise HTTPException(status_code=401, detail="Invalid OTP")


@router.post("/refresh")
async def refresh_token():
    """
    Refresh access token.
    """
    return {
        "access_token": "new_mock_jwt_token",
        "token_type": "bearer",
        "expires_in": 86400,
    }
