import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

function ExerciseList() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchExercises() {
      try {
        const exercisesRef = collection(db, 'exercises');
        const q = query(exercisesRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        
        const exerciseList = [];
        querySnapshot.forEach((doc) => {
          exerciseList.push({ id: doc.id, ...doc.data() });
        });
        
        setExercises(exerciseList);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, [currentUser]);

  if (loading) {
    return <div>Loading exercises...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {exercises.map((exercise) => (
        <div
          key={exercise.id}
          className="p-4 border rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h3 className="text-lg font-semibold">{exercise.name}</h3>
          <p className="text-gray-600">{exercise.muscleGroup}</p>
          {exercise.notes && (
            <p className="text-sm text-gray-500 mt-2">{exercise.notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default ExerciseList; 