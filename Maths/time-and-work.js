(function(){
"use strict";

const configurations={
individual:["Completion time (days)","Days worked"],
combined:["A's completion time","B's completion time"],
findPartner:["Together completion time","A's completion time"],
efficiency:["Efficiency of A","Efficiency of B","A's completion time"],
workers:["Original workers","Original days","Original hours/day","New workers","New hours/day"],
wages:["A's work share","B's work share","Total wages"],
pipes:["Inlet filling time","Outlet emptying time"],
joinLeave:["A's completion time","B's completion time","Days A works alone"]
};

function round(value){
    return String(Math.round((value+Number.EPSILON)*1000000)/1000000);
}

function hideResult(message){
    const result=document.getElementById("twResult");
    const status=document.getElementById("twMessage");

    result.hidden=true;
    status.hidden=false;
    status.textContent=message||
        "Values are ready. Click Calculate to display the result.";
}

function configureFields(){
    const mode=document.getElementById("twMode").value;
    const labels=configurations[mode];

    ["A","B","C","D","E"].forEach(function(letter,index){
        const field=document.getElementById("twField"+letter);
        field.hidden=index>=labels.length;

        if(index<labels.length){
            document.getElementById("twLabel"+letter).textContent=labels[index];
        }
    });

    hideResult();
}

function showResult(title,number,formula,explanation){
    document.getElementById("twResultTitle").textContent=title;
    document.getElementById("twResultNumber").textContent=number;
    document.getElementById("twResultFormula").textContent=formula;
    document.getElementById("twResultExplanation").textContent=explanation;
    document.getElementById("twMessage").hidden=true;
    document.getElementById("twResult").hidden=false;
}

function calculate(){
    const mode=document.getElementById("twMode").value;

    const values=["A","B","C","D","E"].map(function(letter){
        return Number(document.getElementById("twValue"+letter).value);
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
    const d=values[3];
    const e=values[4];

    let rate,time,shareA,shareB;

    if(mode==="individual"){
        if(a<=0){
            hideResult("Completion time must be greater than 0.");
            return;
        }

        const work=b/a;

        showResult(
            "Work Completed",
            round(work)+" of the job",
            round(b)+" ÷ "+round(a)+" = "+round(work),
            work<1
                ?"The remaining work is "+round(1-work)+" of the job."
                :work===1
                    ?"The complete job is finished."
                    :"The entered duration represents more than one complete job."
        );

    }else if(mode==="combined"){
        if(a<=0||b<=0){
            hideResult("Both completion times must be greater than 0.");
            return;
        }

        rate=1/a+1/b;
        time=1/rate;

        showResult(
            "Combined Completion Time",
            round(time)+" days",
            "1 ÷ (1/"+round(a)+" + 1/"+round(b)+") = "+round(time),
            "The individual work rates were added before finding time."
        );

    }else if(mode==="findPartner"){
        if(a<=0||b<=0||a>=b){
            hideResult(
                "Together time must be positive and less than A's individual time."
            );
            return;
        }

        rate=1/a-1/b;
        time=1/rate;

        showResult(
            "Partner's Completion Time",
            round(time)+" days",
            "1 ÷ (1/"+round(a)+" − 1/"+round(b)+") = "+round(time),
            "The known worker's rate was subtracted from the combined rate."
        );

    }else if(mode==="efficiency"){
        if(a<=0||b<=0||c<=0){
            hideResult(
                "Efficiencies and completion time must be greater than 0."
            );
            return;
        }

        time=c*a/b;

        showResult(
            "B's Completion Time",
            round(time)+" days",
            round(c)+" × "+round(a)+" ÷ "+round(b)+" = "+round(time),
            "Completion time is inversely proportional to efficiency."
        );

    }else if(mode==="workers"){
        if(active.some(function(value){return value<=0;})){
            hideResult(
                "All workers, days and hours values must be greater than 0."
            );
            return;
        }

        time=a*b*c/(d*e);

        showResult(
            "Required Days",
            round(time)+" days",
            round(a)+" × "+round(b)+" × "+round(c)+
                " ÷ ("+round(d)+" × "+round(e)+") = "+round(time),
            "Total worker-hours were kept constant."
        );

    }else if(mode==="wages"){
        if(a<0||b<0||c<0||a+b<=0){
            hideResult(
                "Work shares must have a positive total and wages cannot be negative."
            );
            return;
        }

        shareA=c*a/(a+b);
        shareB=c*b/(a+b);

        showResult(
            "Wage Distribution",
            "A: ₹"+round(shareA)+" | B: ₹"+round(shareB),
            "₹"+round(c)+" divided in the ratio "+round(a)+":"+round(b),
            "Wages were divided according to the work-share ratio."
        );

    }else if(mode==="pipes"){
        if(a<=0||b<=0){
            hideResult("Both pipe times must be greater than 0.");
            return;
        }

        rate=1/a-1/b;

        if(rate<=0){
            hideResult(
                "The outlet rate must be smaller than the inlet rate for the tank to fill."
            );
            return;
        }

        time=1/rate;

        showResult(
            "Net Filling Time",
            round(time)+" hours",
            "1 ÷ (1/"+round(a)+" − 1/"+round(b)+") = "+round(time),
            "The outlet rate was subtracted from the inlet rate."
        );

    }else{
        if(a<=0||b<=0||c<0||c>=a){
            hideResult(
                "Times must be positive, and A must work alone for less than A's total completion time."
            );
            return;
        }

        const completed=c/a;
        const remaining=1-completed;

        rate=1/a+1/b;
        time=c+remaining/rate;

        showResult(
            "Total Completion Time",
            round(time)+" days",
            round(c)+" + ("+round(remaining)+" ÷ "+round(rate)+") = "+round(time),
            "A's initial work was removed first; the remaining work was completed at the combined rate."
        );
    }
}

function configureSolutions(){
    document.querySelectorAll(".solution-toggle").forEach(function(button){
        button.addEventListener("click",function(){
            const answer=document.getElementById(button.dataset.target);
            const opening=answer.hidden;

            answer.hidden=!opening;
            button.textContent=opening?"Hide Solution":"Show Solution";
            button.setAttribute("aria-expanded",String(opening));
        });
    });
}

document.addEventListener("DOMContentLoaded",function(){
    const mode=document.getElementById("twMode");

    mode.addEventListener("change",configureFields);

    document
        .getElementById("calculateTwButton")
        .addEventListener("click",calculate);

    ["A","B","C","D","E"].forEach(function(letter){
        document
            .getElementById("twValue"+letter)
            .addEventListener("input",function(){
                hideResult();
            });
    });

    document.querySelectorAll(".example-button").forEach(function(button){
        button.addEventListener("click",function(){
            mode.value=button.dataset.mode;
            configureFields();

            ["a","b","c","d","e"].forEach(function(letter){
                document.getElementById(
                    "twValue"+letter.toUpperCase()
                ).value=button.dataset[letter]||"";
            });

            hideResult(
                "Example loaded. Click Calculate to display the result."
            );
        });
    });

    configureSolutions();
    configureFields();

    document.getElementById("twMessage").textContent=
        "Select a calculation or example, then click Calculate.";
});
}());
