import React, { useState, useEffect } from 'react';
import { 
  saveAssignment,
  getWeekAssignments,
  deleteAssignment,
} from '../../services/database';
import { Assignment } from '../../types/assignment';
import { Card } from '../UI/Card';
import Button from '../UI/Button';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';

const ContentManager: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      // Load assignments for current week (you can modify this logic)
      const weekAssignments = await getWeekAssignments(1);
      setAssignments(weekAssignments);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    try {
      await deleteAssignment(assignmentId);
      setAssignments(prev => prev.filter(a => a.id !== assignmentId));
    } catch (error) {
      console.error('Error deleting assignment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Content Manager</h2>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Assignment
        </Button>
      </div>

      <div className="grid gap-4">
        {assignments.length === 0 ? (
          <Card className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-600 mb-4">Create your first assignment to get started.</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          </Card>
        ) : (
          assignments.map((assignment) => (
            <Card key={assignment.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                  <p className="text-gray-600 mt-1">{assignment.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>Week {assignment.week}</span>
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteAssignment(assignment.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentManager;