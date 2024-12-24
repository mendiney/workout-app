from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, exercises, workouts, sessions

app = FastAPI(title="Gym Tracker API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(exercises.router, prefix="/api/exercises", tags=["Exercises"])
app.include_router(workouts.router, prefix="/api/workouts", tags=["Workouts"])
app.include_router(sessions.router, prefix="/api/sessions", tags=["Sessions"])

@app.get("/")
async def root():
    return {"message": "Welcome to Gym Tracker API"} 