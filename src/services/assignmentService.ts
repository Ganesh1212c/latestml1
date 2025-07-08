import { db } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { Assignment, AssignmentSubmission, AssignmentResult } from '../types/assignment';

export const createAssignment = async (assignment: Omit<Assignment, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'assignments'), {
      ...assignment,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error;
  }
};

export const getAssignments = async (courseId?: string): Promise<Assignment[]> => {
  try {
    let q = query(collection(db, 'assignments'), orderBy('createdAt', 'desc'));
    
    if (courseId) {
      q = query(collection(db, 'assignments'), where('courseId', '==', courseId), orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Assignment));
  } catch (error) {
    console.error('Error fetching assignments:', error);
    throw error;
  }
};

export const getAssignment = async (assignmentId: string): Promise<Assignment | null> => {
  try {
    const docRef = doc(db, 'assignments', assignmentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Assignment;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching assignment:', error);
    throw error;
  }
};

export const submitAssignment = async (submission: Omit<AssignmentSubmission, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'assignmentSubmissions'), {
      ...submission,
      submittedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error submitting assignment:', error);
    throw error;
  }
};

export const getAssignmentSubmissions = async (userId: string, assignmentId: string): Promise<AssignmentSubmission[]> => {
  try {
    const q = query(
      collection(db, 'assignmentSubmissions'),
      where('userId', '==', userId),
      where('assignmentId', '==', assignmentId),
      orderBy('submittedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AssignmentSubmission));
  } catch (error) {
    console.error('Error fetching assignment submissions:', error);
    throw error;
  }
};

export const calculateAssignmentResult = async (
  submission: AssignmentSubmission, 
  assignment: Assignment
): Promise<AssignmentResult> => {
  try {
    let totalScore = 0;
    let maxScore = 0;
    const questionResults: any[] = [];

    assignment.questions.forEach((question, index) => {
      const userAnswer = submission.answers[index];
      let questionScore = 0;
      let isCorrect = false;

      switch (question.type) {
        case 'multiple-choice':
          isCorrect = userAnswer === question.correctAnswer;
          questionScore = isCorrect ? question.points : 0;
          break;
        case 'short-answer':
          // Simple text matching for now - could be enhanced with fuzzy matching
          isCorrect = userAnswer?.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim();
          questionScore = isCorrect ? question.points : 0;
          break;
        case 'essay':
          // Essay questions need manual grading - assign partial credit for now
          questionScore = question.points * 0.8; // 80% for submission
          isCorrect = true;
          break;
      }

      totalScore += questionScore;
      maxScore += question.points;
      
      questionResults.push({
        questionIndex: index,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        score: questionScore,
        maxScore: question.points
      });
    });

    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    return {
      submissionId: submission.id,
      assignmentId: assignment.id,
      userId: submission.userId,
      score: totalScore,
      maxScore,
      percentage,
      questionResults,
      gradedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error calculating assignment result:', error);
    throw error;
  }
};

export const updateAssignment = async (assignmentId: string, updates: Partial<Assignment>): Promise<void> => {
  try {
    const docRef = doc(db, 'assignments', assignmentId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating assignment:', error);
    throw error;
  }
};