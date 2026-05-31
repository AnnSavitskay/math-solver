import { useState, useEffect } from "react";

function App() {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [matrixA, setMatrixA] = useState([["", ""],["", ""]]);
  const [matrixB, setMatrixB] = useState([["", ""],["", ""]]);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [operation, setOperation] = useState("det");
  const needsSecondMatrix = operation === "add" || operation === "multiply";
  useEffect(() => {loadHistory();}, []);

  const loadHistory =
    async () => {
      const response = await fetch("http://127.0.0.1:8000/history");
      const data = await response.json();
      setHistory(data);
    };

  async function solve() {
	  const matrixDataA = matrixA.map(row => row.map(Number));
	  const matrixDataB = matrixB.map(row => row.map(Number));
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
  
  function createMatrix(rows, cols) {
	  return Array(rows).fill(null).map(() => Array(cols).fill(""));
	}
  
  function changeSize(newRows, newCols) {
	  setRows(newRows);
	  setCols(newCols);
	  setMatrixA(createMatrix(newRows, newCols));
	  setMatrixB(createMatrix(newRows, newCols));
	}
	
  function updateCell(row, col, value) {
	  const updated = [...matrixA];
	  updated[row][col] = value;
	  setMatrixA(updated);
	}
 function updateCellB(row, col, value) {
	  const updated = [...matrixB];
	  updated[row][col] = value;
	  setMatrixB(updated);
	}
	
 function renderMatrix(matrixData) {
	  if (!matrixData)
	    return null;
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
		          {
		            Number(value).toFixed(2)
		          }
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
	<option value="multiply">
	  Multiply A×B
	</option>
	<option value="eigen">
	  Eigenvalues
	</option>
	</select>
        <div>
	  <label>
	    Size:
	  </label>
	  <select
	    value={rows}
	    onChange={(e) => changeSize(Number(e.target.value), Number(e.target.value))}
	  >
	    <option value={2}>
	      2x2
	    </option>
	    <option value={3}>
	      3x3
	    </option>
	    <option value={4}>
	      4x4
	    </option>
	  </select>
	</div>
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
		          type="number"
		          value={cell}
		          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
		          style={{
		            width: "60px",
		            margin: "5px"
		          }}
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
		        type="number"
		        value={cell}
		        onChange={(e) => updateCellB(rowIndex, colIndex, e.target.value)}
		        style={{
		          width: "60px",
		          margin: "5px"
		        }}
		      />
		    )
		  )}
		</div>
	      )
	    )}
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
	    {result.determinant !== undefined && (
	      <p>
		determinant:
		{" "}
		{Number(result.determinant).toFixed(2)}
	      </p>
	    )}
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
		{renderMatrix(result.inverse)}
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
		{renderMatrix(result.sum)}
	      </div>
	    )}
	    {result.product && (
	      <div>
		<p>
		  A × B:
		</p>
		{renderMatrix(result.product)}
	      </div>
	    )}
	    {result.eigenvalues && (
	      <div>
		<p>
		  eigenvalues:
		</p>
		{result.eigenvalues.map((value, index) => (
		      <p
		        key={index}
		      >
		        λ{index + 1}:{" "}
		        {Number(value).toFixed(2)}
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
		  renderMatrix(result.eigenvectors)
		}
	      </div>
	    )}
	  </div>
	)}
	</div>
      <div
	  style={{
	    width: "320px",
	    borderLeft: "1px solid #ddd",
	    paddingLeft: "20px"
	  }}
	>
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
		{renderMatrix(item.matrix)}
		<p>
		  det = {" "}{Number(item.determinant).toFixed(2)}
		</p>
		<p>
		  rank ={" "}{item.rank}
		</p>
		{renderMatrix(item.result)}
	 	<button
		  onClick={() => {
		    setMatrixA(item.matrix);
		    setRows(item.matrix.length);
		    setCols(item.matrix[0].length);
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
