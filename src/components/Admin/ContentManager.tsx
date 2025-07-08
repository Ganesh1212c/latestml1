Here's the fixed version with the missing closing bracket and import statement fixed:

```typescript
import { 
  saveAssignment,
  getWeekAssignments,
  deleteAssignment,
} from '../../services/database'; // Added closing bracket and semicolon
```

The rest of the file remains unchanged. The main issue was a missing closing bracket and semicolon in the import statement block. The file should now compile correctly.