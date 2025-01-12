### Test Overview

You are tasked with creating a React application that implements a packing algorithm to determine the smallest box or collection of boxes required to fit a set of products. The project should demonstrate your skills in React, TypeScript, and UI development, as well as your ability to solve algorithmic problems and write clean, reusable code.

---

### Requirements

#### Core Functionality:

1. **Box Packing Algorithm**:

   - Develop an algorithm that determines the smallest box or combination of boxes that can fit all products, adhering to the following constraints:
     - The total volume of the selected box(es) must be greater than the total volume of the products placed in it.
     - No single dimension of any product can be greater than any dimension of its assigned box (e.g., product width ≤ box width).
     - The total weight of the products in any box must not exceed the box’s weight limit.
   - If a product cannot fit in any box, the algorithm should:
     - Allocate the product to its own box.
     - Return an error message if the product does not fit in the largest available box.
   - The algorithm should aim to minimize the total volume of the boxes used.

2. **Predefined Boxes**:
   - Use the following JSON to define the available box sizes and their weight limits:
     - `./boxes.json`

#### User Interface:

1. **Input Products**:
   - Provide a UI where users can input up to 10 products, each with the following fields:
     - Dimensions: `length`, `width`, `height` (in cm)
     - Weight (in kg)
     - Quantity
2. **Output**:
   - Display the boxes selected by the algorithm and how the products are distributed among them.
   - Show an error message if a product cannot be packed.

#### Additional Requirements:

1. **React Framework**:
   - Use **React** to build the application.
   - Implement at least one **reusable component** (e.g., a product input form or a box results card).
2. **TypeScript**:
   - Write the application using TypeScript, with strongly typed props, state, and functions.
3. **Package Dependency**:
   - Include at least one package dependency (other than React modules) to demonstrate your ability to work with external libraries (e.g., `lodash`, `formik`, or a UI framework like Material-UI or Ant Design).

#### Testing:

- Write comprehensive **unit tests** for the algorithm and at least one React component.

#### Documentation:

- Add a **README.md** file that includes:
  - How to install and run the project.
  - Instructions on how to use the app.
  - Examples of inputs and expected outputs.
  - Any known limitations or edge cases.

---

### Predefined Product List

Use this **50-product list** as the data source for your app. Users should select products from this list when using the app:

    -`./products.json`

---

### Deliverables:

1. A functional React application with all requirements met.
2. A fully documented `README.md`.
3. Unit tests for the algorithm and at least one React component.
4. A GitHub repository or a ZIP file with the project code.

---

### Evaluation Criteria:

1. **Code Quality**:
   - Clean, modular, and reusable code.
   - Appropriate use of TypeScript types.
2. **Functionality**:
   - The algorithm produces correct results for various scenarios.
   - The UI is intuitive and functional.
3. **Testing**:
   - High-quality unit tests with good coverage.
4. **Documentation**:
   - Clear, detailed, and helpful documentation.
5. **Creativity**:
   - Use of thoughtful design and implementation choices.
