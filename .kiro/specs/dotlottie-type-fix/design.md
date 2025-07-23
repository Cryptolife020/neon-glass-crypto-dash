# Design Document

## Overview

This design document outlines the approach to fix TypeScript errors in the DayTradeSystem component related to the dotlottie player. The main issue is that the `speed` property is defined as a string in the type definition file, but it's being passed as a number in the component. Additionally, we'll address string formatting issues for currency values to improve code quality and maintainability.

## Architecture

The DayTradeSystem component is a React component that uses the dotlottie-player web component for animations. The dotlottie-player is defined in the `src/types/dotlottie.d.ts` file as a custom JSX element with specific property types.

## Components and Interfaces

### dotlottie-player Type Definition

The current type definition for the dotlottie-player component is:

```typescript
declare namespace JSX {
  interface IntrinsicElements {
    'dotlottie-player': {
      src?: string;
      background?: string;
      speed?: string;
      style?: React.CSSProperties;
      loop?: boolean;
      autoplay?: boolean;
      direction?: string;
      mode?: string;
    };
  }
}
```

The key issue is that the `speed` property is defined as a string, but it's being passed as a number in the DayTradeSystem component.

### DayTradeSystem Component

The DayTradeSystem component uses the dotlottie-player in multiple places with the `speed` property set to a number value (typically `speed={1}`). This causes TypeScript errors because the type definition expects a string.

## Implementation Approach

### 1. Fix dotlottie-player Speed Property

We have two options to fix the TypeScript errors:

1. **Option 1 (Selected)**: Convert all number values to strings in the DayTradeSystem component.
   - Change `speed={1}` to `speed="1"` in all instances of the dotlottie-player component.
   - This approach maintains the current type definition and ensures type safety.

2. **Option 2 (Not Selected)**: Update the type definition to accept both string and number.
   - Change the type definition to `speed?: string | number;`.
   - This approach would require less changes to the component but would modify the type definition.

We've selected Option 1 because it adheres to the existing type definition without modifying it, which is generally safer when working with third-party components or libraries.

### 2. Improve String Formatting for Currency Values

The DayTradeSystem component uses string concatenation for formatting currency values, which can be error-prone and less readable. We'll improve this by:

1. Replacing string concatenation with template literals for better readability.
2. Ensuring consistent formatting for currency values throughout the component.

For example, change:
```typescript
return (valorNumerico < 0 ? '-' : '') + '$' + valorFormatadoBR;
```

To:
```typescript
return `${valorNumerico < 0 ? '-' : ''}$${valorFormatadoBR}`;
```

## Testing Strategy

1. **Unit Testing**: Ensure that the dotlottie-player components render correctly with the string speed values.
2. **Visual Testing**: Verify that the animations still play at the correct speed after the changes.
3. **TypeScript Compilation**: Confirm that there are no TypeScript errors related to the dotlottie-player component.
4. **Currency Formatting**: Verify that currency values are displayed correctly and consistently throughout the application.

## Error Handling

No specific error handling changes are required for this fix, as we're simply ensuring type correctness and improving string formatting.

## Implementation Details

### 1. Fix dotlottie-player Speed Property

We need to update the following instances of the dotlottie-player component in the DayTradeSystem.tsx file:

1. Line ~1256: `speed={1}` → `speed="1"`
2. Line ~1314: `speed={1}` → `speed="1"`
3. Line ~1350: `speed={1}` → `speed="1"`
4. Line ~1396: `speed={1}` → `speed="1"`
5. Line ~1405: `speed={1}` → `speed="1"`
6. Line ~1905: `speed={1}` → `speed="1"`

### 2. Improve String Formatting for Currency Values

We need to update the following string concatenation instances to template literals:

1. Replace all instances of `(valorNumerico < 0 ? '-' : '') + '$' + valorFormatadoBR` with `${valorNumerico < 0 ? '-' : ''}$${valorFormatadoBR}`
2. Replace all instances of `'$' + new Intl.NumberFormat(...)` with template literals
3. Replace all instances of `valor < 0 ? '-$' + valorFormatado : '$' + valorFormatado` with template literals