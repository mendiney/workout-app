from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class WorkoutBase(BaseModel):
    name: str
    description: Optional[str] = None
    exercise_ids: List[str]

class WorkoutCreate(WorkoutBase):
    pass

class Workout(WorkoutBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True 