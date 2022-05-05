// Focus div based on nav button click
function focusDiv(divname) {
    // Set active element(s) to be hidden
    var activeDivsCollection = document.getElementsByClassName("active");
    var activeDivsArr = Array.from(activeDivsCollection)
    activeDivsArr.forEach(function (currentdiv) {
        currentdiv.setAttribute("class", "hidden");
    })

    // Set the div to focus on to be active
    document.getElementById(divname).setAttribute("class", "active");
}

// Flip one coin and show coin image to match result when button clicked
function flipCoin() {
    fetch('http://localhost:5000/app/flip/')
        .then(function (response) {
            return response.json();
        })
        .then(function (result) {
            console.log(result);
            document.getElementById("flipResult").innerHTML = result.flip;
            document.getElementById("quarter").setAttribute("src", "assets/img/" + result.flip + ".png");
        })
}

// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series
function flipCoins() {
    // retrieve number of coins to flip
    numberCoins = document.getElementById("numberCoins").value;

    fetch('http://localhost:5000/app/flips/coins', {
        body: JSON.stringify({
            "number": numberCoins
        }),
        headers: {
            "Content-Type": "application/json",
        },
        method: "post"
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (result) {
            console.log(result);

            // Put summary results into the summary table.
            document.getElementById("summaryHeads").innerHTML = result.summary.heads;
            document.getElementById("summaryTails").innerHTML = result.summary.tails;

            // Graphically display all results in the details table.
            var detailsTableBody = document.getElementById("details");
            for (var i = 0; i < result.raw.length; i++) {
                // Create a new row.
                var currentRow = document.createElement("tr");

                // Add the flip number to the table row.
                var currNumber = document.createElement("td");
                currNumber.innerHTML = i + 1;
                currentRow.appendChild(currNumber);

                // Add the flip result to the table row.
                var currResult = document.createElement("td");
                currResult.innerHTML = result.raw[i];
                currentRow.appendChild(currResult);

                // Add the flip number to the table row.
                var currImageCell = document.createElement("td");
                var currImageActual = document.createElement("img");
                currImageActual.setAttribute("src", "assets/img/" + result.raw[i] + ".png");
                currImageActual.setAttribute("class", "smallcoin");
                currImageCell.appendChild(currImageActual);
                currentRow.appendChild(currImageCell);

                // Append the current row to the table body.
                detailsTableBody.appendChild(currentRow);
            }

            // Show results
            document.getElementById("resultTables").setAttribute("class", "active");
        })
}

// Guess a flip by clicking either heads or tails button
function guessFlip(guess) {
    console.log(guess);
    fetch('http://localhost:5000/app/flip/call', {
        body: JSON.stringify({
            "guess": guess
        }),
        headers: {
            "Content-Type": "application/json",
        },
        method: "post"
    })
        .then(function (response) {
            return response.json();
        })
        .then(function (result) {
            console.log(result);

            // Display the pick (text and image).
            document.getElementById("guessPickText").innerHTML = result.call;
            document.getElementById("guessPickImage").setAttribute("src", "assets/img/" + result.call + ".png")

            // Display the actual result (text and image).
            document.getElementById("guessActualResultText").innerHTML = result.flip;
            document.getElementById("guessActualResultImage").setAttribute("src", "assets/img/" + result.flip + ".png");

            // Display if the person using the site won or lost.
            document.getElementById("guessWinOrLoss").innerHTML = "You " + result.result + ".";
        })
}