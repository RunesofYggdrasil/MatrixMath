function roundNumber(num, decimalPlaces) {
  const modifier = num >= 0 ? 1 : -1;
  const number = num * modifier;
  const eNotation = number + "e" + decimalPlaces;
  const roundedNumber = Math.round(eNotation);
  const unNotation = roundedNumber + "e" + decimalPlaces * -1;
  const result = Number(unNotation) * modifier;
  if (result == -0) {
    return 0;
  } else {
    return result;
  }
}

function setupPageWidth() {
  const root = document.querySelector(":root");
  const innerWidth = window.innerWidth;
  const scrollbarWidth = innerWidth - root.clientWidth;
  root.style.setProperty("--page-width", innerWidth + "px");
  root.style.setProperty("--scrollbar-width", scrollbarWidth + "px");
}
window.addEventListener("resize", () => {
  setupPageWidth();
});

// Matrix "Class"
var Matrix = function (rows, cols, nums) {
  const rowCount = rows;
  const colCount = cols;
  const fullMatrix = [];
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    let currentRow = [];
    currentRow.length = 0;
    for (let colIndex = 0; colIndex < colCount; colIndex++) {
      let currentIndex = rowIndex * colCount + colIndex;
      currentRow[colIndex] = parseFloat(nums[currentIndex]);
    }
    fullMatrix[rowIndex] = currentRow;
  }

  const getRowCount = function () {
    return rowCount;
  };
  const getColCount = function () {
    return colCount;
  };
  const getFullMatrix = function () {
    return fullMatrix;
  };

  const matrixToString = function () {
    let matrixString = "[";
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
      for (let colIndex = 0; colIndex < colCount; colIndex++) {
        if (colIndex == 0 && rowIndex == 0) {
          if (colIndex == colCount - 1 && rowIndex == rowCount - 1) {
            matrixString += fullMatrix[rowIndex][colIndex];
          } else {
            matrixString += fullMatrix[rowIndex][colIndex] + ",";
          }
        } else if (colIndex == colCount - 1 && rowIndex == rowCount - 1) {
          matrixString += " " + fullMatrix[rowIndex][colIndex];
        } else if (colIndex == colCount - 1) {
          matrixString += " " + fullMatrix[rowIndex][colIndex] + "\n";
        } else {
          matrixString += " " + fullMatrix[rowIndex][colIndex] + ",";
        }
      }
      if (rowIndex == rowCount - 1) {
        matrixString += "]";
      }
    }
    return matrixString;
  };

  const roundMatrix = function (decimalPosition) {
    for (let rowIndex = 0; rowIndex < fullMatrix.length; rowIndex++) {
      for (
        let colIndex = 0;
        colIndex < fullMatrix[rowIndex].length;
        colIndex++
      ) {
        fullMatrix[rowIndex][colIndex] = roundNumber(
          fullMatrix[rowIndex][colIndex],
          decimalPosition
        );
      }
    }
  };

  const elementaryRowSwap = function (rowOne, rowTwo) {
    const temporaryRow = fullMatrix[rowOne];
    fullMatrix[rowOne] = fullMatrix[rowTwo];
    fullMatrix[rowTwo] = temporaryRow;
    return "E=RS" + rowOne + "to" + rowTwo;
  };

  const elementaryRowConst = function (rowConst, rowOne) {
    for (let colIndex = 0; colIndex < fullMatrix[rowOne].length; colIndex++) {
      if (fullMatrix[rowOne][colIndex] != 0) {
        let newValue = fullMatrix[rowOne][colIndex] * rowConst;
        fullMatrix[rowOne][colIndex] = newValue;
      }
    }
    return "E=RC" + rowConst + "x" + rowOne;
  };

  const elementaryRowAdd = function (rowConst, rowOne, rowTwo) {
    for (let colIndex = 0; colIndex < fullMatrix[rowTwo].length; colIndex++) {
      let newValue =
        fullMatrix[rowTwo][colIndex] + fullMatrix[rowOne][colIndex] * rowConst;
      fullMatrix[rowTwo][colIndex] = newValue;
    }
    return "E=RA" + rowConst + "x" + rowOne + "to" + rowTwo;
  };

  const getLeadingIndex = function (rowIndex) {
    let leadingIndex = -1;
    for (let colIndex = 0; colIndex < fullMatrix[rowIndex].length; colIndex++) {
      if (fullMatrix[rowIndex][colIndex] != 0) {
        leadingIndex = colIndex;
        break;
      }
    }
    return leadingIndex;
  };

  const getHighestLeadingIndexAfter = function (currentRowIndex) {
    let indexAfter = -1;
    // Checks if the leading index exists
    let currentLeadingIndex =
      getLeadingIndex(currentRowIndex) != -1
        ? getLeadingIndex(currentRowIndex)
        : colCount;
    for (
      let rowIndex = currentRowIndex + 1;
      rowIndex < fullMatrix.length;
      rowIndex++
    ) {
      if (
        getLeadingIndex(rowIndex) != -1 &&
        getLeadingIndex(rowIndex) < currentLeadingIndex
      ) {
        currentLeadingIndex = getLeadingIndex(rowIndex);
        indexAfter = rowIndex;
      }
    }
    return indexAfter;
  };

  const reducedRowEchelon = function () {
    let eString = "";
    for (let rowIndex = 0; rowIndex < fullMatrix.length; rowIndex++) {
      // Row Swap
      let rowSwapIndex = getHighestLeadingIndexAfter(rowIndex);
      if (rowSwapIndex != -1) {
        checkLeadingValue = false;
        eString += elementaryRowSwap(rowIndex, rowSwapIndex) + " ";
      }

      let leadingIndex = getLeadingIndex(rowIndex);

      if (leadingIndex != -1) {
        // Row Const
        // If the leading value is 1, the leadingIndexInverse will be 1 too. Otherwise, it will multiply the row by the inverse of the leading value in order to make the leading value a 1.
        let leadingIndexInverse = 1 / fullMatrix[rowIndex][leadingIndex];
        if (!Number.isNaN(leadingIndexInverse) && leadingIndexInverse != 1) {
          eString += elementaryRowConst(leadingIndexInverse, rowIndex) + " ";
        }

        // Row Add
        for (
          let newRowIndex = 0;
          newRowIndex < fullMatrix.length;
          newRowIndex++
        ) {
          if (newRowIndex != rowIndex) {
            let subtractValue = fullMatrix[newRowIndex][leadingIndex] * -1;
            if (subtractValue != 0) {
              eString +=
                elementaryRowAdd(subtractValue, rowIndex, newRowIndex) + " ";
            }
          }
        }
      }
    }
    for (let rowIndex = 0; rowIndex < fullMatrix.length; rowIndex++) {
      // Row Swap
      let rowSwapIndex = getHighestLeadingIndexAfter(rowIndex);
      if (rowSwapIndex != -1) {
        checkLeadingValue = false;
        eString += elementaryRowSwap(rowIndex, rowSwapIndex) + " ";
      }
    }
    roundMatrix(4);
    return eString;
  };

  const augmentedCalculations = function (eString) {
    const eValues = eString.split(" ");
    for (let eIndex = 0; eIndex < eValues.length; eIndex++) {
      let eType = eValues[eIndex].substring(3, 4);
      let eValue = eValues[eIndex].substring(4);
      if (eType == "S") {
        let rowOne = parseInt(eValue.split("to")[0]);
        let rowTwo = parseInt(eValue.split("to")[1]);
        elementaryRowSwap(rowOne, rowTwo);
      } else if (eType == "C") {
        let rowConst = parseFloat(eValue.split("x")[0]);
        let rowOne = parseInt(eValue.split("x")[1]);
        elementaryRowConst(rowConst, rowOne);
      } else if (eType == "A") {
        let rowConst = parseFloat(eValue.split("to")[0].split("x")[0]);
        let rowOne = parseInt(eValue.split("to")[0].split("x")[1]);
        let rowTwo = parseInt(eValue.split("to")[1]);
        elementaryRowAdd(rowConst, rowOne, rowTwo);
      }
    }
    roundMatrix(4);
  };

  const multiplyWith = function (matrix) {
    const otherMatrix = matrix.getFullMatrix();

    const multipliedNums = [];
    multipliedNums.length = 0;
    let numIndex = 0;

    const formerHeight = fullMatrix.length;
    const formerWidth = fullMatrix[0].length;
    const latterHeight = otherMatrix.length;
    const latterWidth = otherMatrix[0].length;

    if (formerWidth != latterHeight) {
      multipliedNums[0] = 0;
      const multipliedMatrix = new Matrix(1, 1, multipliedNums);
      return multipliedMatrix;
    } else {
      for (let rowIndex = 0; rowIndex < formerHeight; rowIndex++) {
        for (let colIndex = 0; colIndex < latterWidth; colIndex++) {
          let posValue = 0;
          for (let posIndex = 0; posIndex < formerWidth; posIndex++) {
            posValue +=
              fullMatrix[rowIndex][posIndex] * otherMatrix[posIndex][colIndex];
          }
          multipliedNums[numIndex] = posValue;
          numIndex++;
        }
      }
      const multipliedMatrix = new Matrix(
        formerHeight,
        latterWidth,
        multipliedNums
      );
      return multipliedMatrix;
    }
  };

  return {
    getRowCount,
    getColCount,
    getFullMatrix,
    matrixToString,
    elementaryRowSwap,
    elementaryRowConst,
    elementaryRowAdd,
    reducedRowEchelon,
    augmentedCalculations,
    multiplyWith,
  };
};

