import { useState } from "react";

function App() {

  const [matrix, setMatrix] =
    useState("");

  const [result, setResult] =
    useState(null);

  async function solve() {

    const matrixData =
      matrix
        .split("\n")
        .map(
          row =>
            row
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
  }

  return (
    <div>

      <textarea
        value={matrix}
        onChange={e =>
          setMatrix(
            e.target.value
          )
        }
      />

      <button onClick={solve}>
        Solve
      </button>

      {result && (
        <div>

          determinant:
          {result.determinant}

          rank:
          {result.rank}

        </div>
      )}

    </div>
  );
}

export default App;
