import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function WorkoutSession({ workout }) {
  const [exercises, setExercises] = useState([]);
  const [currentSet, setCurrentSet] = useState({});
  const { currentUser } = useAuth();

  useEffect(() => {
    if (workout) {
      setExercises(workout.exercises.map(exercise => ({
        ...exercise,
        sets: []
      })));
    }
  }, [workout]);

  const handleSetComplete = async (exerciseIndex, weight, reps) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.push({ weight, reps });
    setExercises(newExercises);

    try {
      await addDoc(collection(db, 'sets'), {
        userId: currentUser.uid,
        workoutId: workout.id,
        exerciseId: exercises[exerciseIndex].id,
        weight,
        reps,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error saving set:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{workout?.name}</h2>
      
      {exercises.map((exercise, index) => (
        <div key={exercise.id} className="mb-6 p-4 border rounded-lg">
          <h3 className="text-xl font-semibold mb-2">{exercise.name}</h3>
          
          <div className="space-y-2">
            {exercise.sets.map((set, setIndex) => (
              <div key={setIndex} className="flex space-x-4">
                <span>Set {setIndex + 1}:</span>
                <span>{set.weight}kg x {set.reps} reps</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex space-x-4">
            <input
              type="number"
              placeholder="Weight (kg)"
              className="border rounded px-2 py-1"
              value={currentSet[exercise.id]?.weight || ''}
              onChange={(e) => setCurrentSet({
                ...currentSet,
                [exercise.id]: { ...currentSet[exercise.id], weight: e.target.value }
              })}
            />
            <input
              type="number"
              placeholder="Reps"
              className="border rounded px-2 py-1"
              value={currentSet[exercise.id]?.reps || ''}
              onChange={(e) => setCurrentSet({
                ...currentSet,
                [exercise.id]: { ...currentSet[exercise.id], reps: e.target.value }
              })}
            />
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded"
              onClick={() => handleSetComplete(
                index,
                currentSet[exercise.id]?.weight,
                currentSet[exercise.id]?.reps
              )}
            >
              Add Set
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WorkoutSession; 