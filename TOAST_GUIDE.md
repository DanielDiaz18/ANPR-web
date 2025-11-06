# Toast UI Component - Quick Reference Guide

## Setup (Already Done ✅)

The `Toaster` component has been added to your root layout, so toasts will work throughout your app.

## Basic Usage

### 1. Import the Hook
```typescript
import { useToast } from "@/hooks/use-toast"
```

### 2. Use the Hook in Your Component
```typescript
const { toast } = useToast()
```

### 3. Show a Toast
```typescript
toast({
  title: "Success!",
  description: "Your action was completed.",
})
```

## Common Patterns

### Success Notification
```typescript
toast({
  title: "✅ Saved Successfully",
  description: "Your changes have been saved.",
})
```

### Error Notification
```typescript
toast({
  title: "❌ Error",
  description: "Something went wrong. Please try again.",
  variant: "destructive",
})
```

### With Action Button
```typescript
toast({
  title: "Item Deleted",
  description: "The item has been removed.",
  action: (
    <Button variant="outline" size="sm" onClick={handleUndo}>
      Undo
    </Button>
  ),
})
```

### Auto-Dismiss
```typescript
const { dismiss } = toast({
  title: "Processing...",
  description: "Please wait.",
})

// Later, dismiss it
setTimeout(() => dismiss(), 3000)
```

### Update Existing Toast
```typescript
const { id, update } = toast({
  title: "⏳ Loading...",
  description: "Please wait.",
})

// After some async operation
update({
  id,
  title: "✅ Complete!",
  description: "Operation finished successfully.",
})
```

## Real-World Examples

### Form Submission
```typescript
const handleSubmit = async () => {
  try {
    await saveData(formData)

    toast({
      title: "✅ Form Submitted",
      description: "Your data has been saved successfully.",
    })
  } catch (error) {
    toast({
      title: "❌ Submission Failed",
      description: error.message,
      variant: "destructive",
    })
  }
}
```

### Delete Confirmation
```typescript
const handleDelete = (id: string) => {
  // Delete the item
  deleteItem(id)

  // Show toast with undo action
  const deletedItem = items.find(item => item.id === id)

  toast({
    title: "🗑️ Item Deleted",
    description: `${deletedItem.name} has been removed.`,
    action: (
      <Button variant="outline" size="sm" onClick={() => restoreItem(id)}>
        Undo
      </Button>
    ),
  })
}
```

### Async Operation with Progress
```typescript
const handleUpload = async () => {
  const { id, update } = toast({
    title: "⏳ Uploading...",
    description: "0% complete",
  })

  // Simulate progress
  for (let i = 0; i <= 100; i += 10) {
    await new Promise(resolve => setTimeout(resolve, 200))
    update({
      id,
      title: "⏳ Uploading...",
      description: `${i}% complete`,
    })
  }

  update({
    id,
    title: "✅ Upload Complete!",
    description: "Your file has been uploaded successfully.",
  })
}
```

## Props Reference

| Prop | Type | Description |
|------|------|-------------|
| `title` | `ReactNode` | Main heading of the toast |
| `description` | `ReactNode` | Supporting text/description |
| `variant` | `"default" \| "destructive"` | Visual style (default or error) |
| `action` | `ReactNode` | Action button or element |
| `open` | `boolean` | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | Callback when open state changes |

## Tips

1. **Use Emojis**: Add visual indicators (✅, ❌, ⏳, 🗑️, etc.)
2. **Be Specific**: Provide clear descriptions of what happened
3. **Error Handling**: Always use `variant="destructive"` for errors
4. **Action Buttons**: Add undo/retry options when appropriate
5. **Duration**: The default duration is very long (1000000ms), adjust as needed

## See It In Action

Check out `components/service-management.tsx` for live examples of:
- Success notifications when creating/updating services
- Error notifications when deleting services
- Descriptive messages with context

## Demo Component

Run your app and navigate to see the toast examples component:
```
components/toast-examples.tsx
```

This demonstrates all toast patterns and use cases.
