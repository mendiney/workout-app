from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ExerciseBase(BaseModel):
    name: str
    muscle_group: str
    description: Optional[str] = None

class ExerciseCreate(ExerciseBase):
    pass

class Exercise(ExerciseBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True 