(function(){
"use strict";

const configurations={
speed:["Distance (km)","Time (hours)"],
distance:["Speed (km/h)","Time (hours)"],
time:["Distance (km)","Speed (km/h)"],
kmToMs:["Speed (km/h)"],
msToKm:["Speed (m/s)"],
averageEqual:["First speed (km/h)","Second speed (km/h)"],
relativeSame:["First speed","Second speed"],
relativeOpposite:["First speed","Second speed"],
meeting:["Initial distance (km)","First speed (km/h)","Second speed (km/h)"],
trainPole:["Train length (m)","Train speed (km/h)"],
trainPlatform:["Train length (m)","Platform length (m)","Train speed (km/h)"],
boatDownstream:["Boat speed in still water","Stream speed"],
boatUpstream:["Boat speed in still water","Stream speed"]
};

function round(value){
    return String(Math.round((value+Number.EPSILON)*1000000)/1000000);
}

function hideResult(message){
    const result=document.getElementById("tsdResult");
    const status=document.getElementById("tsdMessage");

    result.hidden=true;
    status.hidden=false;
    status.textContent=message||
        "Values are ready. Click Calculate to display the result.";
}

function configureFields(){
    const mode=document.getElementById("tsdMode").value;
    const labels=configurations[mode];

    ["A","B","C"].forEach(function(letter,index){
        const field=document.getElementById("tsdField"+letter);
        field.hidden=index>=labels.length;

        if(index<labels.length){
            document.getElementById("tsdLabel"+letter).textContent=
                labels[index];
        }
    });

    hideResult();
}

function showResult(title,number,formula,explanation){
    document.getElementById("tsdResultTitle").textContent=title;
    document.getElementById("tsdResultNumber").textContent=number;
    document.getElementById("tsdResultFormula").textContent=formula;
    document.getElementById("tsdResultExplanation").textContent=
        explanation;

    document.getElementById("tsdMessage").hidden=true;
    document.getElementById("tsdResult").hidden=false;
}

function calculate(){
    const mode=document.getElementById("tsdMode").value;

    const values=["A","B","C"].map(function(letter){
        return Number(document.getElementById("tsdValue"+letter).value);
    });

    const active=values.slice(0,configurations[mode].length);

    if(active.some(function(value){
        return !Number.isFinite(value)||value<0;
    })){
        hideResult("Enter valid non-negative values.");
        return;
    }

    const a=values[0];
    const b=values[1];
    const c=values[2];

    let value;

    if(mode==="speed"){
        if(b<=0){
            hideResult("Time must be greater than 0.");
            return;
        }

        value=a/b;

        showResult(
            "Speed",
            round(value)+" km/h",
            round(a)+" ÷ "+round(b)+" = "+round(value),
            "Distance was divided by travel time."
        );

    }else if(mode==="distance"){
        value=a*b;

        showResult(
            "Distance",
            round(value)+" km",
            round(a)+" × "+round(b)+" = "+round(value),
            "Speed was multiplied by travel time."
        );

    }else if(mode==="time"){
        if(b<=0){
            hideResult("Speed must be greater than 0.");
            return;
        }

        value=a/b;

        showResult(
            "Travel Time",
            round(value)+" hours",
            round(a)+" ÷ "+round(b)+" = "+round(value),
            "Distance was divided by speed."
        );

    }else if(mode==="kmToMs"){
        value=a*5/18;

        showResult(
            "Converted Speed",
            round(value)+" m/s",
            round(a)+" × 5/18 = "+round(value),
            "Kilometres per hour were converted to metres per second."
        );

    }else if(mode==="msToKm"){
        value=a*18/5;

        showResult(
            "Converted Speed",
            round(value)+" km/h",
            round(a)+" × 18/5 = "+round(value),
            "Metres per second were converted to kilometres per hour."
        );

    }else if(mode==="averageEqual"){
        if(a<=0||b<=0){
            hideResult("Both speeds must be greater than 0.");
            return;
        }

        value=2*a*b/(a+b);

        showResult(
            "Average Speed",
            round(value)+" km/h",
            "2 × "+round(a)+" × "+round(b)+
                " ÷ ("+round(a)+" + "+round(b)+") = "+round(value),
            "The harmonic-mean formula applies because the distances are equal."
        );

    }else if(mode==="relativeSame"){
        value=Math.abs(a-b);

        showResult(
            "Relative Speed",
            round(value),
            "|"+round(a)+" − "+round(b)+"| = "+round(value),
            "For the same direction, subtract the speeds."
        );

    }else if(mode==="relativeOpposite"){
        value=a+b;

        showResult(
            "Relative Speed",
            round(value),
            round(a)+" + "+round(b)+" = "+round(value),
            "For opposite directions, add the speeds."
        );

    }else if(mode==="meeting"){
        if(b+c<=0){
            hideResult(
                "At least one moving speed must be greater than 0."
            );
            return;
        }

        value=a/(b+c);

        showResult(
            "Meeting Time",
            round(value)+" hours",
            round(a)+" ÷ ("+round(b)+" + "+round(c)+") = "+round(value),
            "The objects move toward each other, so their speeds were added."
        );

    }else if(mode==="trainPole"){
        if(b<=0){
            hideResult("Train speed must be greater than 0.");
            return;
        }

        const speedMs=b*5/18;
        value=a/speedMs;

        showResult(
            "Pole-Crossing Time",
            round(value)+" seconds",
            round(a)+" ÷ ("+round(b)+" × 5/18) = "+round(value),
            "The train covers its own length at speed measured in m/s."
        );

    }else if(mode==="trainPlatform"){
        if(c<=0){
            hideResult("Train speed must be greater than 0.");
            return;
        }

        const speedMs=c*5/18;
        value=(a+b)/speedMs;

        showResult(
            "Platform-Crossing Time",
            round(value)+" seconds",
            "("+round(a)+" + "+round(b)+") ÷ ("+
                round(c)+" × 5/18) = "+round(value),
            "The train covers the sum of train and platform lengths."
        );

    }else if(mode==="boatDownstream"){
        value=a+b;

        showResult(
            "Downstream Speed",
            round(value)+" km/h",
            round(a)+" + "+round(b)+" = "+round(value),
            "The stream assists the boat, so speeds were added."
        );

    }else{
        if(a<=b){
            hideResult(
                "Boat speed in still water must exceed stream speed."
            );
            return;
        }

        value=a-b;

        showResult(
            "Upstream Speed",
            round(value)+" km/h",
            round(a)+" − "+round(b)+" = "+round(value),
            "The stream opposes the boat, so its speed was subtracted."
        );
    }
}

function configureSolutions(){
    document.querySelectorAll(".solution-toggle").forEach(
        function(button){
            button.addEventListener("click",function(){
                const answer=document.getElementById(
                    button.dataset.target
                );

                const opening=answer.hidden;

                answer.hidden=!opening;
                button.textContent=
                    opening?"Hide Solution":"Show Solution";

                button.setAttribute(
                    "aria-expanded",
                    String(opening)
                );
            });
        }
    );
}

document.addEventListener("DOMContentLoaded",function(){
    const mode=document.getElementById("tsdMode");

    mode.addEventListener("change",configureFields);

    document
        .getElementById("calculateTsdButton")
        .addEventListener("click",calculate);

    ["A","B","C"].forEach(function(letter){
        document
            .getElementById("tsdValue"+letter)
            .addEventListener("input",function(){
                hideResult();
            });
    });

    document.querySelectorAll(".example-button").forEach(
        function(button){
            button.addEventListener("click",function(){
                mode.value=button.dataset.mode;
                configureFields();

                ["a","b","c"].forEach(function(letter){
                    document.getElementById(
                        "tsdValue"+letter.toUpperCase()
                    ).value=button.dataset[letter]||"";
                });

                hideResult(
                    "Example loaded. Click Calculate to display the result."
                );
            });
        }
    );

    configureSolutions();
    configureFields();

    document.getElementById("tsdMessage").textContent=
        "Select a calculation or example, then click Calculate.";
});
}());
