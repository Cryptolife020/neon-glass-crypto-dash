# Implementation Plan

- [x] 1. Fix dotlottie-player speed property type errors

  - Convert all numeric speed values to strings in the DayTradeSystem component
  - Ensure all dotlottie-player instances use string values for the speed property
  - _Requirements: 1.1, 1.2, 1.3, 3.1_

- [x] 1.1 Update first dotlottie-player instance (line ~1256)


  - Change `speed={1}` to `speed="1"` in the first dotlottie-player component
  - Verify the animation still works correctly
  - _Requirements: 1.1, 1.2_



- [ ] 1.2 Update second dotlottie-player instance (line ~1314)
  - Change `speed={1}` to `speed="1"` in the second dotlottie-player component

  - Verify the animation still works correctly
  - _Requirements: 1.1, 1.2_

- [x] 1.3 Update third dotlottie-player instance (line ~1350)

  - Change `speed={1}` to `speed="1"` in the third dotlottie-player component
  - Verify the animation still works correctly
  - _Requirements: 1.1, 1.2_


- [ ] 1.4 Update fourth dotlottie-player instance (line ~1396)
  - Change `speed={1}` to `speed="1"` in the fourth dotlottie-player component
  - Verify the animation still works correctly
  - _Requirements: 1.1, 1.2_


- [ ] 1.5 Update fifth dotlottie-player instance (line ~1405)
  - Change `speed={1}` to `speed="1"` in the fifth dotlottie-player component
  - Verify the animation still works correctly
  - _Requirements: 1.1, 1.2_

- [ ] 1.6 Update sixth dotlottie-player instance (line ~1905)
  - Change `speed={1}` to `speed="1"` in the sixth dotlottie-player component


  - Verify the animation still works correctly
  - _Requirements: 1.1, 1.2_




- [ ] 2. Improve currency string formatting
  - Replace string concatenation with template literals for better readability and maintainability
  - Ensure consistent formatting for currency values throughout the component
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 2.1 Update main formatarValor function (line ~119)
  - Replace `(valorNumerico < 0 ? '-' : '') + '$' + valorFormatadoBR` with template literal
  - Verify currency formatting remains consistent
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 2.2 Update totalDosCaixas string formatting (line ~184)
  - Replace `'$' + new Intl.NumberFormat(...)` with template literal
  - Verify currency formatting remains consistent
  - _Requirements: 2.1, 2.2_

- [x] 2.3 Update totalDosCaixasAtual string formatting (line ~190)


  - Replace `'$' + new Intl.NumberFormat(...)` with template literal
  - Verify currency formatting remains consistent
  - _Requirements: 2.1, 2.2_



- [ ] 2.4 Update formatarValor function in useEffect (line ~518)
  - Replace `valor < 0 ? '-$' + valorFormatado : '$' + valorFormatado` with template literal



  - Verify currency formatting remains consistent
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 2.5 Update remaining formatarValor functions
  - Replace all remaining string concatenations with template literals
  - Verify currency formatting remains consistent
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 3. Verify all TypeScript errors are resolved
  - Run TypeScript compiler to check for any remaining errors
  - Fix any additional errors found
  - _Requirements: 1.2, 3.1, 3.2_

- [ ] 4. Document changes for future reference
  - Add comments explaining the dotlottie-player speed property type requirement
  - Add example usage in a comment near the first instance
  - _Requirements: 3.2_