const clearTableTRs = (table) => {
  const tableTRs = table.querySelectorAll("tr");
  tableTRs.forEach((tableRow) => {
    tableRow.remove();
  });
};

const setupMatrixInputTables = (
  matrixOneRows,
  matrixOneCols,
  matrixTwoRows,
  matrixTwoCols
) => {
  const matrixTableOne = document.getElementById("matrix-one-input");
  const matrixTableTwo = document.getElementById("matrix-two-input");
  clearTableTRs(matrixTableOne);
  clearTableTRs(matrixTableTwo);

  for (let rowIndex = 0; rowIndex < matrixOneRows; rowIndex++) {
    let currentRow = document.createElement("tr");
    for (let colIndex = 0; colIndex < matrixOneCols; colIndex++) {
      let currentCol = document.createElement("td");
      let currentInput = document.createElement("input");
      let currentIndex = "FM" + colIndex + "x" + rowIndex;
      currentInput.type = "number";
      currentInput.className = "fm-value";
      currentInput.id = currentIndex;
      currentInput.name = currentIndex;
      currentInput.placeholder = "";
      currentInput.required = true;
      currentInput.step = "0.01";
      currentInput.style.setProperty("--column-count", matrixOneCols);
      currentCol.appendChild(currentInput);
      currentRow.appendChild(currentCol);
    }
    matrixTableOne.appendChild(currentRow);
  }

  for (let rowIndex = 0; rowIndex < matrixTwoRows; rowIndex++) {
    let currentRow = document.createElement("tr");
    for (let colIndex = 0; colIndex < matrixTwoCols; colIndex++) {
      let currentCol = document.createElement("td");
      let currentInput = document.createElement("input");
      let currentIndex = "SM" + colIndex + "x" + rowIndex;
      currentInput.type = "number";
      currentInput.className = "sm-value";
      currentInput.id = currentIndex;
      currentInput.name = currentIndex;
      currentInput.placeholder = "";
      currentInput.required = true;
      currentInput.step = "0.01";
      currentInput.style.setProperty("--column-count", matrixTwoCols);
      currentCol.appendChild(currentInput);
      currentRow.appendChild(currentCol);
    }
    matrixTableTwo.appendChild(currentRow);
  }
};

