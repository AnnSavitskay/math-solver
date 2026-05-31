import { useState, useEffect } from "react";

function App() {

  const [matrix, setMatrix] =
    useState("");

  const [result, setResult] =
    useState(null);

  const [history, setHistory] =
    useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory =
    async () => {

      const response =
        await fetch(
          "http://127.0.0.1:8000/history"
        );

      const data =
        await response.json();

      setHistory(data);
    };

  async function solve() {

    const matrixData =
      matrix
        .split("\n")
        .map(
          row =>
            row
              .trim()
              .split(" ")
              .map(Number)
        );

    const response =
      await fetch(
        "http://127.0.0.1:8000/matrix",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            matrix: matrixData
          })
        }
      );

    const data =
      await response.json();

    setResult(data);

    loadHistory();
  }
  
  function renderMatrix(matrixData) {
  	if (!matrixData) return null;

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
		      {Number(value).toFixed(2)}
		    </span>

		  ))}

		</div>

	      ))}

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

        <textarea
          value={matrix}
          onChange={e =>
            setMatrix(
              e.target.value
            )
          }

          rows={6}

          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "10px"
          }}
        />

        <br />

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

            <p>
              determinant:
              {" "}
              {result.determinant.toFixed(2)}
            </p>

            <p>
              rank:
              {" "}
              {result.rank}
            </p>

            {result.inverse && (
              <div>

                <p>inverse:</p>

		{renderMatrix(result.inverse)}

              </div>
            )}
            
            {result.eigenvalues && (

		  <div>

		    <p>
		      eigenvalues:
		    </p>

		    <div>

		      {result.eigenvalues.map(
			(value, index) => (

			  <p key={index}>
			    λ{index + 1}:{" "}
			    {Number(value).toFixed(2)}
			  </p>

			)
		      )}

		    </div>

		  </div>
		)}

          </div>
        )}
        
        {result.eigenvectors && (

	  <div>

	    <p>
	      eigenvectors:
	    </p>

	    {
	      renderMatrix(
		result.eigenvectors
	      )
	    }

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

	  <h2>
	    Recent calculations
	  </h2>

	  {
	    history.map(item => (

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
		  det =
		  {" "}
		  {Number(item.determinant).toFixed(2)}
		</p>

		<p>
		  rank =
		  {" "}
		  {item.rank}
		</p>

	      </div>

	    ))
	  }

      </div>

    </div>
  );
}

export default App;
