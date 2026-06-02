import { useState, useEffect } from "react";
import { convertToComplex, Complex } from "./Complex.jsx";

function App() {
  const [rowsA, setRowsA] = useState("");
  const [colsA, setColsA] = useState("");
  const [rowsB, setRowsB] = useState("");
  const [colsB, setColsB] = useState("");
  const [matrixA, setMatrixA] = useState([["", ""],["", ""]]);
  const [matrixB, setMatrixB] = useState([["", ""],["", ""]]);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [operation, setOperation] = useState("det");
  const needsSecondMatrix = operation === "add" || operation === "multiply" || operation === "solve";
  useEffect(() => {loadHistory();}, []);

  const loadHistory =
    async () => {
      const response = await fetch("http://127.0.0.1:8000/history");
      const data = await response.json();
      setHistory(data);
    };

  async function solve() {
	  const matrixDataA = matrixA.map(row => row.map(cell => convertToComplex(cell)));
	  const matrixDataB = matrixB.map(row => row.map(cell => convertToComplex(cell)));
	  const response = await fetch("http://127.0.0.1:8000/matrix",
	      {
		method: "POST",
		headers: {
		  "Content-Type":
		    "application/json"
		},
		body: JSON.stringify({
		  matrixA: matrixDataA,
		  matrixB:
		    needsSecondMatrix
		      ? matrixDataB
		      : null,
		  operation
		})
	      }
	    );
	  const data = await response.json();
	  setResult(data);
	  loadHistory();
	}
  async function clearA() { 
  	const updated = matrixA.map((row, rowIndex) => row.map((value, colIndex) => (0)));
  	setMatrixA(updated); 
  	}
  async function clearB() { 
  	const updated = matrixB.map((row, rowIndex) => row.map((value, colIndex) => (0)));
  	setMatrixB(updated); 
  	}
  
  function createMatrix(rows_, cols_) {
  	return Array(rows_).fill(null).map(() => Array(cols_).fill(""));
  	}
  
  function changeSizeA_rows(newRows) {
	  setRowsA(newRows);
	  setMatrixA(createMatrix(newRows, colsA));
	}
  function changeSizeA_cols(newCols) {
	  setColsA(newCols);
	  setMatrixA(createMatrix(rowsA, newCols));
	}
  function changeSizeB_rows(newRows) {
	  setRowsB(newRows);
	  setMatrixB(createMatrix(newRows, colsB));
	}
  function changeSizeB_cols(newCols) {
	  setColsB(newCols);
	  setMatrixB(createMatrix(rowsB, newCols));
	}
  function updateCell(row, col, value) {
	  const updated = matrixA.map((r, ri) => r.map((c, ci) => (ri === row && ci === col ? value : c)));
	  setMatrixA(updated);
	}
  function updateCellB(row, col, value) {
 	  const updated = matrixB.map((r, ri) => r.map((c, ci) => (ri === row && ci === col ? value : c)));
	  setMatrixB(updated);
	}
	
 function check_value(value) {
 	if (typeof value === "string") {
 		value = convertToComplex(value)
 		return value.toString()
 	}
 	return Number(value).toFixed(2)
 }
 
 function check_matrix(matrixData) {
 	if (typeof matrixData === 'string'){
	  	matrixData = JSON.parse(matrixData)
	  }
	return matrixData
 }
 	
 function renderMatrix(matrixData, code) {
	  if (!matrixData) return null
	  if (code == -1) return "Matrix cannot be inversed"
	  if (code == -2) return "Matrix A and Matrix B have different dimensions"
	  if (code == -3) return "Matrix A and Matrix B have different dimensions, can not be multiplied"
	  if (code == -5) return "Equation has no solution"
	  if (code == -6) return "There is no Jordan form for this matrix"
	  if (code == -7) return "There are no Eigenvectors form for this matrix"
	  if (typeof matrixData === 'string'){
	  	matrixData = JSON.parse(matrixData)
	  }
	  return (
	    <div className="matrix-grid">
	      {matrixData.map((row, rowIndex) => (
		  <div
		    key={rowIndex}
		    className="matrix-row"
		  >
		    {row.map((value, colIndex) => (
		        <span
		          key={colIndex}
		          className="matrix-cell"
		        >
		          {check_value(value)}
		        </span>
		      )
		    )}
		  </div>
		)
	      )}
	    </div>
	  );
	}

  return (
    <div
      style={{
        display: "flex",
        gap: "40px",
        padding: "30px",
        alignItems: "flex-start",
        fontFamily:
          "Arial, sans-serif"
      }}
    >
      <div
        style={{
          flex: 1
        }}
      >
        <h1>
          Math Solver
        </h1> 
        <select
	  value={operation}
	  onChange={(e) => setOperation(e.target.value)}
	>
	<option value="det">
	  Determinant
	</option>
	<option value="inverse">
	  Inverse
	</option>
	<option value="transpose">
	  Transpose
	</option>
	<option value="add">
	  Add A+B
	</option>
	<option value="solve">
	  Solve Matrix equation
	</option>
	<option value="multiply">
	  Multiply A×B
	</option>
	<option value="eigen">
	  Eigenvalues
	</option>
	<option value="jordan">
	  Jordan form
	</option>
	</select>
        <div className="size-controls">
	  <label>
	    Number of Rows for Matrix A:
	  </label>
	  <select
	    value={rowsA}
	    onChange={(e) => changeSizeA_rows(Number(e.target.value))}
	  >
	    <option value="" disabled selected hidden>Choose an option</option>
	    <option value={2}>
	      2
	    </option>
	    <option value={3}>
	      3
	    </option>
	    <option value={4}>
	      4
	    </option>
	  </select>
	</div>
	 <div className="size-controls">
	  <label>
	    Number of Cols for Matrix A:
	  </label>
	  <select
	    value={colsA}
	    onChange={(e) => changeSizeA_cols(Number(e.target.value))}
	  >
	    <option value="" disabled selected hidden>Choose an option</option>
	    <option value={2}>
	      2
	    </option>
	    <option value={3}>
	      3
	    </option>
	    <option value={4}>
	      4
	    </option>
	  </select>
	</div>
	 <button
          onClick={clearA}
          style={{
            marginTop: "10px",
            padding:
              "10px 20px",
            cursor: "pointer"
          }}
        >
          Clear MatrixA
        </button>
	<div>
	  <h3>
	    Matrix A
	  </h3>
	  {matrixA.map((row, rowIndex) => (
		<div
		  key={rowIndex}
		  className="matrix-row"
		>
		  {row.map((cell, colIndex) => (
		        <input
		          key={colIndex}
		          type="text"
		          value={cell}
		          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
		          className="matrix-input"
		        />
		      )
		    )
		  }
		</div>
	      )
	    )
	  }
	{needsSecondMatrix && (
	<div>
		<div className="size-controls">
		  <label>
		    Number of Rows for Matrix B:
		  </label>
		  <select
		    value={rowsB}
		    onChange={(e) => changeSizeB_rows(Number(e.target.value))}
		  >
		    <option value={2}>
		      2
		    </option>
		    <option value={3}>
		      3
		    </option>
		    <option value={4}>
		      4
		    </option>
		  </select>
		</div>
		 <div className="size-controls">
		  <label>
		    Number of Cols for Matrix B:
		  </label>
		  <select
		    value={colsB}
		    onChange={(e) => changeSizeB_cols(Number(e.target.value))}
		  >
		    <option value={2}>
		      2
		    </option>
		    <option value={3}>
		      3
		    </option>
		    <option value={4}>
		      4
		    </option>
		  </select>
		</div>
	<button
          onClick={clearB}
          style={{
            marginTop: "10px",
            padding:
              "10px 20px",
            cursor: "pointer"
          }}
        >
          Clear MatrixB
        </button>
	  <div>
	    <h3>
	      Matrix B
	    </h3>
	    {matrixB.map((row, rowIndex) => (
		<div
		  key={rowIndex}
		  className="matrix-row"
		>
		  {row.map((cell, colIndex) => (
		      <input
		        key={colIndex}
		        type="text"
		        value={cell}
		        onChange={(e) => updateCellB(rowIndex, colIndex, e.target.value)}
		        className="matrix-input"
		      />
		    )
		  )}
		</div>
	      )
	    )}
	  </div>
	  </div>
	)}
	</div>
        <button
          onClick={solve}
          style={{
            marginTop: "10px",
            padding:
              "10px 20px",
            cursor: "pointer"
          }}
        >
          Solve
        </button>
        {result && (
	  <div
	    style={{
	      marginTop: "20px"
	    }}
	  >
	    {(result.determinant !== undefined && result.code !== -4 && (
	      <p>
		determinant:
		{" "}
		{check_value(result.determinant)}
	      </p>
	    )) || 
	    (result.determinant == undefined && result.code == -4 && (
	      <p>
		determinant:
		{" "}
		{"Determinant cannot be calculated, the matrix isn't square"}
	      </p>
	    ))}
	    {result.rank !== undefined && (
	      <p>
		rank:
		{" "}
		{result.rank}
	      </p>
	    )}
	    {result.inverse && (
	      <div>
		<p>
		  inverse:
		</p>
		{renderMatrix(result.inverse, result.code)}
	      </div>
	    )}
	    {result.transpose && (
	      <div>
		<p>
		  transpose:
		</p>
		{renderMatrix(result.transpose)}
	      </div>
	    )}
	    {result.sum && (
	      <div>
		<p>
		  A + B:
		</p>
		{renderMatrix(result.sum, result.code)}
	      </div>
	    )}
	    {result.solve && (
	      <div>
		<p>
		  Solution:
		</p>
		{renderMatrix(result.solve, result.code)}
	      </div>
	    )}
	    {result.product && (
	      <div>
		<p>
		  A × B:
		</p>
		{renderMatrix(result.product, result.code)}
	      </div>
	    )}
	    {result.eigenvalues && result.code !== -7 && (
	      <div>
		<p>
		  eigenvalues:
		</p>
		{result.eigenvalues.map((value, index) => (
		      <p
		        key={index}
		      >
		        λ{index + 1}:{" "}
		        {check_value(value)}
		      </p>
		    )
		  )
		}
	      </div>
	    )}
	    {result.eigenvectors && (
	      <div>
		<p>
		  eigenvectors:
		</p>
		{
		  renderMatrix(result.eigenvectors, result.code)
		}
	      </div>
	    )}
	    {result.jordan && (
	      <div>
		<p>
		  Jordan form:
		</p>
		{renderMatrix(result.jordan, result.code)}
	      </div>
	    )}
	  </div>
	)}
	</div>
	<div className="history-panel" style={{ width: "320px", borderLeft: "1px solid #ddd", paddingLeft: "20px" }}>
	  <h2>Recent calculations</h2>
	  {history.map(item => (
	      <div
		key={item.id}
		style={{
		  marginBottom: "20px",
		  paddingBottom: "15px",
		  borderBottom:
		    "1px solid #eee"
		}}
	      >
		{renderMatrix(item.result, 0)}
		<p>
		  rank ={" "}{item.rank}
		</p>
	 	<button
		  onClick={() => {
		    setMatrixA(check_matrix(item.result));
		    setRowsA(check_matrix(item.result).length);
		    setColsA(check_matrix(item.result)[0].length);
		  }}
		>
		  Use this matrix
		</button>
	      </div>
	    ))
	  }
      </div>
    </div>
  );
  }

export default App;
