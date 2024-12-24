from fastapi import APIRouter, Depends, HTTPException
from typing import List
from ..models.exercise import Exercise, ExerciseCreate
from firebase_admin import firestore
from ..middleware.auth import get_current_user

router = APIRouter()
db = firestore.client()

@router.post("/", response_model=Exercise)
async def create_exercise(
    exercise: ExerciseCreate,
    current_user: dict = Depends(get_current_user)
):
    exercise_dict = exercise.dict()
    exercise_dict["user_id"] = current_user["uid"]
    exercise_dict["created_at"] = firestore.SERVER_TIMESTAMP
    
    doc_ref = db.collection("exercises").document()
    doc_ref.set(exercise_dict)
    
    created_exercise = Exercise(
        id=doc_ref.id,
        **exercise_dict
    )
    return created_exercise

@router.get("/", response_model=List[Exercise])
async def get_exercises(current_user: dict = Depends(get_current_user)):
    exercises_ref = db.collection("exercises")
    query = exercises_ref.where("user_id", "==", current_user["uid"])
    exercises = []
    
    for doc in query.stream():
        exercise_data = doc.to_dict()
        exercise_data["id"] = doc.id
        exercises.append(Exercise(**exercise_data))
    
    return exercises 