# Project Form Fix Guide

## Issue Identified
The form is not properly saving the `featured` and `status` fields to the database, even though the database columns exist and work correctly.

## Root Cause
The `projectData` object in the form submission is not explicitly including the `featured` and `status` fields.

## Fix Steps

### Step 1: Update ProjectForm.tsx

Replace the `handleSubmit` function in `src/components/ProjectForm.tsx` with this fixed version:

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log('ProjectForm: Form submitted');
  console.log('ProjectForm: Current form data:', formData);
  console.log('ProjectForm: Featured value:', formData.featured);
  console.log('ProjectForm: Status value:', formData.status);
  
  // Validate required fields
  if (!formData.title || !formData.description) {
    toast({
      title: "❌ Missing Required Fields",
      description: "Please fill in title and description.",
      variant: "destructive"
    });
    return;
  }
  
  setLoading(true);

  try {
    console.log('ProjectForm: Starting form submission');
    console.log('ProjectForm: Current form data:', formData);
    
    // Generate slug from title
    const generateSlug = (title: string): string => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    };

    // FIXED: Explicitly include featured and status in projectData
    const projectData = {
      ...formData,
      slug: generateSlug(formData.title),
      technologies: formData.technologies,
      images: projectImages.map(img => img.image_url),
      videos: formData.videos || [],
      location: formData.location || formData.subtitle || '',
      duration: formData.duration || '',
      team_size: formData.team_size || '',
      project_url: formData.project_url || '',
      github_url: formData.github_url || '',
      // EXPLICITLY INCLUDE THESE FIELDS
      featured: formData.featured,
      status: formData.status
    };
    
    console.log('ProjectForm: Videos being saved:', formData.videos);
    console.log('ProjectForm: Location being saved:', formData.location);
    console.log('ProjectForm: Featured being saved:', formData.featured);
    console.log('ProjectForm: Status being saved:', formData.status);
    
    console.log('ProjectForm: Project data being saved:', projectData);
    console.log('ProjectForm: Project images being saved:', projectImages.map(img => img.image_url));

    if (isEditing && projectId) {
      console.log('ProjectForm: Updating project with ID:', projectId);
      console.log('ProjectForm: Project data to update:', projectData);
      
      // Update existing project
      console.log('ProjectForm: Calling updateProject with ID:', projectId);
      console.log('ProjectForm: Update data:', projectData);
      const updatedProject = await unifiedProjectsService.updateProject(projectId, projectData);
      console.log('ProjectForm: Updated project result:', updatedProject);
      
      if (updatedProject) {
        console.log('ProjectForm: Successfully updated project:', updatedProject);
        
        // Show success message and redirect immediately
        toast({
          title: "✅ Project Updated!",
          description: "Redirecting to project details...",
        });
        
        // Redirect to the updated project immediately
        setTimeout(() => {
          window.location.href = `/portfolio/${projectId}`;
        }, 1000);
      } else {
        throw new Error("Failed to update project");
      }
    } else {
      console.log('ProjectForm: Creating new project');
      console.log('ProjectForm: Project data to create:', projectData);
      
      // Create new project
      console.log('ProjectForm: Attempting to create project...');
      console.log('ProjectForm: Project data being sent:', projectData);
      
      let newProject;
      try {
        newProject = await unifiedProjectsService.createProject(projectData);
        console.log('ProjectForm: Created project result:', newProject);
        
        if (!newProject) {
          console.error('ProjectForm: Service returned null/undefined for new project');
          throw new Error("Failed to create project - no project returned");
        }
        
        console.log('ProjectForm: Project created successfully with ID:', newProject.id);
      
      } catch (serviceError) {
        console.error('ProjectForm: Service error details:', serviceError);
        throw new Error(`Service error: ${serviceError}`);
      }
      
      toast({
        title: "🎉 Project Created Successfully!",
        description: "Your new project has been created and is now live.",
      });
      
      // Redirect to portfolio page to see the new project
      setTimeout(() => {
        window.location.href = '/portfolio';
      }, 1000);
    }
  } catch (error) {
    console.error('ProjectForm: Error during form submission:', error);
    
    toast({
      title: "❌ Error",
      description: "Failed to save project. Please try again.",
      variant: "destructive"
    });
  } finally {
    console.log('ProjectForm: Form submission completed');
    setLoading(false);
  }
};
```

### Step 2: Test the Fix

1. **Edit Flow-SIGHT project**:
   - Go to the project edit form
   - Check the "Featured Project" checkbox
   - Change status to "Published"
   - Save the project
   - Check browser console for logs

2. **Check the database**:
   ```sql
   SELECT id, title, featured, status 
   FROM projects 
   WHERE title = 'Flow-SIGHT';
   ```

3. **Check the portfolio page**:
   - Go to your portfolio page
   - Verify Flow-SIGHT appears in the featured section

### Step 3: Debug Console Logs

When testing, look for these console logs:
- `"ProjectForm: Featured value:"` - Should show `true`
- `"ProjectForm: Status value:"` - Should show `"published"`
- `"ProjectForm: Featured being saved:"` - Should show `true`
- `"ProjectForm: Status being saved:"` - Should show `"published"`

### Step 4: Manual Database Verification

If the form still doesn't work, you can manually update projects:

```sql
-- Manually set a project as featured
UPDATE projects 
SET featured = true, status = 'published'
WHERE title = 'Your Project Title';
```

## Expected Results

After applying this fix:
- ✅ Featured checkbox will save to database
- ✅ Status dropdown will save to database
- ✅ Featured projects will appear in featured section
- ✅ All project settings will persist after page refresh

## Troubleshooting

If the issue persists:
1. Check browser console for JavaScript errors
2. Verify the form data includes featured and status fields
3. Check if the service is receiving the correct data
4. Verify database permissions allow updates

The key fix is explicitly including `featured: formData.featured` and `status: formData.status` in the projectData object. 