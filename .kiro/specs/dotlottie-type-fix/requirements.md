# Requirements Document

## Introduction

The DayTradeSystem component is currently experiencing TypeScript errors related to the dotlottie player component. The `speed` property is defined as a string in the type definition file, but it's being passed as a number in the component. This causes TypeScript compilation errors that need to be fixed to ensure type safety and proper component functionality.

## Requirements

### Requirement 1

**User Story:** As a developer, I want to fix the TypeScript errors in the DayTradeSystem component related to the dotlottie player, so that the application compiles without errors and maintains type safety.

#### Acceptance Criteria

1. WHEN the DayTradeSystem component uses dotlottie-player components THEN the speed property SHALL be passed as a string instead of a number.
2. WHEN the application is compiled THEN there SHALL be no TypeScript errors related to the dotlottie player speed property.
3. WHEN the dotlottie animations are played THEN they SHALL maintain the same visual behavior as before the fix.

### Requirement 2

**User Story:** As a developer, I want to ensure consistent string formatting for currency values in the DayTradeSystem component, so that the application displays monetary values correctly and consistently.

#### Acceptance Criteria

1. WHEN currency values are formatted THEN the component SHALL use template literals instead of string concatenation for better readability and maintainability.
2. WHEN currency values are displayed THEN they SHALL maintain the same format and appearance as before the fix.
3. WHEN negative currency values are displayed THEN they SHALL be properly formatted with the negative sign in the correct position.

### Requirement 3

**User Story:** As a developer, I want to ensure the dotlottie type definitions are properly used throughout the application, so that we maintain type safety and prevent similar errors in the future.

#### Acceptance Criteria

1. WHEN dotlottie-player components are used in the application THEN they SHALL adhere to the type definitions specified in the dotlottie.d.ts file.
2. WHEN new dotlottie-player components are added in the future THEN developers SHALL have clear examples of how to properly type the component properties.