let doRREF = true;
let matrixOneRows = 0;
let matrixOneCols = 0;
let matrixTwoRows = 0;
let matrixTwoCols = 0;
const matrixOneValues = [];
const matrixTwoValues = [];
const setupForm = document.getElementById("setup-form");
setupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  let calculationType = document.querySelector(
    "input[name=matrix-type]:checked"
  ).value;
  if (calculationType == "Augmented Matrix") {
    doRREF = true;
  } else {
    doRREF = false;
  }
  matrixOneRows = document.getElementById("matrix-one-rows").value;
  matrixOneCols = document.getElementById("matrix-one-cols").value;
  matrixTwoRows = document.getElementById("matrix-two-rows").value;
  matrixTwoCols = document.getElementById("matrix-two-cols").value;
  setupMatrixInputTables(
    matrixOneRows,
    matrixOneCols,
    matrixTwoRows,
    matrixTwoCols
  );
});

const matrixForm = document.getElementById("matrix-form");
const matrixResponseTable = document.getElementById("matrix-solution-table");
const matrixAugmentedTable = document.getElementById("matrix-augmented-table");
matrixForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Reset Matrices
  matrixOneValues.length = 0;
  matrixTwoValues.length = 0;
  let matrixOneIndex = 0;
  let matrixTwoIndex = 0;
  clearTableTRs(matrixResponseTable);
  clearTableTRs(matrixAugmentedTable);

  const allFMs = document.querySelectorAll(".fm-value");
  allFMs.forEach((input) => {
    matrixOneValues[matrixOneIndex] = input.value;
    matrixOneIndex++;
  });
  const allSMs = document.querySelectorAll(".sm-value");
  allSMs.forEach((input) => {
    matrixTwoValues[matrixTwoIndex] = input.value;
    matrixTwoIndex++;
  });

  const matrixOne = new Matrix(matrixOneRows, matrixOneCols, matrixOneValues);
  const matrixTwo = new Matrix(matrixTwoRows, matrixTwoCols, matrixTwoValues);
  if (doRREF) {
    let eString = matrixOne.reducedRowEchelon();
    console.log(eString);
    matrixTwo.augmentedCalculations(eString);
    let fullMatrixOne = matrixOne.getFullMatrix();
    let fullMatrixTwo = matrixTwo.getFullMatrix();

    matrixAugmentedTable.style.display = "block";
    for (
      let matrixRowIndex = 0;
      matrixRowIndex < matrixOne.getRowCount();
      matrixRowIndex++
    ) {
      let currentTableOneRow = document.createElement("tr");
      for (
        let matrixOneColIndex = 0;
        matrixOneColIndex < matrixOne.getColCount();
        matrixOneColIndex++
      ) {
        let currentTableOneData = document.createElement("td");
        currentTableOneData.innerHTML =
          fullMatrixOne[matrixRowIndex][matrixOneColIndex];
        currentTableOneData.className = "fm-value";
        currentTableOneData.style.setProperty(
          "--column-count",
          matrixOne.getColCount()
        );
        currentTableOneRow.appendChild(currentTableOneData);
      }
      matrixResponseTable.appendChild(currentTableOneRow);
      let currentTableTwoRow = document.createElement("tr");
      for (
        let matrixTwoColIndex = 0;
        matrixTwoColIndex < matrixTwo.getColCount();
        matrixTwoColIndex++
      ) {
        let currentTableTwoData = document.createElement("td");
        currentTableTwoData.innerHTML =
          fullMatrixTwo[matrixRowIndex][matrixTwoColIndex];
        currentTableTwoData.className = "sm-value";
        currentTableTwoData.style.setProperty(
          "--column-count",
          matrixTwo.getColCount()
        );
        currentTableTwoRow.appendChild(currentTableTwoData);
      }
      matrixAugmentedTable.appendChild(currentTableTwoRow);
    }
  } else {
    const multipliedMatrix = matrixOne.multiplyWith(matrixTwo);
    let fullMatrix = multipliedMatrix.getFullMatrix();

    matrixAugmentedTable.style.display = "none";
    for (
      let matrixRowIndex = 0;
      matrixRowIndex < multipliedMatrix.getRowCount();
      matrixRowIndex++
    ) {
      let currentTableOneRow = document.createElement("tr");
      for (
        let matrixOneColIndex = 0;
        matrixOneColIndex < multipliedMatrix.getColCount();
        matrixOneColIndex++
      ) {
        let currentTableOneData = document.createElement("td");
        currentTableOneData.innerHTML =
          fullMatrix[matrixRowIndex][matrixOneColIndex];
        currentTableOneData.className = "fm-value";
        currentTableOneData.style.setProperty(
          "--column-count",
          matrixOne.getColCount()
        );
        currentTableOneRow.appendChild(currentTableOneData);
      }
      matrixResponseTable.appendChild(currentTableOneRow);
    }
  }
});
