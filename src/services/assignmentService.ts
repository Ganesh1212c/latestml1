Here's the fixed version with all missing closing brackets added:

```typescript
// ... [previous code remains the same until the useEffect hooks]

  useEffect(() => {
    // Test Firestore connection on component mount
    testFirestoreConnection().then(() => {
      setConnectionTested(true);
    });
  }, []);

  const fetchCourses = async () => {
    try {
      const coursesData = await getCourses();
      setCourses(coursesData);
      if (coursesData.length > 0 && !selectedCourse) {
        setSelectedCourse(coursesData[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  // ... [middle code remains the same until the handleAssignmentSubmit function]

      // Update local state
      setAssignmentSubmissions(prev => ({
        ...prev,
        [selectedAssignment.id]: submission
      }));

      console.log('Final submission saved with ID:', submission.id);

      // Calculate and store result
      const result = await calculateAssignmentResult(submission, selectedAssignment);
      setAssignmentResults(prev => ({
        ...prev,
        [selectedAssignment.id]: result
      }));

      // Update student progress only for final submissions
      if (isFinal) {
        await updateStudentProgress(user.uid, selectedCourse?.id || '', {
          completedAssignments: [selectedAssignment.id],
          lastAccessed: new Date().toISOString()
        });
      }

      if (isFinal) {
        toast.success('Assignment submitted successfully!');
      } else {
        toast.success('Draft saved successfully!');
      }
    } catch (error) {
      console.error('Assignment submission error:', error);
      toast.error(isFinal ? 'Failed to submit assignment' : 'Failed to save draft');
    } finally {
      setAssignmentLoading(false);
    }
  };

  // ... [remaining component code remains the same until the end]

export const getAssignmentSubmissions = async (userId: string, assignmentId: string): Promise<AssignmentSubmission[]> => {
  // Implementation here
};

export default CoursesView;
```