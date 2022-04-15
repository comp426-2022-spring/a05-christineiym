// Focus div based on nav button click
function focusDiv(divname) {
    // set active element(s) to be hidden
    var activeDivsCollection = document.getElementsByClassName("active");
    var activeDivsArr = Array.from(activeDivsCollection)
    activeDivsArr.forEach(function (currentdiv) {
        currentdiv.setAttribute("class", "hidden");
    })

    // set the div to focus on to be active
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
            document.getElementById("summaryHeads").innerHTML = result.summary.heads;
            document.getElementById("summaryTails").innerHTML = result.summary.tails;
            // document.getElementById("quarter").setAttribute("src", "assets/img/" + result.flip + ".png");

            // Show results
            document.getElementById("resultTables").setAttribute("class", "active");
        })
}

// Guess a flip by clicking either heads or tails button
