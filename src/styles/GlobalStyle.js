import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    background-color: #f5f5f5;
    color: #333;
  }

  input, button {
    padding: 10px;
    margin: 10px 0;
    font-size: 1rem;
  }

  button {
    background-color: #0066cc;
    color: white;
    border: none;
    cursor: pointer;
  }

  button:hover {
    background-color: #0052a3;
  }
`;

export default GlobalStyle;
